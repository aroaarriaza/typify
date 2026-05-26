import { createClient } from '@/lib/supabase/server'

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('plan, credits')
    .eq('id', user.id)
    .single()

  return data
}

export async function deductCredit(): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'No autenticado' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', user.id)
    .single()

  if (!profile || profile.credits <= 0) {
    return { ok: false, error: 'Sin créditos disponibles' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ credits: profile.credits - 1 })
    .eq('id', user.id)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
