'use client'

import { useState, useEffect } from 'react'

const STEPS = [
  {
    emoji: '👋',
    title: '¡Bienvenida a Typify!',
    body: 'Typify genera listings completos para vender tus productos online. Título, descripción, meta-tags y bullet points optimizados para SEO, en segundos.',
  },
  {
    emoji: '⚡',
    title: 'Así funcionan los créditos',
    body: 'Cada generación consume 1 crédito. Con el plan gratuito tienes 10 créditos para empezar. Cuando se acaben, puedes pasarte a Pro y obtener 100 al mes.',
  },
  {
    emoji: '🚀',
    title: 'Tu primer listing en 3 pasos',
    body: '1. Escribe el nombre de tu producto.\n2. Elige la plataforma (Amazon, Etsy…) y el tono.\n3. Pulsa Generar y copia el resultado.',
  },
]

export default function OnboardingModal() {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!localStorage.getItem('typify_onboarding_done')) {
      setVisible(true)
    }
  }, [])

  function next() {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      finish()
    }
  }

  function finish() {
    localStorage.setItem('typify_onboarding_done', '1')
    setVisible(false)
  }

  if (!visible) return null

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>
      <div role="dialog" aria-modal="true" aria-labelledby="onboarding-title" className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 flex flex-col gap-6">

        {/* Dots */}
        <div className="flex gap-2 justify-center">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === step ? 24 : 8,
                background: i === step ? '#6366f1' : '#e0e0f0',
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center flex flex-col gap-3">
          <span className="text-5xl">{current.emoji}</span>
          <h2 id="onboarding-title" className="text-xl font-bold text-gray-900">{current.title}</h2>
          <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">{current.body}</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={next}
            className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            {isLast ? 'Empezar a generar' : 'Siguiente →'}
          </button>
          {!isLast && (
            <button type="button" onClick={finish} className="text-xs text-gray-400 hover:text-gray-600 transition-colors py-1">
              Saltar tutorial
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
