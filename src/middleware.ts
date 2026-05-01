import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = [
  '/enter', '/api/enter',
  '/api/payfast/notify', '/api/payfast/debug',
  '/login', '/register',
  '/api/auth',
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return NextResponse.next()

  const auth = req.cookies.get('bm_site_auth')?.value
  if (auth === '1') return NextResponse.next()

  // Users logged in with a real account bypass the site password
  const session = req.cookies.get('bm_user_session')?.value
  if (session) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = '/enter'
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\.png$|.*\\.jpg$|.*\\.webp$|.*\\.svg$|.*\\.ico$).*)'],
}
