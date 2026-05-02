import { NextRequest, NextResponse } from 'next/server'
import { signToken, SESSION_COOKIE, COOKIE_OPTS } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'

const base = () => process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code) return NextResponse.redirect(`${base()}/login?error=cancelled`)

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${base()}/api/auth/google/callback`,
      grant_type: 'authorization_code',
    }),
  })

  if (!tokenRes.ok) return NextResponse.redirect(`${base()}/login?error=auth_failed`)

  const { access_token } = await tokenRes.json()

  const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${access_token}` },
  })

  if (!profileRes.ok) return NextResponse.redirect(`${base()}/login?error=auth_failed`)

  const profile: { id: string; email: string; given_name: string; family_name: string } =
    await profileRes.json()

  let { data: user } = await supabase
    .from('profiles')
    .select('id, email, first_name, last_name')
    .eq('email', profile.email)
    .single()

  if (!user) {
    const { data: created } = await supabase
      .from('profiles')
      .insert({
        email: profile.email,
        first_name: profile.given_name || '',
        last_name: profile.family_name || '',
        google_id: profile.id,
      })
      .select('id, email, first_name, last_name')
      .single()
    user = created
  }

  if (!user) return NextResponse.redirect(`${base()}/login?error=auth_failed`)

  const token = await signToken({
    userId: user.id,
    email: user.email,
    firstName: user.first_name || profile.given_name || '',
    lastName: user.last_name || profile.family_name || '',
  })

  const res = NextResponse.redirect(`${base()}/account`)
  res.cookies.set(SESSION_COOKIE, token, COOKIE_OPTS)
  return res
}
