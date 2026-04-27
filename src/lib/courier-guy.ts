const TCG_BASE = 'https://api.thecourierguy.co.za/api'

interface QuoteRequest {
  collect_city: string
  collect_suburb: string
  collect_postal_code: string
  deliver_city: string
  deliver_suburb: string
  deliver_postal_code: string
  mass: number
  length?: number
  width?: number
  height?: number
}

interface QuoteResponse {
  price: number
  service_type: string
  estimated_days: number
}

interface ShipmentRequest {
  reference: string
  collect: {
    name: string
    contact: string
    phone: string
    email: string
    address: string
    suburb: string
    city: string
    province: string
    postal_code: string
  }
  deliver: {
    name: string
    contact: string
    phone: string
    email: string
    address: string
    suburb: string
    city: string
    province: string
    postal_code: string
  }
  parcels: Array<{ mass: number; length: number; width: number; height: number }>
  service_type: string
}

export async function getShippingQuote(req: QuoteRequest): Promise<QuoteResponse[]> {
  const params = new URLSearchParams({
    collect_city: req.collect_city,
    collect_suburb: req.collect_suburb,
    collect_postal_code: req.collect_postal_code,
    deliver_city: req.deliver_city,
    deliver_suburb: req.deliver_suburb,
    deliver_postal_code: req.deliver_postal_code,
    mass: String(req.mass),
    ...(req.length && { length: String(req.length) }),
    ...(req.width && { width: String(req.width) }),
    ...(req.height && { height: String(req.height) }),
  })

  const res = await fetch(`${TCG_BASE}/rate?${params}`, {
    headers: {
      Authorization: `Bearer ${process.env.COURIER_GUY_API_KEY}`,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) throw new Error('Failed to get shipping quote')
  return res.json()
}

export async function bookShipment(req: ShipmentRequest): Promise<{ waybill: string }> {
  const res = await fetch(`${TCG_BASE}/shipment`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.COURIER_GUY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req),
  })

  if (!res.ok) throw new Error('Failed to book shipment')
  return res.json()
}
