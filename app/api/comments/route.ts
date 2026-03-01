import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function getSupabase() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cs) => cs.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    }
  )
}

export async function GET(request: NextRequest) {
  const locationId = new URL(request.url).searchParams.get('location_id')
  if (!locationId) return NextResponse.json({ comments: [] })

  const supabase = await getSupabase()
  const { data, error } = await supabase
    .from('comments')
    .select('id, body, user_name, user_email, created_at')
    .eq('location_id', parseInt(locationId))
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ comments: data ?? [] })
}

export async function POST(request: NextRequest) {
  const supabase  = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Nisi prijavljen' }, { status: 401 })

  const { location_id, body } = await request.json()
  if (!location_id || !body?.trim()) {
    return NextResponse.json({ error: 'Nedostaju podaci' }, { status: 400 })
  }
  if (body.trim().length < 3 || body.trim().length > 1000) {
    return NextResponse.json({ error: 'Komentar mora biti 3-1000 znakova' }, { status: 400 })
  }

  const userName = user.user_metadata?.full_name
    || user.email?.split('@')[0]
    || 'Korisnik'

  const { data, error } = await supabase
    .from('comments')
    .insert({ location_id, user_id: user.id, user_email: user.email!, user_name: userName, body: body.trim() })
    .select('id, body, user_name, created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ comment: data })
}

export async function DELETE(request: NextRequest) {
  const supabase = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nisi prijavljen' }, { status: 401 })

  const id = new URL(request.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID je obavezan' }, { status: 400 })

  const { error } = await supabase.from('comments').delete().eq('id', parseInt(id)).eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
