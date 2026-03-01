'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function MojeLokacijePage() {
  const [locs,    setLocs]    = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login'); return }
      const { data: locs } = await supabase
        .from('locations')
        .select('id,name,slug,is_published,categories(name,slug),regions(name)')
        .eq('created_by', data.user.id)
        .order('created_at', { ascending: false })
      setLocs(locs ?? [])
      setLoading(false)
    })
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#f9f7f2', fontFamily: "'DM Sans',system-ui,sans-serif", paddingTop: '80px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px' }}>
        <Link href='/profil' style={{ color: '#8fa68f', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '28px' }}>← Profil</Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h1 style={{ fontFamily: "'Fraunces','Playfair Display',Georgia,serif", fontSize: '1.8rem', fontWeight: 900, color: '#0e1a0e' }}>Moje lokacije</h1>
          <Link href='/predlozi-lokaciju' style={{ background: '#2d6a2d', color: '#fff', padding: '10px 20px', borderRadius: '999px', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 700 }}>+ Dodaj novu</Link>
        </div>
        {loading ? (
          <p style={{ color: '#8fa68f' }}>Učitavam...</p>
        ) : locs.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: '16px', padding: '48px 24px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📍</div>
            <h2 style={{ fontFamily: "'Fraunces','Playfair Display',Georgia,serif", fontSize: '1.3rem', fontWeight: 700, color: '#0e1a0e', marginBottom: '8px' }}>Još nemaš lokacija</h2>
            <p style={{ color: '#8fa68f', marginBottom: '24px' }}>Podeli svoje omiljeno mesto sa zajednicom.</p>
            <Link href='/predlozi-lokaciju' style={{ background: '#2d6a2d', color: '#fff', padding: '12px 28px', borderRadius: '999px', textDecoration: 'none', fontWeight: 700 }}>Predloži lokaciju</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {locs.map((loc: any) => (
              <div key={loc.id} style={{ background: '#fff', borderRadius: '14px', padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #f0ede6' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0e1a0e', marginBottom: '3px' }}>{loc.name}</p>
                  <p style={{ fontSize: '0.78rem', color: '#8fa68f' }}>{loc.categories?.name} · {loc.regions?.name ?? 'Srbija'}</p>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: '999px',
                  background: loc.is_published ? '#f0fdf4' : '#fff7ed',
                  color: loc.is_published ? '#16a34a' : '#ea580c' }}>
                  {loc.is_published ? '✓ Objavljeno' : '⏳ Na čekanju'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}