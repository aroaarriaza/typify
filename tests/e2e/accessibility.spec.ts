import { test, expect } from '@playwright/test'
import { readFileSync } from 'fs'
import { resolve } from 'path'

test('accesibilidad: botones de plataforma tienen aria-pressed', async () => {
  const code = readFileSync(
    resolve(process.cwd(), 'app/dashboard/components/GeneratorShell.tsx'), 'utf-8'
  )
  expect(code).toContain('aria-pressed={platform === p}')
  expect(code).toContain('aria-pressed={tone === t}')
})

test('accesibilidad: errores tienen role alert', async () => {
  const code = readFileSync(
    resolve(process.cwd(), 'app/dashboard/components/GeneratorShell.tsx'), 'utf-8'
  )
  expect(code).toContain('role="alert"')
})

test('accesibilidad: botones agrupados con role group', async () => {
  const code = readFileSync(
    resolve(process.cwd(), 'app/dashboard/components/GeneratorShell.tsx'), 'utf-8'
  )
  expect(code).toContain('role="group"')
  expect(code).toContain('aria-labelledby="platform-label"')
  expect(code).toContain('aria-labelledby="tone-label"')
})

test('accesibilidad: globals.css tiene prefers-reduced-motion', async () => {
  const code = readFileSync(resolve(process.cwd(), 'app/globals.css'), 'utf-8')
  expect(code).toContain('prefers-reduced-motion')
  expect(code).toContain('animation-duration: 0.01ms')
})

test('accesibilidad: landing mejora contraste (white/70 mínimo en párrafos)', async () => {
  const code = readFileSync(resolve(process.cwd(), 'app/page.tsx'), 'utf-8')
  expect(code).not.toContain('text-white/55')
  expect(code).toContain('text-white/70')
})
