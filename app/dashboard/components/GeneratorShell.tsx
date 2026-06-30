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

type MultiListing = Record<string, Listing>

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

const MODELS = [
  { id: 'meta/llama-4-scout',      label: 'Llama Scout',    desc: 'Respuestas instantáneas' },
  { id: 'meta/llama-4-maverick',   label: 'Llama Maverick', desc: 'Mayor calidad'           },
  { id: 'google/gemini-2.5-flash', label: 'Gemini',         desc: 'Google AI'               },
] as const
type ModelId = typeof MODELS[number]['id']

const EMPTY_FIELDS = ['Título SEO', 'Descripción', 'Meta-título', 'Meta-descripción', 'Keywords', 'Bullet points']

export default function GeneratorShell({
  credits,
}: {
  credits: number
}) {
  const router = useRouter()

  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('')
  const [features, setFeatures] = useState('')
  const [platform, setPlatform] = useState('')
  const [tone, setTone] = useState('Profesional')
  const [languages, setLanguages] = useState<string[]>(['español'])
  const [model, setModel] = useState<ModelId>('meta/llama-4-scout')
  const [result, setResult] = useState<MultiListing | null>(null)
  const [activeTab, setActiveTab] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const noCredits = credits <= 0

  function toggleLanguage(code: string) {
    setLanguages(prev => {
      if (prev.includes(code)) {
        return prev.length > 1 ? prev.filter(l => l !== code) : prev
      }
      return prev.length < 3 ? [...prev, code] : prev
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName, category, features, platform, tone, languages, model }),
    })

    if (!res.ok) {
      const msg = await res.text()
      if (res.status === 402) router.push('/upgrade')
      else setError(`Error ${res.status}: ${msg}`)
      setLoading(false)
      return
    }

    const data: MultiListing = await res.json()
    setResult(data)
    setActiveTab(Object.keys(data)[0] ?? '')
    setLoading(false)
    router.refresh()
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text)
  }

  function copyAll(listing: Listing) {
    copy(`TÍTULO\n${listing.title}\n\nDESCRIPCIÓN\n${listing.description}\n\nMETA-TÍTULO\n${listing.metaTitle}\n\nMETA-DESCRIPCIÓN\n${listing.metaDescription}\n\nPUNTOS CLAVE\n${listing.bulletPoints.map(b => `• ${b}`).join('\n')}\n\nPALABRAS CLAVE\n${listing.keywords.join(', ')}`)
  }

  const activeListing = result ? result[activeTab] : null
  const resultTabs = result ? Object.keys(result) : []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">

      {/* Columna izquierda — formulario */}
      <div className="space-y-4">

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
              <label className="block text-sm font-medium text-gray-700 mb-2" id="platform-label">Plataforma</label>
              <div className="flex flex-wrap gap-2" role="group" aria-labelledby="platform-label">
                {PLATFORMS.map(p => (
                  <button key={p} type="button" disabled={loading || noCredits}
                    aria-pressed={platform === p}
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
              <label className="block text-sm font-medium text-gray-700 mb-2" id="tone-label">Tono</label>
              <div className="flex flex-wrap gap-2" role="group" aria-labelledby="tone-label">
                {TONES.map(t => (
                  <button key={t} type="button" disabled={loading || noCredits}
                    aria-pressed={tone === t}
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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700" id="language-label">
                  Idiomas de salida
                </label>
                {languages.length > 1 && (
                  <span className="text-[10px] text-indigo-500">{languages.length} seleccionados</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2" role="group" aria-labelledby="language-label">
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    type="button"
                    disabled={loading || noCredits}
                    aria-pressed={languages.includes(l.code)}
                    onClick={() => toggleLanguage(l.code)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      languages.includes(l.code)
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
                    } disabled:opacity-40`}
                  >{l.label}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" id="model-label">
                Modelo de IA
              </label>
              <div className="flex flex-wrap gap-2" role="group" aria-labelledby="model-label">
                {MODELS.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    disabled={loading || noCredits}
                    aria-pressed={model === m.id}
                    onClick={() => setModel(m.id)}
                    className={`flex flex-col items-start px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      model === m.id
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
                    } disabled:opacity-50`}
                  >
                    <span>{m.label}</span>
                    <span className={`text-[10px] font-normal mt-0.5 ${
                      model === m.id ? 'text-indigo-200' : 'text-gray-400'
                    }`}>{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
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
                    Generando listing{languages.length > 1 ? `s en ${languages.length} idiomas` : ''}...
                  </span>
                ) : `Generar listing${languages.length > 1 ? ` en ${languages.length} idiomas` : ''} — 1 crédito`}
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
            <p className="text-sm text-gray-400">
              {languages.length > 1
                ? `Generando en ${languages.length} idiomas en paralelo...`
                : 'Generando tu listing...'}
            </p>
          </div>
        ) : result && activeListing ? (
          <div className="glass rounded-2xl shadow-sm shadow-indigo-100/50 border border-white/80 p-5 space-y-3 animate-fade-up">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-gray-900">Listing generado</h3>
              <button
                onClick={() => copyAll(activeListing)}
                className="text-xs text-indigo-600 hover:underline font-medium"
              >
                Copiar todo
              </button>
            </div>

            {resultTabs.length > 1 && (
              <div className="flex gap-1 border-b border-gray-100 pb-2" role="tablist">
                {resultTabs.map(lang => {
                  const langLabel = LANGUAGES.find(l => l.code === lang)?.label ?? lang
                  return (
                    <button
                      key={lang}
                      role="tab"
                      aria-selected={activeTab === lang}
                      onClick={() => setActiveTab(lang)}
                      className={`px-3 py-1 rounded-t-lg text-xs font-medium transition-colors capitalize ${
                        activeTab === lang
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-500 hover:text-indigo-600'
                      }`}
                    >
                      {langLabel}
                    </button>
                  )
                })}
              </div>
            )}

            <Field label="Título" value={activeListing.title} onCopy={() => copy(activeListing.title)} />
            <Field label="Descripción" value={activeListing.description} onCopy={() => copy(activeListing.description)} multiline />
            <Field label="Meta-título SEO" value={activeListing.metaTitle} onCopy={() => copy(activeListing.metaTitle)} />
            <Field label="Meta-descripción SEO" value={activeListing.metaDescription} onCopy={() => copy(activeListing.metaDescription)} />

            <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Puntos clave</span>
                <button onClick={() => copy(activeListing.bulletPoints.map(b => `• ${b}`).join('\n'))} className="text-xs text-indigo-600 hover:underline">Copiar</button>
              </div>
              <ul className="space-y-1">
                {activeListing.bulletPoints.map((point, i) => (
                  <li key={i} className="text-sm text-gray-700 flex gap-2"><span className="text-indigo-400">•</span>{point}</li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Palabras clave SEO</span>
                <button onClick={() => copy(activeListing.keywords.join(', '))} className="text-xs text-indigo-600 hover:underline">Copiar</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeListing.keywords.map((kw, i) => (
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
