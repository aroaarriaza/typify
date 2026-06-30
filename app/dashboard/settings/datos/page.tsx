import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ExportButton from './ExportButton'
import DeleteAccountButton from '../../profile/DeleteAccountButton'

export default async function DatosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="space-y-3">
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="text-sm font-semibold text-gray-900">Exportar datos</h2>
        </div>
        <div className="px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-700">Historial de listings</p>
            <p className="text-xs text-gray-400 mt-0.5">Descarga todos tus listings en formato CSV</p>
          </div>
          <ExportButton />
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-red-50">
          <h2 className="text-sm font-semibold text-red-500">Zona de peligro</h2>
        </div>
        <div className="px-6 py-5">
          <DeleteAccountButton />
        </div>
      </section>
    </div>
  )
}
