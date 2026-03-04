'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const SERIF = "'Fraunces','Playfair Display',Georgia,serif"
const SANS  = "'DM Sans',system-ui,sans-serif"

const CATEGORIES = [
  { value: 'ribolov',            label: '🎣 Ribolov' },
  { value: 'lov',                label: '🦌 Lov' },
  { value: 'kajak',              label: '🚣 Kajak' },
  { value: 'kampovanje',         label: '⛺ Kampovanje' },
  { value: 'planinarenje',       label: '🥾 Planinarenje' },
  { value: 'nacionalni-parkovi', label: '🦋 Nac. parkovi' },
]
const COUNTRIES = [
  { value: 'srbija',    label: '🇷🇸 Srbija' },
  { value: 'hrvatska',  label: '🇭🇷 Hrvatska' },
  { value: 'bosna',     label: '🇧🇦 Bosna i Hercegovina' },
  { value: 'crna-gora', label: '🇲🇪 Crna Gora' },
  { value: 'slovenija', label: '🇸🇮 Slovenija' },
  { value: 'makedonija',label: '🇲🇰 Makedonija' },
]
const CAT_COLOR: Record<string,string> = {
  ribolov:'#1d5fa8', lov:'#5a3010', kajak:'#0e7490',
  kampovanje:'#166534', planinarenje:'#5b21b6', 'nacionalni-parkovi':'#0f766e',
}

