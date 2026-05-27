import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/credits'
import { logout } from '../(auth)/actions'
import Generator from './components/Generator'
import PlanActions from './components/PlanActions'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const profile = await getProfile()

  const credits = profile?.credits ?? 0
  const plan = profile?.plan ?? 'free'
  const maxCredits = plan === 'pro' ? 100 : 10
  const pct = Math.min((credits / maxCredits) * 100, 100)

  return (
    <div className="min-h-screen aurora-bg" style={{background: 'linear-gradient(160deg, #f8f7ff 0%, #fafafa 50%, #f0f0ff 100%)'}}>

      {/* Header */}
      <header className="glass border-b border-white/60 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <span className="text-base font-bold gradient-text">Typify</span>
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <span className="hidden sm:block text-xs text-gray-400 truncate max-w-[160px]">{user?.email}</span>
          <a href="/dashboard/history" className="text-xs text-gray-500 hover:text-indigo-600 transition-colors whitespace-nowrap">Historial</a>
          {user?.email === 'aroaarriaza@gmail.com' && (
            <a href="/admin" className="text-xs text-indigo-500 hover:text-indigo-700 font-medium whitespace-nowrap">Admin</a>
          )}
          <form action={logout}>
            <button type="submit" className="text-xs text-gray-400 hover:text-gray-700 transition-colors whitespace-nowrap">
              Salir
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-5">

        {/* Tarjeta de créditos */}
        <div className="animate-fade-up glass rounded-2xl shadow-sm shadow-indigo-100/50 p-5 border border-white/80">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Créditos disponibles</p>
              <p className="text-3xl font-bold text-gray-900">
                {credits}
                <span className="text-sm font-normal text-gray-400"> / {maxCredits}</span>
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              plan === 'pro'
                ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white'
                : 'bg-gray-100 text-gray-500'
            }`}>
              {plan === 'pro' ? '✦ Pro' : 'Gratis'}
            </span>
          </div>

          {/* Barra de progreso animada */}
          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3 overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-700 ease-out ${
                credits <= 2 ? 'bg-red-400' : 'bg-gradient-to-r from-indigo-500 to-violet-500'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <PlanActions plan={plan} />
        </div>

        {/* Generador */}
        <div className="animate-fade-up delay-100 glass rounded-2xl shadow-sm shadow-indigo-100/50 p-5 sm:p-6 border border-white/80">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Generar listing</h2>
          <Generator credits={credits} />
        </div>

      </main>
    </div>
  )
}
