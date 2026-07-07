'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AnalysisResult } from '@/app/api/analyze/route'

function ScoreRing({ score }: { score: number }) {
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'
  const label = score >= 75 ? 'Bueno' : score >= 50 ? 'Mejorable' : 'Débil'
  const r = 54
  const circumference = 2 * Math.PI * r
  const dash = (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
        <text x="70" y="66" textAnchor="middle" fontSize="32" fontWeight="700" fill={color}>{score}</text>
        <text x="70" y="84" textAnchor="middle" fontSize="11" fill="#9ca3af">/100</text>
      </svg>
      <span className="text-sm font-semibold" style={{ color }}>{label}</span>
    </div>
  )
}

function BreakdownCard({ label, score, feedback }: { label: string; score: number; feedback: string }) {
  const color = score >= 75 ? 'text-green-600' : score >= 50 ? 'text-amber-600' : 'text-red-500'
  const bg = score >= 75 ? 'bg-green-50 border-green-100' : score >= 50 ? 'bg-amber-50 border-amber-100' : 'bg-red-50 border-red-100'
  const bar = score >= 75 ? 'bg-green-500' : score >= 50 ? 'bg-amber-400' : 'bg-red-400'

  return (
    <div className={`glass rounded-xl border p-4 ${bg}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className={`text-sm font-bold ${color}`}>{score}</span>
      </div>
      <div className="w-full bg-white/60 rounded-full h-1.5 mb-2.5">
        <div className={`h-1.5 rounded-full transition-all duration-700 ${bar}`} style={{ width: `${score}%` }} />
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">{feedback}</p>
    </div>
  )
}

export default function AnalyzeClient({ credits }: { credits: number }) {
  const router = useRouter()
  const [listing, setListing] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const noCredits = credits <= 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!listing.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listing }),
    })

    if (!res.ok) {
      const text = await res.text()
      setError(text || 'Error al analizar. Inténtalo de nuevo.')
      setLoading(false)
      return
    }

    const data: AnalysisResult = await res.json()
    setResult(data)
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Form */}
      <form onSubmit={handleSubmit} className="glass rounded-2xl border border-white/80 shadow-sm shadow-indigo-100/40 p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pega tu listing actual
          </label>
          <textarea
            value={listing}
            onChange={e => setListing(e.target.value)}
            placeholder="Pega aquí el título, descripción, keywords y cualquier otro campo de tu listing actual. Cuanta más información incluyas, más preciso será el análisis."
            rows={10}
            maxLength={3000}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition bg-white/80"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{listing.length}/3000</p>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Coste: <span className="font-semibold text-gray-600">1 crédito</span>
            {' '}· Tienes <span className={`font-semibold ${credits <= 2 ? 'text-red-500' : 'text-gray-600'}`}>{credits}</span>
          </p>
          <button
            type="submit"
            disabled={loading || noCredits || !listing.trim()}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Analizando…
              </>
            ) : noCredits ? 'Sin créditos' : 'Analizar'}
          </button>
        </div>
      </form>

      {/* Results */}
      {result && (
        <div className="space-y-5 animate-fade-up">
          {/* Score + breakdown */}
          <div className="glass rounded-2xl border border-white/80 shadow-sm shadow-indigo-100/40 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-6">Resultado del análisis</h2>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
              <div className="shrink-0">
                <ScoreRing score={result.score} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 w-full">
                <BreakdownCard label="Título" score={result.breakdown.title.score} feedback={result.breakdown.title.feedback} />
                <BreakdownCard label="Descripción" score={result.breakdown.description.score} feedback={result.breakdown.description.feedback} />
                <BreakdownCard label="Keywords" score={result.breakdown.keywords.score} feedback={result.breakdown.keywords.feedback} />
                <BreakdownCard label="SEO general" score={result.breakdown.seo.score} feedback={result.breakdown.seo.feedback} />
              </div>
            </div>
          </div>

          {/* Strengths + suggestions */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="glass rounded-2xl border border-white/80 shadow-sm shadow-indigo-100/40 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-[11px]">✓</span>
                Puntos fuertes
              </h3>
              <ul className="space-y-2">
                {result.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-green-500 mt-0.5 shrink-0">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass rounded-2xl border border-white/80 shadow-sm shadow-indigo-100/40 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[11px]">↑</span>
                Cómo mejorarlo
              </h3>
              <ul className="space-y-2">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-indigo-500 mt-0.5 shrink-0 font-bold text-xs">{i + 1}.</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              ← Generar un listing mejorado
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
