import { NextRequest, NextResponse } from 'next/server'
import { buildPayFastForm } from '@/lib/payfast'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { orderId, amount, customer, items, shippingAddress, shippingCost } = body

    const numericAmount = Number(amount)
    if (isNaN(numericAmount)) {
      return NextResponse.json({ error: 'Invalid amount', details: `amount=${amount}` }, { status: 400 })
    }

    // Create order row
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_id: orderId,
        status: 'pending',
        customer_email: customer.email,
        customer_first_name: customer.firstName,
        customer_last_name: customer.lastName,
        customer_phone: customer.phone,
        shipping_street: shippingAddress?.street,
        shipping_suburb: shippingAddress?.suburb,
        shipping_city: shippingAddress?.city,
        shipping_province: shippingAddress?.province,
        shipping_postal_code: shippingAddress?.postalCode,
        subtotal: numericAmount - Number(shippingCost),
        shipping_cost: Number(shippingCost),
        total: numericAmount,
      })
      .select('id')
      .single()

    if (orderError || !order) {
      console.error('Order insert failed:', orderError)
      return NextResponse.json({ error: 'Failed to save order' }, { status: 500 })
    }

    // Insert line items
    if (Array.isArray(items) && items.length > 0) {
      await supabase.from('order_items').insert(
        items.map((i: { productId: string; name: string; price: number; quantity: number }) => ({
          order_id: order.id,
          product_id: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        }))
      )
    }

    const payFastData = buildPayFastForm({
      orderId,
      amount: numericAmount,
      itemName: `Bonsai Magic Order ${orderId}`,
      customer,
    })

    console.log('[PayFast] _debug_sig_string:', payFastData._debug_sig_string)
    return NextResponse.json(payFastData)
  } catch (err) {
    console.error('PayFast create error:', err)
    return NextResponse.json({ error: 'Failed to create order', details: String(err) }, { status: 500 })
  }
}
