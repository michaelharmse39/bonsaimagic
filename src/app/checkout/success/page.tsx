import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'

export default function SuccessPage({ searchParams }: { searchParams: { order?: string } }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center bg-background">
      <div className="text-green-500 dark:text-green-400">
        <CheckCircle size={72} strokeWidth={1.5} />
      </div>
      <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold text-foreground">
        Order Confirmed!
      </h1>
      <p className="text-muted-foreground text-lg max-w-md">
        Thank you for your purchase. Your bonsai tree is being prepared for shipment via The Courier Guy.
      </p>
      {searchParams.order && (
        <p className="text-sm text-muted-foreground/70">
          Order reference: <span className="font-mono font-semibold text-foreground">{searchParams.order}</span>
        </p>
      )}
      <p className="text-muted-foreground text-sm max-w-sm">
        You will receive a confirmation email with tracking details once your tree has been collected.
      </p>
      <Link href="/shop" className={buttonVariants({ variant: 'default' }) + ' bg-green-700 hover:bg-green-800 text-white'}>
        Continue Shopping
      </Link>
    </div>
  )
}
