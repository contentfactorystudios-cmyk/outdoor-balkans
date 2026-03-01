'use client'
import { useState, useEffect, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'

function ResetForm() {
  const [password,  setPassword]  = useState('')
  const [password2, setPassword2] = useState('')
  const [show,      setShow]      = useState(false)
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [ready,     setReady]     = useState(false)
  const router       = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Supabase šalje token u URL hash — mora biti obrađen klijentski
    const handleSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setReady(true)
      } else {
        // Čekaj da Supabase obradi hash iz URL-a
        setTimeout(async () => {
          const { data: { session: s2 } } = await supabase.auth.getSession()
          setReady(!!s2)
          if (!s2) setError('Link je istekao ili nije validan. Zatraži novi reset.')
        }, 1000)
      }
    }
    handleSession()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Lozinka mora imati najmanje 8 znakova.')
      return
    }
    if (password !== password2) {
      setError('Lozinke se ne podudaraju.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError('Greška pri promjeni lozinke. Pokušaj ponovo.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => {
      router.push('/prijava')
    }, 3000)
  }

  if (success) return (
    <div className="text-center">
      <div className="text-5xl mb-4">✅</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Lozinka promijenjena!</h2>
      <p className="text-gray-500">Preusmjeravamo te na prijavu za 3 sekunde...</p>
    </div>
  )

  if (!ready && !error) return (
    <div className="text-center py-8">
      <div className="text-4xl mb-4 animate-pulse">🔑</div>
      <p className="text-gray-500">Provjeravam link...</p>
    </div>
  )

  if (error && !ready) return (
    <div className="text-center">
      <div className="text-5xl mb-4">❌</div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Link nije validan</h2>
      <p className="text-gray-500 mb-6">{error}</p>
      <a href="/zaboravio-lozinku"
        className="inline-block bg-green-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-800">
        Zatraži novi link
      </a>
    </div>
  )

  return (
    <>
      <div className="text-center mb-8">
        <span className="text-4xl">🔒</span>
        <h1 className="text-2xl font-bold text-gray-800 mt-3">Nova lozinka</h1>
        <p className="text-gray-500 text-sm mt-1">Upiši svoju novu lozinku</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nova lozinka
          </label>
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm
                         focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Min. 8 znakova"
            />
            <button type="button" onClick={() => setShow(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {show ? '🙈' : '👁️'}
            </button>
          </div>
          <div className="mt-1 flex gap-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                password.length === 0 ? 'bg-gray-200' :
                password.length < 8  ? (i < 1 ? 'bg-red-400' : 'bg-gray-200') :
                password.length < 12 ? (i < 2 ? 'bg-yellow-400' : 'bg-gray-200') :
                password.length < 16 ? (i < 3 ? 'bg-blue-400' : 'bg-gray-200') :
                'bg-green-500'
              }`} />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {password.length < 8 ? `Još ${8 - password.length} znakova` : '✅ Dobra dužina'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ponovi lozinku
          </label>
          <input
            type={show ? 'text' : 'password'}
            value={password2}
            onChange={e => setPassword2(e.target.value)}
            required
            autoComplete="new-password"
            className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2
              ${password2 && password !== password2
                ? 'border-red-300 focus:ring-red-400'
                : 'border-gray-200 focus:ring-green-500'}`}
            placeholder="Ponovi lozinku"
          />
          {password2 && password !== password2 && (
            <p className="text-xs text-red-500 mt-1">Lozinke se ne podudaraju</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading || !ready}
          className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold
                     hover:bg-green-800 disabled:opacity-60 transition-colors">
          {loading ? '⏳ Mjenjam...' : '🔒 Postavi novu lozinku'}
        </button>
      </form>
    </>
  )
}

export default function ResetLozinkaPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <Suspense fallback={<div className="text-center py-8 text-gray-400">Učitavam...</div>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  )
}
