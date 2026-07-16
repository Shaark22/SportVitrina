import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost'

interface BaseProps {
  variant?: Variant
  className?: string
  children: ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-dark hover:bg-primary-hover active:scale-[0.98] hover:scale-[1.02]',
  secondary:
    'bg-dark text-white hover:bg-dark-secondary active:scale-[0.98] hover:scale-[1.02]',
  outline:
    'border-2 border-dark bg-transparent text-dark hover:bg-dark hover:text-white',
  ghost: 'bg-transparent text-dark hover:bg-border/60',
}

const base =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold uppercase tracking-wide transition-all duration-200'

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function ButtonLink({
  variant = 'primary',
  className = '',
  children,
  ...props
}: BaseProps & LinkProps) {
  return (
    <Link className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Link>
  )
}
