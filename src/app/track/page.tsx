'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'

interface Order {
  order_id: string
  status: string
  customer_first_name: string
  customer_last_name: string
  customer_email: string
  customer_phone?: string
  order_items: Array<{ name: string; price: number; quantity: number }>
  shipping_street: string
  shipping_suburb: string
  shipping_city: string
  shipping_province: string
  shipping_postal_code: string
  subtotal: number
  shipping_cost: number
  total: number
  created_at: string
  courier_guy_tracking_id?: string
}

const STEPS = ['Pending', 'Confirmed', 'Shipped', 'Delivered']
const STATUS_STEP: Record<string, number> = {
  pending: 1, paid: 2, processing: 2, shipped: 3, delivered: 4,
}
const STATUS_LABEL: Record<string, string> = {
  pending: 'Payment Pending', paid: 'Order Confirmed', processing: 'Processing',
  shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled',
}

export default function TrackPage() {
  const [email, setEmail] = useState('')
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOrder(null)
    try {
      const res = await fetch(`/api/track?email=${encodeURIComponent(email)}&orderId=${encodeURIComponent(orderId)}`)
      if (!res.ok) {
        setError('Order not found. Please check your email address and order ID.')
      } else {
        setOrder(await res.json())
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const step = order ? (STATUS_STEP[order.status] ?? 1) : 0

  return (
    <div className="max-w-2xl mx-auto px-6 lg:px-10 py-16">
      <Link href="/" className="jp-label hover:text-foreground transition-colors inline-flex items-center gap-2 mb-12">
        <ArrowLeft size={12} /> Back
      </Link>

      <div className="mb-10 border-b border-border/60 pb-10">
        <p className="jp-label mb-3">Bonsai Magic</p>
        <h1 className="font-[family-name:var(--font-heading)] font-light text-foreground" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
          Track Your Order
        </h1>
      </div>

      <form onSubmit={handleSearch} className="space-y-4 mb-10">
        <div>
          <label className="jp-label block mb-2">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-transparent border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
          />
        </div>
        <div>
          <label className="jp-label block mb-2">Order ID</label>
          <input
            type="text"
            required
            value={orderId}
            onChange={(e) => setOrderId(e.target.value.toUpperCase())}
            placeholder="BM-1234567890"
            className="w-full bg-transparent border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
          />
          <p className="text-xs text-muted-foreground mt-1.5">Found in your order confirmation email</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 text-xs tracking-[0.15em] uppercase hover:bg-foreground/90 transition-colors disabled:opacity-50"
        >
          <Search size={13} />
          {loading ? 'Searching...' : 'Track Order'}
        </button>
      </form>

      {error && (
        <div className="border border-border/60 bg-muted/40 px-5 py-4 mb-8">
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      )}

      {order && (
        <div className="space-y-px bg-border/30">
          {/* Status + progress */}
          <div className="bg-background p-6">
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="jp-label mb-1">Order {order.order_id}</p>
                <p className="text-xs text-muted-foreground">
                  Placed {new Date(order.created_at).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <span className="jp-label text-primary">{STATUS_LABEL[order.status] ?? order.status}</span>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between relative z-10">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex flex-col items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full transition-colors ${i + 1 <= step ? 'bg-primary' : 'bg-border'}`} />
                    <p className={`text-xs tracking-wide uppercase ${i + 1 <= step ? 'text-foreground' : 'text-muted-foreground/50'}`} style={{ fontSize: '0.6rem', letterSpacing: '0.1em' }}>{s}</p>
                  </div>
                ))}
              </div>
              <div className="absolute top-[5px] left-[5px] right-[5px] h-px bg-border -z-0" />
              <div
                className="absolute top-[5px] left-[5px] h-px bg-primary transition-all duration-500"
                style={{ width: `${Math.max(0, (step - 1) / 3) * 100}%` }}
              />
            </div>

            {order.courier_guy_tracking_id && (
              <p className="mt-6 text-xs text-muted-foreground">
                Courier Guy tracking: <span className="text-foreground font-medium">{order.courier_guy_tracking_id}</span>
              </p>
            )}
          </div>

          {/* Items */}
          <div className="bg-background p-6">
            <p className="jp-label mb-5">Items Ordered</p>
            <div className="space-y-3">
              {order.order_items?.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-foreground">
                    {item.name}
                    <span className="text-muted-foreground ml-2">× {item.quantity}</span>
                  </span>
                  <span className="font-[family-name:var(--font-heading)]">R{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-border/40 pt-4 space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span><span>R{order.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span><span>R{order.shipping_cost?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-[family-name:var(--font-heading)] text-base pt-1">
                  <span>Total</span><span>R{order.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery address */}
          <div className="bg-background p-6">
            <p className="jp-label mb-4">Delivery Address</p>
            <address className="text-sm text-muted-foreground not-italic space-y-1 leading-relaxed">
              <p className="text-foreground">{order.customer_first_name} {order.customer_last_name}</p>
              <p>{order.shipping_street}</p>
              <p>{order.shipping_suburb}, {order.shipping_city}</p>
              <p>{order.shipping_province}, {order.shipping_postal_code}</p>
            </address>
          </div>
        </div>
      )}

      <div className="h-16" />
    </div>
  )
}
