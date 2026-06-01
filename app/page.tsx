import Link from 'next/link'
import ParticleCanvas from './components/ParticleCanvas'
import ScrambleText from './components/ScrambleText'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Nav — glassmorphism oscuro sobre hero */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10" style={{background: 'rgba(8,2,21,0.7)', backdropFilter: 'blur(20px)'}}>
        <div className="flex items-center justify-between px-5 sm:px-8 py-3.5 max-w-5xl mx-auto">
          <span className="text-lg font-bold gradient-text">Typify</span>
          <div className="flex items-center gap-3 sm:gap-5">
            <Link href="/pricing" className="hidden sm:block text-sm text-white/60 hover:text-white transition-colors">Planes</Link>
            <Link href="/login" className="hidden sm:block text-sm text-white/60 hover:text-white transition-colors">Iniciar sesión</Link>
            <Link href="/register" className="glow-btn bg-indigo-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors font-medium">
              Empezar gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero — dark */}
      <section className="hero-dark pt-32 pb-32 px-5 text-center">
        {/* Blobs morfantes */}
        <div className="hero-blob1" />
        <div className="hero-blob2" />
        <div className="hero-blob3" />
        {/* Canvas partículas */}
        <ParticleCanvas />
        {/* Beam de luz */}
        <div className="hero-beam" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="animate-fade-up inline-flex items-center gap-2 bg-white/8 border border-white/15 text-indigo-300 text-xs font-medium px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse inline-block" />
            Potenciado por Llama 4 · IA de última generación
          </div>

          <h1 className="animate-fade-up delay-100 text-4xl sm:text-6xl font-bold leading-[1.1] tracking-tight mb-6 text-white">
            Listings que{' '}
            <ScrambleText text="convierten" className="gradient-text" delay={600} />
            <br />generados en segundos
          </h1>

          <p className="animate-fade-up delay-200 text-lg text-white/55 mb-10 max-w-xl mx-auto leading-relaxed">
            Título, descripción, SEO, keywords y bullet points optimizados para tu producto. Sin bloqueos creativos.
          </p>

          <div className="animate-fade-up delay-300 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="glow-btn bg-indigo-600 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
              Crear cuenta gratis
            </Link>
            <Link href="/pricing" className="border border-white/20 text-white/80 px-7 py-3.5 rounded-xl font-medium hover:bg-white/10 transition-colors backdrop-blur-sm">
              Ver planes →
            </Link>
          </div>

          <p className="animate-fade-up delay-400 text-xs text-white/30 mt-5">Sin tarjeta de crédito · 10 generaciones gratis</p>
        </div>

        {/* 3 metric cards staggered */}
        <div className="relative z-10 mt-16 h-52 sm:h-56 max-w-2xl mx-auto">

          <div className="animate-float-slow absolute left-0 top-6 w-40 sm:w-44 glass-dark rounded-2xl shadow-lg shadow-black/40 p-4 text-left border border-white/15 -rotate-2">
            <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wide mb-2">Generación</p>
            <p className="text-3xl font-bold text-white">~8<span className="text-base font-normal text-white/40">s</span></p>
            <p className="text-xs text-white/40 mt-1">listing completo</p>
          </div>

          <div className="animate-float absolute left-1/2 -translate-x-1/2 -top-2 w-48 sm:w-52 glass-dark rounded-2xl shadow-xl shadow-black/50 p-4 text-left border border-white/15 z-10">
            <p className="text-xs text-violet-400 font-semibold uppercase tracking-wide mb-3">Campos generados</p>
            <div className="space-y-1.5">
              {['Título SEO', 'Descripción', 'Meta-título', 'Meta-descripción', 'Keywords', 'Bullet points'].map(f => (
                <div key={f} className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0">
                    <span className="text-white" style={{fontSize: '8px'}}>✓</span>
                  </span>
                  <span className="text-xs text-white/70">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-float delay-300 absolute right-0 top-8 w-40 sm:w-44 glass-dark rounded-2xl shadow-lg shadow-black/40 p-4 text-left border border-white/15 rotate-2">
            <p className="text-xs text-purple-400 font-semibold uppercase tracking-wide mb-2">SEO Score</p>
            <p className="text-3xl font-bold text-white">98<span className="text-base font-normal text-white/40">/100</span></p>
            <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{width: '98%'}} />
            </div>
          </div>

        </div>

        {/* Transición hero→blanco */}
        <div className="hero-fade-bottom" />
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
