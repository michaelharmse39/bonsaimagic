import { NextRequest, NextResponse } from 'next/server'
import { buildPayFastForm } from '@/lib/payfast'
import { createClient } from 'next-sanity'

export const runtime = 'nodejs'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'c1o4kw27',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { orderId, amount, customer, items, shippingAddress, shippingCost } = body

    // Ensure amount is a number
    const numericAmount = Number(amount)
    if (isNaN(numericAmount)) {
      return NextResponse.json({ error: 'Invalid amount', details: `amount=${amount}` }, { status: 400 })
    }

    // Save order non-blocking
    writeClient.create({
      _type: 'order',
      orderId,
      status: 'pending',
      customer,
      shippingAddress,
      items,
      subtotal: numericAmount - Number(shippingCost),
      shippingCost: Number(shippingCost),
      total: numericAmount,
    }).catch((err) => console.error('Sanity order save failed:', err))

    const payFastData = buildPayFastForm({
      orderId,
      amount: numericAmount,
      itemName: `Bonsai Magic Order ${orderId}`,
      customer,
    })

    return NextResponse.json(payFastData)
  } catch (err) {
    console.error('PayFast create error:', err)
    return NextResponse.json({ error: 'Failed to create order', details: String(err) }, { status: 500 })
  }
}
