import { NextRequest, NextResponse } from 'next/server'
import { getNearbyLocations } from '@/lib/queries'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const lat         = parseFloat(searchParams.get('lat')      ?? '0')
  const lng         = parseFloat(searchParams.get('lng')      ?? '0')
  const radius_km   = parseFloat(searchParams.get('radius')   ?? '50')
  const category_slug = searchParams.get('category') ?? undefined
  const country_slug  = searchParams.get('country')  ?? undefined

  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'lat i lng su obavezni parametri' },
      { status: 400 }
    )
  }

  try {
    const locations = await getNearbyLocations({
      lat, lng, radius_km, category_slug, country_slug,
    })
    return NextResponse.json({ locations })
  } catch (error) {
    console.error('[API] Greška geo upita:', error)
    return NextResponse.json({ error: 'Greška servera' }, { status: 500 })
  }
}
