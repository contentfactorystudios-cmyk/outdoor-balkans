import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { requireAdmin } from '@/lib/adminGuard'


const CATEGORY_SCHEMAS: Record<string, object> = {
  ribolov: {
    vrste_ribe: ["saran, som, stuka"],
    tip_vode: "reka / jezero / kanal / akumulacija",
    tehnika: ["feeder, spinning, muholov"],
    prosecna_dubina_m: 0,
    dozvola_tip: "godisnja / dnevna / bez dozvole",
    dozvola_cena_rsd: 0,
    dozvola_kontakt: "naziv udruzenja ili null",
    pristup_vozilom: true,
    ugostiteljstvo_blizina: true,
    rekordni_ulov: "npr. som 87kg ili null"
  },
  lov: {
    divljac: ["zec, fazan, divlja svinja"],
    tip_terena: "ravnica / suma / planina / mesovito",
    sezona_od: "npr. 1. oktobar",
    sezona_do: "npr. 31. januar",
    lovcko_udruzenje: "naziv ili null",
    dozvola_tip: "godisnja / dnevna / komercijalni lov",
    dozvola_cena_rsd: 0,
    pristup_vozilom: true,
    smestaj_blizina: true
  },
  planinarenje: {
    duzina_km: 0,
    visinska_razlika_m: 0,
    tezina: "laka / srednja / teska / ekstremna",
    tip_staze: "kruzna / linearna",
    markacije: true,
    voda_na_stazi: true,
    preporucena_oprema: ["planinarske cipele, stapovi"],
    pogled: "opis pogleda sa vrha ili null",
    najvisa_tacka_mnm: 0
  },
  kajak: {
    duzina_rute_km: 0,
    tezina_brzaka: "mirna voda / WW1 / WW2 / WW3+",
    tip_vode: "reka / jezero / akumulacija",
    trajanje_h: 0,
    iznajmljivanje_opreme: true,
    vodic_obavezan: false,
    pristaniste: "opis ili null"
  },
  kampovanje: {
    tip_kampa: "divlji kamp / udredjen kamp / glamping",
    kapacitet_mesta: 0,
    struja: false,
    voda: true,
    wc: false,
    cena_po_noci_rsd: 0,
    rezervacija: "potrebna / nije potrebna",
    dozvoljena_vatra: true,
    blizina_prodavnice_km: 0
  },
  "nacionalni-parkovi": {
    povrsina_ha: 0,
    osnovne_aktivnosti: ["pesacenje, posmatranje ptica"],
    ulaznica_rsd: 0,
    radno_vreme: "08-20h ili bez ogranicenja",
    visitor_centar: true,
    endemske_vrste: ["orao krtas, vidra"],
    UNESCO: false,
    parking: true
  }
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  console.log('[DEBUG] API key prefix:', apiKey?.substring(0, 20), 'length:', apiKey?.length)
  const client = new Anthropic({ apiKey })
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  const { name, category, country, region } = await request.json()
  if (!name) return NextResponse.json({ error: 'Naziv je obavezan' }, { status: 400 })

  const schema = CATEGORY_SCHEMAS[category] ?? {}
  const schemaStr = JSON.stringify(schema, null, 2)

  const prompt = `Ti si strucnjak za outdoor aktivnosti na Balkanu sa detaljnim poznavanjem terena u Srbiji.

Lokacija: ${name}
Aktivnost: ${category}
Drzava: ${country}
Region: ${region}

Generiši ISKLJUCIVO jedan JSON objekat (bez teksta pre ili posle):
{
  "short_description": "Kratki opis 1-2 recenice max 180 znakova",
  "description": "Detaljan opis 3-5 recenica, budi konkretan o lokaciji",
  "meta_title": "SEO naslov max 60 znakova",
  "meta_description": "SEO opis max 155 znakova",
  "best_season": "Preporucena sezona npr April - Oktobar",
  "permit_required": true,
  "permit_info": "Konkretne informacije o dozvolama ili null",
  "category_data": ${schemaStr}
}

Popuni category_data sa realnim konkretnim podacima za ovu lokaciju.
Za numericke vrednosti upiši realnu procenu, ne ostavljaj 0 ako znas vrednost.
Pisi na srpskom jeziku, latinicnim pismom.`

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    })
    const text = message.content.filter((b: any) => b.type === 'text').map((b: any) => b.text).join('')
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('AI nije vratio validan JSON')
    const generated = JSON.parse(jsonMatch[0])
    return NextResponse.json({ success: true, data: generated })
  } catch (error: any) {
    console.error('[AI Generate]', error)
    return NextResponse.json({ error: error.message ?? 'Greska' }, { status: 500 })
  }
}
