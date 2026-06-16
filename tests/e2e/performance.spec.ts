import { test, expect } from '@playwright/test'
import { readFileSync } from 'fs'
import { resolve } from 'path'

test('performance: ParticleCanvas usa distancia cuadrada en el loop de conexiones', async () => {
  const code = readFileSync(resolve(process.cwd(), 'app/components/ParticleCanvas.tsx'), 'utf-8')
  // Debe comparar con distancia cuadrada antes de hacer sqrt
  expect(code).toContain('CONNECT_DIST_SQ')
  expect(code).toContain('distSq < CONNECT_DIST_SQ')
})

test('performance: ParticleCanvas reduce partículas en móvil', async () => {
  const code = readFileSync(resolve(process.cwd(), 'app/components/ParticleCanvas.tsx'), 'utf-8')
  expect(code).toContain('isMobile')
  expect(code).toContain('40')
})

test('performance: TiltCard cachea getBoundingClientRect en onEnter', async () => {
  const code = readFileSync(resolve(process.cwd(), 'app/components/TiltCard.tsx'), 'utf-8')
  // Debe tener rectRef para cachear
  expect(code).toContain('rectRef')
  expect(code).toContain('onEnter')
  // NO debe llamar getBoundingClientRect dentro de onMove
  const onMoveBody = code.slice(
    code.indexOf('function onMove'),
    code.indexOf('function onLeave')
  )
  expect(onMoveBody).not.toContain('getBoundingClientRect')
})
