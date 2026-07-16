import { Link } from 'react-router-dom'
import type { Product } from '../../types/product'
import { formatPrice } from '../../utils/formatPrice'
import { openKaspi } from '../../hooks/usePageMeta'
import { trackProductClick } from '../../utils/analytics'
import { Badge } from './Badge'
import { Rating } from './Rating'
import { Button } from './Button'
import { SmartImage } from './SmartImage'

interface ProductCardProps {
  product: Product
}

function handleProductClick(product: Product) {
  trackProductClick({
    id: product.id,
    slug: product.slug,
    name: product.name,
  })
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface transition-transform duration-200 hover:scale-[1.02] sm:rounded-2xl max-sm:hover:scale-100">
      <Link
        to={`/product/${product.slug}`}
        className="relative block"
        onClick={() => handleProductClick(product)}
      >
        <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-white p-1.5 sm:p-3">
          <SmartImage
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
            aspect=""
          />
        </div>
        {product.badge && (
          <div className="absolute left-2 top-2 sm:left-4 sm:top-4">
            <Badge label={product.badge} />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-2.5 sm:p-5">
        <Link
          to={`/product/${product.slug}`}
          onClick={() => handleProductClick(product)}
        >
          <h3 className="line-clamp-3 text-xs font-bold leading-snug text-dark transition-colors hover:text-text-secondary sm:line-clamp-none sm:text-base md:text-lg">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1.5 sm:mt-2">
          <Rating rating={product.rating} reviewsCount={product.reviewsCount} size="sm" />
        </div>

        <div className="mt-2 flex flex-wrap items-baseline gap-1 sm:mt-3 sm:gap-2">
          <span className="text-sm font-extrabold text-dark sm:text-xl">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-[10px] text-text-secondary line-through sm:text-sm">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        <div className="mt-auto pt-2.5 sm:pt-4">
          <Button
            className="w-full min-h-10 px-2 text-[10px] sm:min-h-12 sm:px-6 sm:text-sm"
            onClick={() =>
              openKaspi(product.kaspiUrl, {
                id: product.id,
                slug: product.slug,
                name: product.name,
              })
            }
            aria-label={`Купить ${product.name} на Kaspi`}
          >
            <span className="sm:hidden">KASPI</span>
            <span className="hidden sm:inline">Купить на KASPI</span>
          </Button>
        </div>
      </div>
    </article>
  )
}
