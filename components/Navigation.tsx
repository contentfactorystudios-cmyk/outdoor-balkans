'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Logo from '@/components/Logo'

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '').split(',').map(e => e.trim().toLowerCase())

const LANGS = [
  { code: 'sr', label: 'SR', flag: '🇷🇸', active: true },
  { code: 'en', label: 'EN', flag: '🇬🇧', active: true },
  { code: 'de', label: 'DE', flag: '🇩🇪', active: false },
  { code: 'ru', label: 'RU', flag: '🇷🇺', active: false },
  { code: 'zh', label: 'ZH', flag: '🇨🇳', active: false },
]

const EXPLORE = [
  { href: '/srbija/ribolov',      icon: '🎣', label: 'Ribolov',      sub: 'Reke i jezera' },
  { href: '/srbija/lov',          icon: '🦌', label: 'Lov',          sub: 'Lovišta i divljač' },
  { href: '/srbija/kajak',        icon: '🚣', label: 'Kajak',        sub: 'Kanjoni i reke' },
  { href: '/srbija/kampovanje',   icon: '⛺', label: 'Kampovanje',   sub: 'Kampovi u prirodi' },
  { href: '/srbija/planinarenje', icon: '🥾', label: 'Planinarenje', sub: 'Planine i staze' },
  { href: '/srbija/rezervati',    icon: '🦋', label: 'Rezervati',    sub: 'Zaštićena priroda' },
  { href: '/products',            icon: '🎒', label: 'Oprema',       sub: 'Outdoor shop' },
]

