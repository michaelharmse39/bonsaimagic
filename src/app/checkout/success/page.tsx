import Link from 'next/link'
import { CheckCircle, Clock } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

type OrderItem = { id: string; name: string; price: number; quantity: number }

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order: orderId } = await searchParams

  let order: {
    order_id: string
    status: string
    subtotal: number
    shipping_cost: number
    total: number
    shipping_street: string | null
    shipping_suburb: string | null
    shipping_city: string | null
    shipping_province: string | null
    shipping_postal_code: string | null
    order_items: OrderItem[]
  } | null = null

  if (orderId) {
    const { data } = await supabase
      .from('orders')
      .select(`
        order_id, status,
        subtotal, shipping_cost, total,
        shipping_street, shipping_suburb, shipping_city, shipping_province, shipping_postal_code,
        order_items(id, name, price, quantity)
      `)
      .eq('order_id', orderId)
      .single()
    order = data
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <div className="inline-flex text-green-500 dark:text-green-400 mb-4">
          <CheckCircle size={64} strokeWidth={1.5} />
        </div>
        <h1 className="font-(family-name:--font-playfair) text-3xl md:text-4xl font-bold text-foreground">
          Order Confirmed!
        </h1>
        <p className="text-muted-foreground mt-2">
          Thank you for your purchase. You will receive a confirmation email shortly.
        </p>
      </div>

      {order ? (
        <div className="space-y-4">
          {/* Header row: order ID + status */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Reference: <span className="font-mono font-semibold text-foreground">{order.order_id}</span>
            </p>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
              order.status === 'paid' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
              'bg-muted text-muted-foreground'
            }`}>
              {order.status}
            </span>
          </div>

          {order.status === 'pending' && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground border border-border rounded-sm px-3 py-2.5 bg-muted/30">
              <Clock size={13} className="shrink-0" />
              Payment confirmation is on its way — this page will show &ldquo;paid&rdquo; once PayFast notifies us. Refresh in a moment if needed.
            </div>
          )}

          {/* Items */}
          <div className="border border-border rounded-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Items ordered</p>
            </div>
            <div className="divide-y divide-border">
              {(order.order_items ?? []).map((item, idx) => (
                <div key={item.id} className="flex items-center gap-4 px-4 py-3">
                  <span className="text-xs text-muted-foreground w-5 shrink-0">{idx + 1}.</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium shrink-0">R {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border border-border rounded-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Summary</p>
            </div>
            <div className="px-4 py-4 space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>R {order.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span>{order.shipping_cost > 0 ? `R ${order.shipping_cost?.toFixed(2)}` : 'Free'}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-green-600 dark:text-green-400">R {order.total?.toFixed(2)} ZAR</span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          {order.shipping_street ? (
            <div className="border border-border rounded-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/30">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Shipping address</p>
              </div>
              <div className="px-4 py-4 text-sm text-muted-foreground space-y-0.5">
                <p>{order.shipping_street}</p>
                {order.shipping_suburb && <p>{order.shipping_suburb}</p>}
                <p>{order.shipping_city}, {order.shipping_province} {order.shipping_postal_code}</p>
              </div>
            </div>
          ) : (
            <div className="border border-border rounded-sm px-4 py-4 text-sm text-muted-foreground">
              Collection in store — we will contact you when your order is ready.
            </div>
          )}
        </div>
      ) : (
        orderId && (
          <p className="text-center text-sm text-muted-foreground">
            Order reference: <span className="font-mono font-semibold text-foreground">{orderId}</span>
          </p>
        )
      )}

      <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
        <Link href="/orders" className={buttonVariants({ variant: 'outline' })}>
          View My Orders
        </Link>
        <Link href="/shop" className={buttonVariants({ variant: 'default' }) + ' bg-green-700 hover:bg-green-800 text-white'}>
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
