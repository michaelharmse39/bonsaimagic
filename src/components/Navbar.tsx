'use client'
import Link from 'next/link'
import { ShoppingCart, Menu, X, Heart, User } from 'lucide-react'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import { useState } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Collection', href: '/shop' },
  { label: 'Track Order', href: '/track' },
  { label: 'Login', href: '/login' },
  { label: 'Register', href: '/register' },
  { label: 'Orders', href: '/orders' },
  { label: 'My Account', href: '/account' },
]

export default function Navbar() {
  const { itemCount, openCart } = useCart()
  const { count: wishlistCount } = useWishlist()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group shrink-0">
            <span className="font-(family-name:--font-heading) text-xl font-light tracking-[0.15em] text-foreground group-hover:text-primary transition-colors">
              BONSAI
            </span>
            <span className="font-(family-name:--font-heading) text-xl font-semibold tracking-[0.3em] text-primary">
              MAGIC
            </span>
          </Link>

          {/* Desktop nav — all links in one row */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ label, href }) => (
              <Link key={label} href={href} className="jp-label hover:text-foreground transition-colors whitespace-nowrap">
                {label}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/wishlist"
              className={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }), 'relative')}
              aria-label="Wishlist"
            >
              <Heart size={17} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              onClick={openCart}
              className={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }), 'relative')}
              aria-label="Open cart"
            >
              <ShoppingCart size={17} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              className={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }), 'md:hidden')}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-background border-t border-border/60 px-6 py-6">
          <nav className="flex flex-col gap-5">
            {[{ label: 'Home', href: '/' }, ...NAV_LINKS].map(({ label, href }) => (
              <Link key={label} href={href} onClick={() => setMenuOpen(false)} className="jp-label hover:text-foreground transition-colors">
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
