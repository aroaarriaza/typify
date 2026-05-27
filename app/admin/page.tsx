import { createClient as createServiceClient } from '@supabase/supabase-js'

export default async function AdminOverviewPage() {
  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const [
    { count: totalUsers },
    { count: proUsers },
    { count: totalGenerations },
    { data: recentGenerations },
    { data: recentUsers },
  ] = await Promise.all([
    admin.from('profiles').select('*', { count: 'exact', head: true }),
    admin.from('profiles').select('*', { count: 'exact', head: true }).eq('plan', 'pro'),
    admin.from('generations').select('*', { count: 'exact', head: true }),
    admin.from('generations').select('prompt, created_at').order('created_at', { ascending: false }).limit(8),
    admin.from('profiles').select('id, plan, credits, created_at').order('created_at', { ascending: false }).limit(5),
  ])

  const conversionRate = totalUsers ? (((proUsers ?? 0) / totalUsers) * 100).toFixed(1) : '0'
  const estimatedMRR = (proUsers ?? 0) * 9

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Resumen</h1>
        <p className="text-sm text-gray-500 mt-1">Vista general de Typify</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KPI label="Usuarios totales" value={totalUsers ?? 0} />
        <KPI label="Usuarios Pro" value={proUsers ?? 0} accent="indigo" />
        <KPI label="Generaciones" value={totalGenerations ?? 0} />
        <KPI label="Conversión" value={`${conversionRate}%`} accent="green" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-5 text-white">
          <p className="text-xs text-indigo-200 uppercase tracking-wider mb-1">MRR estimado</p>
          <p className="text-3xl font-bold">{estimatedMRR}€</p>
          <p className="text-xs text-indigo-200 mt-1">{proUsers ?? 0} usuarios × 9€/mes</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 col-span-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Nuevos usuarios (últimos 5)</p>
          {recentUsers && recentUsers.length > 0 ? (
            <div className="space-y-2">
              {recentUsers.map((u, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-xs font-medium text-indigo-600">U</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      u.plan === 'pro' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'
                    }`}>{u.plan}</span>
                    <span className="text-xs text-gray-500">{u.credits} créditos</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(u.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Sin usuarios aún.</p>
          )}
        </div>
      </div>

      {/* Últimas generaciones */}
      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Últimas generaciones</h2>
          <a href="/admin/generations" className="text-xs text-indigo-600 hover:underline">Ver todas →</a>
        </div>
        <div className="divide-y divide-gray-50">
          {recentGenerations && recentGenerations.length > 0 ? (
            recentGenerations.map((gen, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between gap-4">
                <p className="text-sm text-gray-700 truncate">{gen.prompt}</p>
                <p className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                  {new Date(gen.created_at).toLocaleDateString('es-ES', {
                    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
            ))
          ) : (
            <p className="px-5 py-4 text-sm text-gray-400">Sin generaciones aún.</p>
          )}
        </div>
      </div>
    </div>
  )
}

function KPI({ label, value, accent }: { label: string; value: number | string; accent?: 'indigo' | 'green' }) {
  const valueClass = accent === 'indigo' ? 'text-indigo-600' : accent === 'green' ? 'text-green-600' : 'text-gray-900'
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-3xl font-bold ${valueClass}`}>{value}</p>
    </div>
  )
}
