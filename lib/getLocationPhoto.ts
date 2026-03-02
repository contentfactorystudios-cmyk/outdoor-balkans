import { getCardPhoto, CAT_FALLBACK, KNOWN_PHOTOS } from './getCategoryPhoto'

export interface PhotoResult {
  url: string
  source: 'location' | 'wikipedia' | 'known' | 'category'
}

export async function getLocationPhoto(params: {
  imageUrl?: string | null
  locationName: string
  category: string
  lat?: number
  lng?: number
}): Promise<PhotoResult> {
  const { imageUrl, locationName, category } = params

  // 1. Vlastita slika lokacije u bazi
  if (imageUrl) return { url: imageUrl, source: 'location' }

  // 2. Provjereni offline cache
  const nameLower = locationName.toLowerCase()
    .replace('đ','dj').replace('š','s').replace('č','c').replace('ć','c').replace('ž','z')
  
  for (const [key, url] of Object.entries(KNOWN_PHOTOS)) {
    const keyWords = key.split('-')
    if (keyWords.some(w => w.length > 3 && nameLower.includes(w))) {
      return { url, source: 'known' }
    }
  }

  // 3. Category fallback — uvijek radi
  const catPhoto = CAT_FALLBACK[category] ?? CAT_FALLBACK['planinarenje']
  return { url: catPhoto, source: 'category' }
}
