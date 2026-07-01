'use client'

import { useState } from 'react'

export default function ExportButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleExport() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/export')
      if (!res.ok) throw new Error('Error al exportar')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `typify-listings-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 100)
    } catch {
      setError('No se pudo exportar. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-1.5">
      <button
        type="button"
        onClick={handleExport}
        disabled={loading}
        className="border border-gray-200 bg-white text-sm text-gray-700 font-medium px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        {loading ? 'Exportando...' : 'Descargar CSV'}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
