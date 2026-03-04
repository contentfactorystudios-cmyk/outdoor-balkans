import ActivityCalendar from '@/components/ActivityCalendar'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kalendar Aktivnosti | OutdoorBalkans',
  description: 'Outdoor eventi, sezone i aktivnosti na Balkanu',
}

export default async function KalendarPage() {
  const { data: locations } = await supabase
    .from('locations')
    .select('id,name,slug,categories(name,slug,icon),regions(name),countries(slug)')
    .eq('is_published', true)
    .limit(100)

  return (
    <div>
      {/* Static hero */}
      <div style={{ position:'relative', height:'220px', overflow:'hidden', marginTop:'64px' }}>
        <img src='https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&h=400&fit=crop&q=80'
          alt='Kalendar' style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 60%' }} />
        <div style={{ position:'absolute', inset:0,
          background:'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)' }} />
        <div style={{ position:'absolute', bottom:'28px', left:'28px', right:'28px',
          display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
          <div>
            <h1 style={{ fontFamily:"'Fraunces','Playfair Display',Georgia,serif",
              fontSize:'clamp(1.6rem,3vw,2.4rem)', fontWeight:900, color:'#fff',
              textShadow:'0 2px 12px rgba(0,0,0,0.4)', marginBottom:'4px' }}>
              📅 Kalendar aktivnosti
            </h1>
            <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'0.9rem' }}>
              Outdoor eventi, sezone i takmičenja na Balkanu
            </p>
          </div>
          <a href='/dodaj-dogadjaj'
            style={{ background:'rgba(255,255,255,0.2)', color:'#fff', padding:'10px 22px',
              borderRadius:'12px', textDecoration:'none', fontWeight:700, fontSize:'0.9rem',
              border:'1px solid rgba(255,255,255,0.4)', backdropFilter:'blur(8px)',
              whiteSpace:'nowrap' }}>
            + Prijavi događaj
          </a>
        </div>
      </div>

      {/* Banner za dodaj dogadjaj */}
      <div style={{ background:'linear-gradient(135deg, #1d5fa8ee 0%, #0e7490bb 100%)',
        padding:'18px 24px', display:'flex', alignItems:'center',
        justifyContent:'space-between', flexWrap:'wrap', gap:'12px',
        marginTop:'64px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <span style={{ fontSize:'1.4rem' }}>📅</span>
          <div>
            <p style={{ color:'#fff', fontWeight:700, fontSize:'0.95rem', marginBottom:'2px' }}>
              Imaš outdoor događaj?
            </p>
            <p style={{ color:'rgba(255,255,255,0.8)', fontSize:'0.82rem' }}>
              Takmičenje, izlazak, festival — podeli sa zajednicom!
            </p>
          </div>
        </div>
        <Link href='/dodaj-dogadjaj'
          style={{ background:'rgba(255,255,255,0.2)', color:'#fff', padding:'10px 22px',
            borderRadius:'12px', textDecoration:'none', fontWeight:700, fontSize:'0.9rem',
            border:'1px solid rgba(255,255,255,0.35)', backdropFilter:'blur(8px)',
            whiteSpace:'nowrap' }}>
          + Prijavi događaj
        </Link>
      </div>
      <ActivityCalendar locations={locations ?? []} />
    </div>
  )
}
