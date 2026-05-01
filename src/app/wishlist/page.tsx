'use client'
import { useWishlist } from '@/store/wishlist'
import Image from 'next/image'
import Link from 'next/link'
import { X } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'

export default function WishlistPage() {
  const { items, removeItem } = useWishlist()

  if (items.length === 0) return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <span className="font-[family-name:var(--font-heading)] text-8xl font-light text-muted-foreground/20 block mb-6">♡</span>
        <p className="jp-label mb-2">Your wishlist is empty</p>
        <p className="text-sm text-muted-foreground mb-8">Save trees you love to come back to them later.</p>
        <Link href="/shop" className="jp-label hover:text-foreground transition-colors">Browse collection →</Link>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-10 py-16">
      <p className="jp-label mb-3">Saved Items</p>
      <h1 className="font-[family-name:var(--font-heading)] font-light text-3xl mb-10">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border/30">
        {items.map((item) => (
          <div key={item.id} className="bg-background p-5 relative group">
            <button
              onClick={() => removeItem(item.id)}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
              aria-label="Remove from wishlist"
            >
              <X size={14} />
            </button>
            <Link href={`/shop/${item.slug}`}>
              <div className="relative aspect-[4/5] overflow-hidden bg-muted mb-4">
                {item.image
                  ? <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                  : <div className="w-full h-full flex items-center justify-center text-5xl text-muted-foreground/30">🌿</div>
                }
              </div>
              <h3 className="font-[family-name:var(--font-heading)] font-medium text-base mb-1">{item.name}</h3>
              <p className="font-[family-name:var(--font-heading)] text-lg">R{item.price.toFixed(2)}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
