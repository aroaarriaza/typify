import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

const MAX_SIZE = 2 * 1024 * 1024 // 2MB

function detectImageType(bytes: Uint8Array): { mime: string; ext: string } | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)
    return { mime: 'image/jpeg', ext: 'jpg' }
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47)
    return { mime: 'image/png', ext: 'png' }
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46
      && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50)
    return { mime: 'image/webp', ext: 'webp' }
  return null
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('No autorizado', { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return new Response('No se recibió archivo', { status: 400 })
  if (file.size > MAX_SIZE)
    return new Response('El archivo supera los 2MB', { status: 400 })

  const arrayBuffer = await file.arrayBuffer()
  const detected = detectImageType(new Uint8Array(arrayBuffer.slice(0, 12)))
  if (!detected) return new Response('Solo se permiten JPG, PNG o WebP', { status: 400 })

  const { ext } = detected
  const path = `${user.id}/avatar.${ext}`

  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  // Create bucket if it doesn't exist yet (idempotent)
  await admin.storage.createBucket('avatars', { public: true, fileSizeLimit: MAX_SIZE })

  const { error: uploadError } = await admin.storage
    .from('avatars')
    .upload(path, arrayBuffer, { contentType: detected.mime, upsert: true })

  if (uploadError) return new Response('Error al subir imagen', { status: 500 })

  const { data: { publicUrl } } = admin.storage.from('avatars').getPublicUrl(path)
  const urlWithBust = `${publicUrl}?t=${Date.now()}`

  const { error: metaError } = await supabase.auth.updateUser({
    data: { avatar_url: urlWithBust },
  })
  if (metaError) return new Response('Error al guardar URL', { status: 500 })

  return Response.json({ url: urlWithBust })
}
