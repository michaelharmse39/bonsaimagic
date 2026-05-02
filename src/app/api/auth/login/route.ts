import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, signToken, SESSION_COOKIE, COOKIE_OPTS } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const { data: user } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name, password_hash')
      .eq('email', email)
      .single()

    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const token = await signToken({
      userId: user.id,
      email: user.email,
      firstName: user.first_name || '',
      lastName: user.last_name || '',
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
