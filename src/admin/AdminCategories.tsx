import { Link } from 'react-router-dom'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useData } from '../context/DataContext'
import { formatPrice } from '../utils/formatPrice'
import { ButtonLink } from '../components/ui/Button'
import { SmartImage } from '../components/ui/SmartImage'

export function AdminCategories() {
  const { categories, products, deleteCategory, resetToDefaults } = useData()

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-extrabold uppercase text-dark sm:text-4xl">
          Категории
        </h1>
        <ButtonLink to="/categories/new">
          <Plus size={16} />
          Добавить категорию
        </ButtonLink>
      </div>

      <div className="mt-8 space-y-4">
        {categories.map((category) => {
          const count = products.filter((p) => p.category === category.slug).length
          return (
            <div
              key={category.id}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 sm:flex-row sm:items-center"
            >
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                <SmartImage
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-contain bg-white p-1"
                  aspect=""
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-dark">{category.name}</h2>
                <p className="mt-1 text-sm text-text-secondary">
                  {count} товаров • от {formatPrice(category.priceFrom)}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/categories/${category.id}/edit`}
                  className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-bold uppercase sm:flex-none"
                >
                  <Pencil size={16} />
                  Изменить
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    if (
                      confirm(
                        `Удалить категорию «${category.name}» и все её товары (${count})?`,
                      )
                    ) {
                      try {
                        await deleteCategory(category.id)
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
          )
        })}
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-bold uppercase text-dark">Сброс данных</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Вернуть товары и категории к исходным значениям из проекта.
        </p>
        <button
          type="button"
          onClick={async () => {
            if (confirm('Сбросить все данные к исходным?')) {
              try {
                await resetToDefaults()
              } catch (err) {
                alert(err instanceof Error ? err.message : 'Ошибка сброса')
              }
            }
          }}
          className="mt-4 rounded-xl border-2 border-dark px-6 py-3 text-sm font-bold uppercase"
        >
          Сбросить к defaults
        </button>
      </div>
    </div>
  )
}
