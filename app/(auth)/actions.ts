'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type AuthState = { error?: string; success?: string } | null

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function register(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) return { error: error.message }

  // Si hay sesión activa, el email se confirmó automáticamente (modo dev)
  if (data.session) {
    revalidatePath('/', 'layout')
    redirect('/dashboard')
  }

  // Si no hay sesión, Supabase envió un email de confirmación
  return { success: 'Revisa tu email para confirmar tu cuenta.' }
}

export async function forgotPassword(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(
    formData.get('email') as string,
    { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password` }
  )

  if (error) return { error: error.message }

  return { success: 'Revisa tu email — te hemos enviado un enlace para restablecer tu contraseña.' }
}

export async function updatePassword(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient()
  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({ password })

  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

const ALLOWED_PLATFORMS = ['', 'Amazon', 'Etsy', 'Shopify', 'eBay', 'WooCommerce'] as const
const ALLOWED_TONES = ['', 'Profesional', 'Premium', 'Casual', 'Técnico', 'Urgente'] as const
const ALLOWED_PREF_LANGUAGES = ['', 'español', 'inglés', 'francés', 'alemán', 'italiano', 'portugués'] as const

export async function updateProfile(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient()

  const display_name = (formData.get('display_name') as string)?.trim().slice(0, 60)
  const preferred_platform = formData.get('preferred_platform') as string
  const preferred_tone = formData.get('preferred_tone') as string
  const preferred_language = formData.get('preferred_language') as string

  if (!ALLOWED_PLATFORMS.includes(preferred_platform as typeof ALLOWED_PLATFORMS[number]))
    return { error: 'Plataforma no válida.' }
  if (!ALLOWED_TONES.includes(preferred_tone as typeof ALLOWED_TONES[number]))
    return { error: 'Tono no válido.' }
  if (!ALLOWED_PREF_LANGUAGES.includes(preferred_language as typeof ALLOWED_PREF_LANGUAGES[number]))
    return { error: 'Idioma no válido.' }

  const { error } = await supabase.auth.updateUser({
    data: { display_name, preferred_platform, preferred_tone, preferred_language },
  })

  if (error) return { error: error.message }
  revalidatePath('/dashboard/profile')
  return { success: 'Perfil actualizado.' }
}

export async function updateDisplayName(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const display_name = (formData.get('display_name') as string)?.trim().slice(0, 60) ?? ''

  const { error } = await supabase.auth.updateUser({ data: { display_name } })
  if (error) return { error: error.message }
  revalidatePath('/dashboard/settings/cuenta')
  return { success: 'Nombre actualizado.' }
}

export async function updateEmail(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const email = (formData.get('email') as string)?.trim().toLowerCase()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { error: 'Introduce un email válido.' }
  if (email === user.email)
    return { error: 'Ya usas ese email.' }

  const { error } = await supabase.auth.updateUser({ email })
  if (error) return { error: error.message }
  return { success: 'Te hemos enviado un enlace de confirmación a ambas direcciones. Acepta el cambio desde el nuevo email.' }
}

export async function updatePreferences(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const preferred_platform = formData.get('preferred_platform') as string
  const preferred_tone = formData.get('preferred_tone') as string
  const preferred_language = formData.get('preferred_language') as string

  if (!ALLOWED_PLATFORMS.includes(preferred_platform as typeof ALLOWED_PLATFORMS[number]))
    return { error: 'Plataforma no válida.' }
  if (!ALLOWED_TONES.includes(preferred_tone as typeof ALLOWED_TONES[number]))
    return { error: 'Tono no válido.' }
  if (!ALLOWED_PREF_LANGUAGES.includes(preferred_language as typeof ALLOWED_PREF_LANGUAGES[number]))
    return { error: 'Idioma no válido.' }

  const { error } = await supabase.auth.updateUser({
    data: { preferred_platform, preferred_tone, preferred_language },
  })
  if (error) return { error: error.message }
  revalidatePath('/dashboard/settings/preferencias')
  return { success: 'Preferencias actualizadas.' }
}

export async function deleteAccount(): Promise<void> {
  const { createClient: createServiceClient } = await import('@supabase/supabase-js')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  await admin.auth.admin.deleteUser(user!.id)
  redirect('/login')
}
