import { test, expect } from '@playwright/test'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const FIELDS   = 'app/dashboard/settings/cuenta/CuentaFields.tsx'
const SHELL    = 'app/dashboard/components/GeneratorShell.tsx'
const PAGE     = 'app/dashboard/page.tsx'
const CSS      = 'app/globals.css'

test('settings: edición inline con filas expandibles', () => {
  const code = readFileSync(resolve(process.cwd(), FIELDS), 'utf-8')
  expect(code).toContain('setOpen')
  expect(code).toContain('animate-fade-up')
})

test('settings: useEffect depende de [state] no de state?.success', () => {
  const code = readFileSync(resolve(process.cwd(), FIELDS), 'utf-8')
  expect(code).not.toContain('[state?.success]')
  expect(code).toContain('}, [state])')
})

test('settings: fila de contraseña es solo enlace (no form)', () => {
  const code = readFileSync(resolve(process.cwd(), FIELDS), 'utf-8')
  expect(code).toContain('href="/forgot-password"')
  expect(code).toContain('Contraseña')
})

test('dashboard: panel derecho usa flex flex-col cuando está vacío', () => {
  const code = readFileSync(resolve(process.cwd(), SHELL), 'utf-8')
  expect(code).toContain("'flex flex-col'")
  expect(code).toContain("flex-1 grid grid-rows-[auto_1fr_auto]")
})

test('dashboard: grid principal sin items-start para altura igual', () => {
  const code = readFileSync(resolve(process.cwd(), SHELL), 'utf-8')
  expect(code).not.toContain('grid-cols-2 gap-4 items-start')
})

test('dashboard: botón generar con gradiente', () => {
  const code = readFileSync(resolve(process.cwd(), SHELL), 'utf-8')
  expect(code).toContain('from-indigo-600 to-violet-600')
  expect(code).toContain('glow-btn')
})

test('dashboard: empty state con gradiente header y animaciones', () => {
  const code = readFileSync(resolve(process.cwd(), SHELL), 'utf-8')
  expect(code).toContain('from-indigo-600 via-violet-600')
  expect(code).toContain('animationDelay')
  expect(code).toContain('animate-fade-up')
})

test('dashboard: stats cards con iconos de colores', () => {
  const code = readFileSync(resolve(process.cwd(), PAGE), 'utf-8')
  expect(code).toContain('aria-hidden="true"')
  expect(code).toContain('from-emerald-500 to-teal-500')
  expect(code).toContain('animate-fade-up')
})

test('css: glow-btn desactivado sin animación', () => {
  const code = readFileSync(resolve(process.cwd(), CSS), 'utf-8')
  expect(code).toContain('.glow-btn:disabled')
  expect(code).toContain('animation: none')
})
