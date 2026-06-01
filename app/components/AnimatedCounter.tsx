'use client'

import { useEffect, useRef, useState } from 'react'

export default function AnimatedCounter({ value, className }: { value: string; className?: string }) {
  const match = value.match(/^([\d.]+)(.*)$/)
  const num = match ? parseFloat(match[1]) : 0
  const suffix = match ? match[2] : ''
  const isInt = Number.isInteger(num)

  const [display, setDisplay] = useState('0')
  const ref = useRef<HTMLSpanElement>(null)
  const done = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !done.current) {
        done.current = true
        observer.disconnect()
        const start = performance.now()
        const duration = 1600
        function step(now: number) {
          const t = Math.min((now - start) / duration, 1)
          const ease = 1 - Math.pow(1 - t, 3)
          const current = num * ease
          setDisplay(isInt ? String(Math.round(current)) : current.toFixed(1))
          if (t < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [num, isInt])

  return <span ref={ref} className={className}>{display}{suffix}</span>
}
