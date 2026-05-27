import { createClient as createServiceClient } from '@supabase/supabase-js'

export default async function AdminGenerationsPage() {
  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: generations } = await admin
    .from('generations')
    .select('prompt, created_at, user_id')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Generaciones</h1>
        <p className="text-sm text-gray-500 mt-1">Últimas 50 generaciones</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto] px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider gap-4">
          <span>Producto</span>
          <span>Usuario</span>
          <span>Fecha</span>
        </div>
        <div className="divide-y divide-gray-50">
          {generations && generations.length > 0 ? (
            generations.map((gen, i) => (
              <div key={i} className="grid grid-cols-[1fr_auto_auto] px-5 py-3.5 items-center gap-4 hover:bg-gray-50/50 transition-colors">
                <p className="text-sm text-gray-800 truncate">{gen.prompt || '—'}</p>
                <span className="text-xs text-gray-400 font-mono">{gen.user_id.slice(0, 8)}…</span>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {new Date(gen.created_at).toLocaleDateString('es-ES', {
                    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>
            ))
          ) : (
            <p className="px-5 py-8 text-sm text-gray-400 text-center">Sin generaciones aún.</p>
          )}
        </div>
      </div>
    </div>
  )
}
