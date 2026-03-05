import { getCardPhoto } from '@/lib/getCategoryPhoto'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import HeroSlider from '@/components/HeroSlider'
import LocationsNearby from '@/components/LocationsNearby'
import GearCarousel from '@/components/GearCarousel'

const CAT: Record<string, { photo: string; hero: string; color: string }> = {
  ribolov:      { color: '#1d5fa8',
    photo: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=300&fit=crop&q=80',
    hero:  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&h=1080&fit=crop&q=85' },
  lov:          { color: '#5a3010',
    photo: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=300&h=300&fit=crop&q=80',
    hero:  'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=1920&h=1080&fit=crop&q=85' },
  kajak:        { color: '#0e7490',
    photo: 'https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?w=300&h=300&fit=crop&q=80',
    hero:  'https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?w=1920&h=1080&fit=crop&q=85' },
  kampovanje:   { color: '#166534',
    photo: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=300&h=300&fit=crop&q=80',
    hero:  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920&h=1080&fit=crop&q=85' },
  planinarenje: { color: '#5b21b6',
    photo: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=300&h=300&fit=crop&q=80',
    hero:  'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&h=1080&fit=crop&q=85' },
  'nacionalni-parkovi':    { color: '#0f766e',
    photo: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop&q=80',
    hero:  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&q=85' },
}

const SERIF = "'Fraunces','Playfair Display',Georgia,serif"
const SANS  = "'DM Sans',system-ui,sans-serif"

export default async function HomePage() {
  const [{ data: categories }, { data: featured }, { count }] = await Promise.all([
    supabase.from('categories').select('id,name,slug,icon').eq('is_active', true).order('sort_order'),
    supabase.from('locations').select('id,name,slug,short_description,image_url,categories(name,slug,icon),countries(name,slug),regions(name)').eq('is_published', true).order('created_at', { ascending: false }).limit(8),
    supabase.from('locations').select('id', { count: 'exact', head: true }).eq('is_published', true),
  ])
  const locCount = count ?? 25
  const cats = (categories ?? []) as any[]
  const locs = (featured ?? []) as any[]

  return (
    <div style={{ fontFamily: SANS, background: '#fff', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ position: 'relative', height: '75vh', minHeight: '520px', overflow: 'hidden' }}>
        <HeroSlider catData={CAT} />
        <div className='hero-content' style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column',
          alignItems: 'flex-start', justifyContent: 'center', height: '100%', textAlign: 'left', padding: '0 5vw 70px 5vw', maxWidth: '480px' }}>
                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.72rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '14px',
            textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>
            Outdoor Balkan
          </p>
          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(1.9rem,4.5vw,3.6rem)', fontWeight: 900,
            color: '#fff', lineHeight: 1.1, marginBottom: '28px',
            textShadow: '0 2px 24px rgba(0,0,0,0.5)', maxWidth: '13ch' }}>
            Kroči u divljinu..
          </h1>
          <form action='/pretraga' method='GET' style={{ width: '100%', maxWidth: '420px', marginBottom: '12px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#fff',
              borderRadius: '999px', padding: '5px 5px 5px 18px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.35)', gap: '6px',
              width: '100%', boxSizing: 'border-box' }}>
              <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='#8fa68f' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' style={{ flexShrink: 0 }}>
                <circle cx='11' cy='11' r='8'/><path d='m21 21-4.35-4.35'/>
              </svg>
              <input name='q' type='search' placeholder='Pretraži reke, planine...'
                style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', fontSize: '0.92rem',
                  color: '#0e1a0e', background: 'transparent', padding: '8px 0', fontFamily: 'inherit' }} />
              <button type='submit' style={{ background: '#2d6a2d', color: '#fff', border: 'none',
                borderRadius: '999px', padding: '10px 18px', fontSize: '0.88rem',
                fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>Pretraži</button>
            </div>
          </form>
          <Link href='/pretraga?advanced=1' style={{ color: 'rgba(255,255,255,0.88)',
            fontSize: '0.87rem', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
            Napredno pretraživanje →
          </Link>
        </div>

        <style>{`
          @media (max-width: 640px) {
            .hero-content {
              padding-left: 20px !important;
              padding-right: 20px !important;
              max-width: 100% !important;
            }
            .hero-content h1 {
              font-size: 1.9rem !important;
            }
            .hero-search {
              max-width: 100% !important;
            }
          }
        `}</style>

        <style>{`
          @media (max-width: 640px) {
            .hero-search-wrap { max-width: calc(100vw - 40px) !important; }
            .hero-search-inner { padding: 5px 5px 5px 16px !important; }
            .hero-search-btn { padding: 9px 16px !important; font-size: 0.82rem !important; }
            .hero-search-input { font-size: 0.88rem !important; }
            .hero-content { padding-left: 20px !important; padding-right: 20px !important; }
          }
        `}</style>
        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, zIndex: 15 }}>
          <svg viewBox='0 0 1440 80' preserveAspectRatio='none' style={{ display: 'block', width: '100%', height: '40px' }}>
            <path d='M0 80 C360 20 720 60 1080 30 C1260 15 1380 50 1440 40 L1440 80 Z' fill='#fff'/>
          </svg>
        </div>
      </section>

      {/* KATEGORIJE */}
      <section style={{ padding: '56px 32px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 700,
            color: '#0e1a0e', marginBottom: '36px', textAlign: 'center' }}>
            Izaberi svoj teren
          </h2>
          <div className='cat-scroll' style={{ display: 'flex', overflowX: 'auto', gap: '24px', paddingBottom: '8px',
            scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
            justifyContent: 'center', flexWrap: 'nowrap' }}>
            {cats.map((cat: any) => {
              if (cat.slug === 'rezervati') { cat = {...cat, slug: 'nacionalni-parkovi', name: 'Nacionalni parkovi'} }
              const p = CAT[cat.slug]
              return (
                <Link key={cat.id} href={'/srbija/' + cat.slug}
                  className='cat-card-link'
                  style={{ textDecoration: 'none', flexShrink: 0, display: 'block', width: '160px' }}>
                  <div className='cat-card' style={{
                    width: '160px', height: '200px', borderRadius: '24px',
                    overflow: 'hidden', position: 'relative',
                    background: p?.color ?? '#2d6a2d',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  }}>
                    {p?.photo && (
                      <img src={p.photo} alt={cat.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover',
                          transition: 'transform 0.4s ease' }} />
                    )}
                    <div style={{ position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.05) 60%, transparent 100%)' }} />
                    <div style={{ position: 'absolute', top: '14px', left: '14px',
                      fontSize: '1.8rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
                      {cat.icon}
                    </div>
                    <div style={{ position: 'absolute', bottom: '14px', left: '14px', right: '14px' }}>
                      <p style={{ color: '#fff', fontSize: '0.92rem', fontWeight: 700,
                        fontFamily: SERIF, lineHeight: 1.2, margin: 0,
                        textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>{cat.name}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: '#f4f0e6', padding: '44px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexWrap: 'wrap',
          justifyContent: 'center', gap: '40px 60px', textAlign: 'center' }}>
          {[
            { n: locCount + '+', l: 'Verifikovanih lokacija', icon: '📍' },
            { n: '6',            l: 'Kategorija aktivnosti',  icon: '🏔️' },
            { n: '5+',           l: 'Balkanskih zemalja',     icon: '🌍' },
            { n: '24/7',         l: 'Ažurirani podaci',       icon: '🌤️' },
          ].map(s => (
            <div key={s.l}>
              <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{s.icon}</div>
              <div style={{ fontFamily: SERIF, fontSize: '2.2rem', fontWeight: 900,
                color: '#0e1a0e', lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: '0.8rem', color: '#8fa68f', marginTop: '4px', fontWeight: 500 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LOCAL FAVORITES */}
      <LocationsNearby catData={CAT} />

      {/* NAJNOVIJE LOKACIJE */}
      {(
        <section style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <p style={{ color: '#8fa68f', fontSize: '0.78rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '10px' }}>
              Novo na mapi
            </p>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(1.4rem,2.5vw,1.9rem)',
              fontWeight: 700, color: '#0e1a0e', marginBottom: '10px' }}>
              Sveže sa staze
            </h2>
            <Link href='/pretraga' style={{ fontSize: '0.88rem', fontWeight: 600, color: '#2d6a2d',
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              Sve lokacije
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5'><path d='M5 12h14M12 5l7 7-7 7'/></svg>
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '20px' }}>
            {locs.map((loc: any) => {
              const cs = loc.categories?.slug ?? ''
              const cp = CAT[cs]
              return (
                <Link key={loc.id} href={'/' + (loc.countries?.slug ?? 'srbija') + '/' + cs + '/' + loc.slug}
                  className='loc-card' style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#fff',
                    border: '1px solid #f0ede6', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                    <div style={{ height: '200px', overflow: 'hidden', position: 'relative',
                      background: cp?.color ?? '#2d6a2d' }}>
                      <img
                        src={getCardPhoto(loc.slug, loc.image_url, loc.categories?.slug ?? '')}
                        alt={loc.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top,rgba(0,0,0,0.4) 0%,transparent 55%)' }} />
                      <div style={{ position: 'absolute', bottom: '10px', left: '10px',
                        background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)',
                        color: '#fff', fontSize: '0.7rem', fontWeight: 600,
                        padding: '3px 10px', borderRadius: '999px' }}>
                        {loc.categories?.icon} {loc.categories?.name}
                      </div>
                    </div>
                    <div style={{ padding: '14px 16px 16px' }}>
                      <div style={{ fontSize: '0.75rem', color: '#8fa68f', marginBottom: '4px' }}>
                        {loc.regions?.name ?? 'Srbija'}
                      </div>
                      <h3 style={{ fontFamily: SERIF, fontSize: '1rem', fontWeight: 700,
                        color: '#0e1a0e', marginBottom: '6px', lineHeight: 1.3 }}>{loc.name}</h3>
                      <p style={{ fontSize: '0.82rem', color: '#8fa68f', lineHeight: 1.5,
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{loc.short_description}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* SHARE YOUR ADVENTURE */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '100px 24px' }}>
        <img src='https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&h=900&fit=crop&q=80'
          alt='Planine' style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg,rgba(14,26,14,0.85) 0%,rgba(30,61,30,0.78) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#6ab87a', fontSize: '0.78rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '16px' }}>Zajednica</p>
          <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900,
            color: '#fff', lineHeight: 1.15, marginBottom: '20px',
            textShadow: '0 2px 16px rgba(0,0,0,0.3)' }}>Tvoja reč menja mapu</h2>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '1rem', lineHeight: 1.7,
            marginBottom: '32px', maxWidth: '42ch', margin: '0 auto 32px' }}>
            Znaš tajno ribolovno mesto, planinarsku stazu ili divlji kamp? Podeli ga sa zajednicom.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px',
            justifyContent: 'center', marginBottom: '40px' }}>
            <Link href='/predlozi-lokaciju' style={{ background: '#fff', color: '#0e1a0e',
              padding: '14px 34px', borderRadius: '999px', fontSize: '0.95rem',
              fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}>
              📍 Predloži lokaciju
            </Link>
            <Link href='/pretraga' style={{ background: 'transparent', color: '#fff',
              padding: '14px 34px', borderRadius: '999px', fontSize: '0.95rem',
              fontWeight: 600, textDecoration: 'none', border: '2px solid rgba(255,255,255,0.5)' }}>
              Istraži lokacije
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', marginRight: '6px' }}>Prati nas:</p>
            {[
              { href: 'https://facebook.com/outdoorbalkans',  label: 'Facebook',  color: '#1877f2', path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
              { href: 'https://instagram.com/outdoorbalkans', label: 'Instagram', color: '#e1306c', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
              { href: 'https://youtube.com/@outdoorbalkans',  label: 'YouTube',   color: '#ff0000', path: 'M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z' },
              { href: 'https://tiktok.com/@outdoorbalkans',   label: 'TikTok',    color: '#fff',    path: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.17 8.17 0 0 0 4.78 1.52V6.78a4.86 4.86 0 0 1-1.01-.09z' },
            ].map(s => (
              <a key={s.label} href={s.href} target='_blank' rel='noopener noreferrer'
                style={{ width: '44px', height: '44px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                  color: s.color, textDecoration: 'none' }}>
                <svg viewBox='0 0 24 24' width='20' height='20' fill='currentColor'>
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* GEAR UP */}
      <GearCarousel />

      {/* TOP LOKACIJE — Balkanski vrhovi i virovi stil */}
      <section style={{ background: '#f9f7f2', padding: '72px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <p style={{ color: '#8fa68f', fontSize: '0.78rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '10px' }}>
              Otkriveno od zajednice
            </p>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(1.8rem,3vw,2.4rem)',
              fontWeight: 900, color: '#0e1a0e' }}>
              Balkanski vrhovi i virovi
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '40px' }}>
            {cats.slice(0, 3).map((cat: any) => {
              const cp  = CAT[cat.slug]
              const top = locs.filter((l: any) => l.categories?.slug === cat.slug).slice(0, 8)
              return (
                <div key={cat.id}>
                  <div style={{ display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h3 style={{ fontFamily: SERIF, fontSize: '1.1rem', fontWeight: 700, color: '#0e1a0e' }}>
                      Top {cat.name}
                    </h3>
                    <Link href={'/srbija/' + cat.slug} style={{ fontSize: '0.82rem',
                      fontWeight: 600, color: '#2d6a2d', textDecoration: 'none' }}>Sve →</Link>
                  </div>
                  {top.length > 0 ? top.map((loc: any, idx: number) => (
                    <Link key={loc.id}
                      href={'/' + (loc.countries?.slug ?? 'srbija') + '/' + cat.slug + '/' + loc.slug}
                      className='top-row'
                      style={{ textDecoration: 'none', display: 'flex', alignItems: 'center',
                        gap: '12px', padding: '10px 0',
                        borderBottom: idx < top.length - 1 ? '1px solid #ede8df' : 'none' }}>
                      <span style={{ fontFamily: SERIF, fontSize: '1rem', fontWeight: 700,
                        color: '#d4cbbf', minWidth: '20px', textAlign: 'right' }}>
                        {idx + 1}
                      </span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0e1a0e',
                          marginBottom: '1px', lineHeight: 1.3 }}>{loc.name}</p>
                        <p style={{ fontSize: '0.75rem', color: '#8fa68f' }}>
                          {loc.regions?.name ?? 'Srbija'}
                        </p>
                      </div>
                      <svg width='12' height='12' viewBox='0 0 24 24' fill='none'
                        stroke='#ccc' strokeWidth='2'><path d='M9 18l6-6-6-6'/></svg>
                    </Link>
                  )) : (
                    <div style={{ padding: '20px 0', textAlign: 'center' }}>
                      <p style={{ color: '#8fa68f', fontSize: '0.85rem' }}>
                        {cat.icon} Uskoro — dodaj prvu lokaciju!
                      </p>
                      <Link href='/predlozi-lokaciju' style={{ display: 'inline-block',
                        marginTop: '10px', fontSize: '0.82rem', fontWeight: 600,
                        color: '#2d6a2d', textDecoration: 'none' }}>
                        + Predloži lokaciju →
                      </Link>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#1e3d1e', padding: '48px 24px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px',
            justifyContent: 'space-between', marginBottom: '40px' }}>
            <div>
              <div style={{ fontFamily: SERIF, fontSize: '1.3rem', fontWeight: 700,
                color: '#f4f0e6', marginBottom: '8px' }}>OutdoorBalkans</div>
              <p style={{ color: '#8fb898', fontSize: '0.85rem', maxWidth: '220px', lineHeight: 1.6 }}>
                GPS direktorijum outdoor lokacija Balkana.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
              <div>
                <p style={{ color: '#6ab87a', fontSize: '0.72rem', fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>Istraži</p>
                {[['/srbija/ribolov','Ribolov'],['/srbija/lov','Lov'],
                  ['/srbija/kampovanje','Kampovanje'],['/srbija/planinarenje','Planinarenje'],
                  ['/products','Oprema']].map(([h,l]) => (
                  <div key={h} style={{ marginBottom: '8px' }}>
                    <Link href={h} style={{ color: '#8fb898', fontSize: '0.88rem', textDecoration: 'none' }}>{l}</Link>
                  </div>
                ))}
              </div>
              <div>
                <p style={{ color: '#6ab87a', fontSize: '0.72rem', fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>Ostalo</p>
                {[['/predlozi-lokaciju','Dodaj lokaciju'],['/kalendar-aktivnosti','Kalendar'],
                  ['/kontakt','Kontakt'],['/admin','Admin']].map(([h,l]) => (
                  <div key={h} style={{ marginBottom: '8px' }}>
                    <Link href={h} style={{ color: '#8fb898', fontSize: '0.88rem', textDecoration: 'none' }}>{l}</Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px' }}>
            <p style={{ color: 'rgba(143,184,152,0.5)', fontSize: '0.78rem' }}>
              © 2025 OutdoorBalkans.com
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}