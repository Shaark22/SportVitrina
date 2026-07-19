import { ButtonLink } from '../ui/Button'
import { SmartImage } from '../ui/SmartImage'
import { placeholderImages } from '../../data/images'

export function Hero() {
  return (
    <section className="bg-background">
      <div className="site-container hero-grid py-10 sm:py-14 lg:py-16 xl:py-20">
        <div className="hero-copy animate-slide-up order-1">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-text-secondary sm:text-sm">
            SPORT KING
          </p>
          <h1 className="text-display font-extrabold uppercase tracking-tight text-dark">
            Тренируйся дома — Когда удобно
          </h1>
          <p className="mt-3 text-sm font-bold uppercase tracking-wide text-dark sm:text-base lg:text-lg">
            Создай свой зал дома
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-text-secondary sm:text-base">
            Шведские стенки, турники, брусья и спортивные комплексы для дома
            от SPORT KING.
          </p>
          <div className="mt-6 sm:mt-8">
            <ButtonLink to="/catalog" className="w-full sm:w-auto">
              Смотреть каталог
            </ButtonLink>
          </div>
        </div>

        <div className="hero-media animate-fade-in order-2">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm sm:rounded-3xl">
            <SmartImage
              src={placeholderImages.hero}
              alt="Домашнее спортивное оборудование SPORT KING в современном интерьере"
              className="aspect-[5/4] w-full object-cover object-center sm:aspect-square"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
