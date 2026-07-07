import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Typify — Listings de e-commerce con IA'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #4338ca 0%, #6d28d9 50%, #7c3aed 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 88,
            height: 88,
            borderRadius: 22,
            background: 'rgba(255,255,255,0.18)',
            border: '2px solid rgba(255,255,255,0.3)',
            marginBottom: 36,
            fontSize: 44,
            color: 'white',
          }}
        >
          ✦
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: 'white',
            letterSpacing: '-3px',
            marginBottom: 20,
          }}
        >
          Typify
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 30,
            color: 'rgba(255,255,255,0.75)',
            textAlign: 'center',
            maxWidth: 620,
            lineHeight: 1.4,
            marginBottom: 52,
          }}
        >
          Listings de e-commerce con IA
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 14 }}>
          {['Título SEO', 'Descripción', 'Meta tags', 'Keywords'].map(tag => (
            <div
              key={tag}
              style={{
                background: 'rgba(255,255,255,0.14)',
                border: '1px solid rgba(255,255,255,0.28)',
                borderRadius: 100,
                padding: '10px 24px',
                fontSize: 20,
                color: 'rgba(255,255,255,0.9)',
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  )
}
