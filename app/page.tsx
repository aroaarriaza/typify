import Link from 'next/link'
import ParticleCanvas from './components/ParticleCanvas'
import ScrambleText from './components/ScrambleText'
import ScrambleOnScroll from './components/ScrambleOnScroll'
import AnimatedCounter from './components/AnimatedCounter'
import Marquee from './components/Marquee'
import RevealOnScroll from './components/RevealOnScroll'
import TiltCard from './components/TiltCard'
import AnimatedLine from './components/AnimatedLine'
import MagneticButton from './components/MagneticButton'
import BrowserMockup from './components/BrowserMockup'
import OrbitalSphere from './components/OrbitalSphere'
import HelixCanvas from './components/HelixCanvas'

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{background:'#07050f'}}>

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
      <section className="hero-dark pt-32 pb-20 px-5 text-center">
        {/* Clipped background elements */}
        <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:0}}>
          <div className="hero-blob1" />
          <div className="hero-blob2" />
          <div className="hero-blob3" />
          <ParticleCanvas />
          <div className="hero-beam" />
          {/* Giant background text */}
          <div className="absolute inset-0 flex items-center justify-center" style={{top:'5rem',pointerEvents:'none'}}>
            <span className="select-none" style={{
              fontSize:'clamp(4.5rem,18vw,14rem)',
              fontWeight:900,
              letterSpacing:'-0.04em',
              lineHeight:1,
              whiteSpace:'nowrap',
              background:'linear-gradient(135deg,rgba(139,92,246,0.13),rgba(99,102,241,0.07))',
              WebkitBackgroundClip:'text',
              WebkitTextFillColor:'transparent',
              backgroundClip:'text',
            }}>TYPIFY</span>
          </div>
        </div>

        {/* Orb */}
        <div className="hero-orb" />
        <div className="hero-orb-core" />

        {/* 3D spheres */}
        <div className="hero-sphere hero-sphere-xl" />
        <div className="hero-sphere hero-sphere-lg" />
        <div className="hero-sphere hero-sphere-md" />
        <div className="hero-sphere hero-sphere-sm" />

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

        {/* Transición hero→blanco */}
        <div className="hero-fade-bottom" />
      </section>

      {/* Browser mockup — breaks out of hero, sits between sections */}
      <div className="hidden sm:block relative z-20 -mt-10 mb-16 px-5 max-w-5xl mx-auto animate-fade-up delay-500">
        <BrowserMockup />
      </div>

      {/* Marquee */}
      <Marquee />

      {/* Stats */}
      <section className="py-12 px-5 border-b border-white/8 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none" style={{background:'radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 70%)',filter:'blur(35px)'}} />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full pointer-events-none" style={{background:'radial-gradient(circle,rgba(139,92,246,0.15) 0%,transparent 70%)',filter:'blur(35px)'}} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <span className="select-none" style={{fontSize:'clamp(3rem,10vw,7rem)',fontWeight:900,letterSpacing:'-0.05em',color:'rgba(99,102,241,0.07)',whiteSpace:'nowrap'}}>10s · 6 campos · SEO</span>
        </div>
        <div className="absolute top-4 right-10 pointer-events-none" style={{width:'18px',height:'18px',borderRadius:'50%',background:'radial-gradient(circle at 33% 28%,rgba(255,255,255,0.8) 0%,rgba(167,85,247,0.75) 32%,rgba(79,70,229,0.65) 70%,rgba(30,8,69,0.9) 100%)',boxShadow:'0 0 10px rgba(139,92,246,0.5)',animation:'float 4s ease-in-out infinite'}} />
        <div className="absolute bottom-3 left-14 pointer-events-none" style={{width:'13px',height:'13px',borderRadius:'50%',background:'radial-gradient(circle at 33% 28%,rgba(255,255,255,0.9) 0%,rgba(99,102,241,0.8) 35%,rgba(79,70,229,0.7) 70%,rgba(30,8,69,0.9) 100%)',boxShadow:'0 0 8px rgba(99,102,241,0.5)',animation:'float-slow 6s ease-in-out infinite',animationDelay:'-2s'}} />
        <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-10 sm:gap-20 relative z-10">
          {[
            { value: '10 seg', label: 'Tiempo de generación' },
            { value: '6 campos', label: 'Por cada listing' },
            { value: '100%', label: 'Optimizado para SEO' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold gradient-text">
                <AnimatedCounter value={value} />
              </p>
              <p className="text-xs mt-1" style={{color:'rgba(255,255,255,0.4)'}}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bento features */}
      <section className="py-24 px-5 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full pointer-events-none" style={{background:'radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 70%)',filter:'blur(60px)'}} />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full pointer-events-none" style={{background:'radial-gradient(circle,rgba(139,92,246,0.14) 0%,transparent 70%)',filter:'blur(60px)'}} />
        <div className="absolute inset-0 flex items-start justify-center pointer-events-none overflow-hidden" style={{paddingTop:'3rem'}}>
          <span className="select-none" style={{fontSize:'clamp(4.5rem,14vw,11rem)',fontWeight:900,letterSpacing:'-0.04em',lineHeight:1,color:'rgba(99,102,241,0.06)'}}>LISTING</span>
        </div>
        <div className="absolute top-24 left-2 sm:left-6 pointer-events-none" style={{width:'26px',height:'26px',borderRadius:'50%',background:'radial-gradient(circle at 33% 28%,rgba(255,255,255,0.8) 0%,rgba(167,85,247,0.8) 30%,rgba(79,70,229,0.7) 65%,rgba(30,8,69,0.95) 100%)',boxShadow:'0 0 14px rgba(139,92,246,0.5)',animation:'float 5s ease-in-out infinite'}} />
        <div className="absolute top-1/2 right-2 sm:right-6 pointer-events-none" style={{width:'20px',height:'20px',borderRadius:'50%',background:'radial-gradient(circle at 33% 28%,rgba(255,255,255,0.9) 0%,rgba(236,72,153,0.8) 30%,rgba(124,58,237,0.7) 65%,rgba(30,8,69,0.95) 100%)',boxShadow:'0 0 11px rgba(236,72,153,0.5)',animation:'float-slow 7s ease-in-out infinite',animationDelay:'-3s'}} />
        <div className="max-w-5xl mx-auto relative z-10">
          <RevealOnScroll className="text-center mb-14" from="bottom">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              <ScrambleOnScroll text="Todo lo que necesita tu " />
              <span className="gradient-text">listing</span>
            </h2>
            <p className="max-w-md mx-auto" style={{color:'rgba(255,255,255,0.45)'}}>Cada campo generado con precisión para maximizar la conversión y el posicionamiento.</p>
          </RevealOnScroll>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <RevealOnScroll className="col-span-2 sm:col-span-2" from="flip" delay={0}>
              <TiltCard className="border-beam bg-gradient-to-br from-indigo-500/12 to-violet-500/12 border border-indigo-500/25 rounded-2xl p-6 h-full">
                <div className="text-3xl mb-3">✦</div>
                <h3 className="font-semibold text-white text-lg mb-2">Descripción persuasiva</h3>
                <p className="text-sm leading-relaxed" style={{color:'rgba(255,255,255,0.5)'}}>150-200 palabras orientadas a la conversión, con storytelling y beneficios del producto que conectan con el comprador.</p>
              </TiltCard>
            </RevealOnScroll>

            <RevealOnScroll from="flip" delay={80}>
              <TiltCard className="rounded-2xl p-6 h-full" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}>
                <div className="text-3xl mb-3">◈</div>
                <h3 className="font-semibold text-white mb-1">Título SEO</h3>
                <p className="text-xs" style={{color:'rgba(255,255,255,0.45)'}}>Máx. 60 caracteres, optimizado para CTR.</p>
              </TiltCard>
            </RevealOnScroll>

            <RevealOnScroll from="flip" delay={160}>
              <TiltCard className="rounded-2xl p-6 h-full" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}>
                <div className="text-3xl mb-3">◉</div>
                <h3 className="font-semibold text-white mb-1">Meta-descripción</h3>
                <p className="text-xs" style={{color:'rgba(255,255,255,0.45)'}}>155 caracteres perfectos para Google Shopping.</p>
              </TiltCard>
            </RevealOnScroll>

            <RevealOnScroll from="flip" delay={240}>
              <TiltCard className="rounded-2xl p-6 h-full" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}>
                <div className="text-3xl mb-3">◎</div>
                <h3 className="font-semibold text-white mb-1">Keywords</h3>
                <p className="text-xs" style={{color:'rgba(255,255,255,0.45)'}}>5-8 palabras clave relevantes para tu categoría.</p>
              </TiltCard>
            </RevealOnScroll>

            <RevealOnScroll className="col-span-2 sm:col-span-1" from="flip" delay={320}>
              <TiltCard className="border-beam bg-gradient-to-br from-violet-500/12 to-purple-500/12 border border-violet-500/25 rounded-2xl p-6 h-full">
                <div className="text-3xl mb-3">⊕</div>
                <h3 className="font-semibold text-white mb-1">Bullet points</h3>
                <p className="text-xs" style={{color:'rgba(255,255,255,0.45)'}}>4-5 puntos clave escaneables que destacan lo mejor.</p>
              </TiltCard>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Marquee 2 — invertido */}
      <div className="marquee-outer">
        <div className="marquee-track" style={{animationDirection: 'reverse', animationDuration: '22s'}}>
          {['TÍTULO', 'DESCRIPCIÓN', 'META-TÍTULO', 'META-DESCRIPCIÓN', 'KEYWORDS', 'BULLET POINTS', 'SEO', 'CONVERSIÓN', 'TÍTULO', 'DESCRIPCIÓN', 'META-TÍTULO', 'META-DESCRIPCIÓN', 'KEYWORDS', 'BULLET POINTS', 'SEO', 'CONVERSIÓN'].map((item, i) => (
            <span key={i} className="marquee-item">{item}&nbsp;<span className="marquee-dot">·</span>&nbsp;</span>
          ))}
        </div>
      </div>

      {/* Helix ribbon section */}
      <section className="relative overflow-hidden" style={{height:'280px'}}>
        <HelixCanvas />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase" style={{color:'rgba(255,255,255,0.18)'}}>Powered by AI · Llama 4 · Generación en tiempo real</p>
        </div>
        <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none" style={{background:'linear-gradient(to bottom, #07050f, transparent)'}} />
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none" style={{background:'linear-gradient(to top, #07050f, transparent)'}} />
      </section>

      {/* Cómo funciona */}
      <section className="py-24 px-5 aurora-bg">
        {/* floating spheres */}
        <div className="absolute top-16 left-4 sm:left-10 pointer-events-none z-20" style={{width:'34px',height:'34px',borderRadius:'50%',background:'radial-gradient(circle at 33% 28%,rgba(255,255,255,0.85) 0%,rgba(167,85,247,0.9) 28%,rgba(79,70,229,0.85) 58%,rgba(10,4,30,0.95) 100%)',boxShadow:'0 0 18px rgba(139,92,246,0.32)',animation:'float 5s ease-in-out infinite'}} />
        <div className="absolute bottom-16 right-4 sm:right-10 pointer-events-none z-20" style={{width:'26px',height:'26px',borderRadius:'50%',background:'radial-gradient(circle at 36% 30%,rgba(255,255,255,0.8) 0%,rgba(34,211,238,0.8) 30%,rgba(99,102,241,0.7) 62%,rgba(10,4,30,0.96) 100%)',boxShadow:'0 0 14px rgba(34,211,238,0.3)',animation:'float-slow 7s ease-in-out infinite',animationDelay:'-2.5s'}} />
        <div className="absolute top-1/2 right-8 sm:right-20 pointer-events-none z-20" style={{width:'16px',height:'16px',borderRadius:'50%',background:'radial-gradient(circle at 33% 28%,rgba(255,255,255,0.9) 0%,rgba(236,72,153,0.8) 32%,rgba(124,58,237,0.75) 68%,rgba(10,4,30,0.95) 100%)',boxShadow:'0 0 9px rgba(236,72,153,0.3)',animation:'float 6s ease-in-out infinite',animationDelay:'-1s'}} />
        {/* giant bg text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
          <span className="select-none" style={{fontSize:'clamp(5rem,16vw,12rem)',fontWeight:900,letterSpacing:'-0.04em',lineHeight:1,color:'rgba(99,102,241,0.04)'}}>PASOS</span>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <RevealOnScroll from="bottom">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-16">
              <ScrambleOnScroll text="Tres pasos, " />
              <span className="gradient-text">un listing completo</span>
            </h2>
          </RevealOnScroll>

          <div className="grid sm:grid-cols-3 gap-8 relative">
            <AnimatedLine />

            {/* Step 01 */}
            <RevealOnScroll from="left" delay={0}>
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl border border-indigo-500/30 flex items-center justify-center card-hover relative overflow-hidden" style={{background:'rgba(99,102,241,0.1)'}}>
                <span className="shimmer-text text-sm font-bold">01</span>
                <span className="step-cursor absolute bottom-2 right-2.5 bg-indigo-400" style={{width:'1.5px',height:'12px'}} />
              </div>
              <h3 className="font-semibold text-white mb-2">Describe tu producto</h3>
              <p className="text-sm" style={{color:'rgba(255,255,255,0.5)'}}>Nombre, categoría y características principales.</p>
            </RevealOnScroll>

            {/* Step 02 */}
            <RevealOnScroll from="bottom" delay={150}>
              <div className="step-ai-pulse w-14 h-14 mx-auto mb-4 rounded-2xl border border-indigo-500/30 flex items-center justify-center card-hover" style={{background:'rgba(99,102,241,0.1)'}}>
                <span className="shimmer-text text-sm font-bold">02</span>
              </div>
              <h3 className="font-semibold text-white mb-2">La IA lo genera</h3>
              <p className="text-sm" style={{color:'rgba(255,255,255,0.5)'}}>En segundos, todos los campos listos para copiar.</p>
            </RevealOnScroll>

            {/* Step 03 */}
            <RevealOnScroll from="right" delay={300}>
              <div className="relative w-14 h-14 mx-auto mb-4">
                <div className="w-full h-full rounded-2xl border border-indigo-500/30 flex items-center justify-center card-hover" style={{background:'rgba(99,102,241,0.1)'}}>
                  <span className="shimmer-text text-sm font-bold">03</span>
                </div>
                <span className="step-check absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold" style={{fontSize:'9px'}}>✓</span>
                </span>
              </div>
              <h3 className="font-semibold text-white mb-2">Copia y publica</h3>
              <p className="text-sm" style={{color:'rgba(255,255,255,0.5)'}}>Un clic por campo o cópialo todo de una vez.</p>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-24 px-5 relative overflow-hidden" style={{background: 'linear-gradient(135deg, #3730a3 0%, #5b21b6 40%, #7c3aed 70%, #a855f7 100%)'}}>
        <div className="cta-blob1" />
        <div className="cta-blob2" />
        <div className="cta-blob3" />
        {/* giant bg text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <span className="select-none" style={{fontSize:'clamp(5rem,18vw,14rem)',fontWeight:900,letterSpacing:'-0.04em',lineHeight:1,color:'rgba(255,255,255,0.05)'}}>GRATIS</span>
        </div>
        {/* spheres */}
        <div className="absolute top-8 left-8 sm:left-16 pointer-events-none" style={{width:'40px',height:'40px',borderRadius:'50%',background:'radial-gradient(circle at 33% 28%,rgba(255,255,255,0.9) 0%,rgba(167,85,247,0.7) 28%,rgba(79,70,229,0.6) 58%,rgba(10,4,30,0.95) 100%)',boxShadow:'0 0 22px rgba(255,255,255,0.2)',animation:'float 5s ease-in-out infinite'}} />
        <div className="absolute bottom-8 right-8 sm:right-16 pointer-events-none" style={{width:'28px',height:'28px',borderRadius:'50%',background:'radial-gradient(circle at 36% 30%,rgba(255,255,255,0.85) 0%,rgba(236,72,153,0.75) 30%,rgba(124,58,237,0.65) 60%,rgba(10,4,30,0.9) 100%)',boxShadow:'0 0 16px rgba(236,72,153,0.3)',animation:'float-slow 6s ease-in-out infinite',animationDelay:'-2s'}} />
        <div className="absolute top-1/3 right-6 sm:right-24 pointer-events-none" style={{width:'18px',height:'18px',borderRadius:'50%',background:'radial-gradient(circle at 33% 28%,rgba(255,255,255,0.95) 0%,rgba(34,211,238,0.7) 35%,rgba(99,102,241,0.6) 70%,rgba(10,4,30,0.9) 100%)',boxShadow:'0 0 10px rgba(34,211,238,0.25)',animation:'float 7s ease-in-out infinite',animationDelay:'-1.5s'}} />
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12 max-w-5xl mx-auto text-center lg:text-left">
          <div className="flex-1">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Empieza a generar hoy
            </h2>
            <p className="text-indigo-200 mb-10 text-lg">10 listings gratis. Sin tarjeta de crédito.</p>
            <MagneticButton />
          </div>
          <div className="hidden lg:block">
            <OrbitalSphere size={280} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 px-5 text-xs space-x-5 border-t border-white/8" style={{color:'rgba(255,255,255,0.3)'}}>
        <span className="font-medium" style={{color:'rgba(255,255,255,0.5)'}}>Typify</span>
        <Link href="/terms" className="hover:text-white/60 transition-colors">Términos</Link>
        <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacidad</Link>
      </footer>
    </div>
  )
}
