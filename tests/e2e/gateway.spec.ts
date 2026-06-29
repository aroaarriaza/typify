import { test, expect } from '@playwright/test'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const ROUTE = 'app/api/generate/route.ts'

test('gateway: usa @ai-sdk/vercel en lugar de @ai-sdk/groq', () => {
  const code = readFileSync(resolve(process.cwd(), ROUTE), 'utf-8')
  expect(code).toContain('@ai-sdk/vercel')
  expect(code).not.toContain('@ai-sdk/groq')
})

test('gateway: endpoint apunta a ai-gateway.vercel.sh', () => {
  const code = readFileSync(resolve(process.cwd(), ROUTE), 'utf-8')
  expect(code).toContain('ai-gateway.vercel.sh')
})

test('gateway: invoca gateway con selectedModel dinamico', () => {
  const code = readFileSync(resolve(process.cwd(), ROUTE), 'utf-8')
  expect(code).toContain('gateway(selectedModel)')
  expect(code).not.toContain("gateway('meta/llama-4-scout')")
})

test('gateway: meta/llama-4-scout sigue en la whitelist ALLOWED_MODELS', () => {
  const code = readFileSync(resolve(process.cwd(), ROUTE), 'utf-8')
  expect(code).toContain("'meta/llama-4-scout'")
  expect(code).toContain('ALLOWED_MODELS')
})

test('gateway: autenticación via VERCEL_API_KEY', () => {
  const code = readFileSync(resolve(process.cwd(), ROUTE), 'utf-8')
  expect(code).not.toContain('GROQ_API_KEY')
})
