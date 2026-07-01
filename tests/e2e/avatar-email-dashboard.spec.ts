import { test, expect } from '@playwright/test'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const UPLOAD_ROUTE   = 'app/api/upload-avatar/route.ts'
const ACTIONS        = 'app/(auth)/actions.ts'
const CUENTA_PAGE    = 'app/dashboard/settings/cuenta/page.tsx'
const AVATAR_UPLOAD  = 'app/dashboard/settings/cuenta/AvatarUpload.tsx'
const DASHBOARD_PAGE = 'app/dashboard/page.tsx'
const SHELL          = 'app/dashboard/components/GeneratorShell.tsx'

test('avatar upload: valida magic bytes del archivo', () => {
  const code = readFileSync(resolve(process.cwd(), UPLOAD_ROUTE), 'utf-8')
  expect(code).toContain('detectImageType')
  expect(code).toContain('0xff') // JPEG magic
  expect(code).toContain('0x89') // PNG magic
  expect(code).toContain('0x57') // WebP WEBP marker
})

test('avatar upload: usa magic bytes detectados como contentType', () => {
  const code = readFileSync(resolve(process.cwd(), UPLOAD_ROUTE), 'utf-8')
  expect(code).toContain('detected.mime')
  expect(code).not.toContain('file.type')
})

test('avatar upload: auth guard presente', () => {
  const code = readFileSync(resolve(process.cwd(), UPLOAD_ROUTE), 'utf-8')
  expect(code).toContain('getUser()')
  expect(code).toContain("status: 401")
})

test('avatar upload: límite de tamaño 2MB', () => {
  const code = readFileSync(resolve(process.cwd(), UPLOAD_ROUTE), 'utf-8')
  expect(code).toContain('MAX_SIZE')
  expect(code).toContain('2 * 1024 * 1024')
})

test('updateEmail: tiene auth guard y valida formato email', () => {
  const code = readFileSync(resolve(process.cwd(), ACTIONS), 'utf-8')
  const fn = code.slice(code.indexOf('export async function updateEmail'))
  expect(fn).toContain('getUser()')
  expect(fn).toContain('@')
  expect(fn).toContain('supabase.auth.updateUser({ email })')
})

test('cuenta page: incluye AvatarUpload y EmailForm', () => {
  const code = readFileSync(resolve(process.cwd(), CUENTA_PAGE), 'utf-8')
  expect(code).toContain('AvatarUpload')
  expect(code).toContain('EmailForm')
})

test('avatar component: sincroniza prop con useEffect', () => {
  const code = readFileSync(resolve(process.cwd(), AVATAR_UPLOAD), 'utf-8')
  expect(code).toContain('useEffect')
  expect(code).toContain('setPreview(avatarUrl)')
})

test('dashboard: muestra stats de créditos, listings y plan', () => {
  const code = readFileSync(resolve(process.cwd(), DASHBOARD_PAGE), 'utf-8')
  expect(code).toContain('totalGenerations')
  expect(code).toContain('maxCredits')
  expect(code).toContain('plan')
})

test('generador: sin límite de idiomas (no prev.length < 3)', () => {
  const code = readFileSync(resolve(process.cwd(), SHELL), 'utf-8')
  expect(code).not.toContain('prev.length < 3')
})

test('next.config: permite imágenes de Supabase Storage', () => {
  const code = readFileSync(resolve(process.cwd(), 'next.config.ts'), 'utf-8')
  expect(code).toContain('supabase.co')
  expect(code).toContain('remotePatterns')
})
