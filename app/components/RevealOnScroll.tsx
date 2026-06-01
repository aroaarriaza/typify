'use client'

import { useEffect, useRef, useState } from 'react'

type Direction = 'left' | 'right' | 'bottom' | 'top'

const ORIGINS: Record<Direction, string> = {
  left:   'translateX(-50px)',
  right:  'translateX(50px)',
  bottom: 'translateY(50px)',
  top:    'translateY(-30px)',
}

export default function RevealOnScroll({ children, className, delay = 0, from = 'bottom' }: {
  children: React.ReactNode
  className?: string
  delay?: number
  from?: Direction
}) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setVisible(true), delay)
        observer.disconnect()
      }
    }, { threshold: 0.1 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate(0,0)' : ORIGINS[from],
        transition: `opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1)`,
      }}
    >
      {children}
    </div>
  )
}
