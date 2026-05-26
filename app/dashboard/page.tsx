import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/credits'
import { logout } from '../(auth)/actions'

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

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Tarjeta de créditos */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Créditos disponibles</p>
              <p className="text-3xl font-bold text-gray-900">
                {credits}
                <span className="text-base font-normal text-gray-400"> / {maxCredits}</span>
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              plan === 'pro'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {plan === 'pro' ? 'Pro' : 'Gratis'}
            </span>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${credits > 3 ? 'bg-indigo-500' : 'bg-red-400'}`}
              style={{ width: `${(credits / maxCredits) * 100}%` }}
            />
          </div>

          {credits === 0 && (
            <p className="text-sm text-red-600 mt-3">
              Sin créditos. Actualiza a Pro para continuar generando textos.
            </p>
          )}
        </div>

        {/* Área de generación (próxima fase) */}
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-400 text-sm">El generador de textos llegará en la próxima fase.</p>
        </div>
      </main>
    </div>
  )
}
