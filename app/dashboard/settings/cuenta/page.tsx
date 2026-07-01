import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/(auth)/actions'
import AvatarUpload from './AvatarUpload'
import CuentaFields from './CuentaFields'

export default async function CuentaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const meta = user.user_metadata ?? {}
  const displayName: string = meta.display_name ?? ''
  const avatarUrl: string = meta.avatar_url ?? ''
  const isAdmin = user.email === 'aroaarriaza@gmail.com'
  const initial = (displayName?.[0] ?? user.email?.[0] ?? 'U').toUpperCase()

  return (
    <div className="space-y-3">
      {/* Perfil */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="text-sm font-semibold text-gray-900">Perfil</h2>
        </div>
        <div className="px-6 pt-5 pb-2">
          <AvatarUpload avatarUrl={avatarUrl} initial={initial} />
        </div>
        <div className="px-6">
          <CuentaFields displayName={displayName} email={user.email ?? ''} />
        </div>
      </section>

      {/* Acciones */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
        <div className="px-6 py-4">
          <h2 className="text-sm font-semibold text-gray-900">Acciones</h2>
        </div>

        <Link
          href="/dashboard/history"
          className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group"
        >
          <div>
            <p className="text-sm text-gray-700">Historial de generaciones</p>
            <p className="text-xs text-gray-400 mt-0.5">Tus listings anteriores</p>
          </div>
          <span className="text-gray-300 group-hover:text-gray-400 text-sm transition-colors">→</span>
        </Link>

        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center justify-between px-6 py-4 hover:bg-indigo-50 transition-colors group"
          >
            <div>
              <p className="text-sm font-medium text-indigo-700">Panel de administración</p>
              <p className="text-xs text-indigo-400 mt-0.5">Solo visible para admins</p>
            </div>
            <span className="text-indigo-300 group-hover:text-indigo-400 text-sm transition-colors">→</span>
          </Link>
        )}

        <div className="px-6 py-4">
          <form action={logout}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">Cerrar sesión</p>
                <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
              </div>
              <button
                type="submit"
                className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
              >
                Cerrar →
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
