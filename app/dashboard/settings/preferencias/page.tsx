import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PreferencesForm from './PreferencesForm'

export default async function PreferenciasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const meta = user.user_metadata ?? {}
  const preferredPlatform: string = meta.preferred_platform ?? ''
  const preferredTone: string = meta.preferred_tone ?? ''
  const preferredLanguage: string = meta.preferred_language ?? ''

  return (
    <div className="space-y-3">
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="text-sm font-semibold text-gray-900">Preferencias por defecto</h2>
          <p className="text-xs text-gray-400 mt-0.5">Se usan como valores iniciales al generar un listing</p>
        </div>
        <div className="px-6 py-5">
          <PreferencesForm
            preferredPlatform={preferredPlatform}
            preferredTone={preferredTone}
            preferredLanguage={preferredLanguage}
          />
        </div>
      </section>
    </div>
  )
}
