import { usePageMeta } from '../hooks/usePageMeta'
import { siteConfig } from '../data/site'

export function About() {
  usePageMeta({
    title: 'О нас — SPORT KING',
    description:
      'SPORT KING — современный бренд спортивного оборудования для домашних тренировок в Казахстане.',
  })

  return (
    <div className="bg-background py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-page-title font-extrabold uppercase tracking-tight text-dark">
          О SPORT KING
        </h1>

        <div className="mt-8 space-y-6 text-base leading-relaxed text-text-secondary md:text-lg">
          <p>
            <strong className="text-dark">SPORT KING</strong> — бренд
            спортивного оборудования для домашних тренировок. Мы создаём
            решения, которые помогают тренироваться дома — без походов в зал и
            без лишней сложности.
          </p>
          <p>
            В ассортименте — шведские стенки, турники, брусья, перекладины и
            комплексы 3-в-1. Каждая модель рассчитана на регулярные нагрузки и
            удобную установку в квартире или частном доме.
          </p>
          <p>
            Наш подход простой: надёжное оборудование, понятные характеристики
            и покупка через Kaspi — быстро и удобно.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            { title: 'Качество', text: 'Прочные металлические конструкции для ежедневных тренировок.' },
            { title: 'Функциональность', text: 'Оборудование для силы, выносливости и детского спорта.' },
            { title: 'Доступность', text: 'Покупка напрямую на Kaspi с доставкой по Казахстану.' },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <h2 className="text-lg font-bold uppercase text-dark">
                {item.title}
              </h2>
              <p className="mt-2 text-sm text-text-secondary">{item.text}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-sm font-bold uppercase tracking-[0.2em] text-primary">
          {siteConfig.tagline}
        </p>
      </div>
    </div>
  )
}
