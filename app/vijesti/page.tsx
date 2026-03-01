import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vesti iz prirode | OutdoorBalkans',
  description: 'Aktuelnosti iz sveta ribolova, lova, kampovanja i planinarenja na Balkanu.',
}

const NEWS = [
  { id: 1, title: 'Sezona ribolova 2025 — šta se menja',      excerpt: 'Nova regulativa o ribolovnim dozvolama stupa na snagu aprila.',       cat: '🎣 Ribolov',     date: '2025-03-15', slug: 'sezona-ribolova-2025',    img: 'https://images.unsplash.com/photo-1499803270242-467f7de285f8?w=800&h=500&fit=crop' },
  { id: 2, title: 'Novi eko-kamp na Tari otvara vrata',       excerpt: 'Kamp sa pogledom na kanjon Drine — rezervacije od aprila.',            cat: '⛺ Kampovanje',   date: '2025-03-10', slug: 'novi-kamp-tara',          img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=500&fit=crop' },
  { id: 3, title: 'Planinarenje na Kopaoniku — prolećni vodič', excerpt: 'Staze, uslovi i šta poneti u maju.',                                   cat: '🥾 Planinarenje', date: '2025-03-05', slug: 'kopaonik-prolece',         img: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=500&fit=crop' },
  { id: 4, title: 'Kajak na Uvcu — vodič za početnike',       excerpt: 'Sve što treba da znate pre prvog kajakaškog izleta.',                  cat: '🚣 Kajak',        date: '2025-02-28', slug: 'kajak-uvac-vodic',        img: 'https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?w=800&h=500&fit=crop' },
  { id: 5, title: 'Lovišta Fruške gore — prolećna sezona',    excerpt: 'Informacije o dozvolama, vrstama i najboljim mestima.',                 cat: '🦌 Lov',          date: '2025-02-20', slug: 'lovista-fruska-proljece', img: 'https://images.unsplash.com/photo-1560713781-d8b4b8b3c3a9?w=800&h=500&fit=crop' },
  { id: 6, title: 'Zasavica — prolećno buđenje prirode',      excerpt: 'Poseta Zasavici u martu i aprilu — ptice i divljač se vraćaju.',       cat: '🦋 Rezervati',    date: '2025-02-15', slug: 'zasavica-proljece',       img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=500&fit=crop' },
]

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('sr-Latn-RS', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function VjestiPage() {
  const [featured, ...rest] = NEWS

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: '#fff', minHeight: '100vh' }}>

      {/* ── HERO ─────────────────────────────── */}
      <section style={{ position: 'relative', height: '48vh', minHeight: '340px', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&h=900&fit=crop&q=85"
          alt="Vesti iz prirode"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 55%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(0,0,0,.22) 0%,rgba(0,0,0,.6) 100%)' }} />

        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', textAlign: 'center', padding: '0 24px 48px' }}>
          <nav style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '16px' }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,.7)', fontSize: '0.8rem', textDecoration: 'none' }}>Početna</Link>
            <span style={{ color: 'rgba(255,255,255,.35)' }}>/</span>
            <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>Vesti</span>
          </nav>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📰</div>
          <h1 style={{ fontFamily: "'Fraunces','Playfair Display',Georgia,serif", fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, color: '#fff', textShadow: '0 2px 20px rgba(0,0,0,.4)', lineHeight: 1.1, marginBottom: '10px' }}>
            Vesti iz prirode
          </h1>
          <p style={{ color: 'rgba(255,255,255,.85)', fontSize: '1rem' }}>
            Aktuelnosti o ribolovu, lovu, kampovanju i planinarenju
          </p>
        </div>

        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '60px' }}>
            <path d="M0 60 C480 10 960 50 1440 20 L1440 60 Z" fill="#fff"/>
          </svg>
        </div>
      </section>

      {/* ── CONTENT ──────────────────────────── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Featured — velika karta */}
        <Link href={`/vijesti/${featured.slug}`} className="loc-card" style={{ textDecoration: 'none', display: 'block', marginBottom: '40px' }}>
          <div style={{ borderRadius: '24px', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#fff', border: '1px solid #f0ede6', boxShadow: '0 4px 24px rgba(0,0,0,.08)', minHeight: '280px' }}>
            <div style={{ position: 'relative', minHeight: '280px' }}>
              <img src={featured.img} alt={featured.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,transparent 60%,rgba(0,0,0,.05))' }} />
            </div>
            <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2d6a2d', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                {featured.cat} · {fmtDate(featured.date)}
              </span>
              <h2 style={{ fontFamily: "'Fraunces','Playfair Display',Georgia,serif", fontSize: '1.6rem', fontWeight: 900, color: '#0e1a0e', lineHeight: 1.2, marginBottom: '14px' }}>
                {featured.title}
              </h2>
              <p style={{ color: '#8fa68f', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>{featured.excerpt}</p>
              <span style={{ color: '#2d6a2d', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Pročitaj više
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
          </div>
        </Link>

        <h2 style={{ fontFamily: "'Fraunces','Playfair Display',Georgia,serif", fontSize: '1.5rem', fontWeight: 700, color: '#0e1a0e', marginBottom: '24px' }}>
          Sve vesti
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '24px' }}>
          {rest.map(n => (
            <Link key={n.id} href={`/vijesti/${n.slug}`} className="loc-card" style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{ borderRadius: '18px', overflow: 'hidden', background: '#fff', border: '1px solid #f0ede6', boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
                <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                  <img src={n.img} alt={n.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,.3) 0%,transparent 60%)' }} />
                </div>
                <div style={{ padding: '18px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2d6a2d', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{n.cat}</span>
                  <h3 style={{ fontFamily: "'Fraunces','Playfair Display',Georgia,serif", fontSize: '1rem', fontWeight: 700, color: '#0e1a0e', margin: '8px 0', lineHeight: 1.3 }}>{n.title}</h3>
                  <p style={{ fontSize: '0.82rem', color: '#8fa68f', lineHeight: 1.5 }}>{n.excerpt}</p>
                  <p style={{ fontSize: '0.75rem', color: '#bbb', marginTop: '10px' }}>{fmtDate(n.date)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
