import { ButtonLink } from '../ui/Button'
import { trackContactClick } from '../../utils/analytics'

export function CTASection() {
  return (
    <section className="bg-dark py-16 md:py-24">
      <div className="site-container text-center">
        <h2 className="text-section-title font-extrabold uppercase tracking-tight text-white">
          Создай свой зал дома
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-white/70 md:text-lg">
          Выбери оборудование, изучи характеристики и покупай напрямую на Kaspi
          — быстро и удобно.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <ButtonLink to="/catalog">Смотреть каталог</ButtonLink>
          <ButtonLink
            to="/contacts"
            variant="outline"
            className="!border-white !text-white hover:!bg-white hover:!text-dark"
            onClick={() => trackContactClick('contacts_cta')}
          >
            Связаться с нами
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
