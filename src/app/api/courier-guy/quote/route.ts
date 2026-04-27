import { NextRequest, NextResponse } from 'next/server'
import { getShippingQuote } from '@/lib/courier-guy'

export async function POST(req: NextRequest) {
  try {
    const { deliver_suburb, deliver_city, deliver_postal_code, mass } = await req.json()

    const quotes = await getShippingQuote({
      collect_city: process.env.STORE_CITY ?? 'Johannesburg',
      collect_suburb: process.env.STORE_SUBURB ?? 'Sandton',
      collect_postal_code: process.env.STORE_POSTAL_CODE ?? '2196',
      deliver_city,
      deliver_suburb,
      deliver_postal_code,
      mass: mass ?? 1,
    })

    const cheapest = Array.isArray(quotes)
      ? quotes.sort((a, b) => a.price - b.price)[0]
      : quotes

    return NextResponse.json(cheapest ?? { price: 85 })
  } catch {
    return NextResponse.json({ price: 85 })
  }
}
