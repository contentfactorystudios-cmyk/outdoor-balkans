'use client'
import React from 'react'

interface Social { name: string; href: string; color: string; path: string }

const SOCIALS: Social[] = [
  { name: 'Facebook',  color: '#1877f2', href: 'https://facebook.com/outdoorbalkans',  path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
  { name: 'Instagram', color: '#e1306c', href: 'https://instagram.com/outdoorbalkans', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
  { name: 'YouTube',   color: '#ff0000', href: 'https://youtube.com/@outdoorbalkans',  path: 'M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z' },
  { name: 'TikTok',    color: '#222222', href: 'https://tiktok.com/@outdoorbalkans',   path: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.17 8.17 0 0 0 4.78 1.52V6.78a4.86 4.86 0 0 1-1.01-.09z' },
]

const wrapStyle: React.CSSProperties = {
  position: 'fixed', right: '16px', top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 40,
}

const btnStyle: React.CSSProperties = {
  width: '52px', height: '52px', borderRadius: '14px',
  background: '#ffffff',
  boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  textDecoration: 'none',
  border: '1px solid rgba(0,0,0,0.06)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
}

export default function SocialSidebar() {
  return React.createElement(
    'div',
    { className: 'social-sidebar', style: wrapStyle },
    ...SOCIALS.map(function(s) {
      return React.createElement(
        'a',
        {
          key: s.name,
          href: s.href,
          target: '_blank',
          rel: 'noopener noreferrer',
          title: s.name,
          className: 'social-btn',
          style: { ...btnStyle, color: s.color },
        },
        React.createElement(
          'svg',
          { viewBox: '0 0 24 24', width: 22, height: 22, fill: 'currentColor' },
          React.createElement('path', { d: s.path })
        )
      )
    })
  )
}
