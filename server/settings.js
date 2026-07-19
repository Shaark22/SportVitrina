import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const LIMITS = {
  eyebrow: 80,
  title: 120,
  subtitle: 120,
  description: 500,
  ctaLabel: 60,
  ctaLink: 200,
  image: 2048,
  imageAlt: 200,
  tagline: 200,
  descriptionSite: 500,
  phone: 40,
  url: 500,
  label: 80,
  address: 200,
  cities: 200,
  intro: 300,
  pageTitle: 120,
  stepsTitle: 80,
  paragraph: 1000,
  valueTitle: 60,
  valueText: 300,
}

function trim(str, max) {
  return String(str ?? '')
    .trim()
    .slice(0, max)
}

function sanitizeInternalPath(path, fallback) {
  const value = trim(path, LIMITS.ctaLink) || fallback
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('://')) {
    return fallback
  }
  return value
}

function sanitizeImageUrl(url, fallback) {
  const value = trim(url, LIMITS.image)
  if (!value) return fallback
  if (value.startsWith('/') && !value.startsWith('//')) return value
  try {
    const parsed = new URL(value)
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') return value
  } catch {
    /* invalid URL */
  }
  return fallback
}

function sanitizeHttpUrl(url, fallback) {
  const value = trim(url, LIMITS.url)
  if (!value) return fallback
  try {
    const parsed = new URL(value)
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') return value
  } catch {
    /* invalid URL */
  }
  return fallback
}

function sanitizeWhatsAppUrl(url, fallback) {
  const value = trim(url, LIMITS.url)
  if (/^https:\/\/wa\.me\/\d+/i.test(value)) return value.split('?')[0]
  return sanitizeHttpUrl(value, fallback)
}

function normalizeHero(hero, fallback) {
  const base = fallback?.hero ?? {}
  const safeLink = sanitizeInternalPath(hero?.ctaLink ?? base.ctaLink, '/catalog')

  return {
    eyebrow: trim(hero?.eyebrow ?? base.eyebrow, LIMITS.eyebrow) || 'SPORT KING',
    title:
      trim(hero?.title ?? base.title, LIMITS.title) ||
      'Тренируйся дома — Когда удобно',
    subtitle:
      trim(hero?.subtitle ?? base.subtitle, LIMITS.subtitle) ||
      'Создай свой зал дома',
    description:
      trim(hero?.description ?? base.description, LIMITS.description) ||
      base.description ||
      '',
    ctaLabel:
      trim(hero?.ctaLabel ?? base.ctaLabel, LIMITS.ctaLabel) || 'Смотреть каталог',
    ctaLink: safeLink,
    image: sanitizeImageUrl(hero?.image ?? base.image, '/images/hero-main.png'),
    imageAlt:
      trim(hero?.imageAlt ?? base.imageAlt, LIMITS.imageAlt) ||
      'Спортивное оборудование SPORT KING',
  }
}

function normalizeContacts(contacts, fallback) {
  const base = fallback?.contacts ?? {}
  return {
    phone: trim(contacts?.phone ?? base.phone, LIMITS.phone) || '+7 778 576 6700',
    whatsapp: sanitizeWhatsAppUrl(
      contacts?.whatsapp ?? base.whatsapp,
      'https://wa.me/77785766700',
    ),
    instagram: sanitizeHttpUrl(
      contacts?.instagram ?? base.instagram,
      'https://www.instagram.com/turnik_kzz/',
    ),
    youtube: sanitizeHttpUrl(
      contacts?.youtube ?? base.youtube,
      'https://www.youtube.com/@SPORTKING-KZ',
    ),
    instagramLabel:
      trim(contacts?.instagramLabel ?? base.instagramLabel, LIMITS.label) ||
      '@turnik_kzz',
    youtubeLabel:
      trim(contacts?.youtubeLabel ?? base.youtubeLabel, LIMITS.label) ||
      '@SPORTKING-KZ',
    address:
      trim(contacts?.address ?? base.address, LIMITS.address) ||
      'Усть-Каменогорск, проспект Сатпаева',
    cities: trim(contacts?.cities ?? base.cities, LIMITS.cities) || 'Усть-Каменогорск',
    intro:
      trim(contacts?.intro ?? base.intro, LIMITS.intro) ||
      'Свяжитесь с нами для консультации по выбору оборудования.',
  }
}

function normalizeStringList(list, fallbackList, maxItems = 8) {
  const source =
    Array.isArray(list) && list.some((item) => String(item || '').trim())
      ? list
      : fallbackList
  if (!Array.isArray(source)) return []
  return source
    .map((item) => trim(item, LIMITS.paragraph))
    .filter(Boolean)
    .slice(0, maxItems)
}

