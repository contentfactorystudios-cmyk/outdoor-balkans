'use client'
import { useRef } from 'react'
import Link from 'next/link'

const ITEMS = [
  { cat: 'Ribolov',      icon: '🎣', slug: 'ribolov',
    name: 'Štap za muharenje',
    desc: 'Profesionalni štap za muharenje za brze planinske potoke.',
    price: '~€89',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop&q=80' },
  { cat: 'Lov',          icon: '🦌', slug: 'lov',
    name: 'Lovački dvogled',
    desc: 'Kompaktni lovački dvogled 8x42 za teren i jagnjenicu.',
    price: '~€120',
    img: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=400&h=500&fit=crop&q=80' },
  { cat: 'Kampovanje',   icon: '⛺', slug: 'kampovanje',
    name: 'Šator 3 sezone',
    desc: 'Lagani šator za 2 osobe, vodootporan, idealan za Balkan.',
    price: '~€145',
    img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=500&fit=crop&q=80' },
  { cat: 'Planinarenje', icon: '🥾', slug: 'planinarenje',
    name: 'Planinarske čizme',
    desc: 'Gore-Tex čizme visokog grlenika za zahtjevne staze.',
    price: '~€95',
    img: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=500&fit=crop&q=80' },
  { cat: 'Kajak',        icon: '🚣', slug: 'kajak',
    name: 'Kajak veslo karbon',
    desc: 'Lagano karbon veslo za kajak, podesive dužine 215-235cm.',
    price: '~€75',
    img: 'https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?w=400&h=500&fit=crop&q=80' },
  { cat: 'Nacionalni parkovi',    icon: '🦋', slug: 'nacionalni-parkovi',
    name: 'Terenska kamera',
    desc: 'Automatska terenska kamera 4K za praćenje divljači.',
    price: '~€180',
    img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=500&fit=crop&q=80' },
]

export default function GearCarousel() {
  const ref = useRef<HTMLDivElement>(null)

  function scroll(dir: 'left' | 'right') {
    if (!ref.current) return
    ref.current.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' })
  }

  const arrowStyle: React.CSSProperties = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    zIndex: 10, background: '#fff',
    border: '1.5px solid #e8e2d4',
    borderRadius: '50%', width: '44px', height: '44px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', fontSize: '1.2rem', color: '#0e1a0e',
    boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
    transition: 'box-shadow 0.2s',
  }

  return (
    <section style={{ padding: '72px 24px', background: '#fff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', marginBottom: '36px' }}>
        <p style={{ color: '#8fa68f', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.14em', marginBottom: '10px', textAlign: 'center' }}>Outdoor Shop</p>
        <h2 style={{ fontFamily: "'Fraunces','Playfair Display',Georgia,serif",
          fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 900, color: '#0e1a0e', textAlign: 'center',
          marginBottom: '8px' }}>Oprema koja te ne ostavlja na cedilu</h2>
        <p style={{ color: '#8fa68f', fontSize: '0.95rem', textAlign: 'center' }}>
          Pomeri levo/desno da vidiš preporučenu opremu po kategoriji
        </p>
      </div>

      <div style={{ position: 'relative', maxWidth: '1100px', margin: '0 auto' }}>
        {/* Leva strelica */}
        <button onClick={() => scroll('left')} style={{ ...arrowStyle, left: '20px' }}>‹</button>

        {/* Karusel */}
        <div ref={ref} style={{
          display: 'flex', overflowX: 'auto', gap: '20px',
          padding: '16px 60px 24px',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          scrollSnapType: 'x mandatory',
        }}>
          {ITEMS.map(item => (
            <div key={item.slug} style={{ flexShrink: 0, width: '280px', scrollSnapAlign: 'start' }}>
              <Link href={'/products/' + item.slug} style={{ textDecoration: 'none', display: 'block' }}>
                <div className='loc-card' style={{ borderRadius: '20px', overflow: 'hidden',
                  background: '#fff', border: '1px solid #ede8df',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
                  <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                    <img src={item.img} alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} />
                    <div style={{ position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top,rgba(0,0,0,0.35) 0%,transparent 60%)' }} />
                    <div style={{ position: 'absolute', top: '12px', left: '12px',
                      background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(6px)',
                      color: '#fff', fontSize: '0.7rem', fontWeight: 600,
                      padding: '3px 10px', borderRadius: '999px' }}>
                      {item.icon} {item.cat}
                    </div>
                    <div style={{ position: 'absolute', bottom: '12px', right: '12px',
                      background: '#fff', color: '#0e1a0e', fontSize: '0.82rem',
                      fontWeight: 700, padding: '4px 12px', borderRadius: '999px' }}>
                      {item.price}
                    </div>
                  </div>
                  <div style={{ padding: '16px 18px 20px' }}>
                    <h3 style={{ fontFamily: "'Fraunces','Playfair Display',Georgia,serif",
                      fontSize: '1rem', fontWeight: 700, color: '#0e1a0e',
                      marginBottom: '6px', lineHeight: 1.3 }}>{item.name}</h3>
                    <p style={{ fontSize: '0.82rem', color: '#8fa68f', lineHeight: 1.5,
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.desc}</p>
                    <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center',
                      gap: '6px', color: '#2d6a2d', fontSize: '0.85rem', fontWeight: 700 }}>
                      Pogledaj opcije
                      <svg width='14' height='14' viewBox='0 0 24 24' fill='none'
                        stroke='currentColor' strokeWidth='2.5'><path d='M5 12h14M12 5l7 7-7 7'/></svg>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Desna strelica */}
        <button onClick={() => scroll('right')} style={{ ...arrowStyle, right: '20px' }}>›</button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '28px' }}>
        <Link href='/products' style={{ display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: '#0e1a0e', color: '#fff', padding: '13px 32px',
          borderRadius: '999px', textDecoration: 'none', fontSize: '0.92rem', fontWeight: 700 }}>
          🎒 Sva oprema
          <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5'><path d='M5 12h14M12 5l7 7-7 7'/></svg>
        </Link>
      </div>
    </section>
  )
}