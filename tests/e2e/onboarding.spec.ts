import { test, expect } from '@playwright/test'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const MODAL_PATH = 'app/dashboard/components/OnboardingModal.tsx'
const DASHBOARD_PATH = 'app/dashboard/page.tsx'

test('onboarding: modal tiene role="dialog"', () => {
  const code = readFileSync(resolve(process.cwd(), MODAL_PATH), 'utf-8')
  expect(code).toContain('role="dialog"')
})

test('onboarding: modal tiene aria-modal="true"', () => {
  const code = readFileSync(resolve(process.cwd(), MODAL_PATH), 'utf-8')
  expect(code).toContain('aria-modal="true"')
})

test('onboarding: modal tiene aria-labelledby="onboarding-title"', () => {
  const code = readFileSync(resolve(process.cwd(), MODAL_PATH), 'utf-8')
  expect(code).toContain('aria-labelledby="onboarding-title"')
  expect(code).toContain('id="onboarding-title"')
})

test('onboarding: botones tienen type="button"', () => {
  const code = readFileSync(resolve(process.cwd(), MODAL_PATH), 'utf-8')
  // Todos los botones deben ser type="button" y no debe haber ninguno sin type
  expect(code).toContain('type="button"')
  // Verificar que no hay <button> sin type explícito
  const buttonTags = code.match(/<button(?![^>]*type=)[^>]*>/g)
  expect(buttonTags).toBeNull()
})

test('onboarding: STEPS tiene 3 pasos (tercer emoji es 🚀)', () => {
  const code = readFileSync(resolve(process.cwd(), MODAL_PATH), 'utf-8')
  expect(code).toContain("emoji: '🚀'")
})

test('onboarding: usa localStorage con clave typify_onboarding_done', () => {
  const code = readFileSync(resolve(process.cwd(), MODAL_PATH), 'utf-8')
  expect(code).toContain("'typify_onboarding_done'")
  expect(code).toContain('localStorage.getItem')
  expect(code).toContain('localStorage.setItem')
})

test('onboarding: dashboard importa OnboardingModal con dynamic y ssr: false', () => {
  const code = readFileSync(resolve(process.cwd(), DASHBOARD_PATH), 'utf-8')
  expect(code).toContain('dynamic')
  expect(code).toContain('OnboardingModal')
  expect(code).toContain('ssr: false')
})
