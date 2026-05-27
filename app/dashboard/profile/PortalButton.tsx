'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PortalButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  return (
    <button
      onClick={async () => {
        setLoading(true)
        const res = await fetch('/api/portal', { method: 'POST' })
        const { url } = await res.json()
        router.push(url)
      }}
      disabled={loading}
      className="w-full border border-gray-200 bg-white/60 text-sm text-gray-600 font-medium px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
    >
      {loading ? 'Cargando...' : 'Gestionar suscripción'}
    </button>
  )
}
