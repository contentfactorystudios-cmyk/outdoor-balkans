// weather-added
import { getLocationBySlug, extractCoordinates } from '@/lib/queries'
import { getUnsplashPhoto } from '@/lib/unsplash'
import ShareButtons  from '@/components/ShareButtons'
import ReactionsBar  from '@/components/ReactionsBar'
import WeatherWidget from '@/components/WeatherWidget'
import CommentsSection from '@/components/CommentsSection'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 86400

interface Props {
  params: Promise<{ country: string; category: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { country, category, slug } = await params
    const location = await getLocationBySlug(country, category, slug)
    if (!location) return {}
    return {
      title:       location.meta_title       ?? location.name,
      description: location.meta_description ?? location.short_description ?? '',
      openGraph: {
        title:       location.meta_title       ?? location.name,
        description: location.meta_description ?? location.short_description ?? '',
        images:      location.image_url ? [{ url: location.image_url }] : [],
      },
    }
  } catch { return {} }
}

export default async function LocationPage({ params }: Props) {
  const { country, category, slug } = await params
  const location = await getLocationBySlug(country, category, slug)
  if (!location) notFound()

  const coords = extractCoordinates(location.coordinates)
  const lat    = coords?.lat ?? 0
  const lng    = coords?.lng ?? 0
  const loc    = location as any

  const catName     = loc.categories?.name ?? category
  const catIcon     = loc.categories?.icon ?? '📍'
  const countryName = loc.countries?.name  ?? country
  const region      = loc.regions?.name    ?? ''

  let heroImage   = location.image_url
  let imageCredit = null as string | null
  if (!heroImage) {
    const u = await getUnsplashPhoto(category, countryName)
    heroImage   = u.url
    imageCredit = u.credit
  }

  const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://outdoorbalkans.com'}/${country}/${category}/${slug}`

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'TouristAttraction',
    name: location.name, description: location.short_description ?? location.description,
    geo: { '@type': 'GeoCoordinates', latitude: lat, longitude: lng },
    address: { '@type': 'PostalAddress', addressCountry: loc.countries?.code ?? '', addressRegion: region },
    url: pageUrl, ...(heroImage && { image: heroImage }),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="max-w-4xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-green-700">Početna</Link>
          <span className="text-gray-300">/</span>
          <Link href={`/${country}`} className="hover:text-green-700">{countryName}</Link>
          <span className="text-gray-300">/</span>
          <Link href={`/${country}/${category}`} className="hover:text-green-700">{catName}</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-800 font-medium truncate max-w-xs">{location.name}</span>
        </nav>

        {/* Hero slika */}
        {heroImage && (
          <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden mb-8 shadow-lg">
            <img src={heroImage} alt={location.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="text-2xl sm:text-4xl font-bold text-white leading-tight drop-shadow-lg">
                {location.name}
              </h1>
            </div>
            {imageCredit && (
              <div className="absolute top-3 right-3 bg-black/40 text-white/80 text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
                📷 {imageCredit}
              </div>
            )}
          </div>
        )}
        {!heroImage && <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">{location.name}</h1>}

        {/* Tagovi */}
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-800 border border-blue-100">{catIcon} {catName}</span>
          {region && <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700">📍 {region}, {countryName}</span>}
          {location.best_season && <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-green-50 text-green-800 border border-green-100">📅 {location.best_season}</span>}
          {location.permit_required
            ? <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-50 text-yellow-800 border border-yellow-100">⚠️ Dozvola obavezna</span>
            : <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-100">✅ Bez dozvole</span>
          }
        </div>

        {location.description && (
          <p className="text-gray-700 text-lg leading-relaxed mb-8">{location.description}</p>
        )}

        {/* Info grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <h2 className="font-bold text-gray-800 mb-4">📋 Praktične Informacije</h2>
            <ul className="space-y-3 text-sm">
              {location.best_season && (
                <li className="flex gap-3"><span className="text-gray-500 w-20 shrink-0">📅 Sezona</span><span className="text-gray-800 font-medium">{location.best_season}</span></li>
              )}
              {loc.access_notes && (
                <li className="flex gap-3"><span className="text-gray-500 w-20 shrink-0">🚗 Pristup</span><span className="text-gray-800">{loc.access_notes}</span></li>
              )}
              <li className="flex gap-3">
                <span className="text-gray-500 w-20 shrink-0">📋 Dozvola</span>
                {location.permit_required
                  ? <span className="text-gray-800">{loc.permit_info ?? 'Da — kontaktiraj lokalne vlasti'}</span>
                  : <span className="text-green-700 font-medium">Nije potrebna</span>}
              </li>
            </ul>
          </div>

          {lat !== 0 && lng !== 0 && (
            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
              <h2 className="font-bold text-gray-800 mb-4">🗺️ GPS Lokacija</h2>
              <p className="font-mono text-blue-900 text-xl font-bold mb-1">{lat.toFixed(5)}, {lng.toFixed(5)}</p>
              <p className="text-xs text-gray-500 mb-4">Latitude, Longitude · WGS84</p>
              <a href={`https://www.google.com/maps/search/${encodeURIComponent(location.google_maps_query || location.name + ', Srbija')}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700">
                📍 Otvori u Google Maps
              </a>
            </div>
          )}
        </div>

        {/* Vremenska prognoza */}
        {lat !== 0 && lng !== 0 && (
          <WeatherWidget lat={lat} lng={lng} locationName={location.name} category={category} />
        )}

        {/* Reakcije */}
        <ReactionsBar locationId={location.id} />

        {/* Share */}
        <ShareButtons url={pageUrl} title={location.name} />

        {/* Komentari */}
        <CommentsSection locationId={location.id} />

        {/* Nazad */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <Link href={`/${country}/${category}`}
            className="inline-flex items-center gap-2 text-green-700 hover:text-green-900 font-medium text-sm">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Nazad na {catName}
          </Link>
        </div>
      </main>
    </>
  )
}
