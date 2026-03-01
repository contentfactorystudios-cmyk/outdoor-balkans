'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/useAuth'
import Link from 'next/link'

const EMOJIS = [
  { emoji: '🎣', label: 'Odlično za ribolov' },
  { emoji: '🦌', label: 'Odlično za lov' },
  { emoji: '⭐', label: 'Preporučujem' },
  { emoji: '👍', label: 'Sviđa mi se' },
]

export default function ReactionsBar({ locationId }: { locationId: number }) {
  const { user } = useAuth()
  const [counts,        setCounts]        = useState<Record<string, number>>({})
  const [userReactions, setUserReactions] = useState<string[]>([])
  const [loading,       setLoading]       = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/reactions?location_id=${locationId}`)
      .then(r => r.json())
      .then(d => { setCounts(d.counts ?? {}); setUserReactions(d.userReactions ?? []) })
  }, [locationId])

  async function handleReact(emoji: string) {
    if (!user) return
    setLoading(emoji)
    const res  = await fetch('/api/reactions', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location_id: locationId, emoji }),
    })
    const data = await res.json()

    if (data.action === 'added') {
      setCounts(c => ({ ...c, [emoji]: (c[emoji] ?? 0) + 1 }))
      setUserReactions(r => [...r, emoji])
    } else {
      setCounts(c => ({ ...c, [emoji]: Math.max((c[emoji] ?? 1) - 1, 0) }))
      setUserReactions(r => r.filter(e => e !== emoji))
    }
    setLoading(null)
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <div className="border-t border-gray-100 pt-5 mt-2">
      <p className="text-sm font-semibold text-gray-600 mb-3">
        Reakcije {total > 0 && <span className="text-gray-400 font-normal">· {total} ukupno</span>}
      </p>

      <div className="flex flex-wrap gap-2">
        {EMOJIS.map(({ emoji, label }) => {
          const count   = counts[emoji] ?? 0
          const reacted = userReactions.includes(emoji)
          return (
            <button
              key={emoji}
              onClick={() => handleReact(emoji)}
              disabled={!user || loading === emoji}
              title={user ? label : 'Prijavi se da reagiješ'}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium
                          border-2 transition-all duration-150 select-none
                          ${reacted
                            ? 'border-green-400 bg-green-50 text-green-800 scale-105'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50'
                          }
                          ${!user ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
                          ${loading === emoji ? 'opacity-60' : ''}`}
            >
              <span className="text-lg leading-none">{emoji}</span>
              {count > 0 && <span className="text-xs font-bold">{count}</span>}
            </button>
          )
        })}
      </div>

      {!user && (
        <p className="text-xs text-gray-400 mt-2">
          <Link href="/admin/login" className="text-green-600 hover:text-green-800 font-medium">
            Prijavi se
          </Link>
          {' '}da dodaš reakciju
        </p>
      )}
    </div>
  )
}
