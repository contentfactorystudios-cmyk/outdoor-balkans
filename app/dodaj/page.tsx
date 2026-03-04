import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dodaj lokaciju ili događaj | OutdoorBalkans',
}

const SERIF = "'Fraunces','Playfair Display',Georgia,serif"
const SANS  = "'DM Sans',system-ui,sans-serif"

export default function DodajPage() {
  return (
    <div style={{ fontFamily:SANS, minHeight:'100vh', background:'#f9f7f2' }}>

      {/* Hero */}
      <div style={{ position:'relative', height:'260px', overflow:'hidden' }}>
        <img src='https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=500&fit=crop&q=80'
          alt='' style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 60%' }} />
        <div style={{ position:'absolute', inset:0,
          background:'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)' }} />
        <div style={{ position:'absolute', bottom:'32px', left:'28px', right:'28px',
          maxWidth:'700px', margin:'0 auto' }}>
          <h1 style={{ fontFamily:SERIF, fontSize:'clamp(1.8rem,4vw,2.8rem)',
            fontWeight:900, color:'#fff', textShadow:'0 2px 12px rgba(0,0,0,0.4)',
            marginBottom:'8px' }}>
            Šta želiš da dodaš?
          </h1>
          <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'1rem' }}>
            Pridruži se OutdoorBalkans zajednici — podeli lokaciju ili organizuj event.
          </p>
        </div>
        <div style={{ position:'absolute', bottom:-1, left:0, right:0 }}>
          <svg viewBox='0 0 1440 30' preserveAspectRatio='none'
            style={{ display:'block', width:'100%', height:'30px' }}>
            <path d='M0 30 C360 5 1080 25 1440 10 L1440 30 Z' fill='#f9f7f2'/>
          </svg>
        </div>
      </div>

      <div style={{ maxWidth:'720px', margin:'0 auto', padding:'40px 24px 80px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>

          {/* Lokacija */}
          <Link href='/predlozi-lokaciju' style={{ textDecoration:'none' }}>
            <div style={{ background:'#fff', borderRadius:'24px', padding:'36px 28px',
              border:'2px solid #e8e2d4', textAlign:'center',
              boxShadow:'0 4px 24px rgba(0,0,0,0.06)',
              transition:'all 0.2s' }}
              onMouseEnter={e=>{
                (e.currentTarget as HTMLElement).style.borderColor='#2d6a2d'
                ;(e.currentTarget as HTMLElement).style.transform='translateY(-4px)'
              }}
              onMouseLeave={e=>{
                (e.currentTarget as HTMLElement).style.borderColor='#e8e2d4'
                ;(e.currentTarget as HTMLElement).style.transform='none'
              }}>
              <div style={{ fontSize:'3.5rem', marginBottom:'16px' }}>📍</div>
              <h2 style={{ fontFamily:SERIF, fontSize:'1.3rem', fontWeight:800,
                color:'#0e1a0e', marginBottom:'10px' }}>Predloži lokaciju</h2>
              <p style={{ color:'#8fa68f', fontSize:'0.88rem', lineHeight:1.6,
                marginBottom:'20px' }}>
                Ribolovište, lovište, planinarska staza, kamp ili nacionalni park.
              </p>
              <div style={{ display:'flex', gap:'6px', justifyContent:'center', flexWrap:'wrap',
                marginBottom:'24px' }}>
                {['🎣','🦌','🚣','⛺','🥾','🦋'].map(ic => (
                  <span key={ic} style={{ fontSize:'1.2rem', width:'36px', height:'36px',
                    background:'#f9f7f2', borderRadius:'10px', display:'flex',
                    alignItems:'center', justifyContent:'center' }}>{ic}</span>
                ))}
              </div>
              <div style={{ background:'#2d6a2d', color:'#fff', padding:'12px 24px',
                borderRadius:'12px', fontWeight:700, fontSize:'0.9rem', display:'inline-block' }}>
                Predloži lokaciju →
              </div>
            </div>
          </Link>

          {/* Događaj */}
          <Link href='/dodaj-dogadjaj' style={{ textDecoration:'none' }}>
            <div style={{ background:'#fff', borderRadius:'24px', padding:'36px 28px',
              border:'2px solid #e8e2d4', textAlign:'center',
              boxShadow:'0 4px 24px rgba(0,0,0,0.06)',
              transition:'all 0.2s' }}
              onMouseEnter={e=>{
                (e.currentTarget as HTMLElement).style.borderColor='#1d5fa8'
                ;(e.currentTarget as HTMLElement).style.transform='translateY(-4px)'
              }}
              onMouseLeave={e=>{
                (e.currentTarget as HTMLElement).style.borderColor='#e8e2d4'
                ;(e.currentTarget as HTMLElement).style.transform='none'
              }}>
              <div style={{ fontSize:'3.5rem', marginBottom:'16px' }}>📅</div>
              <h2 style={{ fontFamily:SERIF, fontSize:'1.3rem', fontWeight:800,
                color:'#0e1a0e', marginBottom:'10px' }}>Predloži događaj</h2>
              <p style={{ color:'#8fa68f', fontSize:'0.88rem', lineHeight:1.6,
                marginBottom:'20px' }}>
                Takmičenje, tournament, grupni pohod, festival ili sezonski izlazak.
              </p>
              <div style={{ display:'flex', gap:'6px', justifyContent:'center', flexWrap:'wrap',
                marginBottom:'24px' }}>
                {['🏆','🎯','🏕️','🌄','🤝','🎉'].map(ic => (
                  <span key={ic} style={{ fontSize:'1.2rem', width:'36px', height:'36px',
                    background:'#f9f7f2', borderRadius:'10px', display:'flex',
                    alignItems:'center', justifyContent:'center' }}>{ic}</span>
                ))}
              </div>
              <div style={{ background:'#1d5fa8', color:'#fff', padding:'12px 24px',
                borderRadius:'12px', fontWeight:700, fontSize:'0.9rem', display:'inline-block' }}>
                Predloži događaj →
              </div>
            </div>
          </Link>
        </div>

        {/* Info box */}
        <div style={{ marginTop:'28px', background:'#fff', borderRadius:'20px',
          padding:'24px 28px', border:'1px solid #f0ede6',
          display:'flex', gap:'16px', alignItems:'flex-start' }}>
          <span style={{ fontSize:'1.6rem', flexShrink:0 }}>ℹ️</span>
          <div>
            <p style={{ fontWeight:700, color:'#0e1a0e', marginBottom:'6px' }}>Kako funkcioniše?</p>
            <p style={{ color:'#8fa68f', fontSize:'0.88rem', lineHeight:1.7 }}>
              Svaki predlog prolazi kroz <strong style={{ color:'#0e1a0e' }}>admin pregled</strong> pre objavljivanja.
              Lokacije se dodaju u bazu i pojavljuju na sajtu, događaji na kalendaru.
              Obično odobravamo u roku od 24–48 sati.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
