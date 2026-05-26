'use client'

import { useCompletion } from 'ai/react'
import { useRouter } from 'next/navigation'

const EXAMPLES = [
  'Escribe una descripción de producto para unos auriculares inalámbricos premium',
  'Crea un email de bienvenida para nuevos usuarios de una app de fitness',
  'Redacta un eslogan para una cafetería especializada en café de especialidad',
]

export default function Generator({ credits }: { credits: number }) {
  const router = useRouter()

  const { completion, input, handleInputChange, handleSubmit, isLoading, error, setCompletion } = useCompletion({
    api: '/api/generate',
    onFinish: () => {
      router.refresh() // recarga el servidor para actualizar los créditos
    },
    onError: (err) => {
      if (err.message.includes('402') || err.message.toLowerCase().includes('crédito')) {
        router.push('/upgrade')
      }
    },
  })

  const noCredits = credits <= 0

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ¿Qué texto quieres generar?
          </label>
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Ej: Escribe una descripción de producto para..."
            rows={3}
            disabled={isLoading || noCredits}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none disabled:bg-gray-50 disabled:text-gray-400"
          />
        </div>

        {/* Ejemplos rápidos */}
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              disabled={isLoading || noCredits}
              onClick={() => {
                handleInputChange({ target: { value: example } } as React.ChangeEvent<HTMLTextAreaElement>)
              }}
              className="text-xs bg-gray-100 hover:bg-indigo-50 hover:text-indigo-700 text-gray-600 px-3 py-1.5 rounded-full transition-colors disabled:opacity-40"
            >
              {example.slice(0, 40)}…
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading || noCredits || !input.trim()}
          className="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generando...' : noCredits ? 'Sin créditos disponibles' : 'Generar texto — 1 crédito'}
        </button>
      </form>

      {/* Resultado con streaming */}
      {(completion || isLoading) && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Resultado</span>
            {completion && !isLoading && (
              <button
                onClick={() => navigator.clipboard.writeText(completion)}
                className="text-xs text-indigo-600 hover:underline"
              >
                Copiar
              </button>
            )}
          </div>
          <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
            {completion}
            {isLoading && <span className="animate-pulse">▍</span>}
          </p>
        </div>
      )}

      {noCredits && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-sm text-amber-800 font-medium mb-2">Has agotado tus créditos gratuitos</p>
          <a
            href="/upgrade"
            className="inline-block bg-amber-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
          >
            Actualizar a Pro — 9€/mes
          </a>
        </div>
      )}
    </div>
  )
}
