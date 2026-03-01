import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()
  if (!q || q.length < 2) return NextResponse.json({ results: [] })

  const safe = q.replace(/[%_\\]/g, '\\$&')
  const { data, error } = await supabase
    .from('locations')
    .select(`
      id, name, slug, short_description, image_url, permit_required, best_season,
      categories(name, slug, icon, color),
      countries(name, slug),
      regions(name)
    `)
    .eq('is_published', true)
    .or(`name.ilike.%${safe}%,short_description.ilike.%${safe}%`)
    .order('is_featured', { ascending: false })
    .limit(20)

  if (error) return NextResponse.json({ results: [], error: error.message }, { status: 500 })
  return NextResponse.json({ results: data ?? [] })
}
