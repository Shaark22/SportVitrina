import type { ReactNode } from 'react'

export function CategoryGrid({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`category-grid ${className}`.trim()}>{children}</div>
}
