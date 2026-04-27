import Link from 'next/link'
import { XCircle } from 'lucide-react'

export default function CancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="text-red-400">
        <XCircle size={72} strokeWidth={1.5} />
      </div>
      <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-stone-800">Payment Cancelled</h1>
      <p className="text-stone-600 max-w-md">
        Your payment was not completed. Your cart items have been saved — you can try again when you&apos;re ready.
      </p>
      <div className="flex gap-4">
        <Link href="/checkout" className="bg-green-700 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-800 transition-colors">
          Try Again
        </Link>
        <Link href="/shop" className="border border-stone-200 text-stone-600 font-semibold px-6 py-3 rounded-lg hover:bg-stone-50 transition-colors">
          Back to Shop
        </Link>
      </div>
    </div>
  )
}
