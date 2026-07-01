import { test, expect } from '@playwright/test'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const SIDEBAR = 'app/dashboard/settings/_components/SettingsSidebar.tsx'
const LAYOUT  = 'app/dashboard/settings/layout.tsx'
const ACTIONS = 'app/(auth)/actions.ts'
const EXPORT  = 'app/api/export/route.ts'

test('settings sidebar: define las cuatro secciones', () => {
  const code = readFileSync(resolve(process.cwd(), SIDEBAR), 'utf-8')
  expect(code).toContain('/dashboard/settings/cuenta')
  expect(code).toContain('/dashboard/settings/preferencias')
  expect(code).toContain('/dashboard/settings/plan')
  expect(code).toContain('/dashboard/settings/datos')
})

test('settings sidebar: usa usePathname para marcar activo', () => {
  const code = readFileSync(resolve(process.cwd(), SIDEBAR), 'utf-8')
  expect(code).toContain('usePathname')
  expect(code).toContain('pathname === item.href')
})

test('settings layout: auth guard presente', () => {
  const code = readFileSync(resolve(process.cwd(), LAYOUT), 'utf-8')
  expect(code).toContain('getUser()')
  expect(code).toContain("redirect('/login')")
})

test('settings actions: updateDisplayName tiene auth guard', () => {
  const code = readFileSync(resolve(process.cwd(), ACTIONS), 'utf-8')
  const fn = code.slice(code.indexOf('export async function updateDisplayName'))
  expect(fn).toContain('getUser()')
  expect(fn).toContain("return { error: 'No autenticado.' }")
})

test('settings actions: updatePreferences tiene auth guard', () => {
  const code = readFileSync(resolve(process.cwd(), ACTIONS), 'utf-8')
  const fn = code.slice(code.indexOf('export async function updatePreferences'))
  expect(fn).toContain('getUser()')
  expect(fn).toContain("return { error: 'No autenticado.' }")
})

test('settings actions: updatePreferences valida enums contra whitelist', () => {
  const code = readFileSync(resolve(process.cwd(), ACTIONS), 'utf-8')
  const fn = code.slice(code.indexOf('export async function updatePreferences'))
  expect(fn).toContain('ALLOWED_PLATFORMS.includes(')
  expect(fn).toContain('ALLOWED_TONES.includes(')
  expect(fn).toContain('ALLOWED_PREF_LANGUAGES.includes(')
})

test('export route: escopa query al usuario autenticado', () => {
  const code = readFileSync(resolve(process.cwd(), EXPORT), 'utf-8')
  expect(code).toContain('getUser()')
  expect(code).toContain('.eq(\'user_id\', user.id)')
})

test('export route: genera cabecera CSV correcta', () => {
  const code = readFileSync(resolve(process.cwd(), EXPORT), 'utf-8')
  expect(code).toContain('Content-Type')
  expect(code).toContain('text/csv')
  expect(code).toContain('Content-Disposition')
})
