import { Activity, Dumbbell, ShieldCheck, Wrench } from 'lucide-react'

const benefits = [
  {
    icon: ShieldCheck,
    title: 'Надёжные конструкции',
    text: 'Созданы для регулярных тренировок.',
  },
  {
    icon: Dumbbell,
    title: 'Выдерживают нагрузки',
    text: 'Надёжное оборудование для дома.',
  },
  {
    icon: Wrench,
    title: 'Простая установка',
    text: 'Всё необходимое для монтажа.',
  },
  {
    icon: Activity,
    title: 'Тренируйся каждый день',
    text: 'Спорт всегда рядом.',
  },
]

export function Benefits() {
  return (
    <section className="bg-surface py-12 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-background p-5 sm:p-6 transition-transform duration-200 hover:scale-[1.02]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-dark">
                <Icon size={22} strokeWidth={2.5} />
              </div>
              <h3 className="text-base font-bold uppercase tracking-wide text-dark md:text-lg">
                {title}
              </h3>
              <p className="mt-2 text-sm text-text-secondary">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
