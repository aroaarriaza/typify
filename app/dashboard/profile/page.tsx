import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/credits'
import { logout } from '../../(auth)/actions'
import PortalButton from './PortalButton'
import ProfileForm from './ProfileForm'
import DeleteAccountButton from './DeleteAccountButton'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const profile = await getProfile()

  const plan = profile?.plan ?? 'free'
  const credits = profile?.credits ?? 0
  const maxCredits = plan === 'pro' ? 100 : 10
  const pct = Math.min((credits / maxCredits) * 100, 100)
  const isAdmin = user.email === 'aroaarriaza@gmail.com'

  const meta = user.user_metadata ?? {}
  const displayName: string = meta.display_name ?? ''
  const preferredPlatform: string = meta.preferred_platform ?? ''
  const preferredTone: string = meta.preferred_tone ?? ''
  const preferredLanguage: string = meta.preferred_language ?? ''
  const initial = (displayName?.[0] ?? user.email?.[0] ?? 'U').toUpperCase()

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(160deg, #f8f7ff 0%, #fafafa 50%, #f0f0ff 100%)'}}>

      {/* Header */}
      <header className="glass border-b border-white/60 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <Link href="/dashboard" className="text-base font-bold gradient-text">Typify</Link>
        <Link href="/dashboard" className="text-xs text-gray-500 hover:text-indigo-600 transition-colors flex items-center gap-1">
          <span>←</span> Dashboard
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-3">

        {/* Page title */}
        <div className="px-1 mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Configuración</h1>
          <p className="text-sm text-gray-400 mt-0.5">Gestiona tu cuenta y preferencias</p>
        </div>

        {/* Cuenta */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Cuenta</h2>
          </div>

          {/* Avatar + info */}
          <div className="px-6 py-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-100 shrink-0">
              <span className="text-xl font-bold text-white">{initial}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {displayName || user.email}
              </p>
              {displayName && (
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              )}
              <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                plan === 'pro'
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {plan === 'pro' ? '✦ Pro' : 'Gratis'}
              </span>
            </div>
          </div>

          {/* Perfil editable */}
          <div className="px-6 pb-5 pt-1 border-t border-gray-50">
            <ProfileForm
              displayName={displayName}
              preferredPlatform={preferredPlatform}
              preferredTone={preferredTone}
              preferredLanguage={preferredLanguage}
            />
          </div>
        </section>

        {/* Créditos y plan */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Plan y uso</h2>
          </div>

          {/* Créditos */}
          <div className="px-6 py-5 border-b border-gray-50">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-gray-900">Créditos este mes</p>
                <p className="text-xs text-gray-400 mt-0.5">Se renuevan el 1 de cada mes</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">{credits}</span>
                <span className="text-sm text-gray-400"> / {maxCredits}</span>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full transition-all duration-700 ${
                  credits <= 2 ? 'bg-red-400' : 'bg-gradient-to-r from-indigo-500 to-violet-500'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            {credits <= 2 && (
              <p className="text-[11px] text-red-500 mt-2">Quedan pocos créditos.</p>
            )}
          </div>

          {/* Suscripción */}
          <div className="px-6 py-5">
            {plan === 'pro' ? (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-gray-900">Plan Pro</p>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  </div>
                  <p className="text-xs text-gray-400">100 créditos/mes · 9€/mes</p>
                </div>
                <PortalButton />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Plan Gratis</p>
                    <p className="text-xs text-gray-400">10 créditos/mes</p>
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">Activo</span>
                </div>
                <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-indigo-800">Actualizar a Pro</p>
                      <p className="text-xs text-indigo-500 mt-0.5">9€/mes · cancela cuando quieras</p>
                    </div>
                    <span className="text-lg font-bold text-indigo-700">9€</span>
                  </div>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-1 mb-4">
                    {['100 créditos/mes', 'Todos los modelos IA', 'Multi-idioma ilimitado', 'Soporte prioritario'].map(f => (
                      <li key={f} className="text-[11px] text-indigo-600 flex items-center gap-1">
                        <span className="text-indigo-400">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/upgrade"
                    className="block text-center bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Actualizar a Pro
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Acciones de cuenta */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
          <div className="px-6 py-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Acciones</h2>
          </div>

          <Link href="/dashboard/history" className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-sm">📋</div>
              <div>
                <p className="text-sm font-medium text-gray-800">Historial de generaciones</p>
                <p className="text-xs text-gray-400">Tus listings anteriores</p>
              </div>
            </div>
            <span className="text-gray-300 group-hover:text-gray-400 transition-colors text-sm">→</span>
          </Link>

          <Link href="/forgot-password" className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-sm">🔑</div>
              <div>
                <p className="text-sm font-medium text-gray-800">Cambiar contraseña</p>
                <p className="text-xs text-gray-400">Te enviaremos un enlace por email</p>
              </div>
            </div>
            <span className="text-gray-300 group-hover:text-gray-400 transition-colors text-sm">→</span>
          </Link>

          {isAdmin && (
            <Link href="/admin" className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-sm">⚙️</div>
                <div>
                  <p className="text-sm font-medium text-indigo-700">Panel de administración</p>
                  <p className="text-xs text-indigo-400">Solo visible para admins</p>
                </div>
              </div>
              <span className="text-indigo-300 group-hover:text-indigo-400 transition-colors text-sm">→</span>
            </Link>
          )}

          <div className="px-6 py-4">
            <form action={logout}>
              <button
                type="submit"
                className="w-full text-left flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-sm">👋</div>
                <div>
                  <p className="text-sm font-medium text-gray-800 group-hover:text-red-600 transition-colors">Cerrar sesión</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </button>
            </form>
          </div>
        </section>

        {/* Zona de peligro */}
        <section className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-red-50">
            <h2 className="text-xs font-semibold text-red-400 uppercase tracking-widest">Zona de peligro</h2>
          </div>
          <div className="px-6 py-5">
            <DeleteAccountButton />
          </div>
        </section>

      </main>
    </div>
  )
}
