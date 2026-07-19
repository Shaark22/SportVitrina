import { MapPin, MessageCircle, Phone } from 'lucide-react'
import { YoutubeIcon } from '../components/ui/YoutubeIcon'
import { usePageMeta } from '../hooks/usePageMeta'
import { useData } from '../context/DataContext'
import { trackContactClick } from '../utils/analytics'
import { formatWhatsAppDisplay, getInstagramLabel } from '../utils/contacts'
import { toTelHref } from '../utils/phone'
import { safeExternalUrl, safeWhatsAppUrl } from '../utils/safeUrl'
import { ButtonLink } from '../components/ui/Button'
import { InstagramIcon } from '../components/ui/InstagramIcon'

export function Contacts() {
  const { siteSettings } = useData()
  const { contacts } = siteSettings
  const whatsappUrl = safeWhatsAppUrl(contacts.whatsapp, contacts.whatsapp)
  const instagramUrl = safeExternalUrl(contacts.instagram, contacts.instagram)
  const youtubeUrl = safeExternalUrl(contacts.youtube, contacts.youtube)

  usePageMeta({
    title: 'Контакты — SPORT KING',
    description:
      'Контакты SPORT KING: телефон, WhatsApp, Instagram, YouTube.',
  })

  const contactItems = [
    {
      icon: Phone,
      label: 'Телефон',
      value: contacts.phone,
      href: toTelHref(contacts.phone),
      track: 'phone' as const,
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: formatWhatsAppDisplay(contacts.whatsapp),
      href: whatsappUrl,
      external: true,
      track: 'whatsapp' as const,
    },
    {
      icon: InstagramIcon,
      label: 'Instagram',
      value: getInstagramLabel(contacts.instagram, contacts.instagramLabel),
      href: instagramUrl,
      external: true,
      track: 'instagram' as const,
    },
    {
      icon: YoutubeIcon,
      label: 'YouTube',
      value: contacts.youtubeLabel,
      href: youtubeUrl,
      external: true,
      track: 'youtube' as const,
    },
    {
      icon: MapPin,
      label: 'Адрес',
      value: contacts.address,
    },
    {
      icon: MapPin,
      label: 'Город',
      value: contacts.cities,
    },
  ]

  return (
    <div className="bg-background py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-page-title font-extrabold uppercase tracking-tight text-dark">
          Контакты
        </h1>
        <p className="mt-4 text-base text-text-secondary md:text-lg">{contacts.intro}</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {contactItems.map((item) => {
            const Icon = item.icon
            const content = (
              <div className="flex h-full items-start gap-4 rounded-2xl border border-border bg-surface p-6 transition-transform duration-200 hover:scale-[1.02]">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-dark">
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-text-secondary">
                    {item.label}
                  </p>
                  <p className="mt-1 text-base font-semibold text-dark">{item.value}</p>
                </div>
              </div>
            )

            if (item.href) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  onClick={() => item.track && trackContactClick(item.track)}
                  className="block"
                >
                  {content}
                </a>
              )
            }

            return <div key={item.label}>{content}</div>
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-surface p-8 text-center">
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
            <ButtonLink to="/catalog">Смотреть каталог</ButtonLink>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContactClick('contacts_page_instagram')}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-dark px-6 text-sm font-bold uppercase tracking-wide text-dark transition-all hover:bg-dark hover:text-white"
            >
              Instagram
            </a>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContactClick('contacts_page_youtube')}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-dark px-6 text-sm font-bold uppercase tracking-wide text-dark transition-all hover:bg-dark hover:text-white"
            >
              <YoutubeIcon size={18} />
              YouTube
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
