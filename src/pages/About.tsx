import { usePageMeta } from '../hooks/usePageMeta'
import { useData } from '../context/DataContext'

export function About() {
  const { siteSettings } = useData()
  const { about } = siteSettings

  usePageMeta({
    title: 'О нас — SPORT KING',
    description:
      'SPORT KING — современный бренд спортивного оборудования для домашних тренировок в Казахстане.',
  })

  return (
    <div className="bg-background py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-page-title font-extrabold uppercase tracking-tight text-dark">
          {about.pageTitle}
        </h1>

        <div className="mt-8 space-y-6 text-base leading-relaxed text-text-secondary md:text-lg">
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {about.values.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <h2 className="text-lg font-bold uppercase text-dark">{item.title}</h2>
              <p className="mt-2 text-sm text-text-secondary">{item.text}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-sm font-bold uppercase tracking-[0.2em] text-primary">
          {siteSettings.tagline}
        </p>
      </div>
    </div>
  )
}
