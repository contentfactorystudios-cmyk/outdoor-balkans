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
