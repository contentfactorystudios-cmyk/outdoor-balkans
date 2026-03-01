'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/useAuth'
import Link from 'next/link'

interface Comment {
  id:         number
  body:       string
  user_name:  string
  user_email: string
  created_at: string
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)   return 'upravo'
  if (m < 60)  return `pre ${m} min`
  const h = Math.floor(m / 60)
  if (h < 24)  return `pre ${h}h`
  const d = Math.floor(h / 24)
  if (d < 30)  return `pre ${d} dana`
  return new Date(dateStr).toLocaleDateString('sr-Latn-RS')
}

export default function CommentsSection({ locationId }: { locationId: number }) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [body,     setBody]     = useState('')
  const [loading,  setLoading]  = useState(false)
  const [sending,  setSending]  = useState(false)
  const [error,    setError]    = useState('')

  useEffect(() => {
    setLoading(true)
    fetch(`/api/comments?location_id=${locationId}`)
      .then(r => r.json())
      .then(d => { setComments(d.comments ?? []); setLoading(false) })
  }, [locationId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim() || !user) return
    setSending(true); setError('')
    const res  = await fetch('/api/comments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location_id: locationId, body }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error ?? 'Greška'); setSending(false); return }
    setComments(c => [data.comment, ...c])
    setBody('')
    setSending(false)
  }

  async function handleDelete(id: number) {
    if (!confirm('Obriši komentar?')) return
    await fetch(`/api/comments?id=${id}`, { method: 'DELETE' })
    setComments(c => c.filter(x => x.id !== id))
  }

  return (
    <div className="border-t border-gray-100 pt-6 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
        💬 Komentari
        {comments.length > 0 && (
          <span className="text-sm font-normal text-gray-400">({comments.length})</span>
        )}
      </h2>

      {/* Forma za novi komentar */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-green-700 text-white flex items-center justify-center
                            text-sm font-bold shrink-0 mt-1">
              {(user.user_metadata?.full_name?.[0] ?? user.email?.[0] ?? 'K').toUpperCase()}
            </div>
            <div className="flex-1">
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder="Napiši komentar, iskustvo ili savet..."
                rows={3}
                maxLength={1000}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">{body.length}/1000</span>
                <button type="submit" disabled={!body.trim() || sending}
                  className="bg-green-700 text-white px-5 py-2 rounded-xl text-sm font-medium
                             hover:bg-green-800 disabled:opacity-50 transition-colors">
                  {sending ? 'Šaljem...' : 'Objavi komentar'}
                </button>
              </div>
              {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 text-center">
          <p className="text-gray-600 text-sm mb-3">Prijavi se da ostaviš komentar</p>
          <div className="flex justify-center gap-3">
            <Link href="/admin/login"
              className="bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-800">
              Prijavi se
            </Link>
            <Link href="/registracija"
              className="border border-green-700 text-green-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-50">
              Registruj se
            </Link>
          </div>
        </div>
      )}

      {/* Lista komentara */}
      {loading ? (
        <div className="text-center py-8 text-gray-400">Učitavam komentare...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <div className="text-3xl mb-2">💬</div>
          <p className="text-sm">Budi prvi koji će komentarisati ovu lokaciju!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map(c => (
            <div key={c.id} className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-green-100 text-green-800 flex items-center
                              justify-center text-sm font-bold shrink-0 mt-0.5">
                {(c.user_name?.[0] ?? '?').toUpperCase()}
              </div>
              <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-800">
                    {c.user_name ?? 'Korisnik'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{timeAgo(c.created_at)}</span>
                    {user?.email === c.user_email && (
                      <button onClick={() => handleDelete(c.id)}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors">
                        Obriši
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
