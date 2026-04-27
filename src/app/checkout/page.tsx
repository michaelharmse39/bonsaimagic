'use client'
import { useState } from 'react'
import { useCart } from '@/store/cart'
import { urlFor } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface ShippingForm {
  firstName: string; lastName: string; email: string; phone: string
  street: string; suburb: string; city: string; province: string; postalCode: string
}

const PROVINCES = ['Eastern Cape','Free State','Gauteng','KwaZulu-Natal','Limpopo','Mpumalanga','North West','Northern Cape','Western Cape']

export default function CheckoutPage() {
  const { items, total, totalWeight, clearCart } = useCart()
  const [form, setForm] = useState<ShippingForm>({
    firstName: '', lastName: '', email: '', phone: '',
    street: '', suburb: '', city: '', province: 'Gauteng', postalCode: '',
  })
  const [shippingQuote, setShippingQuote] = useState<number | null>(null)
  const [loadingQuote, setLoadingQuote] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [payFastData, setPayFastData] = useState<{ url: string; fields: Record<string, string> } | null>(null)

  function updateField(field: keyof ShippingForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setShippingQuote(null)
  }

  async function getShippingQuote() {
    if (!form.suburb || !form.city || !form.postalCode) {
      toast.error('Please fill in suburb, city and postal code first')
      return
    }
    setLoadingQuote(true)
    try {
      const res = await fetch('/api/courier-guy/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deliver_suburb: form.suburb,
          deliver_city: form.city,
          deliver_postal_code: form.postalCode,
          mass: totalWeight,
        }),
      })
      const data = await res.json()
      if (data.price) {
        setShippingQuote(data.price)
      } else {
        setShippingQuote(85)
      }
    } catch {
      setShippingQuote(85)
      toast('Could not get live quote — using estimate of R85', { icon: 'ℹ️' })
    } finally {
      setLoadingQuote(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (shippingQuote === null) {
      toast.error('Please get a shipping quote first')
      return
    }
    setSubmitting(true)
    try {
      const orderId = `BM-${Date.now()}`
      const orderTotal = total + shippingQuote
      const res = await fetch('/api/payfast/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          amount: orderTotal,
          customer: { firstName: form.firstName, lastName: form.lastName, email: form.email },
          items: items.map((i) => ({ productId: i.id, name: i.name, price: i.price, quantity: i.quantity })),
          shippingAddress: { street: form.street, suburb: form.suburb, city: form.city, province: form.province, postalCode: form.postalCode },
          shippingCost: shippingQuote,
        }),
      })
      const data = await res.json()
      setPayFastData(data)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0 && !payFastData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-stone-500 text-xl">Your cart is empty</p>
        <Link href="/shop" className="text-green-700 underline">Browse trees</Link>
      </div>
    )
  }

  if (payFastData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-stone-800">Redirecting to PayFast...</h2>
        <p className="text-stone-500">You will be redirected to complete your payment securely.</p>
        <form action={payFastData.url} method="POST" id="payfast-form" className="hidden">
          {Object.entries(payFastData.fields).map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v} />
          ))}
        </form>
        <button
          onClick={() => { clearCart(); (document.getElementById('payfast-form') as HTMLFormElement)?.submit() }}
          className="bg-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors"
        >
          Proceed to Payment
        </button>
      </div>
    )
  }

  const orderTotal = shippingQuote !== null ? total + shippingQuote : null

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/shop" className="inline-flex items-center gap-1 text-stone-500 hover:text-green-700 text-sm mb-6">
        <ArrowLeft size={16} /> Continue Shopping
      </Link>
      <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-stone-800 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="font-semibold text-lg text-stone-800 mb-4">Contact Information</h2>
            <div className="grid grid-cols-2 gap-3">
              <input required placeholder="First Name" value={form.firstName} onChange={(e) => updateField('firstName', e.target.value)}
                className="border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              <input required placeholder="Last Name" value={form.lastName} onChange={(e) => updateField('lastName', e.target.value)}
                className="border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <input required type="email" placeholder="Email Address" value={form.email} onChange={(e) => updateField('email', e.target.value)}
              className="mt-3 w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            <input required type="tel" placeholder="Phone Number" value={form.phone} onChange={(e) => updateField('phone', e.target.value)}
              className="mt-3 w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>

          <div>
            <h2 className="font-semibold text-lg text-stone-800 mb-4">Delivery Address</h2>
            <input required placeholder="Street Address" value={form.street} onChange={(e) => updateField('street', e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 mb-3" />
            <input required placeholder="Suburb" value={form.suburb} onChange={(e) => updateField('suburb', e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 mb-3" />
            <div className="grid grid-cols-2 gap-3">
              <input required placeholder="City" value={form.city} onChange={(e) => updateField('city', e.target.value)}
                className="border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              <input required placeholder="Postal Code" value={form.postalCode} onChange={(e) => updateField('postalCode', e.target.value)}
                className="border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <select required value={form.province} onChange={(e) => updateField('province', e.target.value)}
              className="mt-3 w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              {PROVINCES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>

          <button type="button" onClick={getShippingQuote} disabled={loadingQuote}
            className="w-full border-2 border-green-600 text-green-700 font-semibold py-3 rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
            {loadingQuote ? <><Loader2 size={18} className="animate-spin" /> Getting Quote...</> : '📦 Get Shipping Quote'}
          </button>

          {shippingQuote !== null && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
              <p className="text-green-800 font-semibold">Shipping via The Courier Guy: <span className="text-green-700">R{shippingQuote.toFixed(2)}</span></p>
              <p className="text-green-600 text-xs mt-1">Estimated delivery: 2–4 business days</p>
            </div>
          )}

          <button type="submit" disabled={submitting || shippingQuote === null}
            className="w-full bg-green-700 hover:bg-green-800 disabled:bg-stone-300 text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2">
            {submitting ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : `Pay Securely with PayFast${orderTotal ? ` — R${orderTotal.toFixed(2)}` : ''}`}
          </button>
          <p className="text-xs text-stone-400 text-center">🔒 Secured by PayFast. Your payment details are never stored on our servers.</p>
        </form>

        {/* Order summary */}
        <div>
          <h2 className="font-semibold text-lg text-stone-800 mb-4">Order Summary</h2>
          <div className="bg-stone-50 rounded-xl p-4 space-y-3">
            {items.map((item) => {
              const imgUrl = item.image || null
              return (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-stone-200 flex-shrink-0">
                    {imgUrl && <Image src={imgUrl} alt={item.name} fill className="object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate">{item.name}</p>
                    <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-green-700">R{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              )
            })}
            <div className="border-t pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span><span>R{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span>{shippingQuote !== null ? `R${shippingQuote.toFixed(2)}` : '—'}</span>
              </div>
              <div className="flex justify-between font-bold text-stone-800 text-base pt-1 border-t">
                <span>Total</span>
                <span className="text-green-700">{orderTotal !== null ? `R${orderTotal.toFixed(2)}` : '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
