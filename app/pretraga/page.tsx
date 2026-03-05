import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { getCardPhoto } from '@/lib/getCategoryPhoto'

const SERIF = "'Fraunces','Playfair Display',Georgia,serif"
const SANS  = "'DM Sans',system-ui,sans-serif"

const CAT_COLORS: Record<string, string> = {
  ribolov:'#1d5fa8', lov:'#5a3010', kajak:'#0e7490',
  kampovanje:'#166534', planinarenje:'#5b21b6',
  'nacionalni-parkovi':'#0f766e', rezervati:'#0f766e'
}

const CAT_HERO: Record<string, string> = {
  ribolov:      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&h=600&fit=crop&q=80',
  lov:          'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=1600&h=600&fit=crop&q=80',
  kajak:        'https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?w=1600&h=600&fit=crop&q=80',
  kampovanje:   'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1600&h=600&fit=crop&q=80',
  planinarenje: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1600&h=600&fit=crop&q=80',
  'nacionalni-parkovi': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&h=600&fit=crop&q=80',
}
const DEFAULT_HERO = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&h=600&fit=crop&q=80'

export default async function SearchPage({
  searchParams
}: { searchParams: Promise<{ q?: string; cat?: string; region?: string }> }) {
  const { q = '', cat = '', region = '' } = await searchParams

  let query = supabase
    .from('locations')
    .select('id,name,slug,short_description,image_url,categories(name,slug,icon),regions(name),countries(name,slug)')
    .eq('is_published', true)
    .order('is_featured', { ascending: false })
    .limit(48)

  if (q) query = query.ilike('name', `%${q}%`)

  const { data: results } = await query
  const locs = (results ?? []) as any[]

  const filtered = cat
    ? locs.filter(l => l.categories?.slug === cat || (cat === 'nacionalni-parkovi' && l.categories?.slug === 'rezervati'))
    : locs

  const { data: categories } = await supabase
    .from('categories').select('id,name,slug,icon').eq('is_active', true)

  const heroImg = cat ? (CAT_HERO[cat] ?? DEFAULT_HERO) : DEFAULT_HERO
  const activeCat = (categories ?? []).find((c: any) => c.slug === cat || (cat === 'nacionalni-parkovi' && c.slug === 'rezervati')) as any

  return (
    <div style={{ fontFamily: SANS, background: '#f9f7f2', minHeight: '100vh' }}>

      {/* HERO HEADER — kao na homepage */}
      <section style={{ position: 'relative', height: '320px', overflow: 'hidden' }}>
        <img src={heroImg} alt="Pretraga"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }} />
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom,rgba(0,0,0,0.35) 0%,rgba(0,0,0,0.55) 100%)' }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex',
          flexDirection: 'column', justifyContent: 'flex-end', padding: '0 24px 32px' }}>
          <div style={{ maxWidth: '720px', margin: '0 auto', width: '100%' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '8px' }}>
              {activeCat ? `${activeCat.icon} ${activeCat.name === 'Rezervati' ? 'Nacionalni parkovi' : activeCat.name}` : 'Sve lokacije'}
            </p>
            <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(1.6rem,4vw,2.4rem)',
              fontWeight: 900, color: '#fff', marginBottom: '20px',
              textShadow: '0 2px 16px rgba(0,0,0,0.4)', lineHeight: 1.15 }}>
              {q ? `Rezultati za "${q}"` : activeCat ? `${activeCat.name === 'Rezervati' ? 'Nacionalni parkovi' : activeCat.name} — lokacije` : 'Pronađi svoju avanturu'}
            </h1>

            {/* Search bar */}
            <form action='/pretraga' method='GET' style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#fff',
                borderRadius: '999px', padding: '5px 5px 5px 18px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.25)', gap: '6px' }}>
                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='#8fa68f'
                  strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' style={{ flexShrink: 0 }}>
                  <circle cx='11' cy='11' r='8'/><path d='m21 21-4.35-4.35'/>
                </svg>
                <input name='q' defaultValue={q} type='search'
                  placeholder='Pretraži reke, planine, lovišta...'
                  style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none',
                    fontSize: '0.95rem', color: '#0e1a0e', background: 'transparent',
                    padding: '9px 0', fontFamily: 'inherit' }} />
                {cat && <input type='hidden' name='cat' value={cat} />}
                <button type='submit' style={{ background: '#2d6a2d', color: '#fff',
                  border: 'none', borderRadius: '999px', padding: '10px 20px',
                  fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer',
                  whiteSpace: 'nowrap', flexShrink: 0 }}>
                  Traži
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Wave */}
        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, zIndex: 15 }}>
          <svg viewBox='0 0 1440 40' preserveAspectRatio='none'
            style={{ display: 'block', width: '100%', height: '40px' }}>
            <path d='M0 40 C360 10 720 30 1080 15 C1260 8 1380 25 1440 20 L1440 40 Z' fill='#f9f7f2'/>
          </svg>
        </div>
      </section>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 20px 80px' }}>

        {/* Kategorije filter */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <Link href={`/pretraga${q ? `?q=${q}` : ''}`}
            style={{ padding: '7px 18px', borderRadius: '999px',
              border: `1.5px solid ${!cat ? '#2d6a2d' : '#e0dbd0'}`,
              background: !cat ? '#2d6a2d' : '#fff',
              color: !cat ? '#fff' : '#555',
              fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none',
              whiteSpace: 'nowrap' }}>
            Sve kategorije
          </Link>
          {(categories ?? []).map((c: any) => {
            const dispSlug = c.slug === 'rezervati' ? 'nacionalni-parkovi' : c.slug
            const dispName = c.slug === 'rezervati' ? 'Nacionalni parkovi' : c.name
            const isActive = cat === dispSlug
            const col = CAT_COLORS[dispSlug] ?? '#2d6a2d'
            return (
              <Link key={c.id}
                href={`/pretraga?cat=${dispSlug}${q ? `&q=${q}` : ''}`}
                style={{ padding: '7px 16px', borderRadius: '999px',
                  border: `1.5px solid ${isActive ? col : '#e0dbd0'}`,
                  background: isActive ? col : '#fff',
                  color: isActive ? '#fff' : '#555',
                  fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none',
                  display: 'flex', alignItems: 'center', gap: '5px',
                  whiteSpace: 'nowrap' }}>
                {c.icon} {dispName}
              </Link>
            )
          })}
        </div>

        {/* Broj rezultata */}
        <p style={{ color: '#8fa68f', fontSize: '0.82rem', marginBottom: '20px', fontWeight: 500 }}>
          {filtered.length === 0 ? 'Nema rezultata' :
            `${filtered.length} lokacija${q ? ` za "${q}"` : ''}${cat ? ` · ${activeCat?.name ?? cat}` : ''}`}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div style={{ display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '20px' }}>
            {filtered.map((loc: any) => {
              const cs  = loc.categories?.slug ?? ''
              const col = CAT_COLORS[cs] ?? '#2d6a2d'
              const dispCat = cs === 'rezervati' ? 'nacionalni-parkovi' : cs
              const photo = getCardPhoto(loc.slug, loc.image_url, cs)
              return (
                <Link key={loc.id}
                  href={`/${loc.countries?.slug ?? 'srbija'}/${dispCat}/${loc.slug}`}
                  style={{ textDecoration: 'none' }}>
                  <div className='loc-card' style={{ borderRadius: '18px', overflow: 'hidden',
                    background: '#fff', border: '1px solid #f0ede6',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s, box-shadow 0.2s' }}>
                    <div style={{ height: '190px', position: 'relative', background: col, overflow: 'hidden' }}>
                      <img src={photo} alt={loc.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top,rgba(0,0,0,0.45) 0%,transparent 55%)' }} />
                      <div style={{ position: 'absolute', bottom: '10px', left: '10px',
                        background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)',
                        color: '#fff', fontSize: '0.68rem', fontWeight: 600,
                        padding: '3px 10px', borderRadius: '999px' }}>
                        {loc.categories?.icon} {loc.categories?.name === 'Rezervati' ? 'Nacionalni parkovi' : loc.categories?.name}
                      </div>
                    </div>
                    <div style={{ padding: '14px 16px 18px' }}>
                      <p style={{ fontSize: '0.72rem', color: '#8fa68f', marginBottom: '4px' }}>
                        📍 {loc.regions?.name ?? 'Srbija'}
                      </p>
                      <h3 style={{ fontFamily: SERIF, fontSize: '1rem', fontWeight: 700,
                        color: '#0e1a0e', marginBottom: '6px', lineHeight: 1.3 }}>{loc.name}</h3>
                      <p style={{ fontSize: '0.82rem', color: '#8fa68f', lineHeight: 1.5,
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {loc.short_description}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🔍</div>
            <h2 style={{ fontFamily: SERIF, fontSize: '1.5rem', fontWeight: 700,
              color: '#0e1a0e', marginBottom: '10px' }}>Nema rezultata</h2>
            <p style={{ color: '#8fa68f', marginBottom: '24px' }}>
              Pokušaj sa drugim pojmom ili pogledaj sve lokacije.
            </p>
            <Link href='/pretraga' style={{ background: '#2d6a2d', color: '#fff',
              padding: '12px 28px', borderRadius: '999px',
              textDecoration: 'none', fontWeight: 700 }}>
              Sve lokacije
            </Link>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .loc-card:hover { transform: none !important; }
        }
        .loc-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important;
        }
      `}</style>
    </div>
  )
}
