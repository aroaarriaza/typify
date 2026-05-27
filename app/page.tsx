import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Nav glassmorphism */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/60">
        <div className="flex items-center justify-between px-5 sm:px-8 py-3.5 max-w-5xl mx-auto">
          <span className="text-lg font-bold gradient-text">Typify</span>
          <div className="flex items-center gap-3 sm:gap-5">
            <Link href="/pricing" className="hidden sm:block text-sm text-gray-500 hover:text-gray-900 transition-colors">Planes</Link>
            <Link href="/login" className="hidden sm:block text-sm text-gray-500 hover:text-gray-900 transition-colors">Iniciar sesión</Link>
            <Link href="/register" className="glow-btn bg-indigo-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors font-medium">
              Empezar gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="aurora-bg pt-32 pb-24 px-5 text-center relative">
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="animate-fade-up inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium px-4 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse inline-block" />
            Potenciado por Llama 4 · IA de última generación
          </div>

          <h1 className="animate-fade-up delay-100 text-4xl sm:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-6">
            Listings que{' '}
            <span className="gradient-text">convierten</span>
            <br />generados en segundos
          </h1>

          <p className="animate-fade-up delay-200 text-lg text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
            Título, descripción, SEO, keywords y bullet points optimizados para tu producto. Sin bloqueos creativos.
          </p>

          <div className="animate-fade-up delay-300 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="glow-btn bg-indigo-600 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
              Crear cuenta gratis
            </Link>
            <Link href="/pricing" className="border border-gray-200 text-gray-700 px-7 py-3.5 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              Ver planes →
            </Link>
          </div>

          <p className="animate-fade-up delay-400 text-xs text-gray-400 mt-5">Sin tarjeta de crédito · 10 generaciones gratis</p>
        </div>

        {/* 3 floating cards staggered */}
        <div className="relative z-10 mt-16 h-56 sm:h-64 max-w-2xl mx-auto">

          {/* Card título — izquierda, flota lento */}
          <div className="animate-float-slow absolute left-0 top-4 w-52 sm:w-60 glass rounded-2xl shadow-lg shadow-indigo-100 p-4 text-left border border-indigo-50 -rotate-2">
            <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wide mb-1.5">Título</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-snug">Zapatillas Adidas Mujer — Ligeras y con Estilo</p>
          </div>

          {/* Card keywords — centro arriba, flota normal */}
          <div className="animate-float absolute left-1/2 -translate-x-1/2 -top-2 w-48 sm:w-56 glass rounded-2xl shadow-xl shadow-violet-100 p-4 text-left border border-violet-50 z-10">
            <p className="text-xs text-violet-400 font-semibold uppercase tracking-wide mb-2">Keywords</p>
            <div className="flex flex-wrap gap-1">
              {['running', 'Adidas', 'mujer', 'ligeras'].map(k => (
                <span key={k} className="bg-indigo-50 text-indigo-600 text-xs px-2 py-0.5 rounded-full">{k}</span>
              ))}
            </div>
          </div>

          {/* Card bullets — derecha, flota rápido */}
          <div className="animate-float delay-300 absolute right-0 top-6 w-52 sm:w-60 glass rounded-2xl shadow-lg shadow-purple-100 p-4 text-left border border-purple-50 rotate-2">
            <p className="text-xs text-purple-400 font-semibold uppercase tracking-wide mb-1.5">Puntos clave</p>
            <ul className="space-y-1">
              {['Suela ultraligera 180g', 'Amortiguación Boost', 'Disponible en 6 colores'].map(b => (
                <li key={b} className="text-xs text-gray-600 flex items-center gap-1.5">
                  <span className="text-indigo-400 shrink-0">•</span>{b}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* Stats */}
      <section className="py-10 px-5 border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-8 sm:gap-16">
          {[
            { value: '10 seg', label: 'Tiempo de generación' },
            { value: '6 campos', label: 'Por cada listing' },
            { value: '100%', label: 'Optimizado para SEO' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold gradient-text">{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bento features */}
      <section className="py-24 px-5 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Todo lo que necesita tu{' '}<span className="gradient-text">listing</span>
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">Cada campo generado con precisión para maximizar la conversión y el posicionamiento.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {/* Card grande */}
          <div className="col-span-2 sm:col-span-2 card-hover bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-6">
            <div className="text-3xl mb-3">✦</div>
            <h3 className="font-semibold text-gray-900 text-lg mb-2">Descripción persuasiva</h3>
            <p className="text-sm text-gray-500 leading-relaxed">150-200 palabras orientadas a la conversión, con storytelling y beneficios del producto que conectan con el comprador.</p>
          </div>

          <div className="card-hover bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="text-3xl mb-3">◈</div>
            <h3 className="font-semibold text-gray-900 mb-1">Título SEO</h3>
            <p className="text-xs text-gray-500">Máx. 60 caracteres, optimizado para CTR.</p>
          </div>

          <div className="card-hover bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="text-3xl mb-3">◉</div>
            <h3 className="font-semibold text-gray-900 mb-1">Meta-descripción</h3>
            <p className="text-xs text-gray-500">155 caracteres perfectos para Google Shopping.</p>
          </div>

          <div className="card-hover bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="text-3xl mb-3">◎</div>
            <h3 className="font-semibold text-gray-900 mb-1">Keywords</h3>
            <p className="text-xs text-gray-500">5-8 palabras clave relevantes para tu categoría.</p>
          </div>

          <div className="col-span-2 sm:col-span-1 card-hover bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 rounded-2xl p-6">
            <div className="text-3xl mb-3">⊕</div>
            <h3 className="font-semibold text-gray-900 mb-1">Bullet points</h3>
            <p className="text-xs text-gray-500">4-5 puntos clave escaneables que destacan lo mejor.</p>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-24 px-5 bg-gray-50/60 aurora-bg">
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-16">
            Tres pasos,{' '}
            <span className="gradient-text">un listing completo</span>
          </h2>

          <div className="grid sm:grid-cols-3 gap-8 relative">
            <div className="hidden sm:block absolute top-8 left-1/4 right-1/4 h-px bg-gradient-to-r from-indigo-200 via-violet-200 to-indigo-200" />
            {[
              { n: '01', title: 'Describe tu producto', desc: 'Nombre, categoría y características principales.' },
              { n: '02', title: 'La IA lo genera', desc: 'En segundos, todos los campos listos para copiar.' },
              { n: '03', title: 'Copia y publica', desc: 'Un clic por campo o cópialo todo de una vez.' },
            ].map(({ n, title, desc }) => (
              <div key={n} className="relative">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white border border-indigo-100 shadow-sm flex items-center justify-center card-hover">
                  <span className="shimmer-text text-sm font-bold">{n}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-24 px-5 relative overflow-hidden" style={{background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #a855f7 100%)'}}>
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px'}} />
        <div className="relative z-10 text-center max-w-xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Empieza a generar hoy
          </h2>
          <p className="text-indigo-200 mb-10 text-lg">10 listings gratis. Sin tarjeta de crédito.</p>
          <Link href="/register" className="inline-block bg-white text-indigo-700 font-semibold px-8 py-4 rounded-2xl hover:bg-indigo-50 transition-all hover:-translate-y-1 hover:shadow-xl shadow-lg">
            Crear cuenta gratis →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 px-5 text-xs text-gray-400 space-x-5 border-t border-gray-100">
        <span className="font-medium text-gray-500">Typify</span>
        <Link href="/terms" className="hover:text-gray-600 transition-colors">Términos</Link>
        <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacidad</Link>
      </footer>
    </div>
  )
}
