'use client'
import { useState } from 'react'
import { useCart } from '@/store/cart'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface ShippingForm {
  firstName: string; lastName: string; email: string; phone: string
  street: string; suburb: string; city: string; province: string; postalCode: string
}

const PROVINCES = ['Eastern Cape','Free State','Gauteng','KwaZulu-Natal','Limpopo','Mpumalanga','North West','Northern Cape','Western Cape']

export default function CheckoutPage() {
  const { items, clearCart } = useCart()
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const [form, setForm] = useState<ShippingForm>({
    firstName: '', lastName: '', email: '', phone: '',
    street: '', suburb: '', city: '', province: 'Gauteng', postalCode: '',
  })
  const shippingQuote = 0
  const [submitting, setSubmitting] = useState(false)
  const [payFastData, setPayFastData] = useState<{ url: string; fields: Record<string, string> } | null>(null)

  function set(field: keyof ShippingForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const orderId = `BM-${Date.now()}`
      const res = await fetch('/api/payfast/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId, amount: total + shippingQuote,
          customer: { firstName: form.firstName, lastName: form.lastName, email: form.email },
          items: items.map((i) => ({ productId: i.id, name: i.name, price: i.price, quantity: i.quantity })),
          shippingAddress: { street: form.street, suburb: form.suburb, city: form.city, province: form.province, postalCode: form.postalCode },
          shippingCost: shippingQuote,
        }),
      })
      setPayFastData(await res.json())
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0 && !payFastData) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-muted-foreground text-xl">Your cart is empty</p>
      <Link href="/shop" className={buttonVariants({ variant: 'link' })}>Browse trees</Link>
    </div>
  )

  if (payFastData) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold">Redirecting to PayFast...</h2>
      <p className="text-muted-foreground">You will be redirected to complete your payment securely.</p>
      <form action={payFastData.url} method="POST" id="payfast-form" className="hidden">
        {Object.entries(payFastData.fields).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      </form>
      <Button className="bg-green-700 hover:bg-green-800 text-white px-8"
        onClick={() => { clearCart(); (document.getElementById('payfast-form') as HTMLFormElement)?.submit() }}>
        Proceed to Payment
      </Button>
    </div>
  )

  const orderTotal = total + shippingQuote

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/shop" className={buttonVariants({ variant: 'ghost', size: 'sm' }) + ' mb-6 gap-1 text-muted-foreground'}>
        <ArrowLeft size={16} /> Continue Shopping
      </Link>
      <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Contact Information</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input required placeholder="First Name" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} />
                <Input required placeholder="Last Name" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} />
              </div>
              <Input required type="email" placeholder="Email Address" value={form.email} onChange={(e) => set('email', e.target.value)} />
              <Input required type="tel" placeholder="Phone Number" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Delivery Address</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Input required placeholder="Street Address" value={form.street} onChange={(e) => set('street', e.target.value)} />
              <Input required placeholder="Suburb" value={form.suburb} onChange={(e) => set('suburb', e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <Input required placeholder="City" value={form.city} onChange={(e) => set('city', e.target.value)} />
                <Input required placeholder="Postal Code" value={form.postalCode} onChange={(e) => set('postalCode', e.target.value)} />
              </div>
              <Select value={form.province} onValueChange={(v) => v && set('province', v)}>
                <SelectTrigger><SelectValue placeholder="Select Province" /></SelectTrigger>
                <SelectContent>{PROVINCES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Button type="submit" disabled={submitting} className="w-full bg-green-700 hover:bg-green-800 text-white py-6 text-base gap-2">
            {submitting ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : `Pay Securely with PayFast — R${orderTotal.toFixed(2)}`}
          </Button>
          <p className="text-xs text-muted-foreground text-center">🔒 Secured by PayFast. Your payment details are never stored on our servers.</p>
        </form>

        <div>
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          <Card>
            <CardContent className="pt-4 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">R{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <Separator />
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>R{total.toFixed(2)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>Free</span></div>
                <Separator />
                <div className="flex justify-between font-bold text-base pt-1">
                  <span>Total</span>
                  <span className="text-green-600 dark:text-green-400">R{orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
