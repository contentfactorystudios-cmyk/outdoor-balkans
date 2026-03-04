import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category  = searchParams.get('category')
  const from_date = searchParams.get('from') ?? new Date().toISOString().split('T')[0]

  let query = supabase.from('events')
    .select('id,title,description,category,event_date,location_name,link')
    .eq('is_approved', true)
    .gte('event_date', from_date)
    .order('event_date', { ascending: true })
    .limit(50)

  if (category) query = query.eq('category', category)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ events: data ?? [] })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { title, category, event_date, location_name, description, contact, link } = body

  if (!title?.trim() || !event_date || !category)
    return NextResponse.json({ error: 'Naziv, kategorija i datum su obavezni' }, { status: 400 })

  const { data, error } = await supabase.from('events').insert({
    title: title.trim(), category, event_date,
    location_name: location_name?.trim() || null,
    description: description?.trim() || null,
    contact: contact?.trim() || null,
    link: link?.trim() || null,
    is_approved: false,
  }).select('id').single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, id: data.id })
}
