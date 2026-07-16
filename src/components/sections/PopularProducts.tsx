import { useData } from '../../context/DataContext'
import { ProductCard } from '../ui/ProductCard'
import { SectionTitle } from '../ui/SectionTitle'
import { ButtonLink } from '../ui/Button'

export function PopularProducts() {
  const { getPopularProducts } = useData()
  const popular = getPopularProducts(6)

  return (
    <section className="bg-surface py-12 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionTitle title="Популярные товары" />
          <ButtonLink to="/catalog" variant="outline" className="w-full shrink-0 sm:w-auto">
            Весь каталог
          </ButtonLink>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {popular.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
