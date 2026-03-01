import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const path   = searchParams.get('path') ?? '/'

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Neovlašćen pristup' }, { status: 401 })
  }

  revalidatePath(path)
  return NextResponse.json({ revalidated: true, path, time: new Date().toISOString() })
}
