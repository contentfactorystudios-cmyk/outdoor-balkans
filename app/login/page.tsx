'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const ADMIN = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '').split(',').map(e => e.trim().toLowerCase())

type Tab = 'login' | 'register' | 'reset'

export default function LoginPage() {
  const [tab,     setTab]     = useState<Tab>('login')
  const [email,   setEmail]   = useState('')
  const [pass,    setPass]    = useState('')
  const [name,    setName]    = useState('')
  const [msg,     setMsg]     = useState<{ type: 'error'|'ok'; text: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function reset() { setMsg(null) }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); reset()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass })
    setLoading(false)
    if (error) { setMsg({ type: 'error', text: 'Pogrešan email ili lozinka.' }); return }
    const em = data.user?.email?.toLowerCase() ?? ''
    router.push(ADMIN.includes(em) ? '/admin' : '/')
    router.refresh()
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); reset()
    if (pass.length < 6) { setMsg({ type: 'error', text: 'Lozinka mora imati najmanje 6 karaktera.' }); setLoading(false); return }
    const { error } = await supabase.auth.signUp({
      email, password: pass, options: { data: { full_name: name } },
    })
    setLoading(false)
    if (error) { setMsg({ type: 'error', text: error.message }); return }
    setMsg({ type: 'ok', text: 'Provjeri email za potvrdu registracije!' })
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); reset()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-lozinke/potvrda',
    })
    setLoading(false)
    if (error) { setMsg({ type: 'error', text: error.message }); return }
    setMsg({ type: 'ok', text: 'Email za reset lozinke je poslat. Provjeri inbox.' })
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/auth/callback' },
    })
  }

  const inp: React.CSSProperties = {
    width: '100%', border: '1.5px solid #ddd', borderRadius: '10px',
    padding: '14px 16px', fontSize: '1rem', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit', background: '#fafaf8',
    transition: 'border-color 0.2s',
  }

  const titles: Record<Tab, string> = {
    login:    'Dobrodošao nazad.',
    register: 'Pridruži se zajednici.',
    reset:    'Zaboravljena lozinka?',
  }
  const subs: Record<Tab, string> = {
    login:    'Prijavi se i počni da istražuješ.',
    register: 'Kreiraj nalog besplatno u 30 sekundi.',
    reset:    'Poslat ćemo ti link za reset lozinke.',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'DM Sans',system-ui,sans-serif" }}>

      {/* ── LEVA FOTO POLOVINA ── */}
      <div className='login-photo' style={{ flex: 1, position: 'relative', display: 'none' }}>
        <img src='https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=1800&fit=crop&q=85'
          alt='Priroda' style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(14,26,14,0.3) 0%, rgba(14,26,14,0.7) 100%)' }} />
        <div style={{ position: 'absolute', top: '32px', left: '36px' }}>
          <Link href='/' style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width='36' height='36' viewBox='0 0 36 36' fill='none'>
              <circle cx='18' cy='18' r='17' stroke='#6ab87a' strokeWidth='2' fill='rgba(255,255,255,0.1)'/>
              <polygon points='18,5 21,18 18,21 15,18' fill='#6ab87a'/>
              <polygon points='18,31 15,18 18,15 21,18' fill='#e07a5f'/>
              <circle cx='18' cy='18' r='2.5' fill='#fff'/>
            </svg>
            <span style={{ fontFamily: "'Fraunces','Playfair Display',Georgia,serif",
              fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>OutdoorBalkans</span>
          </Link>
        </div>
        <div style={{ position: 'absolute', bottom: '48px', left: '36px', right: '36px' }}>
          <blockquote style={{ fontFamily: "'Fraunces','Playfair Display',Georgia,serif",
            fontSize: '1.5rem', fontWeight: 700, color: '#fff', lineHeight: 1.3,
            textShadow: '0 2px 16px rgba(0,0,0,0.4)', margin: 0 }}>
            "Svaka velika avantura počinje prvim korakom."
          </blockquote>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginTop: '10px' }}>— OutdoorBalkans zajednica</p>
        </div>
      </div>

      {/* ── DESNA FORMA POLOVINA ── */}
      <div style={{ width: '100%', maxWidth: '500px', display: 'flex',
        flexDirection: 'column', justifyContent: 'center', padding: '48px 48px',
        background: '#fff', overflowY: 'auto' }}>

        <Link href='/' style={{ color: '#8fa68f', fontSize: '0.85rem', textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '36px' }}>
          ← Nazad na sajt
        </Link>

        <h1 style={{ fontFamily: "'Fraunces','Playfair Display',Georgia,serif",
          fontSize: '2rem', fontWeight: 900, color: '#0e1a0e', marginBottom: '6px', lineHeight: 1.2 }}>
          {titles[tab]}
        </h1>
        <p style={{ color: '#8fa68f', fontSize: '0.95rem', marginBottom: '28px' }}>{subs[tab]}</p>

        {/* Tab switcher — login/register */}
        {tab !== 'reset' && (
          <div style={{ display: 'flex', background: '#f4f0e6', borderRadius: '12px',
            padding: '4px', marginBottom: '24px', gap: '4px' }}>
            {(['login', 'register'] as Tab[]).map(t => (
              <button key={t} onClick={() => { setTab(t); setMsg(null) }}
                style={{ flex: 1, padding: '11px', borderRadius: '10px', border: 'none',
                  cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700, fontFamily: 'inherit',
                  background: tab === t ? '#fff' : 'transparent',
                  color: tab === t ? '#0e1a0e' : '#8fa68f',
                  boxShadow: tab === t ? '0 1px 6px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s' }}>
                {t === 'login' ? 'Prijava' : 'Registracija'}
              </button>
            ))}
          </div>
        )}

        {/* Google dugme — samo za login/register */}
        {tab !== 'reset' && (
          <>
            <button onClick={handleGoogle} style={{ width: '100%', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: '10px',
              border: '1.5px solid #ddd', borderRadius: '10px', padding: '13px',
              background: '#fff', cursor: 'pointer', fontSize: '0.95rem',
              fontWeight: 600, color: '#0e1a0e', marginBottom: '18px', fontFamily: 'inherit' }}>
              <svg width='20' height='20' viewBox='0 0 48 48'>
                <path fill='#EA4335' d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'/>
                <path fill='#4285F4' d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'/>
                <path fill='#FBBC05' d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'/>
                <path fill='#34A853' d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'/>
              </svg>
              Nastavi sa Google
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ flex: 1, height: '1px', background: '#e8e2d4' }} />
              <span style={{ color: '#bbb', fontSize: '0.8rem' }}>ili emailom</span>
              <div style={{ flex: 1, height: '1px', background: '#e8e2d4' }} />
            </div>
          </>
        )}

        {/* Forma */}
        <form onSubmit={tab === 'login' ? handleLogin : tab === 'register' ? handleRegister : handleReset}>
          {tab === 'register' && (
            <div style={{ marginBottom: '12px' }}>
              <input type='text' value={name} onChange={e => setName(e.target.value)}
                placeholder='Ime i prezime' required style={inp} />
            </div>
          )}
          <div style={{ marginBottom: '12px' }}>
            <input type='email' value={email} onChange={e => setEmail(e.target.value)}
              placeholder='Email adresa *' required style={inp} />
          </div>
          {tab !== 'reset' && (
            <div style={{ marginBottom: '8px' }}>
              <input type='password' value={pass} onChange={e => setPass(e.target.value)}
                placeholder='Lozinka *' required minLength={6} style={inp} />
            </div>
          )}
          {tab === 'login' && (
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <button type='button' onClick={() => { setTab('reset'); setMsg(null) }}
                style={{ background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '0.83rem', color: '#8fa68f', fontFamily: 'inherit', padding: 0 }}>
                Zaboravili ste lozinku?
              </button>
            </div>
          )}

          {msg && (
            <div style={{
              borderRadius: '10px', padding: '12px 16px', marginBottom: '16px',
              fontSize: '0.88rem', fontWeight: 500,
              background: msg.type === 'error' ? '#fef2f2' : '#f0fdf4',
              color: msg.type === 'error' ? '#dc2626' : '#16a34a',
              border: `1px solid ${msg.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
            }}>
              {msg.text}
            </div>
          )}

          <button type='submit' disabled={loading} style={{
            width: '100%', background: '#2d3b2d',
            color: '#fff', border: 'none', borderRadius: '10px',
            padding: '15px', fontSize: '1rem', fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, fontFamily: 'inherit',
            marginBottom: '16px',
          }}>
            {loading ? '...' : tab === 'login' ? 'Prijavi se' : tab === 'register' ? 'Kreiraj nalog' : 'Pošalji reset link'}
          </button>

          {tab === 'reset' && (
            <button type='button' onClick={() => { setTab('login'); setMsg(null) }}
              style={{ width: '100%', background: 'none', border: '1.5px solid #ddd',
                borderRadius: '10px', padding: '14px', fontSize: '0.95rem',
                cursor: 'pointer', color: '#0e1a0e', fontFamily: 'inherit', fontWeight: 600 }}>
              ← Nazad na prijavu
            </button>
          )}
        </form>

        <p style={{ fontSize: '0.78rem', color: '#bbb', marginTop: '20px', lineHeight: 1.6, textAlign: 'center' }}>
          Nastavkom korišćenja prihvataš naše{' '}
          <Link href='/uslovi' style={{ color: '#2d6a2d' }}>Uslove</Link> i{' '}
          <Link href='/privatnost' style={{ color: '#2d6a2d' }}>Politiku privatnosti</Link>.
        </p>
      </div>
    </div>
  )
}