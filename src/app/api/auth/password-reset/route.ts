import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { hashPassword } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'

const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET || 'bm-fallback-secret-change-in-prod')

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

    const { data: user } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const passwordHash = await hashPassword(newPassword)
    await supabase.from('profiles').update({ password_hash: passwordHash }).eq('id', user.id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Password reset error:', err)
    return NextResponse.json({ error: 'Password reset failed. Please try again.' }, { status: 500 })
  }
}
