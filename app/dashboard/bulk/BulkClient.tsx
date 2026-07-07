'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { BulkProduct, BulkRowResult, BulkListing } from '@/app/api/bulk-generate/route'

const PLATFORMS = ['', 'Amazon', 'Etsy', 'Shopify', 'eBay', 'WooCommerce']
const LANGUAGES = [
  { code: 'español',   label: 'Español'   },
  { code: 'inglés',    label: 'English'   },
  { code: 'francés',   label: 'Français'  },
  { code: 'alemán',    label: 'Deutsch'   },
  { code: 'italiano',  label: 'Italiano'  },
  { code: 'portugués', label: 'Português' },
]

const TEMPLATE_CSV = `nombre,categoría,características
Vela de lavanda,Hogar,200g de cera de soja natural con aroma a lavanda
Camiseta de algodón,Moda,100% algodón orgánico disponible en tallas S-XL`

function parseCSV(text: string): BulkProduct[] {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) return []

  // Skip header row
  return lines.slice(1).map(line => {
    // Simple CSV parse: handle quoted fields
    const cols: string[] = []
    let cur = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') { inQuotes = !inQuotes }
      else if (ch === ',' && !inQuotes) { cols.push(cur.trim()); cur = '' }
      else { cur += ch }
    }
    cols.push(cur.trim())
    return {
      name:     cols[0] ?? '',
      category: cols[1] ?? '',
      features: cols[2] ?? '',
    }
  }).filter(p => p.name.length > 0)
}

