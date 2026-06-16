'use client'

import { useRef } from 'react'

export default function TiltCard({ children, className, style }: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const rectRef = useRef<DOMRect | null>(null)

  function onEnter() {
    // Cachear el rect al entrar evita getBoundingClientRect en cada mousemove (reflow)
    rectRef.current = cardRef.current?.getBoundingClientRect() ?? null
  }

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current
    const rect = rectRef.current
    if (!card || !rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rotX = -((y / rect.height) - 0.5) * 16
    const rotY =  ((x / rect.width)  - 0.5) * 16
    card.style.transition = 'transform 0.1s ease'
    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.04)`
    if (glareRef.current) {
      const gx = (x / rect.width) * 100
      const gy = (y / rect.height) * 100
      glareRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.22), transparent 60%)`
    }
  }

  function onLeave() {
    const card = cardRef.current
    if (!card) return
    rectRef.current = null
    card.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1)'
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)'
    if (glareRef.current) glareRef.current.style.background = 'transparent'
  }

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform', position: 'relative', ...style }}
    >
      {children}
      <div
        ref={glareRef}
        className="absolute inset-0 rounded-2xl pointer-events-none z-20"
        style={{ transition: 'background 0.15s ease' }}
      />
    </div>
  )
}
