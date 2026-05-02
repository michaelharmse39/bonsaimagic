import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')?.toLowerCase().trim()
  const orderId = searchParams.get('orderId')?.trim()

  if (!email || !orderId) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  const { data: order } = await supabase
    .from('orders')
    .select(`
      id, order_id, status, created_at,
      customer_email, customer_first_name, customer_last_name, customer_phone,
      shipping_street, shipping_suburb, shipping_city, shipping_province, shipping_postal_code,
      subtotal, shipping_cost, total,
      courier_guy_tracking_id, notes,
      order_items(product_id, name, price, quantity)
    `)
    .eq('order_id', orderId)
    .eq('customer_email', email)
    .single()

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  return NextResponse.json(order)
}
