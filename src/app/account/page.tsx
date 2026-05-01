import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function AccountPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <span className="font-[family-name:var(--font-heading)] text-8xl font-light text-muted-foreground/20 block mb-6">私</span>
        <p className="jp-label mb-2">My Account</p>
        <p className="text-sm text-muted-foreground mb-8 max-w-xs mx-auto">
          Sign in to manage your account, view orders, and update your details.
        </p>
        <Link href="/login" className="jp-label hover:text-foreground transition-colors inline-flex items-center gap-2">
          Sign in <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  )
}
