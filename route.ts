import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  const tag = request.nextUrl.searchParams.get('tag')

  if (secret !== process.env.REVALIDATION_KEY) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  if (tag) {
    revalidateTag(tag)
    return NextResponse.json({ revalidated: true, now: Date.now() })
  }

  return NextResponse.json({ revalidated: false, now: Date.now() })
}
