'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProfilPage() {
  const [user, setUser]   = useState<any>(null)
  const [name, setName]   = useState('')
  const [msg,  setMsg]    = useState('')
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
    setMsg(error ? 'Greška pri čuvanju.' : 'Profil ažuriran!')
    setTimeout(() => setMsg(''), 3000)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (!user) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Učitavam...</div>

  const initial = (user.user_metadata?.full_name ?? user.email ?? '?').charAt(0).toUpperCase()

  return (
    <div style={{ minHeight: '100vh', background: '#f9f7f2', fontFamily: "'DM Sans',system-ui,sans-serif", paddingTop: '80px' }}>
      <div style={{ maxWidth: '580px', margin: '0 auto', padding: '40px 24px' }}>
        <Link href='/' style={{ color: '#8fa68f', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '32px' }}>← Nazad</Link>
        <div style={{ background: '#fff', borderRadius: '20px', padding: '36px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#2d6a2d',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.6rem', fontWeight: 700, flexShrink: 0 }}>{initial}</div>
            <div>
              <h1 style={{ fontFamily: "'Fraunces','Playfair Display',Georgia,serif", fontSize: '1.5rem', fontWeight: 900, color: '#0e1a0e', marginBottom: '4px' }}>Moj profil</h1>
              <p style={{ color: '#8fa68f', fontSize: '0.85rem' }}>{user.email}</p>
            </div>
          </div>
          <form onSubmit={handleSave}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#555', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ime i prezime</label>
            <input type='text' value={name} onChange={e => setName(e.target.value)}
              placeholder='Tvoje ime' style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '10px',
              padding: '13px 16px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
              fontFamily: 'inherit', marginBottom: '16px' }} />
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#555', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email</label>
            <input type='email' value={user.email} readOnly
              style={{ width: '100%', border: '1.5px solid #eee', borderRadius: '10px',
              padding: '13px 16px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
              fontFamily: 'inherit', marginBottom: '24px', background: '#f9f7f2', color: '#8fa68f' }} />
            {msg && <div style={{ padding: '12px', borderRadius: '8px', marginBottom: '16px',
              background: msg.includes('Greška') ? '#fef2f2' : '#f0fdf4',
              color: msg.includes('Greška') ? '#dc2626' : '#16a34a', fontSize: '0.88rem' }}>{msg}</div>}
            <button type='submit' disabled={saving} style={{ width: '100%', background: '#2d3b2d',
              color: '#fff', border: 'none', borderRadius: '10px', padding: '14px',
              fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              {saving ? 'Čuvam...' : 'Sačuvaj promene'}
            </button>
          </form>
          <div style={{ borderTop: '1px solid #f0ede6', marginTop: '24px', paddingTop: '20px' }}>
            <Link href='/moje-lokacije' style={{ display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 0', textDecoration: 'none', color: '#0e1a0e', fontWeight: 600, fontSize: '0.9rem' }}>
              📍 Moje lokacije
              <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5'><path d='M9 18l6-6-6-6'/></svg>
            </Link>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px',
              background: 'none', border: 'none', cursor: 'pointer', padding: '12px 0',
              color: '#dc2626', fontWeight: 600, fontSize: '0.9rem', fontFamily: 'inherit' }}>
              🚪 Odjavi se
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}