export default function PredloziLokaciju() {
  const [form, setForm] = useState({
    name:'', category:'ribolov', country:'srbija',
    region:'', lat:'', lng:'', description:'', contact:'',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const color = CAT_COLOR[form.category] ?? '#2d6a2d'

  const inputStyle: React.CSSProperties = {
    width:'100%', border:'1.5px solid #e8e2d4', borderRadius:'14px',
    padding:'13px 16px', fontSize:'0.95rem', fontFamily:SANS,
    outline:'none', background:'#fff', color:'#0e1a0e', boxSizing:'border-box',
  }
  const labelStyle: React.CSSProperties = {
    display:'block', fontSize:'0.82rem', fontWeight:700,
    color:'#3d4d3d', marginBottom:'7px',
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError('')
    if (!form.name.trim()) { setError('Naziv je obavezan.'); setLoading(false); return }
    const { error: err } = await supabase.from('location_proposals').insert({
      name: form.name, category: form.category, country: form.country,
      region: form.region || null,
      lat: form.lat ? parseFloat(form.lat) : null,
      lng: form.lng ? parseFloat(form.lng) : null,
      description: form.description || null,
      contact: form.contact || null,
    })
    if (err) { setError('Greška: ' + err.message); setLoading(false); return }
    setSuccess(true); setLoading(false)
  }

  if (success) return (
    <div style={{ fontFamily:SANS, minHeight:'100vh', background:'#f9f7f2',
      display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
      <div style={{ background:'#fff', borderRadius:'28px', padding:'56px 40px',
        textAlign:'center', maxWidth:'480px', width:'100%',
        boxShadow:'0 8px 40px rgba(0,0,0,0.08)', border:'1px solid #f0ede6' }}>
        <div style={{ fontSize:'4rem', marginBottom:'16px' }}>🎉</div>
        <h1 style={{ fontFamily:SERIF, fontSize:'1.8rem', fontWeight:800, color:'#0e1a0e', marginBottom:'12px' }}>
          Hvala na predlogu!
        </h1>
        <p style={{ color:'#8fa68f', lineHeight:1.7, marginBottom:'8px' }}>
          Lokacija <strong style={{ color:'#0e1a0e' }}>{form.name}</strong> je primljena.
        </p>
        <p style={{ color:'#8fa68f', fontSize:'0.88rem', marginBottom:'36px' }}>
          Naš tim će pregledati i dodati je u bazu u roku od 48h.
        </p>
        <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
          <button onClick={() => { setSuccess(false); setForm({ name:'',category:'ribolov',country:'srbija',region:'',lat:'',lng:'',description:'',contact:'' }) }}
            style={{ padding:'12px 24px', borderRadius:'14px', border:`2px solid ${color}`,
              background:'transparent', color, fontWeight:700, cursor:'pointer', fontSize:'0.9rem', fontFamily:SANS }}>
            Predloži još jednu
          </button>
          <Link href='/'
            style={{ padding:'12px 24px', borderRadius:'14px', background:color,
              color:'#fff', fontWeight:700, textDecoration:'none', fontSize:'0.9rem' }}>
            Vrati se na početnu
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily:SANS, minHeight:'100vh', background:'#f9f7f2' }}>
      <div style={{ background:`linear-gradient(135deg, ${color}dd 0%, ${color}99 100%)`,
        padding:'72px 24px 56px', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, opacity:0.06,
          backgroundImage:'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize:'24px 24px' }} />
        <div style={{ position:'relative' }}>
          <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center',
            width:'72px', height:'72px', background:'rgba(255,255,255,0.2)',
            borderRadius:'22px', fontSize:'2rem', marginBottom:'20px',
            backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.3)' }}>📍</div>
          <h1 style={{ fontFamily:SERIF, fontSize:'clamp(1.8rem,4vw,2.8rem)',
            fontWeight:900, color:'#fff', marginBottom:'12px',
            textShadow:'0 2px 16px rgba(0,0,0,0.2)' }}>
            Predloži Lokaciju
          </h1>
          <p style={{ color:'rgba(255,255,255,0.88)', fontSize:'1rem',
            maxWidth:'480px', margin:'0 auto', lineHeight:1.7 }}>
            Znaš dobro mesto za ribolov, lov ili planinarenje? Podeli ga sa zajednicom Balkana!
          </p>
        </div>
      </div>

      <div style={{ marginTop:'-1px' }}>
        <svg viewBox='0 0 1440 40' preserveAspectRatio='none' style={{ width:'100%', height:'40px', display:'block' }}>
          <path d='M0 40 C480 0 960 30 1440 10 L1440 40 Z' fill='#f9f7f2'/>
        </svg>
      </div>

      <div style={{ maxWidth:'640px', margin:'0 auto', padding:'32px 24px 80px' }}>
        <div style={{ display:'flex', gap:'8px', alignItems:'center', marginBottom:'28px' }}>
          <Link href='/' style={{ color:'#8fa68f', fontSize:'0.82rem', textDecoration:'none' }}>Početna</Link>
          <span style={{ color:'#d4cbbf' }}>›</span>
          <span style={{ color:'#0e1a0e', fontSize:'0.82rem', fontWeight:600 }}>Predloži lokaciju</span>
        </div>

        {/* Info box */}
        <div style={{ background:'rgba(29,95,168,0.08)', border:'1px solid rgba(29,95,168,0.2)',
          borderRadius:'16px', padding:'16px 20px', marginBottom:'24px',
          display:'flex', gap:'12px', alignItems:'flex-start' }}>
          <span style={{ fontSize:'1.4rem', flexShrink:0 }}>ℹ️</span>
          <div>
            <p style={{ fontWeight:700, color:'#1d5fa8', fontSize:'0.88rem', marginBottom:'4px' }}>Kako funkcioniše?</p>
            <p style={{ color:'#3d4d3d', fontSize:'0.84rem', lineHeight:1.6 }}>
              Popuni formu i pošalji predlog. Tim pregleda svaki predlog i dodaje ga u bazu.
              GPS koordinate nađeš desnim klikom na Google Maps → "Šta se ovde nalazi".
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ background:'#fff', borderRadius:'24px', padding:'36px',
            border:'1px solid #f0ede6', boxShadow:'0 4px 24px rgba(0,0,0,0.06)',
            display:'flex', flexDirection:'column', gap:'24px' }}>

            {/* Kategorija */}
            <div>
              <label style={labelStyle}>Aktivnost *</label>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
                {CATEGORIES.map(cat => (
                  <button key={cat.value} type='button' onClick={() => set('category', cat.value)}
                    style={{ padding:'10px 6px', borderRadius:'12px', fontSize:'0.8rem',
                      fontWeight: form.category === cat.value ? 700 : 500, cursor:'pointer',
                      border:`2px solid ${form.category === cat.value ? CAT_COLOR[cat.value] : '#e8e2d4'}`,
                      background: form.category === cat.value ? CAT_COLOR[cat.value]+'18' : '#fff',
                      color: form.category === cat.value ? CAT_COLOR[cat.value] : '#3d4d3d',
                      fontFamily:SANS, transition:'all 0.15s' }}>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Naziv */}
            <div>
              <label style={labelStyle}>Naziv lokacije *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)}
                placeholder='npr. Ribnjak kod Aranđelovca' required style={inputStyle} />
            </div>

            {/* Država */}
            <div>
              <label style={labelStyle}>Država</label>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'8px' }}>
                {COUNTRIES.map(c => (
                  <button key={c.value} type='button' onClick={() => set('country', c.value)}
                    style={{ padding:'9px 12px', borderRadius:'12px', fontSize:'0.82rem', textAlign:'left',
                      fontWeight: form.country === c.value ? 700 : 400, cursor:'pointer',
                      border:`2px solid ${form.country === c.value ? color : '#e8e2d4'}`,
                      background: form.country === c.value ? color+'12' : '#fff',
                      color: form.country === c.value ? color : '#3d4d3d',
                      fontFamily:SANS, transition:'all 0.15s' }}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Region */}
            <div>
              <label style={labelStyle}>Region / Oblast</label>
              <input value={form.region} onChange={e => set('region', e.target.value)}
                placeholder='npr. Šumadija, Vojvodina, Zlatibor...' style={inputStyle} />
            </div>

            {/* GPS */}
            <div>
              <label style={labelStyle}>GPS Koordinate</label>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                <input value={form.lat} onChange={e => set('lat', e.target.value)}
                  placeholder='Latitude (npr. 44.1234)' style={inputStyle} />
                <input value={form.lng} onChange={e => set('lng', e.target.value)}
                  placeholder='Longitude (npr. 20.5678)' style={inputStyle} />
              </div>
              <p style={{ fontSize:'0.76rem', color:'#8fa68f', marginTop:'6px' }}>
                💡 Desni klik na Google Maps → kopiraj koordinate
              </p>
            </div>

            {/* Opis */}
            <div>
              <label style={labelStyle}>Opis lokacije</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                placeholder='Što više detalja — pristup, sezone, posebnosti...' rows={4}
                style={{ ...inputStyle, resize:'vertical', minHeight:'110px' }} />
            </div>

            {/* Kontakt */}
            <div>
              <label style={labelStyle}>Kontakt (opciono)</label>
              <input value={form.contact} onChange={e => set('contact', e.target.value)}
                placeholder='email ili telefon' style={inputStyle} />
            </div>

            {error && (
              <div style={{ background:'#fef2f2', border:'1px solid #fecaca',
                borderRadius:'12px', padding:'14px 16px', color:'#dc2626', fontSize:'0.88rem' }}>
                ⚠️ {error}
              </div>
            )}

            <button type='submit' disabled={loading}
              style={{ background: loading ? '#ccc' : color, color:'#fff', border:'none',
                borderRadius:'16px', padding:'16px', fontSize:'1rem', fontWeight:700,
                cursor: loading ? 'not-allowed' : 'pointer', fontFamily:SANS,
                display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
              {loading ? '⏳ Šaljem...' : '📍 Pošalji predlog'}
            </button>
            <p style={{ textAlign:'center', color:'#8fa68f', fontSize:'0.8rem', margin:0 }}>
              Svaki predlog prolazi manuelnu proveru pre objavljivanja.
            </p>
          </div>
        </form>

        {/* Link na dodaj dogadjaj */}
        <div style={{ marginTop:'20px', background:'#fff', borderRadius:'20px', padding:'22px',
          border:'1px solid #f0ede6', display:'flex', alignItems:'center', gap:'16px' }}>
          <div style={{ fontSize:'2rem' }}>📅</div>
          <div>
            <p style={{ fontWeight:700, color:'#0e1a0e', fontSize:'0.95rem', marginBottom:'4px' }}>
              Imaš outdoor događaj?
            </p>
            <Link href='/dodaj-dogadjaj'
              style={{ color:'#2d6a2d', fontWeight:700, fontSize:'0.88rem', textDecoration:'none' }}>
              Predloži događaj →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
