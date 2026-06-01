'use client'

import { useEffect, useRef, useState } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%&*<>[]{}0123456789'

export default function ScrambleText({ text, className, delay = 0 }: {
  text: string
  className?: string
  delay?: number
}) {
  const [display, setDisplay] = useState(() => text.split('').map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join(''))
  const iterRef = useRef(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    iterRef.current = 0
    let started = false

    const timer = setTimeout(() => {
      started = true
      function step() {
        const progress = iterRef.current / 2.5
        setDisplay(
          text.split('').map((char, i) => {
            if (char === ' ') return ' '
            if (i < Math.floor(progress)) return char
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          }).join('')
        )
        iterRef.current += 0.4
        if (iterRef.current < text.length * 2.5 + 5) {
          rafRef.current = requestAnimationFrame(step)
        } else {
          setDisplay(text)
        }
      }
      rafRef.current = requestAnimationFrame(step)
    }, delay)

    return () => {
      clearTimeout(timer)
      if (started) cancelAnimationFrame(rafRef.current)
    }
  }, [text, delay])

  return <span className={className}>{display}</span>
}