function generateResultCSV(results: BulkRowResult[]): string {
  const header = 'Nombre,Título,Descripción,Meta-título,Meta-descripción,Keywords,Bullet points'
  const rows = results.map(r => {
    if (r.status === 'error') {
      return [r.name, 'ERROR: ' + r.error, '', '', '', '', ''].map(v => `"${v.replace(/"/g, '""')}"`).join(',')
    }
    const l = r.listing as BulkListing
    return [
      r.name,
      l.title,
      l.description,
      l.metaTitle,
      l.metaDescription,
      l.keywords.join('; '),
      l.bulletPoints.join(' | '),
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
  })
  return [header, ...rows].join('\n')
}

function downloadCSV(content: string, filename: string) {
  const blob = new Blob(['﻿' + content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function BulkClient({
  credits,
  plan,
  maxProducts,
}: {
  credits: number
  plan: 'free' | 'pro'
  maxProducts: number
}) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [products, setProducts] = useState<BulkProduct[]>([])
  const [platform, setPlatform] = useState('')
  const [language, setLanguage] = useState('español')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState<BulkRowResult[] | null>(null)

  const cost = products.length
  const canGenerate = cost > 0 && cost <= maxProducts && credits >= cost && !loading

  function handleFile(file: File) {
    const reader = new FileReader()
    reader.onload = e => {
      const text = e.target?.result as string
      const parsed = parseCSV(text)
      setProducts(parsed)
      setResults(null)
      setError('')
    }
    reader.readAsText(file, 'utf-8')
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  async function handleGenerate() {
    setLoading(true)
    setError('')
    setResults(null)

    const res = await fetch('/api/bulk-generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products, platform, language }),
    })

    if (!res.ok) {
      setError((await res.text()) || 'Error al generar. Inténtalo de nuevo.')
      setLoading(false)
      return
    }

    const data: BulkRowResult[] = await res.json()
    setResults(data)
    setLoading(false)
    router.refresh()
  }

  const ok  = results?.filter(r => r.status === 'ok').length ?? 0
  const err = results?.filter(r => r.status === 'error').length ?? 0

  return (
    <div className="space-y-6">
      {/* Config row */}
      <div className="glass rounded-2xl border border-white/80 shadow-sm shadow-indigo-100/40 p-5 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Plataforma</label>
            <select
              value={platform}
              onChange={e => setPlatform(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="">Genérico</option>
              {PLATFORMS.slice(1).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Idioma</label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
          </div>
        </div>

        {/* Upload area */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Archivo CSV</label>
            <button
              type="button"
              onClick={() => downloadCSV(TEMPLATE_CSV, 'plantilla-typify.csv')}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              Descargar plantilla →
            </button>
          </div>
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors"
          >
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
            />
            {products.length === 0 ? (
              <>
                <p className="text-sm text-gray-500">Arrastra tu CSV aquí o <span className="text-indigo-600 font-medium">haz clic para seleccionar</span></p>
                <p className="text-xs text-gray-400 mt-1">Columnas: nombre, categoría, características</p>
              </>
            ) : (
              <p className="text-sm text-indigo-600 font-medium">{products.length} productos detectados · haz clic para cambiar el archivo</p>
            )}
          </div>
        </div>
      </div>

      {/* Preview */}
      {products.length > 0 && !results && (
        <div className="glass rounded-2xl border border-white/80 shadow-sm shadow-indigo-100/40 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/60 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800">Vista previa — {products.length} productos</h2>
            {products.length > maxProducts && (
              <span className="text-xs text-red-500 font-medium">Máximo {maxProducts} para tu plan</span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="text-left px-5 py-2.5 font-medium text-gray-500">Nombre</th>
                  <th className="text-left px-4 py-2.5 font-medium text-gray-500">Categoría</th>
                  <th className="text-left px-4 py-2.5 font-medium text-gray-500">Características</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 10).map((p, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="px-5 py-2.5 text-gray-800 font-medium truncate max-w-[160px]">{p.name}</td>
                    <td className="px-4 py-2.5 text-gray-500 truncate max-w-[120px]">{p.category || '—'}</td>
                    <td className="px-4 py-2.5 text-gray-400 truncate max-w-[220px]">{p.features || '—'}</td>
                  </tr>
                ))}
                {products.length > 10 && (
                  <tr className="border-t border-gray-100">
                    <td colSpan={3} className="px-5 py-2.5 text-gray-400 italic">… y {products.length - 10} más</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {error && (
            <div className="px-5 pb-4 pt-2">
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
            </div>
          )}

          <div className="px-5 py-4 border-t border-white/60 flex items-center justify-between">
            <div className="text-xs text-gray-500 space-y-0.5">
              <p>Coste: <span className="font-semibold text-gray-700">{cost} crédito{cost !== 1 ? 's' : ''}</span></p>
              <p>Tienes: <span className={`font-semibold ${credits < cost ? 'text-red-500' : 'text-gray-700'}`}>{credits} créditos</span></p>
              {plan === 'free' && <p className="text-amber-600">Plan Free: máx {maxProducts} productos · <a href="/upgrade" className="underline">Actualizar a Pro</a></p>}
            </div>
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Generando {cost} listings…
                </>
              ) : `Generar ${cost} listing${cost !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="glass rounded-2xl border border-white/80 shadow-sm shadow-indigo-100/40 overflow-hidden animate-fade-up">
          <div className="px-5 py-4 border-b border-white/60 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold text-gray-800">Resultados</h2>
              {ok > 0 && <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">{ok} ok</span>}
              {err > 0 && <span className="text-xs bg-red-100 text-red-600 font-medium px-2 py-0.5 rounded-full">{err} error</span>}
            </div>
            <button
              onClick={() => downloadCSV(generateResultCSV(results), 'listings-typify.csv')}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs px-4 py-2 rounded-xl font-semibold hover:opacity-90 transition flex items-center gap-1.5"
            >
              Descargar CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="text-left px-5 py-2.5 font-medium text-gray-500">Producto</th>
                  <th className="text-left px-4 py-2.5 font-medium text-gray-500">Título generado</th>
                  <th className="text-left px-4 py-2.5 font-medium text-gray-500">Estado</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="px-5 py-3 text-gray-700 font-medium truncate max-w-[160px]">{r.name}</td>
                    <td className="px-4 py-3 text-gray-500 truncate max-w-[280px]">
                      {r.status === 'ok' ? r.listing.title : <span className="text-red-500">{r.error}</span>}
                    </td>
                    <td className="px-4 py-3">
                      {r.status === 'ok'
                        ? <span className="text-green-600 font-medium">✓ Listo</span>
                        : <span className="text-red-500">✗ Error</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-white/60 text-xs text-gray-400">
            El CSV descargado incluye todos los campos: título, descripción, meta-título, meta-descripción, keywords y bullet points.
          </div>
        </div>
      )}
    </div>
  )
}
