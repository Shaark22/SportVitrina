interface LogoProps {
  className?: string
  variant?: 'default' | 'inverted'
}

export function Logo({ className = '', variant = 'default' }: LogoProps) {
  const src =
    variant === 'inverted'
      ? '/logo/sportking-logo-light.svg?v=1'
      : '/logo/sportking-logo.svg?v=1'

  return (
    <img
      src={src}
      alt="SPORT KING"
      className={`block shrink-0 object-contain object-left ${className}`}
      draggable={false}
    />
  )
}
