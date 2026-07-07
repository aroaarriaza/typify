import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getProfile } from '@/lib/credits'

export const metadata = {
  title: 'Historial',
  robots: { index: false, follow: false },
}

type FlatListing = { title?: string; description?: string; keywords?: string[] }
type EntryType = 'generation' | 'analysis' | 'bulk'

function getEntryType(raw: unknown): EntryType {
  if (raw && typeof raw === 'object') {
    const t = (raw as Record<string, unknown>)._type
    if (t === 'analysis') return 'analysis'
    if (t === 'bulk') return 'bulk'
  }
  return 'generation'
}

function getTitle(raw: unknown, prompt: string): string {
  if (!raw || typeof raw !== 'object') return prompt
  const obj = raw as Record<string, unknown>
  if (obj._type) return prompt
  if (typeof obj.title === 'string') return obj.title
  const first = Object.values(obj).find(v => v && typeof v === 'object') as FlatListing | undefined
  return first?.title ?? prompt
}

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profile, { data: generations }] = await Promise.all([
    getProfile(),
    supabase
      .from('generations')
      .select('id, prompt, result, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50),
  ])

  const meta = user.user_metadata ?? {}
  const displayName: string = meta.display_name ?? ''
  const avatarUrl: string = meta.avatar_url ?? ''
  const initial = (displayName?.[0] ?? user.email?.[0] ?? 'U').toUpperCase()

  const entries = (generations ?? []).map(g => {
    let result: unknown = {}
    try { result = JSON.parse(g.result ?? '{}') } catch { result = {} }
    return { id: g.id, prompt: g.prompt, created_at: g.created_at, result }
  })

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #f8f7ff 0%, #fafafa 50%, #f0f0ff 100%)' }}>
      <header className="glass border-b border-white/60 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <span className="text-base font-bold gradient-text">Typify</span>
        <Link href="/dashboard/settings/cuenta" className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-sm hover:opacity-90 transition-opacity shrink-0">
          {avatarUrl ? (
            <Image src={avatarUrl} alt="Avatar" width={32} height={32} className="object-cover w-full h-full" />
          ) : (
            <span className="text-sm font-bold text-white">{initial}</span>
          )}
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Tabs nav */}
        <nav className="flex gap-1 p-1 glass rounded-xl border border-white/80 w-fit">
          <Link href="/dashboard" className="text-sm px-4 py-1.5 rounded-lg text-gray-500 hover:text-gray-700 transition-colors font-medium">Generar</Link>
          <Link href="/dashboard/analyze" className="text-sm px-4 py-1.5 rounded-lg text-gray-500 hover:text-gray-700 transition-colors font-medium">Analizar</Link>
          <Link href="/dashboard/bulk" className="text-sm px-4 py-1.5 rounded-lg text-gray-500 hover:text-gray-700 transition-colors font-medium">Bulk</Link>
          <span className="text-sm px-4 py-1.5 rounded-lg bg-white shadow-sm text-indigo-600 font-semibold">Historial</span>
        </nav>

        <h1 className="text-xl font-semibold text-gray-900">Historial</h1>

        {entries.length === 0 ? (
          <div className="glass rounded-2xl border border-white/80 p-10 text-center">
            <p className="text-gray-400 text-sm">Aún no hay nada en el historial.</p>
            <Link href="/dashboard" className="mt-4 inline-block text-sm text-indigo-600 hover:underline">Generar mi primer listing</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => {
              const type = getEntryType(entry.result)
              const title = getTitle(entry.result, entry.prompt)
              const obj = entry.result as Record<string, unknown>

              let badge: React.ReactNode = null
              let meta = ''
              let keywords: string[] = []

              if (type === 'analysis') {
                badge = <span className="text-[9px] font-semibold bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded uppercase tracking-wide">Análisis</span>
                meta = `Puntuación: ${obj.score ?? '—'}/100`
              } else if (type === 'bulk') {
                badge = <span className="text-[9px] font-semibold bg-teal-100 text-teal-600 px-1.5 py-0.5 rounded uppercase tracking-wide">Bulk</span>
                const results = (obj.results as { status: string }[] | undefined) ?? []
                const ok = results.filter(r => r.status === 'ok').length
                meta = `${results.length} productos · ${ok} ok`
              } else {
                badge = <span className="text-[9px] font-semibold bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded uppercase tracking-wide">Listing</span>
                const flat = (typeof obj.title === 'string' ? obj : Object.values(obj).find(v => v && typeof v === 'object')) as FlatListing | undefined
                keywords = flat?.keywords?.slice(0, 3) ?? []
              }

              return (
                <div key={entry.id} className="glass rounded-2xl border border-white/80 shadow-sm shadow-indigo-100/40 p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {badge}
                      <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
                    </div>
                    <p className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                      {new Date(entry.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  {meta && <p className="text-xs text-gray-500">{meta}</p>}
                  {keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {keywords.map((kw, i) => <span key={i} className="bg-indigo-50 text-indigo-600 text-xs px-2 py-0.5 rounded-full">{kw}</span>)}
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
