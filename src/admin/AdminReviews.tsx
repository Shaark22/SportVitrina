import { useMemo, useState, type FormEvent } from 'react'
import { MessageSquare, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useData } from '../context/DataContext'
import type { Review } from '../types/review'
import { Button } from '../components/ui/Button'

const emptyReview: Omit<Review, 'id'> = {
  productId: '',
  authorName: '',
  rating: 5,
  text: '',
  date: new Date().toISOString().slice(0, 10),
  source: 'manual',
}

export function AdminReviews() {
  const { products, reviews, addReview, updateReview, deleteReview } = useData()
  const [filterProductId, setFilterProductId] = useState('')
  const [editing, setEditing] = useState<Review | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(emptyReview)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const filtered = useMemo(() => {
    const list = filterProductId
      ? reviews.filter((r) => r.productId === filterProductId)
      : reviews
    return [...list].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
  }, [reviews, filterProductId])

  const getProductName = (id: string) =>
    products.find((p) => p.id === id)?.name ?? id

  const openCreate = () => {
    setCreating(true)
    setEditing(null)
    setForm({
      ...emptyReview,
      productId: filterProductId || products[0]?.id || '',
    })
    setError('')
  }

  const openEdit = (review: Review) => {
    setEditing(review)
    setCreating(false)
    setForm({ ...review })
    setError('')
  }

  const closeForm = () => {
    setCreating(false)
    setEditing(null)
    setError('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.productId || !form.authorName.trim() || !form.text.trim()) {
      setError('Заполните товар, имя автора и текст отзыва')
      return
    }

    setSaving(true)
    setError('')
    try {
      if (editing) {
        await updateReview(editing.id, form)
      } else {
        await addReview(form)
      }
      closeForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сохранить отзыв')
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-border bg-background px-4 py-3 text-base'

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-extrabold uppercase text-dark sm:text-4xl">
          Отзывы
        </h1>
        <Button type="button" onClick={openCreate}>
          <Plus size={16} />
          Добавить отзыв
        </Button>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-bold uppercase tracking-wide text-text-secondary">
          Фильтр по товару
        </label>
        <select
          value={filterProductId}
          onChange={(e) => setFilterProductId(e.target.value)}
          className={`${inputClass} mt-2 max-w-xl`}
        >
          <option value="">Все товары</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {(creating || editing) && (
        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-border bg-surface p-5 sm:p-6"
        >
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-extrabold uppercase text-dark">
              {editing ? 'Редактировать отзыв' : 'Новый отзыв'}
            </h2>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg p-2 text-text-secondary hover:bg-background"
              aria-label="Закрыть"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-dark">
                Товар
              </label>
              <select
                required
                value={form.productId}
                onChange={(e) => setForm({ ...form, productId: e.target.value })}
                className={inputClass}
              >
                <option value="">Выберите товар</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-dark">
                Имя автора
              </label>
              <input
                required
                value={form.authorName}
                onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                className={inputClass}
                placeholder="Иван"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-dark">
                Дата
              </label>
              <input
                type="date"
                required
                value={form.date.slice(0, 10)}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-dark">
                Оценка
              </label>
              <select
                value={form.rating}
                onChange={(e) =>
                  setForm({ ...form, rating: Number(e.target.value) })
                }
                className={inputClass}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} звёзд
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-dark">
                Текст отзыва
              </label>
              <textarea
                required
                rows={4}
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                className={inputClass}
                placeholder="Текст отзыва покупателя..."
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? 'Сохранение...' : editing ? 'Сохранить' : 'Добавить'}
            </Button>
            <button
              type="button"
              onClick={closeForm}
              className="inline-flex min-h-11 items-center rounded-xl border border-border px-5 text-sm font-bold uppercase"
            >
              Отмена
            </button>
          </div>
        </form>
      )}

      <div className="mt-8 space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
            <MessageSquare
              size={32}
              className="mx-auto text-text-secondary"
              aria-hidden
            />
            <p className="mt-4 text-text-secondary">
              Отзывов пока нет. Добавьте первый вручную.
            </p>
          </div>
        ) : (
          filtered.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-border bg-surface p-4 sm:p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-dark">{review.authorName}</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {getProductName(review.productId)} • {review.rating}★ •{' '}
                    {new Date(review.date).toLocaleDateString('ru-RU')}
                    {review.source === 'kaspi' && ' • Kaspi'}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
                    {review.text}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(review)}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-bold uppercase"
                  >
                    <Pencil size={16} />
                    Изменить
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (
                        confirm(
                          `Удалить отзыв от «${review.authorName}»?`,
                        )
                      ) {
                        try {
                          await deleteReview(review.id)
                        } catch (err) {
                          alert(
                            err instanceof Error
                              ? err.message
                              : 'Ошибка удаления',
                          )
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
            </div>
          ))
        )}
      </div>
    </div>
  )
}
