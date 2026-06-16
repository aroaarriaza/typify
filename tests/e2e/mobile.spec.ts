import { test, expect } from '@playwright/test'

const MOBILE = { width: 390, height: 844 } // iPhone 14

test.use({ viewport: MOBILE })

test('mobile: landing page renders without overflow', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const body = await page.locator('body')
  const bodyWidth = await body.evaluate(el => el.scrollWidth)
  expect(bodyWidth).toBeLessThanOrEqual(MOBILE.width + 2)
  await page.screenshot({ path: 'tests/screenshots/mobile-home.png', fullPage: true })
})

test('mobile: login page is usable', async ({ page }) => {
  await page.goto('/login')
  await page.waitForLoadState('networkidle')
  const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth)
  expect(bodyWidth).toBeLessThanOrEqual(MOBILE.width + 2)
  const emailInput = page.locator('input[type="email"]')
  await expect(emailInput).toBeVisible()
  await page.screenshot({ path: 'tests/screenshots/mobile-login.png', fullPage: true })
})

test('mobile: register page is usable', async ({ page }) => {
  await page.goto('/register')
  await page.waitForLoadState('networkidle')
  const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth)
  expect(bodyWidth).toBeLessThanOrEqual(MOBILE.width + 2)
  const emailInput = page.locator('input[type="email"]')
  await expect(emailInput).toBeVisible()
  await page.screenshot({ path: 'tests/screenshots/mobile-register.png', fullPage: true })
})

test('mobile: pricing page is readable', async ({ page }) => {
  await page.goto('/pricing')
  await page.waitForLoadState('networkidle')
  const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth)
  expect(bodyWidth).toBeLessThanOrEqual(MOBILE.width + 2)
  await expect(page.locator('h1')).toBeVisible()
  await page.screenshot({ path: 'tests/screenshots/mobile-pricing.png', fullPage: true })
})

test('mobile: forgot password page is usable', async ({ page }) => {
  await page.goto('/forgot-password')
  await page.waitForLoadState('networkidle')
  const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth)
  expect(bodyWidth).toBeLessThanOrEqual(MOBILE.width + 2)
  await expect(page.locator('input[type="email"]')).toBeVisible()
  await page.screenshot({ path: 'tests/screenshots/mobile-forgot-password.png', fullPage: true })
})
