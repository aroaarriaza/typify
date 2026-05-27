import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: generations } = await supabase
    .from('generations')
    .select('id, prompt, result, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-lg font-semibold text-gray-900">Typify</Link>
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">← Dashboard</Link>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Historial de generaciones</h1>

        {!generations || generations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <p className="text-gray-400 text-sm">Aún no has generado ningún listing.</p>
            <Link href="/dashboard" className="mt-4 inline-block text-sm text-indigo-600 hover:underline">
              Generar mi primer listing
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {generations.map((gen) => {
              let result: Record<string, unknown> = {}
              try { result = JSON.parse(gen.result ?? '{}') } catch { result = {} }
              return (
                <div key={gen.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <p className="text-sm font-medium text-gray-900 truncate">{result.title || gen.prompt}</p>
                    <p className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                      {new Date(gen.created_at).toLocaleDateString('es-ES', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                  {result.description && (
                    <p className="text-xs text-gray-500 line-clamp-2">{result.description}</p>
                  )}
                  {result.keywords && result.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {result.keywords.slice(0, 4).map((kw: string) => (
                        <span key={kw} className="bg-indigo-50 text-indigo-600 text-xs px-2 py-0.5 rounded-full">{kw}</span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
