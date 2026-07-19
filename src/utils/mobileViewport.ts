/** Reset iOS Safari zoom after input focus (e.g. after form submit). */
export function resetMobileViewportZoom() {
  const active = document.activeElement
  if (active instanceof HTMLElement) {
    active.blur()
  }

  const meta = document.querySelector('meta[name="viewport"]')
  if (!meta) return

  const original = meta.getAttribute('content') ?? 'width=device-width, initial-scale=1.0'
  meta.setAttribute('content', `${original}, maximum-scale=1.0`)
  requestAnimationFrame(() => {
    meta.setAttribute('content', original)
  })
}
