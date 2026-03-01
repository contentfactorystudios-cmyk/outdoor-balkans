import { supabase } from '@/lib/supabase'
import type { MetadataRoute } from 'next'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: locations } = await supabase
    .from('locations')
    .select('slug, updated_at, categories(slug), countries(slug)')
    .eq('is_published', true)

  const locationUrls = (locations ?? []).map((loc: any) => ({
    url:             `https://outdoorbalkans.com/${loc.countries.slug}/${loc.categories.slug}/${loc.slug}`,
    lastModified:    new Date(loc.updated_at),
    changeFrequency: 'monthly' as const,
    priority:        0.8,
  }))

  return [
    {
      url:             'https://outdoorbalkans.com',
      lastModified:    new Date(),
      changeFrequency: 'weekly',
      priority:        1.0,
    },
    {
      url:             'https://outdoorbalkans.com/srbija/ribolov',
      lastModified:    new Date(),
      changeFrequency: 'weekly',
      priority:        0.9,
    },
    {
      url:             'https://outdoorbalkans.com/srbija/lov',
      lastModified:    new Date(),
      changeFrequency: 'weekly',
      priority:        0.9,
    },
    {
      url:             'https://outdoorbalkans.com/hrvatska/ribolov',
      lastModified:    new Date(),
      changeFrequency: 'weekly',
      priority:        0.9,
    },
    ...locationUrls,
  ]
}
