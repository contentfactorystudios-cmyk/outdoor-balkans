'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'

const SERIF = "'Fraunces','Playfair Display',Georgia,serif"
const SANS  = "'DM Sans',system-ui,sans-serif"

// Sezone i tipovi aktivnosti
const SEASONS: Record<string, { months: number[]; icon: string; color: string; label: string }> = {
  ribolov:      { months: [4,5,6,7,8,9,10],   icon: '🎣', color: '#1d5fa8', label: 'Ribolov' },
  lov:          { months: [9,10,11,12,1,2],    icon: '🦌', color: '#5a3010', label: 'Lov' },
  kajak:        { months: [4,5,6,7,8,9],       icon: '🚣', color: '#0e7490', label: 'Kajak' },
  kampovanje:   { months: [5,6,7,8,9],         icon: '⛺', color: '#166534', label: 'Kampovanje' },
  planinarenje: { months: [4,5,6,7,8,9,10],   icon: '🥾', color: '#5b21b6', label: 'Planinarenje' },
  rezervati:    { months: [1,2,3,4,5,6,7,8,9,10,11,12], icon: '🦋', color: '#0f766e', label: 'Rezervati' },
}

const MONTHS_SR = ['Januar','Februar','Mart','April','Maj','Jun','Jul','Avgust','Septembar','Oktobar','Novembar','Decembar']
const DAYS_SR   = ['Pon','Uto','Sre','Čet','Pet','Sub','Ned']

// Generisani eventi na osnovu sezona
function generateSeasonEvents(year: number) {
  const events: any[] = []
  Object.entries(SEASONS).forEach(([slug, s]) => {
    s.months.forEach(m => {
      // Početak sezone
      if (!s.months.includes(m - 1 === 0 ? 12 : m - 1)) {
        events.push({
          id: `start-${slug}-${m}`,
          date: new Date(year, m - 1, 1),
          type: 'season-start',
          category: slug,
          title: `🟢 Sezona ${s.label} počinje`,
          color: s.color,
          icon: s.icon,
        })
      }
      // Kraj sezone
      if (!s.months.includes(m + 1 > 12 ? 1 : m + 1)) {
        const lastDay = new Date(year, m, 0).getDate()
        events.push({
          id: `end-${slug}-${m}`,
          date: new Date(year, m - 1, lastDay),
          type: 'season-end',
          category: slug,
          title: `🔴 Sezona ${s.label} se zatvara`,
          color: s.color,
          icon: s.icon,
        })
      }
    })
  })

  // Statički eventi
  const staticEvents = [
    { id: 'e1', date: new Date(year, 3, 15),  type: 'event', category: 'ribolov',      icon: '🏆', color: '#1d5fa8', title: 'Ribolovačko takmičenje — Dunav', location: 'Beograd', desc: 'Godišnje takmičenje u ribolovu na Dunavu' },
    { id: 'e2', date: new Date(year, 4, 20),  type: 'event', category: 'planinarenje', icon: '🥾', color: '#5b21b6', title: 'Maraton Kopaonik 2025', location: 'Kopaonik', desc: 'Planinarski maraton 42km' },
    { id: 'e3', date: new Date(year, 5, 8),   type: 'event', category: 'kajak',        icon: '🏅', color: '#0e7490', title: 'Kajak kup — Tara', location: 'Tara', desc: 'Nacionlni kajak kup na reci Tari' },
    { id: 'e4', date: new Date(year, 6, 12),  type: 'event', category: 'kampovanje',   icon: '⛺', color: '#166534', title: 'Outdoor Fest Zlatibor', location: 'Zlatibor', desc: 'Festival kampovanja i outdoor sporta' },
    { id: 'e5', date: new Date(year, 7, 25),  type: 'event', category: 'planinarenje', icon: '🏔️', color: '#5b21b6', title: 'Trail Stara Planina', location: 'Stara Planina', desc: 'Trail trčanje po Staroj Planini' },
    { id: 'e6', date: new Date(year, 8, 14),  type: 'event', category: 'ribolov',      icon: '🎣', color: '#1d5fa8', title: 'Kup Srbije — Šaran', location: 'Đerdap', desc: 'Kup Srbije u ribolovu šarana' },
    { id: 'e7', date: new Date(year, 9, 5),   type: 'event', category: 'lov',          icon: '🦌', color: '#5a3010', title: 'Otvorenje sezone lova', location: 'Vojvodina', desc: 'Svečano otvorenje lovačke sezone' },
    { id: 'e8', date: new Date(year, 10, 11), type: 'event', category: 'planinarenje', icon: '🏔️', color: '#5b21b6', title: 'Zimski pohod — Rtanj', location: 'Rtanj', desc: 'Grupni planinarski pohod na Rtanj' },
    { id: 'e9', date: new Date(year, 2, 22),  type: 'event', category: 'ribolov',      icon: '🎣', color: '#1d5fa8', title: 'Dan zaštite ribe', location: 'Srbija', desc: 'Dan bez ribolova — zaštita prirode' },
  ]
  return [...events, ...staticEvents]
}

