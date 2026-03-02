/**
 * Smart photo resolver — pokušava više izvora redom
 * 1. Wikimedia Commons (Wikipedia page image)
 * 2. Category fallback (Unsplash, potvrđene slike)
 */

const CAT_PHOTOS: Record<string, string> = {
  ribolov:             'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=700&fit=crop&q=85',
  lov:                 'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=1200&h=700&fit=crop&q=85',
  kajak:               'https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?w=1200&h=700&fit=crop&q=85',
  kampovanje:          'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&h=700&fit=crop&q=85',
  planinarenje:        'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=700&fit=crop&q=85',
  'nacionalni-parkovi':'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=700&fit=crop&q=85',
  rezervati:           'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=700&fit=crop&q=85',
}

// Wikimedia Commons API — traži sliku po nazivu lokacije
async function getWikimediaPhoto(locationName: string): Promise<string | null> {
  // Pokušaj više varijanti naziva
  const queries = [
    locationName,
    locationName.replace(' jezero', ' Lake').replace(' reka', ' River').replace(' planina', ' Mountain'),
    locationName + ' Serbia',
    locationName + ' Srbija',
  ]

  for (const q of queries) {
    try {
      // Wikipedia page image API
      const title = q.replace(/ /g, '_')
      const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=1200&origin=*`
      const res = await fetch(url, {
        headers: { 'User-Agent': 'OutdoorBalkans/1.0 (info@outdoorbalkans.com)' },
        next: { revalidate: 86400 * 7 } // cache 7 dana
      })
      if (!res.ok) continue
      const data = await res.json()
      const pages = data?.query?.pages
      if (!pages) continue
      const page = Object.values(pages)[0] as any
      if (page && page.thumbnail?.source) {
        // Uzmi veću verziju slike
        const src = page.thumbnail.source
          .replace(/\/\d+px-/, '/1200px-')
        return src
      }

      // Pokušaj srpsku Wikipediju
      const srUrl = `https://sr.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(q.replace(/ /g, '_'))}&prop=pageimages&format=json&pithumbsize=1200&origin=*`
      const srRes = await fetch(srUrl, {
        headers: { 'User-Agent': 'OutdoorBalkans/1.0' },
        next: { revalidate: 86400 * 7 }
      })
      if (srRes.ok) {
        const srData = await srRes.json()
        const srPages = srData?.query?.pages
        if (srPages) {
          const srPage = Object.values(srPages)[0] as any
          if (srPage && srPage.thumbnail?.source) {
            return srPage.thumbnail.source.replace(/\/\d+px-/, '/1200px-')
          }
        }
      }
    } catch { continue }
  }
  return null
}

// Wikimedia Commons direktna pretraga
async function searchWikimediaCommons(locationName: string): Promise<string | null> {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(locationName + ' Serbia')}&srnamespace=6&srlimit=3&format=json&origin=*`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'OutdoorBalkans/1.0' },
      next: { revalidate: 86400 * 7 }
    })
    if (!res.ok) return null
    const data = await res.json()
    const results = data?.query?.search
    if (!results || results.length === 0) return null

    // Uzmi prvu sliku
    const title = results[0].title
    const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json&origin=*`
    const infoRes = await fetch(infoUrl, {
      headers: { 'User-Agent': 'OutdoorBalkans/1.0' },
      next: { revalidate: 86400 * 7 }
    })
    if (!infoRes.ok) return null
    const infoData = await infoRes.json()
    const pages = infoData?.query?.pages
    if (!pages) return null
    const page = Object.values(pages)[0] as any
    return page?.imageinfo?.[0]?.url ?? null
  } catch { return null }
}

// Mapbox satellite (ako imamo koordinate)
function getMapboxSatellite(lat: number, lng: number, zoom = 13): string {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  if (!token) return ''
  return `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${lng},${lat},${zoom},0/1200x600@2x?access_token=${token}`
}

export interface PhotoResult {
  url: string
  source: 'location' | 'wikipedia' | 'commons' | 'mapbox' | 'category'
}

export async function getLocationPhoto(params: {
  imageUrl?: string | null
  locationName: string
  category: string
  lat?: number
  lng?: number
}): Promise<PhotoResult> {
  const { imageUrl, locationName, category, lat, lng } = params

  // 1. Vlastita slika lokacije
  if (imageUrl) return { url: imageUrl, source: 'location' }

  // 2. Wikipedia page image
  const wikiPhoto = await getWikimediaPhoto(locationName)
  if (wikiPhoto) return { url: wikiPhoto, source: 'wikipedia' }

  // 3. Wikimedia Commons pretraga
  const commonsPhoto = await searchWikimediaCommons(locationName)
  if (commonsPhoto) return { url: commonsPhoto, source: 'commons' }

  // 4. Mapbox satellite (ako imamo koordinate i token)
  if (lat && lng && lat !== 0) {
    const satellite = getMapboxSatellite(lat, lng)
    if (satellite) return { url: satellite, source: 'mapbox' }
  }

  // 5. Category fallback
  const catPhoto = CAT_PHOTOS[category] ?? CAT_PHOTOS['planinarenje']
  return { url: catPhoto, source: 'category' }
}
