import { useMemo, useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'
import { useData } from '../context/DataContext'
import { getCategoriesWithProducts } from '../utils/categoryCounts'
import { ProductCard } from '../components/ui/ProductCard'
import { ProductGrid } from '../components/ui/ProductGrid'
import { SectionTitle } from '../components/ui/SectionTitle'
import { Button } from '../components/ui/Button'
import type { Product } from '../types/product'

type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'rating'

export function Catalog() {
  const { products, categories } = useData()
  usePageMeta({
    title: 'Каталог — SPORT KING',
    description:
      'Каталог спортивного оборудования SPORT KING: шведские стенки, турники, брусья и комплексы 3-в-1.',
  })

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [category, setCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minRating, setMinRating] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sort, setSort] = useState<SortOption>('popular')

  const filterCategories = useMemo(
    () => getCategoriesWithProducts(categories, products),
    [categories, products],
  )

  const filtered = useMemo(() => {
    let result: Product[] = [...products]

    if (category) {
      result = result.filter((p) => p.category === category)
    }
    if (minPrice) {
      result = result.filter((p) => p.price >= Number(minPrice))
    }
    if (maxPrice) {
      result = result.filter((p) => p.price <= Number(maxPrice))
    }
    if (minRating) {
      result = result.filter((p) => p.rating >= Number(minRating))
    }
    if (inStockOnly) {
      result = result.filter((p) => p.inStock)
    }

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      default:
        result.sort((a, b) => b.reviewsCount - a.reviewsCount)
    }

    return result
  }, [products, category, minPrice, maxPrice, minRating, inStockOnly, sort])

  const filtersPanel = (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-dark">
          Категория
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm"
        >
          <option value="">Все категории</option>
          {filterCategories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-dark">
          Цена, ₸
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="От"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="rounded-xl border border-border bg-surface px-4 py-3 text-sm"
          />
          <input
            type="number"
            placeholder="До"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="rounded-xl border border-border bg-surface px-4 py-3 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-dark">
          Рейтинг от
        </label>
        <select
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm"
        >
          <option value="">Любой</option>
          <option value="4.5">4.5+</option>
          <option value="4.7">4.7+</option>
          <option value="4.8">4.8+</option>
        </select>
      </div>

      <label className="flex items-center gap-3 text-sm font-medium text-dark">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
          className="h-4 w-4 rounded border-border"
        />
        Только в наличии
      </label>
    </div>
  )

  return (
    <div className="bg-background py-10 md:py-16">
      <div className="site-container">
        <SectionTitle
          title="Каталог спортивного оборудования"
          subtitle="Выберите оборудование для домашних тренировок и покупайте на Kaspi."
        />

        <div className="mt-8 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="outline"
            className="w-full lg:hidden"
            onClick={() => setFiltersOpen(true)}
          >
            <SlidersHorizontal size={18} />
            Фильтры
          </Button>

          <div className="flex min-w-0 w-full items-center gap-3 sm:w-auto">
            <label className="shrink-0 text-sm font-semibold text-text-secondary">
              Сортировка:
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="min-w-0 flex-1 rounded-xl border border-border bg-surface px-3 py-3 text-sm sm:flex-none sm:px-4"
            >
              <option value="popular">Популярные</option>
              <option value="price-asc">Сначала дешевле</option>
              <option value="price-desc">Сначала дороже</option>
              <option value="rating">По рейтингу</option>
            </select>
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-2xl border border-border bg-surface p-6">
              <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-dark">
                Фильтры
              </h2>
              {filtersPanel}
            </div>
          </aside>

          <div>
            <p className="mb-6 text-sm text-text-secondary">
              Найдено: {filtered.length} товаров
            </p>
            {filtered.length > 0 ? (
              <ProductGrid>
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </ProductGrid>
            ) : (
              <div className="rounded-2xl border border-border bg-surface p-12 text-center">
                <p className="text-lg font-semibold text-dark">
                  Товары не найдены
                </p>
                <p className="mt-2 text-sm text-text-secondary">
                  Попробуйте изменить параметры фильтрации.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-dark/60"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-surface p-6 animate-slide-up">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold uppercase">Фильтры</h2>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border"
              >
                <X size={18} />
              </button>
            </div>
            {filtersPanel}
            <Button
              className="mt-6 w-full"
              onClick={() => setFiltersOpen(false)}
            >
              Показать {filtered.length} товаров
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
