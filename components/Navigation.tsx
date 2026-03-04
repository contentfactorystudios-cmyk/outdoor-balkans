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
]
const EXPLORE = [
  { href: '/srbija/ribolov',      icon: '🎣', label: 'Ribolov',      sub: 'Reke i jezera' },
  { href: '/srbija/lov',          icon: '🦌', label: 'Lov',          sub: 'Lovišta i divljač' },
  { href: '/srbija/kajak',        icon: '🚣', label: 'Kajak',        sub: 'Kanjoni i reke' },
  { href: '/srbija/kampovanje',   icon: '⛺', label: 'Kampovanje',   sub: 'Kampovi u prirodi' },
  { href: '/srbija/planinarenje', icon: '🥾', label: 'Planinarenje', sub: 'Planine i staze' },
  { href: '/srbija/nacionalni-parkovi',    icon: '🦋', label: 'Nacionalni parkovi',    sub: 'Nacionalni parkovi' },
  { href: '/products',            icon: '🎒', label: 'Oprema',       sub: 'Outdoor shop' },
]

function useDropdown() {
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>()
  const enter = useCallback(() => { clearTimeout(timer.current); setOpen(true) }, [])
  const leave = useCallback(() => { timer.current = setTimeout(() => setOpen(false), 220) }, [])
  return { open, enter, leave, setOpen }
}

