import { formatPrice } from './formatPrice'
import { defaultSiteSettings } from '../types/siteSettings'
import { safeWhatsAppUrl } from './safeUrl'
/** WhatsApp клиента по номеру из заявки (для админки). */
export function buildCustomerWhatsAppUrl(phone: string, text?: string): string {
  const digits = String(phone || '').replace(/\D/g, '')
  const base = `https://wa.me/${digits}`
  if (text?.trim()) {
    return `${base}?text=${encodeURIComponent(text.trim())}`
  }
  return base
}

/** WhatsApp компании с шаблоном заявки (для клиента после отправки формы). */
export function buildOrderWhatsAppUrl(
  params: {
    productName: string
    price: number
    customerName: string
    phone: string
    comment?: string
  },
  companyWhatsAppUrl = defaultSiteSettings.contacts.whatsapp,
): string {  const lines = [
    'Здравствуйте! Хочу оформить заказ на сайте SPORT KING.',
    '',
    `Товар: ${params.productName}`,
    `Цена: ${formatPrice(params.price)}`,
    `Имя: ${params.customerName}`,
    `Телефон: ${params.phone}`,
  ]
  if (params.comment?.trim()) {
    lines.push(`Комментарий: ${params.comment.trim()}`)
  }
  const base = safeWhatsAppUrl(companyWhatsAppUrl, defaultSiteSettings.contacts.whatsapp).replace(
    /\?.*$/,
    '',
  )
  return `${base}?text=${encodeURIComponent(lines.join('\n'))}`
}
