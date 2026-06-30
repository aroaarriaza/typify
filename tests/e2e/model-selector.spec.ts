import { test, expect } from '@playwright/test'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const SHELL = 'app/dashboard/components/GeneratorShell.tsx'
const ROUTE = 'app/api/generate/route.ts'

// --- UI: GeneratorShell.tsx ---

test('model-selector: constante MODELS definida con 3 modelos', () => {
  const code = readFileSync(resolve(process.cwd(), SHELL), 'utf-8')
  expect(code).toContain('const MODELS = [')
  expect(code).toContain("'meta/llama-4-scout'")
  expect(code).toContain("'meta/llama-4-maverick'")
  expect(code).toContain("'google/gemini-2.0-flash'")
})

test('model-selector: estado inicial es meta/llama-4-scout', () => {
  const code = readFileSync(resolve(process.cwd(), SHELL), 'utf-8')
  expect(code).toContain("useState<ModelId>('meta/llama-4-scout')")
})

test('model-selector: toggle group tiene aria-labelledby="model-label"', () => {
  const code = readFileSync(resolve(process.cwd(), SHELL), 'utf-8')
  expect(code).toContain('aria-labelledby="model-label"')
  expect(code).toContain('id="model-label"')
})

test('model-selector: botones tienen aria-pressed={model === m.id}', () => {
  const code = readFileSync(resolve(process.cwd(), SHELL), 'utf-8')
  expect(code).toContain('aria-pressed={model === m.id}')
})

test('model-selector: model se incluye en el body del fetch', () => {
  const code = readFileSync(resolve(process.cwd(), SHELL), 'utf-8')
  expect(code).toContain('JSON.stringify(')
  expect(code).toContain('model')
  // El body debe incluir model como campo del objeto serializado
  expect(code).toMatch(/JSON\.stringify\(\{[^}]*\bmodel\b[^}]*\}/)
})

// --- API: route.ts ---

test('model-selector: ALLOWED_MODELS whitelist en route.ts', () => {
  const code = readFileSync(resolve(process.cwd(), ROUTE), 'utf-8')
  expect(code).toContain('const ALLOWED_MODELS = [')
  expect(code).toContain("'meta/llama-4-scout'")
  expect(code).toContain("'meta/llama-4-maverick'")
  expect(code).toContain("'google/gemini-2.0-flash'")
})

test('model-selector: gateway usa selectedModel dinamico', () => {
  const code = readFileSync(resolve(process.cwd(), ROUTE), 'utf-8')
  expect(code).toContain('gateway(selectedModel)')
})

test('model-selector: modelos desconocidos son rechazados con 400', () => {
  const code = readFileSync(resolve(process.cwd(), ROUTE), 'utf-8')
  expect(code).toContain('!ALLOWED_MODELS.includes(model)')
  expect(code).toContain('status: 400')
})
