'use client'
import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

const SERIF = "'Fraunces','Playfair Display',Georgia,serif"
const SANS  = "'DM Sans',system-ui,sans-serif"

const CATEGORIES = [
  { slug:'ribolov',      icon:'🎣', label:'Ribolov',        color:'#1d5fa8' },
  { slug:'lov',          icon:'🦌', label:'Lov',             color:'#5a3010' },
  { slug:'kajak',        icon:'🚣', label:'Kajak',           color:'#0e7490' },
  { slug:'kampovanje',   icon:'⛺', label:'Kampovanje',      color:'#166534' },
  { slug:'planinarenje', icon:'🥾', label:'Planinarenje',    color:'#5b21b6' },
  { slug:'nacionalni-parkovi', icon:'🌲', label:'Nat. parkovi', color:'#0f766e' },
]

function isShortUrl(url: string) {
  return /goo\.gl\/maps|maps\.app\.goo\.gl|bit\.ly|tinyurl|ow\.ly/i.test(url)
}
function parseClientSide(url: string) {
  const s = url.trim()
  const direct = s.match(/^(-?\d{1,3}\.\d+)[,\s]+(-?\d{1,3}\.\d+)$/)
  if (direct) return { lat: parseFloat(direct[1]), lng: parseFloat(direct[2]) }
  const patterns = [
    /@(-?\d{1,3}\.\d{4,}),(-?\d{1,3}\.\d{4,})/,
    /[?&]q=(-?\d{1,3}\.\d+),(-?\d{1,3}\.\d+)/,
    /[?&]ll=(-?\d{1,3}\.\d+),(-?\d{1,3}\.\d+)/,
    /center=(-?\d{1,3}\.\d+),(-?\d{1,3}\.\d+)/,
  ]
  for (const p of patterns) {
    const m = s.match(p)
    if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) }
  }
  return null
}

