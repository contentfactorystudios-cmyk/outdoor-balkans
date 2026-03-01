'use client'
import { useState } from 'react'

interface Proposal {
  id:          number
  name:        string
  category:    string
  country:     string
  region:      string | null
  description: string | null
  vote_count:  number | null
  status:      string
  created_at:  string
  nickname:    string | null
}

const CAT_COLORS: Record<string, string> = {
  ribolov: 'bg-blue-100 text-blue-800',
  lov:     'bg-amber-100 text-amber-800',
}
const CAT_ICONS: Record<string, string> = {
  ribolov: '🎣',
  lov:     '🦌',
}

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'danas'
  if (days === 1) return 'juče'
  if (days < 30)  return `pre ${days} dana`
  return new Date(d).toLocaleDateString('sr-Latn-RS')
}

export default function ProposalCard({ proposal: p }: { proposal: Proposal }) {
  const [votes,      setVotes]      = useState(p.vote_count ?? 0)
  const [userVote,   setUserVote]   = useState(0)
  const [voting,     setVoting]     = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comments,   setComments]   = useState<any[]>([])
  const [commentsLoaded, setCommentsLoaded] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [commenterName, setCommenterName] = useState('')
  const [sending,    setSending]    = useState(false)

  async function handleVote(v: 1 | -1) {
    if (voting) return
    setVoting(true)
    const res  = await fetch('/api/proposals/vote', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ proposal_id: p.id, vote: v }),
    })
    const data = await res.json()
    if (!data.error) {
      setVotes(data.vote_count)
      setUserVote(data.user_vote)
    }
    setVoting(false)
  }

  async function loadComments() {
    if (commentsLoaded) return
    const res  = await fetch(`/api/proposals/comments?proposal_id=${p.id}`)
    const data = await res.json()
    setComments(data.comments ?? [])
    setCommentsLoaded(true)
  }

  async function toggleComments() {
    if (!showComments) await loadComments()
    setShowComments(!showComments)
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault()
    if (!newComment.trim()) return
    setSending(true)
    const res  = await fetch('/api/proposals/comments', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        proposal_id: p.id,
        body:        newComment,
        user_name:   commenterName || 'Anonimni ribolovac',
      }),
    })
    const data = await res.json()
    if (data.comment) {
      setComments(c => [...c, data.comment])
      setNewComment('')
    }
    setSending(false)
  }

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden
                     transition-all hover:shadow-md
                     ${p.status === 'approved' ? 'border-green-200' : 'border-gray-100'}`}>
      <div className="p-5">
        <div className="flex gap-4">

          {/* Voting */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <button onClick={() => handleVote(1)} disabled={voting}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg
                          transition-all hover:scale-110 active:scale-95
                          ${userVote === 1
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-600'}`}>
              ▲
            </button>
            <span className={`text-sm font-bold min-w-[2rem] text-center
                              ${votes > 0 ? 'text-green-700' : votes < 0 ? 'text-red-600' : 'text-gray-500'}`}>
              {votes > 0 ? `+${votes}` : votes}
            </span>
            <button onClick={() => handleVote(-1)} disabled={voting}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg
                          transition-all hover:scale-110 active:scale-95
                          ${userVote === -1
                            ? 'bg-red-100 text-red-600'
                            : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600'}`}>
              ▼
            </button>
          </div>

          {/* Sadržaj */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
              <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                {p.status === 'approved' && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-semibold">
                    ✅ Odobreno
                  </span>
                )}
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                                  ${CAT_COLORS[p.category] ?? 'bg-gray-100 text-gray-700'}`}>
                  {CAT_ICONS[p.category]} {p.category}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-400 mb-3 flex-wrap">
              <span>📍 {p.region ? `${p.region}, ` : ''}{p.country}</span>
              {p.nickname && <span>👤 {p.nickname}</span>}
              <span>🕐 {timeAgo(p.created_at)}</span>
            </div>

            {p.description && (
              <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-3">
                {p.description}
              </p>
            )}

            <button onClick={toggleComments}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-green-700
                         font-medium transition-colors">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
              {showComments ? 'Zatvori' : `Komentari${comments.length > 0 ? ` (${comments.length})` : ''}`}
            </button>
          </div>
        </div>
      </div>

      {/* Komentari */}
      {showComments && (
        <div className="border-t border-gray-100 bg-gray-50 p-4">
          {comments.length === 0 && commentsLoaded ? (
            <p className="text-xs text-gray-400 text-center py-2 mb-3">
              Još nema komentara. Budi prvi!
            </p>
          ) : (
            <div className="space-y-3 mb-4">
              {comments.map(c => (
                <div key={c.id} className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-green-200 text-green-800 text-xs
                                  font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {c.user_name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 bg-white rounded-xl px-3 py-2 border border-gray-100">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold text-gray-800">{c.user_name}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(c.created_at).toLocaleDateString('sr-Latn-RS')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{c.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Forma za komentar */}
          <form onSubmit={handleComment} className="space-y-2">
            <input
              value={commenterName}
              onChange={e => setCommenterName(e.target.value)}
              placeholder="Tvoj nadimak (opciono)"
              className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2
                         focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
            />
            <div className="flex gap-2">
              <input
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Napiši komentar..."
                className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2
                           focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
              />
              <button type="submit" disabled={!newComment.trim() || sending}
                className="bg-green-700 text-white px-4 py-2 rounded-xl text-sm
                           hover:bg-green-800 disabled:opacity-50 shrink-0">
                {sending ? '...' : 'Pošalji'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
