import { supabase } from './supabase'

export function extractCoordinates(
  coordinates: any
): { lat: number; lng: number } | null {
  if (!coordinates) return null
  try {
    if (typeof coordinates === 'object' && coordinates.coordinates) {
      const [lng, lat] = coordinates.coordinates
      if (isValidCoord(lat, lng)) return { lat, lng }
    }
    if (typeof coordinates === 'string') {
      if (/^[0-9a-fA-F]{42,}$/.test(coordinates.trim())) {
        const result = parseWKBHex(coordinates.trim())
        if (result) return result
      }
      try {
        const parsed = JSON.parse(coordinates)
        if (parsed.coordinates) {
          const [lng, lat] = parsed.coordinates
          if (isValidCoord(lat, lng)) return { lat, lng }
        }
      } catch { }
      const m = coordinates.match(/POINT\(([+-]?\d+\.?\d*)\s+([+-]?\d+\.?\d*)\)/i)
      if (m) {
        const lng = parseFloat(m[1])
        const lat = parseFloat(m[2])
        if (isValidCoord(lat, lng)) return { lat, lng }
      }
    }
    if (typeof coordinates === 'object') {
      const lat = coordinates.lat_out ?? coordinates.lat
      const lng = coordinates.lng_out ?? coordinates.lng
      if (lat != null && lng != null && isValidCoord(lat, lng)) return { lat, lng }
    }
    return null
  } catch { return null }
}

function parseWKBHex(hex: string): { lat: number; lng: number } | null {
  try {
    const bytes: number[] = []
    for (let i = 0; i < hex.length; i += 2) {
      bytes.push(parseInt(hex.substring(i, i + 2), 16))
    }
    const littleEndian = bytes[0] === 1
    const readDouble = (offset: number): number => {
      const buf = new ArrayBuffer(8)
      const view = new DataView(buf)
      for (let i = 0; i < 8; i++) view.setUint8(i, bytes[offset + i])
      return view.getFloat64(0, littleEndian)
    }
    const readUInt32 = (offset: number): number => {
      const buf = new ArrayBuffer(4)
      const view = new DataView(buf)
      for (let i = 0; i < 4; i++) view.setUint8(i, bytes[offset + i])
      return view.getUint32(0, littleEndian)
    }
    let offset = 1
    const geomType = readUInt32(offset)
    offset += 4
    if (geomType & 0x20000000) offset += 4
    const lng = readDouble(offset)
    const lat = readDouble(offset + 8)
    if (isValidCoord(lat, lng)) return { lat, lng }
    return null
  } catch { return null }
}

function isValidCoord(lat: number, lng: number): boolean {
  return typeof lat === 'number' && typeof lng === 'number' &&
    !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}

export async function getLocations({
  country_slug, category_slug, limit = 50,
}: { country_slug?: string; category_slug?: string; limit?: number } = {}) {
  let country_id: number | undefined
  let category_id: number | undefined
  if (country_slug) {
    const { data } = await supabase.from('countries').select('id').eq('slug', country_slug).single()
    country_id = data?.id
  }
  if (category_slug) {
    const { data } = await supabase.from('categories').select('id').eq('slug', category_slug).single()
    category_id = data?.id
  }
  let query = supabase.from('locations').select(`
    id, name, slug, short_description, is_featured, is_premium,
    image_url, best_season, permit_required, coordinates,
    categories(name, slug, color, icon),
    countries(name, slug),
    regions(name)
  `).eq('is_published', true).limit(limit).order('is_featured', { ascending: false })
  if (country_id)  query = (query as any).eq('country_id',  country_id)
  if (category_id) query = (query as any).eq('category_id', category_id)
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getLocationBySlug(
  country_slug: string, category_slug: string, location_slug: string
) {
  const { data: countryData } = await supabase
    .from('countries').select('id').eq('slug', country_slug).single()
  const { data: categoryData } = await supabase
    .from('categories').select('id').eq('slug', category_slug).single()
  if (!countryData || !categoryData) return null
  const { data, error } = await supabase.from('locations').select(`
    *, categories(name, slug, color, icon),
    countries(name, slug, code), regions(name, slug),
    location_tags(tags(name, slug))
  `).eq('slug', location_slug).eq('country_id', countryData.id)
   .eq('category_id', categoryData.id).eq('is_published', true).single()
  if (error) throw error
  return data
}

export async function getNearbyLocations({
  lat, lng, radius_km = 50, category_slug, country_slug,
}: { lat: number; lng: number; radius_km?: number; category_slug?: string; country_slug?: string }) {
  const { data, error } = await supabase.rpc('get_locations_near', {
    lat, lng, radius_km, cat_slug: category_slug ?? null,
    country_slug: country_slug ?? null, lim: 20,
  })
  if (error) throw error
  return data ?? []
}

export async function getCountries() {
  const { data, error } = await supabase.from('countries').select('*').eq('is_active', true).order('name')
  if (error) throw error
  return data ?? []
}

export async function getCategories(phase = 1) {
  const { data, error } = await supabase.from('categories').select('*').eq('is_active', true).lte('phase', phase).order('name')
  if (error) throw error
  return data ?? []
}
