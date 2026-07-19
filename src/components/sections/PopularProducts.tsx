import { useData } from '../../context/DataContext'
import { ProductCard } from '../ui/ProductCard'
import { ProductGrid } from '../ui/ProductGrid'
import { SectionTitle } from '../ui/SectionTitle'
import { ButtonLink } from '../ui/Button'

export function PopularProducts() {
  const { getPopularProducts } = useData()
  const popular = getPopularProducts(6)

  return (
    <section className="bg-surface py-12 md:py-24">
      <div className="site-container">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionTitle title="Популярные товары" />
          <ButtonLink to="/catalog" variant="outline" className="w-full shrink-0 sm:w-auto">
            Весь каталог
          </ButtonLink>
        </div>
        <ProductGrid className="mt-8">
          {popular.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductGrid>
      </div>
    </section>
  )
}
