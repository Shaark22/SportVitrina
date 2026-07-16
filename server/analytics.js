import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const CONTACT_TYPES = new Set([
  'whatsapp',
  'instagram',
  'youtube',
  'phone',
  'contacts_cta',
  'contacts_page_instagram',
  'contacts_page_youtube',
])

const EVENT_TYPES = new Set([
  'page_view',
  'contact_click',
  'product_view',
  'product_click',
  'kaspi_click',
])

const MAX_VISITOR_IDS = 50_000

export function createAnalyticsStore(analyticsPath) {
  function defaultData() {
    return {
      version: 2,
      updatedAt: new Date().toISOString(),
      totals: {
        uniqueVisitors: 0,
        pageViews: 0,
        contacts: {},
        products: {},
      },
      daily: {},
    }
  }

  function migrate(data) {
    let changed = false
    if (!data.totals) {
      data.totals = defaultData().totals
      changed = true
    }
    if (data.totals.visits !== undefined && data.totals.pageViews === undefined) {
      data.totals.pageViews = data.totals.visits
      delete data.totals.visits
      changed = true
    }
    if (data.totals.pageViews === undefined) {
      data.totals.pageViews = 0
      changed = true
    }
    if (data.totals.uniqueVisitors === undefined) {
      data.totals.uniqueVisitors = 0
      changed = true
    }
    if (!data.totals._visitorIds) {
      data.totals._visitorIds = []
      changed = true
    }
    if (!data.totals.products) {
      data.totals.products = {}
      changed = true
    }
    if (!data.totals.contacts) {
      data.totals.contacts = {}
      changed = true
    }
    if (data.totals.pages) {
      delete data.totals.pages
      changed = true
    }
    if (data.version !== 2) {
      data.version = 2
      changed = true
    }
    if (!data.daily || typeof data.daily !== 'object') {
      data.daily = {}
      changed = true
    }

    for (const [day, daily] of Object.entries(data.daily)) {
      if (daily.visits !== undefined && daily.pageViews === undefined) {
        daily.pageViews = daily.visits
        delete daily.visits
        changed = true
      }
      if (daily.pageViews === undefined) {
        daily.pageViews = 0
        changed = true
      }
      if (daily.uniqueVisitors === undefined) {
        daily.uniqueVisitors = 0
        changed = true
      }
      if (!daily._visitorIds) {
        daily._visitorIds = []
        changed = true
      }
      if (daily.pages) {
        delete daily.pages
        changed = true
      }
      data.daily[day] = daily
    }

    return { data, changed }
  }

  function readAnalytics() {
    if (!existsSync(analyticsPath)) {
      const data = defaultData()
      writeFileSync(analyticsPath, JSON.stringify(data, null, 2))
      return data
    }
    try {
      const raw = JSON.parse(readFileSync(analyticsPath, 'utf8'))
      const { data, changed } = migrate(raw)
      if (changed) writeAnalytics(data)
      return data
    } catch {
      const data = defaultData()
      writeFileSync(analyticsPath, JSON.stringify(data, null, 2))
      return data
    }
  }

  function writeAnalytics(data) {
    data.updatedAt = new Date().toISOString()
    writeFileSync(analyticsPath, JSON.stringify(data, null, 2))
  }

  function todayKey() {
    return new Date().toISOString().slice(0, 10)
  }

  function ensureDaily(data, day) {
    if (!data.daily || typeof data.daily !== 'object') {
      data.daily = {}
    }
    if (!data.daily[day]) {
      data.daily[day] = {
        uniqueVisitors: 0,
        pageViews: 0,
        contacts: {},
        products: {},
        _visitorIds: [],
      }
    }
    const daily = data.daily[day]
    if (daily.visits !== undefined && daily.pageViews === undefined) {
      daily.pageViews = daily.visits
      delete daily.visits
    }
    if (daily.uniqueVisitors === undefined) daily.uniqueVisitors = 0
    if (!daily._visitorIds) daily._visitorIds = []
    if (!daily.products) daily.products = {}
    if (!daily.contacts) daily.contacts = {}
    if (daily.pages) delete daily.pages
    return daily
  }

  function registerUniqueVisitor(data, daily, visitorId) {
    if (!visitorId) return

    if (!daily._visitorIds.includes(visitorId)) {
      daily._visitorIds.push(visitorId)
      daily.uniqueVisitors = daily._visitorIds.length
    }

    if (!data.totals._visitorIds.includes(visitorId)) {
      data.totals._visitorIds.push(visitorId)
      data.totals.uniqueVisitors = data.totals._visitorIds.length
    }

    if (data.totals._visitorIds.length > MAX_VISITOR_IDS) {
      data.totals._visitorIds = data.totals._visitorIds.slice(-MAX_VISITOR_IDS)
      data.totals.uniqueVisitors = data.totals._visitorIds.length
    }
  }

  function ensureProduct(bucket, productId, meta = {}) {
    if (!bucket[productId]) {
      bucket[productId] = {
        views: 0,
        clicks: 0,
        kaspiClicks: 0,
        slug: meta.slug || '',
        name: meta.name || '',
      }
    }
    if (meta.slug) bucket[productId].slug = meta.slug
    if (meta.name) bucket[productId].name = meta.name
    return bucket[productId]
  }

  function inc(map, key, amount = 1) {
    map[key] = (map[key] || 0) + amount
  }

  function trackEvent(payload) {
    if (!payload?.type || !EVENT_TYPES.has(payload.type)) {
      throw new Error('Invalid analytics event')
    }

    const data = readAnalytics()
    const day = todayKey()
    const daily = ensureDaily(data, day)
    const visitorId = String(payload.visitorId || '').slice(0, 64)

    if (payload.type === 'page_view') {
      const path = String(payload.path || '/').slice(0, 200)
      if (path.startsWith('/admin')) return data
      registerUniqueVisitor(data, daily, visitorId)
      data.totals.pageViews += 1
      daily.pageViews += 1
    }

    if (payload.type === 'contact_click') {
      const contact = String(payload.contact || '')
      if (!CONTACT_TYPES.has(contact)) throw new Error('Invalid contact type')
      inc(data.totals.contacts, contact)
      inc(daily.contacts, contact)
    }

    if (
      payload.type === 'product_view' ||
      payload.type === 'product_click' ||
      payload.type === 'kaspi_click'
    ) {
      const productId = String(payload.productId || '').slice(0, 80)
      if (!productId) throw new Error('Missing productId')
      const meta = {
        slug: String(payload.slug || '').slice(0, 120),
        name: String(payload.name || '').slice(0, 200),
      }
      const totalProduct = ensureProduct(data.totals.products, productId, meta)
      const dailyProduct = ensureProduct(daily.products, productId, meta)

      if (payload.type === 'product_view') {
        totalProduct.views += 1
        dailyProduct.views += 1
      }
      if (payload.type === 'product_click') {
        totalProduct.clicks += 1
        dailyProduct.clicks += 1
      }
      if (payload.type === 'kaspi_click') {
        totalProduct.kaspiClicks += 1
        dailyProduct.kaspiClicks += 1
      }
    }

    writeAnalytics(data)
    return data
  }

  function getSummary(storeProducts) {
    const data = readAnalytics()
    const products = Array.isArray(storeProducts) ? storeProducts : []
    const productNames = new Map(
      products.map((p) => [p.id, { name: p.name, slug: p.slug }]),
    )

    const totals = data.totals || defaultData().totals
    const productStats = totals.products || {}
    const contactStats = totals.contacts || {}

    const enrichProducts = (key) =>
      Object.entries(productStats)
        .filter(([, stats]) => stats[key] > 0)
        .map(([id, stats]) => ({
          productId: id,
          name: productNames.get(id)?.name || stats.name || id,
          slug: productNames.get(id)?.slug || stats.slug || '',
          views: stats.views,
          clicks: stats.clicks,
          kaspiClicks: stats.kaspiClicks,
        }))
        .sort((a, b) => b[key] - a[key])
        .slice(0, 10)

    const topClicks = enrichProducts('clicks')
    const topKaspi = enrichProducts('kaspiClicks')

    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      const day = data.daily[key]
      last7Days.push({
        date: key,
        uniqueVisitors: day?.uniqueVisitors || 0,
        pageViews: day?.pageViews || 0,
      })
    }

    const contactLabels = {
      whatsapp: 'WhatsApp',
      instagram: 'Instagram',
      youtube: 'YouTube',
      phone: 'Телефон',
      contacts_cta: 'Кнопка «Связаться»',
      contacts_page_instagram: 'Instagram (страница контактов)',
      contacts_page_youtube: 'YouTube (страница контактов)',
    }

    const contacts = Object.entries(contactStats)
      .map(([key, count]) => ({
        key,
        label: contactLabels[key] || key,
        count,
      }))
      .sort((a, b) => b.count - a.count)

    const totalKaspiClicks = Object.values(productStats).reduce(
      (sum, p) => sum + (p.kaspiClicks || 0),
      0,
    )

    return {
      updatedAt: data.updatedAt || new Date().toISOString(),
      totals: {
        uniqueVisitors: totals.uniqueVisitors || 0,
        pageViews: totals.pageViews || 0,
        contactClicks: contacts.reduce((sum, c) => sum + c.count, 0),
        kaspiClicks: totalKaspiClicks,
      },
      contacts,
      topClicks,
      topKaspi,
      last7Days,
    }
  }

  return { trackEvent, getSummary, readAnalytics }
}
