export function formatPrice(price: number): string {
  return `${formatNumber(price)} ₸`
}

export function formatNumber(value: number): string {
  const safe = Number.isFinite(value) ? value : 0
  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 0,
    useGrouping: true,
  })
    .format(safe)
    .replace(/\u00A0/g, ' ')
    .replace(/\u202F/g, ' ')
}
