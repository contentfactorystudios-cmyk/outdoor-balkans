/**
 * Brza verzija za category page — ne čekaj API, koristi cached rezultate
 * Za server components koji renduju 20+ kartica odjednom
 */

export const CAT_FALLBACK: Record<string, string> = {
  ribolov:             'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop&q=80',
  lov:                 'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=600&h=400&fit=crop&q=80',
  kajak:               'https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?w=600&h=400&fit=crop&q=80',
  kampovanje:          'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&h=400&fit=crop&q=80',
  planinarenje:        'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop&q=80',
  'nacionalni-parkovi':'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop&q=80',
  rezervati:           'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop&q=80',
}

// Poznate lokacije sa Wikipedia slikama — offline cache
// Proširuj ovu listu tokom vremena
export const KNOWN_PHOTOS: Record<string, string> = {
  'vlasina-jezero':         'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Vlasina_lake.jpg/1200px-Vlasina_lake.jpg',
  'vlasina-jezero-ribolov': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Vlasina_lake.jpg/1200px-Vlasina_lake.jpg',
  'tara':                   'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/NP_Tara_-_kanjon_reke_Drine.jpg/1200px-NP_Tara_-_kanjon_reke_Drine.jpg',
  'kopaonik':               'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Kopaonik_Nacionalni_Park.jpg/1200px-Kopaonik_Nacionalni_Park.jpg',
  'derdap':                 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Golubac_Fortress_-_2022.jpg/1200px-Golubac_Fortress_-_2022.jpg',
  'zasavica':               'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Zasavica_river.JPG/1200px-Zasavica_river.JPG',
  'zlatibor':               'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Zlatibor_panorama.jpg/1200px-Zlatibor_panorama.jpg',
  'rtanj':                  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Rtanj.jpg/1200px-Rtanj.jpg',
  'fruska-gora':            'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Fruška_gora.jpg/1200px-Fruška_gora.jpg',
}

export function getCardPhoto(slug: string, imageUrl: string | null, category: string): string {
  if (imageUrl) return imageUrl

  // Poznate lokacije
  const knownKey = Object.keys(KNOWN_PHOTOS).find(k => slug.includes(k) || k.includes(slug.split('-')[0]))
  if (knownKey) return KNOWN_PHOTOS[knownKey]

  // Category fallback
  return CAT_FALLBACK[category] ?? CAT_FALLBACK['planinarenje']
}
