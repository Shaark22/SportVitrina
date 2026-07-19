import { formatKzPhoneDisplay } from './phone'

/** Форматирует номер из wa.me-ссылки для отображения (+7 XXX XXX XX XX). */
export function formatWhatsAppDisplay(whatsappUrl: string): string {
  const match = String(whatsappUrl || '').match(/wa\.me\/(\d+)/)
  if (!match) return whatsappUrl.trim()

  const formatted = formatKzPhoneDisplay(match[1])
  return formatted || `+${match[1]}`
}

/** Извлекает @username из ссылки Instagram. */
export function deriveInstagramLabel(instagramUrl: string): string {
  const match = String(instagramUrl || '').match(/instagram\.com\/([^/?#]+)/i)
  if (!match) return ''

  const handle = match[1].replace(/\/$/, '')
  if (!handle || ['p', 'reel', 'tv', 'stories', 'explore'].includes(handle.toLowerCase())) {
    return ''
  }

  return handle.startsWith('@') ? handle : `@${handle}`
}

/** Подпись Instagram: из ссылки (приоритет) или из поля instagramLabel. */
export function getInstagramLabel(instagramUrl: string, instagramLabel: string): string {
  return deriveInstagramLabel(instagramUrl) || instagramLabel.trim()
}
