import { NextRequest, NextResponse } from 'next/server'

// Routes that require a logged-in user session
const PROTECTED_PATHS = ['/account', '/orders']

// Routes that are always public
const PUBLIC_PATHS = [
  '/login', '/register',
  '/api/auth',
  '/api/payfast',
  '/api/courier-guy',
  '/enter', '/api/enter',
  '/studio',
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Always allow public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return NextResponse.next()

  // Protected routes require a user session
  if (PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    const session = req.cookies.get('bm_user_session')?.value
    if (!session) {
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\.png$|.*\\.jpg$|.*\\.webp$|.*\\.svg$|.*\\.ico$).*)'],
}
