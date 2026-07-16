import { useData } from '../../context/DataContext'
import { CategoryCard } from '../ui/CategoryCard'
import { SectionTitle } from '../ui/SectionTitle'

export function Categories() {
  const { categories } = useData()

  return (
    <section className="bg-background py-12 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle title="Категории" />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  )
}
