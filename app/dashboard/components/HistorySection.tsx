'use client'

import { useState } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────

type FlatListing = {
  title?: string
  description?: string
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
  bulletPoints?: string[]
}

type BreakdownArea = { score: number; feedback: string }

type AnalysisResult = {
  _type: 'analysis'
  score: number
  breakdown: { title: BreakdownArea; description: BreakdownArea; keywords: BreakdownArea; seo: BreakdownArea }
  strengths: string[]
  suggestions: string[]
}

type BulkRowResult =
  | { status: 'ok';    name: string; listing: FlatListing }
  | { status: 'error'; name: string; error: string }

type BulkResult = { _type: 'bulk'; results: BulkRowResult[] }

type Generation = {
  id: string
  prompt: string
  created_at: string
  listing: unknown
}

// ── Helpers ──────────────────────────────────────────────────────────────────

type EntryType = 'generation' | 'analysis' | 'bulk'

function getEntryType(raw: unknown): EntryType {
  if (raw && typeof raw === 'object') {
    const t = (raw as Record<string, unknown>)._type
    if (t === 'analysis') return 'analysis'
    if (t === 'bulk') return 'bulk'
  }
  return 'generation'
}

function parseListing(raw: unknown): { listing: FlatListing; langs: string[] } {
  if (!raw || typeof raw !== 'object') return { listing: {}, langs: [] }
  const obj = raw as Record<string, unknown>
  if (typeof obj.title === 'string') return { listing: obj as FlatListing, langs: [] }
  const langs = Object.keys(obj).filter(k => k !== '_type')
  const first = (Object.values(obj).find(v => v && typeof v === 'object') ?? {}) as FlatListing
  return { listing: first, langs }
}

function copy(text: string) { navigator.clipboard.writeText(text) }

function scoreColor(score: number) {
  if (score >= 75) return { text: 'text-green-600', bg: 'bg-green-100', bar: 'bg-green-500' }
  if (score >= 50) return { text: 'text-amber-600', bg: 'bg-amber-100', bar: 'bg-amber-400' }
  return { text: 'text-red-500', bg: 'bg-red-100', bar: 'bg-red-400' }
}

function downloadCSV(results: BulkRowResult[], prompt: string) {
  const header = 'Nombre,Título,Descripción,Meta-título,Meta-descripción,Keywords,Bullet points'
  const rows = results.map(r => {
    if (r.status === 'error') return [r.name, 'ERROR: ' + r.error, '', '', '', '', ''].map(v => `"${v.replace(/"/g, '""')}"`).join(',')
    const l = r.listing
    return [r.name, l.title ?? '', l.description ?? '', l.metaTitle ?? '', l.metaDescription ?? '', (l.keywords ?? []).join('; '), (l.bulletPoints ?? []).join(' | ')].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
  })
  const csv = [header, ...rows].join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `bulk-typify-${Date.now()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ── Field component ───────────────────────────────────────────────────────────

function Field({ label, value, onCopy, multiline }: { label: string; value: string; onCopy: () => void; multiline?: boolean }) {
  return (
    <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <button type="button" onClick={onCopy} className="text-xs text-indigo-600 hover:underline">Copiar</button>
      </div>
      <p className={`text-sm text-gray-800 ${multiline ? 'whitespace-pre-wrap leading-relaxed' : ''}`}>{value}</p>
    </div>
  )
}

// ── Expanded panels ───────────────────────────────────────────────────────────

function GenerationPanel({ listing, langs, genId, activeTabMap, onTabChange }: {
  listing: FlatListing
  langs: string[]
  genId: string
  activeTabMap: Record<string, string>
  onTabChange: (id: string, lang: string) => void
  rawListing: unknown
}) {
  const activeTab = activeTabMap[genId] ?? langs[0] ?? ''

  return (
    <div className="border-t border-gray-100 p-4 space-y-3 bg-white/60">
      <div className="flex items-center justify-between">
        {langs.length > 1 ? (
          <div className="flex gap-1" role="tablist">
            {langs.map(l => (
              <button key={l} type="button" role="tab" aria-selected={activeTab === l}
                onClick={() => onTabChange(genId, l)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors capitalize ${activeTab === l ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 hover:text-indigo-600'}`}
              >{l}</button>
            ))}
          </div>
        ) : <span />}
        <button type="button" onClick={() => copy(`TÍTULO\n${listing.title ?? ''}\n\nDESCRIPCIÓN\n${listing.description ?? ''}\n\nMETA-TÍTULO\n${listing.metaTitle ?? ''}\n\nMETA-DESCRIPCIÓN\n${listing.metaDescription ?? ''}\n\nPUNTOS CLAVE\n${listing.bulletPoints?.map(b => `• ${b}`).join('\n') ?? ''}\n\nPALABRAS CLAVE\n${listing.keywords?.join(', ') ?? ''}`)}
          className="text-xs text-indigo-600 hover:underline font-medium">Copiar todo</button>
      </div>
      {listing.title && <Field label="Título" value={listing.title} onCopy={() => copy(listing.title!)} />}
      {listing.description && <Field label="Descripción" value={listing.description} onCopy={() => copy(listing.description!)} multiline />}
      {listing.metaTitle && <Field label="Meta-título SEO" value={listing.metaTitle} onCopy={() => copy(listing.metaTitle!)} />}
      {listing.metaDescription && <Field label="Meta-descripción SEO" value={listing.metaDescription} onCopy={() => copy(listing.metaDescription!)} />}
      {listing.bulletPoints && listing.bulletPoints.length > 0 && (
        <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Puntos clave</span>
            <button type="button" onClick={() => copy(listing.bulletPoints!.map(b => `• ${b}`).join('\n'))} className="text-xs text-indigo-600 hover:underline">Copiar</button>
          </div>
          <ul className="space-y-1">{listing.bulletPoints.map((p, i) => <li key={i} className="text-sm text-gray-700 flex gap-2"><span className="text-indigo-400">•</span>{p}</li>)}</ul>
        </div>
      )}
      {listing.keywords && listing.keywords.length > 0 && (
        <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Palabras clave SEO</span>
            <button type="button" onClick={() => copy(listing.keywords!.join(', '))} className="text-xs text-indigo-600 hover:underline">Copiar</button>
          </div>
          <div className="flex flex-wrap gap-2">{listing.keywords.map((kw, i) => <span key={i} className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full">{kw}</span>)}</div>
        </div>
      )}
    </div>
  )
}

