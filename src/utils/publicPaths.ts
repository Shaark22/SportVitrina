const PUBLIC_EXACT = new Set([
  '/',
  '/catalog',
  '/about',
  '/delivery',
  '/contacts',
])

const PUBLIC_PREFIXES = ['/product/', '/category/']

export function isTrackablePublicPath(path: string): boolean {
  if (PUBLIC_EXACT.has(path)) return true
  return PUBLIC_PREFIXES.some((prefix) => path.startsWith(prefix))
}
