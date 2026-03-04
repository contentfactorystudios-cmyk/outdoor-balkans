import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { url } = await req.json()
  let finalUrl = url

  // Skraćeni URL — follow redirect server-side
  if (/goo\.gl|maps\.app\.goo\.gl/i.test(url)) {
    try {
      const r = await fetch(url, { method:'HEAD', redirect:'follow' })
      finalUrl = r.url
    } catch {
      return NextResponse.json({ error: 'short_url_failed' }, { status: 400 })
    }
  }

  // Parsiranje koordinata
  const patterns = [
    /@(-?\d{1,3}\.\d{4,}),(-?\d{1,3}\.\d{4,})/,
    /[?&]q=(-?\d{1,3}\.\d+),(-?\d{1,3}\.\d+)/,
    /[?&]ll=(-?\d{1,3}\.\d+),(-?\d{1,3}\.\d+)/,
    /\/(-?\d{1,3}\.\d{4,}),(-?\d{1,3}\.\d{4,})/,
  ]
  let lat: number | null = null
  let lng: number | null = null
  for (const p of patterns) {
    const m = finalUrl.match(p)
    if (m) { lat = parseFloat(m[1]); lng = parseFloat(m[2]); break }
  }
  if (!lat || !lng) return NextResponse.json({ error: 'coords_not_found' }, { status: 400 })

  // Reverse geocode — Nominatim (besplatno, OpenStreetMap)
  const geo = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=sr`,
    { headers: { 'User-Agent': 'OutdoorBalkans/1.0 contact@outdoorbalkans.com' } }
  ).then(r => r.json()).catch(() => null)

  const address = geo?.address ?? {}
  return NextResponse.json({
    lat, lng,
    name: address.tourism || address.natural || address.water ||
          address.leisure || address.amenity ||
          address.village || address.town || address.city ||
          address.county || 'Lokacija',
    region: address.county || address.state_district || address.state || '',
    country: address.country || 'Srbija',
    address: [address.road, address.village || address.town || address.city]
              .filter(Boolean).join(', '),
    display_name: geo?.display_name || '',
  })
}
