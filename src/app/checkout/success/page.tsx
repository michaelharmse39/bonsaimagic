import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function SuccessPage({ searchParams }: { searchParams: { order?: string } }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="text-green-500">
        <CheckCircle size={72} strokeWidth={1.5} />
      </div>
      <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold text-stone-800">
        Order Confirmed!
      </h1>
      <p className="text-stone-600 text-lg max-w-md">
        Thank you for your purchase. Your bonsai tree is being prepared for shipment via The Courier Guy.
      </p>
      {searchParams.order && (
        <p className="text-sm text-stone-400">Order reference: <span className="font-mono font-semibold">{searchParams.order}</span></p>
      )}
      <p className="text-stone-500 text-sm max-w-sm">
        You will receive a confirmation email with tracking details once your tree has been collected.
      </p>
      <Link
        href="/shop"
        className="bg-green-700 text-white font-semibold px-8 py-3 rounded-lg hover:bg-green-800 transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  )
}
