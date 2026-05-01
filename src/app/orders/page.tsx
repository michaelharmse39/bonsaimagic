import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { createClient } from 'next-sanity'
import { urlFor } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { Package } from 'lucide-react'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'c1o4kw27',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  paid: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  processing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  shipped: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

type OrderItem = {
  name: string
  quantity: number
  price: number
  productId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: any
}

type Order = {
  _id: string
  orderId: string
  status: string
  _createdAt: string
  total: number
  items: OrderItem[]
}

export default async function OrdersPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('bm_user_session')?.value
  const user = token ? await verifyToken(token) : null

  if (!user) redirect('/login')

  const orders: Order[] = await client.fetch(
    `*[_type == "order" && customer.email == $email] | order(_createdAt desc) {
      _id, orderId, status, _createdAt, total,
      items[]{
        name, quantity, price, productId,
        "image": *[_type == "product" && _id == ^.productId][0].images[0]
      }
    }`,
    { email: user.email }
  )

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
            const totalItems = order.items?.reduce((s, i) => s + i.quantity, 0) ?? 0
            const images = (order.items ?? []).filter((i) => i.image).slice(0, 4)
            const extra = totalItems - images.length

            return (
              <div key={order._id} className="border border-border rounded-sm overflow-hidden bg-card flex flex-col">
                {/* Status + date */}
                <div className="px-4 pt-4 pb-3 flex items-center justify-between">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[order.status] || 'bg-muted text-muted-foreground'}`}>
                    {order.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(order._createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                {/* Product images grid */}
                <div className="grid grid-cols-2 gap-1 px-4">
                  {images.map((item, idx) => {
                    const isLast = idx === images.length - 1 && extra > 0
                    return (
                      <div key={idx} className="relative aspect-square bg-muted rounded-sm overflow-hidden">
                        <Image
                          src={urlFor(item.image).width(200).height(200).fit('crop').url()}
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
                  {/* Fill empty slots if less than 2 images */}
                  {images.length === 1 && (
                    <div className="aspect-square bg-muted/40 rounded-sm" />
                  )}
                </div>

                {/* Order info */}
                <div className="px-4 py-4 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
                    <p className="text-xs text-muted-foreground">Order {order.orderId}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm text-green-600 dark:text-green-400">
                      R {order.total?.toFixed(2)} ZAR
                    </p>
                    <Link href="/shop" className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors">
                      Buy again
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
