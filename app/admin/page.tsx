import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

const ADMIN_EMAIL = 'aroaarriaza@gmail.com'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) redirect('/dashboard')

  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const [
    { count: totalUsers },
    { count: proUsers },
    { count: totalGenerations },
    { data: recentGenerations },
  ] = await Promise.all([
    admin.from('profiles').select('*', { count: 'exact', head: true }),
    admin.from('profiles').select('*', { count: 'exact', head: true }).eq('plan', 'pro'),
    admin.from('generations').select('*', { count: 'exact', head: true }),
    admin.from('generations').select('prompt, created_at').order('created_at', { ascending: false }).limit(20),
  ])

  const conversionRate = totalUsers ? (((proUsers ?? 0) / totalUsers) * 100).toFixed(1) : '0'

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-gray-900">Typify</span>
          <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">Admin</span>
        </div>
        <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">← Dashboard</a>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <h1 className="text-xl font-bold text-gray-900">Panel de administración</h1>

        {/* Métricas principales */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat label="Usuarios totales" value={totalUsers ?? 0} />
          <Stat label="Usuarios Pro" value={proUsers ?? 0} color="indigo" />
          <Stat label="Generaciones" value={totalGenerations ?? 0} />
          <Stat label="Conversión" value={`${conversionRate}%`} color="green" />
        </div>

        {/* Últimas generaciones */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Últimas generaciones</h2>
          {recentGenerations && recentGenerations.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentGenerations.map((gen, i) => (
                <div key={i} className="py-2.5 flex items-start justify-between gap-4">
                  <p className="text-sm text-gray-700 truncate">{gen.prompt}</p>
                  <p className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                    {new Date(gen.created_at).toLocaleDateString('es-ES', {
                      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Sin generaciones aún.</p>
          )}
        </div>
      </main>
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: number | string; color?: 'indigo' | 'green' }) {
  const valueClass = color === 'indigo'
    ? 'text-indigo-600'
    : color === 'green'
    ? 'text-green-600'
    : 'text-gray-900'

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${valueClass}`}>{value}</p>
    </div>
  )
}
