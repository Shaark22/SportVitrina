/** Allow only http(s) and site-relative paths in href/src attributes. */
export function safeExternalUrl(url: string, fallback = '#'): string {
  const trimmed = String(url || '').trim()
  if (!trimmed) return fallback

  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed
  }

  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return trimmed
    }
  } catch {
    /* invalid URL */
  }

  return fallback
}

export function safeWhatsAppUrl(url: string, fallback: string): string {
  const trimmed = String(url || '').trim()
  if (/^https:\/\/wa\.me\/\d+/i.test(trimmed)) {
    return trimmed.split('?')[0]
  }
  return safeExternalUrl(trimmed, fallback)
}
