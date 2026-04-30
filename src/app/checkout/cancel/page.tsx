import Link from 'next/link'
import { XCircle } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function CancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center bg-background">
      <div className="text-red-400">
        <XCircle size={72} strokeWidth={1.5} />
      </div>
      <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-foreground">Payment Cancelled</h1>
      <p className="text-muted-foreground max-w-md">
        Your payment was not completed. Your cart items have been saved — you can try again when you&apos;re ready.
      </p>
      <div className="flex gap-4">
        <Link href="/checkout" className={cn(buttonVariants(), 'bg-green-700 hover:bg-green-800 text-white')}>
          Try Again
        </Link>
        <Link href="/shop" className={buttonVariants({ variant: 'outline' })}>
          Back to Shop
        </Link>
      </div>
    </div>
  )
}
