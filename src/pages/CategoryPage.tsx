import { Link, useParams } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import { useData } from '../context/DataContext'
import { ProductCard } from '../components/ui/ProductCard'

export function CategoryPage() {
  const { slug = '' } = useParams()
  const { getCategoryBySlug, getProductsByCategory } = useData()
  const category = getCategoryBySlug(slug)
  const categoryProducts = getProductsByCategory(slug)

  usePageMeta({
    title: category
      ? `${category.name} — SPORT KING`
      : 'Категория — SPORT KING',
    description:
      category?.description ??
      'Категория спортивного оборудования SPORT KING.',
  })

  if (!category) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-extrabold uppercase text-dark sm:text-3xl">
          Категория не найдена
        </h1>
        <Link
          to="/catalog"
          className="mt-6 inline-block font-semibold text-dark underline decoration-primary underline-offset-4"
        >
          Вернуться в каталог
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-background py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="mb-4 text-xs text-text-secondary sm:mb-6 sm:text-sm" aria-label="Хлебные крошки">
          <Link to="/" className="hover:text-dark">
            Главная
          </Link>
          <span className="mx-2">/</span>
          <Link to="/catalog" className="hover:text-dark">
            Каталог
          </Link>
          <span className="mx-2">/</span>
          <span className="text-dark">{category.name}</span>
        </nav>

        <h1 className="text-2xl font-extrabold uppercase tracking-tight text-dark sm:text-4xl md:text-5xl lg:text-[56px]">
          {category.name}
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-text-secondary sm:mt-4 sm:text-base md:text-lg">
          {category.description}
        </p>

        {categoryProducts.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-border bg-surface p-10 text-center sm:p-12">
            <p className="text-lg font-semibold text-dark">
              В этой категории пока нет товаров
            </p>
            <Link
              to="/catalog"
              className="mt-4 inline-block font-semibold text-dark underline decoration-primary underline-offset-4"
            >
              Смотреть весь каталог
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
