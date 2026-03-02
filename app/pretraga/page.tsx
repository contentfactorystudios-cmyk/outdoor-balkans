import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const SERIF = "'Fraunces','Playfair Display',Georgia,serif"
const SANS  = "'DM Sans',system-ui,sans-serif"

const CAT_COLORS: Record<string, string> = {
  ribolov:'#1d5fa8', lov:'#5a3010', kajak:'#0e7490',
  kampovanje:'#166534', planinarenje:'#5b21b6',
  'nacionalni-parkovi':'#0f766e', rezervati:'#0f766e'
}

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
  if (region) query = query.eq('regions.name', region)

  const { data: results } = await query
  const locs = (results ?? []) as any[]

  const filtered = cat
    ? locs.filter(l => l.categories?.slug === cat || (cat === 'nacionalni-parkovi' && l.categories?.slug === 'rezervati'))
    : locs

  const { data: categories } = await supabase
    .from('categories').select('id,name,slug,icon').eq('is_active', true)

  return (
    <div style={{ fontFamily: SANS, background: '#f9f7f2', minHeight: '100vh' }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg,#1e3d1e 0%,#2d6a2d 100%)',
        padding: '80px 24px 40px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ color: '#6ab87a', fontSize: '0.78rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '12px' }}>
            OutdoorBalkans
          </p>
          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(1.8rem,3vw,2.8rem)',
            fontWeight: 900, color: '#fff', marginBottom: '24px' }}>
            🔍 Pretraga lokacija
          </h1>
          <form action='/pretraga' method='GET'>
            <div style={{ display: 'flex', background: '#fff', borderRadius: '999px',
              padding: '6px 6px 6px 20px', gap: '8px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
              <input name='q' defaultValue={q} type='search'
                placeholder='Pretraži lokacije, reke, planine...'
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '1rem',
                  color: '#0e1a0e', background: 'transparent', padding: '10px 0',
                  fontFamily: 'inherit' }} />
              {cat && <input type='hidden' name='cat' value={cat} />}
              <button type='submit' style={{ background: '#2d6a2d', color: '#fff',
                border: 'none', borderRadius: '999px', padding: '12px 28px',
                fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer' }}>
                Traži
              </button>
            </div>
          </form>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px 80px' }}>

        {/* Filter kategorije */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
          <Link href={`/pretraga${q ? `?q=${q}` : ''}`}
            style={{ padding: '6px 16px', borderRadius: '999px', border: '1.5px solid',
              borderColor: !cat ? '#2d6a2d' : '#e8e2d4',
              background: !cat ? '#2d6a2d' : '#fff',
              color: !cat ? '#fff' : '#555',
              fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}>
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
                style={{ padding: '6px 16px', borderRadius: '999px', border: '1.5px solid',
                  borderColor: isActive ? col : '#e8e2d4',
                  background: isActive ? col : '#fff',
                  color: isActive ? '#fff' : '#555',
                  fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none',
                  display: 'flex', alignItems: 'center', gap: '5px' }}>
                {c.icon} {dispName}
              </Link>
            )
          })}
        </div>

        {/* Rezultati info */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
          <p style={{ color: '#8fa68f', fontSize: '0.85rem' }}>
            {filtered.length === 0 ? 'Nema rezultata' :
              `${filtered.length} lokacija${q ? ` za "${q}"` : ''}${cat ? ` · ${cat}` : ''}`}
          </p>
        </div>

        {filtered.length > 0 ? (
          <div style={{ display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '20px' }}>
            {filtered.map((loc: any) => {
              const cs  = loc.categories?.slug ?? ''
              const col = CAT_COLORS[cs] ?? '#2d6a2d'
              const dispCat = cs === 'rezervati' ? 'nacionalni-parkovi' : cs
              return (
                <Link key={loc.id}
                  href={`/${loc.countries?.slug ?? 'srbija'}/${dispCat}/${loc.slug}`}
                  style={{ textDecoration: 'none' }}>
                  <div className='loc-card' style={{ borderRadius: '18px', overflow: 'hidden',
                    background: '#fff', border: '1px solid #f0ede6',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s, box-shadow 0.2s' }}>
                    <div style={{ height: '190px', position: 'relative', background: col, overflow: 'hidden' }}>
                      {loc.image_url ? (
                        <img src={loc.image_url} alt={loc.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%',
                          background: `linear-gradient(135deg,${col}dd 0%,${col}66 100%)`,
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: '3rem' }}>
                          {loc.categories?.icon ?? '📍'}
                        </div>
                      )}
                      <div style={{ position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top,rgba(0,0,0,0.45) 0%,transparent 55%)' }} />
                      <div style={{ position: 'absolute', bottom: '10px', left: '10px',
                        background: col, color: '#fff',
                        fontSize: '0.68rem', fontWeight: 700,
                        padding: '3px 10px', borderRadius: '999px' }}>
                        {loc.categories?.icon} {loc.categories?.name === 'Rezervati' ? 'Nacionalni parkovi' : loc.categories?.name}
                      </div>
                    </div>
                    <div style={{ padding: '14px 16px 18px' }}>
                      <p style={{ fontSize: '0.72rem', color: '#8fa68f',
                        marginBottom: '4px' }}>📍 {loc.regions?.name ?? 'Srbija'}</p>
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
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
            <h2 style={{ fontFamily: SERIF, fontSize: '1.6rem', fontWeight: 700,
              color: '#0e1a0e', marginBottom: '12px' }}>Nema rezultata</h2>
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
    </div>
  )
}
