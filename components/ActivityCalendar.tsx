'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'

const SERIF = "'Fraunces','Playfair Display',Georgia,serif"
const SANS  = "'DM Sans',system-ui,sans-serif"

const SEASONS: Record<string, { months: number[]; icon: string; color: string; label: string }> = {
  ribolov:             { months: [4,5,6,7,8,9,10],             icon: '🎣', color: '#1d5fa8', label: 'Ribolov' },
  lov:                 { months: [9,10,11,12,1,2],              icon: '🦌', color: '#5a3010', label: 'Lov' },
  kajak:               { months: [4,5,6,7,8,9],                 icon: '🚣', color: '#0e7490', label: 'Kajak' },
  kampovanje:          { months: [5,6,7,8,9],                   icon: '⛺', color: '#166534', label: 'Kampovanje' },
  planinarenje:        { months: [4,5,6,7,8,9,10],             icon: '🥾', color: '#5b21b6', label: 'Planinarenje' },
  'nacionalni-parkovi':{ months: [1,2,3,4,5,6,7,8,9,10,11,12], icon: '🦋', color: '#0f766e', label: 'Nacionalni parkovi' },
}

const MONTHS_SR = ['Januar','Februar','Mart','April','Maj','Jun','Jul','Avgust','Septembar','Oktobar','Novembar','Decembar']
const DAYS_SR   = ['Pon','Uto','Sre','Čet','Pet','Sub','Ned']

// Vesti sa kategorijama i linkovima
const ALL_NEWS = [
  { id:1, date:'2025-03-01', category:'ribolov',            cat:'🎣',
    title:'Nova regulativa ribolova za 2025.',
    excerpt:'Ministarstvo je objavilo izmene dozvola za ribolov na rekama I i II kategorije.',
    link:'https://www.ribolovacki-savez-srbije.rs', linkLabel:'Pročitaj više' },
  { id:2, date:'2025-02-28', category:'planinarenje',       cat:'🥾',
    title:'Otvoren novi trail na Staroj Planini',
    excerpt:'Turistička organizacija otvorila 42km stazu sa 5 kampista duž trase.',
    link:'https://sr.wikipedia.org/wiki/Стара_планина', linkLabel:'O Staroj Planini' },
  { id:3, date:'2025-02-25', category:'lov',                cat:'🦌',
    title:'Sezona lova na fazane — rezultati',
    excerpt:'Rekordna sezona u Vojvodini — više od 40.000 fazana na lovištima.',
    link:'https://www.lss.rs', linkLabel:'Lovački savez Srbije' },
  { id:4, date:'2025-02-20', category:'kajak',              cat:'🚣',
    title:'Tara proglašena najboljom kajak rekom EU',
    excerpt:'Evropska kajak federacija dodelila prestižno priznanje reci Tari.',
    link:'https://sr.wikipedia.org/wiki/Река_Тара', linkLabel:'O reci Tara' },
  { id:5, date:'2025-02-15', category:'kampovanje',         cat:'⛺',
    title:'Top 10 kampova u Srbiji za 2025.',
    excerpt:'Naši urednici rangirali najlepše kampove — od Zlatibora do Đerdapa.',
    link:'/srbija/kampovanje', linkLabel:'Kampovi u Srbiji', internal:true },
  { id:6, date:'2025-02-10', category:'nacionalni-parkovi', cat:'🦋',
    title:'Zasavica: novi posmatrački toranj otvoren',
    excerpt:'Specijalni rezervat prirode dobio modernu infrastrukturu za ekoturizam.',
    link:'https://www.zasavica.org.rs', linkLabel:'Zasavica zvanični sajt' },
  { id:7, date:'2025-01-28', category:'ribolov',            cat:'🎣',
    title:'Rekordni šaran uhvaćen na Đerdapu — 48kg',
    excerpt:'Srpski ribolovac oborio rekord Balkana. Riba vraćena u vodu.',
    link:'https://sr.wikipedia.org/wiki/Ђердапско_језеро', linkLabel:'Đerdapsko jezero' },
  { id:8, date:'2025-01-20', category:'planinarenje',       cat:'🥾',
    title:'Kopaonik — nova gondola otvorena za pešake',
    excerpt:'Ski centar uveo posebne termine za planinarenje i MTB.',
    link:'https://www.skijalistasrbije.rs', linkLabel:'Ski centri Srbije' },
]

