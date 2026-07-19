interface BadgeProps {
  label: 'ХИТ' | 'НОВИНКА' | 'АКЦИЯ'
}

const styles: Record<BadgeProps['label'], string> = {
  ХИТ: 'bg-primary text-dark',
  НОВИНКА: 'bg-dark text-white',
  АКЦИЯ: 'bg-success text-white',
}

export function Badge({ label }: BadgeProps) {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider sm:rounded-lg sm:px-2.5 sm:py-1 sm:text-xs ${styles[label]}`}
    >
      {label}
    </span>
  )
}

export function DiscountBadge({ percent }: { percent: number }) {
  return (
    <span className="inline-flex rounded-md bg-dark px-2 py-0.5 text-[10px] font-extrabold text-white sm:rounded-lg sm:px-2.5 sm:py-1 sm:text-xs">
      −{percent}%
    </span>
  )
}
