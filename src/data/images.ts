export const placeholderImages = {
  hero: '/images/hero-main.png',
  swedishWall: '/categories/swedish-walls.png',
  pullUpBar: '/categories/pull-up-bars.png',
  parallelBars: '/categories/pull-up-bars.png',
  crossbar: '/categories/complexes-3in1.png',
  complex3in1: '/categories/complexes-3in1.png',
  accessories: '/categories/accessories.png',
  product: '/categories/skami.png',
} as const

export function getCategoryImage(slug: string): string {
  const map: Record<string, string> = {
    'swedish-walls': placeholderImages.swedishWall,
    'pull-up-bars': placeholderImages.pullUpBar,
    'parallel-bars': placeholderImages.parallelBars,
    crossbars: placeholderImages.crossbar,
    'complexes-3in1': placeholderImages.complex3in1,
    accessories: placeholderImages.accessories,
    skami: placeholderImages.product,
    supports: '/categories/supports.png',
  }
  return map[slug] ?? placeholderImages.product
}