export default function Navigation() {
  const [scrolled,  setScrolled]  = useState(false)
  const [user,      setUser]      = useState<any>(null)
  const [lang,      setLang]      = useState('SR')
  const [mobOpen,   setMobOpen]   = useState(false)
  const explore  = useDropdown()
  const langDrop = useDropdown()
  const userDrop = useDropdown()
  const addDrop  = useDropdown()
  const router   = useRouter()
  const pathname = usePathname()
  const isHome   = pathname === '/'
  const hasHero  = ['/', '/kalendar-aktivnosti', '/dodaj', '/dodaj-dogadjaj',
                    '/predlozi-lokaciju', '/pretraga'].includes(pathname) ||
                   pathname.startsWith('/srbija/') || pathname.match(/\/[a-z-]+\/[a-z-]+\/[a-z-]+/) !== null

  useEffect(() => { try { setLang(localStorage.getItem('ob_lang') ?? 'SR') } catch {} }, [])
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
  useEffect(() => { setMobOpen(false) }, [pathname])

  function pickLang(label: string) {
    setLang(label)
    try { localStorage.setItem('ob_lang', label) } catch {}
    langDrop.setOpen(false)
    setMobOpen(false)
    window.location.reload()
  }
  async function handleLogout() {
    await supabase.auth.signOut(); setUser(null)
    userDrop.setOpen(false); setMobOpen(false)
    router.push('/'); router.refresh()
  }

  const isAdmin     = user && ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? '')
  const userName    = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? ''
  const userInitial = userName.charAt(0).toUpperCase()
  const transparent = hasHero && !scrolled && !mobOpen
  const textCol     = transparent ? '#fff' : '#0e1a0e'
  const DD: React.CSSProperties = {
    position: 'absolute', top: 'calc(100% + 6px)', right: 0,
    background: '#fff', borderRadius: '16px', padding: '8px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
    border: '1px solid rgba(0,0,0,0.07)', zIndex: 200, minWidth: '200px',
  }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: '64px', display: 'flex', alignItems: 'center', padding: '0 20px',
        background: transparent ? 'transparent' : 'rgba(255,255,255,0.97)',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
        transition: 'background 0.3s, box-shadow 0.3s',
      }}>
        <Link href='/' style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }}>
          <Logo size={32} />
          <span style={{ fontFamily: "'Fraunces','Playfair Display',Georgia,serif",
            fontSize: '1rem', fontWeight: 900, color: textCol, transition: 'color 0.3s' }}>
            OutdoorBalkans
          </span>
        </Link>
        <div style={{ flex: 1 }} />

        {/* DESKTOP */}
        <div className='desk-nav' style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <div style={{ position: 'relative' }} onMouseEnter={explore.enter} onMouseLeave={explore.leave}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: textCol,
              fontSize: '0.9rem', fontWeight: 600, fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', transition: 'color 0.3s' }}>
              Istraži <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5'><path d='M6 9l6 6 6-6'/></svg>
            </button>
            {explore.open && (
              <div style={{ ...DD, minWidth: '240px' }} onMouseEnter={explore.enter} onMouseLeave={explore.leave}>
                {EXPLORE.map(item => (
                  <Link key={item.href} href={item.href}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '10px 12px', borderRadius: '10px', textDecoration: 'none' }}
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

          <Link href='/kalendar-aktivnosti' style={{ color: textCol, fontSize: '0.9rem', fontWeight: 600,
            textDecoration: 'none', padding: '8px 12px', whiteSpace: 'nowrap' }}>Kalendar</Link>
          <div style={{ position: 'relative' }} onMouseEnter={addDrop.enter} onMouseLeave={addDrop.leave}>
            <button style={{ background: transparent ? 'rgba(255,255,255,0.18)' : '#2d6a2d',
              color: '#fff', border: transparent ? '1px solid rgba(255,255,255,0.35)' : 'none',
              backdropFilter: transparent ? 'blur(8px)' : 'none',
              padding: '8px 16px', borderRadius: '999px', fontWeight: 700,
              fontSize: '0.85rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              fontFamily: "'DM Sans',system-ui,sans-serif", whiteSpace: 'nowrap',
              transition: 'background 0.3s' }}>
              + Dodaj
              <svg width='11' height='11' viewBox='0 0 24 24' fill='none'
                stroke='currentColor' strokeWidth='2.5'><path d='M6 9l6 6 6-6'/></svg>
            </button>
            {addDrop.open && (
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                background: '#fff', borderRadius: '16px', padding: '8px',
                boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
                border: '1px solid rgba(0,0,0,0.07)', zIndex: 200, minWidth: '230px' }}
                onMouseEnter={addDrop.enter} onMouseLeave={addDrop.leave}>
                <a href='/predlozi-lokaciju'
                  style={{ display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '11px 14px', borderRadius: '12px', textDecoration: 'none',
                    color: '#0e1a0e', marginBottom: '2px', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f9f7f2')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <span style={{ fontSize: '1.6rem' }}>📍</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.88rem', color: '#0e1a0e' }}>
                      Predloži lokaciju
                    </p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#8fa68f' }}>
                      Ribolov, lov, planinarenje...
                    </p>
                  </div>
                </a>
                <a href='/dodaj-dogadjaj'
                  style={{ display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '11px 14px', borderRadius: '12px', textDecoration: 'none',
                    color: '#0e1a0e', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f9f7f2')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <span style={{ fontSize: '1.6rem' }}>📅</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.88rem', color: '#0e1a0e' }}>
                      Prijavi događaj
                    </p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#8fa68f' }}>
                      Takmičenje, festival, izlazak
                    </p>
                  </div>
                </a>
                <div style={{ borderTop: '1px solid #f0ede6', margin: '6px 0' }} />
                <a href='/dodaj'
                  style={{ display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '9px 14px', borderRadius: '12px', textDecoration: 'none',
                    color: '#8fa68f', fontSize: '0.8rem', fontWeight: 600 }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f9f7f2')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  Sve opcije →
                </a>
              </div>
            )}
          </div>

          <div style={{ position: 'relative' }} onMouseEnter={langDrop.enter} onMouseLeave={langDrop.leave}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: textCol,
              fontSize: '0.85rem', fontWeight: 600, fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 10px', whiteSpace: 'nowrap' }}>
              🌐 {lang} <svg width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5'><path d='M6 9l6 6 6-6'/></svg>
            </button>
            {langDrop.open && (
              <div style={{ ...DD, minWidth: '160px', padding: '6px' }} onMouseEnter={langDrop.enter} onMouseLeave={langDrop.leave}>
                {LANGS.map(l => (
                  <button key={l.code} onClick={() => l.active && pickLang(l.label)}
                    title={!l.active ? 'Prevod u toku...' : undefined}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                      padding: '9px 12px', borderRadius: '8px', border: 'none',
                      background: lang === l.label ? '#f4f0e6' : 'transparent',
                      cursor: l.active ? 'pointer' : 'not-allowed',
                      fontSize: '0.88rem', fontWeight: lang === l.label ? 700 : 500,
                      color: l.active ? '#0e1a0e' : '#ccc', fontFamily: 'inherit', textAlign: 'left' }}>
                    <span style={{ opacity: l.active ? 1 : 0.4 }}>{l.flag}</span> {l.label}
                    {!l.active && <span style={{ fontSize: '0.65rem', color: '#ccc', marginLeft: 'auto', fontStyle: 'italic' }}>uskoro</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <div style={{ position: 'relative' }} onMouseEnter={userDrop.enter} onMouseLeave={userDrop.leave}>
              <button style={{ display: 'flex', alignItems: 'center', gap: '7px',
                background: transparent ? 'rgba(255,255,255,0.15)' : '#f4f0e6',
                border: 'none', borderRadius: '999px', padding: '5px 14px 5px 5px',
                cursor: 'pointer', color: textCol, fontFamily: 'inherit',
                fontWeight: 600, fontSize: '0.87rem', marginLeft: '6px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#2d6a2d',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.82rem', fontWeight: 700 }}>{userInitial}</div>
                <span style={{ maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</span>
              </button>
              {userDrop.open && (
                <div style={{ ...DD, minWidth: '210px' }} onMouseEnter={userDrop.enter} onMouseLeave={userDrop.leave}>
                  <div style={{ padding: '8px 14px 10px', borderBottom: '1px solid #f0ede6', marginBottom: '4px' }}>
                    <p style={{ fontSize: '0.72rem', color: '#8fa68f', marginBottom: '2px' }}>Prijavljen kao</p>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0e1a0e',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
                  </div>
                  {isAdmin && <Link href='/admin' onClick={() => userDrop.setOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px',
                      borderRadius: '8px', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, color: '#2d6a2d' }}>🔧 Admin panel</Link>}
                  <Link href='/profil' onClick={() => userDrop.setOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px',
                      borderRadius: '8px', textDecoration: 'none', fontSize: '0.88rem', color: '#0e1a0e' }}>👤 Moj profil</Link>
                  <Link href='/moje-lokacije' onClick={() => userDrop.setOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px',
                      borderRadius: '8px', textDecoration: 'none', fontSize: '0.88rem', color: '#0e1a0e' }}>📍 Moje lokacije</Link>
                  <div style={{ borderTop: '1px solid #f0ede6', margin: '4px 0' }} />
                  <button onClick={handleLogout}
                    style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '10px 14px', borderRadius: '8px', border: 'none', background: 'none',
                      cursor: 'pointer', fontSize: '0.88rem', color: '#dc2626', fontFamily: 'inherit', fontWeight: 600 }}>
                    🚪 Odjava
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href='/login' style={{ background: transparent ? '#fff' : '#0e1a0e',
              color: transparent ? '#0e1a0e' : '#fff', padding: '9px 22px',
              borderRadius: '999px', textDecoration: 'none', fontSize: '0.9rem',
              fontWeight: 700, whiteSpace: 'nowrap', marginLeft: '6px' }}>Log in</Link>
          )}
        </div>

        {/* HAMBURGER — mob */}
        <button className='mob-ham' onClick={() => setMobOpen(o => !o)}
          style={{ background: 'none', border: 'none', cursor: 'pointer',
            color: textCol, padding: '8px', display: 'none',
            flexDirection: 'column', gap: '5px', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ display: 'block', width: '22px', height: '2px', background: 'currentColor',
            borderRadius: '2px', transform: mobOpen ? 'rotate(45deg) translate(5px,5px)' : 'none', transition: 'transform 0.25s' }} />
          <span style={{ display: 'block', width: '22px', height: '2px', background: 'currentColor',
            borderRadius: '2px', opacity: mobOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
          <span style={{ display: 'block', width: '22px', height: '2px', background: 'currentColor',
            borderRadius: '2px', transform: mobOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none', transition: 'transform 0.25s' }} />
        </button>
      </nav>

      {/* MOB DRAWER */}
      <div className='mob-drawer' style={{
        position: 'fixed', top: '64px', left: 0, right: 0, bottom: 0,
        background: '#fff', zIndex: 99, overflowY: 'auto',
        transform: mobOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease', display: 'none',
      }}>
        <div style={{ padding: '8px 16px 40px' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8fa68f',
            textTransform: 'uppercase', letterSpacing: '0.12em', padding: '16px 12px 8px' }}>Istraži</p>
          {EXPLORE.map(item => (
            <Link key={item.href} href={item.href}
              style={{ display: 'flex', alignItems: 'center', gap: '14px',
                padding: '13px 12px', borderRadius: '12px', textDecoration: 'none', marginBottom: '2px' }}>
              <span style={{ fontSize: '1.3rem', width: '32px', textAlign: 'center' }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0e1a0e' }}>{item.label}</div>
                <div style={{ fontSize: '0.78rem', color: '#8fa68f' }}>{item.sub}</div>
              </div>
            </Link>
          ))}
          <div style={{ borderTop: '1px solid #f0ede6', margin: '12px 0' }} />
          <Link href='/kalendar-aktivnosti' style={{ display: 'block', padding: '13px 12px', borderRadius: '12px',
            textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600, color: '#0e1a0e' }}>📅 Kalendar</Link>
          <a href='/dodaj-dogadjaj' style={{ display:'block', padding:'14px 16px',
                borderRadius:'12px', color:'#0e1a0e', fontWeight:700,
                textDecoration:'none', fontSize:'0.95rem', marginBottom:'4px',
                background:'transparent' }}>
                📅 Dodaj događaj
              </a>
              <Link href='/predlozi-lokaciju' style={{ display: 'block', padding: '13px 12px', borderRadius: '12px',
            textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600, color: '#0e1a0e' }}>📍 + Dodaj lokaciju</Link>
          <div style={{ borderTop: '1px solid #f0ede6', margin: '12px 0' }} />
          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8fa68f',
            textTransform: 'uppercase', letterSpacing: '0.12em', padding: '4px 12px 10px' }}>Jezik</p>
          <div style={{ display: 'flex', gap: '8px', padding: '0 12px', flexWrap: 'wrap' }}>
            {LANGS.map(l => (
              <button key={l.code} onClick={() => l.active && pickLang(l.label)}
                style={{ padding: '8px 16px', borderRadius: '999px', border: '1.5px solid',
                  borderColor: lang === l.label ? '#2d6a2d' : '#e8e2d4',
                  background: lang === l.label ? '#2d6a2d' : 'transparent',
                  color: lang === l.label ? '#fff' : (l.active ? '#0e1a0e' : '#ccc'),
                  fontSize: '0.85rem', fontWeight: 600,
                  cursor: l.active ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>
                {l.flag} {l.label}
              </button>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #f0ede6', margin: '16px 0' }} />
          {user ? (
            <div style={{ padding: '0 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#2d6a2d',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem' }}>
                  {userInitial}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0e1a0e' }}>{userName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#8fa68f' }}>{user.email}</div>
                </div>
              </div>
              {isAdmin && <Link href='/admin' style={{ display: 'block', padding: '12px 0', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600, color: '#2d6a2d' }}>🔧 Admin panel</Link>}
              <Link href='/profil' style={{ display: 'block', padding: '12px 0', textDecoration: 'none', fontSize: '0.95rem', color: '#0e1a0e' }}>👤 Moj profil</Link>
              <Link href='/moje-lokacije' style={{ display: 'block', padding: '12px 0', textDecoration: 'none', fontSize: '0.95rem', color: '#0e1a0e' }}>📍 Moje lokacije</Link>
              <button onClick={handleLogout}
                style={{ width: '100%', textAlign: 'left', padding: '12px 0', border: 'none', background: 'none',
                  cursor: 'pointer', fontSize: '0.95rem', color: '#dc2626', fontFamily: 'inherit', fontWeight: 600 }}>🚪 Odjava</button>
            </div>
          ) : (
            <div style={{ padding: '0 12px' }}>
              <Link href='/login' style={{ display: 'block', textAlign: 'center', background: '#0e1a0e',
                color: '#fff', padding: '15px', borderRadius: '12px', textDecoration: 'none',
                fontWeight: 700, fontSize: '0.95rem' }}>Prijavi se / Registruj se</Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
