import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { client as sanityClient } from '@/lib/sanity'
import { urlFor } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  paid: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  processing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  shipped: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

type OrderItem = { id: string; product_id: string; name: string; price: number; quantity: number; image?: unknown }

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get('bm_user_session')?.value
  const user = token ? await verifyToken(token) : null
  if (!user) redirect('/login')

  const { data: order } = await supabase
    .from('orders')
    .select(`
      id, order_id, status, created_at,
      subtotal, shipping_cost, total,
      customer_first_name, customer_last_name,
      shipping_street, shipping_suburb, shipping_city, shipping_province, shipping_postal_code,
      courier_guy_tracking_id,
      order_items(id, product_id, name, price, quantity)
    `)
    .eq('id', id)
    .eq('customer_email', user.email)
    .single()

  if (!order) notFound()

  // Fetch product images from Sanity
  const productIds = ((order.order_items ?? []) as OrderItem[]).map(i => i.product_id).filter(Boolean)
  const imageMap: Record<string, unknown> = {}
  if (productIds.length > 0) {
    const products = await sanityClient
      .fetch(`*[_type == "product" && _id in $ids]{ _id, "image": images[0] }`, { ids: productIds })
      .catch(() => [])
    for (const p of products) imageMap[p._id] = p.image
  }

  const items: OrderItem[] = ((order.order_items ?? []) as OrderItem[]).map(item => ({
    ...item,
    image: imageMap[item.product_id] || null,
  }))

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/orders" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft size={14} />
        Back to orders
      </Link>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="jp-label mb-1">Order Details</p>
          <h1 className="font-(family-name:--font-heading) font-light text-2xl">{order.order_id}</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(order.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize shrink-0 ${STATUS_STYLES[order.status] || 'bg-muted text-muted-foreground'}`}>
          {order.status}
        </span>
      </div>

      {/* Items */}
      <div className="border border-border rounded-sm overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Items ordered</p>
        </div>
        <div className="divide-y divide-border">
          {items.map((item, idx) => (
            <div key={item.id} className="flex items-center gap-4 px-4 py-4">
              <span className="text-xs text-muted-foreground w-5 shrink-0">{idx + 1}.</span>
              <div className="relative w-14 h-14 rounded-sm overflow-hidden bg-muted shrink-0">
                {item.image ? (
                  <Image
                    src={urlFor(item.image).width(120).height(120).fit('crop').url()}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
              </div>
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
      <div className="border border-border rounded-sm overflow-hidden mb-6">
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
            <span>R {order.shipping_cost?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold pt-2 border-t border-border">
            <span>Total</span>
            <span className="text-green-600 dark:text-green-400">R {order.total?.toFixed(2)} ZAR</span>
          </div>
        </div>
      </div>

      {/* Shipping */}
      {order.shipping_street && (
        <div className="border border-border rounded-sm overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Shipping address</p>
          </div>
          <div className="px-4 py-4 text-sm text-muted-foreground space-y-0.5">
            <p>{order.shipping_street}</p>
            {order.shipping_suburb && <p>{order.shipping_suburb}</p>}
            <p>{order.shipping_city}, {order.shipping_province} {order.shipping_postal_code}</p>
          </div>
        </div>
      )}

      {order.courier_guy_tracking_id && (
        <div className="border border-border rounded-sm px-4 py-4">
          <p className="text-xs text-muted-foreground">Tracking ID</p>
          <p className="text-sm font-mono mt-0.5">{order.courier_guy_tracking_id}</p>
        </div>
      )}
    </div>
  )
}
