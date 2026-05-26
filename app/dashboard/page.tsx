import { createClient } from '@/lib/supabase/server'
import { logout } from '../(auth)/actions'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Typify</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.email}</span>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Hola, {user?.email?.split('@')[0]}</h2>
        <p className="text-gray-500">El generador de textos llegará pronto.</p>
      </main>
    </div>
  )
}
