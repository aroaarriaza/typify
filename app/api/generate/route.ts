import { createGroq } from '@ai-sdk/groq'
import { streamText } from 'ai'
import { createClient } from '@/lib/supabase/server'
import { deductCredit } from '@/lib/credits'

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response('No autorizado', { status: 401 })
  }

  const { prompt } = await req.json()
  if (!prompt?.trim()) {
    return new Response('Prompt vacío', { status: 400 })
  }

  // Descontar crédito antes de llamar a la IA
  const credit = await deductCredit()
  if (!credit.ok) {
    return new Response(credit.error ?? 'Sin créditos', { status: 402 })
  }

  try {
    const result = streamText({
      model: groq('llama-3.1-8b-instant'),
      system: 'Eres un experto en copywriting. Escribe textos claros, persuasivos y bien estructurados en español. Responde directamente con el texto solicitado, sin introducciones ni explicaciones.',
      prompt,
      onFinish: async ({ text }) => {
        await supabase.from('generations').insert({
          user_id: user.id,
          prompt,
          result: text,
        })
      },
    })

    return result.toTextStreamResponse()
  } catch {
    // Si Groq falla, devolvemos el crédito
    const { data: profile } = await supabase
      .from('profiles').select('credits').eq('id', user.id).single()
    if (profile) {
      await supabase
        .from('profiles').update({ credits: profile.credits + 1 }).eq('id', user.id)
    }
    return new Response('Error al generar el texto', { status: 500 })
  }
}
