import { Link } from 'react-router-dom'
import { Package, Tags, Plus, BarChart3 } from 'lucide-react'
import { useData } from '../context/DataContext'
import { ButtonLink } from '../components/ui/Button'

export function AdminDashboard() {
  const { products, categories } = useData()

  return (
    <div>
      <h1 className="text-2xl font-extrabold uppercase text-dark sm:text-4xl">
        Панель управления
      </h1>
      <p className="mt-2 text-sm text-text-secondary sm:text-base">
        Управляйте товарами, ценами и категориями. Все изменения сохраняются на
        сервере и сразу видны посетителям сайта.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-dark">
              <BarChart3 size={22} />
            </div>
            <div>
              <p className="text-lg font-extrabold text-dark">Статистика</p>
              <p className="text-sm text-text-secondary">Посещения и клики</p>
            </div>
          </div>
          <ButtonLink to="/admin/statistics" className="mt-6 w-full">
            Открыть статистику
          </ButtonLink>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-dark">
              <Package size={22} />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-dark">{products.length}</p>
              <p className="text-sm text-text-secondary">Товаров</p>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <ButtonLink to="/admin/products" variant="outline" className="flex-1">
              Все товары
            </ButtonLink>
            <ButtonLink to="/admin/products/new" className="flex-1">
              <Plus size={16} />
              Добавить
            </ButtonLink>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-dark">
              <Tags size={22} />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-dark">
                {categories.length}
              </p>
              <p className="text-sm text-text-secondary">Категорий</p>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <ButtonLink to="/admin/categories" variant="outline" className="flex-1">
              Все категории
            </ButtonLink>
            <ButtonLink to="/admin/categories/new" className="flex-1">
              <Plus size={16} />
              Добавить
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-bold uppercase text-dark">Быстрые ссылки</h2>
        <ul className="mt-4 space-y-2 text-sm">
          <li>
            <Link to="/catalog" className="font-semibold text-dark underline decoration-primary underline-offset-4">
              Открыть каталог на сайте
            </Link>
          </li>
          <li>
            <Link to="/admin/statistics" className="font-semibold text-dark underline decoration-primary underline-offset-4">
              Статистика посещений и спроса
            </Link>
          </li>
          <li className="text-text-secondary">
            Пароль админки задаётся переменной <code>ADMIN_PASSWORD</code> на сервере
          </li>
        </ul>
      </div>
    </div>
  )
}