function generateEvents(year: number) {
  const static_ev = [
    { id:'e1', date:new Date(year,3,15),  type:'event', category:'ribolov',
      icon:'🏆', color:'#1d5fa8', title:'Ribolovačko takmičenje — Dunav',
      location:'Beograd', desc:'Godišnje takmičenje. Kategorije: šaran, som, štuka.',
      link:'https://www.ribolovacki-savez-srbije.rs', linkLabel:'Ribolovački savez Srbije' },
    { id:'e2', date:new Date(year,4,20),  type:'event', category:'planinarenje',
      icon:'🥾', color:'#5b21b6', title:'Maraton Kopaonik 2025',
      location:'Kopaonik', desc:'Planinarski maraton 42km sa 1800m uspona.',
      link:'https://www.kopaonikmarathon.rs', linkLabel:'Zvanični sajt maratona' },
    { id:'e3', date:new Date(year,5,8),   type:'event', category:'kajak',
      icon:'🏅', color:'#0e7490', title:'Kajak kup — Tara',
      location:'Tara', desc:'Nacionalni kajak kup na reci Tari. Klasa III-IV.',
      link:'https://sr.wikipedia.org/wiki/Река_Тара', linkLabel:'O reci Tara' },
    { id:'e4', date:new Date(year,6,12),  type:'event', category:'kampovanje',
      icon:'⛺', color:'#166534', title:'Outdoor Fest Zlatibor',
      location:'Zlatibor', desc:'Festival kampovanja i outdoor sporta. 3 dana.',
      link:'https://www.zlatibor.rs', linkLabel:'Zlatibor turistička org.' },
    { id:'e5', date:new Date(year,7,25),  type:'event', category:'planinarenje',
      icon:'🏔️', color:'#5b21b6', title:'Trail Stara Planina',
      location:'Stara Planina', desc:'Trail trčanje — ultra 80km i sprint 20km.',
      link:'https://sr.wikipedia.org/wiki/Стара_планина', linkLabel:'O Staroj Planini' },
    { id:'e6', date:new Date(year,8,14),  type:'event', category:'ribolov',
      icon:'🎣', color:'#1d5fa8', title:'Kup Srbije — Šaran',
      location:'Đerdap', desc:'Kup Srbije u sportskom ribolovu.',
      link:'https://sr.wikipedia.org/wiki/Ђердапско_језеро', linkLabel:'Đerdapsko jezero' },
    { id:'e7', date:new Date(year,9,5),   type:'event', category:'lov',
      icon:'🦌', color:'#5a3010', title:'Svečano otvorenje sezone lova',
      location:'Vojvodina', desc:'Godišnje otvorenje lovačke sezone.',
      link:'https://www.lss.rs', linkLabel:'Lovački savez Srbije' },
    { id:'e8', date:new Date(year,10,11), type:'event', category:'planinarenje',
      icon:'🏔️', color:'#5b21b6', title:'Zimski pohod — Rtanj',
      location:'Rtanj', desc:'Grupni pohod, polazak u 8h. Zimska oprema obavezna.',
      link:'https://sr.wikipedia.org/wiki/Ртањ', linkLabel:'Sve o Rtnju' },
    { id:'e9', date:new Date(year,2,22),  type:'event', category:'ribolov',
      icon:'🌿', color:'#16a34a', title:'Dan zaštite ribe',
      location:'Srbija', desc:'Svake godine 22. marta — Dan bez ribolova.',
      link:'https://sr.wikipedia.org/wiki/Светски_дан_вода', linkLabel:'Svetski dan voda' },
    { id:'e10',date:new Date(year,5,21),  type:'event', category:'kampovanje',
      icon:'🌙', color:'#166534', title:'Letnji solsticij — Noć kampera',
      location:'Tara', desc:'Kamp doček najduljeg dana. Vatromet i živa muzika.',
      link:'https://sr.wikipedia.org/wiki/Летњи_солстициј', linkLabel:'O letnjem solsticiju' },
    { id:'e11',date:new Date(year,3,20),  type:'event', category:'nacionalni-parkovi',
      icon:'🦋', color:'#0f766e', title:'Dan nacionalnih parkova Srbije',
      location:'Tara', desc:'Besplatan ulaz u sve nacionalne parkove Srbije.',
      link:'https://www.npTara.rs', linkLabel:'NP Tara zvanični sajt' },
  ]
  const season_ev: any[] = []
  Object.entries(SEASONS).forEach(([slug, s]) => {
    s.months.forEach(m => {
      const prev = m-1===0?12:m-1
      const next = m+1>12?1:m+1
      if (!s.months.includes(prev)) {
        season_ev.push({ id:`ss-${slug}-${m}`, date:new Date(year,m-1,1),
          type:'season-start', category:slug, title:`Sezona ${s.label} počinje`,
          color:s.color, icon:s.icon, desc:`Počinje sezona za ${s.label}.`,
          link:`/srbija/${slug}`, linkLabel:`Lokacije za ${s.label}`, internal:true })
      }
      if (!s.months.includes(next)) {
        const last = new Date(year,m,0).getDate()
        season_ev.push({ id:`se-${slug}-${m}`, date:new Date(year,m-1,last),
          type:'season-end', category:slug, title:`Sezona ${s.label} se zatvara`,
          color:s.color, icon:s.icon, desc:`Poslednji dan sezone za ${s.label}.`,
          link:`/srbija/${slug}`, linkLabel:`Sve lokacije`, internal:true })
      }
    })
  })
  return [...static_ev, ...season_ev]
}

