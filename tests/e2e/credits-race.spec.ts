import { test, expect } from '@playwright/test'
import { readFileSync } from 'fs'
import { resolve } from 'path'

test('créditos: deductCredit usa RPC atómica (no read-then-update)', async () => {
  const code = readFileSync(resolve(process.cwd(), 'lib/credits.ts'), 'utf-8')

  // NO debe existir el patrón inseguro
  expect(code, 'No debe leer credits antes de actualizar').not.toContain("select('credits')")
  expect(code, 'No debe usar profile.credits - 1').not.toContain('profile.credits - 1')

  // SÍ debe usar la función RPC atómica
  expect(code, 'Debe usar supabase.rpc deduct_credit').toContain("rpc('deduct_credit'")
})

test('créditos: refund en generate usa RPC atómica', async () => {
  const code = readFileSync(resolve(process.cwd(), 'app/api/generate/route.ts'), 'utf-8')

  // NO debe leer créditos para hacer el refund
  expect(code, 'No debe usar profile.credits + 1').not.toContain('profile.credits + 1')

  // SÍ debe usar RPC atómica
  expect(code, 'Debe usar supabase.rpc refund_credit').toContain("rpc('refund_credit'")
})
