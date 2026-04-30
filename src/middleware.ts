import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/enter', '/api/enter', '/api/payfast/notify']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return NextResponse.next()

  const auth = req.cookies.get('bm_site_auth')?.value
  if (auth === '1') return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = '/enter'
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\.png$|.*\\.jpg$|.*\\.webp$|.*\\.svg$|.*\\.ico$).*)'],
}
