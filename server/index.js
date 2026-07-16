import { randomBytes } from 'node:crypto'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import multer from 'multer'
import { createAnalyticsStore } from './analytics.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DATA_DIR = process.env.DATA_DIR || join(ROOT, 'server', 'data')
const UPLOADS_DIR = join(DATA_DIR, 'uploads')
const STORE_PATH = join(DATA_DIR, 'store.json')
const ANALYTICS_PATH = join(DATA_DIR, 'analytics.json')
const DEFAULTS_PATH = join(ROOT, 'server', 'data', 'store.json')
const BUNDLED_UPLOADS_DIR = join(ROOT, 'server', 'data', 'uploads')
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sportking'
const PORT = Number(process.env.PORT) || 3001
const isProd = process.env.NODE_ENV === 'production'

mkdirSync(DATA_DIR, { recursive: true })
mkdirSync(UPLOADS_DIR, { recursive: true })
seedDataFromProject()

function seedDataFromProject() {
  if (!existsSync(STORE_PATH) && existsSync(DEFAULTS_PATH)) {
    writeFileSync(STORE_PATH, readFileSync(DEFAULTS_PATH, 'utf8'))
  }

  if (!existsSync(BUNDLED_UPLOADS_DIR)) return

  for (const file of readdirSync(BUNDLED_UPLOADS_DIR)) {
    if (file === '.gitkeep') continue
    const target = join(UPLOADS_DIR, file)
    if (!existsSync(target)) {
      copyFileSync(join(BUNDLED_UPLOADS_DIR, file), target)
    }
  }
}

const sessions = new Map()
const analytics = createAnalyticsStore(ANALYTICS_PATH)
const rateBuckets = new Map()

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim()
  return req.socket.remoteAddress || 'unknown'
}

function rateLimit(req, max = 120, windowMs = 60_000) {
  const ip = clientIp(req)
  const now = Date.now()
  const bucket = rateBuckets.get(ip) || { count: 0, resetAt: now + windowMs }
  if (now > bucket.resetAt) {
    bucket.count = 0
    bucket.resetAt = now + windowMs
  }
  bucket.count += 1
  rateBuckets.set(ip, bucket)
  return bucket.count <= max
}

function readStore() {
  if (!existsSync(STORE_PATH)) {
    if (existsSync(DEFAULTS_PATH)) {
      const defaults = readFileSync(DEFAULTS_PATH, 'utf8')
      writeFileSync(STORE_PATH, defaults)
    } else {
      writeFileSync(
        STORE_PATH,
        JSON.stringify({ version: 2, products: [], categories: [] }),
      )
    }
  }
  return JSON.parse(readFileSync(STORE_PATH, 'utf8'))
}

