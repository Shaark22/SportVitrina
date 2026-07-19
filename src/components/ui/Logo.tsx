interface LogoProps {
  className?: string
  variant?: 'default' | 'inverted'
  size?: 'nav' | 'hero'
}

const sizeClasses: Record<NonNullable<LogoProps['size']>, string> = {
  nav: 'h-9 w-auto sm:h-10',
  hero: 'h-11 w-auto sm:h-12',
}

export function Logo({
  className = '',
  variant = 'default',
  size = 'nav',
}: LogoProps) {
  const src =
    variant === 'inverted'
      ? '/logo/sportking-logo-light.svg?v=1'
      : '/logo/sportking-logo.svg?v=1'

  return (
    <img
      src={src}
      alt="SPORT KING"
      className={`block shrink-0 object-contain object-left ${sizeClasses[size]} ${className}`}
      draggable={false}
    />
  )
}