function AnalysisPanel({ data }: { data: AnalysisResult }) {
  const c = scoreColor(data.score)
  const areas = [
    { label: 'Título', area: data.breakdown.title },
    { label: 'Descripción', area: data.breakdown.description },
    { label: 'Keywords', area: data.breakdown.keywords },
    { label: 'SEO general', area: data.breakdown.seo },
  ]
  return (
    <div className="border-t border-gray-100 p-4 space-y-4 bg-white/60">
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl ${c.bg} flex flex-col items-center justify-center shrink-0`}>
          <span className={`text-xl font-bold leading-none ${c.text}`}>{data.score}</span>
          <span className="text-[9px] text-gray-400">/100</span>
        </div>
        <div className="grid grid-cols-2 gap-2 flex-1">
          {areas.map(({ label, area }) => {
            const ac = scoreColor(area.score)
            return (
              <div key={label} className="bg-gray-50/80 border border-gray-200 rounded-xl p-2.5">
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] font-medium text-gray-500">{label}</span>
                  <span className={`text-[10px] font-bold ${ac.text}`}>{area.score}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1 mb-1.5"><div className={`h-1 rounded-full ${ac.bar}`} style={{ width: `${area.score}%` }} /></div>
                <p className="text-[10px] text-gray-400 leading-snug">{area.feedback}</p>
              </div>
            )
          })}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="bg-green-50 border border-green-100 rounded-xl p-3">
          <p className="text-[10px] font-semibold text-green-700 uppercase tracking-wide mb-2">Puntos fuertes</p>
          <ul className="space-y-1">{data.strengths.map((s, i) => <li key={i} className="text-xs text-gray-600 flex gap-1.5"><span className="text-green-500 shrink-0">•</span>{s}</li>)}</ul>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
          <p className="text-[10px] font-semibold text-indigo-700 uppercase tracking-wide mb-2">Cómo mejorarlo</p>
          <ul className="space-y-1">{data.suggestions.map((s, i) => <li key={i} className="text-xs text-gray-600 flex gap-1.5"><span className="text-indigo-500 font-bold shrink-0">{i + 1}.</span>{s}</li>)}</ul>
        </div>
      </div>
    </div>
  )
}

function BulkPanel({ data, prompt }: { data: BulkResult; prompt: string }) {
  const ok  = data.results.filter(r => r.status === 'ok').length
  const err = data.results.filter(r => r.status === 'error').length
  return (
    <div className="border-t border-gray-100 bg-white/60">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex gap-2">
          {ok  > 0 && <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">{ok} ok</span>}
          {err > 0 && <span className="text-xs bg-red-100 text-red-600 font-medium px-2 py-0.5 rounded-full">{err} error</span>}
        </div>
        <button type="button" onClick={() => downloadCSV(data.results, prompt)}
          className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-medium hover:opacity-90 transition">
          Descargar CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead><tr className="bg-gray-50/80">
            <th className="text-left px-4 py-2 font-medium text-gray-500">Producto</th>
            <th className="text-left px-4 py-2 font-medium text-gray-500">Título generado</th>
            <th className="text-left px-4 py-2 font-medium text-gray-500">Estado</th>
          </tr></thead>
          <tbody>
            {data.results.map((r, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="px-4 py-2.5 text-gray-700 font-medium truncate max-w-[140px]">{r.name}</td>
                <td className="px-4 py-2.5 text-gray-500 truncate max-w-[200px]">
                  {r.status === 'ok' ? r.listing.title ?? '—' : <span className="text-red-500">{r.error}</span>}
                </td>
                <td className="px-4 py-2.5">
                  {r.status === 'ok' ? <span className="text-green-600 font-medium">✓</span> : <span className="text-red-500">✗</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function HistorySection({ generations }: { generations: Generation[] }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [activeTabMap, setActiveTabMap] = useState<Record<string, string>>({})

  if (!generations || generations.length === 0) {
    return (
      <div className="glass rounded-2xl shadow-sm shadow-indigo-100/50 border border-white/80 p-6 text-center">
        <p className="text-sm text-gray-400">Aún no has generado ningún listing.</p>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl shadow-sm shadow-indigo-100/50 border border-white/80 p-5">
      <h2 className="text-sm font-semibold text-gray-800 mb-4">
        Historial <span className="text-gray-400 font-normal">({generations.length})</span>
      </h2>

      <div className="space-y-2">
        {generations.map((gen) => {
          const type = getEntryType(gen.listing)
          const isOpen = openId === gen.id
          const panelId = `history-panel-${gen.id}`

          // Badge config per type
          const badge =
            type === 'analysis' ? <span className="text-[9px] font-semibold bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded uppercase tracking-wide">Análisis</span>
            : type === 'bulk'   ? <span className="text-[9px] font-semibold bg-teal-100 text-teal-600 px-1.5 py-0.5 rounded uppercase tracking-wide">Bulk</span>
            : null

          // Title per type
          let title = gen.prompt
          let subtitle = ''
          if (type === 'analysis') {
            const d = gen.listing as AnalysisResult
            subtitle = `Puntuación: ${d.score}/100`
          } else if (type === 'bulk') {
            const d = gen.listing as BulkResult
            const ok  = d.results?.filter(r => r.status === 'ok').length ?? 0
            const tot = d.results?.length ?? 0
            subtitle = `${tot} productos · ${ok} ok`
          } else {
            const { listing } = parseListing(gen.listing)
            title = listing.title || gen.prompt
          }

          return (
            <div key={gen.id} className="border border-gray-100 rounded-xl overflow-hidden">
              <button type="button" aria-expanded={isOpen} aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : gen.id)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50/80 transition-colors text-left"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {badge}
                    <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-400">
                      {new Date(gen.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
                    {type === 'generation' && (() => {
                      const { langs } = parseListing(gen.listing)
                      return langs.length > 1 ? langs.map(l => (
                        <span key={l} className="text-[10px] bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded capitalize">{l}</span>
                      )) : null
                    })()}
                  </div>
                </div>
                <span className={`text-xs font-medium shrink-0 transition-colors ${isOpen ? 'text-indigo-600' : 'text-gray-400'}`}>
                  {isOpen ? 'Cerrar ↑' : 'Ver ↓'}
                </span>
              </button>

              {isOpen && (
                type === 'analysis' ? (
                  <AnalysisPanel data={gen.listing as AnalysisResult} />
                ) : type === 'bulk' ? (
                  <BulkPanel data={gen.listing as BulkResult} prompt={gen.prompt} />
                ) : (() => {
                  const { listing, langs } = parseListing(gen.listing)
                  const activeTab = activeTabMap[gen.id] ?? langs[0] ?? ''
                  const rawResult = gen.listing as Record<string, FlatListing> | null
                  const activeListing: FlatListing = langs.length > 1 && rawResult
                    ? (rawResult[activeTab] ?? listing) : listing
                  return (
                    <GenerationPanel
                      listing={activeListing} langs={langs} genId={gen.id}
                      activeTabMap={activeTabMap} rawListing={gen.listing}
                      onTabChange={(id, lang) => setActiveTabMap(prev => ({ ...prev, [id]: lang }))}
                    />
                  )
                })()
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
