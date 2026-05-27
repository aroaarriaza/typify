import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-5xl mx-auto">
        <span className="text-xl font-bold text-indigo-600">Typify</span>
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/pricing" className="hidden sm:block text-sm text-gray-600 hover:text-gray-900">Precios</Link>
          <Link href="/login" className="hidden sm:block text-sm text-gray-600 hover:text-gray-900">Iniciar sesión</Link>
          <Link href="/register" className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Empezar gratis
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 py-20 max-w-3xl mx-auto">
        <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full mb-6">
          Potenciado por IA
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
          Listings de e-commerce<br />que venden de verdad
        </h1>
        <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">
          Genera títulos, descripciones, palabras clave y puntos clave optimizados para SEO en segundos. Sin bloqueos creativos.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/register" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
            Crear cuenta gratis
          </Link>
          <Link href="/pricing" className="border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
            Ver precios
          </Link>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Cómo funciona</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Describe tu producto', desc: 'Introduce el nombre, categoría y las características principales.' },
              { step: '2', title: 'La IA genera el listing', desc: 'En segundos recibes título, descripción, meta-tags, keywords y bullet points.' },
              { step: '3', title: 'Copia y publica', desc: 'Copia cada campo con un clic y pégalo en tu tienda.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4">{step}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lo que genera */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Todo lo que necesita tu listing</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: '✦', label: 'Título atractivo', desc: 'Optimizado para captar la atención y el clic.' },
            { icon: '✦', label: 'Descripción persuasiva', desc: '150-200 palabras orientadas a la conversión.' },
            { icon: '✦', label: 'Meta-título y meta-descripción', desc: 'SEO técnico listo para Google Shopping.' },
            { icon: '✦', label: 'Palabras clave', desc: '5-8 keywords relevantes para tu categoría.' },
            { icon: '✦', label: 'Puntos clave (bullet points)', desc: '4-5 beneficios escaneables para el cliente.' },
            { icon: '✦', label: 'Copia con un clic', desc: 'Cada campo tiene su botón de copiar.' },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="flex gap-3 p-4 rounded-xl border border-gray-100 hover:border-indigo-100 transition-colors">
              <span className="text-indigo-500 mt-0.5">{icon}</span>
              <div>
                <p className="font-medium text-gray-900 text-sm">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-indigo-600 py-16 px-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Empieza a generar listings hoy</h2>
        <p className="text-indigo-200 mb-8">10 créditos gratuitos. Sin tarjeta de crédito.</p>
        <Link href="/register" className="inline-block bg-white text-indigo-600 font-medium px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors">
          Crear cuenta gratis
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 px-6 text-xs text-gray-400 space-x-4">
        <span>© 2026 Typify</span>
        <Link href="/pricing" className="hover:text-gray-600">Precios</Link>
        <Link href="/terms" className="hover:text-gray-600">Términos</Link>
        <Link href="/privacy" className="hover:text-gray-600">Privacidad</Link>
      </footer>
    </div>
  )
}