// Preporuka aktivnosti po vremenu i kategoriji
function getWeatherRec(code: number, temp: number, filterCat: string[]) {
  const cats = filterCat.length > 0 ? filterCat : Object.keys(SEASONS)
  if (code >= 95) return { icon:'⚠️', text:'Oluja — ostani kod kuće', col:'#f87171' }
  if (code >= 61) {
    if (cats.includes('ribolov')) return { icon:'🎣', text:'Kiša — idealno za ribolov!', col:'#93c5fd' }
    return { icon:'🌧️', text:'Kiša — nije idealno za outdoor', col:'#93c5fd' }
  }
  if (temp > 28) {
    if (cats.includes('kajak')) return { icon:'🚣', text:'Vrućina — savršeno za kajak!', col:'#fbbf24' }
    if (cats.includes('kampovanje')) return { icon:'⛺', text:'Vruće — kampovanje uz vodu!', col:'#fbbf24' }
    return { icon:'🌡️', text:'Vrućina — hidratacija obavezna', col:'#fbbf24' }
  }
  if (temp < 2) {
    if (cats.includes('lov')) return { icon:'🦌', text:'Mraz — sezona lova!', col:'#a5b4fc' }
    return { icon:'🥶', text:'Mraz — topla oprema obavezna', col:'#a5b4fc' }
  }
  if (cats.includes('planinarenje')) return { icon:'🥾', text:'Odlično za planinarenje!', col:'#4ade80' }
  if (cats.includes('ribolov')) return { icon:'🎣', text:'Dobri uslovi za ribolov!', col:'#4ade80' }
  return { icon:'🌿', text:'Odlični uslovi za outdoor!', col:'#4ade80' }
}