export default function SmartProposalClient() {
  const [step, setStep]         = useState<1|2|3|4>(1)
  const [mapInput, setMapInput] = useState('')
  const [coords, setCoords]     = useState<{lat:number,lng:number}|null>(null)
  const [geoData, setGeoData]   = useState<any>(null)
  const [category, setCategory] = useState<any>(null)
  const [note, setNote]         = useState('')
  const [photos, setPhotos]     = useState<string[]>([])
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<'short_url'|'not_found'|''>('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleMapSubmit() {
    setError('')
    const input = mapInput.trim()
    setLoading(true)

    // Skraćeni URL → server-side resolve
    if (isShortUrl(input)) {
      const res = await fetch('/api/resolve-location', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ url: input })
      })
      if (!res.ok) { setError('short_url'); setLoading(false); return }
      const data = await res.json()
      setCoords({ lat: data.lat, lng: data.lng })
      setGeoData(data)
      setLoading(false)
      setStep(2)
      return
    }

    // Direktno parsiranje
    const parsed = parseClientSide(input)
    if (!parsed) { setError('not_found'); setLoading(false); return }

    // Reverse geocode
    const res = await fetch('/api/resolve-location', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ url: `${parsed.lat}, ${parsed.lng}` })
    })
    const data = await res.json()
    setCoords({ lat: data.lat, lng: data.lng })
    setGeoData(data)
    setLoading(false)
    setStep(2)
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 3)
    setPhotoFiles(files)
    setPhotos(files.map(f => URL.createObjectURL(f)))
  }

  async function handleSubmit() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    // Upload slika
    const uploadedUrls: string[] = []
    for (const file of photoFiles) {
      const ext  = file.name.split('.').pop()
      const path = `proposals/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data } = await supabase.storage.from('location-photos').upload(path, file)
      if (data) {
        const { data: urlData } = supabase.storage.from('location-photos').getPublicUrl(path)
        uploadedUrls.push(urlData.publicUrl)
      }
    }

    await supabase.from('location_proposals').insert({
      submitted_by:  user?.id ?? null,
      email:         user?.email ?? null,
      name:          geoData.name,
      category:      category.label,
      category_slug: category.slug,
      country:       geoData.country ?? 'Srbija',
      region:        geoData.region ?? '',
      lat:           coords!.lat,
      lng:           coords!.lng,
      note,
      geo_name:      geoData.name,
      geo_region:    geoData.region,
      geo_country:   geoData.country,
      geo_address:   geoData.address,
      photo_urls:    uploadedUrls,
      status:        'pending',
    })

    setLoading(false)
    setStep(4)
  }

  return (
    <div style={{ fontFamily:SANS, background:'#f9f7f2', minHeight:'100vh', paddingTop:'64px' }}>
      <div style={{ maxWidth:'560px', margin:'0 auto', padding:'32px 20px 80px' }}>

        {/* Card */}
        <div style={{ background:'#fff', borderRadius:'24px', overflow:'hidden',
          boxShadow:'0 8px 40px rgba(0,0,0,0.1)' }}>

          {/* Header */}
          <div style={{ background:'linear-gradient(135deg,#1e3d1e,#2d6a2d)', padding:'24px 28px' }}>
            <p style={{ color:'rgba(255,255,255,0.65)', fontSize:'0.72rem', fontWeight:700,
              textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'6px' }}>OutdoorBalkans</p>
            <h1 style={{ fontFamily:SERIF, color:'#fff', fontSize:'1.5rem',
              fontWeight:900, marginBottom:'4px' }}>📍 Predloži lokaciju</h1>
            <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.85rem' }}>
              3 brza koraka — ostatak radi sistem
            </p>
            <div style={{ display:'flex', gap:'6px', marginTop:'16px' }}>
              {[1,2,3].map(s => (
                <div key={s} style={{ flex:1, height:'4px', borderRadius:'999px', transition:'background 0.3s',
                  background: step > s ? '#4ade80' : step === s ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)' }} />
              ))}
            </div>
          </div>

          <div style={{ padding:'28px' }}>

            {/* KORAK 1 */}
            {step === 1 && (
              <div>
                <p style={{ fontWeight:800, fontSize:'1rem', color:'#0e1a0e', marginBottom:'4px' }}>
                  Korak 1 — Gdje se nalazi?
                </p>
                <div style={{ background:'#f9f7f2', borderRadius:'14px', padding:'14px 16px', marginBottom:'18px' }}>
                  <p style={{ fontSize:'0.75rem', fontWeight:700, color:'#0e1a0e', marginBottom:'8px' }}>
                    Kako dobiti koordinate:
                  </p>
                  {[
                    { icon:'📱', title:'Mobilni Google Maps', desc:'Drži prst na tački → pojave se koordinate → kopiraj' },
                    { icon:'💻', title:'Desktop Google Maps', desc:'Desni klik na tačku → klikni na koordinate → kopirane' },
                    { icon:'🔗', title:'Dugačak Maps link',   desc:'Share → Copy link (maps.google.com, ne goo.gl)' },
                  ].map(t => (
                    <div key={t.icon} style={{ display:'flex', gap:'10px', alignItems:'flex-start', marginBottom:'8px' }}>
                      <span style={{ fontSize:'1rem', flexShrink:0 }}>{t.icon}</span>
                      <div>
                        <p style={{ fontSize:'0.78rem', fontWeight:700, color:'#0e1a0e', marginBottom:'1px' }}>{t.title}</p>
                        <p style={{ fontSize:'0.73rem', color:'#8fa68f' }}>{t.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <input value={mapInput} onChange={e => { setMapInput(e.target.value); setError('') }}
                  placeholder='44.1234, 22.5678  ili  maps.google.com/...'
                  style={{ width:'100%', border:`1.5px solid ${error ? '#fca5a5' : '#e8e2d4'}`,
                    borderRadius:'12px', padding:'12px 14px', fontSize:'0.9rem',
                    fontFamily:SANS, outline:'none', color:'#0e1a0e', marginBottom:'8px',
                    boxSizing:'border-box' }} />

                {error === 'short_url' && (
                  <div style={{ background:'#fffbeb', border:'1px solid #fde68a',
                    borderRadius:'12px', padding:'14px', marginBottom:'12px' }}>
                    <p style={{ fontWeight:700, color:'#92400e', fontSize:'0.82rem', marginBottom:'6px' }}>
                      ⚠️ Skraćeni link — rješavamo automatski
                    </p>
                    <p style={{ color:'#78350f', fontSize:'0.78rem', lineHeight:1.7 }}>
                      Pokušaj ponovo — server će otvoriti link i izvući koordinate.
                      Ako i dalje ne radi, koristi <strong>koordinate direktno</strong> iz Google Maps.
                    </p>
                  </div>
                )}
                {error === 'not_found' && (
                  <div style={{ background:'#fef2f2', border:'1px solid #fecaca',
                    borderRadius:'12px', padding:'14px', marginBottom:'12px' }}>
                    <p style={{ fontWeight:700, color:'#991b1b', fontSize:'0.82rem', marginBottom:'4px' }}>
                      ❌ Koordinate nisu pronađene
                    </p>
                    <p style={{ color:'#7f1d1d', fontSize:'0.78rem' }}>
                      Koristi koordinate direktno — npr. <strong>44.6833, 22.0167</strong>
                    </p>
                  </div>
                )}

                <div style={{ display:'flex', gap:'8px', marginBottom:'16px', flexWrap:'wrap' }}>
                  <p style={{ fontSize:'0.72rem', color:'#8fa68f', width:'100%' }}>Brzi primjer:</p>
                  {[{ label:'Đerdap', val:'44.6833, 22.0167' },{ label:'Kopaonik', val:'43.2900, 20.8200' }].map(ex => (
                    <button key={ex.label} onClick={() => setMapInput(ex.val)}
                      style={{ border:'1px solid #e8e2d4', background:'#f9f7f2', borderRadius:'8px',
                        padding:'5px 12px', fontSize:'0.75rem', color:'#555', cursor:'pointer', fontFamily:SANS }}>
                      {ex.label}
                    </button>
                  ))}
                </div>

                <button onClick={handleMapSubmit} disabled={!mapInput.trim() || loading}
                  style={{ width:'100%', padding:'14px', borderRadius:'14px', border:'none',
                    background: mapInput.trim() ? 'linear-gradient(135deg,#1e3d1e,#2d6a2d)' : '#e8e2d4',
                    color: mapInput.trim() ? '#fff' : '#aaa',
                    fontWeight:700, fontSize:'0.95rem', cursor: mapInput.trim() ? 'pointer' : 'default',
                    fontFamily:SANS, display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
                  {loading ? '⟳ Pronalazim lokaciju...' : 'Pronađi lokaciju →'}
                </button>
              </div>
            )}

            {/* KORAK 2 */}
            {step === 2 && (
              <div>
                <p style={{ fontWeight:800, fontSize:'1rem', color:'#0e1a0e', marginBottom:'16px' }}>
                  Korak 2 — Vrsta aktivnosti
                </p>
                <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'12px',
                  padding:'12px 14px', marginBottom:'20px', display:'flex', gap:'10px', alignItems:'center' }}>
                  <span>✅</span>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:700, fontSize:'0.9rem', color:'#065f46' }}>{geoData?.name}</p>
                    <p style={{ fontSize:'0.75rem', color:'#047857' }}>
                      {geoData?.address} · {coords?.lat?.toFixed(4)}, {coords?.lng?.toFixed(4)}
                    </p>
                  </div>
                  <button onClick={() => { setStep(1); setGeoData(null) }}
                    style={{ background:'none', border:'none', color:'#047857',
                      fontSize:'0.75rem', cursor:'pointer', fontWeight:600, fontFamily:SANS }}>izmijeni</button>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', marginBottom:'24px' }}>
                  {CATEGORIES.map(cat => (
                    <button key={cat.slug} onClick={() => setCategory(cat)}
                      style={{ padding:'14px 8px', borderRadius:'14px', border:'none',
                        background: category?.slug === cat.slug ? cat.color : '#f4f0e6',
                        color: category?.slug === cat.slug ? '#fff' : '#0e1a0e',
                        cursor:'pointer', fontFamily:SANS, fontWeight:700, fontSize:'0.82rem',
                        transition:'all 0.15s',
                        boxShadow: category?.slug === cat.slug ? `0 4px 16px ${cat.color}44` : 'none' }}>
                      <div style={{ fontSize:'1.4rem', marginBottom:'4px' }}>{cat.icon}</div>
                      {cat.label}
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep(3)} disabled={!category}
                  style={{ width:'100%', padding:'14px', borderRadius:'14px', border:'none',
                    background: category ? 'linear-gradient(135deg,#1e3d1e,#2d6a2d)' : '#e8e2d4',
                    color: category ? '#fff' : '#aaa', fontWeight:700, fontSize:'0.95rem',
                    cursor: category ? 'pointer' : 'default', fontFamily:SANS }}>
                  Dalje →
                </button>
              </div>
            )}

            {/* KORAK 3 */}
            {step === 3 && (
              <div>
                <p style={{ fontWeight:800, fontSize:'1rem', color:'#0e1a0e', marginBottom:'4px' }}>
                  Korak 3 — Fotografije i napomena
                </p>
                <p style={{ color:'#8fa68f', fontSize:'0.85rem', marginBottom:'18px' }}>
                  Opciono ali preporučeno — lokacije sa slikama dobijaju 3× više poseta.
                </p>
                <div onClick={() => fileRef.current?.click()}
                  style={{ border:'2px dashed #e8e2d4', borderRadius:'16px', padding:'24px',
                    textAlign:'center', cursor:'pointer', background:'#fafaf8', marginBottom:'16px' }}>
                  {photos.length > 0 ? (
                    <div style={{ display:'flex', gap:'8px', justifyContent:'center' }}>
                      {photos.map((url,i) => (
                        <div key={i} style={{ width:'80px', height:'80px', borderRadius:'10px', overflow:'hidden' }}>
                          <img src={url} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize:'2rem', marginBottom:'8px' }}>📸</div>
                      <p style={{ fontWeight:700, color:'#0e1a0e', marginBottom:'4px' }}>Dodaj fotografije (max 3)</p>
                      <p style={{ fontSize:'0.78rem', color:'#8fa68f' }}>Klikni ili prevuci slike ovdje</p>
                    </>
                  )}
                  <input ref={fileRef} type='file' accept='image/*' multiple
                    style={{ display:'none' }} onChange={handlePhoto} />
                </div>
                <textarea value={note} onChange={e => setNote(e.target.value)}
                  placeholder='Savjet za pristup, sezonske preporuke, posebna pravila...'
                  style={{ width:'100%', border:'1.5px solid #e8e2d4', borderRadius:'12px',
                    padding:'12px 14px', fontSize:'0.88rem', fontFamily:SANS, resize:'vertical',
                    minHeight:'80px', outline:'none', color:'#0e1a0e', boxSizing:'border-box',
                    background:'#fafaf8', marginBottom:'16px' }} />
                <div style={{ background:'#f9f7f2', borderRadius:'12px', padding:'12px 14px',
                  marginBottom:'18px', fontSize:'0.78rem', color:'#555', lineHeight:1.8 }}>
                  📍 <strong style={{color:'#0e1a0e'}}>{geoData?.name}</strong> · {category?.icon} {category?.label}<br/>
                  🤖 <span style={{color:'#2d6a2d'}}>AI automatski generiše opis, SEO i sezonske savjete</span>
                </div>
                <button onClick={handleSubmit} disabled={loading}
                  style={{ width:'100%', padding:'14px', borderRadius:'14px', border:'none',
                    background:'linear-gradient(135deg,#1e3d1e,#2d6a2d)', color:'#fff',
                    fontWeight:700, fontSize:'0.95rem', cursor:'pointer', fontFamily:SANS }}>
                  {loading ? '⟳ Šaljem...' : '✅ Pošalji predlog'}
                </button>
              </div>
            )}

            {/* DONE */}
            {step === 4 && (
              <div style={{ textAlign:'center', padding:'20px 0' }}>
                <div style={{ fontSize:'3.5rem', marginBottom:'16px' }}>🎉</div>
                <h2 style={{ fontFamily:SERIF, fontSize:'1.3rem', fontWeight:900,
                  color:'#0e1a0e', marginBottom:'8px' }}>Predlog primljen!</h2>
                <p style={{ color:'#8fa68f', lineHeight:1.7, marginBottom:'24px' }}>
                  Sistem je automatski generisao opis i SEO podatke.<br/>
                  Admin pregleda za <strong style={{color:'#0e1a0e'}}>manje od 24h</strong>.
                </p>
                <a href='/' style={{ background:'#2d6a2d', color:'#fff', padding:'12px 28px',
                  borderRadius:'14px', textDecoration:'none', fontWeight:700 }}>
                  Nazad na početnu
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
