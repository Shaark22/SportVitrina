import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Category } from '../../types/category'
import { formatPrice } from '../../utils/formatPrice'
import { SmartImage } from './SmartImage'

interface CategoryCardProps {
  category: Category
  productCount?: number
}

export function CategoryCard({ category, productCount }: CategoryCardProps) {
  return (
    <Link
      to={`/category/${category.slug}`}
      className="category-card group"
    >
      <div className="category-card-image">
        <SmartImage
          src={category.image}
          alt={category.name}
          className="category-card-img"
          aspect=""
        />
        <div className="category-card-image-overlay" aria-hidden />
      </div>

      <div className="category-card-body">
        <div className="category-card-info">
          <h3 className="category-card-title">{category.name}</h3>
          <p className="category-card-meta">
            <span>от {formatPrice(category.priceFrom)}</span>
            {productCount !== undefined && productCount > 0 && (
              <>
                <span className="category-card-meta-dot" aria-hidden>
                  ·
                </span>
                <span>{productCount} товаров</span>
              </>
            )}
          </p>
        </div>

        <span className="category-card-arrow" aria-hidden>
          <ArrowRight size={16} strokeWidth={2.5} className="sm:hidden" />
          <ArrowRight size={18} strokeWidth={2.5} className="hidden sm:block" />
        </span>
      </div>
    </Link>
  )
}
