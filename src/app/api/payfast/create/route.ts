import { NextRequest, NextResponse } from 'next/server'
import { buildPayFastForm } from '@/lib/payfast'
import { createClient } from 'next-sanity'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { orderId, amount, customer, items, shippingAddress, shippingCost } = body

    await writeClient.create({
      _type: 'order',
      orderId,
      status: 'pending',
      customer,
      shippingAddress,
      items,
      subtotal: amount - shippingCost,
      shippingCost,
      total: amount,
    })

    const payFastData = buildPayFastForm({
      orderId,
      amount,
      itemName: `Bonsai Magic Order ${orderId}`,
      customer,
    })

    return NextResponse.json(payFastData)
  } catch (err) {
    console.error('PayFast create error:', err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
