import { NextResponse } from 'next/server'

// Samo provereni, aktivni sajtovi koji postoje
const FALLBACK = [
  {
    title: 'Ribolovski savez Srbije — Dozvole i propisi 2025',
    link: 'https://www.ribolovackisavez.org.rs',
    description: 'Zvanični sajt Ribolovačkog saveza Srbije. Informacije o dozvolama, propisima i ribolovnim revijama za 2025. godinu.',
    pubDate: new Date().toISOString(),
    source: 'Ribolovački savez Srbije',
    category: '🎣 Ribolov',
  },
  {
    title: 'Nacionalni park Tara — Kampovanje i posete',
    link: 'https://www.nptara.rs',
    description: 'Zvanični sajt NP Tara. Kampovi, staze, smeštaj i sve informacije za posetioce nacionalnog parka.',
    pubDate: new Date(Date.now() - 86400000).toISOString(),
    source: 'NP Tara',
    category: '⛺ Kampovanje',
  },
  {
    title: 'Planinarski savez Srbije — Staze i izveštaji',
    link: 'https://www.pss.rs',
    description: 'Planinarski savez Srbije — markirane staze, izveštaji sa terena, sigurnost i planinarsko vodstvo.',
    pubDate: new Date(Date.now() - 172800000).toISOString(),
    source: 'Planinarski savez Srbije',
    category: '🥾 Planinarenje',
  },
  {
    title: 'Lovački savez Srbije — Sezona i propisi',
    link: 'https://www.lss.org.rs',
    description: 'Lovački savez Srbije — kalendar sezone, propisi, lovačke dozvole i upravljanje lovištima.',
    pubDate: new Date(Date.now() - 259200000).toISOString(),
    source: 'Lovački savez Srbije',
    category: '🦌 Lov',
  },
  {
    title: 'NP Đerdap — Klisura, Lepenski vir, Golubački grad',
    link: 'https://www.npdjerdap.rs',
    description: 'Nacionalni park Đerdap — turistički vodič, ulaznice, staze i informacije o prirodnim i kulturnim vrednostima.',
    pubDate: new Date(Date.now() - 345600000).toISOString(),
    source: 'NP Đerdap',
    category: '🦋 Nacionalni parkovi',
  },
  {
    title: 'Rafting Bajina Bašta — Drina avantura',
    link: 'https://www.bajinabasta.rs',
    description: 'Turistička organizacija Bajina Bašta — rafting na Drini, kampovanje i outdoor aktivnosti uz Drinu.',
    pubDate: new Date(Date.now() - 432000000).toISOString(),
    source: 'TO Bajina Bašta',
    category: '🚣 Kajak',
  },
  {
    title: 'Zlatibor — Planinarenje, kampovanje i outdoor',
    link: 'https://www.zlatibor.rs',
    description: 'Turistička organizacija Zlatibor — planinarenje, biciklizam, kampovanje i sve outdoor aktivnosti.',
    pubDate: new Date(Date.now() - 518400000).toISOString(),
    source: 'TO Zlatibor',
    category: '🥾 Planinarenje',
  },
  {
    title: 'Srbija — Outdoor turizam i priroda',
    link: 'https://www.srbija.travel',
    description: 'Zvanični turistički portal Srbije — sve informacije za outdoor turizam, nacionalni parkovi i prirodne atrakcije.',
    pubDate: new Date(Date.now() - 604800000).toISOString(),
    source: 'Turistička organizacija Srbije',
    category: '🦋 Nacionalni parkovi',
  },
]

export async function GET() {
  return NextResponse.json(FALLBACK, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
    }
  })
}
