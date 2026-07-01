'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useActionState } from 'react'
import { updateDisplayName, updateEmail } from '@/app/(auth)/actions'

function ExpandableRow({
  label,
  value,
  editLabel,
  children,
}: {
  label: string
  value: string
  editLabel: string
  children: (close: () => void) => React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{value || '—'}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors shrink-0 ml-4"
        >
          {open ? 'Cancelar' : editLabel}
        </button>
      </div>
      {open && (
        <div className="pb-4 animate-fade-up">
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  )
}

function NameField({ displayName }: { displayName: string }) {
  const [state, action, pending] = useActionState(updateDisplayName, null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (state?.success) setOpen(false)
  }, [state])

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900">Nombre</p>
          <p className="text-xs text-gray-400 mt-0.5">{displayName || '—'}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors shrink-0 ml-4"
        >
          {open ? 'Cancelar' : 'Editar →'}
        </button>
      </div>
      {open && (
        <div className="pb-4 animate-fade-up">
          <form action={action} className="space-y-3">
            <input
              name="display_name"
              defaultValue={displayName}
              maxLength={60}
              placeholder="Tu nombre o alias"
              autoFocus
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition"
            />
            {state?.error && (
              <p role="alert" className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{state.error}</p>
            )}
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setOpen(false)}
                className="text-sm text-gray-500 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button type="submit" disabled={pending}
                className="text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl disabled:opacity-50 transition-colors font-medium">
                {pending ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

function EmailField({ email }: { email: string }) {
  const [state, action, pending] = useActionState(updateEmail, null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (state?.success) setOpen(false)
  }, [state])

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900">Email</p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{email}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors shrink-0 ml-4"
        >
          {open ? 'Cancelar' : 'Cambiar →'}
        </button>
      </div>
      {open && (
        <div className="pb-4 animate-fade-up">
          <form action={action} className="space-y-3">
            <input
              name="email"
              type="email"
              placeholder="nuevo@ejemplo.com"
              autoComplete="email"
              autoFocus
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition"
            />
            {state?.error && (
              <p role="alert" className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{state.error}</p>
            )}
            {state?.success && (
              <p role="status" className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">{state.success}</p>
            )}
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setOpen(false)}
                className="text-sm text-gray-500 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button type="submit" disabled={pending}
                className="text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl disabled:opacity-50 transition-colors font-medium">
                {pending ? 'Enviando...' : 'Confirmar cambio'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default function CuentaFields({
  displayName,
  email,
}: {
  displayName: string
  email: string
}) {
  return (
    <div className="divide-y divide-gray-50">
      <NameField displayName={displayName} />
      <EmailField email={email} />
      <div className="flex items-center justify-between py-4">
        <div>
          <p className="text-sm font-medium text-gray-900">Contraseña</p>
          <p className="text-xs text-gray-400 mt-0.5">••••••••••</p>
        </div>
        <Link
          href="/forgot-password"
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors shrink-0 ml-4"
        >
          Cambiar →
        </Link>
      </div>
    </div>
  )
}
