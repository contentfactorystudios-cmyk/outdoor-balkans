import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const VALID_EMOJIS = ['🎣','🦌','⭐','👍']

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
  if (!locationId) return NextResponse.json({ counts: {}, userReactions: [] })

  const supabase = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: counts } = await supabase
    .from('location_reaction_counts')
    .select('emoji, count')
    .eq('location_id', parseInt(locationId))

  let userReactions: string[] = []
  if (user) {
    const { data } = await supabase
      .from('reactions')
      .select('emoji')
      .eq('location_id', parseInt(locationId))
      .eq('user_id', user.id)
    userReactions = data?.map(r => r.emoji) ?? []
  }

  const countsMap: Record<string, number> = {}
  counts?.forEach(r => { countsMap[r.emoji] = Number(r.count) })

  return NextResponse.json({ counts: countsMap, userReactions })
}

export async function POST(request: NextRequest) {
  const supabase = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nisi prijavljen' }, { status: 401 })

  const { location_id, emoji } = await request.json()
  if (!location_id || !VALID_EMOJIS.includes(emoji)) {
    return NextResponse.json({ error: 'Nevažeći podaci' }, { status: 400 })
  }

  // Toggle — ako postoji obriši, ako ne postoji dodaj
  const { data: existing } = await supabase
    .from('reactions')
    .select('id')
    .eq('location_id', location_id)
    .eq('user_id', user.id)
    .eq('emoji', emoji)
    .single()

  if (existing) {
    await supabase.from('reactions').delete().eq('id', existing.id)
    return NextResponse.json({ action: 'removed' })
  } else {
    await supabase.from('reactions').insert({ location_id, user_id: user.id, emoji })
    return NextResponse.json({ action: 'added' })
  }
}
