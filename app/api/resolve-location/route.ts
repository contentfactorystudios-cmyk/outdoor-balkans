import { NextRequest, NextResponse } from 'next/server'

function extractCoords(s: string): { lat: number; lng: number } | null {
  // 1. Direktne koordinate: "44.1234, 22.5678" ili "44.1234,22.5678"
  const direct = s.match(/^(-?\d{1,3}\.\d+)[,\s]+(-?\d{1,3}\.\d+)$/)
  if (direct) return { lat: parseFloat(direct[1]), lng: parseFloat(direct[2]) }

  // 2. @lat,lng (Google Maps URL)
  const atSign = s.match(/@(-?\d{1,3}\.\d{4,}),(-?\d{1,3}\.\d{4,})/)
  if (atSign) return { lat: parseFloat(atSign[1]), lng: parseFloat(atSign[2]) }

  // 3. ?q=lat,lng
  const q = s.match(/[?&]q=(-?\d{1,3}\.\d+),(-?\d{1,3}\.\d+)/)
  if (q) return { lat: parseFloat(q[1]), lng: parseFloat(q[2]) }

  // 4. ll=lat,lng
  const ll = s.match(/[?&]ll=(-?\d{1,3}\.\d+),(-?\d{1,3}\.\d+)/)
  if (ll) return { lat: parseFloat(ll[1]), lng: parseFloat(ll[2]) }

  // 5. center=lat,lng
  const center = s.match(/center=(-?\d{1,3}\.\d+),(-?\d{1,3}\.\d+)/)
  if (center) return { lat: parseFloat(center[1]), lng: parseFloat(center[2]) }

  // 6. /lat,lng u URL-u
  const slash = s.match(/\/(-?\d{1,3}\.\d{4,}),(-?\d{1,3}\.\d{4,})/)
  if (slash) return { lat: parseFloat(slash[1]), lng: parseFloat(slash[2]) }

  return null
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url?.trim()) {
      return NextResponse.json({ error: 'empty_input' }, { status: 400 })
    }

    let workUrl = url.trim()

    // Skraćeni URL → server-side follow redirect
    if (/goo\.gl|maps\.app\.goo\.gl/i.test(workUrl)) {
      try {
        const r = await fetch(workUrl, {
          method: 'GET',
          redirect: 'follow',
          headers: { 'User-Agent': 'Mozilla/5.0' },
          signal: AbortSignal.timeout(8000),
        })
        workUrl = r.url
      } catch {
        // Ako redirect ne uspije, pokušaj parsirati originalni
        workUrl = url.trim()
      }
    }

    const coords = extractCoords(workUrl)
    if (!coords) {
      return NextResponse.json(
        { error: 'coords_not_found', tried_url: workUrl },
        { status: 400 }
      )
    }

    const { lat, lng } = coords

    // Validacija opsega
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json({ error: 'invalid_coords' }, { status: 400 })
    }

    // Reverse geocode — Nominatim
    let geoName = 'Lokacija'
    let region  = ''
    let country = 'Srbija'
    let address = ''

    try {
      const geo = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=sr`,
        {
          headers: { 'User-Agent': 'OutdoorBalkans/1.0 contact@outdoorbalkans.com' },
          signal: AbortSignal.timeout(6000),
        }
      ).then(r => r.json())

      const a = geo?.address ?? {}
      geoName = a.tourism || a.natural || a.water || a.leisure ||
                a.amenity || a.village || a.town || a.city ||
                a.county || 'Lokacija'
      region  = a.county || a.state_district || a.state || ''
      country = a.country || 'Srbija'
      address = [a.road, a.village || a.town || a.city].filter(Boolean).join(', ')
    } catch {
      // Nominatim timeout — vraćamo samo koordinate bez geocode
      geoName = `Lokacija (${lat.toFixed(4)}, ${lng.toFixed(4)})`
    }

    return NextResponse.json({ lat, lng, name: geoName, region, country, address })
  } catch (err) {
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
