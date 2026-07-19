import { useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import type { Review } from '../../types/review'

interface ProductReviewsProps {
  reviews: Review[]
}

function formatReviewDate(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Оценка ${rating} из 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? 'fill-primary text-primary' : 'text-border'}
          aria-hidden
        />
      ))}
    </div>
  )
}

export function ProductReviews({ reviews }: ProductReviewsProps) {
  const [index, setIndex] = useState(0)

  if (!reviews.length) return null

  const sorted = [...reviews].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
  const current = sorted[index]
  const canPrev = index > 0
  const canNext = index < sorted.length - 1

  return (
    <section className="mt-12 border-t border-border pt-10 sm:mt-16 sm:pt-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold uppercase text-dark sm:text-2xl">
            Отзывы покупателей
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            {sorted.length}{' '}
            {sorted.length === 1
              ? 'отзыв'
              : sorted.length < 5
                ? 'отзыва'
                : 'отзывов'}
          </p>
        </div>

        {sorted.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={!canPrev}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-dark transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Предыдущий отзыв"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="min-w-[4rem] text-center text-sm font-semibold text-text-secondary">
              {index + 1} / {sorted.length}
            </span>
            <button
              type="button"
              onClick={() => setIndex((i) => Math.min(sorted.length - 1, i + 1))}
              disabled={!canNext}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-dark transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Следующий отзыв"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-bold text-dark">{current.authorName}</p>
            <p className="mt-0.5 text-xs text-text-secondary">
              {formatReviewDate(current.date)}
              {current.source === 'kaspi' && ' · Kaspi.kz'}
            </p>
          </div>
          <Stars rating={current.rating} />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
          {current.text}
        </p>
      </div>

      {sorted.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {sorted.map((review, i) => (
            <button
              key={review.id}
              type="button"
              onClick={() => setIndex(i)}
              className={`shrink-0 rounded-xl border px-4 py-3 text-left transition-colors ${
                i === index
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-surface hover:border-primary/50'
              }`}
            >
              <p className="text-sm font-semibold text-dark">{review.authorName}</p>
              <p className="mt-0.5 line-clamp-2 max-w-[200px] text-xs text-text-secondary">
                {review.text}
              </p>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
