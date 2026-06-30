'use client'

import { useState, useTransition } from 'react'
import { deleteAccount } from '../../(auth)/actions'

export default function DeleteAccountButton() {
  const [confirmed, setConfirmed] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [deleteError, setDeleteError] = useState<string | null>(null)

  function handleDelete() {
    setDeleteError(null)
    startTransition(async () => {
      try {
        await deleteAccount()
      } catch {
        setDeleteError('No se pudo eliminar la cuenta. Inténtalo de nuevo.')
      }
    })
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-400">
        Al eliminar tu cuenta se borran todos tus datos permanentemente. Esta acción no se puede deshacer.
      </p>
      {!confirmed ? (
        <button
          type="button"
          onClick={() => setConfirmed(true)}
          className="w-full border border-red-200 text-red-600 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors"
        >
          Eliminar mi cuenta
        </button>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-red-600 font-medium">¿Estás segura? Esta acción es irreversible.</p>
          {deleteError && (
            <p className="text-xs text-red-600">{deleteError}</p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setConfirmed(false)}
              className="flex-1 border border-gray-200 text-gray-600 text-sm px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="flex-1 bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isPending ? 'Eliminando...' : 'Sí, eliminar'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
