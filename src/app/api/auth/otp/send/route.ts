import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { SignJWT } from 'jose'
import { sendOtpEmail } from '@/lib/email'

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
    const { email, purpose } = await req.json()

    if (!email || !purpose) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const existingUser = await client.fetch(
      `*[_type == "user" && email == $email][0]._id`,
      { email }
    )

    if (purpose === 'register' && existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    if (purpose === 'reset' && !existingUser) {
      return NextResponse.json({ error: 'No account found with this email address' }, { status: 404 })
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000))

    const otpToken = await new SignJWT({ otp, email, purpose })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('10m')
      .sign(secret())

    await sendOtpEmail(email, otp, purpose)

    return NextResponse.json({ otpToken })
  } catch (err) {
    console.error('OTP send error:', err)
    return NextResponse.json({ error: 'Failed to send verification code' }, { status: 500 })
  }
}
