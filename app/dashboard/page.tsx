import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/credits'
import GeneratorShell from './components/GeneratorShell'
import OnboardingModal from './components/OnboardingModal'
import HistorySection from './components/HistorySection'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profile, { data: rawGenerations }, { count: totalGenerations }] = await Promise.all([
    getProfile(),
    supabase
      .from('generations')
      .select('id, prompt, result, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('generations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id),
  ])

  const credits = profile?.credits ?? 0
  const plan = profile?.plan ?? 'free'
  const maxCredits = plan === 'pro' ? 100 : 10
  const meta = user.user_metadata ?? {}
  const displayName: string = meta.display_name ?? ''
  const avatarUrl: string = meta.avatar_url ?? ''
  const initial = (displayName?.[0] ?? user.email?.[0] ?? 'U').toUpperCase()

  const generations = (rawGenerations ?? []).map(g => {
    let listing = {}
    try { listing = JSON.parse(g.result) } catch { /* keep empty */ }
    return { id: g.id, prompt: g.prompt, created_at: g.created_at, listing }
  })

  return (
    <div className="min-h-screen aurora-bg" style={{ background: 'linear-gradient(160deg, #f8f7ff 0%, #fafafa 50%, #f0f0ff 100%)' }}>

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

      <OnboardingModal />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {/* Créditos */}
          <div className="glass rounded-2xl border border-white/80 shadow-sm shadow-indigo-100/40 px-4 py-3.5 animate-fade-up">
            <div className="flex items-center gap-1.5 mb-2">
              <span aria-hidden="true" className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-[10px] text-white font-bold shrink-0">✦</span>
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Créditos</p>
            </div>
            <div className="flex items-end gap-1 mb-1.5">
              <span className={`text-2xl font-bold leading-none ${credits <= 2 ? 'text-red-500' : 'text-gray-900'}`}>{credits}</span>
              <span className="text-xs text-gray-400 pb-0.5">/ {maxCredits}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
              <div
                className={`h-1 rounded-full transition-all duration-700 ${credits <= 2 ? 'bg-red-400' : 'bg-gradient-to-r from-indigo-500 to-violet-500'}`}
                style={{ width: `${Math.min((credits / maxCredits) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Listings */}
          <div className="glass rounded-2xl border border-white/80 shadow-sm shadow-indigo-100/40 px-4 py-3.5 animate-fade-up delay-100">
            <div className="flex items-center gap-1.5 mb-2">
              <span aria-hidden="true" className="w-5 h-5 rounded-md bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-[10px] text-white shrink-0">📋</span>
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Listings</p>
            </div>
            <span className="text-2xl font-bold text-gray-900 leading-none">{totalGenerations ?? 0}</span>
            <p className="text-[11px] text-gray-400 mt-1">generados</p>
          </div>

          {/* Plan */}
          <div className="glass rounded-2xl border border-white/80 shadow-sm shadow-indigo-100/40 px-4 py-3.5 animate-fade-up delay-200">
            <div className="flex items-center gap-1.5 mb-2">
              <span aria-hidden="true" className="w-5 h-5 rounded-md bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-[10px] text-white shrink-0">⚡</span>
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Plan</p>
            </div>
            {plan === 'pro' ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-500 to-violet-500 text-white">
                ✦ Pro
              </span>
            ) : (
              <>
                <span className="text-sm font-medium text-gray-600">Gratis</span>
                <Link href="/upgrade" className="block text-[11px] text-indigo-500 hover:text-indigo-600 mt-0.5 transition-colors">
                  Actualizar →
                </Link>
              </>
            )}
          </div>
        </div>

        <GeneratorShell credits={credits} />
        <HistorySection generations={generations ?? []} />
      </main>
    </div>
  )
}
