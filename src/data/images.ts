export const placeholderImages = {
  hero: '/images/hero-main.png',
  swedishWall:
    'https://images.unsplash.com/photo-1599058917765-a780eda07a36?w=800&h=800&fit=crop&q=80',
  pullUpBar:
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=800&fit=crop&q=80',
  parallelBars:
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=800&fit=crop&q=80',
  crossbar:
    'https://images.unsplash.com/photo-1583454110551-21f2efe2fd61?w=800&h=800&fit=crop&q=80',
  complex3in1:
    'https://images.unsplash.com/photo-1599058917215-d3deb456ba7e?w=800&h=800&fit=crop&q=80',
  accessories:
    'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&h=800&fit=crop&q=80',
  product:
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=800&fit=crop&q=80',
} as const

export function getCategoryImage(slug: string): string {
  const map: Record<string, string> = {
    'swedish-walls': placeholderImages.swedishWall,
    'pull-up-bars': placeholderImages.pullUpBar,
    'parallel-bars': placeholderImages.parallelBars,
    crossbars: placeholderImages.crossbar,
    'complexes-3in1': placeholderImages.complex3in1,
    accessories: placeholderImages.accessories,
  }
  return map[slug] ?? placeholderImages.product
}
