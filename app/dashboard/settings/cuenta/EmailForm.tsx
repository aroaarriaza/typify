'use client'

import { useActionState } from 'react'
import { updateEmail } from '@/app/(auth)/actions'

export default function EmailForm({ currentEmail }: { currentEmail: string }) {
  const [state, action, pending] = useActionState(updateEmail, null)

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-gray-500">Email actual</p>
        <p className="text-sm text-gray-700">{currentEmail}</p>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-gray-500" htmlFor="email">
          Nuevo email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="nuevo@ejemplo.com"
          autoComplete="email"
          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition"
        />
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
          {pending ? 'Enviando...' : 'Cambiar email'}
        </button>
      </div>
    </form>
  )
}
