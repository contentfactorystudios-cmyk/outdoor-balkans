'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  const [open, setOpen]   = useState(false)
  const [query, setQuery] = useState('')
  const inputRef          = useRef<HTMLInputElement>(null)
  const router            = useRouter()

  function handleOpen() {
    setOpen(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim().length < 2) return
    router.push(`/pretraga?q=${encodeURIComponent(query.trim())}`)
    setOpen(false)
    setQuery('')
  }

  return (
    <div className="relative">
      {!open ? (
        <button onClick={handleOpen} aria-label="Pretraži"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-green-200
                     hover:text-white hover:bg-green-800 transition-colors">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <span className="text-sm font-medium hidden lg:block">Pretraga</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Escape' && (setOpen(false), setQuery(''))}
            placeholder="Pretraži lokacije..."
            className="w-48 lg:w-64 bg-green-800 border border-green-600 text-white
                       placeholder-green-400 rounded-xl px-4 py-2 text-sm
                       focus:outline-none focus:border-green-300" />
          <button type="submit"
            className="bg-white text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors shrink-0">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
          <button type="button" onClick={() => { setOpen(false); setQuery('') }}
            className="text-green-400 hover:text-white transition-colors">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </form>
      )}
    </div>
  )
}
