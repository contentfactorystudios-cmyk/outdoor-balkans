// redizajn-v2
import { getLocationBySlug, extractCoordinates } from '@/lib/queries'
import { getLocationPhoto } from '@/lib/getLocationPhoto'
import ShareButtons    from '@/components/ShareButtons'
import ReactionsBar    from '@/components/ReactionsBar'
import WeatherWidget   from '@/components/WeatherWidget'
import CommentsSection from '@/components/CommentsSection'
import CategoryDetails from '@/components/CategoryDetails'
import LocationMap     from '@/components/LocationMap'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 86400
const SERIF = "'Fraunces','Playfair Display',Georgia,serif"
const SANS  = "'DM Sans',system-ui,sans-serif"

const CAT_META: Record<string, { color: string; bg: string; icon: string; label: string }> = {
  ribolov:             { color: '#1d5fa8', bg: '#e8f0fb', icon: '🎣', label: 'Ribolov' },
  lov:                 { color: '#7c4a1e', bg: '#f5ede4', icon: '🦌', label: 'Lov' },
  kajak:               { color: '#0e7490', bg: '#e0f5f9', icon: '🚣', label: 'Kajak & Jezera' },
  kampovanje:          { color: '#166534', bg: '#dcfce7', icon: '⛺', label: 'Kampovanje' },
  planinarenje:        { color: '#5b21b6', bg: '#ede9fe', icon: '🥾', label: 'Planinarenje' },
  'nacionalni-parkovi':{ color: '#0f766e', bg: '#ccfbf1', icon: '🦋', label: 'Nacionalni parkovi' },
  rezervati:           { color: '#0f766e', bg: '#ccfbf1', icon: '🦋', label: 'Rezervati' },
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
  const lat     = coords?.lat ?? location.lat ?? 0
  const lng     = coords?.lng ?? location.lng ?? 0
  const catMeta = CAT_META[category] ?? { color: '#2d6a2d', bg: '#f0fdf4', icon: '📍', label: category }
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + lat + ',' + lng
  const cd      = (location.category_data ?? {}) as Record<string, any>

  const photoResult = await getLocationPhoto({
    imageUrl: location.image_url,
    locationName: location.name,
    category, lat: coords?.lat, lng: coords?.lng,
  })
  const heroImg = photoResult.url

  const quickStats: { icon: string; label: string; value: string }[] = []
  if (category === 'planinarenje') {
    if (cd.duzina_km)          quickStats.push({ icon: '📏', label: 'Dužina',   value: cd.duzina_km + ' km' })
    if (cd.visinska_razlika_m) quickStats.push({ icon: '⛰️',  label: 'Visina',   value: cd.visinska_razlika_m + ' m' })
    if (cd.tezina)             quickStats.push({ icon: '💪', label: 'Težina',   value: cd.tezina })
  } else if (category === 'ribolov') {
    if (cd.tip_vode)    quickStats.push({ icon: '💧', label: 'Tip vode', value: cd.tip_vode })
    if (cd.dozvola_tip) quickStats.push({ icon: '📋', label: 'Dozvola',  value: cd.dozvola_tip })
    if (cd.vrste_ribe)  quickStats.push({ icon: '🐟', label: 'Ribe', value: Array.isArray(cd.vrste_ribe) ? cd.vrste_ribe.slice(0,2).join(', ') : cd.vrste_ribe })
  } else if (category === 'lov') {
    if (cd.tip_terena) quickStats.push({ icon: '🌲', label: 'Teren',    value: cd.tip_terena })
    if (cd.sezona_od)  quickStats.push({ icon: '📅', label: 'Sezona od',value: cd.sezona_od })
    if (cd.divljac)    quickStats.push({ icon: '🦌', label: 'Divljač',  value: Array.isArray(cd.divljac) ? cd.divljac.slice(0,2).join(', ') : cd.divljac })
  } else if (category === 'kajak') {
    if (cd.duzina_rute_km) quickStats.push({ icon: '📏', label: 'Ruta',    value: cd.duzina_rute_km + ' km' })
    if (cd.tezina_brzaka)  quickStats.push({ icon: '🌊', label: 'Težina',  value: cd.tezina_brzaka })
    if (cd.trajanje_h)     quickStats.push({ icon: '⏱️',  label: 'Trajanje',value: cd.trajanje_h + 'h' })
  }

  return (
    <div style={{ fontFamily: SANS, background: '#fff', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ position: 'relative', height: '65vh', minHeight: '440px', maxHeight: '620px', overflow: 'hidden' }}>
        <img src={heroImg} alt={location.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }} />
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.75) 100%)' }} />

        <nav style={{ position: 'absolute', top: '80px', left: '24px', right: '24px',
          display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <Link href='/' style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.78rem', textDecoration: 'none' }}>Početna</Link>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>›</span>
          <Link href={'/' + country + '/' + category} style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.78rem', textDecoration: 'none' }}>{catMeta.label}</Link>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>›</span>
          <span style={{ color: '#fff', fontSize: '0.78rem', fontWeight: 600 }}>{location.name}</span>
        </nav>

        <div style={{ position: 'absolute', bottom: '48px', left: '24px', right: '24px', maxWidth: '900px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <span style={{ background: catMeta.color, color: '#fff', padding: '5px 14px', borderRadius: '999px', fontSize: '0.76rem', fontWeight: 700 }}>
              {catMeta.icon} {catMeta.label}
            </span>
            {location.best_season && (
              <span style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', color: '#fff',
                padding: '5px 14px', borderRadius: '999px', fontSize: '0.76rem', fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.3)' }}>
                🗓️ {location.best_season}
              </span>
            )}
            {location.permit_required && (
              <span style={{ background: 'rgba(234,88,12,0.5)', backdropFilter: 'blur(8px)', color: '#fff',
                padding: '5px 14px', borderRadius: '999px', fontSize: '0.76rem', fontWeight: 600,
                border: '1px solid rgba(255,120,0,0.4)' }}>
                ⚠️ Dozvola obavezna
              </span>
            )}
          </div>

          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(1.9rem,4vw,3.4rem)', fontWeight: 900,
            color: '#fff', lineHeight: 1.1, marginBottom: '10px', textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
            {location.name}
          </h1>

          {quickStats.length > 0 && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
              {quickStats.map((s, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', padding: '6px 14px',
                  display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.85rem' }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
                    <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 700 }}>{s.value}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {location.regions?.name && (
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', fontWeight: 500 }}>
              📍 {location.regions.name}{location.countries?.name ? ', ' + location.countries.name : ''}
            </p>
          )}
        </div>

        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0 }}>
          <svg viewBox='0 0 1440 60' preserveAspectRatio='none' style={{ display: 'block', width: '100%', height: '60px' }}>
            <path d='M0 60 C480 20 960 50 1440 30 L1440 60 Z' fill='#fff'/>
          </svg>
        </div>
      </section>

      {/* MAIN LAYOUT */}
      <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 20px 80px' }}>
        <div className='loc-grid' style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '48px', alignItems: 'start' }}>

          {/* LIJEVO */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 0 24px', borderBottom: '2px solid #f0ede6', marginBottom: '36px',
              flexWrap: 'wrap', gap: '12px' }}>
              <ReactionsBar locationId={location.id} />
              <ShareButtons title={location.name} url={''} />
            </div>

            {(location.description || location.short_description) && (
              <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontFamily: SERIF, fontSize: '1.4rem', fontWeight: 700, color: '#0e1a0e', marginBottom: '16px' }}>O lokaciji</h2>
                {location.description ? (
                  <div style={{ fontSize: '1rem', color: '#3d4d3d', lineHeight: 1.85 }}
                    dangerouslySetInnerHTML={{ __html: location.description }} />
                ) : (
                  <p style={{ fontSize: '1rem', color: '#3d4d3d', lineHeight: 1.85, margin: 0 }}>{location.short_description}</p>
                )}
              </div>
            )}

            {cd && Object.keys(cd).length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <CategoryDetails category={category} data={cd} />
              </div>
            )}

            {(location.best_season || location.permit_info) && (
              <div style={{ background: '#f9f7f2', borderRadius: '20px', padding: '28px', marginBottom: '40px', border: '1px solid #f0ede6' }}>
                <h2 style={{ fontFamily: SERIF, fontSize: '1.2rem', fontWeight: 700, color: '#0e1a0e', marginBottom: '20px' }}>📋 Praktične informacije</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '14px' }}>
                  {location.best_season && (
                    <div style={{ background: '#fff', borderRadius: '14px', padding: '16px', border: '1px solid #f0ede6' }}>
                      <p style={{ fontSize: '0.68rem', color: '#8fa68f', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>🗓️ Sezona</p>
                      <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0e1a0e', margin: 0 }}>{location.best_season}</p>
                    </div>
                  )}
                  {location.permit_info && (
                    <div style={{ background: '#fff', borderRadius: '14px', padding: '16px', border: '1px solid #f0ede6' }}>
                      <p style={{ fontSize: '0.68rem', color: '#8fa68f', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>📄 Dozvola</p>
                      <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0e1a0e', margin: 0 }}>{location.permit_info}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {lat !== 0 && (
              <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontFamily: SERIF, fontSize: '1.2rem', fontWeight: 700, color: '#0e1a0e', marginBottom: '16px' }}>🌤️ Vremenska prognoza</h2>
                <WeatherWidget lat={lat} lng={lng} category={category} locationName={location.name} />
              </div>
            )}

            <div>
              <h2 style={{ fontFamily: SERIF, fontSize: '1.2rem', fontWeight: 700, color: '#0e1a0e', marginBottom: '20px' }}>💬 Komentari zajednice</h2>
              <CommentsSection locationId={location.id} />
            </div>
          </div>

          {/* SIDEBAR */}
          <div className='loc-sidebar' style={{ position: 'sticky', top: '88px', display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '8px' }}>
            {lat !== 0 && (
              <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', border: '1px solid #f0ede6', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                <LocationMap lat={lat} lng={lng} name={location.name} color={catMeta.color} />
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ textAlign: 'center', padding: '10px', background: '#f9f7f2', borderRadius: '10px' }}>
                    <span style={{ fontFamily: SERIF, fontSize: '1.1rem', fontWeight: 800, color: '#0e1a0e' }}>
                      {lat.toFixed(5)}, {lng.toFixed(5)}
                    </span>
                    <p style={{ fontSize: '0.68rem', color: '#8fa68f', margin: '2px 0 0' }}>WGS84</p>
                  </div>
                  <a href={mapsUrl} target='_blank' rel='noopener noreferrer'
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      background: '#1a73e8', color: '#fff', padding: '12px', borderRadius: '12px',
                      textDecoration: 'none', fontWeight: 700, fontSize: '0.88rem' }}>
                    📍 Otvori u Google Maps
                  </a>
                  <a href={'geo:' + lat + ',' + lng}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      background: '#f9f7f2', color: '#0e1a0e', padding: '11px', borderRadius: '12px',
                      textDecoration: 'none', fontWeight: 600, fontSize: '0.86rem', border: '1px solid #f0ede6' }}>
                    🧭 Navigacija (GPS app)
                  </a>
                </div>
              </div>
            )}

            <div style={{ background: catMeta.bg, borderRadius: '20px', padding: '20px', border: '1px solid ' + catMeta.color + '22' }}>
              <h3 style={{ fontFamily: SERIF, fontSize: '1rem', fontWeight: 700, color: '#0e1a0e', marginBottom: '14px' }}>⚡ Brzi pristup</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { href: '/' + country + '/' + category, label: 'Sve ' + catMeta.label + ' lokacije', icon: catMeta.icon },
                  { href: '/pretraga', label: 'Pretraži lokacije', icon: '🔍' },
                  { href: '/predlozi-lokaciju', label: 'Predloži lokaciju', icon: '📌' },
                  { href: '/kalendar-aktivnosti', label: 'Kalendar aktivnosti', icon: '📅' },
                ].map(item => (
                  <Link key={item.href} href={item.href}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
                      borderRadius: '12px', background: '#fff', textDecoration: 'none',
                      border: '1px solid #f0ede6', fontSize: '0.85rem', fontWeight: 600, color: '#0e1a0e' }}>
                    <span>{item.icon}</span>{item.label}
                    <svg width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='#ccc' strokeWidth='2.5' style={{ marginLeft: 'auto' }}>
                      <path d='M9 18l6-6-6-6'/>
                    </svg>
                  </Link>
                ))}
              </div>
            </div>

            <div style={{ borderRadius: '14px', padding: '14px 16px', border: '1px solid #f0ede6', background: '#fafaf8' }}>
              <p style={{ fontSize: '0.76rem', color: '#8fa68f', margin: '0 0 6px' }}>Informacije nisu tačne?</p>
              <Link href={'/kontakt?ref=' + location.slug} style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2d6a2d', textDecoration: 'none' }}>
                ✏️ Predloži izmenu →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 900px) {
          .loc-grid { grid-template-columns: 1fr !important; }
          .loc-sidebar { position: static !important; top: auto !important; }
        }
      ` }} />
    </div>
  )
}
