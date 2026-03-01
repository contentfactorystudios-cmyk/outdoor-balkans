'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ZaboravioLozinkuPage() {
  const [email,   setEmail]   = useState('')
  const [sent,    setSent]    = useState(false)
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-lozinka`,
    })

    if (error) {
      setError('Greška. Provjeri email adresu.')
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border p-8 w-full max-w-md text-center">
        <div className="text-5xl mb-4">📧</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Provjeri email!</h2>
        <p className="text-gray-500 mb-2">
          Poslali smo link za reset lozinke na:
        </p>
        <p className="font-semibold text-gray-800 mb-6">{email}</p>
        <p className="text-sm text-gray-400 mb-6">
          Link važi 1 sat. Provjeri i Spam folder.
        </p>
        <Link href="/prijava"
          className="inline-block bg-green-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-800">
          Vrati se na prijavu
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">

        <div className="text-center mb-8">
          <span className="text-4xl">🔑</span>
          <h1 className="text-2xl font-bold text-gray-800 mt-3">Zaboravio si lozinku?</h1>
          <p className="text-gray-500 text-sm mt-1">
            Upiši email i poslaćemo ti link za reset
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email adresa
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                         focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="tvoj@email.com"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold
                       hover:bg-green-800 disabled:opacity-60 transition-colors">
            {loading ? '⏳ Šaljem...' : '📧 Pošalji link za reset'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/prijava"
            className="text-sm text-gray-400 hover:text-gray-600">
            ← Vrati se na prijavu
          </Link>
        </div>
      </div>
    </div>
  )
}
