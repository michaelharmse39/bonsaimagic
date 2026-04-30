'use client'
import { useCart } from '@/store/cart'
import { X, Trash2, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCart()

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex flex-col w-full max-w-sm p-0 rounded-none border-l border-border/60 bg-background">
        <SheetHeader className="px-6 py-5 border-b border-border/60">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-[family-name:var(--font-heading)] font-light text-xl tracking-wide">Cart</SheetTitle>
            <button onClick={closeCart} className={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }))}>
              <X size={16} />
            </button>
          </div>
          {items.length > 0 && (
            <p className="jp-label mt-1">{items.reduce((s, i) => s + i.quantity, 0)} item{items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''}</p>
          )}
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            <span className="font-[family-name:var(--font-heading)] text-6xl font-light text-muted-foreground/20 select-none">竹</span>
            <p className="jp-label">Your cart is empty</p>
            <button onClick={closeCart} className="jp-label hover:text-foreground transition-colors">
              Continue browsing →
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto divide-y divide-border/40">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 px-6 py-5">
                  <div className="relative w-16 h-20 flex-shrink-0 bg-muted overflow-hidden">
                    {item.image && (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-[family-name:var(--font-heading)] font-medium text-sm text-foreground leading-tight mb-1 line-clamp-2">
                      {item.name}
                    </p>
                    <p className="font-[family-name:var(--font-heading)] text-base text-foreground mb-3">
                      R{item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center border border-border hover:border-foreground transition-colors">
                        <Minus size={10} />
                      </button>
                      <span className="text-sm w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center border border-border hover:border-foreground transition-colors">
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-muted-foreground/50 hover:text-destructive transition-colors self-start mt-0.5">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-border/60 px-6 py-6 space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="jp-label">Subtotal</span>
                <span className="font-[family-name:var(--font-heading)] text-xl font-light">R{total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Shipping calculated at checkout</p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className={cn(
                  buttonVariants(),
                  'w-full rounded-none bg-primary text-primary-foreground hover:bg-primary/90 py-4 h-auto text-xs tracking-[0.15em] uppercase font-medium justify-center'
                )}
              >
                Proceed to Checkout
              </Link>
              <button onClick={closeCart} className="w-full jp-label hover:text-foreground transition-colors text-center py-1">
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