function normalizeAbout(about, fallback) {
  const base = fallback?.about ?? {}
  const valuesSource = Array.isArray(about?.values) ? about.values : base.values
  const valuesBase = Array.isArray(base.values) ? base.values : []
  const values = [0, 1, 2].map((i) => ({
    title: trim(valuesSource?.[i]?.title ?? valuesBase[i]?.title, LIMITS.valueTitle) ||
      valuesBase[i]?.title ||
      'Заголовок',
    text: trim(valuesSource?.[i]?.text ?? valuesBase[i]?.text, LIMITS.valueText) ||
      valuesBase[i]?.text ||
      '',
  }))

  const paragraphs = normalizeStringList(about?.paragraphs, base.paragraphs, 6)
  if (!paragraphs.length && base.paragraphs?.[0]) {
    paragraphs.push(trim(base.paragraphs[0], LIMITS.paragraph))
  }

  return {
    pageTitle:
      trim(about?.pageTitle ?? base.pageTitle, LIMITS.pageTitle) || 'О SPORT KING',
    paragraphs: paragraphs.filter(Boolean),
    values,
  }
}

function normalizeDelivery(delivery, fallback) {
  const base = fallback?.delivery ?? {}
  return {
    pageTitle:
      trim(delivery?.pageTitle ?? base.pageTitle, LIMITS.pageTitle) ||
      'Доставка и оплата',
    stepsTitle:
      trim(delivery?.stepsTitle ?? base.stepsTitle, LIMITS.stepsTitle) ||
      'Как купить',
    steps: normalizeStringList(delivery?.steps, base.steps, 8),
    paragraphs: normalizeStringList(delivery?.paragraphs, base.paragraphs, 6),
  }
}

function normalizeSettings(data, fallback) {
  return {
    version: 2,
    hero: normalizeHero(data?.hero, fallback),
    tagline:
      trim(data?.tagline, LIMITS.tagline) ||
      fallback?.tagline ||
      'Тренируйся дома. Создай свой зал.',
    description:
      trim(data?.description, LIMITS.descriptionSite) ||
      fallback?.description ||
      '',
    contacts: normalizeContacts(data?.contacts, fallback),
    about: normalizeAbout(data?.about, fallback),
    delivery: normalizeDelivery(data?.delivery, fallback),
  }
}

export function createSettingsStore(settingsPath, defaultsPath) {
  function readDefaults() {
    if (existsSync(defaultsPath)) {
      try {
        const raw = JSON.parse(readFileSync(defaultsPath, 'utf8'))
        return normalizeSettings(raw, raw)
      } catch {
        /* fall through */
      }
    }
    return normalizeSettings({}, {})
  }

  function read() {
    const defaults = readDefaults()
    if (!existsSync(settingsPath)) return defaults
    try {
      const data = JSON.parse(readFileSync(settingsPath, 'utf8'))
      return normalizeSettings(data, defaults)
    } catch {
      return defaults
    }
  }

  function write(data) {
    writeFileSync(settingsPath, JSON.stringify(data, null, 2))
  }

  function getSettings() {
    return read()
  }

  function updateSettings(patch) {
    const current = read()
    const merged = {
      ...current,
      ...patch,
      hero: { ...current.hero, ...(patch.hero || {}) },
      contacts: { ...current.contacts, ...(patch.contacts || {}) },
      about: {
        ...current.about,
        ...(patch.about || {}),
        values:
          patch.about?.values !== undefined
            ? patch.about.values
            : current.about.values,
        paragraphs:
          patch.about?.paragraphs !== undefined
            ? patch.about.paragraphs
            : current.about.paragraphs,
      },
      delivery: {
        ...current.delivery,
        ...(patch.delivery || {}),
        steps:
          patch.delivery?.steps !== undefined
            ? patch.delivery.steps
            : current.delivery.steps,
        paragraphs:
          patch.delivery?.paragraphs !== undefined
            ? patch.delivery.paragraphs
            : current.delivery.paragraphs,
      },
    }
    const next = normalizeSettings(merged, readDefaults())

    if (!next.hero.title) throw new Error('Заголовок главного экрана обязателен')
    if (!next.hero.image) throw new Error('Фото главного экрана обязательно')

    write(next)
    return next
  }

  function resetSettings() {
    const defaults = readDefaults()
    write(defaults)
    return defaults
  }

  return { getSettings, updateSettings, resetSettings }
}
