import { test, expect } from '@playwright/test'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const ROUTE = 'app/api/generate/route.ts'

test('language-validation: ALLOWED_LANGUAGES whitelist definida', () => {
  const code = readFileSync(resolve(process.cwd(), ROUTE), 'utf-8')
  expect(code).toContain('const ALLOWED_LANGUAGES = [')
  expect(code).toContain("'español'")
  expect(code).toContain("'inglés'")
  expect(code).toContain("'francés'")
  expect(code).toContain("'alemán'")
  expect(code).toContain("'italiano'")
  expect(code).toContain("'portugués'")
})

test('language-validation: outputLanguage usa includes con fallback a español', () => {
  const code = readFileSync(resolve(process.cwd(), ROUTE), 'utf-8')
  expect(code).toContain("ALLOWED_LANGUAGES.includes(language) ? language : 'español'")
})

test('language-validation: ya no usa language || español directamente', () => {
  const code = readFileSync(resolve(process.cwd(), ROUTE), 'utf-8')
  expect(code).not.toContain("language || 'español'")
})

test('language-validation: outputLanguage asignado desde ALLOWED_LANGUAGES', () => {
  const code = readFileSync(resolve(process.cwd(), ROUTE), 'utf-8')
  expect(code).toContain('outputLanguage')
  expect(code).toContain('ALLOWED_LANGUAGES.includes(language)')
})
