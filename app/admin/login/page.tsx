'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Pogrešan email ili lozinka.')
      setLoading(false)
      return
    }
    router.push('/admin')
    router.refresh()
  }

  const inp: React.CSSProperties = {
    width: '100%', border: '2px solid #e8e2d4', borderRadius: '12px',
    padding: '12px 16px', fontSize: '0.95rem', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit', background: '#fafaf8',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#0e1a0e 0%,#1e3d1e 50%,#0e1a0e 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div style={{
        background: '#fff', borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        padding: '48px 40px', width: '100%', maxWidth: '400px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🏔️</div>
          <h1 style={{
            fontFamily: "'Fraunces','Playfair Display',Georgia,serif",
            fontSize: '1.6rem', fontWeight: 900, color: '#0e1a0e', marginBottom: '6px',
          }}>Admin Prijava</h1>
          <p style={{ color: '#8fa68f', fontSize: '0.85rem' }}>OutdoorBalkans upravljanje</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#555', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Email
            </label>
            <input type='email' value={email} onChange={e => setEmail(e.target.value)}
              required style={inp} placeholder='admin@email.com' />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#555', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Lozinka
            </label>
            <input type='password' value={password} onChange={e => setPassword(e.target.value)}
              required style={inp} placeholder='••••••••' />
          </div>
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px', color: '#dc2626', fontSize: '0.875rem', marginBottom: '16px' }}>
              {error}
            </div>
          )}
          <button type='submit' disabled={loading} style={{
            width: '100%', background: 'linear-gradient(135deg,#1e3d1e,#2d6a2d)',
            color: '#fff', border: 'none', borderRadius: '14px',
            padding: '14px', fontSize: '1rem', fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Prijavljivanje...' : 'Prijavi se'}
          </button>
        </form>
      </div>
    </div>
  )
}