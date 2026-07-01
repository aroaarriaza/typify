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
      return [...prev, code]
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

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
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl py-3 text-sm font-semibold hover:from-indigo-700 hover:to-violet-700 transition-all disabled:opacity-50 shadow-sm shadow-indigo-200 glow-btn"
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
      <div className={loading || result ? 'lg:sticky lg:top-20' : 'flex flex-col'}>
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
          <div className="flex-1 grid grid-rows-[auto_1fr_auto] glass rounded-2xl shadow-sm shadow-indigo-100/50 border border-white/80 overflow-hidden animate-fade-in">
            {/* Gradient header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 px-5 py-5">
              <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-violet-400/20 rounded-full blur-xl pointer-events-none" />
              <div className="relative flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shrink-0">
                  <span className="text-white text-base">✦</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Typify genera por ti</p>
                  <p className="text-xs text-white/65 mt-0.5">Listing completo y optimizado para SEO</p>
                </div>
              </div>
            </div>

            {/* Feature list */}
            <div className="px-5 py-5 flex flex-col justify-evenly">
              {([
                { icon: '📌', label: 'Título SEO', example: 'Auriculares Bluetooth Pro — Cancelación de ruido activa, 30h', pill: 'bg-amber-50 border-amber-100 text-amber-600' },
                { icon: '📝', label: 'Descripción persuasiva', example: 'Sumérgete en el sonido con nuestros auriculares de última generación...', pill: 'bg-blue-50 border-blue-100 text-blue-600' },
                { icon: '🔍', label: 'Meta título + descripción', example: 'Optimizados para posicionar en Google y marketplaces', pill: 'bg-indigo-50 border-indigo-100 text-indigo-600' },
                { icon: '✦', label: 'Puntos clave', example: '5 bullet points persuasivos para Amazon o Etsy', pill: 'bg-violet-50 border-violet-100 text-violet-600' },
                { icon: '🏷', label: 'Keywords SEO', example: 'auriculares bluetooth, noise cancelling, inalámbricos...', pill: 'bg-rose-50 border-rose-100 text-rose-600' },
              ] as const).map((item, i) => (
                <div
                  key={item.label}
                  className="flex gap-3 items-start animate-fade-up"
                  style={{ animationDelay: `${i * 70}ms`, animationFillMode: 'both' }}
                >
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg border text-xs shrink-0 ${item.pill}`}>
                    {item.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-800">{item.label}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{item.example}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer CTA */}
            <div className="px-5 py-3.5 bg-gradient-to-r from-indigo-50/60 to-violet-50/60 border-t border-indigo-100/60">
              <p className="text-[11px] text-center text-gray-400">
                Rellena el formulario →{' '}
                <span className="text-indigo-600 font-semibold">Generar listing</span>
              </p>
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
