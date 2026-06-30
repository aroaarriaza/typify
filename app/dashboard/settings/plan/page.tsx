import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/credits'
import PortalButton from '../../profile/PortalButton'

export default async function PlanPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const profile = await getProfile()
  const plan = profile?.plan ?? 'free'
  const credits = profile?.credits ?? 0
  const maxCredits = plan === 'pro' ? 100 : 10
  const pct = Math.min((credits / maxCredits) * 100, 100)

  return (
    <div className="space-y-3">
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="text-sm font-semibold text-gray-900">Créditos</h2>
        </div>
        <div className="px-6 py-5">
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
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="text-sm font-semibold text-gray-900">Suscripción</h2>
        </div>
        <div className="px-6 py-5">
          {plan === 'pro' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-gray-900">Plan Pro</p>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  </div>
                  <p className="text-xs text-gray-400">100 créditos/mes · 9€/mes</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gradient-to-r from-indigo-500 to-violet-500 text-white">
                  ✦ Pro
                </span>
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
    </div>
  )
}
