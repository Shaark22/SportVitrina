import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const imageUrls = {
  swedishWall:
    'https://images.unsplash.com/photo-1599058917765-a780eda07a36?w=800&h=800&fit=crop&q=80',
  pullUpBar:
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=800&fit=crop&q=80',
  parallelBars:
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=800&fit=crop&q=80',
  crossbar:
    'https://images.unsplash.com/photo-1583454110551-21f2efe2fd61?w=800&h=800&fit=crop&q=80',
  complex3in1:
    'https://images.unsplash.com/photo-1599058917215-d3deb456ba7e?w=800&h=800&fit=crop&q=80',
  accessories:
    'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&h=800&fit=crop&q=80',
  product:
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=800&fit=crop&q=80',
  hero: '/images/hero-main.png',
}

const categorySlugToImage = {
  'swedish-walls': imageUrls.swedishWall,
  'pull-up-bars': imageUrls.pullUpBar,
  'parallel-bars': imageUrls.parallelBars,
  crossbars: imageUrls.crossbar,
  'complexes-3in1': imageUrls.complex3in1,
  accessories: imageUrls.accessories,
}

function extractArray(tsSource, exportName) {
  const marker = `export const ${exportName}`
  const start = tsSource.indexOf(marker)
  if (start === -1) throw new Error(`Missing ${exportName}`)
  const arrayStart = tsSource.indexOf('= [', start) + 2
  let body = ''
  let depth = 0
  let end = arrayStart
  let inString = false
  let stringChar = ''

  for (let i = arrayStart; i < tsSource.length; i++) {
    const ch = tsSource[i]
    const prev = tsSource[i - 1]

    if (!inString && (ch === '"' || ch === "'")) {
      inString = true
      stringChar = ch
    } else if (inString) {
      if (ch === stringChar && prev !== '\\') inString = false
    } else {
      if (ch === '[') depth++
      if (ch === ']') {
        depth--
        if (depth === 0) {
          end = i + 1
          break
        }
      }
    }
  }

  body = tsSource.slice(arrayStart, end)

  for (const [key, url] of Object.entries(imageUrls)) {
    body = body.replaceAll(`placeholderImages.${key}`, JSON.stringify(url))
  }

  body = body.replace(/getCategoryImage\(\s*'([^']+)'\s*\)/g, (_, slug) =>
    JSON.stringify(categorySlugToImage[slug] ?? imageUrls.product),
  )

  return new Function(`return ${body}`)()
}

const productsSrc = readFileSync(join(root, 'src/data/products.ts'), 'utf8')
const categoriesSrc = readFileSync(join(root, 'src/data/categories.ts'), 'utf8')

const store = {
  version: 2,
  products: extractArray(productsSrc, 'defaultProducts'),
  categories: extractArray(categoriesSrc, 'defaultCategories'),
  reviews: [],
}

const outDir = join(root, 'server/data')
mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'store.json'), JSON.stringify(store, null, 2))
console.log(`Seeded ${store.products.length} products, ${store.categories.length} categories`)
