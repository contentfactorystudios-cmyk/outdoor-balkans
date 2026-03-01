const FALLBACK: Record<string, string> = {
  ribolov:      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=900&q=80',
  lov:          'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=900&q=80',
  planinarenje: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=900&q=80',
  kampovanje:   'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?w=900&q=80',
  default:      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80',
}

const CATEGORY_QUERIES: Record<string, string> = {
  ribolov:      'fishing river lake nature',
  lov:          'hunting forest wildlife nature',
  planinarenje: 'hiking mountain trail',
  kampovanje:   'camping forest outdoor',
}

export async function getUnsplashPhoto(
  categorySlug: string,
  extraQuery?: string
): Promise<{ url: string; credit: string | null }> {
  const key = process.env.UNSPLASH_ACCESS_KEY

  if (!key) {
    return { url: FALLBACK[categorySlug] ?? FALLBACK.default, credit: null }
  }

  const baseQuery = CATEGORY_QUERIES[categorySlug] ?? 'nature outdoor balkan'
  const query     = extraQuery ? `${extraQuery} ${baseQuery}` : baseQuery

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
      {
        headers: { Authorization: `Client-ID ${key}` },
        next:    { revalidate: 86400 },
      }
    )
    if (!res.ok) throw new Error(`Unsplash ${res.status}`)
    const data   = await res.json()
    const photos = data.results ?? []
    if (!photos.length) return { url: FALLBACK[categorySlug] ?? FALLBACK.default, credit: null }
    const photo = photos[Math.floor(Math.random() * Math.min(photos.length, 5))]
    return { url: photo.urls.regular, credit: `${photo.user.name} / Unsplash` }
  } catch {
    return { url: FALLBACK[categorySlug] ?? FALLBACK.default, credit: null }
  }
}
