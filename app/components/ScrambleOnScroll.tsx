'use client'

import { useEffect, useRef, useState } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%&*<>[]{}0123456789'

export default function ScrambleOnScroll({ text, className }: { text: string; className?: string }) {
  const [display, setDisplay] = useState(text)
  const ref = useRef<HTMLSpanElement>(null)
  const done = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !done.current) {
        done.current = true
        observer.disconnect()
        let iter = 0
        function step() {
          const progress = iter / 2.5
          setDisplay(
            text.split('').map((char, i) => {
              if (char === ' ') return ' '
              if (i < Math.floor(progress)) return char
              return CHARS[Math.floor(Math.random() * CHARS.length)]
            }).join('')
          )
          iter += 0.45
          if (iter < text.length * 2.5 + 6) requestAnimationFrame(step)
          else setDisplay(text)
        }
        requestAnimationFrame(step)
      }
    }, { threshold: 0.4 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [text])

  return <span ref={ref} className={className}>{display}</span>
}
