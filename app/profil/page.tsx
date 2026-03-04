'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const SERIF = "'Fraunces','Playfair Display',Georgia,serif"
const SANS  = "'DM Sans',system-ui,sans-serif"

export default function ProfilPage() {
  const [user,   setUser]   = useState<any>(null)
  const [name,   setName]   = useState('')
  const [msg,    setMsg]    = useState('')
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUser(data.user)
      setName(data.user.user_metadata?.full_name ?? '')
    })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    const { error } = await supabase.auth.updateUser({ data: { full_name: name } })
    setSaving(false)
    setMsg(error ? 'Greška pri čuvanju.' : '✅ Profil ažuriran!')
    setTimeout(() => setMsg(''), 3000)
  }

  async function handleLogout() {
    await supabase.auth.signOut(); router.push('/')
  }

  if (!user) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center',
      justifyContent:'center', fontFamily:SANS, background:'#f9f7f2' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:'2rem', marginBottom:'12px' }}>⏳</div>
        <p style={{ color:'#8fa68f' }}>Učitavam profil...</p>
      </div>
    </div>
  )

  const initial = (user.user_metadata?.full_name ?? user.email ?? '?').charAt(0).toUpperCase()

  const inputStyle: React.CSSProperties = {
    width:'100%', border:'1.5px solid #e8e2d4', borderRadius:'14px',
    padding:'13px 16px', fontSize:'0.95rem', fontFamily:SANS,
    outline:'none', background:'#fff', color:'#0e1a0e', boxSizing:'border-box',
  }

  return (
    <div style={{ fontFamily:SANS, minHeight:'100vh', background:'#f9f7f2', paddingTop:'64px' }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg, #2d6a2ddd 0%, #166534aa 100%)',
        padding:'48px 24px 40px', textAlign:'center' }}>
        <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center',
          width:'80px', height:'80px', background:'rgba(255,255,255,0.25)',
          borderRadius:'50%', fontSize:'2rem', fontWeight:900, color:'#fff',
          marginBottom:'16px', border:'3px solid rgba(255,255,255,0.4)',
          fontFamily:SERIF }}>
          {initial}
        </div>
        <h1 style={{ fontFamily:SERIF, fontSize:'1.6rem', fontWeight:900,
          color:'#fff', marginBottom:'6px' }}>
          {user.user_metadata?.full_name || 'Moj profil'}
        </h1>
        <p style={{ color:'rgba(255,255,255,0.8)', fontSize:'0.9rem' }}>{user.email}</p>
      </div>

      <div style={{ maxWidth:'560px', margin:'-24px auto 0', padding:'0 24px 80px', position:'relative', zIndex:1 }}>

        {/* Quick links */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'24px' }}>
          {[
            { href:'/moje-lokacije', icon:'📍', label:'Moje lokacije' },
            { href:'/sacuvano', icon:'❤️', label:'Sačuvano' },
            { href:'/predlozi-lokaciju', icon:'➕', label:'Dodaj lokaciju' },
            { href:'/dodaj-dogadjaj', icon:'📅', label:'Dodaj događaj' },
          ].map(item => (
            <Link key={item.href} href={item.href}
              style={{ background:'#fff', borderRadius:'16px', padding:'18px',
                textDecoration:'none', border:'1px solid #f0ede6',
                boxShadow:'0 2px 12px rgba(0,0,0,0.05)',
                display:'flex', flexDirection:'column', gap:'8px' }}>
              <span style={{ fontSize:'1.6rem' }}>{item.icon}</span>
              <span style={{ fontSize:'0.88rem', fontWeight:700, color:'#0e1a0e' }}>{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Edit form */}
        <div style={{ background:'#fff', borderRadius:'24px', padding:'32px',
          border:'1px solid #f0ede6', boxShadow:'0 4px 24px rgba(0,0,0,0.06)',
          marginBottom:'16px' }}>
          <h2 style={{ fontFamily:SERIF, fontSize:'1.1rem', fontWeight:700,
            color:'#0e1a0e', marginBottom:'24px' }}>✏️ Uredi profil</h2>
          <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <div>
              <label style={{ display:'block', fontSize:'0.82rem', fontWeight:700,
                color:'#3d4d3d', marginBottom:'7px' }}>Ime i prezime</label>
              <input type='text' value={name} onChange={e => setName(e.target.value)}
                placeholder='Tvoje ime' style={inputStyle} />
            </div>
            <div>
              <label style={{ display:'block', fontSize:'0.82rem', fontWeight:700,
                color:'#3d4d3d', marginBottom:'7px' }}>Email</label>
              <input type='email' value={user.email} readOnly
                style={{ ...inputStyle, background:'#f9f7f2', color:'#8fa68f', cursor:'not-allowed' }} />
            </div>
            {msg && (
              <div style={{ padding:'12px 16px', borderRadius:'12px',
                background: msg.includes('Greška') ? '#fef2f2' : '#f0fdf4',
                color: msg.includes('Greška') ? '#dc2626' : '#16a34a',
                fontSize:'0.88rem', fontWeight:600 }}>{msg}</div>
            )}
            <button type='submit' disabled={saving}
              style={{ background: saving ? '#ccc' : '#2d6a2d', color:'#fff', border:'none',
                borderRadius:'14px', padding:'14px', fontSize:'0.95rem', fontWeight:700,
                cursor: saving ? 'not-allowed' : 'pointer', fontFamily:SANS }}>
              {saving ? '⏳ Čuvam...' : 'Sačuvaj promene'}
            </button>
          </form>
        </div>

        {/* Logout */}
        <button onClick={handleLogout}
          style={{ width:'100%', background:'#fff', color:'#dc2626',
            border:'1px solid #fecaca', borderRadius:'16px', padding:'14px',
            fontSize:'0.9rem', fontWeight:700, cursor:'pointer', fontFamily:SANS }}>
          🚪 Odjavi se
        </button>
      </div>
    </div>
  )
}
