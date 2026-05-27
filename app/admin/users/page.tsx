import { createClient as createServiceClient } from '@supabase/supabase-js'

export default async function AdminUsersPage() {
  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: users } = await admin
    .from('profiles')
    .select('id, plan, credits, created_at')
    .order('created_at', { ascending: false })
    .limit(100)

  const total = users?.length ?? 0
  const proCount = users?.filter(u => u.plan === 'pro').length ?? 0

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-sm text-gray-500 mt-1">{total} usuarios · {proCount} Pro</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-4 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <span>ID</span>
          <span>Plan</span>
          <span>Créditos</span>
          <span>Registro</span>
        </div>
        <div className="divide-y divide-gray-50">
          {users && users.length > 0 ? (
            users.map((user) => (
              <div key={user.id} className="grid grid-cols-4 px-5 py-3.5 items-center hover:bg-gray-50/50 transition-colors">
                <span className="text-xs text-gray-400 font-mono truncate">{user.id.slice(0, 8)}…</span>
                <span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.plan === 'pro'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {user.plan === 'pro' ? '✦ Pro' : 'Gratis'}
                  </span>
                </span>
                <span className="text-sm text-gray-700 font-medium">{user.credits}</span>
                <span className="text-xs text-gray-500">
                  {new Date(user.created_at).toLocaleDateString('es-ES', {
                    day: '2-digit', month: 'short', year: 'numeric'
                  })}
                </span>
              </div>
            ))
          ) : (
            <p className="px-5 py-8 text-sm text-gray-400 text-center">Sin usuarios aún.</p>
          )}
        </div>
      </div>
    </div>
  )
}
