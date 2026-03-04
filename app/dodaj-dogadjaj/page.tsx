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
  { value: 'nacionalni-parkovi', label: '🦋 Nacionalni parkovi' },
]

const CAT_COLOR: Record<string, string> = {
  ribolov: '#1d5fa8', lov: '#5a3010', kajak: '#0e7490',
  kampovanje: '#166534', planinarenje: '#5b21b6', 'nacionalni-parkovi': '#0f766e',
}

export default function DodajDogadjaj() {
  const [form, setForm] = useState({
    title: '', category: 'ribolov', event_date: '',
    location_name: '', description: '', contact: '', link: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const color = CAT_COLOR[form.category] ?? '#2d6a2d'

  const inputStyle: React.CSSProperties = {
    width: '100%', border: '1.5px solid #e8e2d4', borderRadius: '14px',
    padding: '13px 16px', fontSize: '0.95rem', fontFamily: SANS,
    outline: 'none', background: '#fff', color: '#0e1a0e', boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.82rem', fontWeight: 700,
    color: '#3d4d3d', marginBottom: '7px',
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    if (!form.title.trim() || !form.event_date) {
      setError('Naziv i datum su obavezni.'); setLoading(false); return
    }
    const { error: err } = await supabase.from('events').insert({
      title: form.title.trim(), category: form.category,
      event_date: form.event_date,
      location_name: form.location_name.trim() || null,
      description: form.description.trim() || null,
      contact: form.contact.trim() || null,
      link: form.link.trim() || null,
      is_approved: false,
    })
    if (err) { setError('Greška: ' + err.message); setLoading(false); return }
    setSuccess(true); setLoading(false)
  }

  if (success) return (
    <div style={{ fontFamily: SANS, minHeight: '100vh', background: '#f9f7f2',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: '#fff', borderRadius: '28px', padding: '56px 40px',
        textAlign: 'center', maxWidth: '480px', width: '100%',
        boxShadow: '0 8px 40px rgba(0,0,0,0.08)', border: '1px solid #f0ede6' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎉</div>
        <h1 style={{ fontFamily: SERIF, fontSize: '1.8rem', fontWeight: 800,
          color: '#0e1a0e', marginBottom: '12px' }}>Događaj prijavljen!</h1>
        <p style={{ color: '#8fa68f', lineHeight: 1.7, marginBottom: '8px' }}>
          <strong style={{ color: '#0e1a0e' }}>{form.title}</strong> je uspješno prijavljen.
        </p>
        <p style={{ color: '#8fa68f', fontSize: '0.88rem', marginBottom: '36px' }}>
          Admin tim će pregledati i objaviti događaj u roku od 24h.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => { setSuccess(false); setForm({ title:'',category:'ribolov',event_date:'',location_name:'',description:'',contact:'',link:'' }) }}
            style={{ padding: '12px 24px', borderRadius: '14px', border: `2px solid ${color}`,
              background: 'transparent', color, fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', fontFamily: SANS }}>
            Dodaj još jedan
          </button>
          <Link href='/kalendar-aktivnosti'
            style={{ padding: '12px 24px', borderRadius: '14px', background: color,
              color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
            Vidi kalendar →
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily: SANS, minHeight: '100vh', background: '#f9f7f2' }}>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${color}dd 0%, ${color}99 100%)`,
        padding: '72px 24px 56px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '24px 24px' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '72px', height: '72px', background: 'rgba(255,255,255,0.2)',
            borderRadius: '22px', fontSize: '2rem', marginBottom: '20px',
            backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}>
            📅
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(1.8rem,4vw,2.8rem)',
            fontWeight: 900, color: '#fff', marginBottom: '12px',
            textShadow: '0 2px 16px rgba(0,0,0,0.2)' }}>
            Prijavi Događaj
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: '1rem',
            maxWidth: '460px', margin: '0 auto', lineHeight: 1.7 }}>
            Takmičenje, izlazak, festival? Podeli sa outdoor zajednicom Balkana.
          </p>
        </div>
      </div>

      <div style={{ marginTop: '-1px' }}>
        <svg viewBox='0 0 1440 40' preserveAspectRatio='none' style={{ width: '100%', height: '40px', display: 'block' }}>
          <path d='M0 40 C480 0 960 30 1440 10 L1440 40 Z' fill='#f9f7f2'/>
        </svg>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '32px 24px 80px' }}>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '28px' }}>
          <Link href='/' style={{ color: '#8fa68f', fontSize: '0.82rem', textDecoration: 'none' }}>Početna</Link>
          <span style={{ color: '#d4cbbf' }}>›</span>
          <Link href='/kalendar-aktivnosti' style={{ color: '#8fa68f', fontSize: '0.82rem', textDecoration: 'none' }}>Kalendar</Link>
          <span style={{ color: '#d4cbbf' }}>›</span>
          <span style={{ color: '#0e1a0e', fontSize: '0.82rem', fontWeight: 600 }}>Prijavi događaj</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ background: '#fff', borderRadius: '24px', padding: '36px',
            border: '1px solid #f0ede6', boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            display: 'flex', flexDirection: 'column', gap: '24px' }}>

            <div>
              <label style={labelStyle}>Kategorija *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
                {CATEGORIES.map(cat => (
                  <button key={cat.value} type='button' onClick={() => set('category', cat.value)}
                    style={{ padding: '10px 6px', borderRadius: '12px', fontSize: '0.8rem',
                      fontWeight: form.category === cat.value ? 700 : 500, cursor: 'pointer',
                      border: `2px solid ${form.category === cat.value ? CAT_COLOR[cat.value] : '#e8e2d4'}`,
                      background: form.category === cat.value ? CAT_COLOR[cat.value] + '18' : '#fff',
                      color: form.category === cat.value ? CAT_COLOR[cat.value] : '#3d4d3d',
                      fontFamily: SANS, transition: 'all 0.15s' }}>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Naziv događaja *</label>
              <input value={form.title} onChange={e => set('title', e.target.value)}
                placeholder='npr. Ribolovačko takmičenje — Dunav 2025'
                required style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Datum *</label>
              <input type='date' value={form.event_date}
                onChange={e => set('event_date', e.target.value)}
                required min={new Date().toISOString().split('T')[0]}
                style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Mesto / Lokacija</label>
              <input value={form.location_name} onChange={e => set('location_name', e.target.value)}
                placeholder='npr. Đerdapsko jezero, Beograd...' style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Opis</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                placeholder='Kratko opišite događaj...' rows={4}
                style={{ ...inputStyle, resize: 'vertical', minHeight: '110px' }} />
            </div>

            <div>
              <label style={labelStyle}>Link (sajt, Facebook...)</label>
              <input type='url' value={form.link} onChange={e => set('link', e.target.value)}
                placeholder='https://...' style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Kontakt</label>
              <input value={form.contact} onChange={e => set('contact', e.target.value)}
                placeholder='email ili telefon' style={inputStyle} />
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: '12px', padding: '14px 16px', color: '#dc2626', fontSize: '0.88rem' }}>
                ⚠️ {error}
              </div>
            )}

            <button type='submit' disabled={loading}
              style={{ background: loading ? '#ccc' : color, color: '#fff', border: 'none',
                borderRadius: '16px', padding: '16px', fontSize: '1rem', fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer', fontFamily: SANS,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {loading ? '⏳ Šaljem...' : '📅 Prijavi događaj'}
            </button>

            <p style={{ textAlign: 'center', color: '#8fa68f', fontSize: '0.8rem', margin: 0 }}>
              Pojavljuje se na kalendaru nakon odobrenja (do 24h).
            </p>
          </div>
        </form>

        <div style={{ marginTop: '20px', background: '#fff', borderRadius: '20px', padding: '22px',
          border: '1px solid #f0ede6', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '2rem' }}>📍</div>
          <div>
            <p style={{ fontWeight: 700, color: '#0e1a0e', fontSize: '0.95rem', marginBottom: '4px' }}>
              Znaš neku lokaciju?
            </p>
            <Link href='/predlozi-lokaciju'
              style={{ color: '#2d6a2d', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none' }}>
              Predloži lokaciju →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
