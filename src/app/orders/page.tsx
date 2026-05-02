import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { client as sanityClient } from '@/lib/sanity'
import { urlFor } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { Package } from 'lucide-react'

export const dynamic = 'force-dynamic'

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  paid: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  processing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  shipped: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

type OrderItem = { product_id: string; name: string; quantity: number; price: number; image?: unknown }

export default async function OrdersPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('bm_user_session')?.value
  const user = token ? await verifyToken(token) : null
  if (!user) redirect('/login')

  const { data: ordersRaw } = await supabase
    .from('orders')
    .select('id, order_id, status, created_at, total, order_items(product_id, name, quantity, price)')
    .eq('customer_email', user.email)
    .neq('status', 'pending')
    .order('created_at', { ascending: false })

  // Batch-fetch product images from Sanity
  const productIds = [...new Set(
    (ordersRaw ?? []).flatMap(o =>
      ((o.order_items ?? []) as OrderItem[]).map(i => i.product_id).filter(Boolean)
    )
  )]
  const imageMap: Record<string, unknown> = {}
  if (productIds.length > 0) {
    const products = await sanityClient
      .fetch(`*[_type == "product" && _id in $ids]{ _id, "image": images[0] }`, { ids: productIds })
      .catch(() => [])
    for (const p of products) imageMap[p._id] = p.image
  }

  const orders = (ordersRaw ?? []).map(order => ({
    ...order,
    items: ((order.order_items ?? []) as OrderItem[]).map(item => ({
      ...item,
      image: imageMap[item.product_id] || null,
    })),
  }))

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <p className="jp-label mb-1">My Orders</p>
        <h1 className="font-(family-name:--font-heading) font-light text-3xl">Order History</h1>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Package size={40} className="text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground mb-4">No orders yet.</p>
          <Link href="/shop" className="text-sm text-green-600 hover:underline">Browse our collection</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {orders.map((order) => {
            const totalItems = order.items.reduce((s, i) => s + i.quantity, 0)
            const images = order.items.filter(i => i.image).slice(0, 4)
            const extra = totalItems - images.length

            return (
              <Link key={order.id} href={`/orders/${order.id}`} className="border border-border rounded-sm overflow-hidden bg-card flex flex-col hover:border-foreground/30 transition-colors">
                <div className="px-4 pt-4 pb-3 flex items-center justify-between">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[order.status] || 'bg-muted text-muted-foreground'}`}>
                    {order.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1 px-4">
                  {images.map((item, idx) => {
                    const isLast = idx === images.length - 1 && extra > 0
                    return (
                      <div key={idx} className={`relative aspect-square bg-muted rounded-sm overflow-hidden${images.length === 1 ? ' col-span-2' : ''}`}>
                        <Image
                          src={urlFor(item.image).width(400).height(400).fit('crop').url()}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                        {isLast && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">+{extra}</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="px-4 py-4 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
                    <p className="text-xs text-muted-foreground">Order {order.order_id}</p>
                  </div>
                  <p className="font-semibold text-sm text-green-600 dark:text-green-400">
                    R {order.total?.toFixed(2)} ZAR
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
