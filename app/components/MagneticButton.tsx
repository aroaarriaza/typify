'use client'
import { useRef } from 'react'
import Link from 'next/link'

export default function MagneticButton() {
  const wrapRef = useRef<HTMLDivElement>(null)

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = wrapRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.22
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.22
    el.style.transition = 'transform 0.12s ease'
    el.style.transform = `translate(${dx}px, ${dy}px)`
  }

  function onLeave() {
    const el = wrapRef.current
    if (!el) return
    el.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1)'
    el.style.transform = 'translate(0,0)'
  }

  return (
    <div ref={wrapRef} className="inline-block" onMouseMove={onMove} onMouseLeave={onLeave}>
      <Link
        href="/register"
        className="border-beam relative inline-block bg-white text-indigo-700 font-semibold px-8 py-4 rounded-2xl hover:bg-indigo-50 transition-colors shadow-lg hover:shadow-2xl"
      >
        Crear cuenta gratis →
      </Link>
    </div>
  )
}
