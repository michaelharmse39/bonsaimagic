import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken, SESSION_COOKIE } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  const user = token ? await verifyToken(token) : null
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await req.json()
  const { name, street, suburb, city, province, postalCode, country, phone, isDefault } = body

  if (isDefault) {
    await supabase.from('addresses').update({ is_default: false }).eq('user_email', user.email)
  }

  const { data, error } = await supabase
    .from('addresses')
    .update({
      name: name?.trim() || null,
      street: street?.trim() || null,
      suburb: suburb?.trim() || null,
      city: city?.trim() || null,
      province: province?.trim() || null,
      postal_code: postalCode?.trim() || null,
      country: country?.trim() || 'South Africa',
      phone: phone?.trim() || null,
      ...(isDefault !== undefined && { is_default: isDefault }),
    })
    .eq('id', id)
    .eq('user_email', user.email) // ownership check
    .select()
    .single()

  if (error) return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  const user = token ? await verifyToken(token) : null
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', id)
    .eq('user_email', user.email) // ownership check

  if (error) return NextResponse.json({ error: 'Delete failed' }, { status: 500 })

  // If deleted address was default, auto-promote the oldest remaining
  const { data: remaining } = await supabase
    .from('addresses')
    .select('id')
    .eq('user_email', user.email)
    .order('created_at', { ascending: true })
    .limit(1)

  if (remaining?.[0]) {
    await supabase.from('addresses').update({ is_default: true }).eq('id', remaining[0].id)
  }

  return NextResponse.json({ success: true })
}
