import { useEffect } from 'react'
import { trackKaspiClick } from '../utils/analytics'

interface PageMetaOptions {
  title: string
  description: string
  ogImage?: string
}

export function usePageMeta({ title, description, ogImage }: PageMetaOptions) {
  useEffect(() => {
    document.title = title

    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name'
      let el = document.querySelector(`meta[${attr}="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('description', description)
    setMeta('og:title', title, true)
    setMeta('og:description', description, true)
    if (ogImage) {
      setMeta('og:image', ogImage, true)
    }
  }, [title, description, ogImage])
}

export function openKaspi(
  url: string,
  product?: { id: string; slug: string; name: string },
) {
  if (product) {
    trackKaspiClick(product)
  }
  window.open(url, '_blank', 'noopener,noreferrer')
}
