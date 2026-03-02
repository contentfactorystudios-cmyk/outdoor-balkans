'use client'
import { useState, useEffect, useCallback, useRef } from 'react'

interface CatData { photo: string; hero: string; color: string }

const SLIDES = [
  { slug: 'ribolov',      label: '🎣 Ribolov',      sub: 'Reke i jezera Balkana',
    hero: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&h=1080&fit=crop&q=85' },
  { slug: 'lov',          label: '🦌 Lov',          sub: 'Lovišta i divljač',
    hero: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=1920&h=1080&fit=crop&q=85' },
  { slug: 'kajak',        label: '🚣 Kajak',        sub: 'Kanjoni i reke',
    hero: 'https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?w=1920&h=1080&fit=crop&q=85' },
  { slug: 'kampovanje',   label: '⛺ Kampovanje',   sub: 'Kampovi u prirodi',
    hero: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920&h=1080&fit=crop&q=85' },
  { slug: 'planinarenje', label: '🥾 Planinarenje', sub: 'Planine i staze',
    hero: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&h=1080&fit=crop&q=85' },
  { slug: 'rezervati',    label: '🦋 Rezervati',    sub: 'Zaštićena priroda',
    hero: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&q=85' },
]

export default function HeroSlider({ catData }: { catData?: Record<string, CatData> }) {
  const [current, setCurrent] = useState(0)
  const [next,    setNext]    = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval>>()

  // Preloads sve slike odmah
  useEffect(() => {
    SLIDES.forEach(s => {
      const img = new Image()
      img.src = catData?.[s.slug]?.hero ?? s.hero
    })
  }, [catData])

  const goTo = useCallback((idx: number) => {
    setNext(idx)
    setTimeout(() => {
      setCurrent(idx)
      setNext(null)
    }, 600)
  }, [])

  const goNext = useCallback(() => {
    setCurrent(c => {
      const n = (c + 1) % SLIDES.length
      setNext(n)
      setTimeout(() => { setCurrent(n); setNext(null) }, 600)
      return c
    })
  }, [])

  const goPrev = useCallback(() => {
    setCurrent(c => {
      const n = (c - 1 + SLIDES.length) % SLIDES.length
      setNext(n)
      setTimeout(() => { setCurrent(n); setNext(null) }, 600)
      return c
    })
  }, [])

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent(c => {
        const n = (c + 1) % SLIDES.length
        setNext(n)
        setTimeout(() => { setCurrent(n); setNext(null) }, 600)
        return c
      })
    }, 6000)
    return () => clearInterval(timerRef.current)
  }, [])

  const slide     = SLIDES[current]
  const nextSlide = next !== null ? SLIDES[next] : null
  const imgUrl     = catData?.[slide.slug]?.hero ?? slide.hero
  const nextImgUrl = nextSlide ? (catData?.[nextSlide.slug]?.hero ?? nextSlide.hero) : null

  const overlay = 'linear-gradient(to bottom,rgba(0,0,0,0.12) 0%,rgba(0,0,0,0.04) 35%,rgba(0,0,0,0.58) 100%)'

  const arrow: React.CSSProperties = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    zIndex: 20, background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '50%', width: '48px', height: '48px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: '#fff', fontSize: '1.4rem',
    transition: 'background 0.2s',
  }

  return (
    <>
      {/* Trenutna slika — uvijek vidljiva */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <img src={imgUrl} alt={slide.label}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }} />
        <div style={{ position: 'absolute', inset: 0, background: overlay }} />
      </div>

      {/* Sljedeća slika — crossfade preko trenutne */}
      {nextImgUrl && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          opacity: next !== null ? 1 : 0,
          transition: 'opacity 0.6s ease-in-out',
        }}>
          <img src={nextImgUrl} alt={nextSlide?.label ?? ''}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }} />
          <div style={{ position: 'absolute', inset: 0, background: overlay }} />
        </div>
      )}

      {/* Label */}
      <div style={{ position: 'absolute', top: '80px', left: '32px', zIndex: 20 }}>
        <span style={{ background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(8px)', color: '#fff',
          fontSize: '0.8rem', fontWeight: 600, padding: '5px 14px', borderRadius: '999px' }}>
          {slide.label} · {slide.sub}
        </span>
      </div>

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: '92px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: '8px', zIndex: 20 }}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} style={{
            width: i === current ? '28px' : '8px', height: '8px',
            borderRadius: '999px', border: 'none', cursor: 'pointer', padding: 0,
            background: i === current ? '#fff' : 'rgba(255,255,255,0.45)',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>

      {/* Arrows */}
      <button onClick={goPrev} style={{ ...arrow, left: '28px' }}>‹</button>
      <button onClick={goNext} style={{ ...arrow, right: '88px' }}>›</button>
    </>
  )
}
