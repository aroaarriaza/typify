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

test('language-validation: API acepta array de idiomas (languages[])', () => {
  const code = readFileSync(resolve(process.cwd(), ROUTE), 'utf-8')
  expect(code).toContain('languages')
  expect(code).toContain('Array.isArray(languages)')
})

test('language-validation: cada idioma validado contra whitelist', () => {
  const code = readFileSync(resolve(process.cwd(), ROUTE), 'utf-8')
  expect(code).toContain('ALLOWED_LANGUAGES.includes(')
  expect(code).toContain('selectedLanguages')
})

test('language-validation: límite máximo de 3 idiomas', () => {
  const code = readFileSync(resolve(process.cwd(), ROUTE), 'utf-8')
  expect(code).toContain('rawLanguages.length > 3')
  expect(code).toContain('Máximo 3 idiomas')
})
