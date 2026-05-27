'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function UpgradePage() {
  const [loading, setLoading] = useState<'stripe' | 'demo' | null>(null)
  const router = useRouter()

  async function handleStripe() {
    setLoading('stripe')
    const res = await fetch('/api/checkout', { method: 'POST' })
    const { url } = await res.json()
    router.push(url)
  }

  async function handleDemo() {
    setLoading('demo')
    await fetch('/api/simulate-upgrade', { method: 'POST' })
    router.push('/dashboard?upgraded=true')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 text-center">
          <div className="text-4xl mb-4">⚡</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Actualiza a Pro</h1>
          <p className="text-gray-500 text-sm mb-8">
            Con Pro tienes 100 créditos cada mes para generar listings sin límite.
          </p>

          <div className="bg-indigo-50 rounded-xl p-5 mb-6 text-left">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-gray-900">Plan Pro</span>
              <span className="text-2xl font-bold text-indigo-600">9€<span className="text-sm font-normal text-gray-500">/mes</span></span>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              {['100 créditos al mes', 'Historial de generaciones', 'Todos los campos del listing', 'Cancela cuando quieras'].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-indigo-500">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleStripe}
            disabled={loading !== null}
            className="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60 mb-3"
          >
            {loading === 'stripe' ? 'Redirigiendo...' : 'Suscribirse por 9€/mes'}
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-gray-400">o</span>
            </div>
          </div>

          <button
            onClick={handleDemo}
            disabled={loading !== null}
            className="w-full border border-gray-200 text-gray-600 rounded-xl py-3 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-60 mb-4"
          >
            {loading === 'demo' ? 'Activando...' : 'Probar Pro gratis (demo)'}
          </button>

          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600">
            Volver al dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
