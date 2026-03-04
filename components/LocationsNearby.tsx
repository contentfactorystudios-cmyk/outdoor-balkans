'use client'
import { getCardPhoto } from '@/lib/getCategoryPhoto'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Props {
  catData: Record<string, { photo: string; hero: string; color: string }>
}

export default function LocationsNearby({ catData }: Props) {
  const [city, setCity]       = useState<string>('')
  const [locs, setLocs]       = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const SERIF = "'Fraunces','Playfair Display',Georgia,serif"

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(d => setCity(d.city || d.region || 'Beograda'))
      .catch(() => setCity('Beograda'))

    supabase
      .from('locations')
      .select('id,name,slug,short_description,image_url,categories(name,slug,icon),countries(name,slug),regions(name)')
      .eq('is_published', true)
      .order('is_featured', { ascending: false })
      .limit(4)
      .then(({ data }) => { setLocs(data ?? []); setLoading(false) })
  }, [])

  if (!loading && locs.length === 0) return null

  return (
    <section style={{ padding: '60px 24px', background: '#f9f7f2' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <p style={{ color: '#8fa68f', fontSize: '0.78rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '10px' }}>
            Preporučeno u tvojoj blizini
          </p>
          <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(1.4rem,2.5vw,1.9rem)',
            fontWeight: 700, color: '#0e1a0e', marginBottom: '8px' }}>
            {loading ? 'Učitavam lokacije...' : `Preporučeno u blizini — ${city}`}
          </h2>
          <Link href='/pretraga' style={{ fontSize: '0.88rem', fontWeight: 600,
            color: '#2d6a2d', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Sve lokacije
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none'
              stroke='currentColor' strokeWidth='2.5'><path d='M5 12h14M12 5l7 7-7 7'/></svg>
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '20px' }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ borderRadius: '16px', overflow: 'hidden', background: '#fff', border: '1px solid #f0ede6' }}>
                <div style={{ height: '200px', background: 'linear-gradient(90deg,#f0ede6 25%,#e8e2d4 50%,#f0ede6 75%)', backgroundSize: '200% 100%' }} />
                <div style={{ padding: '14px 16px 16px' }}>
                  <div style={{ height: '12px', background: '#f0ede6', borderRadius: '6px', marginBottom: '8px', width: '60%' }} />
                  <div style={{ height: '18px', background: '#f0ede6', borderRadius: '6px', marginBottom: '6px' }} />
                  <div style={{ height: '12px', background: '#f0ede6', borderRadius: '6px', width: '80%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '20px' }}>
            {locs.map((loc: any) => {
              const cs = loc.categories?.slug ?? ''
              const cp = catData[cs]
              return (
                <Link key={loc.id}
                  href={'/' + (loc.countries?.slug ?? 'srbija') + '/' + cs + '/' + loc.slug}
                  className='loc-card' style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#fff',
                    border: '1px solid #f0ede6', boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s, box-shadow 0.2s' }}>
                    <div style={{ height: '200px', overflow: 'hidden', position: 'relative',
                      background: cp?.color ?? '#2d6a2d' }}>
                      <img
                        src={getCardPhoto(loc.slug ?? '', loc.image_url, cs)}
                        alt={loc.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0' }}
                      />
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
                      <div style={{ fontSize: '0.75rem', color: '#8fa68f', marginBottom: '4px',
                        display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg width='10' height='10' viewBox='0 0 24 24' fill='#8fa68f'>
                          <path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z'/>
                        </svg>
                        {loc.regions?.name ?? 'Srbija'}
                      </div>
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
        )}
      </div>
    </section>
  )
}
