import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

function nameToSlug(name: string) {
  return name.toLowerCase()
    .replace(/[čć]/g, 'c').replace(/[šđ]/g, 's').replace(/ž/g, 'z')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export async function POST(request: NextRequest) {
  const { locations } = await request.json()
  if (!Array.isArray(locations) || locations.length === 0)
    return NextResponse.json({ error: 'Nema lokacija' }, { status: 400 })

  const results = { success: 0, failed: 0, errors: [] as string[] }

  for (const loc of locations) {
    try {
      if (!loc.name || !loc.lat || !loc.lng) {
        results.failed++
        results.errors.push(`${loc.name ?? '?'}: Nedostaju name, lat ili lng`)
        continue
      }
      const lat = parseFloat(loc.lat)
      const lng = parseFloat(loc.lng)
      if (isNaN(lat) || isNaN(lng)) {
        results.failed++
        results.errors.push(`${loc.name}: Nevažeće koordinate`)
        continue
      }
      const { data: countryData } = await supabase.from('countries').select('id').eq('slug', loc.country_slug ?? 'srbija').single()
      const { data: categoryData } = await supabase.from('categories').select('id').eq('slug', loc.category_slug ?? 'ribolov').single()
      if (!countryData || !categoryData) {
        results.failed++
        results.errors.push(`${loc.name}: Nevažeća država ili kategorija`)
        continue
      }
      let regionId = null
      if (loc.region_name) {
        const { data: rd } = await supabase.from('regions').select('id').eq('country_id', countryData.id).ilike('name', `%${loc.region_name}%`).single()
        regionId = rd?.id ?? null
      }
      const slug = loc.slug || nameToSlug(loc.name)
      const { error } = await supabase.rpc('insert_location_with_coords', {
        p_name: loc.name, p_slug: slug,
        p_short_description: loc.short_description || `${loc.name} — outdoor lokacija`,
        p_description: loc.description || loc.short_description || '',
        p_country_id: countryData.id, p_region_id: regionId, p_category_id: categoryData.id,
        p_lng: lng, p_lat: lat,
        p_meta_title: loc.meta_title || `${loc.name} | OutdoorBalkans`,
        p_meta_description: loc.meta_description || loc.short_description || '',
        p_best_season: loc.best_season || null,
        p_permit_required: loc.permit_required === 'true' || loc.permit_required === true,
        p_permit_info: loc.permit_info || null,
        p_access_notes: loc.access_notes || null,
        p_is_published: loc.is_published !== 'false',
      })
      if (error) {
        if (error.code === '23505') {
          await supabase.rpc('insert_location_with_coords', {
            p_name: loc.name, p_slug: `${slug}-${Date.now()}`,
            p_short_description: loc.short_description || '', p_description: loc.description || '',
            p_country_id: countryData.id, p_region_id: regionId, p_category_id: categoryData.id,
            p_lng: lng, p_lat: lat,
            p_meta_title: `${loc.name} | OutdoorBalkans`, p_meta_description: '',
            p_best_season: null, p_permit_required: false, p_permit_info: null, p_access_notes: null, p_is_published: true,
          })
        } else throw error
      }
      results.success++
    } catch (err: any) {
      results.failed++
      results.errors.push(`${loc.name ?? '?'}: ${err.message}`)
    }
  }
  return NextResponse.json(results)
}