// Weather za Beograd
function useWeather(month: number) {
  const [weather, setWeather] = useState<any>(null)
  useEffect(() => {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=44.82&longitude=20.46&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum&timezone=Europe/Belgrade&forecast_days=14`)
      .then(r => r.json())
      .then(d => setWeather(d))
      .catch(() => {})
  }, [])
  return weather
}

export default function ActivityCalendar({ locations }: { locations: any[] }) {
  const now       = new Date()
  const [year,  setYear]  = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth()) // 0-indexed
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [filterCat, setFilterCat] = useState<string[]>([])
  const [view, setView] = useState<'month' | 'agenda'>('month')
  const weather = useWeather(month)

  const allEvents = useMemo(() => generateSeasonEvents(year), [year])

  // Filtrirani eventi
  const visibleEvents = useMemo(() => {
    if (filterCat.length === 0) return allEvents
    return allEvents.filter(e => filterCat.includes(e.category))
  }, [allEvents, filterCat])

  // Dani u mjesecu
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7 // Mon=0

  // Mapping datum -> eventi
  const eventsByDay = useMemo(() => {
    const map: Record<string, any[]> = {}
    visibleEvents.forEach(e => {
      const d = e.date
      if (d.getFullYear() === year && d.getMonth() === month) {
        const k = d.getDate().toString()
        if (!map[k]) map[k] = []
        map[k].push(e)
      }
    })
    return map
  }, [visibleEvents, year, month])

  // Selected day events
  const selectedEvents = selectedDay
    ? (eventsByDay[selectedDay.getDate().toString()] ?? [])
    : []

  // Upcoming events (next 30 days)
  const upcoming = useMemo(() => {
    return allEvents
      .filter(e => e.type === 'event' && e.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 6)
  }, [allEvents])

  // Active seasons this month
  const activeSeasons = Object.entries(SEASONS).filter(([, s]) => s.months.includes(month + 1))

  function toggleFilter(cat: string) {
    setFilterCat(f => f.includes(cat) ? f.filter(c => c !== cat) : [...f, cat])
  }

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  // Weather forecast map
  const weatherMap: Record<string, any> = {}
  if (weather?.daily) {
    weather.daily.time.forEach((d: string, i: number) => {
      weatherMap[d] = {
        max: Math.round(weather.daily.temperature_2m_max[i]),
        min: Math.round(weather.daily.temperature_2m_min[i]),
        code: weather.daily.weathercode[i],
        rain: weather.daily.precipitation_sum[i],
      }
    })
  }

  function weatherIcon(code: number) {
    if (code === 0) return '☀️'
    if (code <= 3) return '⛅'
    if (code <= 48) return '🌫️'
    if (code <= 65) return '🌧️'
    if (code <= 75) return '❄️'
    if (code <= 81) return '🌦️'
    return '⛈️'
  }

  function formatDate(d: Date) {
    return `${d.getDate()}. ${MONTHS_SR[d.getMonth()]}`
  }

  const todayKey = `${year}-${String(month+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`

  return (
    <div style={{ fontFamily: SANS, background: '#f9f7f2', minHeight: '100vh' }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #1e3d1e 0%, #2d6a2d 100%)', padding: '80px 24px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ color: '#6ab87a', fontSize: '0.78rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '12px' }}>
            Outdoor Srbija
          </p>
          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 900,
            color: '#fff', marginBottom: '16px' }}>
            Kalendar Aktivnosti
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', maxWidth: '50ch' }}>
            Sezone, takmičenja i outdoor eventi u Srbiji i regionu.
          </p>

          {/* Aktivne sezone */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '28px' }}>
            {activeSeasons.map(([slug, s]) => (
              <div key={slug} style={{ display: 'flex', alignItems: 'center', gap: '6px',
                background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '6px 14px', borderRadius: '999px' }}>
                <span>{s.icon}</span>
                <span style={{ color: '#fff', fontSize: '0.82rem', fontWeight: 600 }}>{s.label}</span>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%',
                  background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}
          className='cal-layout'>

          {/* LEVO — Kalendar */}
          <div>
            {/* Kontrole */}
            <div style={{ background: '#fff', borderRadius: '20px', padding: '24px',
              boxShadow: '0 2px 20px rgba(0,0,0,0.06)', marginBottom: '24px',
              border: '1px solid #f0ede6' }}>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <button onClick={prevMonth} style={{ background: '#f4f0e6', border: 'none',
                  borderRadius: '10px', width: '40px', height: '40px', cursor: 'pointer',
                  fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{ fontFamily: SERIF, fontSize: '1.5rem', fontWeight: 700, color: '#0e1a0e', margin: 0 }}>
                    {MONTHS_SR[month]} {year}
                  </h2>
                </div>
                <button onClick={nextMonth} style={{ background: '#f4f0e6', border: 'none',
                  borderRadius: '10px', width: '40px', height: '40px', cursor: 'pointer',
                  fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
              </div>

              {/* Filter kategorije */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {Object.entries(SEASONS).map(([slug, s]) => {
                  const active = filterCat.includes(slug)
                  return (
                    <button key={slug} onClick={() => toggleFilter(slug)}
                      style={{ display: 'flex', alignItems: 'center', gap: '5px',
                        padding: '5px 12px', borderRadius: '999px', border: '1.5px solid',
                        borderColor: active ? s.color : '#e8e2d4',
                        background: active ? s.color : 'transparent',
                        color: active ? '#fff' : '#666',
                        fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                        fontFamily: SANS, transition: 'all 0.15s' }}>
                      {s.icon} {s.label}
                    </button>
                  )
                })}
                {filterCat.length > 0 && (
                  <button onClick={() => setFilterCat([])}
                    style={{ padding: '5px 12px', borderRadius: '999px', border: '1.5px solid #e8e2d4',
                      background: 'transparent', color: '#999', fontSize: '0.78rem',
                      cursor: 'pointer', fontFamily: SANS }}>
                    ✕ Očisti
                  </button>
                )}
              </div>

              {/* Grid dana */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px', marginBottom: '8px' }}>
                {DAYS_SR.map(d => (
                  <div key={d} style={{ textAlign: 'center', fontSize: '0.72rem', fontWeight: 700,
                    color: '#8fa68f', padding: '6px 0', textTransform: 'uppercase' }}>{d}</div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '3px' }}>
                {/* Prazni dani na početku */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day  = i + 1
                  const key  = day.toString()
                  const dayEvents = eventsByDay[key] ?? []
                  const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear()
                  const isSel   = selectedDay?.getDate() === day && selectedDay?.getMonth() === month
                  const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
                  const wx = weatherMap[dateStr]

                  return (
                    <button key={day} onClick={() => setSelectedDay(isSel ? null : new Date(year, month, day))}
                      style={{ position: 'relative', padding: '6px 2px 4px', borderRadius: '10px',
                        border: isSel ? '2px solid #2d6a2d' : isToday ? '2px solid #6ab87a' : '2px solid transparent',
                        background: isSel ? '#e8f5e8' : isToday ? '#f0fdf0' : '#fafaf8',
                        cursor: 'pointer', minHeight: '58px', fontFamily: SANS,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                        transition: 'all 0.15s' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: isToday ? 800 : 600,
                        color: isToday ? '#2d6a2d' : '#0e1a0e' }}>{day}</span>
                      {wx && (
                        <span style={{ fontSize: '0.65rem', color: '#888' }}>
                          {weatherIcon(wx.code)} {wx.max}°
                        </span>
                      )}
                      {dayEvents.length > 0 && (
                        <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', justifyContent: 'center' }}>
                          {dayEvents.slice(0, 3).map((e, idx) => (
                            <span key={idx} style={{ width: '7px', height: '7px', borderRadius: '50%',
                              background: e.color, display: 'block' }} />
                          ))}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Selected day events */}
            {selectedDay && (
              <div style={{ background: '#fff', borderRadius: '20px', padding: '24px',
                boxShadow: '0 2px 20px rgba(0,0,0,0.06)', border: '1px solid #f0ede6', marginBottom: '24px' }}>
                <h3 style={{ fontFamily: SERIF, fontSize: '1.1rem', fontWeight: 700,
                  color: '#0e1a0e', marginBottom: '16px' }}>
                  {formatDate(selectedDay)}
                </h3>
                {selectedEvents.length > 0 ? selectedEvents.map(e => (
                  <div key={e.id} style={{ display: 'flex', gap: '14px', padding: '14px 0',
                    borderBottom: '1px solid #f4f0e6' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px',
                      background: e.color + '22', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                      {e.icon}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0e1a0e',
                        marginBottom: '3px' }}>{e.title}</p>
                      {e.location && (
                        <p style={{ fontSize: '0.78rem', color: '#8fa68f' }}>📍 {e.location}</p>
                      )}
                      {e.desc && (
                        <p style={{ fontSize: '0.78rem', color: '#aaa', marginTop: '3px' }}>{e.desc}</p>
                      )}
                    </div>
                  </div>
                )) : (
                  <p style={{ color: '#8fa68f', fontSize: '0.88rem' }}>Nema zakazanih aktivnosti ovog dana.</p>
                )}
              </div>
            )}

            {/* Sezonski bar chart — svih 12 meseci */}
            <div style={{ background: '#fff', borderRadius: '20px', padding: '24px',
              boxShadow: '0 2px 20px rgba(0,0,0,0.06)', border: '1px solid #f0ede6' }}>
              <h3 style={{ fontFamily: SERIF, fontSize: '1.1rem', fontWeight: 700,
                color: '#0e1a0e', marginBottom: '20px' }}>Sezone aktivnosti tokom godine</h3>
              <div style={{ overflowX: 'auto' }}>
                <div style={{ minWidth: '560px' }}>
                  {/* Meseci header */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)',
                    gap: '2px', marginBottom: '8px', paddingLeft: '90px' }}>
                    {MONTHS_SR.map((m, i) => (
                      <div key={m} style={{ textAlign: 'center', fontSize: '0.62rem',
                        color: i === month ? '#2d6a2d' : '#aaa', fontWeight: i === month ? 800 : 500 }}>
                        {m.slice(0, 3)}
                      </div>
                    ))}
                  </div>
                  {/* Redovi po kategoriji */}
                  {Object.entries(SEASONS).map(([slug, s]) => (
                    <div key={slug} style={{ display: 'flex', alignItems: 'center',
                      gap: '8px', marginBottom: '6px' }}>
                      <div style={{ width: '82px', display: 'flex', alignItems: 'center',
                        gap: '5px', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.9rem' }}>{s.icon}</span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#555' }}>{s.label}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)',
                        gap: '2px', flex: 1 }}>
                        {Array.from({ length: 12 }).map((_, i) => {
                          const isActive = s.months.includes(i + 1)
                          const isCurrent = i === month
                          return (
                            <div key={i} style={{ height: '22px', borderRadius: '4px',
                              background: isActive ? s.color : '#f0ede6',
                              opacity: isCurrent && isActive ? 1 : isActive ? 0.75 : 0.4,
                              border: isCurrent ? '2px solid #0e1a0e22' : '2px solid transparent',
                              transition: 'all 0.2s' }} />
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* DESNO — Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Prognoza 7 dana */}
            <div style={{ background: 'linear-gradient(135deg,#1a3d6e 0%,#2563ab 100%)',
              borderRadius: '20px', padding: '20px', color: '#fff' }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)', marginBottom: '12px' }}>
                🌤️ Prognoza — Beograd
              </p>
              {weather?.daily ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {weather.daily.time.slice(0, 7).map((d: string, i: number) => {
                    const wx = weatherMap[d]
                    const date = new Date(d)
                    const label = i === 0 ? 'Danas' : i === 1 ? 'Sutra' : DAYS_SR[(date.getDay() + 6) % 7]
                    return (
                      <div key={d} style={{ display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '8px 10px', borderRadius: '10px',
                        background: i === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)' }}>
                        <span style={{ width: '36px', fontSize: '0.78rem', fontWeight: 700,
                          color: i === 0 ? '#fff' : 'rgba(255,255,255,0.7)' }}>{label}</span>
                        <span style={{ fontSize: '1.1rem' }}>{weatherIcon(wx?.code ?? 0)}</span>
                        <span style={{ flex: 1, fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                          {wx?.rain > 0 ? `💧${wx.rain}mm` : ''}
                        </span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{wx?.max}°</span>
                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{wx?.min}°</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div style={{ padding: '20px 0', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                  Učitavam prognozu...
                </div>
              )}

              {/* Preporuka za aktivnost */}
              {weather?.daily && (() => {
                const todayWx = weatherMap[weather.daily.time[0]]
                const temp = todayWx?.max ?? 20
                const code = todayWx?.code ?? 0
                let rec = { icon: '🥾', text: 'Odlično za planinarenje!', color: '#4ade80' }
                if (code >= 95) rec = { icon: '⚠️', text: 'Oluja — ostani kod kuće', color: '#f87171' }
                else if (code >= 61) rec = { icon: '🎣', text: 'Kiša — pokušaj ribolov', color: '#93c5fd' }
                else if (temp > 28) rec = { icon: '🚣', text: 'Vrućina — kajak ili kupanje!', color: '#fbbf24' }
                else if (temp < 5) rec = { icon: '🦌', text: 'Hladno — sezona lova!', color: '#a5b4fc' }
                return (
                  <div style={{ marginTop: '12px', padding: '12px', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                    <p style={{ fontSize: '0.82rem', fontWeight: 700, color: rec.color }}>
                      {rec.icon} {rec.text}
                    </p>
                  </div>
                )
              })()}
            </div>

            {/* Nadolazeći eventi */}
            <div style={{ background: '#fff', borderRadius: '20px', padding: '20px',
              boxShadow: '0 2px 20px rgba(0,0,0,0.06)', border: '1px solid #f0ede6' }}>
              <h3 style={{ fontFamily: SERIF, fontSize: '1.05rem', fontWeight: 700,
                color: '#0e1a0e', marginBottom: '16px' }}>📅 Nadolazeći eventi</h3>
              {upcoming.map(e => (
                <div key={e.id} style={{ display: 'flex', gap: '12px', marginBottom: '14px',
                  paddingBottom: '14px', borderBottom: '1px solid #f4f0e6' }}>
                  <div style={{ width: '44px', flexShrink: 0, textAlign: 'center' }}>
                    <div style={{ background: e.color + '18', borderRadius: '10px',
                      padding: '6px 4px' }}>
                      <div style={{ fontSize: '1.1rem' }}>{e.icon}</div>
                      <div style={{ fontSize: '0.62rem', fontWeight: 700, color: e.color }}>
                        {e.date.getDate()}<br/>{MONTHS_SR[e.date.getMonth()].slice(0,3)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0e1a0e',
                      marginBottom: '2px', lineHeight: 1.3 }}>{e.title}</p>
                    {e.location && (
                      <p style={{ fontSize: '0.75rem', color: '#8fa68f' }}>📍 {e.location}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Lokacije po aktivnoj sezoni */}
            <div style={{ background: '#fff', borderRadius: '20px', padding: '20px',
              boxShadow: '0 2px 20px rgba(0,0,0,0.06)', border: '1px solid #f0ede6' }}>
              <h3 style={{ fontFamily: SERIF, fontSize: '1.05rem', fontWeight: 700,
                color: '#0e1a0e', marginBottom: '4px' }}>🗺️ Preporučene lokacije</h3>
              <p style={{ fontSize: '0.75rem', color: '#8fa68f', marginBottom: '14px' }}>
                Za {MONTHS_SR[month].toLowerCase()}
              </p>
              {activeSeasons.slice(0, 3).map(([slug, s]) => {
                const locs4cat = locations.filter(l => l.categories?.slug === slug).slice(0, 2)
                return locs4cat.map(loc => (
                  <Link key={loc.id}
                    href={'/' + (loc.countries?.slug ?? 'srbija') + '/' + slug + '/' + loc.slug}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 0', borderBottom: '1px solid #f4f0e6', textDecoration: 'none' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px',
                      background: s.color + '22', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                      {s.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0e1a0e',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {loc.name}
                      </p>
                      <p style={{ fontSize: '0.72rem', color: '#8fa68f' }}>
                        {loc.regions?.name ?? 'Srbija'}
                      </p>
                    </div>
                    <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='#ccc' strokeWidth='2'>
                      <path d='M9 18l6-6-6-6'/>
                    </svg>
                  </Link>
                ))
              })}
              {activeSeasons.length === 0 && (
                <p style={{ color: '#8fa68f', fontSize: '0.85rem' }}>Nema aktivnih sezona ovaj mesec.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cal-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
