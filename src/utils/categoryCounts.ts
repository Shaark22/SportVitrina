import type { Category } from '../types/category'
import type { Product } from '../types/product'

export function getCategoryProductCounts(products: Product[]): Map<string, number> {
  const map = new Map<string, number>()
  for (const product of products) {
    map.set(product.category, (map.get(product.category) ?? 0) + 1)
  }
  return map
}

export function getCategoriesWithProducts(
  categories: Category[],
  products: Product[],
): Category[] {
  const counts = getCategoryProductCounts(products)
  return categories.filter((category) => (counts.get(category.slug) ?? 0) > 0)
}
