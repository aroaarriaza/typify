import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

function escapeCSV(value: string): string {
  if (value.includes('"') || value.includes(',') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: generations, error } = await supabase
    .from('generations')
    .select('id, prompt, result, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return new Response('Error al obtener datos', { status: 500 })

  const rows: string[] = [
    ['Fecha', 'Producto', 'Idiomas', 'Título', 'Descripción'].join(','),
  ]

  for (const g of generations ?? []) {
    let parsed: Record<string, unknown> = {}
    try { parsed = JSON.parse(g.result) } catch { /* skip */ }

    let langs: string[] = []
    let title = ''
    let description = ''

    if (parsed && typeof parsed === 'object') {
      const keys = Object.keys(parsed)
      if (keys.length > 0 && typeof (parsed[keys[0]] as Record<string, unknown>)?.title === 'string') {
        // Multi-language format: { español: { title, description, ... }, ... }
        langs = keys
        const firstLang = parsed[keys[0]] as Record<string, string>
        title = firstLang.title ?? ''
        description = firstLang.description ?? ''
      } else if (typeof (parsed as Record<string, unknown>).title === 'string') {
        // Old flat format
        const flat = parsed as Record<string, string>
        title = flat.title ?? ''
        description = flat.description ?? ''
      }
    }

    const date = new Date(g.created_at).toLocaleDateString('es-ES')
    rows.push([
      escapeCSV(date),
      escapeCSV(g.prompt ?? ''),
      escapeCSV(langs.join(' / ') || '—'),
      escapeCSV(title),
      escapeCSV(description.slice(0, 200)),
    ].join(','))
  }

  const csv = rows.join('\n')

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="typify-listings.csv"',
    },
  })
}