export default function ActivityCalendar({ locations }: { locations: any[] }) {
  const now   = new Date()
  const [year,  setYear]   = useState(now.getFullYear())
  const [month, setMonth]  = useState(now.getMonth())
  const [selDay, setSelDay] = useState<Date|null>(null)
  const [selEvent, setSelEvent] = useState<any|null>(null)
  const [filterCat, setFilterCat] = useState<string[]>([])
  const [weather, setWeather] = useState<any>(null)
  const [mobTab, setMobTab] = useState<'cal'|'eventi'|'vesti'>('cal')

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=44.82&longitude=20.46&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum&timezone=Europe/Belgrade&forecast_days=14')
      .then(r=>r.json()).then(setWeather).catch(()=>{})
  }, [])

  const allEvents = useMemo(() => generateEvents(year), [year])

  const visible = useMemo(() =>
    filterCat.length===0 ? allEvents : allEvents.filter(e=>filterCat.includes(e.category)),
    [allEvents, filterCat])

  const daysInMonth = new Date(year,month+1,0).getDate()
  const firstDOW    = (new Date(year,month,1).getDay()+6)%7

  const evByDay = useMemo(()=>{
    const m: Record<string,any[]> = {}
    visible.forEach(e=>{
      if(e.date.getFullYear()===year && e.date.getMonth()===month){
        const k=e.date.getDate().toString()
        if(!m[k])m[k]=[]
        m[k].push(e)
      }
    })
    return m
  },[visible,year,month])

  const upcoming = useMemo(()=>
    (filterCat.length===0?allEvents:allEvents.filter(e=>filterCat.includes(e.category)))
      .filter(e=>e.type==='event' && e.date>=now)
      .sort((a,b)=>a.date.getTime()-b.date.getTime())
      .slice(0,6),
    [allEvents,filterCat])

  // Vesti filtrirane po kategoriji
  const filteredNews = useMemo(()=>
    filterCat.length===0 ? ALL_NEWS : ALL_NEWS.filter(n=>filterCat.includes(n.category)),
    [filterCat])

  const activeSeasons = Object.entries(SEASONS).filter(([,s])=>s.months.includes(month+1))

  // Aktivne sezone filtrirane
  const activeSeasonsFiltered = useMemo(()=>
    filterCat.length===0 ? activeSeasons
    : activeSeasons.filter(([slug])=>filterCat.includes(slug)),
    [activeSeasons, filterCat])

  const wxMap: Record<string,any> = {}
  if(weather?.daily){
    weather.daily.time.forEach((d:string,i:number)=>{
      wxMap[d]={
        max:Math.round(weather.daily.temperature_2m_max[i]),
        min:Math.round(weather.daily.temperature_2m_min[i]),
        code:weather.daily.weathercode[i],
        rain:weather.daily.precipitation_sum[i]
      }
    })
  }

  function wxIcon(c:number){if(c===0)return'☀️';if(c<=3)return'⛅';if(c<=48)return'🌫️';if(c<=65)return'🌧️';if(c<=75)return'❄️';if(c<=81)return'🌦️';return'⛈️'}
  function fmtDate(d:Date){return`${d.getDate()}. ${MONTHS_SR[d.getMonth()]}`}
  const prevM=()=>{if(month===0){setMonth(11);setYear(y=>y-1)}else setMonth(m=>m-1)}
  const nextM=()=>{if(month===11){setMonth(0);setYear(y=>y+1)}else setMonth(m=>m+1)}

  const recLocs = useMemo(()=>{
    const shown:any[]=[]
    const cats = filterCat.length>0
      ? activeSeasonsFiltered : activeSeasons
    cats.slice(0,3).forEach(([slug,s])=>{
      locations.filter(l=>l.categories?.slug===slug||l.categories?.slug==='rezervati'&&slug==='nacionalni-parkovi')
        .slice(0,2).forEach(loc=>shown.push({loc,s:s as any,slug}))
    })
    return shown.slice(0,6)
  },[locations,filterCat,month,activeSeasonsFiltered])

  // Filter bar komponenta
  const FilterBar = ()=>(
    <div style={{display:'flex',gap:'6px',flexWrap:'wrap',alignItems:'center'}}>
      <span style={{fontSize:'0.75rem',color:'#8fa68f',fontWeight:600,marginRight:'4px'}}>Filter:</span>
      {Object.entries(SEASONS).map(([slug,s])=>{
        const on=filterCat.includes(slug)
        return(
          <button key={slug}
            onClick={()=>setFilterCat(f=>on?f.filter(c=>c!==slug):[...f,slug])}
            style={{display:'flex',alignItems:'center',gap:'4px',
              padding:'5px 11px',borderRadius:'999px',border:'1.5px solid',
              borderColor:on?s.color:'#e8e2d4',background:on?s.color:'transparent',
              color:on?'#fff':'#555',fontSize:'0.76rem',fontWeight:600,
              cursor:'pointer',fontFamily:SANS,transition:'all 0.15s'}}>
            {s.icon} {s.label}
          </button>
        )
      })}
      {filterCat.length>0&&(
        <button onClick={()=>setFilterCat([])}
          style={{padding:'5px 11px',borderRadius:'999px',border:'1.5px solid #e8e2d4',
            background:'transparent',color:'#999',fontSize:'0.76rem',cursor:'pointer',fontFamily:SANS}}>
          ✕ Sve kategorije
        </button>
      )}
    </div>
  )

  const CalGrid = ()=>(
    <>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'14px'}}>
        <button onClick={prevM} style={{background:'#f4f0e6',border:'none',borderRadius:'10px',
          width:'38px',height:'38px',cursor:'pointer',fontSize:'1.2rem',
          display:'flex',alignItems:'center',justifyContent:'center'}}>‹</button>
        <h2 style={{fontFamily:SERIF,fontSize:'1.3rem',fontWeight:700,color:'#0e1a0e'}}>
          {MONTHS_SR[month]} {year}
        </h2>
        <button onClick={nextM} style={{background:'#f4f0e6',border:'none',borderRadius:'10px',
          width:'38px',height:'38px',cursor:'pointer',fontSize:'1.2rem',
          display:'flex',alignItems:'center',justifyContent:'center'}}>›</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:'2px',marginBottom:'4px'}}>
        {DAYS_SR.map(d=>(
          <div key={d} style={{textAlign:'center',fontSize:'0.65rem',fontWeight:700,
            color:'#8fa68f',padding:'4px 0',textTransform:'uppercase'}}>{d}</div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:'3px'}}>
        {Array.from({length:firstDOW}).map((_,i)=><div key={`e${i}`}/>)}
        {Array.from({length:daysInMonth}).map((_,i)=>{
          const day=i+1
          const dayEvs=evByDay[day.toString()]??[]
          const isToday=day===now.getDate()&&month===now.getMonth()&&year===now.getFullYear()
          const isSel=selDay?.getDate()===day&&selDay?.getMonth()===month
          const dateStr=`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
          const wx=wxMap[dateStr]
          return(
            <button key={day} onClick={()=>setSelDay(isSel?null:new Date(year,month,day))}
              style={{padding:'4px 1px 3px',borderRadius:'9px',
                border:isSel?'2px solid #2d6a2d':isToday?'2px solid #6ab87a':'2px solid transparent',
                background:isSel?'#e8f5e8':isToday?'#f0fdf0':'#fafaf8',
                cursor:'pointer',minHeight:'50px',fontFamily:SANS,
                display:'flex',flexDirection:'column',alignItems:'center',gap:'1px'}}>
              <span style={{fontSize:'0.78rem',fontWeight:isToday?800:600,
                color:isToday?'#2d6a2d':'#0e1a0e'}}>{day}</span>
              {wx&&<span style={{fontSize:'0.58rem',color:'#aaa'}}>{wxIcon(wx.code)}{wx.max}°</span>}
              {dayEvs.length>0&&(
                <div style={{display:'flex',gap:'2px',justifyContent:'center'}}>
                  {dayEvs.slice(0,3).map((e,idx)=>(
                    <span key={idx} style={{width:'6px',height:'6px',borderRadius:'50%',
                      background:e.color,display:'block'}}/>
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </>
  )

  const SelDayPanel = ()=>(
    selDay?(
      <div style={{background:'#f9f7f2',borderRadius:'14px',padding:'16px',marginTop:'16px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
          <h3 style={{fontFamily:SERIF,fontSize:'0.95rem',fontWeight:700,color:'#0e1a0e'}}>{fmtDate(selDay)}</h3>
          <button onClick={()=>setSelDay(null)} style={{background:'none',border:'none',cursor:'pointer',color:'#aaa'}}>✕</button>
        </div>
        {(evByDay[selDay.getDate().toString()]??[]).length>0
          ?(evByDay[selDay.getDate().toString()]??[]).map(e=>(
            <div key={e.id} style={{display:'flex',gap:'10px',padding:'10px 0',
              borderBottom:'1px solid #f0ede6',cursor:'pointer'}}
              onClick={()=>setSelEvent(e)}>
              <div style={{width:'36px',height:'36px',borderRadius:'10px',
                background:e.color+'22',display:'flex',alignItems:'center',
                justifyContent:'center',fontSize:'1rem',flexShrink:0}}>{e.icon}</div>
              <div>
                <p style={{fontWeight:700,fontSize:'0.85rem',color:'#0e1a0e',marginBottom:'2px'}}>{e.title}</p>
                {e.location&&<p style={{fontSize:'0.72rem',color:'#8fa68f'}}>📍 {e.location}</p>}
                <span style={{fontSize:'0.7rem',color:'#2d6a2d',fontWeight:600}}>Detalji →</span>
              </div>
            </div>
          ))
          :<p style={{color:'#8fa68f',fontSize:'0.85rem'}}>Nema aktivnosti ovog dana.</p>
        }
      </div>
    ):null
  )

  const EventModal = ()=>(
    selEvent?(
      <div style={{position:'fixed',inset:0,zIndex:999,background:'rgba(0,0,0,0.55)',
        backdropFilter:'blur(4px)',display:'flex',alignItems:'center',
        justifyContent:'center',padding:'20px'}} onClick={()=>setSelEvent(null)}>
        <div style={{background:'#fff',borderRadius:'24px',padding:'28px',
          maxWidth:'460px',width:'100%',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}
          onClick={e=>e.stopPropagation()}>
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'16px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
              <div style={{width:'50px',height:'50px',borderRadius:'16px',
                background:selEvent.color+'22',display:'flex',alignItems:'center',
                justifyContent:'center',fontSize:'1.5rem'}}>{selEvent.icon}</div>
              <div>
                <div style={{fontSize:'0.7rem',fontWeight:700,color:selEvent.color,
                  textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'2px'}}>
                  {SEASONS[selEvent.category as keyof typeof SEASONS]?.label??selEvent.category}
                </div>
                <h3 style={{fontFamily:SERIF,fontSize:'1.05rem',fontWeight:700,
                  color:'#0e1a0e',lineHeight:1.3}}>{selEvent.title}</h3>
              </div>
            </div>
            <button onClick={()=>setSelEvent(null)} style={{background:'#f4f0e6',border:'none',
              borderRadius:'10px',width:'34px',height:'34px',cursor:'pointer',
              display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>✕</button>
          </div>
          <div style={{background:'#f9f7f2',borderRadius:'12px',padding:'12px',marginBottom:'14px',
            display:'flex',gap:'20px',flexWrap:'wrap'}}>
            <div>
              <p style={{fontSize:'0.68rem',color:'#8fa68f',fontWeight:600,marginBottom:'2px'}}>DATUM</p>
              <p style={{fontSize:'0.88rem',fontWeight:700,color:'#0e1a0e'}}>{fmtDate(selEvent.date)}</p>
            </div>
            {selEvent.location&&(
              <div>
                <p style={{fontSize:'0.68rem',color:'#8fa68f',fontWeight:600,marginBottom:'2px'}}>LOKACIJA</p>
                <p style={{fontSize:'0.88rem',fontWeight:700,color:'#0e1a0e'}}>📍 {selEvent.location}</p>
              </div>
            )}
          </div>
          {selEvent.desc&&(
            <p style={{fontSize:'0.88rem',color:'#555',lineHeight:1.6,marginBottom:'18px'}}>{selEvent.desc}</p>
          )}
          {selEvent.link&&(
            selEvent.internal?(
              <Link href={selEvent.link}
                style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',
                  background:'#2d6a2d',color:'#fff',padding:'13px',borderRadius:'12px',
                  textDecoration:'none',fontWeight:700,fontSize:'0.9rem'}}
                onClick={()=>setSelEvent(null)}>
                {selEvent.icon} {selEvent.linkLabel}
              </Link>
            ):(
              <a href={selEvent.link} target='_blank' rel='noopener noreferrer'
                style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',
                  background:'#0e1a0e',color:'#fff',padding:'13px',borderRadius:'12px',
                  textDecoration:'none',fontWeight:700,fontSize:'0.9rem'}}>
                🔗 {selEvent.linkLabel}
                <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5'>
                  <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'/>
                  <polyline points='15,3 21,3 21,9'/><line x1='10' y1='14' x2='21' y2='3'/>
                </svg>
              </a>
            )
          )}
        </div>
      </div>
    ):null
  )

  const UpcomingPanel = ()=>(
    <div style={{background:'#fff',borderRadius:'20px',padding:'20px',
      boxShadow:'0 2px 20px rgba(0,0,0,0.06)',border:'1px solid #f0ede6'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'14px'}}>
        <h3 style={{fontFamily:SERIF,fontSize:'1.05rem',fontWeight:700,color:'#0e1a0e'}}>📅 Nadolazeći eventi</h3>
        {filterCat.length>0&&<span style={{fontSize:'0.7rem',background:'#f4f0e6',
          padding:'3px 8px',borderRadius:'999px',color:'#666'}}>Filtrirano</span>}
      </div>
      {upcoming.length>0?upcoming.map((e,i)=>(
        <div key={e.id} onClick={()=>setSelEvent(e)}
          style={{display:'flex',gap:'12px',cursor:'pointer',padding:'8px',
            borderRadius:'10px',transition:'background 0.15s',
            marginBottom:i<upcoming.length-1?'2px':0}}
          onMouseEnter={el=>(el.currentTarget as HTMLElement).style.background='#f9f7f2'}
          onMouseLeave={el=>(el.currentTarget as HTMLElement).style.background='transparent'}>
          <div style={{width:'44px',flexShrink:0,textAlign:'center'}}>
            <div style={{background:e.color+'18',borderRadius:'10px',padding:'5px 4px'}}>
              <div style={{fontSize:'0.95rem'}}>{e.icon}</div>
              <div style={{fontSize:'0.58rem',fontWeight:700,color:e.color,lineHeight:1.2}}>
                {e.date.getDate()}<br/>{MONTHS_SR[e.date.getMonth()].slice(0,3)}
              </div>
            </div>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <p style={{fontWeight:700,fontSize:'0.83rem',color:'#0e1a0e',marginBottom:'1px',lineHeight:1.3}}>{e.title}</p>
            {e.location&&<p style={{fontSize:'0.72rem',color:'#8fa68f'}}>📍 {e.location}</p>}
            <p style={{fontSize:'0.7rem',color:'#2d6a2d',fontWeight:600,marginTop:'1px'}}>Detalji →</p>
          </div>
        </div>
      )):(
        <p style={{color:'#8fa68f',fontSize:'0.85rem',padding:'8px 0'}}>
          {filterCat.length>0?'Nema događaja za izabranu kategoriju.':'Nema nadolazećih događaja.'}
        </p>
      )}
    </div>
  )

  const LocsPanel = ()=>(
    <div style={{background:'#fff',borderRadius:'20px',padding:'20px',
      boxShadow:'0 2px 20px rgba(0,0,0,0.06)',border:'1px solid #f0ede6'}}>
      <h3 style={{fontFamily:SERIF,fontSize:'1.05rem',fontWeight:700,color:'#0e1a0e',marginBottom:'4px'}}>
        🗺️ Preporučene lokacije
      </h3>
      <p style={{fontSize:'0.73rem',color:'#8fa68f',marginBottom:'14px'}}>
        {MONTHS_SR[month]} · {filterCat.length>0?filterCat.map(c=>SEASONS[c as keyof typeof SEASONS]?.label).join(', '):'Sve aktivne sezone'}
      </p>
      {recLocs.length>0?recLocs.map(({loc,s,slug},i)=>(
        <Link key={loc.id} href={'/'+(loc.countries?.slug??'srbija')+'/'+slug+'/'+loc.slug}
          style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 0',
            textDecoration:'none',borderBottom:i<recLocs.length-1?'1px solid #f4f0e6':'none'}}>
          <div style={{width:'36px',height:'36px',borderRadius:'10px',
            background:(s as any).color+'22',display:'flex',alignItems:'center',
            justifyContent:'center',fontSize:'1rem',flexShrink:0}}>{(s as any).icon}</div>
          <div style={{flex:1,minWidth:0}}>
            <p style={{fontSize:'0.81rem',fontWeight:700,color:'#0e1a0e',
              overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{loc.name}</p>
            <p style={{fontSize:'0.71rem',color:'#8fa68f'}}>{loc.regions?.name??'Srbija'}</p>
          </div>
          <svg width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='#ccc' strokeWidth='2'>
            <path d='M9 18l6-6-6-6'/>
          </svg>
        </Link>
      )):<p style={{color:'#8fa68f',fontSize:'0.84rem'}}>Nema lokacija za izabrani filter.</p>}
    </div>
  )

  const WeatherPanel = ()=>{
    const rec = weather?.daily
      ? getWeatherRec(wxMap[weather.daily.time[0]]?.code??0, wxMap[weather.daily.time[0]]?.max??15, filterCat)
      : null
    return(
      <div style={{background:'linear-gradient(135deg,#1a3d6e 0%,#2563ab 100%)',
        borderRadius:'20px',padding:'20px',color:'#fff'}}>
        <p style={{fontSize:'0.72rem',fontWeight:700,textTransform:'uppercase',
          letterSpacing:'0.12em',color:'rgba(255,255,255,0.6)',marginBottom:'8px'}}>
          🌤️ Prognoza — Beograd
          {filterCat.length>0&&<span style={{marginLeft:'6px',opacity:0.7}}>
            ({filterCat.map(c=>SEASONS[c as keyof typeof SEASONS]?.icon).join('')})
          </span>}
        </p>
        {weather?.daily?(
          <>
            <div style={{display:'flex',flexDirection:'column',gap:'4px',marginBottom:'10px'}}>
              {weather.daily.time.slice(0,7).map((d:string,i:number)=>{
                const wx=wxMap[d]
                const date=new Date(d)
                const lbl=i===0?'Danas':i===1?'Sutra':DAYS_SR[(date.getDay()+6)%7]
                return(
                  <div key={d} style={{display:'flex',alignItems:'center',gap:'8px',
                    padding:'6px 10px',borderRadius:'10px',
                    background:i===0?'rgba(255,255,255,0.18)':'rgba(255,255,255,0.07)'}}>
                    <span style={{width:'32px',fontSize:'0.74rem',fontWeight:700,
                      color:i===0?'#fff':'rgba(255,255,255,0.65)'}}>{lbl}</span>
                    <span style={{fontSize:'0.95rem'}}>{wxIcon(wx?.code??0)}</span>
                    <span style={{flex:1,fontSize:'0.68rem',color:'rgba(255,255,255,0.45)'}}>
                      {wx?.rain>0?`💧${wx.rain}mm`:''}
                    </span>
                    <span style={{fontSize:'0.78rem',fontWeight:700}}>{wx?.max}°</span>
                    <span style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.45)'}}>{wx?.min}°</span>
                  </div>
                )
              })}
            </div>
            {rec&&(
              <div style={{padding:'10px 12px',borderRadius:'12px',
                background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.15)'}}>
                <p style={{fontSize:'0.82rem',fontWeight:700,color:rec.col}}>{rec.icon} {rec.text}</p>
              </div>
            )}
          </>
        ):(
          <div style={{padding:'14px 0',textAlign:'center',color:'rgba(255,255,255,0.4)',fontSize:'0.84rem'}}>
            Učitavam prognozu...
          </div>
        )}
      </div>
    )
  }

  const NewsPanel = ()=>(
    <div style={{background:'#fff',borderRadius:'20px',padding:'24px',
      boxShadow:'0 2px 20px rgba(0,0,0,0.06)',border:'1px solid #f0ede6'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px'}}>
        <div>
          <p style={{color:'#8fa68f',fontSize:'0.72rem',fontWeight:700,
            textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'4px'}}>OutdoorBalkans</p>
          <h2 style={{fontFamily:SERIF,fontSize:'1.2rem',fontWeight:700,color:'#0e1a0e'}}>
            Najnovije vesti
            {filterCat.length>0&&<span style={{fontSize:'0.8rem',color:'#8fa68f',fontWeight:500,
              marginLeft:'8px'}}>— filtrirano</span>}
          </h2>
        </div>
      </div>
      {filteredNews.length>0?(
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'14px'}}>
          {filteredNews.map(n=>(
            <div key={n.id} style={{borderRadius:'14px',border:'1px solid #f0ede6',
              padding:'16px',background:'#fafaf8'}}>
              <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'10px'}}>
                <span style={{fontSize:'1.1rem'}}>{n.cat}</span>
                <span style={{fontSize:'0.72rem',color:'#8fa68f',fontWeight:600}}>
                  {new Date(n.date).toLocaleDateString('sr-RS',{day:'numeric',month:'long'})}
                </span>
              </div>
              <h3 style={{fontFamily:SERIF,fontSize:'0.93rem',fontWeight:700,
                color:'#0e1a0e',marginBottom:'8px',lineHeight:1.35}}>{n.title}</h3>
              <p style={{fontSize:'0.79rem',color:'#8fa68f',lineHeight:1.5,marginBottom:'12px'}}>{n.excerpt}</p>
              {n.link&&(
                (n as any).internal?(
                  <Link href={n.link}
                    style={{display:'inline-flex',alignItems:'center',gap:'4px',
                      fontSize:'0.78rem',fontWeight:700,color:'#2d6a2d',textDecoration:'none'}}>
                    {n.linkLabel} →
                  </Link>
                ):(
                  <a href={n.link} target='_blank' rel='noopener noreferrer'
                    style={{display:'inline-flex',alignItems:'center',gap:'4px',
                      fontSize:'0.78rem',fontWeight:700,color:'#0e1a0e',textDecoration:'none'}}>
                    🔗 {n.linkLabel}
                  </a>
                )
              )}
            </div>
          ))}
        </div>
      ):(
        <p style={{color:'#8fa68f',fontSize:'0.88rem',padding:'20px 0',textAlign:'center'}}>
          Nema vesti za izabranu kategoriju.
        </p>
      )}
    </div>
  )

  const SeasonBar = ()=>(
    <div style={{background:'#fff',borderRadius:'20px',padding:'22px',
      boxShadow:'0 2px 20px rgba(0,0,0,0.06)',border:'1px solid #f0ede6'}}>
      <h3 style={{fontFamily:SERIF,fontSize:'1.05rem',fontWeight:700,
        color:'#0e1a0e',marginBottom:'18px'}}>📊 Sezone kroz godinu</h3>
      <div style={{overflowX:'auto'}}>
        <div style={{minWidth:'460px'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(12,1fr)',
            gap:'2px',marginBottom:'8px',paddingLeft:'88px'}}>
            {MONTHS_SR.map((m,i)=>(
              <div key={m} style={{textAlign:'center',fontSize:'0.6rem',
                color:i===month?'#2d6a2d':'#bbb',fontWeight:i===month?800:500}}>
                {m.slice(0,3)}
              </div>
            ))}
          </div>
          {Object.entries(SEASONS)
            .filter(([slug])=>filterCat.length===0||filterCat.includes(slug))
            .map(([slug,s])=>(
            <div key={slug} style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'5px'}}>
              <div style={{width:'82px',display:'flex',alignItems:'center',gap:'4px',flexShrink:0}}>
                <span style={{fontSize:'0.85rem'}}>{s.icon}</span>
                <span style={{fontSize:'0.68rem',fontWeight:600,color:'#555'}}>{s.label}</span>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(12,1fr)',gap:'2px',flex:1}}>
                {Array.from({length:12}).map((_,i)=>{
                  const active=s.months.includes(i+1)
                  const cur=i===month
                  return(
                    <div key={i} style={{height:'20px',borderRadius:'4px',
                      background:active?s.color:'#f0ede6',
                      opacity:cur&&active?1:active?0.72:0.3,
                      border:cur?'2px solid #0e1a0e22':'2px solid transparent'}}/>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div style={{fontFamily:SANS,background:'#f9f7f2',minHeight:'100vh'}}>

      {/* HEADER */}
      <div style={{background:'linear-gradient(135deg,#1e3d1e 0%,#2d6a2d 100%)',padding:'80px 24px 36px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <p style={{color:'#6ab87a',fontSize:'0.78rem',fontWeight:700,
            textTransform:'uppercase',letterSpacing:'0.16em',marginBottom:'12px'}}>OutdoorBalkans</p>
          <h1 style={{fontFamily:SERIF,fontSize:'clamp(2rem,4vw,3.2rem)',
            fontWeight:900,color:'#fff',marginBottom:'10px'}}>Kalendar Aktivnosti</h1>
          <p style={{color:'rgba(255,255,255,0.7)',fontSize:'1rem',maxWidth:'50ch',marginBottom:'22px'}}>
            Sezone, takmičenja i outdoor eventi u Srbiji i regionu.
          </p>
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
            {activeSeasons.map(([slug,s])=>(
              <div key={slug} style={{display:'flex',alignItems:'center',gap:'6px',
                background:'rgba(255,255,255,0.12)',backdropFilter:'blur(8px)',
                border:'1px solid rgba(255,255,255,0.2)',padding:'5px 12px',borderRadius:'999px'}}>
                <span>{s.icon}</span>
                <span style={{color:'#fff',fontSize:'0.8rem',fontWeight:600}}>{s.label}</span>
                <span style={{width:'6px',height:'6px',borderRadius:'50%',
                  background:'#4ade80',boxShadow:'0 0 6px #4ade80'}}/>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STICKY FILTER BAR */}
      <div style={{background:'#fff',borderBottom:'1px solid #f0ede6',
        padding:'12px 24px',position:'sticky',top:'64px',zIndex:50,
        boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <FilterBar/>
        </div>
      </div>

      {/* MOB TABS */}
      <div className='mob-cal-tabs' style={{display:'none',background:'#fff',
        borderBottom:'1px solid #f0ede6'}}>
        {(['cal','eventi','vesti'] as const).map(t=>(
          <button key={t} onClick={()=>setMobTab(t)}
            style={{flex:1,padding:'12px 4px',border:'none',background:'none',cursor:'pointer',
              fontSize:'0.8rem',fontWeight:700,fontFamily:SANS,
              color:mobTab===t?'#2d6a2d':'#8fa68f',
              borderBottom:mobTab===t?'2px solid #2d6a2d':'2px solid transparent'}}>
            {t==='cal'?'📅 Kalendar':t==='eventi'?'🏆 Eventi':'📰 Vesti'}
          </button>
        ))}
      </div>

      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'28px 24px 80px'}}>

        {/* DESKTOP */}
        <div className='cal-desktop' style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:'28px'}}>
          <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
            <div style={{background:'#fff',borderRadius:'20px',padding:'22px',
              boxShadow:'0 2px 20px rgba(0,0,0,0.06)',border:'1px solid #f0ede6'}}>
              <CalGrid/>
              <SelDayPanel/>
            </div>
            <SeasonBar/>
            <NewsPanel/>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
            <UpcomingPanel/>
            <LocsPanel/>
            <WeatherPanel/>
          </div>
        </div>

        {/* MOBILE */}
        <div className='cal-mobile' style={{display:'none'}}>
          {mobTab==='cal'&&(
            <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
              <div style={{background:'#fff',borderRadius:'20px',padding:'18px',
                boxShadow:'0 2px 20px rgba(0,0,0,0.06)',border:'1px solid #f0ede6'}}>
                <CalGrid/>
                <SelDayPanel/>
              </div>
              <SeasonBar/>
              <WeatherPanel/>
            </div>
          )}
          {mobTab==='eventi'&&(
            <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
              <UpcomingPanel/>
              <LocsPanel/>
            </div>
          )}
          {mobTab==='vesti'&&<NewsPanel/>}
        </div>
      </div>

      <EventModal/>

      <style>{`
        @media (max-width: 900px) {
          .cal-desktop { display: none !important; }
          .cal-mobile  { display: block !important; }
          .mob-cal-tabs { display: flex !important; }
        }
        @media (min-width: 901px) {
          .cal-desktop { display: grid !important; }
          .cal-mobile  { display: none !important; }
          .mob-cal-tabs { display: none !important; }
        }
      `}</style>
    </div>
  )
}
