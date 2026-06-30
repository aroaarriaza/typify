import { generateText } from 'ai'
import { createVercel } from '@ai-sdk/vercel'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { deductCredit } from '@/lib/credits'

const gateway = createVercel({ baseURL: 'https://ai-gateway.vercel.sh/v1' })

const ALLOWED_MODELS = [
  'meta/llama-4-scout',
  'meta/llama-4-maverick',
  'google/gemini-2.5-flash',
] as const
type AllowedModel = typeof ALLOWED_MODELS[number]

const ALLOWED_LANGUAGES = ['español', 'inglés', 'francés', 'alemán', 'italiano', 'portugués'] as const

// Rate limiting simple: máx 10 requests por usuario por minuto.
// Funciona dentro de una misma instancia de Fluid Compute.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 10
const RATE_WINDOW_MS = 60_000

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(userId)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

function buildSchema(lang: string) {
  return z.object({
    title: z.string().describe(`Attractive product title in ${lang} (max 60 characters)`),
    description: z.string().describe(`Persuasive sales description in ${lang} (150-200 words)`),
    metaTitle: z.string().describe(`SEO meta-title in ${lang} (max 60 characters)`),
    metaDescription: z.string().describe(`SEO meta-description in ${lang} (max 155 characters)`),
    keywords: z.array(z.string()).describe(`5-8 relevant SEO keywords in ${lang}`),
    bulletPoints: z.array(z.string()).describe(`4-5 key product bullet points in ${lang}`),
  })
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('No autorizado', { status: 401 })

  if (!checkRateLimit(user.id))
    return new Response('Demasiadas peticiones. Espera un minuto.', { status: 429 })

  const { productName, category, features, platform, tone, language, model } = await req.json()
  if (!productName?.trim()) return new Response('Nombre de producto requerido', { status: 400 })
  if (productName.length > 200) return new Response('Nombre demasiado largo', { status: 400 })
  if (features && features.length > 800) return new Response('Características demasiado largas', { status: 400 })
  if (model && !ALLOWED_MODELS.includes(model)) return new Response('Modelo no permitido', { status: 400 })
  const selectedModel: AllowedModel = model ? (model as AllowedModel) : 'meta/llama-4-scout'

  const credit = await deductCredit()
  if (!credit.ok) return new Response(credit.error ?? 'Sin créditos', { status: 402 })

  const platformInstructions: Record<string, string> = {
    Amazon: 'Optimiza para Amazon: título con keywords principales al inicio (máx 200 caracteres), bullet points enfocados en beneficios y especificaciones técnicas, descripción orientada a conversión en móvil.',
    Etsy: 'Optimiza para Etsy: tono artesanal y personal, destaca la historia y unicidad del producto, keywords long-tail naturales, descripción con storytelling.',
    Shopify: 'Optimiza para Shopify/tienda propia: descripción de marca más larga y detallada, enfoque en experiencia de usuario y valor de marca.',
    eBay: 'Optimiza para eBay: incluye especificaciones técnicas detalladas, estado del producto, keywords directas y comparativas, tono informativo.',
    WooCommerce: 'Optimiza para WooCommerce: descripción detallada orientada a SEO orgánico, estructura clara con beneficios y especificaciones.',
  }

  const toneInstructions: Record<string, string> = {
    Profesional: 'Tono profesional y corporativo: lenguaje formal, preciso y confiable.',
    Premium: 'Tono premium y de lujo: lenguaje sofisticado, aspiracional, que transmite exclusividad y calidad superior.',
    Casual: 'Tono casual y cercano: lenguaje directo, amigable y conversacional, como si hablaras con un amigo.',
    Técnico: 'Tono técnico y detallado: enfócate en especificaciones, materiales, medidas y datos objetivos.',
    Urgente: 'Tono urgente con llamada a la acción: crea sensación de oportunidad, escasez y beneficio inmediato.',
  }

  const platformHint = platform && platformInstructions[platform] ? platformInstructions[platform] : ''
  const toneHint = tone && toneInstructions[tone] ? toneInstructions[tone] : toneInstructions['Profesional']
  const outputLanguage = ALLOWED_LANGUAGES.includes(language) ? language : 'español'

  try {
    const { text } = await generateText({
      model: gateway(selectedModel),
      prompt: `Eres un experto en copywriting para e-commerce. Genera un listing completo para el siguiente producto.

PRODUCTO
Nombre: ${productName}
Categoría: ${category || 'General'}
Características: ${features || 'No especificadas'}

INSTRUCCIONES DE PLATAFORMA
${platformHint || 'Listing genérico optimizado para e-commerce.'}

TONO
${toneHint}

IDIOMA
Genera TODO el contenido en ${outputLanguage}. Título, descripción, meta-tags, keywords y bullet points deben estar íntegramente en ${outputLanguage}.

FORMATO DE RESPUESTA
Responde ÚNICAMENTE con un objeto JSON válido, sin markdown, sin bloques de código, sin texto adicional antes ni después. Usa esta estructura exacta:
{
  "title": "título atractivo (máx 60 caracteres)",
  "description": "descripción persuasiva de 150-200 palabras",
  "metaTitle": "meta-título SEO (máx 60 caracteres)",
  "metaDescription": "meta-descripción SEO (máx 155 caracteres)",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "bulletPoints": ["punto1", "punto2", "punto3", "punto4"]
}`,
    })

    const match = text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('El modelo no devolvió JSON válido')
    const object = buildSchema(outputLanguage).parse(JSON.parse(match[0]))

    await supabase.from('generations').insert({
      user_id: user.id,
      prompt: `${productName} — ${category}`,
      result: JSON.stringify(object),
    })

    return Response.json(object)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[generate]', message)
    await supabase.rpc('refund_credit', { uid: user.id })
    return new Response(message, { status: 500 })
  }
}
