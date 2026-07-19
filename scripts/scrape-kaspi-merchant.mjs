import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'
import { buildCategories, mapProductCategory } from './category-utils.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const STORE_PATH = join(ROOT, 'server', 'data', 'store.json')
const MERCHANT_ID = '444052'
const CITY = '750000000'
const FULL_MODE = process.argv.includes('--full')

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function slugify(text) {
  const map = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z',
    и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
    с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch',
    ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
  }
  return text
    .toLowerCase()
    .split('')
    .map((c) => map[c] ?? c)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70)
}

function parsePrice(text) {
  const digits = text.replace(/[^\d]/g, '')
  return digits ? Number(digits) : 0
}

function parseKaspiDate(text) {
  const m = text.match(/(\d{2})\.(\d{2})\.(\d{4})/)
  if (!m) return new Date().toISOString().slice(0, 10)
  return `${m[3]}-${m[2]}-${m[1]}`
}

function kaspiSkuFromUrl(url) {
  const m = url.match(/--(\d+)/) || url.match(/-(\d{6,})(?:\/|$|\?)/)
  return m?.[1] ?? null
}

function cleanDescription(text) {
  return text
    .replace(/Код товара:\s*\d+/gi, '')
    .replace(/\(\d+\s*отзыв[^)]*\)/gi, '')
    .replace(/Цена[\s\S]*?Kaspi\.kz/gi, '')
    .replace(/Открыть в приложении Kaspi\.kz/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

async function dismissCityModal(page) {
  try {
    const clicked = await page.evaluate(() => {
      const cityLink = Array.from(document.querySelectorAll('a')).find(
        (a) => a.textContent?.trim() === 'Алматы',
      )
      if (!cityLink) return false
      cityLink.click()
      return true
    })
    if (clicked) await sleep(2000)
  } catch {
    /* ignore */
  }
}

async function collectAllCatalogCards(page) {
  await page.goto(`https://kaspi.kz/shop/search/?q=:allMerchants:${MERCHANT_ID}&c=${CITY}`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  })
  await sleep(2000)
  await dismissCityModal(page)

  const byId = new Map()
  for (let p = 0; p < 10; p++) {
    console.log(`Catalog API page ${p + 1}`)
    const batch = await page.evaluate(async (num) => {
      const url = `https://kaspi.kz/yml/product-view/pl/results?q=${encodeURIComponent(':allMerchants:444052')}&c=750000000&page=${num}`
      const res = await fetch(url)
      if (!res.ok) return []
      const json = await res.json()
      return Array.isArray(json.data) ? json.data : json.data?.cards ?? []
    }, p)

    console.log(`  found ${batch.length} products`)
    if (!batch.length) break
    for (const card of batch) {
      if (card?.id) byId.set(String(card.id), card)
    }
  }
  return [...byId.values()]
}

function cardToUrl(card) {
  if (!card.shopLink) return null
  return `https://kaspi.kz/shop${card.shopLink.split('?')[0]}`
}

async function loadAllReviews(page) {
  await page.evaluate(async () => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms))
    for (let i = 0; i < 10; i++) {
      const btn = Array.from(document.querySelectorAll('a, button')).find((el) =>
        /показать ещё/i.test(el.textContent || ''),
      )
      if (!btn) break
      btn.click()
      await wait(1200)
    }
  })
}

