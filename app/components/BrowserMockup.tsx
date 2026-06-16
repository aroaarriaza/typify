export default function BrowserMockup() {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 shadow-[0_40px_120px_rgba(99,102,241,0.35),0_20px_60px_rgba(0,0,0,0.5)]">
      {/* Browser chrome */}
      <div className="bg-[#1a1433] px-4 py-2.5 flex items-center gap-3 border-b border-white/8">
        <div className="flex gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 bg-white/6 rounded px-3 py-1 text-xs text-white/25 text-center max-w-xs mx-auto">
          typify-ai.vercel.app/dashboard
        </div>
      </div>

      {/* App */}
      <div className="bg-[#07050f]">
        {/* App header */}
        <div className="px-5 py-2.5 flex items-center justify-between border-b border-white/6">
          <span className="text-sm font-bold" style={{background:'linear-gradient(135deg,#818cf8,#a78bfa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Typify</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="h-1 w-20 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[60%] rounded-full" style={{background:'linear-gradient(90deg,#4f46e5,#7c3aed)'}} />
              </div>
              <span className="text-xs text-white/30">24 créditos</span>
            </div>
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{background:'linear-gradient(135deg,#4f46e5,#7c3aed)'}}>
              <span className="text-white font-bold" style={{fontSize:'9px'}}>A</span>
            </div>
          </div>
        </div>

        {/* Two column */}
        <div className="grid grid-cols-2 min-h-[260px]">
          {/* Left: form */}
          <div className="p-4 border-r border-white/5 flex flex-col gap-3">
            <div>
              <p className="text-xs text-white/35 mb-1">Producto</p>
              <div className="bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-xs text-white/55">
                Chaqueta puffer negra talla M...
              </div>
            </div>
            <div>
              <p className="text-xs text-white/35 mb-1">Características principales</p>
              <div className="bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-xs text-white/40 leading-relaxed h-14">
                Impermeable, forro polar, bolsillos laterales...
              </div>
            </div>
            <div className="flex gap-2">
              {['Amazon', 'Profesional', 'ES'].map(t => (
                <div key={t} className="flex-1 bg-white/5 border border-white/8 rounded-lg py-1.5 text-center text-xs text-white/40">{t}</div>
              ))}
            </div>
            <div className="mt-auto rounded-lg py-2.5 text-center text-xs font-medium text-white" style={{background:'linear-gradient(135deg,#4f46e5,#7c3aed)'}}>
              Generar listing con IA →
            </div>
          </div>

          {/* Right: output */}
          <div className="p-4 flex flex-col gap-2.5">
            {[
              { label: 'Título SEO', text: 'Chaqueta Puffer Negra Impermeable Talla M — Colección Premium 2025', dot: '#818cf8' },
              { label: 'Descripción', text: 'Diseñada para destacar en cualquier escaparate. Esta chaqueta combina el estilo urbano con la máxima funcionalidad...', dot: '#a78bfa' },
              { label: 'Keywords', text: 'chaqueta puffer, impermeable mujer, moda invierno, puffer jacket negro', dot: '#c084fc' },
              { label: 'Bullet points', text: '• Relleno de plumas 90% ganso · • Costuras reforzadas · • Lavable a máquina', dot: '#e879f9' },
            ].map(({ label, text, dot }) => (
              <div key={label}>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{background: dot}} />
                  <span className="text-xs text-white/35">{label}</span>
                </div>
                <div className="bg-white/4 border border-white/6 rounded-lg px-2.5 py-1.5 text-xs text-white/50 leading-relaxed">
                  {text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
