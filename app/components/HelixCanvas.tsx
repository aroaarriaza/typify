'use client'
import { useRef, useEffect } from 'react'

const STRANDS = [
  { hueBase: 248, phase: 0 },
  { hueBase: 272, phase: Math.PI * 0.67 },
  { hueBase: 298, phase: Math.PI * 1.33 },
]

export default function HelixCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frame = 0
    let raf: number
    const W = canvas.width
    const H = canvas.height
    const FOV = 480
    const RADIUS = 90
    const STEPS = 260
    const c = ctx

    function draw() {
      c.clearRect(0, 0, W, H)
      const t = frame * 0.007

      for (const strand of STRANDS) {
        for (let i = 1; i < STEPS; i++) {
          const p = i / STEPS
          const pp = (i - 1) / STEPS
          const ang = p * Math.PI * 5 + t + strand.phase
          const pang = pp * Math.PI * 5 + t + strand.phase

          const z = Math.sin(ang) * RADIUS + 380
          const pz = Math.sin(pang) * RADIUS + 380
          const sc = FOV / (FOV + z)
          const psc = FOV / (FOV + pz)

          const sx = W / 2 + Math.cos(ang) * RADIUS * sc
          const sy = H / 2 + (p - 0.5) * H * 1.7 * sc
          const psx = W / 2 + Math.cos(pang) * RADIUS * psc
          const psy = H / 2 + (pp - 0.5) * H * 1.7 * psc

          const hue = strand.hueBase + Math.sin(p * Math.PI * 2) * 18
          const alpha = sc * 0.75 * Math.sin(p * Math.PI)

          c.beginPath()
          c.strokeStyle = `hsla(${hue},82%,68%,${Math.min(1, Math.max(0, alpha))})`
          c.lineWidth = Math.max(0.4, sc * 4)
          c.moveTo(psx, psy)
          c.lineTo(sx, sy)
          c.stroke()
        }
      }

      frame++
      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <canvas
      ref={ref}
      width={1400}
      height={280}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    />
  )
}
