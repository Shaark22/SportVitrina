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
      className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${styles[label]}`}
    >
      {label}
    </span>
  )
}
