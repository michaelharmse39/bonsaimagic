import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { jwtVerify } from 'jose'
import { hashPassword } from '@/lib/auth'

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
    const { email, otp, otpToken, newPassword } = await req.json()

    if (!email || !otp || !otpToken || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    let payload: Record<string, unknown>
    try {
      const result = await jwtVerify(otpToken, secret())
      payload = result.payload as Record<string, unknown>
    } catch {
      return NextResponse.json({ error: 'Verification code has expired. Please request a new one.' }, { status: 400 })
    }

    if (payload.email !== email || payload.purpose !== 'reset' || payload.otp !== otp) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 })
    }

    const user = await client.fetch(
      `*[_type == "user" && email == $email][0]{ _id }`,
      { email }
    )

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const passwordHash = await hashPassword(newPassword)
    await client.patch(user._id).set({ passwordHash }).commit()

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Password reset error:', err)
    return NextResponse.json({ error: 'Password reset failed. Please try again.' }, { status: 500 })
  }
}
