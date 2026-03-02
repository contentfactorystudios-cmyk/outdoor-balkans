import ActivityCalendar from '@/components/ActivityCalendar'
import { supabase } from '@/lib/supabase'

export const metadata = {
  title: 'Kalendar Aktivnosti & Vesti | OutdoorBalkans',
  description: 'Outdoor eventi, sezone i aktivnosti na Balkanu'
}

export default async function VjestiPage() {
  const { data: locations } = await supabase
    .from('locations')
    .select('id,name,slug,categories(name,slug,icon),regions(name),countries(slug)')
    .eq('is_published', true)
    .limit(100)

  return <ActivityCalendar locations={locations ?? []} />
}
