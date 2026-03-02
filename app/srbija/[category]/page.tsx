import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const SERIF = "'Fraunces','Playfair Display',Georgia,serif"

const CAT_META: Record<string, { title: string; color: string; desc: string; hero: string; icon: string }> = {
  ribolov:      { title: 'Ribolov',      color: '#1d5fa8', icon: '🎣',
    desc: 'Ribolovna mesta, reke i jezera Balkana.',
    hero: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&h=800&fit=crop&q=85' },
  lov:          { title: 'Lov',          color: '#5a3010', icon: '🦌',
    desc: 'Lovišta i lovačka područja Srbije.',
    hero: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=1920&h=800&fit=crop&q=85' },
  kajak:        { title: 'Kajak',        color: '#0e7490', icon: '🚣',
    desc: 'Kajak rute i divlja voda Balkana.',
    hero: 'https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?w=1920&h=800&fit=crop&q=85' },
  kampovanje:   { title: 'Kampovanje',   color: '#166534', icon: '⛺',
    desc: 'Kampovi i divlja natura Srbije.',
    hero: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920&h=800&fit=crop&q=85' },
  planinarenje: { title: 'Planinarenje', color: '#5b21b6', icon: '🥾',
    desc: 'Planinarske staze i vrhovi.',
    hero: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&h=800&fit=crop&q=85' },
  rezervati:    { title: 'Rezervati',    color: '#0f766e', icon: '🦋',
    desc: 'Zaštićena prirodna područja.',
    hero: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=800&fit=crop&q=85' },
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category: slug } = await params
  const meta = CAT_META[slug]
  if (!meta) notFound()

  // Korak 1: dohvati category_id po slug-u
  const { data: catRow } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', slug)
    .single()

  // Korak 2: dohvati lokacije filtrirane po category_id
  const { data: locations } = catRow
    ? await supabase
        .from('locations')
        .select('id,name,slug,short_description,image_url,image_urls,regions(name),countries(name,slug)')
        .eq('is_published', true)
        .eq('category_id', catRow.id)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(24)
    : { data: [] }

  const locs = (locations ?? []) as any[]

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: '#fff' }}>

      {/* HERO */}
      <section style={{ position: 'relative', height: '55vh', minHeight: '380px', overflow: 'hidden' }}>
        <img src={meta.hero} alt={meta.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }} />
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom,rgba(0,0,0,0.1) 0%,rgba(0,0,0,0.62) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 24px 0' }}>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '12px' }}>
            Srbija · Outdoor
          </p>
          <h1 style={{ fontFamily: SERIF,
            fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 900, color: '#fff',
            textShadow: '0 2px 20px rgba(0,0,0,0.4)', marginBottom: '14px' }}>
            {meta.icon} {meta.title}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', maxWidth: '42ch' }}>
            {meta.desc}
          </p>
        </div>
        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0 }}>
          <svg viewBox='0 0 1440 60' preserveAspectRatio='none'
            style={{ display: 'block', width: '100%', height: '60px' }}>
            <path d='M0 60 C480 20 960 50 1440 30 L1440 60 Z' fill='#fff'/>
          </svg>
        </div>
      </section>

      {/* LOKACIJE */}
      <section style={{ padding: '40px 24px 72px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <p style={{ color: '#8fa68f', fontSize: '0.78rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px' }}>
              {locs.length} {locs.length === 1 ? 'lokacija' : locs.length < 5 ? 'lokacije' : 'lokacija'}
            </p>
            <h2 style={{ fontFamily: SERIF, fontSize: '1.4rem', fontWeight: 700, color: '#0e1a0e' }}>
              Sve lokacije — {meta.title}
            </h2>
          </div>
          <Link href='/predlozi-lokaciju'
            style={{ background: '#2d6a2d', color: '#fff', padding: '10px 22px',
              borderRadius: '999px', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 700 }}>
            + Predloži lokaciju
          </Link>
        </div>

        {locs.length > 0 ? (
          <div style={{ display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '24px' }}>
            {locs.map((loc: any) => {
              const imgSrc = loc.image_url || (Array.isArray(loc.image_urls) && loc.image_urls[0])
              return (
                <Link key={loc.id}
                  href={'/' + (loc.countries?.slug ?? 'srbija') + '/' + slug + '/' + loc.slug}
                  style={{ textDecoration: 'none', display: 'block' }}>
                  <div className='loc-card' style={{ borderRadius: '16px', overflow: 'hidden',
                    background: '#fff', border: '1px solid #f0ede6',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.05)', transition: 'transform 0.2s, box-shadow 0.2s' }}>
                    <div style={{ height: '210px', overflow: 'hidden', position: 'relative',
                      background: meta.color }}>
                      {imgSrc ? (
                        <img src={imgSrc} alt={loc.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%',
                          background: `linear-gradient(135deg, ${meta.color}ee 0%, ${meta.color}88 100%)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '4rem' }}>
                          {meta.icon}
                        </div>
                      )}
                      <div style={{ position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top,rgba(0,0,0,0.45) 0%,transparent 55%)' }} />
                      <div style={{ position: 'absolute', bottom: '10px', left: '10px',
                        background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)',
                        color: '#fff', fontSize: '0.7rem', fontWeight: 600,
                        padding: '3px 10px', borderRadius: '999px' }}>
                        {loc.regions?.name ?? 'Srbija'}
                      </div>
                    </div>
                    <div style={{ padding: '14px 16px 18px' }}>
                      <h3 style={{ fontFamily: SERIF, fontSize: '1rem', fontWeight: 700,
                        color: '#0e1a0e', marginBottom: '6px', lineHeight: 1.3 }}>
                        {loc.name}
                      </h3>
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
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>{meta.icon}</div>
            <h2 style={{ fontFamily: SERIF, fontSize: '1.6rem', fontWeight: 700,
              color: '#0e1a0e', marginBottom: '12px' }}>
              Prve lokacije uskoro
            </h2>
            <p style={{ color: '#8fa68f', marginBottom: '28px', fontSize: '1rem' }}>
              Budi prvi koji će dodati lokaciju za {meta.title.toLowerCase()} u Srbiji.
            </p>
            <Link href='/predlozi-lokaciju'
              style={{ background: '#2d6a2d', color: '#fff',
                padding: '14px 32px', borderRadius: '999px',
                textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem' }}>
              + Predloži lokaciju
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
