import { createBrowserClient } from '@supabase/ssr'

// createBrowserClient automatski čuva sesiju u cookies
// tako da proxy.ts može da je pročita server-side
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
