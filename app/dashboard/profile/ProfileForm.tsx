'use client'

import { useActionState } from 'react'
import { updateProfile } from '../../(auth)/actions'

const PLATFORMS = ['', 'Amazon', 'Etsy', 'Shopify', 'eBay', 'WooCommerce']
const TONES = ['', 'Profesional', 'Premium', 'Casual', 'Técnico', 'Urgente']
const LANGUAGES = [
  { code: '', label: 'Sin preferencia' },
  { code: 'español', label: 'Español' },
  { code: 'inglés', label: 'English' },
  { code: 'francés', label: 'Français' },
  { code: 'alemán', label: 'Deutsch' },
  { code: 'italiano', label: 'Italiano' },
  { code: 'portugués', label: 'Português' },
]

export default function ProfileForm({
  displayName,
  preferredPlatform,
  preferredTone,
  preferredLanguage,
}: {
  displayName: string
  preferredPlatform: string
  preferredTone: string
  preferredLanguage: string
}) {
  const [state, action, pending] = useActionState(updateProfile, null)

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
          Nombre para mostrar
        </label>
        <input
          name="display_name"
          defaultValue={displayName}
          maxLength={60}
          placeholder="Tu nombre o alias"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/60"
        />
      </div>

      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Preferencias por defecto</p>
        <div className="space-y-2">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Plataforma</label>
            <select
              name="preferred_platform"
              defaultValue={preferredPlatform}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/60"
            >
              <option value="">Sin preferencia</option>
              {PLATFORMS.filter(Boolean).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Tono</label>
            <select
              name="preferred_tone"
              defaultValue={preferredTone}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/60"
            >
              <option value="">Sin preferencia</option>
              {TONES.filter(Boolean).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Idioma</label>
            <select
              name="preferred_language"
              defaultValue={preferredLanguage}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/60"
            >
              {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {state?.error && (
        <p role="alert" className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{state.error}</p>
      )}
      {state?.success && (
        <p role="status" className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">{state.success}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-indigo-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
      >
        {pending ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </form>
  )
}
