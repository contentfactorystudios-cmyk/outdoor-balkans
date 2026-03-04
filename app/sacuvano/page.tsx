'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getCardPhoto } from '@/lib/getCategoryPhoto'

const SERIF = "'Fraunces','Playfair Display',Georgia,serif"
const SANS  = "'DM Sans',system-ui,sans-serif"
const CAT_COLOR: Record<string,string> = {
  ribolov:'#1d5fa8', lov:'#5a3010', kajak:'#0e7490',
  kampovanje:'#166534', planinarenje:'#5b21b6', 'nacionalni-parkovi':'#0f766e',
}

export default function SacuvanoPage() {
  const [tab,      setTab]      = useState<'locations'|'events'>('locations')
  const [locs,     setLocs]     = useState<any[]>([])
  const [events,   setEvents]   = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login'); return }
      const uid = data.user.id

      // Sačuvane lokacije
      const { data: savedLocs } = await supabase
        .from('saved_items')
        .select('item_id, created_at')
        .eq('user_id', uid)
        .eq('item_type', 'location')
        .order('created_at', { ascending: false })

      if (savedLocs?.length) {
        const ids = savedLocs.map(s => s.item_id)
        const { data: locData } = await supabase
          .from('locations')
          .select('id,name,slug,short_description,image_url,categories(name,slug,icon),regions(name),countries(slug)')
          .in('id', ids)
          .eq('is_published', true)
        setLocs(locData ?? [])
      }

      // Sačuvani eventi
      const { data: savedEvs } = await supabase
        .from('saved_items')
        .select('item_id, created_at')
        .eq('user_id', uid)
        .eq('item_type', 'event')
        .order('created_at', { ascending: false })

      if (savedEvs?.length) {
        const ids = savedEvs.map(s => s.item_id)
        const { data: evData } = await supabase
          .from('events')
          .select('id,title,category,event_date,location_name,description')
          .in('id', ids)
          .eq('is_approved', true)
        setEvents(evData ?? [])
      }

      setLoading(false)
    })
  }, [])

  const MONTHS_SR = ['Jan','Feb','Mar','Apr','Maj','Jun','Jul','Avg','Sep','Okt','Nov','Dec']

  return (
    <div style={{ fontFamily:SANS, minHeight:'100vh', background:'#f9f7f2', paddingTop:'64px' }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#2d3b2d 0%,#1d5fa8 100%)',
        padding:'48px 24px 40px' }}>
        <div style={{ maxWidth:'800px', margin:'0 auto' }}>
          <Link href='/profil'
            style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.82rem',
              textDecoration:'none', display:'inline-flex', alignItems:'center',
              gap:'4px', marginBottom:'12px' }}>
            ← Profil
          </Link>
          <h1 style={{ fontFamily:SERIF, fontSize:'clamp(1.6rem,3vw,2.2rem)',
            fontWeight:900, color:'#fff', marginBottom:'6px' }}>
            ❤️ Sačuvano
          </h1>
          <p style={{ color:'rgba(255,255,255,0.8)', fontSize:'0.9rem' }}>
            Tvoje omiljene lokacije i događaji
          </p>
        </div>
      </div>

      <div style={{ maxWidth:'800px', margin:'0 auto', padding:'28px 24px 80px' }}>
        {/* Tabs */}
        <div style={{ display:'flex', background:'#fff', borderRadius:'14px',
          padding:'4px', marginBottom:'28px', gap:'4px',
          border:'1px solid #f0ede6', width:'fit-content' }}>
          {[
            { key:'locations', label:'📍 Lokacije', count: locs.length },
            { key:'events',    label:'📅 Događaji', count: events.length },
          ].map(t => (
            <button key={t.key}
              onClick={() => setTab(t.key as any)}
              style={{ padding:'9px 20px', borderRadius:'10px', border:'none',
                background: tab === t.key ? '#2d3b2d' : 'transparent',
                color: tab === t.key ? '#fff' : '#8fa68f',
                fontWeight:700, fontSize:'0.88rem', cursor:'pointer',
                fontFamily:SANS, display:'flex', alignItems:'center', gap:'6px' }}>
              {t.label}
              <span style={{ background: tab===t.key ? 'rgba(255,255,255,0.2)' : '#f0ede6',
                color: tab===t.key ? '#fff' : '#8fa68f',
                borderRadius:'999px', padding:'1px 7px', fontSize:'0.75rem' }}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'16px' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ background:'#fff', borderRadius:'16px', height:'260px',
                border:'1px solid #f0ede6', animation:'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : tab === 'locations' ? (
          locs.length === 0 ? (
            <EmptyState
              icon='📍'
              title='Još nemaš sačuvanih lokacija'
              desc='Klikni ❤️ na bilo kojoj lokaciji da je sačuvaš.'
              link='/pretraga'
              linkLabel='Istraži lokacije'
            />
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'16px' }}>
              {locs.map((loc:any) => {
                const cs = loc.categories?.slug ?? ''
                const col = CAT_COLOR[cs] ?? '#2d6a2d'
                const dispCat = cs === 'rezervati' ? 'nacionalni-parkovi' : cs
                return (
                  <Link key={loc.id}
                    href={`/${loc.countries?.slug ?? 'srbija'}/${dispCat}/${loc.slug}`}
                    style={{ textDecoration:'none' }}>
                    <div style={{ background:'#fff', borderRadius:'16px', overflow:'hidden',
                      border:'1px solid #f0ede6', boxShadow:'0 2px 12px rgba(0,0,0,0.05)',
                      transition:'transform 0.2s' }}
                      onMouseEnter={e=>(e.currentTarget.style.transform='translateY(-3px)')}
                      onMouseLeave={e=>(e.currentTarget.style.transform='none')}>
                      <div style={{ height:'160px', background:col, overflow:'hidden', position:'relative' }}>
                        <img
                          src={getCardPhoto(loc.slug, loc.image_url, cs)}
                          alt={loc.name}
                          style={{ width:'100%', height:'100%', objectFit:'cover' }}
                        />
                        <div style={{ position:'absolute', top:'10px', left:'10px',
                          background:'rgba(0,0,0,0.5)', borderRadius:'999px',
                          padding:'3px 10px', fontSize:'0.72rem', color:'#fff', fontWeight:600 }}>
                          {loc.categories?.icon} {loc.categories?.name}
                        </div>
                      </div>
                      <div style={{ padding:'14px 16px' }}>
                        <p style={{ fontWeight:700, fontSize:'0.92rem', color:'#0e1a0e',
                          marginBottom:'4px', lineHeight:1.3 }}>{loc.name}</p>
                        <p style={{ fontSize:'0.78rem', color:'#8fa68f' }}>
                          📍 {loc.regions?.name ?? 'Srbija'}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )
        ) : (
          events.length === 0 ? (
            <EmptyState
              icon='📅'
              title='Još nemaš sačuvanih događaja'
              desc='Klikni ❤️ na bilo kom događaju u kalendaru.'
              link='/kalendar-aktivnosti'
              linkLabel='Otvori kalendar'
            />
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {events.map((ev:any) => {
                const d = new Date(ev.event_date)
                const col = CAT_COLOR[ev.category] ?? '#2d6a2d'
                return (
                  <div key={ev.id} style={{ background:'#fff', borderRadius:'16px',
                    border:'1px solid #f0ede6', boxShadow:'0 2px 8px rgba(0,0,0,0.04)',
                    display:'flex', overflow:'hidden', gap:0 }}>
                    <div style={{ width:'72px', flexShrink:0, background:col+'22',
                      display:'flex', flexDirection:'column', alignItems:'center',
                      justifyContent:'center', gap:'2px', padding:'12px 0' }}>
                      <span style={{ fontSize:'0.72rem', fontWeight:700,
                        color:col, textTransform:'uppercase' }}>
                        {MONTHS_SR[d.getMonth()]}
                      </span>
                      <span style={{ fontSize:'1.6rem', fontWeight:900, color:col, lineHeight:1 }}>
                        {d.getDate()}
                      </span>
                    </div>
                    <div style={{ flex:1, padding:'14px 16px' }}>
                      <p style={{ fontWeight:700, fontSize:'0.92rem',
                        color:'#0e1a0e', marginBottom:'4px' }}>{ev.title}</p>
                      {ev.location_name && (
                        <p style={{ fontSize:'0.78rem', color:'#8fa68f' }}>
                          📍 {ev.location_name}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        )}
      </div>
    </div>
  )
}

function EmptyState({ icon, title, desc, link, linkLabel }: any) {
  return (
    <div style={{ background:'#fff', borderRadius:'24px', padding:'60px 24px',
      textAlign:'center', border:'1px solid #f0ede6' }}>
      <div style={{ fontSize:'3rem', marginBottom:'16px' }}>{icon}</div>
      <h2 style={{ fontFamily:"'Fraunces','Playfair Display',Georgia,serif",
        fontSize:'1.2rem', fontWeight:700, color:'#0e1a0e', marginBottom:'8px' }}>{title}</h2>
      <p style={{ color:'#8fa68f', marginBottom:'24px', fontSize:'0.9rem' }}>{desc}</p>
      <Link href={link}
        style={{ background:'#2d3b2d', color:'#fff', padding:'12px 28px',
          borderRadius:'14px', textDecoration:'none', fontWeight:700, fontSize:'0.9rem' }}>
        {linkLabel}
      </Link>
    </div>
  )
}
