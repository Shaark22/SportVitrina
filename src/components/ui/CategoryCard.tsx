import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Category } from '../../types/category'
import { formatPrice } from '../../utils/formatPrice'
import { SmartImage } from './SmartImage'

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`/category/${category.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface transition-transform duration-200 hover:scale-[1.02] sm:rounded-2xl max-sm:hover:scale-100"
    >
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-white p-1.5 sm:p-2">
        <SmartImage
          src={category.image}
          alt={category.name}
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          aspect=""
        />
      </div>
      <div className="flex items-center justify-between gap-2 p-2.5 sm:p-5">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-dark sm:text-lg md:text-xl">
            {category.name}
          </h3>
          <p className="mt-0.5 text-[10px] text-text-secondary sm:mt-1 sm:text-sm">
            от {formatPrice(category.priceFrom)}
          </p>
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-dark transition-transform group-hover:scale-105 sm:h-10 sm:w-10">
          <ArrowUpRight size={16} className="sm:hidden" />
          <ArrowUpRight size={18} className="hidden sm:block" />
        </div>
      </div>
    </Link>
  )
}
