import ActivityCalendar from '@/components/ActivityCalendar'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kalendar Aktivnosti | OutdoorBalkans',
  description: 'Outdoor eventi, sezone i aktivnosti na Balkanu',
}

export default async function KalendarPage() {
  const { data: locations } = await supabase
    .from('locations')
    .select('id,name,slug,categories(name,slug,icon),regions(name),countries(slug)')
    .eq('is_published', true)
    .limit(100)

  return <ActivityCalendar locations={locations ?? []} addEventLink='/dodaj-dogadjaj' />
}
