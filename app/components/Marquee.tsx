const ITEMS = [
  'TYPIFY', 'AI-POWERED', 'E-COMMERCE', 'SEO OPTIMIZADO',
  'AMAZON', 'ETSY', 'SHOPIFY', 'LISTINGS', 'COPYWRITING',
  'CONVERSIÓN', 'KEYWORDS', 'BULLET POINTS',
]

export default function Marquee() {
  const track = [...ITEMS, ...ITEMS]
  return (
    <div className="marquee-outer">
      <div className="marquee-track">
        {track.map((item, i) => (
          <span key={i} className="marquee-item">
            {item}&nbsp;<span className="marquee-dot">·</span>&nbsp;
          </span>
        ))}
      </div>
    </div>
  )
}
