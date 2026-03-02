import { getCardPhoto } from '@/lib/getCategoryPhoto'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const SERIF = "'Fraunces','Playfair Display',Georgia,serif"
const SANS  = "'DM Sans',system-ui,sans-serif"

const CAT_META: Record<string, { title: string; color: string; desc: string; hero: string; icon: string }> = {
  ribolov:           { title: 'Ribolov',           color: '#1d5fa8', icon: '🎣',
    desc: 'Ribolovna mesta, reke i jezera Balkana.',
    hero: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&h=800&fit=crop&q=85' },
  lov:               { title: 'Lov',               color: '#5a3010', icon: '🦌',
    desc: 'Lovišta i lovačka područja Srbije.',
    hero: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=1920&h=800&fit=crop&q=85' },
  kajak:             { title: 'Kajak',             color: '#0e7490', icon: '🚣',
    desc: 'Kajak rute i divlja voda Balkana.',
    hero: 'https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?w=1920&h=800&fit=crop&q=85' },
  kampovanje:        { title: 'Kampovanje',        color: '#166534', icon: '⛺',
    desc: 'Kampovi i divlja natura Srbije.',
    hero: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920&h=800&fit=crop&q=85' },
  planinarenje:      { title: 'Planinarenje',      color: '#5b21b6', icon: '🥾',
    desc: 'Planinarske staze i vrhovi.',
    hero: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&h=800&fit=crop&q=85' },
  'nacionalni-parkovi': { title: 'Nacionalni parkovi', color: '#0f766e', icon: '🦋',
    desc: 'Nacionalni parkovi i zaštićena prirodna područja.',
    hero: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=800&fit=crop&q=85' },
}

export default async function CategoryPage({
  params,
}: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params
  const meta = CAT_META[slug]
  if (!meta) notFound()

  // Dohvati category_id
  const { data: catRow } = await supabase
    .from('categories')
    .select('id,name')
    .or(`slug.eq.${slug},slug.eq.${slug === 'nacionalni-parkovi' ? 'rezervati' : slug}`)
    .maybeSingle()

  // Sve lokacije pa JS filter (zaobilazi Supabase join bug)
  const { data: allLocs } = await supabase
    .from('locations')
    .select('id,name,slug,short_description,image_url,category_id,regions(name),countries(name,slug),categories(id,name,slug,icon)')
    .eq('is_published', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })

  const locs = ((allLocs ?? []) as any[]).filter(l => {
    if (catRow?.id && l.category_id === catRow.id) return true
    const cs = l.categories?.slug ?? ''
    if (cs === slug) return true
    if (slug === 'nacionalni-parkovi' && cs === 'rezervati') return true
    return false
  })

  return (
    <div style={{ fontFamily: SANS, background: '#fff', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ position: 'relative', height: '55vh', minHeight: '380px', overflow: 'hidden' }}>
        <img src={meta.hero} alt={meta.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }} />
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.68) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          padding: '80px 24px 0' }}>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '12px' }}>
            Srbija · Outdoor
          </p>
          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(2.8rem,6vw,5rem)',
            fontWeight: 900, color: '#fff',
            textShadow: '0 2px 20px rgba(0,0,0,0.4)', marginBottom: '14px' }}>
            {meta.icon} {meta.title}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', maxWidth: '42ch' }}>
            {meta.desc}
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '28px', flexWrap: 'wrap',
            justifyContent: 'center' }}>
            <Link href='/pretraga'
              style={{ background: '#fff', color: '#0e1a0e', padding: '10px 24px',
                borderRadius: '999px', textDecoration: 'none', fontSize: '0.9rem',
                fontWeight: 700, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
              🔍 Pretraži
            </Link>
            <Link href='/predlozi-lokaciju'
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff',
                padding: '10px 24px', borderRadius: '999px', textDecoration: 'none',
                fontSize: '0.9rem', fontWeight: 600,
                border: '1.5px solid rgba(255,255,255,0.4)' }}>
              + Predloži lokaciju
            </Link>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0 }}>
          <svg viewBox='0 0 1440 60' preserveAspectRatio='none'
            style={{ display: 'block', width: '100%', height: '60px' }}>
            <path d='M0 60 C480 20 960 50 1440 30 L1440 60 Z' fill='#fff'/>
          </svg>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ background: '#f9f7f2', padding: '20px 24px',
        borderBottom: '1px solid #f0ede6' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto',
          display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontSize: '1.4rem' }}>{meta.icon}</span>
            <div>
              <span style={{ fontFamily: SERIF, fontSize: '1.3rem', fontWeight: 900,
                color: meta.color }}>{locs.length}</span>
              <span style={{ fontSize: '0.82rem', color: '#8fa68f', marginLeft: '6px' }}>
                {locs.length === 1 ? 'lokacija' : 'lokacija'}
              </span>
            </div>
          </div>
          <div style={{ height: '32px', width: '1px', background: '#e8e2d4' }} />
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Srbija', 'Vojvodina', 'Šumadija', 'Zlatibor'].map(r => (
              <Link key={r} href={`/pretraga?region=${r.toLowerCase()}&cat=${slug}`}
                style={{ fontSize: '0.8rem', color: '#666', padding: '4px 12px',
                  borderRadius: '999px', border: '1px solid #e8e2d4',
                  textDecoration: 'none', background: '#fff' }}>
                {r}
              </Link>
            ))}
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Link href='/predlozi-lokaciju'
              style={{ background: meta.color, color: '#fff', padding: '9px 20px',
                borderRadius: '999px', textDecoration: 'none',
                fontSize: '0.85rem', fontWeight: 700 }}>
              + Predloži
            </Link>
          </div>
        </div>
      </section>

      {/* LOKACIJE GRID */}
      <section style={{ padding: '48px 24px 80px', maxWidth: '1200px', margin: '0 auto' }}>
        {locs.length > 0 ? (
          <div style={{ display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '24px' }}>
            {locs.map((loc: any, idx: number) => (
              <Link key={loc.id}
                href={'/' + (loc.countries?.slug ?? 'srbija') + '/' + slug + '/' + loc.slug}
                style={{ textDecoration: 'none', display: 'block' }}>
                <div className='loc-card' style={{ borderRadius: '20px', overflow: 'hidden',
                  background: '#fff', border: '1px solid #f0ede6',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                  transition: 'transform 0.2s, box-shadow 0.2s' }}>
                  {/* Slika */}
                  <div style={{ height: '220px', overflow: 'hidden',
                    position: 'relative', background: meta.color }}>
                    <img src={getCardPhoto(loc.slug, loc.image_url, slug)}
                      alt={loc.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover',
                        transition: 'transform 0.4s' }} />
                    <div style={{ position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)' }} />
                    {/* Broj */}
                    <div style={{ position: 'absolute', top: '12px', left: '12px',
                      width: '28px', height: '28px', borderRadius: '8px',
                      background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)',
                      color: '#fff', fontSize: '0.72rem', fontWeight: 800,
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {idx + 1}
                    </div>
                    {/* Region tag */}
                    <div style={{ position: 'absolute', bottom: '10px', left: '10px',
                      background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)',
                      color: '#fff', fontSize: '0.7rem', fontWeight: 600,
                      padding: '3px 10px', borderRadius: '999px' }}>
                      📍 {loc.regions?.name ?? 'Srbija'}
                    </div>
                  </div>
                  {/* Sadržaj */}
                  <div style={{ padding: '16px 18px 20px' }}>
                    <h3 style={{ fontFamily: SERIF, fontSize: '1.05rem', fontWeight: 700,
                      color: '#0e1a0e', marginBottom: '7px', lineHeight: 1.3 }}>
                      {loc.name}
                    </h3>
                    <p style={{ fontSize: '0.83rem', color: '#8fa68f', lineHeight: 1.55,
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {loc.short_description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f0ede6' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: meta.color }}>
                        {meta.icon} {meta.title}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#aaa',
                        display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Detalji
                        <svg width='12' height='12' viewBox='0 0 24 24' fill='none'
                          stroke='currentColor' strokeWidth='2.5'>
                          <path d='M5 12h14M12 5l7 7-7 7'/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: '5rem', marginBottom: '20px' }}>{meta.icon}</div>
            <h2 style={{ fontFamily: SERIF, fontSize: '1.8rem', fontWeight: 700,
              color: '#0e1a0e', marginBottom: '12px' }}>
              Prve lokacije uskoro
            </h2>
            <p style={{ color: '#8fa68f', marginBottom: '4px', fontSize: '0.9rem' }}>
              Kategorija: <strong>{catRow?.name ?? slug}</strong> (ID: {catRow?.id ?? 'nije pronađen'})
            </p>
            <Link href='/predlozi-lokaciju'
              style={{ display: 'inline-block', marginTop: '24px',
                background: meta.color, color: '#fff', padding: '14px 36px',
                borderRadius: '999px', textDecoration: 'none',
                fontWeight: 700, fontSize: '0.95rem' }}>
              + Predloži prvu lokaciju
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
