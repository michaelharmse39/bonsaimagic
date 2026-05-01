import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { jwtVerify } from 'jose'
import { hashPassword, signToken, SESSION_COOKIE, COOKIE_OPTS } from '@/lib/auth'
import { sendWelcomeEmail } from '@/lib/email'

export const runtime = 'nodejs'

const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET || 'bm-fallback-secret-change-in-prod')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'c1o4kw27',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, password, otp, otpToken } = await req.json()

    if (!firstName || !lastName || !email || !password || !otp || !otpToken) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    let payload: Record<string, unknown>
    try {
      const result = await jwtVerify(otpToken, secret())
      payload = result.payload as Record<string, unknown>
    } catch {
      return NextResponse.json({ error: 'Verification code has expired. Please request a new one.' }, { status: 400 })
    }

    if (payload.email !== email || payload.purpose !== 'register' || payload.otp !== otp) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 })
    }

    const existing = await client.fetch(`*[_type == "user" && email == $email][0]._id`, { email })
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)
    const user = await client.create({ _type: 'user', firstName, lastName, email, passwordHash })

    const token = await signToken({ userId: user._id, email, firstName, lastName })

    sendWelcomeEmail(email, firstName).catch(console.error)

    const res = NextResponse.json({ success: true })
    res.cookies.set(SESSION_COOKIE, token, COOKIE_OPTS)
    return res
  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 })
  }
}
