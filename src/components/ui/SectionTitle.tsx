interface SectionTitleProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

export function SectionTitle({
  title,
  subtitle,
  align = 'left',
}: SectionTitleProps) {
  return (
    <div className={`min-w-0 ${align === 'center' ? 'text-center' : ''}`}>
      <h2 className="text-section-title font-extrabold uppercase tracking-tight text-dark">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-base text-text-secondary md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  )
}