function writeStore(store) {
  writeFileSync(STORE_PATH, JSON.stringify(store, null, 2))
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  const session = sessions.get(token)
  if (!session || session.expiresAt < Date.now()) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = file.originalname.split('.').pop()?.toLowerCase() || 'jpg'
    const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)
      ? ext
      : 'jpg'
    cb(null, `${Date.now()}-${randomBytes(6).toString('hex')}.${safeExt}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only images allowed'))
  },
})

const app = express()
app.use(express.json({ limit: '2mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/store', (_req, res) => {
  res.json(readStore())
})

app.post('/api/auth/login', (req, res) => {
  const { password } = req.body || {}
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Неверный пароль' })
  }
  const token = randomBytes(32).toString('hex')
  sessions.set(token, { expiresAt: Date.now() + 24 * 60 * 60 * 1000 })
  res.json({ token })
})

app.get('/api/auth/me', (req, res) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  const session = sessions.get(token)
  if (!session || session.expiresAt < Date.now()) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  res.json({ ok: true })
})

app.post('/api/analytics/event', (req, res) => {
  if (!rateLimit(req, 180)) {
    return res.status(429).json({ error: 'Too many requests' })
  }
  try {
    analytics.trackEvent(req.body)
    res.json({ ok: true })
  } catch (err) {
    res.status(400).json({ error: err.message || 'Invalid event' })
  }
})

app.get('/api/analytics', authMiddleware, (_req, res) => {
  try {
    const store = readStore()
    res.json(analytics.getSummary(store?.products ?? []))
  } catch (err) {
    res.status(500).json({ error: err.message || 'Ошибка статистики' })
  }
})

app.post('/api/auth/logout', authMiddleware, (req, res) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  sessions.delete(token)
  res.json({ ok: true })
})

app.post('/api/upload', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  res.json({ url: `/uploads/${req.file.filename}` })
})

app.post('/api/products', authMiddleware, (req, res) => {
  const store = readStore()
  const data = req.body
  const id = data.id || data.slug || slugify(data.name)
  if (store.products.some((p) => p.id === id)) {
    return res.status(409).json({ error: 'Товар с таким ID уже существует' })
  }
  const product = { ...data, id }
  if (typeof product.rating === 'number') {
    product.rating = Math.min(5, Math.max(0, product.rating))
  }
  store.products.push(product)
  writeStore(store)
  res.status(201).json(product)
})

app.put('/api/products/:id', authMiddleware, (req, res) => {
  const store = readStore()
  const index = store.products.findIndex((p) => p.id === req.params.id)
  if (index === -1) return res.status(404).json({ error: 'Not found' })
  const patch = { ...req.body }
  if (typeof patch.rating === 'number') {
    patch.rating = Math.min(5, Math.max(0, patch.rating))
  }
  if (typeof patch.reviewsCount === 'number') {
    patch.reviewsCount = Math.max(0, Math.round(patch.reviewsCount))
  }
  store.products[index] = { ...store.products[index], ...patch }
  writeStore(store)
  res.json(store.products[index])
})

app.delete('/api/products/:id', authMiddleware, (req, res) => {
  const store = readStore()
  store.products = store.products.filter((p) => p.id !== req.params.id)
  writeStore(store)
  res.json({ ok: true })
})

app.post('/api/categories', authMiddleware, (req, res) => {
  const store = readStore()
  const data = req.body
  const id = data.id || data.slug || slugify(data.name)
  const category = { ...data, id }
  store.categories.push(category)
  writeStore(store)
  res.status(201).json(category)
})

app.put('/api/categories/:id', authMiddleware, (req, res) => {
  const store = readStore()
  const index = store.categories.findIndex((c) => c.id === req.params.id)
  if (index === -1) return res.status(404).json({ error: 'Not found' })
  const old = store.categories[index]
  store.categories[index] = { ...old, ...req.body }
  if (req.body.slug && req.body.slug !== old.slug) {
    store.products = store.products.map((p) =>
      p.category === old.slug ? { ...p, category: req.body.slug } : p,
    )
  }
  writeStore(store)
  res.json(store.categories[index])
})

app.delete('/api/categories/:id', authMiddleware, (req, res) => {
  const store = readStore()
  const cat = store.categories.find((c) => c.id === req.params.id)
  if (!cat) return res.status(404).json({ error: 'Not found' })
  store.categories = store.categories.filter((c) => c.id !== req.params.id)
  store.products = store.products.filter((p) => p.category !== cat.slug)
  writeStore(store)
  res.json({ ok: true })
})

app.post('/api/store/reset', authMiddleware, (_req, res) => {
  if (!existsSync(DEFAULTS_PATH)) {
    return res.status(500).json({ error: 'Defaults not found' })
  }
  const defaults = readFileSync(DEFAULTS_PATH, 'utf8')
  writeFileSync(STORE_PATH, defaults)
  res.json(readStore())
})

app.use('/uploads', express.static(UPLOADS_DIR))

if (isProd) {
  const distPath = join(ROOT, 'dist')
  app.use(express.static(distPath))
  app.get(/^(?!\/api|\/uploads).*/, (_req, res) => {
    res.sendFile(join(distPath, 'index.html'))
  })
}

app.use((err, _req, res, _next) => {
  res.status(400).json({ error: err.message || 'Server error' })
})

app.listen(PORT, () => {
  console.log(`SPORT KING server http://localhost:${PORT}`)
  if (isProd) console.log('Serving production build from /dist')
})
