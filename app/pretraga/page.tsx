import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { getCardPhoto } from '@/lib/getCategoryPhoto'
import SaveButton from '@/components/SaveButton'

const SERIF = "'Fraunces','Playfair Display',Georgia,serif"
const SANS  = "'DM Sans',system-ui,sans-serif"

const CAT_COLORS: Record<string, string> = {
  ribolov:'#1d5fa8', lov:'#5a3010', kajak:'#0e7490',
  kampovanje:'#166534', planinarenje:'#5b21b6',
  'nacionalni-parkovi':'#0f766e', rezervati:'#0f766e'
}

const MONTHS_SR = ['Jan','Feb','Mar','Apr','Maj','Jun','Jul','Avg','Sep','Okt','Nov','Dec']

// Statički eventi (isti kao u ActivityCalendar)
const STATIC_EVENTS = [
  { id:'e1', date:'2026-04-15', category:'ribolov',      icon:'🏆', color:'#1d5fa8',
    title:'Ribolovačko takmičenje — Dunav', location:'Beograd' },
  { id:'e2', date:'2026-05-20', category:'planinarenje', icon:'🥾', color:'#5b21b6',
    title:'Maraton Kopaonik 2026', location:'Kopaonik' },
  { id:'e3', date:'2026-06-08', category:'kajak',        icon:'🏅', color:'#0e7490',
    title:'Kajak kup — Tara', location:'Tara' },
  { id:'e4', date:'2026-06-21', category:'kampovanje',   icon:'⛺', color:'#166534',
    title:'Letnji solsticij — Noć kampera', location:'Tara' },
  { id:'e5', date:'2026-07-12', category:'kampovanje',   icon:'🎪', color:'#166534',
    title:'Outdoor Fest Zlatibor', location:'Zlatibor' },
  { id:'e6', date:'2026-08-25', category:'planinarenje', icon:'🏔️', color:'#5b21b6',
    title:'Trail Stara Planina', location:'Stara Planina' },
  { id:'e7', date:'2026-09-14', category:'ribolov',      icon:'🎣', color:'#1d5fa8',
    title:'Kup Srbije — Šaran', location:'Đerdap' },
  { id:'e8', date:'2026-10-05', category:'lov',          icon:'🦌', color:'#5a3010',
    title:'Otvorenje sezone lova', location:'Vojvodina' },
]

