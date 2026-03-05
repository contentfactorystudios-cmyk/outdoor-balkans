import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { requireAdmin } from '@/lib/adminGuard'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  const { name, category, country, region } = await request.json()
  if (!name) return NextResponse.json({ error: 'Naziv je obavezan' }, { status: 400 })

  const catMap: Record<string, string> = { ribolov: 'ribolov (fishing)', lov: 'lov (hunting)' }
  const prompt = `Ti si stručnjak za outdoor aktivnosti na Balkanu.
Na osnovu sledećih informacija generiši sadržaj za outdoor direktorijum.
Lokacija: ${name}
Aktivnost: ${catMap[category] ?? category}
Država: ${country}
Region: ${region}
Generiši ISKLJUČIVO JSON objekat (bez teksta pre ili posle):
{
  "short_description": "Kratki opis 1-2 rečenice max 180 znakova za karticu",
  "description": "Detaljan opis 3-5 rečenica za stranicu lokacije",
  "meta_title": "SEO naslov max 60 znakova",
  "meta_description": "SEO opis max 155 znakova",
  "best_season": "Preporučena sezona npr April — Oktobar",
  "permit_required": true ili false,
  "permit_info": "Info o dozvolama ili null"
}
Piši na srpskom, latiničnim pismom.`

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-5', max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })
    const text = message.content.filter(b => b.type === 'text').map(b => (b as any).text).join('')
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('AI nije vratio validan JSON')
    const generated = JSON.parse(jsonMatch[0])
    return NextResponse.json({ success: true, data: generated })
  } catch (error: any) {
    console.error('[AI Generate]', error)
    return NextResponse.json({ error: error.message ?? 'Greška' }, { status: 500 })
  }
}
