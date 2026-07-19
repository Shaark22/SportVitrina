import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Tags, Plus, BarChart3, ClipboardList } from 'lucide-react'
import { useData } from '../context/DataContext'
import { ButtonLink } from '../components/ui/Button'
import { publicSiteUrl } from './publicSiteUrl'
import { api } from '../api/client'

const adminCardBtn =
  'w-full min-w-0 !px-3 text-xs normal-case tracking-normal sm:!px-4 sm:text-sm'

export function AdminDashboard() {
  const { products, categories, isAdmin } = useData()
  const [newOrders, setNewOrders] = useState<number | null>(null)

  useEffect(() => {
    if (!isAdmin) return
    api
      .getOrders('new')
      .then((list) => setNewOrders(list.length))
      .catch(() => setNewOrders(null))
  }, [isAdmin])

  return (
    <div>
      <h1 className="text-2xl font-extrabold uppercase text-dark sm:text-4xl">
        Панель управления
      </h1>
      <p className="mt-2 text-sm text-text-secondary sm:text-base">
        Управляйте товарами, ценами и категориями. Все изменения сохраняются на
        сервере и сразу видны посетителям сайта.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          <ButtonLink to="/statistics" className={`mt-6 ${adminCardBtn}`}>
            Открыть
          </ButtonLink>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-dark">
              <ClipboardList size={22} />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-dark">
                {newOrders === null ? '—' : newOrders}
              </p>
              <p className="text-sm text-text-secondary">Новых заявок</p>
            </div>
          </div>
          <ButtonLink to="/orders" className={`mt-6 ${adminCardBtn}`}>
            Открыть заявки
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
          <div className="mt-6 grid grid-cols-1 gap-2">
            <ButtonLink to="/products" variant="outline" className={adminCardBtn}>
              Все товары
            </ButtonLink>
            <ButtonLink to="/products/new" className={adminCardBtn}>
              <Plus size={16} />
              Добавить
            </ButtonLink>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
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
          <div className="mt-6 grid grid-cols-1 gap-2">
            <ButtonLink to="/categories" variant="outline" className={adminCardBtn}>
              Все категории
            </ButtonLink>
            <ButtonLink to="/categories/new" className={adminCardBtn}>
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
            <a href={publicSiteUrl('/catalog')} className="font-semibold text-dark underline decoration-primary underline-offset-4">
              Открыть каталог на сайте
            </a>
          </li>
          <li>
            <Link to="/orders" className="font-semibold text-dark underline decoration-primary underline-offset-4">
              Заявки на заказ с сайта
            </Link>
          </li>
          <li>
            <Link to="/statistics" className="font-semibold text-dark underline decoration-primary underline-offset-4">
              Статистика посещений и спроса
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
