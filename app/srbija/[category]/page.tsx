import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const SERIF = "'Fraunces','Playfair Display',Georgia,serif"
const CAT_META: Record<string, { title: string; hero: string; color: string; desc: string }> = {
  ribolov:      { title: 'Ribolov',      color: '#1d5fa8',
    desc: 'Ribolovna mesta, reke i jezera Balkana.',
    hero: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=800&fit=crop&q=85' },
  lov:          { title: 'Lov',          color: '#5a3010',
    desc: 'Lovišta i lovačka područja Srbije.',
    hero: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=1920&h=800&fit=crop&q=85' },
  kajak:        { title: 'Kajak',        color: '#0e7490',
    desc: 'Kajak rute i divlja voda Balkana.',
    hero: 'https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?w=1920&h=800&fit=crop&q=85' },
  kampovanje:   { title: 'Kampovanje',   color: '#166534',
    desc: 'Kampovi i divlja natura Srbije.',
    hero: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920&h=800&fit=crop&q=85' },
  planinarenje: { title: 'Planinarenje', color: '#5b21b6',
    desc: 'Planinarske staze i vrhovi.',
    hero: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&h=800&fit=crop&q=85' },
  rezervati:    { title: 'Rezervati',    color: '#0f766e',
    desc: 'Zaštićena prirodna područja.',
    hero: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=800&fit=crop&q=85' },
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string }
}) {
  const slug = params.category
  const meta = CAT_META[slug]
  if (!meta) notFound()

  const { data: locations } = await supabase
    .from('locations')
    .select('id,name,slug,short_description,image_url,regions(name),countries(name,slug)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(20)

  const locs = (locations ?? []) as any[]

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: '#fff' }}>

      {/* HERO */}
      <section style={{ position: 'relative', height: '55vh', minHeight: '380px', overflow: 'hidden' }}>
        <img src={meta.hero} alt={meta.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }} />
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom,rgba(0,0,0,0.1) 0%,rgba(0,0,0,0.6) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
          <h1 style={{ fontFamily: SERIF,
            fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 900, color: '#fff',
            textShadow: '0 2px 20px rgba(0,0,0,0.4)', marginBottom: '12px' }}>
            {meta.title}
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
      <section style={{ padding: '48px 24px 72px', maxWidth: '1200px', margin: '0 auto' }}>
        {locs.length > 0 ? (
          <div style={{ display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '24px' }}>
            {locs.map((loc: any) => (
              <Link key={loc.id}
                href={'/' + (loc.countries?.slug ?? 'srbija') + '/' + slug + '/' + loc.slug}
                style={{ textDecoration: 'none', display: 'block' }}>
                <div className='loc-card' style={{ borderRadius: '16px', overflow: 'hidden',
                  background: '#fff', border: '1px solid #f0ede6',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                  <div style={{ height: '200px', overflow: 'hidden', position: 'relative',
                    background: meta.color }}>
                    {loc.image_url ? (
                      <img src={loc.image_url} alt={loc.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <img src={meta.hero.replace('1920&h=800', '400&h=280')} alt={meta.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
                    )}
                    <div style={{ position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top,rgba(0,0,0,0.4) 0%,transparent 55%)' }} />
                  </div>
                  <div style={{ padding: '14px 16px 16px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#8fa68f', marginBottom: '4px' }}>
                      {loc.regions?.name ?? 'Srbija'}
                    </div>
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
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🗺️</div>
            <h2 style={{ fontFamily: SERIF, fontSize: '1.5rem', fontWeight: 700,
              color: '#0e1a0e', marginBottom: '10px' }}>
              Prve lokacije uskoro
            </h2>
            <p style={{ color: '#8fa68f', marginBottom: '24px' }}>
              Budi prvi koji će dodati lokaciju za {meta.title.toLowerCase()}.
            </p>
            <Link href='/predlozi-lokaciju'
              style={{ background: '#2d6a2d', color: '#fff',
                padding: '12px 28px', borderRadius: '999px',
                textDecoration: 'none', fontWeight: 700 }}>
              + Predloži lokaciju
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}