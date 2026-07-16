import { ButtonLink } from '../ui/Button'
import { SmartImage } from '../ui/SmartImage'
import { placeholderImages } from '../../data/images'

export function Hero() {
  return (
    <section className="bg-background">
      <div className="mx-auto grid min-w-0 max-w-7xl items-center gap-6 px-4 py-10 sm:gap-8 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:py-24 lg:px-8">
        <div className="animate-slide-up order-1 min-w-0">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-text-secondary sm:text-sm">
            SPORT KING
          </p>
          <h1 className="text-[1.65rem] font-extrabold uppercase leading-[1.1] tracking-tight text-dark sm:text-5xl md:text-6xl lg:text-7xl xl:text-[80px]">
            Тренируйся дома — будь сильным
          </h1>
          <p className="mt-3 text-base font-bold uppercase tracking-wide text-dark sm:text-lg md:text-xl">
            Создай свой зал дома
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-secondary sm:text-base md:text-lg">
            Шведские стенки, турники, брусья и спортивные комплексы для дома
            от SPORT KING.
          </p>
          <div className="mt-6 sm:mt-8">
            <ButtonLink to="/catalog" className="w-full sm:w-auto">
              Смотреть каталог
            </ButtonLink>
          </div>
        </div>

        <div className="animate-fade-in order-2 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm sm:rounded-3xl">
          <SmartImage
            src={placeholderImages.hero}
            alt="Домашнее спортивное оборудование SPORT KING в современном интерьере"
            className="aspect-square h-full w-full object-cover object-center"
            loading="eager"
          />
        </div>
      </div>
    </section>
  )
}
