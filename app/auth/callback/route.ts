import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  const url    = new URL(request.url)
  const code   = url.searchParams.get('code')
  const next   = url.searchParams.get('next') ?? '/'
  const origin = url.origin

  if (!code) {
    return NextResponse.redirect(`${origin}${next}`)
  }

  // KLJUČNO: koristimo response objekat da cookies budu u Set-Cookie headeru
  const response = NextResponse.redirect(`${origin}${next}`)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Postavi cookies direktno na response koji se vraća browseru
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[auth/callback] greška:', error.message)
    return NextResponse.redirect(`${origin}/prijava?error=auth`)
  }

  return response
}
