'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const SERIF = "'Fraunces','Playfair Display',Georgia,serif"
const SANS  = "'DM Sans',system-ui,sans-serif"

export default function MojeLokacijePage() {
  const [locs,    setLocs]    = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login'); return }
      const { data: locs } = await supabase
        .from('locations')
        .select('id,name,slug,is_published,image_url,categories(name,slug,icon),regions(name),countries(slug)')
        .eq('created_by', data.user.id)
        .order('created_at', { ascending: false })
      setLocs(locs ?? [])
      setLoading(false)
    })
  }, [])

  const CAT_COLOR: Record<string,string> = {
    ribolov:'#1d5fa8', lov:'#5a3010', kajak:'#0e7490',
    kampovanje:'#166534', planinarenje:'#5b21b6', 'nacionalni-parkovi':'#0f766e',
  }

  return (
    <div style={{ fontFamily:SANS, minHeight:'100vh', background:'#f9f7f2', paddingTop:'64px' }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg, #2d6a2ddd 0%, #0f766eaa 100%)',
        padding:'48px 24px 40px' }}>
        <div style={{ maxWidth:'760px', margin:'0 auto', display:'flex',
          alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'16px' }}>
          <div>
            <Link href='/profil' style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.82rem',
              textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'4px',
              marginBottom:'12px' }}>
              ← Profil
            </Link>
            <h1 style={{ fontFamily:SERIF, fontSize:'clamp(1.5rem,3vw,2rem)',
              fontWeight:900, color:'#fff' }}>📍 Moje lokacije</h1>
            <p style={{ color:'rgba(255,255,255,0.8)', fontSize:'0.88rem', marginTop:'4px' }}>
              {loading ? '...' : `${locs.length} lokacija`}
            </p>
          </div>
          <Link href='/predlozi-lokaciju'
            style={{ background:'rgba(255,255,255,0.2)', color:'#fff', padding:'12px 22px',
              borderRadius:'14px', textDecoration:'none', fontWeight:700, fontSize:'0.9rem',
              border:'1px solid rgba(255,255,255,0.3)', backdropFilter:'blur(8px)',
              display:'flex', alignItems:'center', gap:'8px' }}>
            ➕ Dodaj lokaciju
          </Link>
        </div>
      </div>

      <div style={{ maxWidth:'760px', margin:'0 auto', padding:'32px 24px 80px' }}>
        {loading ? (
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ background:'#fff', borderRadius:'16px', padding:'20px',
                border:'1px solid #f0ede6', display:'flex', gap:'16px', alignItems:'center' }}>
                <div style={{ width:'60px', height:'60px', borderRadius:'12px',
                  background:'#f0ede6', flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <div style={{ height:'14px', background:'#f0ede6', borderRadius:'6px',
                    width:'60%', marginBottom:'8px' }} />
                  <div style={{ height:'10px', background:'#f0ede6', borderRadius:'6px', width:'40%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : locs.length === 0 ? (
          <div style={{ background:'#fff', borderRadius:'24px', padding:'60px 24px',
            textAlign:'center', border:'1px solid #f0ede6',
            boxShadow:'0 4px 24px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize:'3.5rem', marginBottom:'16px' }}>📍</div>
            <h2 style={{ fontFamily:SERIF, fontSize:'1.3rem', fontWeight:700,
              color:'#0e1a0e', marginBottom:'8px' }}>Još nemaš lokacija</h2>
            <p style={{ color:'#8fa68f', marginBottom:'28px', lineHeight:1.6 }}>
              Podeli svoje omiljeno mesto za ribolov, lov ili planinarenje.
            </p>
            <Link href='/predlozi-lokaciju'
              style={{ background:'#2d6a2d', color:'#fff', padding:'14px 32px',
                borderRadius:'14px', textDecoration:'none', fontWeight:700, fontSize:'0.95rem' }}>
              Predloži prvu lokaciju
            </Link>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {locs.map((loc: any) => {
              const cs = loc.categories?.slug ?? ''
              const col = CAT_COLOR[cs] ?? '#2d6a2d'
              return (
                <div key={loc.id} style={{ background:'#fff', borderRadius:'16px',
                  border:'1px solid #f0ede6', boxShadow:'0 2px 8px rgba(0,0,0,0.04)',
                  display:'flex', gap:'0', overflow:'hidden' }}>
                  {/* Thumb */}
                  <div style={{ width:'72px', flexShrink:0, background:col+'22',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'1.8rem' }}>
                    {loc.categories?.icon ?? '📍'}
                  </div>
                  {/* Info */}
                  <div style={{ flex:1, padding:'14px 16px',
                    display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' }}>
                    <div style={{ flex:1 }}>
                      <p style={{ fontWeight:700, fontSize:'0.95rem',
                        color:'#0e1a0e', marginBottom:'3px' }}>{loc.name}</p>
                      <p style={{ fontSize:'0.78rem', color:'#8fa68f' }}>
                        {loc.categories?.name} · {loc.regions?.name ?? 'Srbija'}
                      </p>
                    </div>
                    <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                      <span style={{ fontSize:'0.75rem', fontWeight:600, padding:'4px 12px',
                        borderRadius:'999px',
                        background: loc.is_published ? '#f0fdf4' : '#fff7ed',
                        color: loc.is_published ? '#16a34a' : '#ea580c',
                        border: `1px solid ${loc.is_published ? '#bbf7d0' : '#fed7aa'}` }}>
                        {loc.is_published ? '✓ Objavljeno' : '⏳ Na čekanju'}
                      </span>
                      {loc.is_published && (
                        <Link href={`/${loc.countries?.slug ?? 'srbija'}/${cs}/${loc.slug}`}
                          style={{ fontSize:'0.78rem', color:'#2d6a2d', fontWeight:600,
                            textDecoration:'none', padding:'4px 12px', borderRadius:'999px',
                            border:'1px solid #bbf7d0', background:'#f0fdf4' }}>
                          Pogledaj →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
