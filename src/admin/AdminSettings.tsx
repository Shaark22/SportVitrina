import { useEffect, useState, type FormEvent } from 'react'
import { RotateCcw } from 'lucide-react'
import { useData } from '../context/DataContext'
import { ImageUpload } from '../components/admin/ImageUpload'
import { Button } from '../components/ui/Button'
import { SmartImage } from '../components/ui/SmartImage'
import {
  cloneSiteSettings,
  type SiteSettings,
} from '../types/siteSettings'
import { deriveInstagramLabel } from '../utils/contacts'

const inputClass =
  'w-full rounded-xl border border-border bg-background px-4 py-3 text-base'

function linesFromArray(items: string[]) {
  return items.join('\n')
}

function arrayFromLines(text: string) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export function AdminSettings() {
  const { siteSettings, updateSiteSettings, resetSiteSettings } = useData()
  const [form, setForm] = useState<SiteSettings>(() => cloneSiteSettings(siteSettings))
  const [aboutParagraphs, setAboutParagraphs] = useState(() =>
    linesFromArray(siteSettings.about.paragraphs),
  )
  const [deliverySteps, setDeliverySteps] = useState(() =>
    linesFromArray(siteSettings.delivery.steps),
  )
  const [deliveryParagraphs, setDeliveryParagraphs] = useState(() =>
    linesFromArray(siteSettings.delivery.paragraphs),
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (dirty) return
    const next = cloneSiteSettings(siteSettings)
    setForm(next)
    setAboutParagraphs(linesFromArray(next.about.paragraphs))
    setDeliverySteps(linesFromArray(next.delivery.steps))
    setDeliveryParagraphs(linesFromArray(next.delivery.paragraphs))
  }, [siteSettings, dirty])

  const markDirty = () => {
    setDirty(true)
    setSaved(false)
  }

  const setHero = (patch: Partial<SiteSettings['hero']>) => {
    setForm((prev) => ({ ...prev, hero: { ...prev.hero, ...patch } }))
    markDirty()
  }

  const setContacts = (patch: Partial<SiteSettings['contacts']>) => {
    setForm((prev) => ({ ...prev, contacts: { ...prev.contacts, ...patch } }))
    markDirty()
  }

  const buildPayload = (): SiteSettings => ({
    ...form,
    about: {
      ...form.about,
      paragraphs: arrayFromLines(aboutParagraphs),
    },
    delivery: {
      ...form.delivery,
      steps: arrayFromLines(deliverySteps),
      paragraphs: arrayFromLines(deliveryParagraphs),
    },
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      await updateSiteSettings(buildPayload())
      setDirty(false)
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сохранить')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    if (
      !window.confirm(
        'Сбросить все настройки сайта (главный экран, контакты, «О нас», доставка) к стандартным?',
      )
    ) {
      return
    }
    setSaving(true)
    setError('')
    try {
      await resetSiteSettings()
      setDirty(false)
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сбросить')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold uppercase text-dark sm:text-4xl">
        Настройки сайта
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-text-secondary sm:text-base">
        Тексты, контакты и фото. Изменения сохраняются на сервере и сразу видны на
        сайте.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-10 xl:grid-cols-2">
        <div className="space-y-8">
          <section className="space-y-5">
            <h2 className="text-lg font-extrabold uppercase text-dark">Главный экран</h2>

            <div>
              <label className="mb-2 block text-sm font-bold uppercase">Надпись сверху</label>
              <input
                value={form.hero.eyebrow}
                onChange={(e) => setHero({ eyebrow: e.target.value })}
                className={inputClass}
                maxLength={80}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold uppercase">Заголовок *</label>
              <input
                required
                value={form.hero.title}
                onChange={(e) => setHero({ title: e.target.value })}
                className={inputClass}
                maxLength={120}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold uppercase">Подзаголовок</label>
              <input
                value={form.hero.subtitle}
                onChange={(e) => setHero({ subtitle: e.target.value })}
                className={inputClass}
                maxLength={120}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold uppercase">Текст</label>
              <textarea
                value={form.hero.description}
                onChange={(e) => setHero({ description: e.target.value })}
                rows={4}
                className={`${inputClass} resize-y`}
                maxLength={500}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold uppercase">Кнопка</label>
                <input
                  value={form.hero.ctaLabel}
                  onChange={(e) => setHero({ ctaLabel: e.target.value })}
                  className={inputClass}
                  maxLength={60}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold uppercase">Ссылка кнопки</label>
                <input
                  value={form.hero.ctaLink}
                  onChange={(e) => setHero({ ctaLink: e.target.value })}
                  className={inputClass}
                  placeholder="/catalog"
                  maxLength={200}
                />
              </div>
            </div>

            <ImageUpload
              label="Фото главного экрана"
              value={form.hero.image}
              onChange={(image) => setHero({ image })}
              hint="Квадрат или 4:5, минимум 1000 px. На сайте — object-cover без искажений."
              previewClassName="aspect-square w-full object-cover object-center sm:aspect-[5/4]"
            />

            <div>
              <label className="mb-2 block text-sm font-bold uppercase">
                Описание фото (SEO)
              </label>
              <input
                value={form.hero.imageAlt}
                onChange={(e) => setHero({ imageAlt: e.target.value })}
                className={inputClass}
                maxLength={200}
              />
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="text-lg font-extrabold uppercase text-dark">Контакты</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold uppercase">Телефон</label>
                <input
                  value={form.contacts.phone}
                  onChange={(e) => setContacts({ phone: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold uppercase">WhatsApp (ссылка)</label>
                <input
                  value={form.contacts.whatsapp}
                  onChange={(e) => setContacts({ whatsapp: e.target.value })}
                  className={inputClass}
                  placeholder="https://wa.me/7..."
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold uppercase">Instagram (ссылка)</label>
                <input
                  value={form.contacts.instagram}
                  onChange={(e) => {
                    const instagram = e.target.value
                    const derived = deriveInstagramLabel(instagram)
                    setContacts({
                      instagram,
                      ...(derived ? { instagramLabel: derived } : {}),
                    })
                  }}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold uppercase">Подпись Instagram</label>
                <input
                  value={form.contacts.instagramLabel}
                  onChange={(e) => setContacts({ instagramLabel: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold uppercase">YouTube (ссылка)</label>
                <input
                  value={form.contacts.youtube}
                  onChange={(e) => setContacts({ youtube: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold uppercase">Подпись YouTube</label>
                <input
                  value={form.contacts.youtubeLabel}
                  onChange={(e) => setContacts({ youtubeLabel: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold uppercase">Адрес</label>
              <input
                value={form.contacts.address}
                onChange={(e) => setContacts({ address: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold uppercase">Города</label>
              <input
                value={form.contacts.cities}
                onChange={(e) => setContacts({ cities: e.target.value })}
                className={inputClass}
                placeholder="Астана, Усть-Каменогорск"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold uppercase">
                Текст на странице «Контакты»
              </label>
              <textarea
                value={form.contacts.intro}
                onChange={(e) => setContacts({ intro: e.target.value })}
                rows={2}
                className={`${inputClass} resize-y`}
              />
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="text-lg font-extrabold uppercase text-dark">Страница «О нас»</h2>
            <div>
              <label className="mb-2 block text-sm font-bold uppercase">Заголовок</label>
              <input
                value={form.about.pageTitle}
                onChange={(e) => {
                  setForm((p) => ({
                    ...p,
                    about: { ...p.about, pageTitle: e.target.value },
                  }))
                  markDirty()
                }}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold uppercase">
                Абзацы (каждый с новой строки)
              </label>
              <textarea
                value={aboutParagraphs}
                onChange={(e) => {
                  setAboutParagraphs(e.target.value)
                  markDirty()
                }}
                rows={6}
                className={`${inputClass} resize-y`}
              />
            </div>
            {form.about.values.map((value, index) => (
              <div key={index} className="rounded-xl border border-border p-4">
                <p className="mb-3 text-xs font-bold uppercase text-text-secondary">
                  Блок {index + 1}
                </p>
                <input
                  value={value.title}
                  onChange={(e) => {
                    setForm((p) => {
                      const values = [...p.about.values]
                      values[index] = { ...values[index], title: e.target.value }
                      return { ...p, about: { ...p.about, values } }
                    })
                    markDirty()
                  }}
                  className={`${inputClass} mb-3`}
                  placeholder="Заголовок"
                />
                <textarea
                  value={value.text}
                  onChange={(e) => {
                    setForm((p) => {
                      const values = [...p.about.values]
                      values[index] = { ...values[index], text: e.target.value }
                      return { ...p, about: { ...p.about, values } }
                    })
                    markDirty()
                  }}
                  rows={2}
                  className={`${inputClass} resize-y`}
                  placeholder="Текст"
                />
              </div>
            ))}
          </section>

          <section className="space-y-5">
            <h2 className="text-lg font-extrabold uppercase text-dark">
              Страница «Доставка и оплата»
            </h2>
            <div>
              <label className="mb-2 block text-sm font-bold uppercase">Заголовок страницы</label>
              <input
                value={form.delivery.pageTitle}
                onChange={(e) => {
                  setForm((p) => ({
                    ...p,
                    delivery: { ...p.delivery, pageTitle: e.target.value },
                  }))
                  markDirty()
                }}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold uppercase">
                Заголовок блока шагов
              </label>
              <input
                value={form.delivery.stepsTitle}
                onChange={(e) => {
                  setForm((p) => ({
                    ...p,
                    delivery: { ...p.delivery, stepsTitle: e.target.value },
                  }))
                  markDirty()
                }}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold uppercase">
                Шаги (каждый с новой строки)
              </label>
              <textarea
                value={deliverySteps}
                onChange={(e) => {
                  setDeliverySteps(e.target.value)
                  markDirty()
                }}
                rows={5}
                className={`${inputClass} resize-y`}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold uppercase">
                Текст внизу (каждый абзац с новой строки)
              </label>
              <textarea
                value={deliveryParagraphs}
                onChange={(e) => {
                  setDeliveryParagraphs(e.target.value)
                  markDirty()
                }}
                rows={4}
                className={`${inputClass} resize-y`}
              />
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="text-lg font-extrabold uppercase text-dark">Подвал и SEO</h2>
            <div>
              <label className="mb-2 block text-sm font-bold uppercase">Слоган</label>
              <input
                value={form.tagline}
                onChange={(e) => {
                  setForm((p) => ({ ...p, tagline: e.target.value }))
                  markDirty()
                }}
                className={inputClass}
                maxLength={200}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold uppercase">Описание сайта</label>
              <textarea
                value={form.description}
                onChange={(e) => {
                  setForm((p) => ({ ...p, description: e.target.value }))
                  markDirty()
                }}
                rows={3}
                className={`${inputClass} resize-y`}
                maxLength={500}
              />
            </div>
          </section>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}
          {saved && !error && (
            <p className="rounded-lg bg-success/10 px-3 py-2 text-sm font-semibold text-success">
              Сохранено — изменения уже на сайте
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? 'Сохранение…' : 'Сохранить'}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={handleReset}
            >
              <RotateCcw size={16} />
              Сбросить к стандарту
            </Button>
          </div>
        </div>

        <div className="xl:sticky xl:top-6 xl:self-start">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-text-secondary">
            Превью главного экрана
          </p>
          <div className="rounded-2xl border border-border bg-background p-4 sm:p-6">
            <div className="hero-grid">
              <div className="hero-copy min-w-0">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-text-secondary">
                  {form.hero.eyebrow || 'SPORT KING'}
                </p>
                <h2 className="text-display font-extrabold uppercase tracking-tight text-dark">
                  {form.hero.title || 'Заголовок'}
                </h2>
                <p className="mt-2 text-sm font-bold uppercase tracking-wide text-dark">
                  {form.hero.subtitle}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {form.hero.description}
                </p>
                <span className="mt-5 inline-flex min-h-10 items-center rounded-xl bg-primary px-5 text-xs font-bold uppercase text-dark">
                  {form.hero.ctaLabel || 'Кнопка'}
                </span>
              </div>
              <div className="hero-media">
                <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                  <SmartImage
                    src={form.hero.image}
                    alt={form.hero.imageAlt}
                    className="aspect-[5/4] w-full object-cover object-center sm:aspect-square"
                    aspect=""
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
