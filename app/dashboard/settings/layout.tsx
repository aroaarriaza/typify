import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SettingsSidebar from './_components/SettingsSidebar'

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #f8f7ff 0%, #fafafa 50%, #f0f0ff 100%)' }}>
      <header className="glass border-b border-white/60 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <Link href="/dashboard" className="text-base font-bold gradient-text">Typify</Link>
        <Link href="/dashboard" className="text-xs text-gray-500 hover:text-indigo-600 transition-colors flex items-center gap-1.5">
          <span>←</span> Dashboard
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 px-1">
          <h1 className="text-xl font-semibold text-gray-900">Configuración</h1>
          <p className="text-sm text-gray-400 mt-0.5">Gestiona tu cuenta y preferencias</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-44 shrink-0">
            <SettingsSidebar />
          </aside>
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
