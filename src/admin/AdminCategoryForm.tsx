import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { formatNumber } from '../utils/formatPrice'
import { slugify } from '../utils/slugify'
import { ImageUpload } from '../components/admin/ImageUpload'
import { placeholderImages } from '../data/images'
import { Button } from '../components/ui/Button'

const emptyCategory: Omit<import('../types/category').Category, 'id'> = {
  name: '',
  slug: '',
  description: '',
  image: placeholderImages.product,
  priceFrom: 0,
}

export function AdminCategoryForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { categories, addCategory, updateCategory } = useData()
  const existing = id ? categories.find((c) => c.id === id) : undefined

  const [form, setForm] = useState(() =>
    existing ? { ...existing } : { ...emptyCategory },
  )
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  if (id && !existing) {
    return <Navigate to="/categories" replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaveError('')
    const slug = form.slug || slugify(form.name)
    const payload = { ...form, slug }

    try {
      if (existing) {
        await updateCategory(existing.id, payload)
      } else {
        await addCategory(payload)
      }
      navigate('/categories')
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Не удалось сохранить категорию')
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-border bg-background px-4 py-3 text-base'

  return (
    <div>
      <Link
        to="/categories"
        className="text-sm font-semibold text-text-secondary hover:text-dark"
      >
        ← Назад к категориям
      </Link>
      <h1 className="mt-4 text-2xl font-extrabold uppercase text-dark sm:text-4xl">
        {existing ? 'Редактировать категорию' : 'Новая категория'}
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-5">
        <div>
          <label className="mb-2 block text-sm font-bold uppercase">Название</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold uppercase">Slug (URL)</label>
          <input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder={slugify(form.name) || 'auto'}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold uppercase">Цена от, ₸</label>
          <input
            required
            type="number"
            min={0}
            value={form.priceFrom || ''}
            onChange={(e) =>
              setForm({ ...form, priceFrom: Number(e.target.value) })
            }
            className={inputClass}
          />
          {form.priceFrom > 0 && (
            <p className="mt-1 text-xs text-text-secondary">
              На сайте: от {formatNumber(form.priceFrom)} ₸
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold uppercase">Описание</label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={inputClass}
          />
        </div>

        <ImageUpload
          label="Фото категории"
          value={form.image}
          onChange={(image) => setForm({ ...form, image })}
        />

        <Button type="submit" className="w-full sm:w-auto" disabled={saving}>
          {saving ? 'Сохранение...' : existing ? 'Сохранить' : 'Создать категорию'}
        </Button>
        {saveError && <p className="text-sm text-red-600">{saveError}</p>}
      </form>
    </div>
  )
}
