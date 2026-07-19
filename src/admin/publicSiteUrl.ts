/** Absolute URLs to the public storefront (outside admin basename). */
export function publicSiteUrl(path = '/') {
  if (!path.startsWith('/')) return `/${path}`
  return path
}
