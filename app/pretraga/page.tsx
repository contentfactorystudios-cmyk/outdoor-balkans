import { supabase } from '@/lib/supabase'
import SearchFilters from './SearchFilters'
import Link from 'next/link'
import { Suspense } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title:       'Naprednа Pretraga — OutdoorBalkans',
  description: 'Pronađi outdoor lokacije po kategoriji, državi, vrsti ribe i dozvolama.',
}

interface Props {
  searchParams: Promise<{
    q?:       string
    category?: string
    country?:  string
    permit?:   string
    fish?:     string
  }>
}

const GRADIENTS: Record<string, string> = {
  ribolov: 'from-blue-400 to-cyan-500',
  lov:     'from-amber-500 to-orange-600',
}

export default async function SearchPage({ searchParams }: Props) {
  const p = await searchParams

  // Filter opcije (uvek dohvati)
  const [{ data: countries }, { data: categories }, { data: fish }] = await Promise.all([
    supabase.from('countries').select('id,name,slug').eq('is_active', true).order('name'),
    supabase.from('categories').select('id,name,slug,icon').eq('is_active', true),
    supabase.from('fish_types').select('id,name,slug').order('name'),
  ])

  // Gradi query
  let query = supabase
    .from('locations')
    .select(`
      id, name, slug, short_description, image_url, permit_required, best_season,
      categories(name, slug, icon),
      countries(name, slug),
      regions(name),
      location_fish(fish_types(name, slug))
    `)
    .eq('is_published', true)

  if (p.q?.trim() && p.q.trim().length >= 2) {
    const safe = p.q.trim().replace(/[%_\\]/g, '\\$&')
    query = (query as any).or(`name.ilike.%${safe}%,short_description.ilike.%${safe}%`)
  }

  if (p.category) {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', p.category).single()
    if (cat) query = (query as any).eq('category_id', cat.id)
  }

  if (p.country) {
    const { data: ctr } = await supabase.from('countries').select('id').eq('slug', p.country).single()
    if (ctr) query = (query as any).eq('country_id', ctr.id)
  }

  if (p.permit === 'da') query = (query as any).eq('permit_required', true)
  if (p.permit === 'ne') query = (query as any).eq('permit_required', false)

  const { data: rawResults } = await (query as any)
    .order('is_featured', { ascending: false })
    .limit(30)

  // Filter po ribi (many-to-many)
  const results = p.fish
    ? (rawResults ?? []).filter((loc: any) =>
        loc.location_fish?.some((lf: any) => lf.fish_types?.slug === p.fish)
      )
    : (rawResults ?? [])

  const hasFilters = p.q || p.category || p.country || p.permit || p.fish

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">🔍 Naprednа Pretraga</h1>

      {/* Filteri — client komponenta */}
      <Suspense fallback={<div className="h-40 bg-white rounded-2xl border animate-pulse mb-8" />}>
        <SearchFilters
          countries={countries ?? []}
          categories={categories ?? []}
          fish={fish ?? []}
        />
      </Suspense>

      {/* Broj rezultata */}
      {hasFilters && (
        <p className="text-gray-500 text-sm mb-4">
          {results.length === 0
            ? 'Nema rezultata za ove filtere.'
            : `${results.length} lokacija pronađeno`}
        </p>
      )}

      {/* Rezultati */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((loc: any) => {
            const catSlug = loc.categories?.slug ?? ''
            const fishList = loc.location_fish
              ?.map((lf: any) => lf.fish_types?.name)
              .filter(Boolean) ?? []

            return (
              <Link key={loc.id}
                href={`/${loc.countries?.slug}/${catSlug}/${loc.slug}`}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden
                           hover:shadow-lg hover:border-green-200 transition-all group">

                <div className={`w-full h-40 overflow-hidden bg-gradient-to-br
                                 ${GRADIENTS[catSlug] ?? 'from-gray-400 to-gray-500'}`}>
                  {loc.image_url
                    ? <img src={loc.image_url} alt={loc.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                    : <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl opacity-80">{loc.categories?.icon ?? '📍'}</span>
                      </div>
                  }
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                      {loc.categories?.icon} {loc.categories?.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {loc.regions?.name ?? loc.countries?.name}
                    </span>
                    {loc.permit_required
                      ? <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full">⚠️ Dozvola</span>
                      : <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">✅ Slobodno</span>
                    }
                  </div>
                  <h2 className="font-bold text-gray-900 mb-1 group-hover:text-green-800 transition-colors">
                    {loc.name}
                  </h2>
                  <p className="text-gray-500 text-sm line-clamp-2">{loc.short_description}</p>
                  {fishList.length > 0 && (
                    <p className="text-xs text-blue-600 mt-2 font-medium">🐟 {fishList.join(', ')}</p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Prazan state */}
      {!hasFilters && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-lg font-medium text-gray-600">Koristi filtere iznad</p>
          <p className="text-sm mt-1">Odaberi kategoriju, državu, dozvolu ili vrstu ribe</p>
        </div>
      )}

      {hasFilters && results.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">😔</div>
          <p className="text-lg font-medium text-gray-600">Nema rezultata</p>
          <p className="text-sm text-gray-400 mt-1 mb-4">Pokušaj sa manje filtera</p>
          <Link href="/pretraga"
            className="inline-block bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-green-800">
            Resetuj sve filtere
          </Link>
        </div>
      )}
    </main>
  )
}
