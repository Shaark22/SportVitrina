import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { MessageCircle, Menu } from 'lucide-react'
import { YoutubeIcon } from '../ui/YoutubeIcon'
import { siteConfig } from '../../data/site'
import { trackContactClick } from '../../utils/analytics'
import { ButtonLink } from '../ui/Button'
import { InstagramIcon } from '../ui/InstagramIcon'
import { Logo } from '../ui/Logo'
import { MobileMenu } from './MobileMenu'

const navLinks = [
  { to: '/', label: 'Главная' },
  { to: '/catalog', label: 'Каталог' },
  { to: '/about', label: 'О нас' },
  { to: '/delivery', label: 'Доставка и оплата' },
  { to: '/contacts', label: 'Контакты' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 supports-[padding:max(0px)]:pt-[env(safe-area-inset-top)] ${
          scrolled
            ? 'border-b border-border bg-surface/95 shadow-sm backdrop-blur-md'
            : 'bg-background'
        }`}
      >
        <div className="mx-auto flex min-w-0 max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:gap-3 sm:px-6 sm:py-4 lg:px-8">
          <Link
            to="/"
            className="flex min-w-0 max-w-[58%] shrink items-center sm:max-w-none"
            aria-label="SPORT KING — на главную"
          >
            <Logo className="h-9 w-[108px] sm:h-11 sm:w-[140px] md:h-12 md:w-[160px]" />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Основная навигация">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `text-sm font-semibold uppercase tracking-wide transition-colors ${
                    isActive
                      ? 'text-dark underline decoration-primary decoration-2 underline-offset-4'
                      : 'text-text-secondary hover:text-dark'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={siteConfig.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContactClick('whatsapp')}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-dark transition-colors hover:border-dark hover:bg-dark hover:text-white"
              aria-label="WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
            <a
              href={siteConfig.instagram}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContactClick('instagram')}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-dark transition-colors hover:border-dark hover:bg-dark hover:text-white"
              aria-label="Instagram"
            >
              <InstagramIcon size={18} />
            </a>
            <a
              href={siteConfig.youtube}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContactClick('youtube')}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-dark transition-colors hover:border-dark hover:bg-dark hover:text-white"
              aria-label="YouTube"
            >
              <YoutubeIcon size={18} />
            </a>
            <ButtonLink
              to="/contacts"
              variant="secondary"
              className="!px-5 !text-xs"
              onClick={() => trackContactClick('contacts_cta')}
            >
              Связаться с нами
            </ButtonLink>
          </div>

          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-border lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Открыть меню"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
