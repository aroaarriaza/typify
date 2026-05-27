import { createClient } from '@supabase/supabase-js'

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('No autorizado', { status: 401 })
  }

  // Reset credits: free → 10, pro → 100
  await admin.from('profiles').update({ credits: 10 }).eq('plan', 'free')
  await admin.from('profiles').update({ credits: 100 }).eq('plan', 'pro')

  return Response.json({ ok: true, resettedAt: new Date().toISOString() })
}
