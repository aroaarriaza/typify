import { chromium } from 'playwright'
import { resolve, join, dirname } from 'path'
import { mkdirSync } from 'fs'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const browser = await chromium.launch()
const page = await browser.newPage()
await page.setViewportSize({ width: 700, height: 900 })

const dir = join(__dirname, 'screenshots')
mkdirSync(dir, { recursive: true })

const templates = [
  { name: 'email-confirmation', file: '../supabase/email-templates/confirmation.html' },
  { name: 'email-recovery',     file: '../supabase/email-templates/recovery.html' },
]

for (const t of templates) {
  const filePath = resolve(__dirname, t.file)
  await page.goto(`file://${filePath}`)
  await page.waitForTimeout(300)
  await page.screenshot({ path: join(dir, `${t.name}.png`), fullPage: true })
  console.log(`✓ ${t.name}.png`)
}

await browser.close()
