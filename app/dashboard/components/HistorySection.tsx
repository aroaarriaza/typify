'use client'

import { useState } from 'react'

type FlatListing = {
  title?: string
  description?: string
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
  bulletPoints?: string[]
}

type Generation = {
  id: string
  prompt: string
  created_at: string
  listing: unknown
}

function parseListing(raw: unknown): { listing: FlatListing; langs: string[] } {
  if (!raw || typeof raw !== 'object') return { listing: {}, langs: [] }
  const obj = raw as Record<string, unknown>
  if (typeof obj.title === 'string') return { listing: obj as FlatListing, langs: [] }
  const langs = Object.keys(obj)
  const first = (Object.values(obj)[0] ?? {}) as FlatListing
  return { listing: first, langs }
}

function Field({ label, value, copyLabel, onCopy, multiline }: {
  label: string
  value: string
  copyLabel: string
  onCopy: () => void
  multiline?: boolean
}) {
  return (
    <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <button type="button" onClick={onCopy} aria-label={copyLabel} className="text-xs text-indigo-600 hover:underline">Copiar</button>
      </div>
      <p className={`text-sm text-gray-800 ${multiline ? 'whitespace-pre-wrap leading-relaxed' : ''}`}>{value}</p>
    </div>
  )
}

export default function HistorySection({ generations }: { generations: Generation[] }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [activeTabMap, setActiveTabMap] = useState<Record<string, string>>({})

  function copy(text: string) { navigator.clipboard.writeText(text) }

  function setTab(genId: string, lang: string) {
    setActiveTabMap(prev => ({ ...prev, [genId]: lang }))
  }

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
          const { listing: firstListing, langs } = parseListing(gen.listing)
          const isOpen = openId === gen.id
          const title = firstListing.title || gen.prompt
          const panelId = `history-panel-${gen.id}`
          const activeTab = activeTabMap[gen.id] ?? langs[0] ?? ''
          const rawResult = gen.listing as Record<string, FlatListing> | null
          const activeListing: FlatListing = langs.length > 1 && rawResult
            ? (rawResult[activeTab] ?? firstListing)
            : firstListing

          return (
            <div key={gen.id} className="border border-gray-100 rounded-xl overflow-hidden">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : gen.id)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50/80 transition-colors text-left"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-gray-400">
                      {new Date(gen.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    {langs.length > 1 && langs.map(l => (
                      <span key={l} className="text-[10px] bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded capitalize">{l}</span>
                    ))}
                  </div>
                </div>
                <span className={`text-xs font-medium shrink-0 transition-colors ${isOpen ? 'text-indigo-600' : 'text-gray-400'}`}>
                  {isOpen ? 'Cerrar ↑' : 'Ver listing ↓'}
                </span>
              </button>

              {isOpen && (
                <div id={panelId} className="border-t border-gray-100 p-4 space-y-3 bg-white/60">
                  <div className="flex items-center justify-between">
                    {langs.length > 1 ? (
                      <div className="flex gap-1" role="tablist">
                        {langs.map(l => (
                          <button
                            key={l}
                            type="button"
                            role="tab"
                            aria-selected={activeTab === l}
                            onClick={() => setTab(gen.id, l)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors capitalize ${
                              activeTab === l ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 hover:text-indigo-600'
                            }`}
                          >{l}</button>
                        ))}
                      </div>
                    ) : <span />}
                    <button
                      type="button"
                      aria-label="Copiar listing completo"
                      onClick={() => copy(
                        `TÍTULO\n${activeListing.title ?? ''}\n\nDESCRIPCIÓN\n${activeListing.description ?? ''}\n\nMETA-TÍTULO\n${activeListing.metaTitle ?? ''}\n\nMETA-DESCRIPCIÓN\n${activeListing.metaDescription ?? ''}\n\nPUNTOS CLAVE\n${activeListing.bulletPoints?.map(b => `• ${b}`).join('\n') ?? ''}\n\nPALABRAS CLAVE\n${activeListing.keywords?.join(', ') ?? ''}`
                      )}
                      className="text-xs text-indigo-600 hover:underline font-medium"
                    >
                      Copiar todo
                    </button>
                  </div>

                  {activeListing.title && <Field label="Título" value={activeListing.title} copyLabel="Copiar título" onCopy={() => copy(activeListing.title!)} />}
                  {activeListing.description && <Field label="Descripción" value={activeListing.description} copyLabel="Copiar descripción" onCopy={() => copy(activeListing.description!)} multiline />}
                  {activeListing.metaTitle && <Field label="Meta-título SEO" value={activeListing.metaTitle} copyLabel="Copiar meta-título" onCopy={() => copy(activeListing.metaTitle!)} />}
                  {activeListing.metaDescription && <Field label="Meta-descripción SEO" value={activeListing.metaDescription} copyLabel="Copiar meta-descripción" onCopy={() => copy(activeListing.metaDescription!)} />}

                  {activeListing.bulletPoints && activeListing.bulletPoints.length > 0 && (
                    <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Puntos clave</span>
                        <button type="button" aria-label="Copiar puntos clave" onClick={() => copy(activeListing.bulletPoints!.map(b => `• ${b}`).join('\n'))} className="text-xs text-indigo-600 hover:underline">Copiar</button>
                      </div>
                      <ul className="space-y-1">
                        {activeListing.bulletPoints.map((point, i) => (
                          <li key={i} className="text-sm text-gray-700 flex gap-2"><span className="text-indigo-400">•</span>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeListing.keywords && activeListing.keywords.length > 0 && (
                    <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Palabras clave SEO</span>
                        <button type="button" aria-label="Copiar palabras clave" onClick={() => copy(activeListing.keywords!.join(', '))} className="text-xs text-indigo-600 hover:underline">Copiar</button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {activeListing.keywords.map((kw, i) => (
                          <span key={i} className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full">{kw}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
