'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export default function AvatarUpload({
  avatarUrl,
  initial,
}: {
  avatarUrl: string
  initial: string
}) {
  const [preview, setPreview] = useState<string>(avatarUrl)
  useEffect(() => { setPreview(avatarUrl) }, [avatarUrl])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setLoading(true)
    setError(null)
    const form = new FormData()
    form.append('file', file)

    const res = await fetch('/api/upload-avatar', { method: 'POST', body: form })
    if (!res.ok) {
      setError(await res.text())
      setLoading(false)
      return
    }
    const { url } = await res.json()
    setPreview(url)
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="relative w-16 h-16 rounded-full shrink-0 group focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Cambiar foto de perfil"
      >
        {preview ? (
          <Image
            src={preview}
            alt="Avatar"
            fill
            className="rounded-full object-cover"
            sizes="64px"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-sm">
            <span className="text-xl font-bold text-white">{initial}</span>
          </div>
        )}
        <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Cambiar
            </span>
          )}
        </div>
      </button>

      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Subiendo...' : 'Cambiar foto'}
        </button>
        <p className="text-xs text-gray-400 mt-0.5">JPG, PNG o WebP · máx. 2MB</p>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
