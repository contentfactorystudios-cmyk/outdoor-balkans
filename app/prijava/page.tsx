'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function PrijavaPage() {
  const [mode,     setMode]     = useState<'login'|'register'>('login')
  const [email,    setEmail]    = useState('')
  const [pass,     setPass]     = useState('')
  const [nickname, setNickname] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [ready,    setReady]    = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const passRef  = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) window.location.href = '/'
      else setReady(true)
    })
  }, [])

  useEffect(() => {
    if (!ready) return
    const t = setTimeout(() => {
      if (emailRef.current) emailRef.current.value = ''
      if (passRef.current)  passRef.current.value  = ''
      setEmail(''); setPass('')
    }, 100)
    return () => clearTimeout(t)
  }, [ready, mode])

  async function handleGoogle() {
    setError('')
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/`,
        queryParams: { prompt: 'select_account' },
      },
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const emailVal = emailRef.current?.value ?? email
    const passVal  = passRef.current?.value  ?? pass

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({
        email: emailVal, password: passVal,
      })
      if (error) { setError('Pogrešan email ili lozinka.'); setLoading(false); return }
      window.location.href = '/'
    } else {
      if (nickname.trim().length < 2) {
        setError('Nadimak mora biti najmanje 2 znaka.')
        setLoading(false); return
      }
      const { error } = await supabase.auth.signUp({
        email: emailVal, password: passVal,
        options: { data: { nickname: nickname.trim() } },
      })
      if (error) { setError(error.message); setLoading(false); return }
      setSuccess(true); setLoading(false)
    }
  }

  if (!ready) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-4xl animate-pulse">🏔️</div>
    </div>
  )

  if (success) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border p-8 w-full max-w-md text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Potvrdi email!</h2>
        <p className="text-gray-500 mb-6">
          Poslali smo ti email na <strong>{emailRef.current?.value}</strong>.<br/>
          Klikni link za potvrdu naloga.
        </p>
        <Link href="/" className="inline-block bg-green-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-800">
          Vrati se na početnu
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-6">
          <span className="text-4xl">🏔️</span>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">OutdoorBalkans</h1>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button onClick={() => { setMode('login'); setError('') }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors
              ${mode === 'login' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}>
            Prijava
          </button>
          <button onClick={() => { setMode('register'); setError('') }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors
              ${mode === 'register' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}>
            Registracija
          </button>
        </div>

        {/* Google */}
        <button onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 border-2 border-gray-200
                     rounded-xl px-4 py-3 font-medium text-gray-700 hover:border-gray-300
                     hover:bg-gray-50 transition-all mb-4">
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          {mode === 'login' ? 'Prijavi se sa Google' : 'Registruj se sa Google'}
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-200"/>
          <span className="text-gray-400 text-sm">ili</span>
          <div className="flex-1 h-px bg-gray-200"/>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          {/* Honeypot */}
          <input type="text" name="username" style={{ display: 'none' }} tabIndex={-1} readOnly />

          {/* Nickname — samo za registraciju */}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nadimak *
              </label>
              <input
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                required
                minLength={2}
                autoComplete="off"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="npr. RibolovacNis, LovacBgd..."
              />
              <p className="text-xs text-gray-400 mt-1">Min. 2 znaka, vidljiv je svima</p>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              ref={emailRef}
              type="email"
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="off"
              data-lpignore="true"
              data-1p-ignore="true"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                         focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="tvoj@email.com"
            />
          </div>

          {/* Lozinka */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Lozinka *
              </label>
              {/* LINK ZA RESET — vidljiv samo u login modu */}
              {mode === 'login' && (
                <Link href="/zaboravio-lozinku"
                  className="text-xs text-green-700 hover:text-green-900 font-medium hover:underline">
                  Zaboravio si lozinku?
                </Link>
              )}
            </div>
            <div className="relative">
              <input
                ref={passRef}
                type={showPass ? 'text' : 'password'}
                onChange={e => setPass(e.target.value)}
                required
                minLength={mode === 'register' ? 8 : 1}
                autoComplete="off"
                data-lpignore="true"
                data-1p-ignore="true"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm
                           focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder={mode === 'register' ? 'Min. 8 znakova' : '••••••••'}
              />
              <button type="button" onClick={() => setShowPass(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold
                       hover:bg-green-800 disabled:opacity-60 transition-colors">
            {loading
              ? '⏳ ...'
              : mode === 'login' ? 'Prijavi se' : 'Registruj se'
            }
          </button>
        </form>

      </div>
    </div>
  )
}
