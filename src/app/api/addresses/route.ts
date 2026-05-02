import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken, SESSION_COOKIE } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  const user = token ? await verifyToken(token) : null
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { data } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_email', user.email)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: true })

  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  const user = token ? await verifyToken(token) : null
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await req.json()
  const { name, street, suburb, city, province, postalCode, country, phone, isDefault } = body

  if (!street?.trim() || !city?.trim()) {
    return NextResponse.json({ error: 'Street and city are required' }, { status: 400 })
  }

  // If setting as default, unset all others first
  if (isDefault) {
    await supabase.from('addresses').update({ is_default: false }).eq('user_email', user.email)
  }

  // If this is the first address, auto-default it
  const { count } = await supabase
    .from('addresses')
    .select('*', { count: 'exact', head: true })
    .eq('user_email', user.email)

  const { data, error } = await supabase
    .from('addresses')
    .insert({
      user_email: user.email,
      name: name?.trim() || null,
      street: street.trim(),
      suburb: suburb?.trim() || null,
      city: city.trim(),
      province: province?.trim() || null,
      postal_code: postalCode?.trim() || null,
      country: country?.trim() || 'South Africa',
      phone: phone?.trim() || null,
      is_default: isDefault || count === 0,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: 'Failed to save address' }, { status: 500 })
  return NextResponse.json(data)
}
