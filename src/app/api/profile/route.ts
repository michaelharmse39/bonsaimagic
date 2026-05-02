import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken, signToken, SESSION_COOKIE, COOKIE_OPTS } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function PATCH(req: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  const user = token ? await verifyToken(token) : null
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { firstName, lastName, phone } = await req.json()
  if (!firstName?.trim() || !lastName?.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('profiles')
    .update({ first_name: firstName.trim(), last_name: lastName.trim(), phone: phone?.trim() || null })
    .eq('email', user.email)

  if (error) return NextResponse.json({ error: 'Update failed' }, { status: 500 })

  // Re-issue JWT with updated name
  const newToken = await signToken({ userId: user.userId, email: user.email, firstName: firstName.trim(), lastName: lastName.trim() })
  const res = NextResponse.json({ success: true })
  res.cookies.set(SESSION_COOKIE, newToken, COOKIE_OPTS)
  return res
}
