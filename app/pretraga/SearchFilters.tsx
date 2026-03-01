'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

interface Props {
  countries:  { id: number; name: string; slug: string }[]
  categories: { id: number; name: string; slug: string; icon: string }[]
  fish:       { id: number; name: string; slug: string }[]
}

export default function SearchFilters({ countries, categories, fish }: Props) {
  const router       = useRouter()
  const searchParams = useSearchParams()

  const get = (key: string) => searchParams.get(key) ?? ''

  const update = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    // Kad se promeni država, obriši region
    if (key === 'country') params.delete('region')
    router.push(`/pretraga?${params.toString()}`)
  }, [router, searchParams])

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Tekst pretraga */}
        <div className="sm:col-span-2 lg:col-span-3">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Pretraži po nazivu
          </label>
          <div className="relative">
            <input
              type="search"
              defaultValue={get('q')}
              placeholder="npr. Zasavica, Uvac, kanjon..."
              onKeyDown={e => {
                if (e.key === 'Enter') update('q', (e.target as HTMLInputElement).value)
              }}
              onBlur={e => update('q', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm
                         focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
              fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
        </div>

        {/* Kategorija */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Kategorija
          </label>
          <select value={get('category')} onChange={e => update('category', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                       focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
            <option value="">Sve kategorije</option>
            {categories.map(c => (
              <option key={c.id} value={c.slug}>{c.icon} {c.name}</option>
            ))}
          </select>
        </div>

        {/* Država */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Država
          </label>
          <select value={get('country')} onChange={e => update('country', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                       focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
            <option value="">Sve države</option>
            {countries.map(c => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Dozvola */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Dozvola
          </label>
          <select value={get('permit')} onChange={e => update('permit', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                       focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
            <option value="">Svejedno</option>
            <option value="ne">✅ Bez dozvole</option>
            <option value="da">⚠️ Sa dozvolom</option>
          </select>
        </div>

        {/* Vrsta ribe */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Vrsta ribe 🐟
          </label>
          <select value={get('fish')} onChange={e => update('fish', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                       focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
            <option value="">Sve vrste</option>
            {fish.map(f => (
              <option key={f.id} value={f.slug}>{f.name}</option>
            ))}
          </select>
        </div>

        {/* Reset */}
        <div className="flex items-end">
          <button onClick={() => router.push('/pretraga')}
            className="w-full border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl
                       text-sm font-medium hover:bg-gray-50 transition-colors">
            ✕ Resetuj filtere
          </button>
        </div>

      </div>
    </div>
  )
}
