'use client'

import { useActionState } from 'react'
import { updatePreferences } from '@/app/(auth)/actions'

const PLATFORMS = ['Amazon', 'Etsy', 'Shopify', 'eBay', 'WooCommerce']
const TONES = ['Profesional', 'Premium', 'Casual', 'Técnico', 'Urgente']
const LANGUAGES = [
  { code: 'español', label: 'Español' },
  { code: 'inglés', label: 'English' },
  { code: 'francés', label: 'Français' },
  { code: 'alemán', label: 'Deutsch' },
  { code: 'italiano', label: 'Italiano' },
  { code: 'portugués', label: 'Português' },
]

export default function PreferencesForm({
  preferredPlatform,
  preferredTone,
  preferredLanguage,
}: {
  preferredPlatform: string
  preferredTone: string
  preferredLanguage: string
}) {
  const [state, action, pending] = useActionState(updatePreferences, null)

  return (
    <form action={action} className="space-y-5">
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-gray-500" htmlFor="preferred_platform">
          Plataforma por defecto
        </label>
        <select
          id="preferred_platform"
          name="preferred_platform"
          defaultValue={preferredPlatform}
          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition appearance-none"
        >
          <option value="">Sin preferencia</option>
          {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-gray-500" htmlFor="preferred_tone">
          Tono por defecto
        </label>
        <select
          id="preferred_tone"
          name="preferred_tone"
          defaultValue={preferredTone}
          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition appearance-none"
        >
          <option value="">Sin preferencia</option>
          {TONES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-gray-500" htmlFor="preferred_language">
          Idioma por defecto
        </label>
        <select
          id="preferred_language"
          name="preferred_language"
          defaultValue={preferredLanguage}
          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition appearance-none"
        >
          <option value="">Sin preferencia</option>
          {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
        </select>
      </div>

      {state?.error && (
        <p role="alert" className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{state.error}</p>
      )}
      {state?.success && (
        <p role="status" className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">{state.success}</p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="bg-indigo-600 text-white text-sm font-medium px-5 py-2 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {pending ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}
