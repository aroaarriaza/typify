'use client'
import { useRef, useEffect } from 'react'

export default function AnimatedLine() {
  const lineRef = useRef<SVGLineElement>(null)
  const triggered = useRef(false)

  useEffect(() => {
    const el = lineRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered.current) {
        triggered.current = true
        el.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1) 0.3s'
        el.style.strokeDashoffset = '0'
        observer.disconnect()
      }
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <svg
      className="hidden sm:block absolute top-8 left-0 w-full pointer-events-none"
      style={{ height: '2px', overflow: 'visible' }}
      viewBox="0 0 1000 2"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="svgLineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(165,180,252,0)" />
          <stop offset="15%"  stopColor="#a5b4fc" />
          <stop offset="50%"  stopColor="#c084fc" />
          <stop offset="85%"  stopColor="#a5b4fc" />
          <stop offset="100%" stopColor="rgba(165,180,252,0)" />
        </linearGradient>
      </defs>
      <line
        ref={lineRef}
        x1="165" y1="1" x2="835" y2="1"
        stroke="url(#svgLineGrad)"
        strokeWidth="1.5"
        style={{ strokeDasharray: 670, strokeDashoffset: 670 }}
      />
    </svg>
  )
}
