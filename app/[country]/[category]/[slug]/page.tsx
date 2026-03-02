// weather-added
import { getLocationBySlug, extractCoordinates } from '@/lib/queries'
import { getLocationPhoto } from '@/lib/getLocationPhoto'
import ShareButtons    from '@/components/ShareButtons'
import ReactionsBar    from '@/components/ReactionsBar'
import WeatherWidget   from '@/components/WeatherWidget'
import CommentsSection from '@/components/CommentsSection'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 86400

const SERIF = "'Fraunces','Playfair Display',Georgia,serif"
const SANS  = "'DM Sans',system-ui,sans-serif"

const CAT_META: Record<string, { color: string; icon: string; label: string }> = {
  ribolov:             { color: '#1d5fa8', icon: '🎣', label: 'Ribolov' },
  lov:                 { color: '#5a3010', icon: '🦌', label: 'Lov' },
  kajak:               { color: '#0e7490', icon: '🚣', label: 'Kajak' },
  kampovanje:          { color: '#166534', icon: '⛺', label: 'Kampovanje' },
  planinarenje:        { color: '#5b21b6', icon: '🥾', label: 'Planinarenje' },
  'nacionalni-parkovi':{ color: '#0f766e', icon: '🦋', label: 'Nacionalni parkovi' },
  rezervati:           { color: '#0f766e', icon: '🦋', label: 'Nacionalni parkovi' },
}

interface Props {
  params: Promise<{ country: string; category: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { country, category, slug } = await params
    const location = await getLocationBySlug(country, category, slug)
    if (!location) return {}
    return {
      title:       location.meta_title       ?? location.name,
      description: location.meta_description ?? location.short_description ?? '',
      openGraph: {
        title:       location.meta_title       ?? location.name,
        description: location.meta_description ?? location.short_description ?? '',
        images:      location.image_url ? [{ url: location.image_url }] : [],
      },
    }
  } catch { return {} }
}

