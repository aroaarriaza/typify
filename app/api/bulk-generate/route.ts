import { generateText } from 'ai'
import { createVercel } from '@ai-sdk/vercel'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/credits'

const gateway = createVercel({ baseURL: 'https://ai-gateway.vercel.sh/v1' })

const ALLOWED_PLATFORMS = ['Amazon', 'Etsy', 'Shopify', 'eBay', 'WooCommerce', ''] as const
const ALLOWED_LANGUAGES = ['español', 'inglés', 'francés', 'alemán', 'italiano', 'portugués'] as const
type AllowedLanguage = typeof ALLOWED_LANGUAGES[number]

const productSchema = z.object({
  name:     z.string().min(1).max(200),
  category: z.string().max(100).optional().default(''),
  features: z.string().max(800).optional().default(''),
})

const listingSchema = z.object({
  title:           z.string(),
  description:     z.string(),
  metaTitle:       z.string(),
  metaDescription: z.string(),
  keywords:        z.array(z.string()),
  bulletPoints:    z.array(z.string()),
})

export type BulkProduct  = z.infer<typeof productSchema>
export type BulkListing  = z.infer<typeof listingSchema>
export type BulkRowResult =
  | { status: 'ok';    name: string; listing: BulkListing }
  | { status: 'error'; name: string; error: string }

const platformInstructions: Record<string, string> = {
  Amazon:      'Optimiza para Amazon: título con keywords principales al inicio (máx 200 caracteres), bullet points enfocados en beneficios y especificaciones técnicas.',
  Etsy:        'Optimiza para Etsy: tono artesanal y personal, destaca la historia y unicidad del producto, keywords long-tail naturales.',
  Shopify:     'Optimiza para Shopify: descripción de marca más larga y detallada, enfoque en experiencia de usuario y valor de marca.',
  eBay:        'Optimiza para eBay: incluye especificaciones técnicas detalladas, keywords directas y comparativas, tono informativo.',
  WooCommerce: 'Optimiza para WooCommerce: descripción orientada a SEO orgánico, estructura clara con beneficios y especificaciones.',
}

function buildPrompt(product: BulkProduct, platform: string, lang: AllowedLanguage) {
  const platformHint = platformInstructions[platform] ?? 'Listing genérico optimizado para e-commerce.'
  return `Eres un experto en copywriting para e-commerce. Genera un listing completo para el siguiente producto.

PRODUCTO
Nombre: ${product.name}
Categoría: ${product.category || 'General'}
Características: ${product.features || 'No especificadas'}

INSTRUCCIONES DE PLATAFORMA
${platformHint}

IDIOMA
Genera TODO el contenido en ${lang}.

FORMATO DE RESPUESTA
Responde ÚNICAMENTE con un objeto JSON válido, sin markdown ni texto adicional:
{
  "title": "título atractivo (máx 60 caracteres)",
  "description": "descripción persuasiva de 150-200 palabras",
  "metaTitle": "meta-título SEO (máx 60 caracteres)",
  "metaDescription": "meta-descripción SEO (máx 155 caracteres)",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "bulletPoints": ["punto1", "punto2", "punto3", "punto4"]
}`
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('No autorizado', { status: 401 })

  const profile = await getProfile()
  if (!profile) return new Response('No autorizado', { status: 401 })

  const MAX_PRODUCTS = profile.plan === 'pro' ? 50 : 5

  const body = await req.json()

  if (!Array.isArray(body.products) || body.products.length === 0)
    return new Response('Se requiere al menos un producto', { status: 400 })
  if (body.products.length > MAX_PRODUCTS)
    return new Response(
      `Tu plan ${profile.plan === 'pro' ? 'Pro' : 'Free'} permite máximo ${MAX_PRODUCTS} productos por bulk`,
      { status: 400 }
    )

  const parseResult = z.array(productSchema).safeParse(body.products)
  if (!parseResult.success) return new Response('Productos no válidos', { status: 400 })
  const products = parseResult.data

  const rawLang = body.language
  const lang: AllowedLanguage = ALLOWED_LANGUAGES.includes(rawLang) ? rawLang : 'español'
  const platform: string = ALLOWED_PLATFORMS.includes(body.platform) ? body.platform : ''

  const needed = products.length
  if (profile.credits < needed)
    return new Response(`Necesitas ${needed} créditos pero solo tienes ${profile.credits}`, { status: 402 })

  // Deduct credits atomically: N sequential calls (race-safe via DB RPC)
  let deducted = 0
  for (let i = 0; i < needed; i++) {
    const { data, error } = await supabase.rpc('deduct_credit', { uid: user.id })
    if (error || !data) {
      // Refund already deducted
      for (let j = 0; j < deducted; j++) {
        await supabase.rpc('refund_credit', { uid: user.id })
      }
      return new Response('Sin créditos suficientes', { status: 402 })
    }
    deducted++
  }

  // Generate all products in parallel
  const settled = await Promise.allSettled(
    products.map(async (product): Promise<BulkRowResult> => {
      try {
        const { text } = await generateText({
          model: gateway('meta/llama-4-scout'),
          prompt: buildPrompt(product, platform, lang),
        })
        const match = text.match(/\{[\s\S]*\}/)
        if (!match) throw new Error('JSON inválido')
        const listing = listingSchema.parse(JSON.parse(match[0]))
        return { status: 'ok', name: product.name, listing }
      } catch (err) {
        // Refund this one credit
        await supabase.rpc('refund_credit', { uid: user.id })
        return { status: 'error', name: product.name, error: err instanceof Error ? err.message : 'Error desconocido' }
      }
    })
  )

  const results: BulkRowResult[] = settled.map(s =>
    s.status === 'fulfilled' ? s.value : { status: 'error', name: '?', error: String(s.reason) }
  )

  return Response.json(results)
}
