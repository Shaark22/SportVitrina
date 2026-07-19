import { writeFileSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const STORE_PATH = join(__dirname, '..', 'server', 'data', 'store.json')

const CATEGORY_CATALOG = {
  'swedish-walls': {
    name: 'Шведские стенки',
    description:
      'Многофункциональные шведские стенки и спортивные комплексы для дома.',
    image:
      'https://images.unsplash.com/photo-1599058917765-a780eda07a36?w=800&h=800&fit=crop&q=80&bg=ffffff',
  },
  'pull-up-bars': {
    name: 'Турники',
    description: 'Настенные турники для подтягиваний и функциональных тренировок.',
    image:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=800&fit=crop&q=80&bg=ffffff',
  },
  'complexes-3in1': {
    name: 'Комплексы 3-в-1',
    description: 'Турник, брусья и упор для пресса в одной конструкции.',
    image:
      'https://images.unsplash.com/photo-1599058917215-d3deb456ba7e?w=800&h=800&fit=crop&q=80&bg=ffffff',
  },
  'parallel-bars': {
    name: 'Брусья',
    description: 'Брусья для отжиманий и работы с собственным весом.',
    image:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=800&fit=crop&q=80&bg=ffffff',
  },
  skami: {
    name: 'Скамьи',
    description: 'Скамьи для жима, пресса и силовых тренировок.',
    image:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=800&fit=crop&q=80&bg=ffffff',
  },
  supports: {
    name: 'Упоры',
    description: 'Упоры для пресса и силовых упражнений.',
    image:
      'https://images.unsplash.com/photo-1583454110551-21f2efe2fd61?w=800&h=800&fit=crop&q=80&bg=ffffff',
  },
  accessories: {
    name: 'Аксессуары',
    description: 'Кольца, тарзанки, канаты и навесное оборудование.',
    image:
      'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&h=800&fit=crop&q=80&bg=ffffff',
  },
}

export function mapProductCategory(name, kaspiCategories = []) {
  const source = `${name} ${kaspiCategories.join(' ')}`.toLowerCase()

  if (source.includes('упор')) return 'supports'
  if (source.includes('скам')) return 'skami'
  if (
    source.includes('кольц') ||
    source.includes('тарзан') ||
    source.includes('канат') ||
    source.includes('мешок')
  )
    return 'accessories'
  if (source.includes('брусь') && !source.includes('3') && !source.includes('3в'))
    return 'parallel-bars'
  if (
    /3\s*в\s*1|3в1|комплект\s*2\s*в\s*1|комплект\s*5|5в1|атлант.*3|3.*атлант/i.test(
      name,
    )
  )
    return 'complexes-3in1'
  if (source.includes('турник') && !/m-10|m-11|швед|стенк|комплекс/i.test(source))
    return 'pull-up-bars'
  if (
    source.includes('швед') ||
    /m-10|m-11|люкс|лайт|prosport|атлет|игровой комплекс|00-00000175|настенный/i.test(
      source,
    )
  )
    return 'swedish-walls'
  if (source.includes('турник')) return 'complexes-3in1'
  return 'accessories'
}

export function buildCategories(products) {
  const map = new Map()

  for (const product of products) {
    const meta = CATEGORY_CATALOG[product.category]
    if (!meta) continue

    if (!map.has(product.category)) {
      map.set(product.category, {
        id: product.category,
        slug: product.category,
        name: meta.name,
        description: meta.description,
        image: product.image || meta.image,
        priceFrom: product.price,
      })
    } else {
      const cat = map.get(product.category)
      cat.priceFrom = Math.min(cat.priceFrom, product.price)
      if (!cat.image?.includes('cdn-kaspi') && product.image?.includes('cdn-kaspi')) {
        cat.image = product.image
      }
    }
  }

  for (const [slug, meta] of Object.entries(CATEGORY_CATALOG)) {
    if (!map.has(slug)) continue
    const cat = map.get(slug)
    cat.name = meta.name
    cat.description = meta.description
    if (!cat.image?.includes('cdn-kaspi')) cat.image = meta.image
  }

  const order = [
    'swedish-walls',
    'complexes-3in1',
    'pull-up-bars',
    'parallel-bars',
    'skami',
    'supports',
    'accessories',
  ]
  return order.filter((s) => map.has(s)).map((s) => map.get(s))
}

if (process.argv[1]?.includes('category-utils')) {
  const store = JSON.parse(readFileSync(STORE_PATH, 'utf8'))
  for (const product of store.products) {
    product.category = mapProductCategory(
      product.name,
      product.kaspiCategories ?? [],
    )
  }
  store.categories = buildCategories(store.products)
  writeFileSync(STORE_PATH, JSON.stringify(store, null, 2))
  console.log('Recategorized', store.products.length, 'products')
  console.log('Categories:', store.categories.map((c) => c.name).join(', '))
}
