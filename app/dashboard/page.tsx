import Link from 'next/link'
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

  const [profile, { data: rawGenerations }] = await Promise.all([
    getProfile(),
    supabase
      .from('generations')
      .select('id, prompt, result, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  const credits = profile?.credits ?? 0
  const plan = profile?.plan ?? 'free'
  const maxCredits = plan === 'pro' ? 100 : 10
  const initial = (user.email?.[0] ?? 'U').toUpperCase()

  const generations = (rawGenerations ?? []).map(g => {
    let listing = {}
    try { listing = JSON.parse(g.result) } catch { /* keep empty */ }
    return { id: g.id, prompt: g.prompt, created_at: g.created_at, listing }
  })

  return (
    <div className="min-h-screen aurora-bg" style={{background: 'linear-gradient(160deg, #f8f7ff 0%, #fafafa 50%, #f0f0ff 100%)'}}>

      <header className="glass border-b border-white/60 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <span className="text-base font-bold gradient-text">Typify</span>
        <Link href="/dashboard/profile" className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-sm hover:opacity-90 transition-opacity">
          <span className="text-sm font-bold text-white">{initial}</span>
        </Link>
      </header>

      <OnboardingModal />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <GeneratorShell credits={credits} plan={plan} maxCredits={maxCredits} />
        <HistorySection generations={generations ?? []} />
      </main>
    </div>
  )
}
