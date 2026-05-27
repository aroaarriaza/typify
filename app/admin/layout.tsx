import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const ADMIN_EMAIL = 'aroaarriaza@gmail.com'

const NAV = [
  { href: '/admin', label: 'Resumen' },
  { href: '/admin/users', label: 'Usuarios' },
  { href: '/admin/generations', label: 'Generaciones' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">

      {/* Header */}
      <header className="border-b border-white/10 px-4 sm:px-8 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">T</span>
          </div>
          <span className="text-white font-semibold text-sm">Typify</span>
          <span className="bg-indigo-500/20 text-indigo-300 text-xs font-medium px-2 py-0.5 rounded-full border border-indigo-500/30">
            Admin
          </span>
        </div>
        <Link href="/dashboard" className="text-xs text-slate-400 hover:text-white transition-colors">
          ← Volver a la app
        </Link>
      </header>

      {/* Nav tabs */}
      <nav className="border-b border-white/10 px-4 sm:px-8 flex gap-1 shrink-0">
        {NAV.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="px-4 py-3 text-sm text-slate-400 hover:text-white transition-colors border-b-2 border-transparent hover:border-indigo-400 -mb-px"
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Content */}
      <main className="flex-1 bg-slate-50 p-4 sm:p-8">
        {children}
      </main>

    </div>
  )
}
