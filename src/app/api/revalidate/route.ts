import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  const tag = req.nextUrl.searchParams.get('tag')

  if (secret !== process.env.REVALIDATION_KEY) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  if (!tag) {
    return NextResponse.json({ message: 'Missing tag param' }, { status: 400 })
  }

  revalidateTag(tag, 'max')

  return NextResponse.json({ revalidated: true, now: Date.now() })
}
