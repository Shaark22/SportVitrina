import { useMemo } from 'react'
import { useData } from '../../context/DataContext'
import {
  getCategoriesWithProducts,
  getCategoryProductCounts,
} from '../../utils/categoryCounts'
import { CategoryCard } from '../ui/CategoryCard'
import { CategoryGrid } from '../ui/CategoryGrid'
import { SectionTitle } from '../ui/SectionTitle'

export function Categories() {
  const { categories, products } = useData()

  const counts = useMemo(() => getCategoryProductCounts(products), [products])

  const visibleCategories = useMemo(
    () => getCategoriesWithProducts(categories, products),
    [categories, products],
  )

  return (
    <section className="bg-background py-12 md:py-24">
      <div className="site-container">
        <SectionTitle title="Категории" />
        <CategoryGrid className="mt-8">
          {visibleCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              productCount={counts.get(category.slug)}
            />
          ))}
        </CategoryGrid>
      </div>
    </section>
  )
}
