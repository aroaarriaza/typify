'use client'

import { useState } from 'react'

type Listing = {
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
  listing: Listing
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

  function copy(text: string) { navigator.clipboard.writeText(text) }

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
          const { listing } = gen
          const isOpen = openId === gen.id
          const title = listing.title || gen.prompt
          const panelId = `history-panel-${gen.id}`

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
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(gen.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <span className={`text-xs font-medium shrink-0 transition-colors ${isOpen ? 'text-indigo-600' : 'text-gray-400'}`}>
                  {isOpen ? 'Cerrar ↑' : 'Ver listing ↓'}
                </span>
              </button>

              {isOpen && (
                <div id={panelId} className="border-t border-gray-100 p-4 space-y-3 bg-white/60">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      aria-label="Copiar listing completo"
                      onClick={() => copy(
                        `TÍTULO\n${listing.title ?? ''}\n\nDESCRIPCIÓN\n${listing.description ?? ''}\n\nMETA-TÍTULO\n${listing.metaTitle ?? ''}\n\nMETA-DESCRIPCIÓN\n${listing.metaDescription ?? ''}\n\nPUNTOS CLAVE\n${listing.bulletPoints?.map(b => `• ${b}`).join('\n') ?? ''}\n\nPALABRAS CLAVE\n${listing.keywords?.join(', ') ?? ''}`
                      )}
                      className="text-xs text-indigo-600 hover:underline font-medium"
                    >
                      Copiar todo
                    </button>
                  </div>

                  {listing.title && <Field label="Título" value={listing.title} copyLabel="Copiar título" onCopy={() => copy(listing.title!)} />}
                  {listing.description && <Field label="Descripción" value={listing.description} copyLabel="Copiar descripción" onCopy={() => copy(listing.description!)} multiline />}
                  {listing.metaTitle && <Field label="Meta-título SEO" value={listing.metaTitle} copyLabel="Copiar meta-título" onCopy={() => copy(listing.metaTitle!)} />}
                  {listing.metaDescription && <Field label="Meta-descripción SEO" value={listing.metaDescription} copyLabel="Copiar meta-descripción" onCopy={() => copy(listing.metaDescription!)} />}

                  {listing.bulletPoints && listing.bulletPoints.length > 0 && (
                    <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Puntos clave</span>
                        <button type="button" aria-label="Copiar puntos clave" onClick={() => copy(listing.bulletPoints!.map(b => `• ${b}`).join('\n'))} className="text-xs text-indigo-600 hover:underline">Copiar</button>
                      </div>
                      <ul className="space-y-1">
                        {listing.bulletPoints.map((point, i) => (
                          <li key={i} className="text-sm text-gray-700 flex gap-2"><span className="text-indigo-400">•</span>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {listing.keywords && listing.keywords.length > 0 && (
                    <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Palabras clave SEO</span>
                        <button type="button" aria-label="Copiar palabras clave" onClick={() => copy(listing.keywords!.join(', '))} className="text-xs text-indigo-600 hover:underline">Copiar</button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {listing.keywords.map((kw, i) => (
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