async function scrapeProduct(page, url, cardMeta) {
  const productUrl = `${url}?c=${CITY}&m=${MERCHANT_ID}`
  const kaspiSku = String(cardMeta.id)

  await page.goto(productUrl, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await sleep(2500)
  await page.waitForSelector('h1', { timeout: 20000 }).catch(() => {})

  const base = await page.evaluate(() => {
    const name = document.querySelector('h1')?.textContent?.trim() || ''
    const priceText =
      document.querySelector('.item__price-once')?.textContent ||
      document.querySelector('.item__price')?.textContent ||
      ''
    const ratingMatch = document.body.innerText.match(
      /(\d+[.,]\d+|\d+)\s*\((\d+)\s*отзыв/,
    )
    const images = Array.from(document.querySelectorAll('img'))
      .map((img) => img.src || img.getAttribute('data-src'))
      .filter((src) => src && src.includes('cdn-kaspi.kz/img'))
    const uniqueImages = [...new Set(images)]

    const descBlock = Array.from(document.querySelectorAll('h2, h3, div')).find(
      (el) => el.textContent?.trim() === 'Описание',
    )
    let description = ''
    if (descBlock) {
      description =
        descBlock.parentElement?.innerText?.replace(/^Описание\s*/i, '')?.trim() || ''
    }
    if (!description) {
      description =
        document.querySelector('.description')?.innerText?.trim() ||
        document.querySelector('[class*="description"]')?.innerText?.trim() ||
        ''
    }

    const features = []
    document
      .querySelectorAll('.specifications-list__spec, .specifications-list li')
      .forEach((row) => {
        const text = row.textContent?.replace(/\s+/g, ' ').trim()
        if (text && text.length < 200) features.push(text)
      })

    return {
      name,
      priceText,
      rating: ratingMatch ? Number(ratingMatch[1].replace(',', '.')) : 0,
      reviewsCount: ratingMatch ? Number(ratingMatch[2]) : 0,
      images: uniqueImages,
      description,
      features: [...new Set(features)].slice(0, 25),
    }
  })

  await page.goto(`${productUrl}&tab=reviews`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  })
  await sleep(2000)
  await page.waitForSelector('.reviews, .reviews__review', { timeout: 10000 }).catch(
    () => {},
  )
  await loadAllReviews(page)

  const reviews = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.reviews__review')).map((r) => ({
      authorName: r.querySelector('.reviews__author')?.textContent?.trim() || 'Покупатель',
      date: r.querySelector('.reviews__date')?.textContent?.trim() || '',
      text: (r.querySelector('.reviews__review-text')?.textContent || '')
        .replace(/^Комментарий:\s*/i, '')
        .replace(/\d+ человек\(а\) посчитал\(и\) отзыв полезным$/i, '')
        .trim(),
      rating: 5,
    })),
  )

  const name = base.name || cardMeta.title || `SportKing ${kaspiSku}`
  const slug = `${slugify(name)}-${kaspiSku}`
  const id = `kaspi-${kaspiSku}`
  const price =
    parsePrice(base.priceText) ||
    Number(cardMeta.unitSalePrice || cardMeta.unitPrice || 0)
  const kaspiCategories = cardMeta.categoryRu ?? cardMeta.category ?? []
  const category = mapProductCategory(name, kaspiCategories)
  const previewImage =
    cardMeta.previewImages?.[0]?.large ||
    cardMeta.previewImages?.[0]?.medium ||
    base.images[0] ||
    ''

  return {
    product: {
      id,
      name,
      slug,
      category,
      kaspiSku,
      kaspiCategories,
      description: cleanDescription(base.description) || name,
      price,
      oldPrice: price > 0 ? Math.round(price * 1.12 / 100) * 100 : undefined,
      image: previewImage,
      images: base.images.length ? base.images : previewImage ? [previewImage] : [],
      rating:
        base.rating ||
        cardMeta.rating ||
        (reviews.length ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10 : 0),
      reviewsCount: reviews.length || base.reviewsCount || cardMeta.reviewsQuantity || 0,
      features: base.features.length ? base.features : [name],
      kaspiUrl: productUrl,
      inStock: true,
    },
    reviews: reviews.map((r, idx) => ({
      id: `${id}-review-${idx + 1}`,
      productId: id,
      authorName: r.authorName,
      rating: r.rating,
      text: r.text,
      date: parseKaspiDate(r.date),
      source: 'kaspi',
    })),
  }
}

async function main() {
  const edgePath =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: edgePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  )

  const cards = await collectAllCatalogCards(page)
  console.log(`Total unique Kaspi products: ${cards.length}`)
  if (!cards.length) throw new Error('No products found')

  const existingStore = existsSync(STORE_PATH)
    ? JSON.parse(readFileSync(STORE_PATH, 'utf8'))
    : { products: [], reviews: [] }

  const existingBySku = new Map()
  for (const p of existingStore.products ?? []) {
    const sku = p.kaspiSku || kaspiSkuFromUrl(p.kaspiUrl || '')
    if (sku) existingBySku.set(String(sku), p)
  }

  const products = FULL_MODE ? [] : [...(existingStore.products ?? [])]
  const reviews = FULL_MODE ? [] : [...(existingStore.reviews ?? [])]
  const seenIds = new Set(products.map((p) => p.id))

  let i = 0
  for (const card of cards) {
    i += 1
    const url = cardToUrl(card)
    if (!url) continue
    const sku = String(card.id)
    const existing = existingBySku.get(sku)

    if (!FULL_MODE && existing && seenIds.has(existing.id)) {
      console.log(`[${i}/${cards.length}] skip ${sku} (already imported)`)
      continue
    }

    console.log(`[${i}/${cards.length}] ${url}`)
    try {
      const data = await scrapeProduct(page, url, card)

      if (FULL_MODE) {
        products.push(data.product)
        reviews.push(...data.reviews)
      } else if (existing) {
        const idx = products.findIndex((p) => p.id === existing.id)
        const merged = { ...existing, ...data.product, id: existing.id, slug: existing.slug }
        if (idx >= 0) products[idx] = merged
        else products.push(merged)
        reviews.push(
          ...data.reviews.map((r) => ({ ...r, productId: existing.id, id: `${existing.id}-review-${r.id.split('-review-')[1]}` })),
        )
      } else {
        products.push(data.product)
        reviews.push(...data.reviews)
      }

      console.log(
        `  ok: ${data.product.name} | ${data.product.category} | ${data.product.price} ₸ | reviews: ${data.reviews.length}`,
      )
    } catch (err) {
      console.log(`  error: ${err.message}`)
    }
  }

  await browser.close()

  const dedupedReviews = []
  const reviewKeys = new Set()
  for (const r of reviews) {
    const key = `${r.productId}:${r.authorName}:${r.date}:${r.text.slice(0, 40)}`
    if (reviewKeys.has(key)) continue
    reviewKeys.add(key)
    dedupedReviews.push(r)
  }

  for (const product of products) {
    product.category = mapProductCategory(
      product.name,
      product.kaspiCategories ?? [],
    )
  }

  const store = {
    version: 4,
    products,
    categories: buildCategories(products),
    reviews: dedupedReviews,
  }

  writeFileSync(STORE_PATH, JSON.stringify(store, null, 2))
  console.log('\nDone!')
  console.log(`Products: ${products.length}`)
  console.log(`Categories: ${store.categories.length}`)
  store.categories.forEach((c) => console.log(`  - ${c.name} (${c.slug})`))
  console.log(`Reviews: ${dedupedReviews.length}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
