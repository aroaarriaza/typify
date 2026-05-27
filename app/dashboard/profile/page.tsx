import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/credits'
import { logout } from '../../(auth)/actions'
import PortalButton from './PortalButton'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const profile = await getProfile()

  const plan = profile?.plan ?? 'free'
  const credits = profile?.credits ?? 0
  const maxCredits = plan === 'pro' ? 100 : 10
  const pct = Math.min((credits / maxCredits) * 100, 100)
  const initial = (user?.email?.[0] ?? 'U').toUpperCase()
  const isAdmin = user?.email === 'aroaarriaza@gmail.com'

  return (
    <div className="min-h-screen aurora-bg" style={{background: 'linear-gradient(160deg, #f8f7ff 0%, #fafafa 50%, #f0f0ff 100%)'}}>

      {/* Header */}
      <header className="glass border-b border-white/60 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <Link href="/dashboard" className="text-base font-bold gradient-text">Typify</Link>
        <Link href="/dashboard" className="text-xs text-gray-500 hover:text-indigo-600 transition-colors">
          ← Volver al dashboard
        </Link>
      </header>

      <main className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-4">

        {/* Avatar + nombre */}
        <div className="animate-fade-up glass rounded-2xl shadow-sm shadow-indigo-100/50 p-6 sm:p-8 border border-white/80 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-200">
            <span className="text-3xl font-bold text-white">{initial}</span>
          </div>
          <p className="text-base font-semibold text-gray-900 mb-1">{user?.email}</p>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            plan === 'pro'
              ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white'
              : 'bg-gray-100 text-gray-500'
          }`}>
            {plan === 'pro' ? '✦ Plan Pro' : 'Plan Gratis'}
          </span>
        </div>

        {/* Créditos */}
        <div className="animate-fade-up delay-100 glass rounded-2xl shadow-sm shadow-indigo-100/50 p-5 border border-white/80">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Créditos este mes</p>
          <div className="flex items-end justify-between mb-2">
            <p className="text-2xl font-bold text-gray-900">
              {credits}
              <span className="text-sm font-normal text-gray-400"> / {maxCredits}</span>
            </p>
            <p className="text-xs text-gray-400 mb-1">{maxCredits - credits} usados</p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-700 ease-out ${
                credits <= 2 ? 'bg-red-400' : 'bg-gradient-to-r from-indigo-500 to-violet-500'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Suscripción */}
        <div className="animate-fade-up delay-200 glass rounded-2xl shadow-sm shadow-indigo-100/50 p-5 border border-white/80 space-y-3">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Suscripción</p>

          {plan === 'pro' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Plan Pro activo</p>
                  <p className="text-xs text-gray-400">100 créditos/mes · 9€/mes</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </div>
              <PortalButton />
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-900">Plan Gratis</p>
                <p className="text-xs text-gray-400">10 créditos/mes incluidos</p>
              </div>
              <Link
                href="/upgrade"
                className="block text-center bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
              >
                Actualizar a Pro — 9€/mes
              </Link>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="animate-fade-up delay-300 glass rounded-2xl shadow-sm shadow-indigo-100/50 border border-white/80 overflow-hidden divide-y divide-gray-100/80">
          <Link href="/dashboard/history" className="flex items-center justify-between px-5 py-4 hover:bg-white/40 transition-colors group">
            <div className="flex items-center gap-3">
              <span className="text-base">📋</span>
              <span className="text-sm text-gray-700">Historial de generaciones</span>
            </div>
            <span className="text-gray-300 group-hover:text-gray-400 transition-colors">→</span>
          </Link>

          <Link href="/forgot-password" className="flex items-center justify-between px-5 py-4 hover:bg-white/40 transition-colors group">
            <div className="flex items-center gap-3">
              <span className="text-base">🔑</span>
              <span className="text-sm text-gray-700">Cambiar contraseña</span>
            </div>
            <span className="text-gray-300 group-hover:text-gray-400 transition-colors">→</span>
          </Link>

          {isAdmin && (
            <Link href="/admin" className="flex items-center justify-between px-5 py-4 hover:bg-white/40 transition-colors group">
              <div className="flex items-center gap-3">
                <span className="text-base">⚙️</span>
                <span className="text-sm text-indigo-600 font-medium">Panel de administración</span>
              </div>
              <span className="text-gray-300 group-hover:text-gray-400 transition-colors">→</span>
            </Link>
          )}
        </div>

        {/* Cerrar sesión */}
        <div className="animate-fade-up delay-400 pb-8">
          <form action={logout}>
            <button
              type="submit"
              className="w-full border border-gray-200 bg-white/60 text-gray-500 text-sm font-medium px-4 py-3 rounded-2xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            >
              Cerrar sesión
            </button>
          </form>
        </div>

      </main>
    </div>
  )
}
