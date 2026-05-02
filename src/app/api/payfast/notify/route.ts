import { NextRequest, NextResponse } from 'next/server'
import { verifyITN } from '@/lib/payfast'
import { sendOrderConfirmationEmail } from '@/lib/email'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const params = Object.fromEntries(new URLSearchParams(body))

    if (!verifyITN(params)) {
      return new NextResponse('Invalid signature', { status: 400 })
    }

    if (params.payment_status === 'COMPLETE') {
      const orderId = params.m_payment_id

      const { data: order } = await supabase
        .from('orders')
        .select('id, customer_email, customer_first_name, total, order_items(name, quantity, price)')
        .eq('order_id', orderId)
        .single()

      if (order?.id) {
        await supabase
          .from('orders')
          .update({
            status: 'paid',
            payfast_payment_id: params.pf_payment_id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', order.id)

        if (order.customer_email) {
          sendOrderConfirmationEmail(
            order.customer_email,
            order.customer_first_name || 'Customer',
            orderId,
            order.order_items || [],
            order.total || 0
          ).catch(console.error)
        }
      }
    }

    return new NextResponse('OK', { status: 200 })
  } catch (err) {
    console.error('PayFast notify error:', err)
    return new NextResponse('Error', { status: 500 })
  }
}