function useDropdown() {
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>()
  const enter = useCallback(() => { clearTimeout(timer.current); setOpen(true) }, [])
  const leave = useCallback(() => { timer.current = setTimeout(() => setOpen(false), 200) }, [])
  return { open, enter, leave, setOpen }
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [user,     setUser]     = useState<any>(null)
  const [lang,     setLang]     = useState('SR')
  const explore  = useDropdown()
  const langDrop = useDropdown()
  const userDrop = useDropdown()
  const router   = useRouter()
  const pathname = usePathname()
  const isHome   = pathname === '/'

  // Učitaj lang iz localStorage
  useEffect(() => {
    try { setLang(localStorage.getItem('ob_lang') ?? 'SR') } catch {}
  }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setUser(s?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])

  function pickLang(label: string) {
    if (lang === label) return
    setLang(label)
    try { localStorage.setItem('ob_lang', label) } catch {}
    langDrop.setOpen(false)
    // Reload stranice da bi se primijenio jezik
    window.location.reload()
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    userDrop.setOpen(false)
    router.push('/'); router.refresh()
  }

  const isAdmin    = user && ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? '')
  const userName   = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? ''
  const userInitial = userName.charAt(0).toUpperCase()
  const transparent = isHome && !scrolled
  const textCol     = transparent ? '#fff' : '#0e1a0e'

  const DD: React.CSSProperties = {
    position: 'absolute', top: 'calc(100% + 4px)',
    background: '#fff', borderRadius: '16px', padding: '10px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
    border: '1px solid rgba(0,0,0,0.07)', zIndex: 200,
    minWidth: '200px',
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: '64px', display: 'flex', alignItems: 'center', padding: '0 24px',
      background: transparent ? 'transparent' : 'rgba(255,255,255,0.97)',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
      transition: 'background 0.3s, box-shadow 0.3s',
    }}>

      {/* ── LOGO ── */}
      <Link href='/' style={{ display: 'flex', alignItems: 'center', gap: '10px',
        textDecoration: 'none', flexShrink: 0 }}>
        <Logo size={34} />
        <span style={{ fontFamily: "'Fraunces','Playfair Display',Georgia,serif",
          fontSize: '1.1rem', fontWeight: 900, color: textCol,
          transition: 'color 0.3s', letterSpacing: '-0.01em' }}>OutdoorBalkans</span>
      </Link>

      <div style={{ flex: 1 }} />

      {/* ── DESNA STRANA ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>

        {/* Explore */}
        <div style={{ position: 'relative' }}
          onMouseEnter={explore.enter} onMouseLeave={explore.leave}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer',
            color: textCol, fontSize: '0.9rem', fontWeight: 600, fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '8px 12px', transition: 'color 0.3s' }}>
            Istraži
            <svg width='13' height='13' viewBox='0 0 24 24' fill='none'
              stroke='currentColor' strokeWidth='2.5'><path d='M6 9l6 6 6-6'/></svg>
          </button>
          {explore.open && (
            <div style={{ ...DD, right: 0, left: 'auto', minWidth: '240px' }}
              onMouseEnter={explore.enter} onMouseLeave={explore.leave}>
              {EXPLORE.map(item => (
                <Link key={item.href} href={item.href}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 12px', borderRadius: '10px', textDecoration: 'none',
                    transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#f4f0e6'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                  <span style={{ fontSize: '1.1rem', width: '24px', textAlign: 'center' }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0e1a0e' }}>{item.label}</div>
                    <div style={{ fontSize: '0.75rem', color: '#8fa68f' }}>{item.sub}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Vesti */}
        <Link href='/vijesti' style={{ color: textCol, fontSize: '0.9rem', fontWeight: 600,
          textDecoration: 'none', padding: '8px 12px', transition: 'color 0.3s', whiteSpace: 'nowrap' }}>
          Vesti
        </Link>

        {/* + Dodaj */}
        <Link href='/predlozi-lokaciju' style={{ color: textCol, fontSize: '0.9rem', fontWeight: 600,
          textDecoration: 'none', padding: '8px 12px', transition: 'color 0.3s', whiteSpace: 'nowrap' }}>
          + Dodaj
        </Link>

        {/* ── JEZIK ── */}
        <div style={{ position: 'relative' }}
          onMouseEnter={langDrop.enter} onMouseLeave={langDrop.leave}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer',
            color: textCol, fontSize: '0.85rem', fontWeight: 600, fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '8px 10px', transition: 'color 0.3s', whiteSpace: 'nowrap' }}>
            🌐 {lang}
            <svg width='11' height='11' viewBox='0 0 24 24' fill='none'
              stroke='currentColor' strokeWidth='2.5'><path d='M6 9l6 6 6-6'/></svg>
          </button>
          {langDrop.open && (
            <div style={{ ...DD, right: 0, left: 'auto', minWidth: '160px', padding: '6px' }}
              onMouseEnter={langDrop.enter} onMouseLeave={langDrop.leave}>
              {LANGS.map(l => (
                <button key={l.code}
                  onClick={() => l.active && pickLang(l.label)}
                  title={!l.active ? 'Prevod u toku...' : undefined}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    width: '100%', padding: '9px 12px', borderRadius: '8px',
                    border: 'none',
                    background: lang === l.label ? '#f4f0e6' : 'transparent',
                    cursor: l.active ? 'pointer' : 'not-allowed',
                    fontSize: '0.88rem',
                    fontWeight: lang === l.label ? 700 : 500,
                    color: l.active ? '#0e1a0e' : '#bbb',
                    fontFamily: 'inherit', textAlign: 'left',
                  }}>
                  <span style={{ opacity: l.active ? 1 : 0.35 }}>{l.flag}</span>
                  {l.label}
                  {!l.active && (
                    <span style={{ fontSize: '0.65rem', color: '#ccc',
                      marginLeft: 'auto', fontStyle: 'italic', whiteSpace: 'nowrap' }}>
                      prevod u toku
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── USER ── */}
        {user ? (
          <div style={{ position: 'relative' }}
            onMouseEnter={userDrop.enter} onMouseLeave={userDrop.leave}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '7px',
              background: transparent ? 'rgba(255,255,255,0.15)' : '#f4f0e6',
              border: 'none', borderRadius: '999px',
              padding: '5px 14px 5px 5px',
              cursor: 'pointer', color: textCol,
              fontFamily: 'inherit', fontWeight: 600, fontSize: '0.87rem',
              transition: 'background 0.2s', marginLeft: '6px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%',
                background: '#2d6a2d', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.82rem', fontWeight: 700, flexShrink: 0 }}>
                {userInitial}
              </div>
              <span style={{ maxWidth: '90px', overflow: 'hidden',
                textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</span>
            </button>
            {userDrop.open && (
              <div style={{ ...DD, right: 0, left: 'auto', minWidth: '210px' }}
                onMouseEnter={userDrop.enter} onMouseLeave={userDrop.leave}>
                <div style={{ padding: '8px 14px 10px', borderBottom: '1px solid #f0ede6', marginBottom: '4px' }}>
                  <p style={{ fontSize: '0.72rem', color: '#8fa68f', marginBottom: '2px' }}>Prijavljen kao</p>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0e1a0e',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.email}
                  </p>
                </div>
                {isAdmin && (
                  <Link href='/admin' onClick={() => userDrop.setOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px',
                      borderRadius: '8px', textDecoration: 'none',
                      fontSize: '0.88rem', fontWeight: 600, color: '#2d6a2d' }}>
                    🔧 Admin panel
                  </Link>
                )}
                <Link href='/profil' onClick={() => userDrop.setOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px',
                    borderRadius: '8px', textDecoration: 'none',
                    fontSize: '0.88rem', color: '#0e1a0e' }}>
                  👤 Moj profil
                </Link>
                <Link href='/moje-lokacije' onClick={() => userDrop.setOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px',
                    borderRadius: '8px', textDecoration: 'none',
                    fontSize: '0.88rem', color: '#0e1a0e' }}>
                  📍 Moje lokacije
                </Link>
                <div style={{ borderTop: '1px solid #f0ede6', margin: '4px 0' }} />
                <button onClick={handleLogout}
                  style={{ width: '100%', textAlign: 'left', display: 'flex',
                    alignItems: 'center', gap: '8px',
                    padding: '10px 14px', borderRadius: '8px',
                    border: 'none', background: 'none', cursor: 'pointer',
                    fontSize: '0.88rem', color: '#dc2626',
                    fontFamily: 'inherit', fontWeight: 600 }}>
                  🚪 Odjava
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href='/login' style={{
            background: transparent ? '#fff' : '#0e1a0e',
            color: transparent ? '#0e1a0e' : '#fff',
            padding: '9px 22px', borderRadius: '999px',
            textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700,
            whiteSpace: 'nowrap', transition: 'all 0.3s', marginLeft: '6px' }}>
            Log in
          </Link>
        )}
      </div>
    </nav>
  )
}