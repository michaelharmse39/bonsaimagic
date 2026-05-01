import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { verifyPassword, signToken, SESSION_COOKIE, COOKIE_OPTS } from '@/lib/auth'

export const runtime = 'nodejs'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'c1o4kw27',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const user = await client.fetch(
      `*[_type == "user" && email == $email][0]{ _id, email, firstName, lastName, passwordHash }`,
      { email }
    )

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const token = await signToken({
      userId: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    })

    const res = NextResponse.json({ success: true })
    res.cookies.set(SESSION_COOKIE, token, COOKIE_OPTS)
    res.cookies.set('bm_site_auth', '1', COOKIE_OPTS)
    return res
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 })
  }
}
