import { test } from '@playwright/test'
import path from 'path'

test('email: confirmation template screenshot', async ({ page }) => {
  const filePath = path.resolve(__dirname, '../../supabase/email-templates/confirmation.html')
  await page.goto(`file://${filePath}`)
  await page.setViewportSize({ width: 700, height: 900 })
  await page.screenshot({
    path: 'tests/screenshots/email-confirmation.png',
    fullPage: true,
  })
})

test('email: recovery template screenshot', async ({ page }) => {
  const filePath = path.resolve(__dirname, '../../supabase/email-templates/recovery.html')
  await page.goto(`file://${filePath}`)
  await page.setViewportSize({ width: 700, height: 900 })
  await page.screenshot({
    path: 'tests/screenshots/email-recovery.png',
    fullPage: true,
  })
})