export default async function LocationPage({ params }: Props) {
  const { country, category: rawCategory, slug } = await params
  if (rawCategory === 'rezervati') redirect('/srbija/nacionalni-parkovi/' + slug)
  const category = rawCategory

  const location = await getLocationBySlug(country, category, slug)
  if (!location) notFound()

  const coords  = extractCoordinates(location.coordinates)
  const pageUrl = `https://outdoorbalkans.com/${country}/${category}/${slug}`
  const lat     = coords?.lat ?? 0
  const lng     = coords?.lng ?? 0
  const catMeta = CAT_META[category] ?? { color: '#2d6a2d', icon: '📍', label: category }

  // Hero slika — pokušaj Wikipedia/Commons/Mapbox/Category
  const photoResult = await getLocationPhoto({
    imageUrl: location.image_url,
    locationName: location.name,
    category,
    lat: coords?.lat,
    lng: coords?.lng,
  })
  const heroImg = photoResult.url

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

  return (
    <div style={{ fontFamily: SANS, background: '#fff', minHeight: '100vh' }}>

      {/* ═══ HERO ═══ */}
      <section style={{ position: 'relative', height: '62vh', minHeight: '420px', overflow: 'hidden' }}>
        {heroImg ? (
          <img src={heroImg} alt={location.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }} />
        ) : (
          <div style={{ width: '100%', height: '100%',
            background: `linear-gradient(135deg, ${catMeta.color}ee 0%, ${catMeta.color}88 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem' }}>
            {catMeta.icon}
          </div>
        )}

        {/* Overlay */}
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.72) 100%)' }} />

        {/* Breadcrumb */}
        <div style={{ position: 'absolute', top: '80px', left: '24px', right: '24px',
          display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Link href='/' style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem',
            textDecoration: 'none', fontWeight: 500 }}>Početna</Link>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>›</span>
          <Link href={`/srbija/${category}`} style={{ color: 'rgba(255,255,255,0.75)',
            fontSize: '0.8rem', textDecoration: 'none', fontWeight: 500 }}>
            {catMeta.icon} {catMeta.label}
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>›</span>
          <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>{location.name}</span>
        </div>

        {/* Title area */}
        <div style={{ position: 'absolute', bottom: '36px', left: '24px', right: '24px',
          maxWidth: '860px', margin: '0 auto' }}>
          {/* Tags */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
            <span style={{ background: catMeta.color, color: '#fff',
              padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>
              {catMeta.icon} {catMeta.label}
            </span>
            {location.best_season && (
              <span style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                color: '#fff', padding: '4px 12px', borderRadius: '999px',
                fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(255,255,255,0.3)' }}>
                🗓️ {location.best_season}
              </span>
            )}
            {location.permit_required && (
              <span style={{ background: 'rgba(255,165,0,0.35)', backdropFilter: 'blur(8px)',
                color: '#fff', padding: '4px 12px', borderRadius: '999px',
                fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(255,165,0,0.4)' }}>
                ⚠️ Dozvola obavezna
              </span>
            )}
          </div>

          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(1.8rem,4vw,3.2rem)',
            fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: '8px',
            textShadow: '0 2px 16px rgba(0,0,0,0.5)' }}>
            {location.name}
          </h1>

          {location.regions?.name && (
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', fontWeight: 500 }}>
              📍 {location.regions.name}{location.countries?.name ? `, ${location.countries.name}` : ''}
            </p>
          )}
        </div>

        {/* Photo source badge */}
        {photoResult.source !== 'location' && (
          <div style={{ position: 'absolute', top: '80px', right: '24px',
            background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)',
            color: 'rgba(255,255,255,0.7)', fontSize: '0.65rem', fontWeight: 500,
            padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)' }}>
            {photoResult.source === 'wikipedia' ? '📷 Wikipedia' :
             photoResult.source === 'commons'   ? '📷 Wikimedia Commons' :
             photoResult.source === 'mapbox'    ? '🛰️ Satelitski snimak' :
             '📷 Kategorija'}
          </div>
        )}
        {/* Wave */}
        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0 }}>
          <svg viewBox='0 0 1440 50' preserveAspectRatio='none'
            style={{ display: 'block', width: '100%', height: '50px' }}>
            <path d='M0 50 C360 10 1080 40 1440 20 L1440 50 Z' fill='#fff'/>
          </svg>
        </div>
      </section>

      {/* ═══ MAIN CONTENT ═══ */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px',
          alignItems: 'start' }} className='loc-grid'>

          {/* LIJEVO — Sadržaj */}
          <div>

            {/* Share + Reactions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 0', borderBottom: '1px solid #f0ede6', marginBottom: '32px',
              flexWrap: 'wrap', gap: '12px' }}>
              <ReactionsBar locationId={location.id} />
              <ShareButtons title={location.name} />
            </div>

            {/* Opis */}
            {location.description && (
              <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontFamily: SERIF, fontSize: '1.3rem', fontWeight: 700,
                  color: '#0e1a0e', marginBottom: '16px' }}>O lokaciji</h2>
                <div style={{ fontSize: '1rem', color: '#3d4d3d', lineHeight: 1.8 }}
                  dangerouslySetInnerHTML={{ __html: location.description }} />
              </div>
            )}

            {/* Kratki opis ako nema puni */}
            {!location.description && location.short_description && (
              <div style={{ marginBottom: '40px', padding: '24px', borderRadius: '16px',
                background: '#f9f7f2', border: '1px solid #f0ede6' }}>
                <p style={{ fontSize: '1.05rem', color: '#3d4d3d', lineHeight: 1.8, margin: 0 }}>
                  {location.short_description}
                </p>
              </div>
            )}

            {/* Praktične informacije */}
            <div style={{ background: '#f9f7f2', borderRadius: '20px', padding: '28px',
              marginBottom: '40px', border: '1px solid #f0ede6' }}>
              <h2 style={{ fontFamily: SERIF, fontSize: '1.2rem', fontWeight: 700,
                color: '#0e1a0e', marginBottom: '20px' }}>
                📋 Praktične informacije
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))',
                gap: '16px' }}>
                {location.best_season && (
                  <div style={{ background: '#fff', borderRadius: '12px', padding: '14px 16px',
                    border: '1px solid #f0ede6' }}>
                    <p style={{ fontSize: '0.7rem', color: '#8fa68f', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                      🗓️ Sezona
                    </p>
                    <p style={{ fontSize: '0.92rem', fontWeight: 600, color: '#0e1a0e' }}>
                      {location.best_season}
                    </p>
                  </div>
                )}
                {location.permit_info && (
                  <div style={{ background: '#fff', borderRadius: '12px', padding: '14px 16px',
                    border: '1px solid #f0ede6' }}>
                    <p style={{ fontSize: '0.7rem', color: '#8fa68f', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                      📄 Dozvola
                    </p>
                    <p style={{ fontSize: '0.92rem', fontWeight: 600, color: '#0e1a0e' }}>
                      {location.permit_info}
                    </p>
                  </div>
                )}
                {location.difficulty && (
                  <div style={{ background: '#fff', borderRadius: '12px', padding: '14px 16px',
                    border: '1px solid #f0ede6' }}>
                    <p style={{ fontSize: '0.7rem', color: '#8fa68f', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                      ⚡ Težina
                    </p>
                    <p style={{ fontSize: '0.92rem', fontWeight: 600, color: '#0e1a0e' }}>
                      {location.difficulty}
                    </p>
                  </div>
                )}
                {location.fish_species && (
                  <div style={{ background: '#fff', borderRadius: '12px', padding: '14px 16px',
                    border: '1px solid #f0ede6' }}>
                    <p style={{ fontSize: '0.7rem', color: '#8fa68f', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                      🐟 Ribe
                    </p>
                    <p style={{ fontSize: '0.92rem', fontWeight: 600, color: '#0e1a0e' }}>
                      {location.fish_species}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Vreme */}
            {lat !== 0 && (
              <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontFamily: SERIF, fontSize: '1.2rem', fontWeight: 700,
                  color: '#0e1a0e', marginBottom: '16px' }}>
                  🌤️ Vremenska prognoza
                </h2>
                <WeatherWidget lat={lat} lng={lng} category={category} />
              </div>
            )}

            {/* Komentari */}
            <div>
              <h2 style={{ fontFamily: SERIF, fontSize: '1.2rem', fontWeight: 700,
                color: '#0e1a0e', marginBottom: '20px' }}>
                💬 Komentari zajednice
              </h2>
              <CommentsSection locationId={location.id} />
            </div>
          </div>

          {/* DESNO — Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '28px' }}>

            {/* GPS Lokacija */}
            <div style={{ background: '#fff', borderRadius: '20px', padding: '22px',
              border: '1px solid #f0ede6', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontFamily: SERIF, fontSize: '1.05rem', fontWeight: 700,
                color: '#0e1a0e', marginBottom: '16px' }}>🧭 GPS Lokacija</h3>

              {lat !== 0 ? (
                <>
                  <div style={{ background: '#f9f7f2', borderRadius: '12px', padding: '14px 16px',
                    marginBottom: '14px', textAlign: 'center' }}>
                    <p style={{ fontFamily: SERIF, fontSize: '1.3rem', fontWeight: 800,
                      color: '#0e1a0e', letterSpacing: '0.02em' }}>
                      {lat.toFixed(5)}, {lng.toFixed(5)}
                    </p>
                    <p style={{ fontSize: '0.72rem', color: '#8fa68f', marginTop: '4px',
                      fontWeight: 500 }}>Latitude, Longitude · WGS84</p>
                  </div>

                  <a href={mapsUrl} target='_blank' rel='noopener noreferrer'
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '8px', background: '#1a73e8', color: '#fff', padding: '13px',
                      borderRadius: '12px', textDecoration: 'none', fontWeight: 700,
                      fontSize: '0.9rem', marginBottom: '10px' }}>
                    📍 Otvori u Google Maps
                  </a>

                  <a href={`geo:${lat},${lng}`}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '8px', background: '#f9f7f2', color: '#0e1a0e', padding: '11px',
                      borderRadius: '12px', textDecoration: 'none', fontWeight: 600,
                      fontSize: '0.88rem', border: '1px solid #f0ede6' }}>
                    🧭 Navigacija (GPS app)
                  </a>
                </>
              ) : (
                <p style={{ color: '#8fa68f', fontSize: '0.88rem' }}>
                  GPS koordinate nisu dostupne.
                </p>
              )}
            </div>

            {/* Brzi pristup */}
            <div style={{ background: `linear-gradient(135deg, ${catMeta.color}18 0%, ${catMeta.color}08 100%)`,
              borderRadius: '20px', padding: '22px',
              border: `1px solid ${catMeta.color}33` }}>
              <h3 style={{ fontFamily: SERIF, fontSize: '1.05rem', fontWeight: 700,
                color: '#0e1a0e', marginBottom: '16px' }}>⚡ Brzi pristup</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { href: `/srbija/${category}`, label: `Sve ${catMeta.label} lokacije`, icon: catMeta.icon },
                  { href: '/pretraga', label: 'Pretraži lokacije', icon: '🔍' },
                  { href: '/predlozi-lokaciju', label: 'Predloži lokaciju', icon: '📌' },
                  { href: '/kalendar-aktivnosti', label: 'Kalendar aktivnosti', icon: '📅' },
                ].map(item => (
                  <Link key={item.href} href={item.href}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 14px', borderRadius: '12px', background: '#fff',
                      textDecoration: 'none', border: '1px solid #f0ede6',
                      fontSize: '0.86rem', fontWeight: 600, color: '#0e1a0e',
                      transition: 'transform 0.15s' }}>
                    <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                    {item.label}
                    <svg width='11' height='11' viewBox='0 0 24 24' fill='none'
                      stroke='#ccc' strokeWidth='2' style={{ marginLeft: 'auto' }}>
                      <path d='M9 18l6-6-6-6'/>
                    </svg>
                  </Link>
                ))}
              </div>
            </div>

            {/* Prijavi grešku */}
            <div style={{ borderRadius: '16px', padding: '16px 18px',
              border: '1px solid #f0ede6', background: '#fafaf8' }}>
              <p style={{ fontSize: '0.78rem', color: '#8fa68f', marginBottom: '8px' }}>
                Informacije nisu tačne?
              </p>
              <Link href={`/kontakt?ref=${location.slug}`}
                style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2d6a2d',
                  textDecoration: 'none' }}>
                ✏️ Predloži izmenu →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .loc-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
