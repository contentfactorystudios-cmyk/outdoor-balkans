'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'

export default function PredloziLokaciju() {
  const [form, setForm] = useState({
    name: '', category: 'ribolov', country: 'srbija',
    region: '', lat: '', lng: '', description: '', contact: '',
  })
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState(false)
  const [error,    setError]    = useState('')

  const ic = `w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
              focus:outline-none focus:ring-2 focus:ring-green-500 bg-white`
  const lc = `block text-sm font-medium text-gray-700 mb-1`

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')

    const { error } = await supabase.from('location_proposals').insert({
      name:        form.name,
      category:    form.category,
      country:     form.country,
      region:      form.region     || null,
      lat:         form.lat        ? parseFloat(form.lat)  : null,
      lng:         form.lng        ? parseFloat(form.lng)  : null,
      description: form.description || null,
      contact:     form.contact    || null,
    })

    if (error) {
      setError('Greška pri slanju. Pokušaj ponovo.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) return (
    <main className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-2xl shadow-sm border p-10">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Hvala na predlogu!</h1>
        <p className="text-gray-500 mb-2">
          Tvoja lokacija <strong>{form.name}</strong> je primljena.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          Naš admin tim će pregledati predlog i dodati ga u bazu u roku od 48 sati.
        </p>
        <div className="flex justify-center gap-3">
          <button onClick={() => { setSuccess(false); setForm({ name:'',category:'ribolov',country:'srbija',region:'',lat:'',lng:'',description:'',contact:'' }) }}
            className="border border-green-700 text-green-700 px-5 py-2.5 rounded-xl font-medium hover:bg-green-50">
            Predloži još jednu
          </button>
          <Link href="/"
            className="bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green-800">
            Vrati se na početnu
          </Link>
        </div>
      </div>
    </main>
  )

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100
                        rounded-2xl text-3xl mb-4">📍</div>
        <h1 className="text-3xl font-bold text-gray-900">Predloži Lokaciju</h1>
        <p className="text-gray-500 mt-2">
          Znaš dobro mesto za ribolov ili lov? Podeli ga sa zajednicom!
        </p>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-8 flex gap-3">
        <span className="text-2xl shrink-0">ℹ️</span>
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">Kako funkcioniše?</p>
          <p>Popuni formu i pošalji predlog. Naš tim pregleda svaki predlog i dodaje ga u bazu.
             GPS koordinate možeš naći desnim klikom na Google Maps.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">

        {/* Naziv */}
        <div>
          <label className={lc}>Naziv lokacije *</label>
          <input type="text" value={form.name} required className={ic}
            placeholder="npr. Ribnjak kod Aranđelovca"
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Kategorija */}
          <div>
            <label className={lc}>Aktivnost *</label>
            <select value={form.category} className={ic}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              <option value="ribolov">🎣 Ribolov</option>
              <option value="lov">🦌 Lov</option>
            </select>
          </div>

          {/* Država */}
          <div>
            <label className={lc}>Država *</label>
            <select value={form.country} className={ic}
              onChange={e => setForm(f => ({ ...f, country: e.target.value }))}>
              <option value="srbija">Srbija</option>
              <option value="hrvatska">Hrvatska</option>
              <option value="bosna">Bosna i Hercegovina</option>
              <option value="crna-gora">Crna Gora</option>
              <option value="slovenija">Slovenija</option>
              <option value="severna-makedonija">Severna Makedonija</option>
              <option value="albanija">Albanija</option>
              <option value="bugarska">Bugarska</option>
            </select>
          </div>
        </div>

        {/* Region */}
        <div>
          <label className={lc}>Region / Oblast (opciono)</label>
          <input type="text" value={form.region} className={ic}
            placeholder="npr. Šumadija, Vojvodina, Zlatibor..."
            onChange={e => setForm(f => ({ ...f, region: e.target.value }))} />
        </div>

        {/* GPS */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-sm font-semibold text-blue-900 mb-1">
            🗺️ GPS Koordinate (opciono ali veoma korisno!)
          </p>
          <p className="text-xs text-blue-600 mb-3">
            Google Maps → desni klik na tačku → kopiraj prve dve vrednosti
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lc}>Latitude (npr. 44.8125)</label>
              <input type="number" step="any" value={form.lat} className={ic}
                placeholder="44.8125"
                onChange={e => setForm(f => ({ ...f, lat: e.target.value }))} />
            </div>
            <div>
              <label className={lc}>Longitude (npr. 20.4612)</label>
              <input type="number" step="any" value={form.lng} className={ic}
                placeholder="20.4612"
                onChange={e => setForm(f => ({ ...f, lng: e.target.value }))} />
            </div>
          </div>
        </div>

        {/* Opis */}
        <div>
          <label className={lc}>Opis lokacije (opciono)</label>
          <textarea value={form.description} rows={4} className={ic}
            placeholder="Opiši lokaciju — šta se tu može uloviti, posebnosti, pristup..."
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>

        {/* Kontakt */}
        <div>
          <label className={lc}>Tvoj email ili telefon (opciono)</label>
          <input type="text" value={form.contact} className={ic}
            placeholder="Kako da te kontaktiramo ako trebamo više info"
            onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />
          <p className="text-xs text-gray-400 mt-1">Nećemo deliti tvoje podatke</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            ❌ {error}
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full bg-green-700 text-white py-3.5 rounded-xl font-semibold
                     hover:bg-green-800 disabled:opacity-60 transition-colors text-base">
          {loading ? '⏳ Šaljem...' : '📍 Pošalji Predlog'}
        </button>

        <p className="text-center text-xs text-gray-400">
          Predlogom prihvataš naše uslove korišćenja. Lokacija će biti pregledana pre objave.
        </p>
      </form>
    </main>
  )
}
