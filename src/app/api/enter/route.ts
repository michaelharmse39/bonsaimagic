import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (password === process.env.SITE_PASSWORD) {
    const res = NextResponse.json({ ok: true })
    res.cookies.set('bm_site_auth', '1', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })
    return res
  }

  return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
}
