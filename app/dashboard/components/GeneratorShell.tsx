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
const PLATFORMS = ['Amazon', 'Etsy', 'Shopify', 'eBay', 'WooCommerce']
const TONES = ['Profesional', 'Premium', 'Casual', 'Técnico', 'Urgente']
const LANGUAGES = [
  { code: 'español', label: 'Español' },
  { code: 'inglés', label: 'English' },
  { code: 'francés', label: 'Français' },
  { code: 'alemán', label: 'Deutsch' },
  { code: 'italiano', label: 'Italiano' },
  { code: 'portugués', label: 'Português' },
]

const EMPTY_FIELDS = ['Título SEO', 'Descripción', 'Meta-título', 'Meta-descripción', 'Keywords', 'Bullet points']

export default function GeneratorShell({
  credits, plan, maxCredits,
}: {
  credits: number
  plan: string
  maxCredits: number
}) {
  const router = useRouter()
  const pct = Math.min((credits / maxCredits) * 100, 100)

  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('')
  const [features, setFeatures] = useState('')
  const [platform, setPlatform] = useState('')
  const [tone, setTone] = useState('Profesional')
  const [language, setLanguage] = useState('español')
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
      body: JSON.stringify({ productName, category, features, platform, tone, language }),
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

  function copy(text: string) {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">

      {/* Columna izquierda — créditos + formulario */}
      <div className="space-y-4">

        {/* Tarjeta créditos */}
        <div className="glass rounded-2xl shadow-sm shadow-indigo-100/50 p-5 border border-white/80">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Créditos disponibles</p>
              <p className="text-3xl font-bold text-gray-900">
                {credits}
                <span className="text-sm font-normal text-gray-400"> / {maxCredits}</span>
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              plan === 'pro'
                ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white'
                : 'bg-gray-100 text-gray-500'
            }`}>
              {plan === 'pro' ? '✦ Pro' : 'Gratis'}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-700 ease-out ${
                credits <= 2 ? 'bg-red-400' : 'bg-gradient-to-r from-indigo-500 to-violet-500'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Formulario */}
        <div className="glass rounded-2xl shadow-sm shadow-indigo-100/50 p-5 border border-white/80">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Generar listing</h2>

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
                maxLength={200}
                disabled={loading || noCredits}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plataforma</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map(p => (
                  <button key={p} type="button" disabled={loading || noCredits}
                    onClick={() => setPlatform(platform === p ? '' : p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      platform === p
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
                    } disabled:opacity-50`}
                  >{p}</button>
                ))}
              </div>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Características principales</label>
              <textarea
                value={features}
                onChange={e => setFeatures(e.target.value)}
                placeholder="Ej: Batería 30h, Bluetooth 5.0, peso 250g, colores negro y blanco, incluye estuche"
                rows={3}
                maxLength={800}
                disabled={loading || noCredits}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tono</label>
              <div className="flex flex-wrap gap-2">
                {TONES.map(t => (
                  <button key={t} type="button" disabled={loading || noCredits}
                    onClick={() => setTone(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      tone === t
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
                    } disabled:opacity-50`}
                  >{t}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Idioma de salida</label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                disabled={loading || noCredits}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 bg-white"
              >
                {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
              </select>
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
        </div>
      </div>

      {/* Columna derecha — resultado */}
      <div className="lg:sticky lg:top-20">
        {loading ? (
          <div className="glass rounded-2xl shadow-sm shadow-indigo-100/50 border border-white/80 p-8 flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="w-10 h-10 border-[3px] border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Generando tu listing...</p>
          </div>
        ) : listing ? (
          <div className="glass rounded-2xl shadow-sm shadow-indigo-100/50 border border-white/80 p-5 space-y-3 animate-fade-up">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-gray-900">Listing generado</h3>
              <button
                onClick={() => copy(
                  `TÍTULO\n${listing.title}\n\nDESCRIPCIÓN\n${listing.description}\n\nMETA-TÍTULO\n${listing.metaTitle}\n\nMETA-DESCRIPCIÓN\n${listing.metaDescription}\n\nPUNTOS CLAVE\n${listing.bulletPoints.map(b => `• ${b}`).join('\n')}\n\nPALABRAS CLAVE\n${listing.keywords.join(', ')}`
                )}
                className="text-xs text-indigo-600 hover:underline font-medium"
              >
                Copiar todo
              </button>
            </div>

            <Field label="Título" value={listing.title} onCopy={() => copy(listing.title)} />
            <Field label="Descripción" value={listing.description} onCopy={() => copy(listing.description)} multiline />
            <Field label="Meta-título SEO" value={listing.metaTitle} onCopy={() => copy(listing.metaTitle)} />
            <Field label="Meta-descripción SEO" value={listing.metaDescription} onCopy={() => copy(listing.metaDescription)} />

            <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Puntos clave</span>
                <button onClick={() => copy(listing.bulletPoints.map(b => `• ${b}`).join('\n'))} className="text-xs text-indigo-600 hover:underline">Copiar</button>
              </div>
              <ul className="space-y-1">
                {listing.bulletPoints.map((point, i) => (
                  <li key={i} className="text-sm text-gray-700 flex gap-2"><span className="text-indigo-400">•</span>{point}</li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Palabras clave SEO</span>
                <button onClick={() => copy(listing.keywords.join(', '))} className="text-xs text-indigo-600 hover:underline">Copiar</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {listing.keywords.map((kw, i) => (
                  <span key={i} className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full">{kw}</span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="glass rounded-2xl shadow-sm shadow-indigo-100/50 border border-white/80 p-8 flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 flex items-center justify-center mb-5">
              <span className="text-2xl">✦</span>
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">Tu listing aparecerá aquí</p>
            <p className="text-xs text-gray-400 text-center max-w-[200px]">Rellena el formulario y pulsa generar</p>
            <div className="mt-8 space-y-2 w-full max-w-xs">
              {EMPTY_FIELDS.map(f => (
                <div key={f} className="h-8 rounded-lg bg-gray-100/80 animate-pulse flex items-center px-3">
                  <span className="text-xs text-gray-300">{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

function Field({ label, value, onCopy, multiline }: { label: string; value: string; onCopy: () => void; multiline?: boolean }) {
  return (
    <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <button onClick={onCopy} className="text-xs text-indigo-600 hover:underline">Copiar</button>
      </div>
      <p className={`text-sm text-gray-800 ${multiline ? 'whitespace-pre-wrap leading-relaxed' : ''}`}>{value}</p>
    </div>
  )
}
