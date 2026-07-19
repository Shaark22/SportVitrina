import { usePageMeta } from '../hooks/usePageMeta'
import { useData } from '../context/DataContext'

export function Delivery() {
  const { siteSettings } = useData()
  const { delivery } = siteSettings

  usePageMeta({
    title: 'Доставка и оплата — SPORT KING',
    description:
      'Как купить спортивное оборудование SPORT KING: выбор товара, оформление и оплата.',
  })

  return (
    <div className="bg-background py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-page-title font-extrabold uppercase tracking-tight text-dark">
          {delivery.pageTitle}
        </h1>

        <section className="mt-10 rounded-2xl border border-border bg-surface p-8 md:p-10">
          <h2 className="text-xl font-bold uppercase text-dark md:text-2xl">
            {delivery.stepsTitle}
          </h2>
          <ol className="mt-6 space-y-4">
            {delivery.steps.map((step, index) => (
              <li key={`${index}-${step}`} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-dark">
                  {index + 1}
                </span>
                <span className="pt-1 text-base text-text-secondary md:text-lg">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-8 space-y-4 text-base text-text-secondary md:text-lg">
          {delivery.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  )
}
