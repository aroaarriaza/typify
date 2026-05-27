'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { forgotPassword } from '../actions'

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(forgotPassword, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-6 sm:p-8">
        <Link href="/login" className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-block">
          ← Volver al login
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Restablecer contraseña</h1>
        <p className="text-gray-500 text-sm mb-8">
          Introduce tu email y te enviaremos un enlace para crear una nueva contraseña.
        </p>

        {state?.success ? (
          <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-xl px-4 py-6 text-center">
            <div className="text-3xl mb-3">📬</div>
            <p className="font-medium mb-1">Email enviado</p>
            <p className="text-green-700">{state.success}</p>
          </div>
        ) : (
          <form action={action} className="space-y-4">
            {state?.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {state.error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-indigo-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60"
            >
              {pending ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
