import { useLayoutEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, MessageCircle, Truck } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'
import { useData } from '../context/DataContext'
import { formatPrice } from '../utils/formatPrice'
import {
  formatKzPhoneFromNational,
  isValidKzPhone,
  parsePhoneNational,
} from '../utils/phone'
import { buildOrderWhatsAppUrl } from '../utils/whatsapp'
import { api } from '../api/client'
import { Button, ButtonLink } from '../components/ui/Button'
import { SmartImage } from '../components/ui/SmartImage'
import { resetMobileViewportZoom } from '../utils/mobileViewport'
import type { Order } from '../types/order'

export function OrderPage() {
  const { slug = '' } = useParams()
  const { getProductBySlug, siteSettings } = useData()
  const product = getProductBySlug(slug)

  const [customerName, setCustomerName] = useState('')
  const [phoneNational, setPhoneNational] = useState('')
  const phone = formatKzPhoneFromNational(phoneNational)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState<Order | null>(null)

  usePageMeta({
    title: product
      ? `Заказ — ${product.name} — SPORT KING`
      : 'Заказ — SPORT KING',
    description: product
      ? `Оформите заявку на ${product.name}. Доставка по Астане в день заказа.`
      : 'Оформление заявки на товар SPORT KING.',
  })

  useLayoutEffect(() => {
    if (!submitted) return
    resetMobileViewportZoom()
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [submitted])

  if (!product) {
    return (
      <div className="site-container py-20 text-center">
        <h1 className="text-2xl font-extrabold uppercase text-dark sm:text-3xl">
          Товар не найден
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

  const handlePhoneChange = (value: string) => {
    setPhoneNational(parsePhoneNational(value, phoneNational))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!customerName.trim() || !phoneNational) {
      setError('Заполните имя и номер телефона')
      return
    }
    if (!isValidKzPhone(phoneNational)) {
      setError('Укажите корректный номер телефона')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      const order = await api.createOrder({
        productId: product.id,
        customerName: customerName.trim(),
        phone: phone.trim(),
        comment: comment.trim(),
      })
      setSubmitted(order)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось отправить заявку')
    } finally {
      setSubmitting(false)
    }
  }

  const whatsappUrl = submitted
    ? buildOrderWhatsAppUrl(
        {
          productName: submitted.productName,
          price: submitted.productPrice,
          customerName: submitted.customerName,
          phone: submitted.phone,
          comment: submitted.comment,
        },
        siteSettings.contacts.whatsapp,
      )
    : ''

  if (submitted) {
    return (
      <div className="bg-background py-10 md:py-16">
        <div className="site-container max-w-xl">
          <div className="rounded-2xl border border-border bg-surface p-6 text-center sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircle2 size={36} strokeWidth={2} />
            </div>
            <h1 className="mt-5 text-xl font-extrabold uppercase text-dark sm:text-2xl">
              Заявка отправлена
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
              Заявка успешно отправлена. С вами свяжется менеджер в ближайшее
              время.
            </p>
            <p className="mt-2 text-sm font-semibold text-dark">{submitted.productName}</p>

            <div className="mt-8 flex flex-col gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-105"
              >
                <MessageCircle size={18} />
                Написать в WhatsApp
              </a>
              <ButtonLink to={`/product/${product.slug}`} variant="outline" className="w-full">
                Вернуться к товару
              </ButtonLink>
              <ButtonLink to="/catalog" variant="ghost" className="w-full">
                В каталог
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background py-10 md:py-16">
      <div className="site-container">
        <nav
          className="mb-6 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-secondary sm:text-sm"
          aria-label="Хлебные крошки"
        >
          <Link to="/" className="hover:text-dark">
            Главная
          </Link>
          <span className="mx-2">/</span>
          <Link to={`/product/${product.slug}`} className="min-w-0 break-words hover:text-dark">
            {product.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-dark">Заказ</span>
        </nav>

        <div className="grid min-w-0 gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <div className="flex gap-4">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-background sm:h-28 sm:w-28">
                <SmartImage src={product.image} alt={product.name} aspect="" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-extrabold uppercase leading-tight text-dark sm:text-xl">
                  {product.name}
                </h1>
                <p className="mt-2 text-xl font-extrabold text-dark sm:text-2xl">
                  {formatPrice(product.price)}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-xl bg-primary/15 p-4">
              <Truck size={22} className="mt-0.5 shrink-0 text-dark" />
              <div>
                <p className="text-sm font-bold text-dark">Доставка по Астане</p>
                <p className="mt-1 text-sm text-text-secondary">
                  Доставим в день заказа — менеджер уточнит адрес и время при
                  звонке.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <h2 className="text-lg font-extrabold uppercase text-dark sm:text-xl">
              Оставить заявку
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              Заполните форму — мы перезвоним вам, уточним детали и поможем получить товар.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-dark">
                  Ваше имя *
                </span>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  autoComplete="name"
                  maxLength={100}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-dark outline-none focus:border-dark sm:text-sm"
                  placeholder="Как к вам обращаться"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-dark">
                  Телефон *
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  required
                  autoComplete="tel"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-dark outline-none focus:border-dark sm:text-sm"
                  placeholder="+7 777 123 45 67"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-dark">
                  Комментарий
                </span>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  maxLength={500}
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-base text-dark outline-none focus:border-dark sm:text-sm"
                  placeholder="Адрес, удобное время звонка…"
                />
              </label>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Отправка…' : 'Отправить заявку'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
