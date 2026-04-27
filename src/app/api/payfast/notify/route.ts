import { NextRequest, NextResponse } from 'next/server'
import { verifyITN } from '@/lib/payfast'
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
    const body = await req.text()
    const params = Object.fromEntries(new URLSearchParams(body))

    if (!verifyITN(params)) {
      return new NextResponse('Invalid signature', { status: 400 })
    }

    if (params.payment_status === 'COMPLETE') {
      const orderId = params.m_payment_id
      const orders = await writeClient.fetch(
        `*[_type == "order" && orderId == $orderId][0]`,
        { orderId }
      )
      if (orders?._id) {
        await writeClient.patch(orders._id).set({
          status: 'paid',
          payfastPaymentId: params.pf_payment_id,
        }).commit()
      }
    }

    return new NextResponse('OK', { status: 200 })
  } catch (err) {
    console.error('PayFast notify error:', err)
    return new NextResponse('Error', { status: 500 })
  }
}
