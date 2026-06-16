import { test, expect } from '@playwright/test'
import { readFileSync } from 'fs'
import { resolve } from 'path'

test('generate route: tiene rate limiting', async () => {
  const code = readFileSync(resolve(process.cwd(), 'app/api/generate/route.ts'), 'utf-8')
  expect(code).toContain('checkRateLimit')
  expect(code).toContain('429')
  expect(code).toContain('RATE_LIMIT')
})

test('generate route: valida longitud de inputs en servidor', async () => {
  const code = readFileSync(resolve(process.cwd(), 'app/api/generate/route.ts'), 'utf-8')
  expect(code).toContain('productName.length > 200')
  expect(code).toContain('features && features.length > 800')
})

test('formulario: inputs tienen maxLength', async () => {
  const code = readFileSync(
    resolve(process.cwd(), 'app/dashboard/components/GeneratorShell.tsx'),
    'utf-8'
  )
  expect(code).toContain('maxLength={200}')
  expect(code).toContain('maxLength={800}')
})
