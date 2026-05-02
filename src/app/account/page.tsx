import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowRight, Package, MapPin, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import LogoutButton from './LogoutButton'

export const dynamic = 'force-dynamic'

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  paid: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  processing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  shipped: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

export default async function AccountPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('bm_user_session')?.value
  const user = token ? await verifyToken(token) : null

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center">
          <span className="font-(family-name:--font-heading) text-8xl font-light text-muted-foreground/20 block mb-6">私</span>
          <p className="jp-label mb-2">My Account</p>
          <p className="text-sm text-muted-foreground mb-8 max-w-xs mx-auto">
            Sign in to manage your account, view orders, and update your details.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login" className="jp-label hover:text-foreground transition-colors inline-flex items-center gap-2">
              Sign in <ArrowRight size={12} />
            </Link>
            <Link href="/register" className="jp-label hover:text-foreground transition-colors inline-flex items-center gap-2">
              Create account <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      id, order_id, status, created_at, total, subtotal, shipping_cost,
      shipping_street, shipping_suburb, shipping_city, shipping_province, shipping_postal_code,
      order_items(name, quantity, price)
    `)
    .eq('customer_email', user.email)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="jp-label mb-1">My Account</p>
          <h1 className="font-(family-name:--font-heading) font-light text-3xl">
            {user.firstName} {user.lastName}
          </h1>
        </div>
        <LogoutButton />
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <User size={14} /> Account Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Full Name</p>
            <p>{user.firstName} {user.lastName}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Email</p>
            <p>{user.email}</p>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Package size={18} /> Order History
        </h2>

        {!orders?.length ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <p>No orders yet.</p>
              <Link href="/shop" className="text-sm text-green-600 hover:underline mt-2 inline-block">Browse our collection</Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm">{order.order_id}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[order.status] || 'bg-muted text-muted-foreground'}`}>
                      {order.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {(order.order_items as { name: string; quantity: number; price: number }[])?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.name} <span className="text-muted-foreground">× {item.quantity}</span></span>
                        <span className="font-medium">R{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Total</span>
                    <span className="text-green-600 dark:text-green-400">R{order.total?.toFixed(2)}</span>
                  </div>
                  {order.shipping_street && (
                    <>
                      <Separator />
                      <div className="text-xs text-muted-foreground flex items-start gap-2">
                        <MapPin size={12} className="mt-0.5 shrink-0" />
                        <span>
                          {order.shipping_street}, {order.shipping_suburb}, {order.shipping_city}, {order.shipping_province} {order.shipping_postal_code}
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
