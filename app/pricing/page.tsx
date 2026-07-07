import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Precios",
  description: "Empieza gratis con 10 créditos al mes. Actualiza a Pro por 9€/mes y obtén 100 créditos para generar listings ilimitados.",
  alternates: { canonical: "/pricing" },
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <Link href="/" className="text-xl font-bold text-indigo-600">Typify</Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Iniciar sesión</Link>
          <Link href="/register" className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Empezar gratis
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="text-center px-6 py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Precios simples y transparentes</h1>
        <p className="text-gray-500 max-w-md mx-auto">Empieza gratis. Actualiza cuando necesites más.</p>
      </section>

      {/* Plans */}
      <section className="px-6 pb-20 max-w-3xl mx-auto">
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Free */}
          <div className="border border-gray-200 rounded-2xl p-8">
            <p className="text-sm font-medium text-gray-500 mb-1">Gratis</p>
            <div className="flex items-end gap-1 mb-6">
              <span className="text-4xl font-bold text-gray-900">0€</span>
              <span className="text-gray-400 text-sm mb-1">/mes</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                '10 créditos al mes',
                'Todos los campos del listing',
                'Título, descripción, SEO, keywords',
                'Bullet points',
                'Copiar con un clic',
              ].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-500">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link href="/register" className="block text-center border border-indigo-600 text-indigo-600 rounded-xl py-2.5 text-sm font-medium hover:bg-indigo-50 transition-colors">
              Empezar gratis
            </Link>
          </div>

          {/* Pro */}
          <div className="border-2 border-indigo-600 rounded-2xl p-8 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full">
              Más popular
            </span>
            <p className="text-sm font-medium text-indigo-600 mb-1">Pro</p>
            <div className="flex items-end gap-1 mb-6">
              <span className="text-4xl font-bold text-gray-900">9€</span>
              <span className="text-gray-400 text-sm mb-1">/mes</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                '100 créditos al mes',
                'Todos los campos del listing',
                'Título, descripción, SEO, keywords',
                'Bullet points',
                'Copiar con un clic',
                'Soporte prioritario',
                'Cancela cuando quieras',
              ].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-500">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link href="/register" className="block text-center bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-indigo-700 transition-colors">
              Empezar con Pro
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-xl font-bold text-gray-900 mb-8 text-center">Preguntas frecuentes</h2>
          <div className="space-y-6">
            {[
              {
                q: '¿Qué es un crédito?',
                a: 'Cada vez que generas un listing completo para un producto consumes 1 crédito. Los créditos se renuevan el primer día de cada mes.',
              },
              {
                q: '¿Puedo cancelar mi suscripción Pro?',
                a: 'Sí, puedes cancelar en cualquier momento desde el panel de tu cuenta. Seguirás teniendo acceso Pro hasta el final del período pagado.',
              },
              {
                q: '¿En qué idioma genera los listings?',
                a: 'Actualmente genera los listings en español, optimizados para el mercado hispanohablante.',
              },
              {
                q: '¿Qué pasa si gasto todos mis créditos?',
                a: 'Si te quedas sin créditos antes de que se renueve el mes, puedes actualizar a Pro para obtener 100 créditos inmediatamente.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-gray-100 pb-6">
                <p className="font-medium text-gray-900 mb-1">{q}</p>
                <p className="text-sm text-gray-500">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 px-6 text-xs text-gray-400 space-x-4 border-t border-gray-100">
        <Link href="/" className="hover:text-gray-600">Inicio</Link>
        <Link href="/terms" className="hover:text-gray-600">Términos</Link>
        <Link href="/privacy" className="hover:text-gray-600">Privacidad</Link>
      </footer>
    </div>
  )
}
