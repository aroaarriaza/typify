'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PlanActions({ plan }: { plan: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  if (plan === 'pro') {
    return (
      <button
        onClick={async () => {
          setLoading(true)
          const res = await fetch('/api/portal', { method: 'POST' })
          const { url } = await res.json()
          router.push(url)
        }}
        disabled={loading}
        className="text-xs text-gray-500 hover:text-gray-700 underline"
      >
        {loading ? 'Cargando...' : 'Gestionar suscripción'}
      </button>
    )
  }

  return (
    <a href="/upgrade" className="text-xs text-indigo-600 hover:underline">
      Actualizar a Pro — 100 créditos/mes
    </a>
  )
}
