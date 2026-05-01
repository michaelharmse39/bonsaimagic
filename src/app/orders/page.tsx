import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function OrdersPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <span className="font-[family-name:var(--font-heading)] text-8xl font-light text-muted-foreground/20 block mb-6">注文</span>
        <p className="jp-label mb-2">Order History</p>
        <p className="text-sm text-muted-foreground mb-8 max-w-xs mx-auto">
          Sign in to view your order history, or track an existing order below.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login" className="jp-label hover:text-foreground transition-colors inline-flex items-center gap-2">
            Sign in to view orders <ArrowRight size={12} />
          </Link>
          <Link href="/track" className="jp-label hover:text-foreground transition-colors inline-flex items-center gap-2">
            Track an order <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  )
}
