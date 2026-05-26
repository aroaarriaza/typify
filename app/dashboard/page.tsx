import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/credits'
import { logout } from '../(auth)/actions'
import Generator from './components/Generator'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const profile = await getProfile()

  const credits = profile?.credits ?? 0
  const plan = profile?.plan ?? 'free'
  const maxCredits = plan === 'pro' ? 100 : 10

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Typify</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.email}</span>
          <form action={logout}>
            <button type="submit" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Tarjeta de créditos */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Créditos disponibles</p>
              <p className="text-2xl font-bold text-gray-900">
                {credits}
                <span className="text-sm font-normal text-gray-400"> / {maxCredits}</span>
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              plan === 'pro' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {plan === 'pro' ? 'Pro' : 'Gratis'}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${credits > 3 ? 'bg-indigo-500' : 'bg-red-400'}`}
              style={{ width: `${(credits / maxCredits) * 100}%` }}
            />
          </div>
        </div>

        {/* Generador */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Generar texto</h2>
          <Generator credits={credits} />
        </div>
      </main>
    </div>
  )
}
