import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Outdoor oprema | OutdoorBalkans Shop',
  description: 'Odabrana oprema za ribolov, lov, kampovanje i planinarenje. Kupuj sa poverenjem.',
}

const CATS = [
  { slug: 'ribolov',      name: 'Ribolov',      icon: '🎣', desc: 'Štapovi, mamci, vobleri, oprema',     color: '#1d5fa8', img: 'https://images.unsplash.com/photo-1499803270242-467f7de285f8?w=600&h=400&fit=crop' },
  { slug: 'lov',          name: 'Lov',           icon: '🦌', desc: 'Optika, odjeća, pribor za lov',       color: '#8b4513', img: 'https://images.unsplash.com/photo-1560713781-d8b4b8b3c3a9?w=600&h=400&fit=crop' },
  { slug: 'kampovanje',   name: 'Kampovanje',    icon: '⛺', desc: 'Šatori, vreće za spavanje, kuhinja',  color: '#166534', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&h=400&fit=crop' },
  { slug: 'planinarenje', name: 'Planinarenje',  icon: '🥾', desc: 'Penjačka oprema, čizme, ranci',      color: '#5b21b6', img: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop' },
  { slug: 'kajak',        name: 'Kajak & Voda',  icon: '🚣', desc: 'Kajaci, vesla, prsluci, neopreni',   color: '#0e7490', img: 'https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?w=600&h=400&fit=crop' },
  { slug: 'navigacija',   name: 'GPS & Optika',  icon: '🧭', desc: 'GPS uređaji, dalekozori, kompasi',   color: '#374151', img: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=600&h=400&fit=crop' },
]

const FEATURED = [
  { id: 1, name: 'Shimano Baitrunner DL',    cat: 'ribolov',      price: '8.990 RSD', badge: '⭐ Bestseler', img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', slug: 'shimano-baitrunner-dl' },
  { id: 2, name: 'Coleman Montana Šator 4',  cat: 'kampovanje',   price: '22.500 RSD', badge: '🔥 Popularno', img: 'https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?w=400&h=300&fit=crop', slug: 'coleman-montana-4' },
  { id: 3, name: 'Salomon X Ultra 4 GTX',    cat: 'planinarenje', price: '18.200 RSD', badge: '✅ Preporučeno', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop', slug: 'salomon-x-ultra-4-gtx' },
  { id: 4, name: 'Garmin eTrex 32x GPS',     cat: 'navigacija',   price: '16.800 RSD', badge: '🏆 Top izbor',  img: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&h=300&fit=crop', slug: 'garmin-etrex-32x' },
]

export default function ProductsPage() {
  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: '#fff', minHeight: '100vh' }}>

      {/* ── HERO ─────────────────────────────── */}
      <section style={{ position: 'relative', height: '45vh', minHeight: '320px', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=1600&h=900&fit=crop&q=85"
          alt="Outdoor oprema"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(0,0,0,.25) 0%,rgba(0,0,0,.6) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', textAlign: 'center', padding: '0 24px 48px' }}>
          <nav style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '16px' }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,.7)', fontSize: '0.8rem', textDecoration: 'none' }}>Početna</Link>
            <span style={{ color: 'rgba(255,255,255,.35)' }}>/</span>
            <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>Oprema</span>
          </nav>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🎒</div>
          <h1 style={{ fontFamily: "'Fraunces','Playfair Display',Georgia,serif", fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, color: '#fff', textShadow: '0 2px 20px rgba(0,0,0,.4)', lineHeight: 1.1, marginBottom: '10px' }}>
            Outdoor Oprema
          </h1>
          <p style={{ color: 'rgba(255,255,255,.85)', fontSize: '1rem' }}>Odabrana oprema za svaku avanturu</p>
        </div>
        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '60px' }}>
            <path d="M0 60 C480 10 960 50 1440 20 L1440 60 Z" fill="#fff"/>
          </svg>
        </div>
      </section>

      {/* ── KATEGORIJE ───────────────────────── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 0' }}>
        <h2 style={{ fontFamily: "'Fraunces','Playfair Display',Georgia,serif", fontSize: '1.6rem', fontWeight: 700, color: '#0e1a0e', marginBottom: '24px' }}>
          Pretraži po kategoriji
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '16px', marginBottom: '56px' }}>
          {CATS.map(c => (
            <Link key={c.slug} href={`/products/${c.slug}`} className="loc-card" style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#fff', border: '1px solid #f0ede6', boxShadow: '0 2px 8px rgba(0,0,0,.05)' }}>
                <div style={{ height: '120px', overflow: 'hidden', position: 'relative', background: c.color }}>
                  <img src={c.img} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,.4) 0%,transparent 60%)' }} />
                  <span style={{ position: 'absolute', bottom: '8px', left: '10px', fontSize: '1.5rem' }}>{c.icon}</span>
                </div>
                <div style={{ padding: '12px 14px' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0e1a0e', marginBottom: '2px' }}>{c.name}</p>
                  <p style={{ fontSize: '0.75rem', color: '#8fa68f' }}>{c.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── ISTAKNUTI PROIZVODI ───────────────── */}
        <h2 style={{ fontFamily: "'Fraunces','Playfair Display',Georgia,serif", fontSize: '1.6rem', fontWeight: 700, color: '#0e1a0e', marginBottom: '24px' }}>
          ⭐ Istaknuti proizvodi
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: '24px', marginBottom: '60px' }}>
          {FEATURED.map(p => (
            <Link key={p.id} href={`/products/${p.cat}/${p.slug}`} className="loc-card" style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{ borderRadius: '18px', overflow: 'hidden', background: '#fff', border: '1px solid #f0ede6', boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
                <div style={{ height: '200px', overflow: 'hidden', position: 'relative', background: '#f4f0e6' }}>
                  <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: '0.68rem', fontWeight: 700, padding: '3px 10px', borderRadius: '999px' }}>
                    {p.badge}
                  </span>
                </div>
                <div style={{ padding: '16px' }}>
                  <p style={{ fontSize: '0.72rem', color: '#8fa68f', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>{p.cat}</p>
                  <h3 style={{ fontFamily: "'Fraunces','Playfair Display',Georgia,serif", fontSize: '1rem', fontWeight: 700, color: '#0e1a0e', marginBottom: '10px', lineHeight: 1.3 }}>{p.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#2d6a2d' }}>{p.price}</span>
                    <span style={{ background: 'linear-gradient(135deg,#2d6a2d,#1a7a3a)', color: '#fff', fontSize: '0.78rem', fontWeight: 700, padding: '7px 16px', borderRadius: '999px' }}>
                      Kupi →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Info baner */}
        <div style={{ background: 'linear-gradient(135deg,#f4f0e6 0%,#e8f5e9 100%)', borderRadius: '20px', padding: '40px', textAlign: 'center', marginBottom: '60px', border: '1px solid #e0e8e0' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🚚</div>
          <h3 style={{ fontFamily: "'Fraunces','Playfair Display',Georgia,serif", fontSize: '1.3rem', fontWeight: 900, color: '#0e1a0e', marginBottom: '8px' }}>
            Besplatna dostava od 5.000 RSD
          </h3>
          <p style={{ color: '#5a7a6a', fontSize: '0.95rem', maxWidth: '40ch', margin: '0 auto' }}>
            Sve narudžbine isporučujemo na kućnu adresu. Povrat do 14 dana bez pitanja.
          </p>
        </div>
      </section>
    </div>
  )
}
