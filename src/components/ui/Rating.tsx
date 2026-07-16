import { Star } from 'lucide-react'

interface RatingProps {
  rating: number
  reviewsCount: number
  size?: 'sm' | 'md'
}

export function Rating({ rating, reviewsCount, size = 'md' }: RatingProps) {
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm'
  const iconSize = size === 'sm' ? 14 : 16

  return (
    <div className={`flex items-center gap-1.5 ${textSize} text-text-secondary`}>
      <Star
        size={iconSize}
        className="fill-primary text-primary"
        aria-hidden
      />
      <span className="font-semibold text-text">{rating.toFixed(1)}</span>
      <span>({reviewsCount})</span>
    </div>
  )
}
