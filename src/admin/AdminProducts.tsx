import { Link } from 'react-router-dom'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useData } from '../context/DataContext'
import { formatPrice } from '../utils/formatPrice'
import { ButtonLink } from '../components/ui/Button'
import { SmartImage } from '../components/ui/SmartImage'

export function AdminProducts() {
  const { products, categories, deleteProduct } = useData()

  const getCategoryName = (slug: string) =>
    categories.find((c) => c.slug === slug)?.name ?? slug

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-extrabold uppercase text-dark sm:text-4xl">
          Товары
        </h1>
        <ButtonLink to="/admin/products/new">
          <Plus size={16} />
          Добавить товар
        </ButtonLink>
      </div>

      <div className="mt-8 space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 sm:flex-row sm:items-center"
          >
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl">
              <SmartImage
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain bg-white p-1"
                aspect=""
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate font-bold text-dark">{product.name}</h2>
              <p className="mt-1 text-sm text-text-secondary">
                {getCategoryName(product.category)} • {formatPrice(product.price)}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/admin/products/${product.id}/edit`}
                className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-bold uppercase sm:flex-none"
              >
                <Pencil size={16} />
                Изменить
              </Link>
              <button
                type="button"
                onClick={async () => {
                  if (confirm(`Удалить «${product.name}»?`)) {
                    try {
                      await deleteProduct(product.id)
                    } catch (err) {
                      alert(err instanceof Error ? err.message : 'Ошибка удаления')
                    }
                  }
                }}
                className="inline-flex min-h-10 items-center justify-center rounded-xl border border-red-200 px-4 text-red-600"
                aria-label="Удалить"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
