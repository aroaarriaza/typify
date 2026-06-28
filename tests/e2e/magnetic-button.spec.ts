import { test, expect } from '@playwright/test'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const getCode = () =>
  readFileSync(resolve(process.cwd(), 'app/components/MagneticButton.tsx'), 'utf-8')

test('performance: MagneticButton tiene rectRef para cachear el rect', async () => {
  const code = getCode()
  expect(code).toContain('rectRef')
})

test('performance: MagneticButton tiene función onEnter', async () => {
  const code = getCode()
  expect(code).toContain('onEnter')
})

test('performance: MagneticButton no llama getBoundingClientRect dentro de onMove', async () => {
  const code = getCode()
  const onMoveBody = code.slice(
    code.indexOf('function onMove'),
    code.indexOf('function onLeave')
  )
  expect(onMoveBody).not.toContain('getBoundingClientRect')
})

test('performance: MagneticButton usa onMouseEnter={onEnter} en el JSX', async () => {
  const code = getCode()
  expect(code).toContain('onMouseEnter={onEnter}')
})
