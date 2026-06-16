import { chromium } from 'playwright'
import { join, dirname } from 'path'
import { mkdirSync } from 'fs'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dir = join(__dirname, 'screenshots')
mkdirSync(dir, { recursive: true })

const MOBILE = { width: 390, height: 844 }

const browser = await chromium.launch()
const page = await browser.newPage()
await page.setViewportSize(MOBILE)

const pages = [
  { name: 'mobile-home',     url: 'http://localhost:3000/' },
  { name: 'mobile-login',    url: 'http://localhost:3000/login' },
  { name: 'mobile-register', url: 'http://localhost:3000/register' },
  { name: 'mobile-pricing',  url: 'http://localhost:3000/pricing' },
  { name: 'mobile-forgot',   url: 'http://localhost:3000/forgot-password' },
]

for (const p of pages) {
  await page.goto(p.url, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1500)
  const scrollWidth = await page.evaluate(() => document.body.scrollWidth)
  const viewportWidth = MOBILE.width
  const overflow = scrollWidth > viewportWidth + 2
  console.log(`${overflow ? '⚠ OVERFLOW' : '✓ OK'} ${p.name} — scrollWidth: ${scrollWidth}px`)
  await page.screenshot({ path: join(dir, `${p.name}.png`), fullPage: true })
}

// Find overflowing elements on home page
await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(1000)
const overflowing = await page.evaluate(() => {
  const w = document.documentElement.clientWidth
  return Array.from(document.querySelectorAll('*'))
    .filter(el => el.getBoundingClientRect().right > w + 5)
    .map(el => ({
      tag: el.tagName,
      class: el.className?.toString().slice(0, 60),
      right: Math.round(el.getBoundingClientRect().right),
    }))
    .slice(0, 10)
})
console.log('\nElements overflowing on home:')
overflowing.forEach(el => console.log(`  <${el.tag}> class="${el.class}" right=${el.right}px`))

await browser.close()
