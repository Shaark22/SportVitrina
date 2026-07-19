import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { YoutubeIcon } from '../ui/YoutubeIcon'
import { useData } from '../../context/DataContext'
import { getCategoriesWithProducts } from '../../utils/categoryCounts'
import { siteConfig } from '../../data/site'
import { trackContactClick } from '../../utils/analytics'
import { toTelHref } from '../../utils/phone'
import { InstagramIcon } from '../ui/InstagramIcon'
import { Logo } from '../ui/Logo'

const footerLinks = [
  { to: '/', label: 'Главная' },
  { to: '/catalog', label: 'Каталог' },
  { to: '/about', label: 'О нас' },
  { to: '/delivery', label: 'Доставка и оплата' },
  { to: '/contacts', label: 'Контакты' },
]

export function Footer() {
  const { categories, products } = useData()

  const visibleCategories = useMemo(
    () => getCategoriesWithProducts(categories, products),
    [categories, products],
  )

  return (
    <footer className="bg-dark-secondary text-white">
      <div className="site-container py-12 sm:py-16 supports-[padding:max(0px)]:pb-[max(3rem,env(safe-area-inset-bottom))] lg:py-16">
        <div className="grid min-w-0 gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-4">
          <div className="min-w-0 lg:col-span-1">
            <Link to="/" className="mb-4 inline-flex items-center" aria-label="SPORT KING — на главную">
              <Logo size="nav" variant="inverted" />
            </Link>
            <p className="text-sm leading-relaxed text-white/70">
              {siteConfig.description}
            </p>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-primary">
              {siteConfig.tagline}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">
              Меню
            </h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">
              Категории
            </h3>
            <ul className="space-y-3">
              {visibleCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">
              Контакты
            </h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <a
                  href={toTelHref(siteConfig.phone)}
                  onClick={() => trackContactClick('phone')}
                  className="transition-colors hover:text-white"
                >
                  {siteConfig.phone}
                </a>
              </li>
              <li>{siteConfig.cities.join(' • ')}</li>
            </ul>
            <div className="mt-6 flex gap-3">
              <a
                href={siteConfig.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackContactClick('whatsapp')}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition-colors hover:bg-primary hover:text-dark"
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackContactClick('instagram')}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition-colors hover:bg-primary hover:text-dark"
                aria-label="Instagram"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href={siteConfig.youtube}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackContactClick('youtube')}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition-colors hover:bg-primary hover:text-dark"
                aria-label="YouTube"
              >
                <YoutubeIcon size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-white/50">
          © {new Date().getFullYear()} SPORT KING. Все права защищены.
        </div>
      </div>
    </footer>
  )
}
