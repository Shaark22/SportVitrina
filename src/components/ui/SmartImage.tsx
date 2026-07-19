import { useState } from 'react'
import { Dumbbell } from 'lucide-react'
import { placeholderImages } from '../../data/images'

interface SmartImageProps {
  src: string
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
  aspect?: string
}

export function SmartImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  aspect = 'aspect-square',
}: SmartImageProps) {
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const imageSrc = error || !src ? placeholderImages.product : src

  if (error || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-background ${aspect} ${className}`}
      >
        <div className="flex flex-col items-center gap-2 text-text-secondary">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-dark sm:h-14 sm:w-14 sm:rounded-2xl">
            <Dumbbell size={24} strokeWidth={2.5} className="sm:hidden" />
            <Dumbbell size={28} strokeWidth={2.5} className="hidden sm:block" />
          </div>
          <span className="px-3 text-center text-[10px] font-bold uppercase tracking-widest sm:text-xs">
            SPORT KING
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative ${aspect || 'h-full w-full'} ${className.includes('max-') ? className : ''}`}
    >
      {!loaded && <div className="absolute inset-0 shimmer" aria-hidden />}
      <img
        src={imageSrc}
        alt={alt}
        loading={loading}
        className={`h-full w-full object-contain transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  )
}
