import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/credits'
import AnalyzeClient from './AnalyzeClient'

export const metadata = {
  title: 'Analizar listing',
  robots: { index: false, follow: false },
}

export default async function AnalyzePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const profile = await getProfile()
  const credits = profile?.credits ?? 0

  const meta = user.user_metadata ?? {}
  const displayName: string = meta.display_name ?? ''
  const avatarUrl: string = meta.avatar_url ?? ''
  const initial = (displayName?.[0] ?? user.email?.[0] ?? 'U').toUpperCase()

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
          <Link
            href="/dashboard"
            className="text-sm px-4 py-1.5 rounded-lg text-gray-500 hover:text-gray-700 transition-colors font-medium"
          >
            Generar
          </Link>
          <span className="text-sm px-4 py-1.5 rounded-lg bg-white shadow-sm text-indigo-600 font-semibold">
            Analizar
          </span>
          <Link
            href="/dashboard/history"
            className="text-sm px-4 py-1.5 rounded-lg text-gray-500 hover:text-gray-700 transition-colors font-medium"
          >
            Historial
          </Link>
        </nav>

        <div>
          <h1 className="text-xl font-semibold text-gray-900">Analizar listing existente</h1>
          <p className="text-sm text-gray-400 mt-1">Pega tu listing actual y la IA lo evaluará con una puntuación y sugerencias concretas.</p>
        </div>

        <AnalyzeClient credits={credits} />
      </main>
    </div>
  )
}
