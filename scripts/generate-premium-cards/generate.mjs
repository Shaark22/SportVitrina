import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../..')

const SCENES_DIR = path.join(__dirname, 'scenes')
const TEMPLATE_DIR = path.join(__dirname, 'templates')
const OUTPUT_DIR = path.join(
  rootDir,
  'public/products/premium-cards/turnik-3v1-usilennyy-belyy',
)

const SLIDES = [
  {
    template: 'slide-1-hook.html',
    scene: 'slide-1-scene.png',
    output: '01-emotional-hook.png',
  },
  {
    template: 'slide-2-benefits.html',
    scene: 'slide-2-scene.png',
    output: '02-product-benefits.png',
  },
  {
    template: 'slide-3-trust.html',
    scene: 'slide-3-scene.png',
    output: '03-trust-safety.png',
  },
  {
    template: 'slide-4-lifestyle.html',
    scene: 'slide-4-scene.png',
    output: '04-lifestyle.png',
  },
  {
    template: 'slide-5-conversion.html',
    scene: 'slide-5-scene.png',
    output: '05-conversion.png',
  },
]

async function loadSceneDataUrl(sceneFile) {
  const scenePath = path.join(SCENES_DIR, sceneFile)
  const buffer = await fs.readFile(scenePath)
  return `data:image/png;base64,${buffer.toString('base64')}`
}

function buildHtml(templateName, sceneDataUrl) {
  const templatePath = path.join(TEMPLATE_DIR, templateName)
  const cssPath = path.join(__dirname, 'design-system.css')
  return Promise.all([
    fs.readFile(templatePath, 'utf8'),
    fs.readFile(cssPath, 'utf8'),
  ]).then(([html, css]) =>
    html
      .replace(
        '<link rel="stylesheet" href="../design-system.css" />',
        `<style>${css}</style>`,
      )
      .replaceAll('{{SCENE_IMAGE}}', sceneDataUrl),
  )
}

async function renderSlide(page, html, outputPath) {
  page.setDefaultNavigationTimeout(120000)
  await page.setViewport({ width: 1200, height: 1200, deviceScaleFactor: 2 })
  await page.setContent(html, { waitUntil: 'domcontentloaded' })
  await page.evaluate(async () => {
    if (document.fonts?.ready) {
      await Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, 4000)),
      ])
    }
  })
  await page.waitForFunction(() => {
    const bg = document.querySelector('.scene-bg')
    if (!(bg instanceof HTMLElement)) return false
    const image = getComputedStyle(bg).backgroundImage
    return image.includes('data:image') || image.includes('url(')
  })
  await page.screenshot({
    path: outputPath,
    type: 'png',
    clip: { x: 0, y: 0, width: 1200, height: 1200 },
  })
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true })

  const edgePath =
    process.env.PUPPETEER_EXECUTABLE_PATH ??
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: edgePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()

    for (const slide of SLIDES) {
      const sceneDataUrl = await loadSceneDataUrl(slide.scene)
      const html = await buildHtml(slide.template, sceneDataUrl)
      const outputPath = path.join(OUTPUT_DIR, slide.output)
      console.log(`Rendering ${slide.output}...`)
      await renderSlide(page, html, outputPath)
    }
  } finally {
    await browser.close()
  }

  for (const slide of SLIDES) {
    await fs.copyFile(
      path.join(SCENES_DIR, slide.scene),
      path.join(OUTPUT_DIR, slide.scene),
    )
  }

  const manifest = {
    productSlug: 'turnik-sportking-3-v-1-usilennyy-belyy-104370776',
    generatedAt: new Date().toISOString(),
    size: '1200x1200',
    pipeline: 'photo-scenes + typography-composite',
    slides: SLIDES.map((slide) => ({
      file: slide.output,
      scene: slide.scene,
      publicPath: `/products/premium-cards/turnik-3v1-usilennyy-belyy/${slide.output}`,
    })),
  }

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  )

  console.log(`Done. Saved ${SLIDES.length} slides to:\n${OUTPUT_DIR}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
