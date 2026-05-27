import { generateObject } from 'ai'
import { createGroq } from '@ai-sdk/groq'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { deductCredit } from '@/lib/credits'

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY })

const listingSchema = z.object({
  title: z.string().describe('Título atractivo del producto (máx 60 caracteres)'),
  description: z.string().describe('Descripción de venta persuasiva (150-200 palabras)'),
  metaTitle: z.string().describe('Meta-título SEO (máx 60 caracteres)'),
  metaDescription: z.string().describe('Meta-descripción SEO (máx 155 caracteres)'),
  keywords: z.array(z.string()).describe('5-8 palabras clave SEO relevantes'),
  bulletPoints: z.array(z.string()).describe('4-5 puntos clave del producto'),
})

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('No autorizado', { status: 401 })

  const { productName, category, features } = await req.json()
  if (!productName?.trim()) return new Response('Nombre de producto requerido', { status: 400 })

  const credit = await deductCredit()
  if (!credit.ok) return new Response(credit.error ?? 'Sin créditos', { status: 402 })

  try {
    const { object } = await generateObject({
      model: groq('llama-3.3-70b-versatile'),
      schema: listingSchema,
      prompt: `Eres un experto en copywriting para e-commerce. Genera un listing completo en español para el siguiente producto:

Nombre: ${productName}
Categoría: ${category || 'General'}
Características: ${features || 'No especificadas'}

Genera todos los campos del listing de forma persuasiva, optimizada para SEO y orientada a la conversión.`,
    })

    await supabase.from('generations').insert({
      user_id: user.id,
      prompt: `${productName} — ${category}`,
      result: JSON.stringify(object),
    })

    return Response.json(object)
  } catch {
    const { data: profile } = await supabase
      .from('profiles').select('credits').eq('id', user.id).single()
    if (profile) {
      await supabase.from('profiles').update({ credits: profile.credits + 1 }).eq('id', user.id)
    }
    return new Response('Error al generar el listing', { status: 500 })
  }
}
