import { NextRequest, NextResponse } from 'next/server'
import { getLocations } from '@/lib/queries'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const country_slug  = searchParams.get('country')  ?? undefined
  const category_slug = searchParams.get('category') ?? undefined
  const limit         = parseInt(searchParams.get('limit') ?? '50')

  try {
    const locations = await getLocations({ country_slug, category_slug, limit })
    return NextResponse.json({ locations })
  } catch (error) {
    console.error('[API] Greška pri dohvatanju lokacija:', error)
    return NextResponse.json({ error: 'Greška servera' }, { status: 500 })
  }
}
