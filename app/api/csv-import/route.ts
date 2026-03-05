import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/adminGuard'

function nameToSlug(name: string) {
  return name.toLowerCase()
    .replace(/[čć]/g, 'c').replace(/[šđ]/g, 's').replace(/ž/g, 'z')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export async function POST(request: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  const { locations } = await request.json()
  if (!Array.isArray(locations) || locations.length === 0)
    return NextResponse.json({ error: 'Nema lokacija' }, { status: 400 })

  const results = { success: 0, failed: 0, errors: [] as string[] }

  for (const loc of locations) {
    try {
      if (!loc.name || !loc.lat || !loc.lng) {
        results.failed++
        results.errors.push(`Nedostaju podaci: ${JSON.stringify(loc)}`)
        continue
      }

      const slug = nameToSlug(loc.name)

      const { error } = await supabase.from('locations').upsert({
        name: loc.name,
        slug,
        lat: parseFloat(loc.lat),
        lng: parseFloat(loc.lng),
        category_slug: loc.category_slug ?? null,
        country_slug: loc.country_slug ?? 'srbija',
        region: loc.region ?? null,
        short_description: loc.short_description ?? null,
        description: loc.description ?? null,
        is_published: loc.is_published ?? false,
      }, { onConflict: 'slug' })

      if (error) {
        results.failed++
        results.errors.push(`${loc.name}: ${error.message}`)
      } else {
        results.success++
      }
    } catch (e: any) {
      results.failed++
      results.errors.push(`${loc.name}: ${e.message}`)
    }
  }

  return NextResponse.json(results)
}
