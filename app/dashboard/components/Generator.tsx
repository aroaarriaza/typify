'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Listing = {
  title: string
  description: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  bulletPoints: string[]
}

const CATEGORIES = [
  'Moda y ropa', 'Electrónica', 'Hogar y jardín', 'Deportes',
  'Belleza y cuidado', 'Juguetes', 'Alimentación', 'Mascotas', 'Otro',
]

export default function Generator({ credits }: { credits: number }) {
  const router = useRouter()
  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('')
  const [features, setFeatures] = useState('')
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const noCredits = credits <= 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setListing(null)

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName, category, features }),
    })

    if (!res.ok) {
      const msg = await res.text()
      if (res.status === 402) router.push('/upgrade')
      else setError(`Error ${res.status}: ${msg}`)
      setLoading(false)
      return
    }

    const data = await res.json()
    setListing(data)
    setLoading(false)
    router.refresh()
  }

  function copyField(text: string) {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del producto <span className="text-red-400">*</span>
          </label>
          <input
            value={productName}
            onChange={e => setProductName(e.target.value)}
            placeholder="Ej: Auriculares inalámbricos con cancelación de ruido"
            required
            disabled={loading || noCredits}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            disabled={loading || noCredits}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 bg-white"
          >
            <option value="">Selecciona una categoría</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Características principales
          </label>
          <textarea
            value={features}
            onChange={e => setFeatures(e.target.value)}
            placeholder="Ej: Batería 30h, Bluetooth 5.0, peso 250g, colores negro y blanco, incluye estuche"
            rows={3}
            disabled={loading || noCredits}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none disabled:bg-gray-50"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
        )}

        {noCredits ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
            <p className="text-sm text-amber-800 font-medium mb-2">Sin créditos disponibles</p>
            <a href="/upgrade" className="inline-block bg-amber-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors">
              Actualizar a Pro — 9€/mes
            </a>
          </div>
        ) : (
          <button
            type="submit"
            disabled={loading || !productName.trim()}
            className="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generando listing...
              </span>
            ) : 'Generar listing completo — 1 crédito'}
          </button>
        )}
      </form>

      {/* Resultado */}
      {listing && (
        <div className="space-y-3 border-t border-gray-100 pt-6 animate-fade-up">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Listing generado</h3>
            <button
              onClick={() => copyField(
                `TÍTULO\n${listing.title}\n\nDESCRIPCIÓN\n${listing.description}\n\nMETA-TÍTULO\n${listing.metaTitle}\n\nMETA-DESCRIPCIÓN\n${listing.metaDescription}\n\nPUNTOS CLAVE\n${listing.bulletPoints.map(b => `• ${b}`).join('\n')}\n\nPALABRAS CLAVE\n${listing.keywords.join(', ')}`
              )}
              className="text-xs text-indigo-600 hover:underline font-medium"
            >
              Copiar todo
            </button>
          </div>

          <Field label="Título" value={listing.title} onCopy={() => copyField(listing.title)} />
          <Field label="Descripción" value={listing.description} onCopy={() => copyField(listing.description)} multiline />
          <Field label="Meta-título SEO" value={listing.metaTitle} onCopy={() => copyField(listing.metaTitle)} />
          <Field label="Meta-descripción SEO" value={listing.metaDescription} onCopy={() => copyField(listing.metaDescription)} />

          <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-4 card-hover">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Puntos clave</span>
              <button onClick={() => copyField(listing.bulletPoints.map(b => `• ${b}`).join('\n'))} className="text-xs text-indigo-600 hover:underline">Copiar</button>
            </div>
            <ul className="space-y-1">
              {listing.bulletPoints.map((point, i) => (
                <li key={i} className="text-sm text-gray-700 flex gap-2"><span className="text-indigo-400">•</span>{point}</li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-4 card-hover">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Palabras clave SEO</span>
              <button onClick={() => copyField(listing.keywords.join(', '))} className="text-xs text-indigo-600 hover:underline">Copiar</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {listing.keywords.map((kw, i) => (
                <span key={i} className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full">{kw}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, value, onCopy, multiline }: { label: string; value: string; onCopy: () => void; multiline?: boolean }) {
  return (
    <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-4 card-hover">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <button onClick={onCopy} className="text-xs text-indigo-600 hover:underline">Copiar</button>
      </div>
      <p className={`text-sm text-gray-800 ${multiline ? 'whitespace-pre-wrap leading-relaxed' : ''}`}>{value}</p>
    </div>
  )
}
