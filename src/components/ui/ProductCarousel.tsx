import { useEffect, useRef, useState } from 'react'
import type { Product } from '../../types/product'
import { ProductCard } from './ProductCard'

interface ProductCarouselProps {
  products: Product[]
  className?: string
}

export function ProductCarousel({ products, className = '' }: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const onScroll = () => {
      const slides = Array.from(track.children) as HTMLElement[]
      if (!slides.length) return
      const center = track.scrollLeft + track.clientWidth / 2
      let nearest = 0
      let minDist = Infinity
      slides.forEach((slide, i) => {
        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2
        const dist = Math.abs(center - slideCenter)
        if (dist < minDist) {
          minDist = dist
          nearest = i
        }
      })
      setActive(nearest)
    }

    onScroll()
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [products.length])

  const scrollTo = (index: number) => {
    const track = trackRef.current
    const slide = track?.children[index] as HTMLElement | undefined
    if (!track || !slide) return
    track.scrollTo({
      left: slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2,
      behavior: 'smooth',
    })
  }

  if (!products.length) return null

  return (
    <div className={className}>
      <div
        ref={trackRef}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-4 pb-2 sm:mx-0 sm:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[min(88vw,320px)] shrink-0 snap-center"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {products.map((product, i) => (
          <button
            key={product.id}
            type="button"
            aria-label={`Товар ${i + 1}`}
            onClick={() => scrollTo(i)}
            className={`h-2 rounded-full transition-all ${
              i === active ? 'w-6 bg-dark' : 'w-2 bg-border'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
