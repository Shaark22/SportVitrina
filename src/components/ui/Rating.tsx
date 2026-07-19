import { Star } from 'lucide-react'

interface RatingProps {
  rating: number
  reviewsCount: number
  size?: 'sm' | 'md'
  showCount?: boolean
}

function StarRow({ rating, size }: { rating: number; size: 'sm' | 'md' }) {
  const iconSize = size === 'sm' ? 12 : 14
  const stars = []

  for (let i = 1; i <= 5; i++) {
    const filled = rating >= i
    const partial = !filled && rating > i - 1
    stars.push(
      <span key={i} className="relative inline-flex">
        <Star
          size={iconSize}
          className="text-border"
          strokeWidth={2}
          aria-hidden
        />
        {(filled || partial) && (
          <span
            className="absolute inset-0 overflow-hidden"
            style={{ width: filled ? '100%' : `${(rating - (i - 1)) * 100}%` }}
          >
            <Star
              size={iconSize}
              className="fill-primary text-primary"
              strokeWidth={2}
              aria-hidden
            />
          </span>
        )}
      </span>,
    )
  }

  return <div className="flex items-center gap-0.5">{stars}</div>
}

export function Rating({
  rating,
  reviewsCount,
  size = 'md',
  showCount = true,
}: RatingProps) {
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm'

  if (reviewsCount === 0 && rating === 0) return null

  return (
    <div
      className={`flex flex-wrap items-center gap-x-1.5 gap-y-0.5 ${textSize} text-text-secondary`}
      aria-label={`Рейтинг ${rating.toFixed(1)} из 5, ${reviewsCount} отзывов`}
    >
      <StarRow rating={rating} size={size} />
      <span className="font-semibold text-text">{rating.toFixed(1)}</span>
      {showCount && reviewsCount > 0 && (
        <span className="text-text-secondary">({reviewsCount})</span>
      )}
    </div>
  )
}
