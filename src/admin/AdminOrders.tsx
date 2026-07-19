import { useCallback, useEffect, useMemo, useState } from 'react'
import { ClipboardList, ExternalLink, Trash2 } from 'lucide-react'
import { api } from '../api/client'
import { formatPrice } from '../utils/formatPrice'
import { buildCustomerWhatsAppUrl } from '../utils/whatsapp'
import { publicSiteUrl } from './publicSiteUrl'
import type { Order, OrderStatus } from '../types/order'
import { ORDER_STATUS_LABELS } from '../types/order'
import { Button } from '../components/ui/Button'

const STATUS_FILTERS: { value: '' | OrderStatus; label: string }[] = [
  { value: '', label: 'Все' },
  { value: 'new', label: 'Новые' },
  { value: 'contacted', label: 'Связались' },
  { value: 'completed', label: 'Выполнены' },
  { value: 'cancelled', label: 'Отменены' },
]

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState<'' | OrderStatus>('new')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api.getOrders(filter || undefined)
      setOrders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить заявки')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    load()
  }, [load])

  const newCount = useMemo(
    () => orders.filter((o) => o.status === 'new').length,
    [orders],
  )

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    setUpdatingId(id)
    try {
      const updated = await api.updateOrder(id, { status })
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось обновить статус')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Удалить заявку?')) return
    setUpdatingId(id)
    try {
      await api.deleteOrder(id)
      setOrders((prev) => prev.filter((o) => o.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось удалить заявку')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold uppercase text-dark sm:text-4xl">
            Заявки на заказ
          </h1>
          <p className="mt-2 text-sm text-text-secondary sm:text-base">
            Заявки с кнопки «Купить на сайте». Активные — со статусом «Новая».
          </p>
        </div>
        {filter === 'new' && newCount > 0 && (
          <span className="rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-dark">
            {newCount} новых
          </span>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map(({ value, label }) => (
          <button
            key={value || 'all'}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors sm:text-sm ${
              filter === value
                ? 'bg-dark text-white'
                : 'bg-surface text-text-secondary hover:text-dark'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {loading ? (
        <p className="mt-10 text-sm text-text-secondary">Загрузка…</p>
      ) : orders.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
          <ClipboardList size={40} className="mx-auto text-text-secondary" />
          <p className="mt-4 font-semibold text-dark">Заявок пока нет</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => {
            const whatsappUrl = buildCustomerWhatsAppUrl(
              order.phone,
              `Здравствуйте, ${order.customerName}! Менеджер SPORT KING по вашей заявке на «${order.productName}».`,
            )

            return (
              <article
                key={order.id}
                className="rounded-2xl border border-border bg-surface p-4 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-text-secondary">
                      {formatDate(order.createdAt)}
                    </p>
                    <h2 className="mt-1 text-base font-extrabold text-dark sm:text-lg">
                      {order.productName}
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-dark">
                      {formatPrice(order.productPrice)}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                      order.status === 'new'
                        ? 'bg-primary text-dark'
                        : order.status === 'completed'
                          ? 'bg-success/15 text-success'
                          : order.status === 'cancelled'
                            ? 'bg-border text-text-secondary'
                            : 'bg-dark/10 text-dark'
                    }`}
                  >
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>

                <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-text-secondary">Клиент</dt>
                    <dd className="font-semibold text-dark">{order.customerName}</dd>
                  </div>
                  <div>
                    <dt className="text-text-secondary">Телефон</dt>
                    <dd>
                      <a
                        href={`tel:+${order.phone}`}
                        className="font-semibold text-dark hover:underline"
                      >
                        +{order.phone}
                      </a>
                    </dd>
                  </div>
                  {order.comment && (
                    <div className="sm:col-span-2">
                      <dt className="text-text-secondary">Комментарий</dt>
                      <dd className="text-dark">{order.comment}</dd>
                    </div>
                  )}
                </dl>

                <div className="mt-5 flex flex-wrap gap-2">
                  <label className="inline-flex items-center gap-2 text-sm">
                    <span className="font-bold text-text-secondary">Статус:</span>
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value as OrderStatus)
                      }
                      className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold text-dark"
                    >
                      {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((s) => (
                        <option key={s} value={s}>
                          {ORDER_STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </label>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#25D366] px-4 text-xs font-bold uppercase tracking-wide text-white"
                  >
                    WhatsApp
                  </a>

                  <a
                    href={publicSiteUrl(`/product/${order.productSlug}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border px-4 text-xs font-bold uppercase tracking-wide text-dark"
                  >
                    <ExternalLink size={14} />
                    Товар
                  </a>

                  <button
                    type="button"
                    disabled={updatingId === order.id}
                    onClick={() => handleDelete(order.id)}
                    className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-red-200 px-4 text-xs font-bold uppercase tracking-wide text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                    Удалить
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <div className="mt-6">
        <Button variant="outline" onClick={load} disabled={loading}>
          Обновить
        </Button>
      </div>
    </div>
  )
}
