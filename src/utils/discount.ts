export function discountPercent(price: number, oldPrice?: number): number | null {
  if (!oldPrice || oldPrice <= price) return null
  return Math.round((1 - price / oldPrice) * 100)
}
