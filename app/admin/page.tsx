import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { redirect } from 'next/navigation'
import AdminDashboard from './AdminDashboard'

export default async function AdminPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const [
    { data: countries  },
    { data: categories },
    { data: regions    },
    { data: locations  },
  ] = await Promise.all([
    supabase.from('countries').select('id, name, slug').eq('is_active', true).order('name'),
    supabase.from('categories').select('id, name, slug, icon').eq('is_active', true),
    supabase.from('regions').select('id, name, slug, country_id').order('name'),
    supabase.from('locations').select(`
      id, name, slug, is_published, is_featured,
      categories(name, slug, icon),
      countries(name, slug),
      regions(name)
    `).order('created_at', { ascending: false }),
  ])

  return (
    <AdminDashboard
      user={user}
      countries={countries   ?? []}
      categories={categories ?? []}
      regions={regions       ?? []}
      locations={locations   ?? []}
    />
  )
}
