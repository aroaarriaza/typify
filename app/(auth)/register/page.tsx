'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { register } from '../actions'

export default function RegisterPage() {
  const [state, action, pending] = useActionState(register, null)

  return (
    <div className="min-h-screen flex items-center justify-center aurora-bg px-4" style={{background: 'linear-gradient(160deg, #f8f7ff 0%, #fafafa 60%, #f0f0ff 100%)'}}>
      <div className="w-full max-w-md glass rounded-2xl shadow-lg shadow-indigo-100/40 p-6 sm:p-8 animate-fade-up">
        <p className="gradient-text text-sm font-bold mb-3">Typify</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Crear cuenta</h1>
        <p className="text-gray-500 text-sm mb-8">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-indigo-600 hover:underline">
            Inicia sesión
          </Link>
        </p>

        {state?.success ? (
          <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-xl px-4 py-6 text-center">
            <div className="text-3xl mb-3">📬</div>
            <p className="font-medium mb-1">¡Cuenta creada!</p>
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-indigo-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60"
            >
              {pending ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>

            <p className="text-xs text-gray-400 text-center">
              Incluye 10 créditos gratis para empezar
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
