import { generateText } from 'ai'
import { createVercel } from '@ai-sdk/vercel'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { deductCredit } from '@/lib/credits'

const gateway = createVercel({ baseURL: 'https://ai-gateway.vercel.sh/v1' })

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(userId)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + 60_000 })
    return true
  }
  if (entry.count >= 5) return false
  entry.count++
  return true
}

const analysisSchema = z.object({
  score: z.number().int().min(0).max(100),
  breakdown: z.object({
    title:       z.object({ score: z.number().int().min(0).max(100), feedback: z.string() }),
    description: z.object({ score: z.number().int().min(0).max(100), feedback: z.string() }),
    keywords:    z.object({ score: z.number().int().min(0).max(100), feedback: z.string() }),
    seo:         z.object({ score: z.number().int().min(0).max(100), feedback: z.string() }),
  }),
  strengths:   z.array(z.string()).min(1).max(4),
  suggestions: z.array(z.string()).min(1).max(6),
})

export type AnalysisResult = z.infer<typeof analysisSchema>

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('No autorizado', { status: 401 })

  if (!checkRateLimit(user.id))
    return new Response('Demasiadas peticiones. Espera un minuto.', { status: 429 })

  const { listing } = await req.json()
  if (!listing?.trim()) return new Response('El listing no puede estar vacío', { status: 400 })
  if (listing.length > 3000) return new Response('El listing es demasiado largo (máx 3000 caracteres)', { status: 400 })

  const credit = await deductCredit()
  if (!credit.ok) return new Response(credit.error ?? 'Sin créditos', { status: 402 })

  const prompt = `Eres un experto en SEO y copywriting para e-commerce. Analiza el siguiente listing de producto y devuelve una evaluación detallada.

LISTING A ANALIZAR:
${listing}

INSTRUCCIONES:
- Evalúa el listing de forma crítica y objetiva
- Puntúa cada área del 0 al 100 (0 = muy malo, 100 = perfecto)
- El score general es la media ponderada de las 4 áreas
- El feedback de cada área debe ser específico y accionable (1-2 frases)
- Las sugerencias deben ser concretas y fáciles de implementar
- Los puntos fuertes deben destacar lo que ya hace bien
- Responde ÚNICAMENTE con JSON válido, sin markdown ni texto adicional

ESTRUCTURA DE RESPUESTA EXACTA:
{
  "score": 72,
  "breakdown": {
    "title":       { "score": 80, "feedback": "El título incluye la keyword principal pero supera los 60 caracteres recomendados." },
    "description": { "score": 65, "feedback": "La descripción tiene buena longitud pero le falta storytelling y beneficios concretos." },
    "keywords":    { "score": 70, "feedback": "Usa keywords relevantes pero faltan variantes long-tail para capturar más búsquedas." },
    "seo":         { "score": 75, "feedback": "Buena estructura general, aunque la meta-descripción podría ser más persuasiva." }
  },
  "strengths": [
    "El título contiene la keyword principal al inicio",
    "La descripción tiene una buena longitud de 180 palabras"
  ],
  "suggestions": [
    "Acorta el título a menos de 60 caracteres para mejorar el CTR",
    "Añade 2-3 keywords long-tail en la descripción de forma natural",
    "Incluye una llamada a la acción al final de la descripción"
  ]
}`

  try {
    const { text } = await generateText({
      model: gateway('meta/llama-4-maverick'),
      prompt,
    })

    const match = text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('El modelo no devolvió JSON válido')

    const analysis = analysisSchema.parse(JSON.parse(match[0]))

    return Response.json(analysis)
  } catch (err) {
    console.error('[analyze]', err instanceof Error ? err.message : String(err))
    const { error: refundErr } = await supabase.rpc('refund_credit', { uid: user.id })
    if (refundErr) console.error('[analyze] refund failed', refundErr.message)
    return new Response('Error al analizar. Inténtalo de nuevo.', { status: 500 })
  }
}
