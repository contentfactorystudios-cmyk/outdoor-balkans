import { getLocations, extractCoordinates } from '@/lib/queries'
import MapContainer from '@/components/Map/MapContainer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 1800

interface Props {
  params: Promise<{ country: string; category: string }>
}

const CAT_CONFIG: Record<string, {
  name: string; gradient: string; bg: string;
  text: string; icon: string; desc: string
}> = {
  ribolov:      { name: 'Ribolov',      gradient: 'from-blue-600 to-cyan-500',    bg: 'bg-blue-50',   text: 'text-blue-800',   icon: '🎣', desc: 'Reke, jezera i ribnjaci' },
  lov:          { name: 'Lov',          gradient: 'from-amber-600 to-orange-500', bg: 'bg-amber-50',  text: 'text-amber-800',  icon: '🦌', desc: 'Lovišta i divljač' },
  kampovanje:   { name: 'Kampovanje',   gradient: 'from-green-600 to-emerald-500',bg: 'bg-green-50',  text: 'text-green-800',  icon: '⛺', desc: 'Kampovi i priroda' },
  planinarenje: { name: 'Planinarenje', gradient: 'from-purple-600 to-violet-500',bg: 'bg-purple-50', text: 'text-purple-800', icon: '🥾', desc: 'Planine i staze' },
  kajak:      { name: 'Kajak & Jezera', gradient: 'from-cyan-600 to-blue-500', bg: 'bg-cyan-50', text: 'text-cyan-800', icon: '🚣', desc: 'Reke, jezera i kupanje' },
  rezervati:    { name: 'Rezervati prirode', gradient: 'from-teal-600 to-green-500', bg: 'bg-teal-50', text: 'text-teal-800', icon: '🦋', desc: 'Zaštićena priroda' },
}

const COUNTRY_SR: Record<string, string> = {
  srbija: 'Srbiji', hrvatska: 'Hrvatskoj', bosna: 'Bosni i Hercegovini',
  'crna-gora': 'Crnoj Gori', slovenija: 'Sloveniji',
  'severna-makedonija': 'Severnoj Makedoniji',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, category } = await params
  const cfg = CAT_CONFIG[category]
  const countryName = COUNTRY_SR[country] ?? country
  return {
    title: `${cfg?.name ?? category} u ${countryName} — OutdoorBalkans`,
    description: `Pronađi sve lokacije za ${cfg?.name?.toLowerCase() ?? category} u ${countryName}. Mapa, GPS koordinate, dozvole i savjeti zajednice.`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { country, category } = await params
  const cfg = CAT_CONFIG[category] ?? {
    name: category, gradient: 'from-green-600 to-green-500',
    bg: 'bg-green-50', text: 'text-green-800', icon: '📍', desc: ''
  }

  const locations = await getLocations({ country_slug: country, category_slug: category })

  const mapLocations = locations.map((loc: any) => {
    const coords = extractCoordinates(loc.coordinates)
    if (!coords) return null
    return {
      ...loc,
      lat: coords.lat, lng: coords.lng,
      category_slug: loc.categories?.slug,
      category_name: loc.categories?.name,
      country_slug:  loc.countries?.slug,
      region_name:   loc.regions?.name,
    }
  }).filter(Boolean)

  const countryDisplay = COUNTRY_SR[country] ?? country

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero header */}
      <div className={`bg-gradient-to-r ${cfg.gradient} text-white`}>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/" className="text-white/60 hover:text-white text-sm">Početna</Link>
            <span className="text-white/40">/</span>
            <span className="text-white/80 text-sm capitalize">{country}</span>
            <span className="text-white/40">/</span>
            <span className="text-white text-sm">{cfg.name}</span>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <span className="text-6xl">{cfg.icon}</span>
            <div>
              <h1 className="text-4xl font-black">{cfg.name} u {countryDisplay}</h1>
              <p className="text-white/80 mt-1">{locations.length} lokacija · {cfg.desc}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Mapa */}
        {mapLocations.length > 0 && (
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm mb-8 h-80">
            <MapContainer locations={mapLocations} />
          </div>
        )}

        {/* Grid lokacija */}
        {locations.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">{cfg.icon}</span>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Nema lokacija još</h2>
            <p className="text-gray-500 mb-6">Budi prvi koji će predložiti lokaciju!</p>
            <Link href="/predlozi-lokaciju"
              className="bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800">
              📍 Predloži lokaciju
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {locations.map((loc: any) => {
              const coords = extractCoordinates(loc.coordinates)
              return (
                <Link key={loc.id}
                  href={`/${loc.countries?.slug}/${loc.categories?.slug}/${loc.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100
                             shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

                  {/* Slika */}
                  <div className={`h-48 bg-gradient-to-br ${cfg.gradient} relative overflow-hidden`}>
                    {loc.image_url ? (
                      <img
                        src={loc.image_url}
                        alt={loc.image_alt ?? loc.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-7xl opacity-40">{cfg.icon}</span>
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {loc.is_featured && (
                        <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
                          ⭐ Istaknuto
                        </span>
                      )}
                      {loc.permit_required && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          📋 Dozvola
                        </span>
                      )}
                    </div>

                    {/* GPS badge */}
                    {coords && (
                      <div className="absolute bottom-3 right-3">
                        <span className="bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
                          📍 GPS
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tekst */}
                  <div className="p-4">
                    <p className="text-xs text-gray-400 mb-1">
                      {loc.regions?.name ?? countryDisplay}
                    </p>
                    <h3 className="font-bold text-gray-900 text-sm mb-2 leading-snug
                                   group-hover:text-green-700 transition-colors line-clamp-2">
                      {loc.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {loc.short_description}
                    </p>
                    <div className="mt-3 text-xs font-semibold text-green-700
                                    group-hover:text-green-900 flex items-center gap-1">
                      Pogledaj detalje →
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm">
          <p className="text-gray-600 mb-4">
            Znaš dobru lokaciju za <strong>{cfg.name.toLowerCase()}</strong>?
          </p>
          <Link href="/predlozi-lokaciju"
            className="inline-flex items-center gap-2 bg-green-700 text-white
                       px-6 py-3 rounded-xl font-semibold hover:bg-green-800 transition-colors">
            📍 Predloži lokaciju
          </Link>
        </div>
      </div>
    </div>
  )
}
