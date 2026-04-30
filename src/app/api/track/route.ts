import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')?.toLowerCase().trim()
  const orderId = searchParams.get('orderId')?.trim()

  if (!email || !orderId) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  const order = await client
    .fetch(
      `*[_type == "order" && orderId == $orderId && lower(customer.email) == $email][0]`,
      { orderId, email }
    )
    .catch(() => null)

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  return NextResponse.json(order)
}