export default async function SearchPage({
  searchParams
}: { searchParams: Promise<{ q?: string; cat?: string }> }) {
  const { q = '', cat = '' } = await searchParams

  let query = supabase
    .from('locations')
    .select('id,name,slug,short_description,image_url,categories(name,slug,icon),regions(name),countries(name,slug)')
    .eq('is_published', true)
    .order('is_featured', { ascending: false })
    .limit(48)

  if (q) query = query.ilike('name', `%${q}%`)

  const { data: results } = await query
  const locs = (results ?? []) as any[]

  const filtered = cat
    ? locs.filter(l => l.categories?.slug === cat || (cat === 'nacionalni-parkovi' && l.categories?.slug === 'rezervati'))
    : locs

  const { data: categories } = await supabase
    .from('categories').select('id,name,slug,icon').eq('is_active', true)

  // Filtriraj evente po kategoriji
  const filteredEvents = cat
    ? STATIC_EVENTS.filter(e => e.category === cat)
    : STATIC_EVENTS

  const upcomingEvents = filteredEvents
    .filter(e => new Date(e.date) >= new Date())
    .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4)

  return (
    <div style={{ fontFamily:SANS, background:'#f9f7f2', minHeight:'100vh' }}>

      {/* HERO */}
      <div style={{ background:'linear-gradient(135deg,#1e3d1e 0%,#2d6a2d 100%)',
        padding:'80px 24px 48px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, opacity:0.04,
          backgroundImage:'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize:'28px 28px' }} />
        <div style={{ maxWidth:'800px', margin:'0 auto', position:'relative' }}>
          <p style={{ color:'#6ab87a', fontSize:'0.78rem', fontWeight:700,
            textTransform:'uppercase', letterSpacing:'0.16em', marginBottom:'12px' }}>
            OutdoorBalkans
          </p>
          <h1 style={{ fontFamily:SERIF, fontSize:'clamp(1.8rem,3.5vw,2.8rem)',
            fontWeight:900, color:'#fff', marginBottom:'24px' }}>
            🔍 Pretraga lokacija
          </h1>
          <form action='/pretraga' method='GET'>
            <div style={{ display:'flex', background:'#fff', borderRadius:'999px',
              padding:'6px 6px 6px 20px', gap:'8px',
              boxShadow:'0 8px 32px rgba(0,0,0,0.25)' }}>
              <input name='q' defaultValue={q} type='search'
                placeholder='Pretraži lokacije, reke, planine...'
                style={{ flex:1, border:'none', outline:'none', fontSize:'1rem',
                  color:'#0e1a0e', background:'transparent', padding:'10px 0',
                  fontFamily:'inherit' }} />
              {cat && <input type='hidden' name='cat' value={cat} />}
              <button type='submit' style={{ background:'#2d6a2d', color:'#fff',
                border:'none', borderRadius:'999px', padding:'12px 28px',
                fontSize:'0.95rem', fontWeight:700, cursor:'pointer' }}>
                Traži
              </button>
            </div>
          </form>
        </div>
      </div>

      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'32px 24px 80px' }}>

        {/* Filter kategorije */}
        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'32px' }}>
          <Link href={`/pretraga${q ? `?q=${q}` : ''}`}
            style={{ padding:'8px 18px', borderRadius:'999px',
              border:`2px solid ${!cat ? '#2d6a2d' : '#e8e2d4'}`,
              background: !cat ? '#2d6a2d' : '#fff',
              color: !cat ? '#fff' : '#555',
              fontSize:'0.82rem', fontWeight:700, textDecoration:'none' }}>
            Sve kategorije
          </Link>
          {(categories ?? []).map((c: any) => {
            const dispSlug = c.slug === 'rezervati' ? 'nacionalni-parkovi' : c.slug
            const dispName = c.slug === 'rezervati' ? 'Nacionalni parkovi' : c.name
            const isActive = cat === dispSlug
            const col = CAT_COLORS[dispSlug] ?? '#2d6a2d'
            return (
              <Link key={c.id}
                href={`/pretraga?cat=${dispSlug}${q ? `&q=${q}` : ''}`}
                style={{ padding:'8px 18px', borderRadius:'999px',
                  border:`2px solid ${isActive ? col : '#e8e2d4'}`,
                  background: isActive ? col : '#fff',
                  color: isActive ? '#fff' : '#555',
                  fontSize:'0.82rem', fontWeight:700, textDecoration:'none',
                  display:'flex', alignItems:'center', gap:'5px' }}>
                {c.icon} {dispName}
              </Link>
            )
          })}
        </div>

        {/* GRID: Lokacije + Sidebar */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'32px',
          alignItems:'start' }}>

          {/* LOKACIJE */}
          <div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
              marginBottom:'20px' }}>
              <p style={{ color:'#8fa68f', fontSize:'0.85rem', fontWeight:600 }}>
                {filtered.length === 0 ? 'Nema rezultata' :
                  `${filtered.length} lokacija${q ? ` za "${q}"` : ''}${cat ? ` · ${cat}` : ''}`}
              </p>
            </div>

            {filtered.length === 0 ? (
              <div style={{ background:'#fff', borderRadius:'24px', padding:'60px 24px',
                textAlign:'center', border:'1px solid #f0ede6' }}>
                <div style={{ fontSize:'3rem', marginBottom:'16px' }}>🔍</div>
                <h2 style={{ fontFamily:SERIF, fontSize:'1.3rem', fontWeight:700,
                  color:'#0e1a0e', marginBottom:'8px' }}>Nema rezultata</h2>
                <p style={{ color:'#8fa68f', marginBottom:'24px' }}>
                  Pokušaj sa drugim pojmom ili kategorijom.
                </p>
                <Link href='/pretraga'
                  style={{ background:'#2d6a2d', color:'#fff', padding:'12px 28px',
                    borderRadius:'14px', textDecoration:'none', fontWeight:700 }}>
                  Prikaži sve lokacije
                </Link>
              </div>
            ) : (
              <div style={{ display:'grid',
                gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'20px' }}>
                {filtered.map((loc: any) => {
                  const cs  = loc.categories?.slug ?? ''
                  const col = CAT_COLORS[cs] ?? '#2d6a2d'
                  const dispCat = cs === 'rezervati' ? 'nacionalni-parkovi' : cs
                  return (
                    <Link key={loc.id}
                      href={`/${loc.countries?.slug ?? 'srbija'}/${dispCat}/${loc.slug}`}
                      style={{ textDecoration:'none' }}>
                      <div style={{ borderRadius:'18px', overflow:'hidden',
                        background:'#fff', border:'1px solid #f0ede6',
                        boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
                        <div style={{ height:'190px', position:'relative', background:col, overflow:'hidden' }}>
                          <img
                            src={getCardPhoto(loc.slug, loc.image_url, cs)}
                            alt={loc.name}
                            style={{ width:'100%', height:'100%', objectFit:'cover' }}
                          />
                          <div style={{ position:'absolute', top:'10px', right:'10px' }}>
                            <SaveButton itemType='location' itemId={loc.id} size='sm' />
                          </div>
                          <div style={{ position:'absolute', bottom:'10px', left:'10px',
                            background:'rgba(0,0,0,0.5)', borderRadius:'999px',
                            padding:'4px 10px', fontSize:'0.72rem', color:'#fff', fontWeight:600,
                            display:'flex', alignItems:'center', gap:'4px' }}>
                            {loc.categories?.icon} {loc.categories?.name}
                          </div>
                        </div>
                        <div style={{ padding:'16px 18px' }}>
                          <p style={{ fontSize:'0.72rem', color:'#e05252', fontWeight:700,
                            marginBottom:'5px', display:'flex', alignItems:'center', gap:'4px' }}>
                            📍 {loc.countries?.name ?? 'Srbija'}
                          </p>
                          <h3 style={{ fontFamily:SERIF, fontWeight:700, fontSize:'1rem',
                            color:'#0e1a0e', marginBottom:'6px', lineHeight:1.3 }}>
                            {loc.name}
                          </h3>
                          <p style={{ fontSize:'0.82rem', color:'#8fa68f', lineHeight:1.5,
                            display:'-webkit-box', WebkitLineClamp:2,
                            WebkitBoxOrient:'vertical', overflow:'hidden' }}>
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

          {/* SIDEBAR — Nadolazeći eventi */}
          <div style={{ position:'sticky', top:'84px' }}>
            <div style={{ background:'#fff', borderRadius:'20px', padding:'24px',
              border:'1px solid #f0ede6', boxShadow:'0 4px 20px rgba(0,0,0,0.06)' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
                marginBottom:'20px' }}>
                <h3 style={{ fontFamily:SERIF, fontSize:'1.05rem', fontWeight:800,
                  color:'#0e1a0e' }}>
                  📅 Nadolazeći eventi
                </h3>
                <Link href='/kalendar-aktivnosti'
                  style={{ fontSize:'0.75rem', fontWeight:700, color:'#2d6a2d',
                    textDecoration:'none' }}>
                  Svi →
                </Link>
              </div>

              {upcomingEvents.length === 0 ? (
                <div style={{ textAlign:'center', padding:'24px 0' }}>
                  <p style={{ color:'#8fa68f', fontSize:'0.85rem' }}>
                    Nema događaja za ovu kategoriju.
                  </p>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                  {upcomingEvents.map(ev => {
                    const d = new Date(ev.date)
                    return (
                      <Link key={ev.id} href='/kalendar-aktivnosti'
                        style={{ textDecoration:'none', display:'flex', gap:'12px', alignItems:'center' }}>
                        <div style={{ width:'48px', flexShrink:0, background:ev.color+'18',
                          borderRadius:'12px', padding:'6px 0', textAlign:'center' }}>
                          <p style={{ fontSize:'0.65rem', fontWeight:700,
                            color:ev.color, textTransform:'uppercase', marginBottom:'1px' }}>
                            {MONTHS_SR[d.getMonth()]}
                          </p>
                          <p style={{ fontSize:'1.3rem', fontWeight:900,
                            color:ev.color, lineHeight:1 }}>
                            {d.getDate()}
                          </p>
                        </div>
                        <div style={{ flex:1 }}>
                          <p style={{ fontSize:'0.82rem', fontWeight:700,
                            color:'#0e1a0e', marginBottom:'2px', lineHeight:1.3 }}>
                            {ev.icon} {ev.title}
                          </p>
                          <p style={{ fontSize:'0.72rem', color:'#8fa68f' }}>
                            📍 {ev.location}
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}

              <div style={{ borderTop:'1px solid #f0ede6', marginTop:'20px', paddingTop:'16px' }}>
                <Link href='/dodaj-dogadjaj'
                  style={{ display:'flex', alignItems:'center', justifyContent:'center',
                    gap:'8px', padding:'11px', borderRadius:'12px',
                    background:'#f0fdf4', color:'#2d6a2d', textDecoration:'none',
                    fontWeight:700, fontSize:'0.85rem',
                    border:'1px solid #bbf7d0' }}>
                  📅 + Predloži događaj
                </Link>
              </div>
            </div>

            {/* CTA box */}
            <div style={{ marginTop:'16px', background:'linear-gradient(135deg,#1e3d1e,#2d6a2d)',
              borderRadius:'20px', padding:'24px', textAlign:'center' }}>
              <p style={{ fontSize:'1.8rem', marginBottom:'8px' }}>📍</p>
              <p style={{ fontFamily:SERIF, fontSize:'1rem', fontWeight:700,
                color:'#fff', marginBottom:'6px' }}>
                Znaš dobro mesto?
              </p>
              <p style={{ color:'rgba(255,255,255,0.75)', fontSize:'0.82rem',
                marginBottom:'16px', lineHeight:1.5 }}>
                Tvoja reč menja mapu. Podeli lokaciju sa zajednicom.
              </p>
              <Link href='/predlozi-lokaciju'
                style={{ background:'rgba(255,255,255,0.15)', color:'#fff',
                  padding:'10px 20px', borderRadius:'12px', textDecoration:'none',
                  fontWeight:700, fontSize:'0.85rem',
                  border:'1px solid rgba(255,255,255,0.3)',
                  display:'inline-block' }}>
                Predloži lokaciju →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
