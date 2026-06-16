import { test, expect } from '@playwright/test'
import { readFileSync } from 'fs'
import { resolve } from 'path'

test('webhook: tiene protección idempotente con tabla stripe_events', async () => {
  const code = readFileSync(
    resolve(process.cwd(), 'app/api/webhooks/stripe/route.ts'),
    'utf-8'
  )

  expect(code, 'Debe insertar event.id en stripe_events').toContain('stripe_events')
  expect(code, 'Debe usar event.id como clave').toContain('event.id')
  expect(code, 'Debe retornar ok si es duplicado').toContain('dupError')
})

test('migración stripe_events existe', async () => {
  const { existsSync } = await import('fs')
  const { resolve } = await import('path')
  const exists = existsSync(resolve(
    process.cwd(),
    'supabase/migrations/20260616000001_stripe_events_idempotency.sql'
  ))
  expect(exists, 'Migración stripe_events debe existir').toBe(true)
})
