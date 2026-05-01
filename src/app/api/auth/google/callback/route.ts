import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { signToken, SESSION_COOKIE, COOKIE_OPTS } from '@/lib/auth'

export const runtime = 'nodejs'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'c1o4kw27',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const base = () => process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code) {
    return NextResponse.redirect(`${base()}/login?error=cancelled`)
  }

  // Exchange code for access token
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

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${base()}/login?error=auth_failed`)
  }

  const { access_token } = await tokenRes.json()

  // Get Google user profile
  const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${access_token}` },
  })

  if (!profileRes.ok) {
    return NextResponse.redirect(`${base()}/login?error=auth_failed`)
  }

  const profile: { id: string; email: string; given_name: string; family_name: string } =
    await profileRes.json()

  // Find or create user in Sanity
  let user = await client.fetch(
    `*[_type == "user" && email == $email][0]{ _id, email, firstName, lastName }`,
    { email: profile.email }
  )

  if (!user) {
    const created = await client.create({
      _type: 'user',
      email: profile.email,
      firstName: profile.given_name || '',
      lastName: profile.family_name || '',
      googleId: profile.id,
    })
    user = {
      _id: created._id,
      email: profile.email,
      firstName: profile.given_name || '',
      lastName: profile.family_name || '',
    }
  }

  const token = await signToken({
    userId: user._id,
    email: user.email,
    firstName: user.firstName || profile.given_name || '',
    lastName: user.lastName || profile.family_name || '',
  })

  const res = NextResponse.redirect(`${base()}/account`)
  res.cookies.set(SESSION_COOKIE, token, COOKIE_OPTS)
  return res
}
