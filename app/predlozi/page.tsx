import { supabase } from '@/lib/supabase'
import ProposalCard from './ProposalCard'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title:       'Predlozi Lokacija — OutdoorBalkans',
  description: 'Community predlozi za nove outdoor lokacije. Glasaj i komentiši!',
}

export const revalidate = 60

export default async function PredloziPage() {
  const { data: proposals } = await supabase
    .from('location_proposals')
    .select('id, name, category, country, region, description, vote_count, status, created_at, nickname')
    .order('vote_count', { ascending: false })
    .limit(50)

  const pending  = proposals?.filter(p => p.status === 'pending')  ?? []
  const approved = proposals?.filter(p => p.status === 'approved') ?? []

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📍 Predlozi Lokacija</h1>
          <p className="text-gray-500 mt-1">
            Community predlozi koje naš tim pregleda i dodaje u bazu
          </p>
        </div>
        <Link href="/predlozi-lokaciju"
          className="bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold
                     hover:bg-green-800 transition-colors flex items-center gap-2">
          + Dodaj predlog
        </Link>
      </div>

      {/* Statistike */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Čeka odobrenje', value: pending.length,  color: 'bg-amber-50 border-amber-100 text-amber-800' },
          { label: 'Odobreno',       value: approved.length, color: 'bg-green-50 border-green-100 text-green-800' },
          { label: 'Ukupno glasova', value: proposals?.reduce((s, p) => s + (p.vote_count ?? 0), 0) ?? 0, color: 'bg-blue-50 border-blue-100 text-blue-800' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border p-4 text-center ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Pending predlozi */}
      {pending.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            ⏳ Čeka odobrenje
            <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded-full">
              {pending.length}
            </span>
          </h2>
          <div className="space-y-4">
            {pending.map(p => (
              <ProposalCard key={p.id} proposal={p} />
            ))}
          </div>
        </section>
      )}

      {/* Approved */}
      {approved.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            ✅ Odobreno i dodato
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full">
              {approved.length}
            </span>
          </h2>
          <div className="space-y-4">
            {approved.map(p => (
              <ProposalCard key={p.id} proposal={p} />
            ))}
          </div>
        </section>
      )}

      {(!proposals || proposals.length === 0) && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📍</div>
          <p className="text-lg font-medium text-gray-600">Još nema predloga</p>
          <p className="text-sm text-gray-400 mt-1 mb-6">Budi prvi koji će predložiti lokaciju!</p>
          <Link href="/predlozi-lokaciju"
            className="inline-block bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800">
            Predloži lokaciju
          </Link>
        </div>
      )}
    </main>
  )
}
