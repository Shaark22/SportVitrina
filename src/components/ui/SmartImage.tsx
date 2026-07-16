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
  const imageSrc = error || !src ? placeholderImages.product : src

  if (error || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-background to-border ${aspect} ${className}`}
      >
        <div className="flex flex-col items-center gap-2 text-text-secondary">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/30 text-dark">
            <Dumbbell size={28} strokeWidth={2.5} />
          </div>
          <span className="px-4 text-center text-xs font-semibold uppercase tracking-wide">
            SPORT KING
          </span>
        </div>
      </div>
    )
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      loading={loading}
      className={`${aspect} ${className}`}
      onError={() => setError(true)}
    />
  )
}
