import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get('proposal_id')
  if (!id) return NextResponse.json({ comments: [] })

  const { data } = await supabase
    .from('proposal_comments')
    .select('id, body, user_name, created_at')
    .eq('proposal_id', parseInt(id))
    .order('created_at', { ascending: true })
    .limit(50)

  return NextResponse.json({ comments: data ?? [] })
}

export async function POST(req: NextRequest) {
  const { proposal_id, body, user_name } = await req.json()

  if (!proposal_id || !body?.trim())
    return NextResponse.json({ error: 'Nedostaju podaci' }, { status: 400 })

  if (body.trim().length < 3 || body.trim().length > 500)
    return NextResponse.json({ error: 'Komentar 3-500 znakova' }, { status: 400 })

  const { data, error } = await supabase
    .from('proposal_comments')
    .insert({
      proposal_id,
      body:      body.trim(),
      user_name: user_name?.trim() || 'Anonimni ribolovac',
    })
    .select('id, body, user_name, created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ comment: data })
}
