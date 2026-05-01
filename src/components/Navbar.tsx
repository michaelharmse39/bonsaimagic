'use client'
import Link from 'next/link'
import { ShoppingCart, Menu, X, Heart } from 'lucide-react'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import { useState } from 'react'
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
        <div className="flex items-center h-12 gap-6">

          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group shrink-0 mr-2">
            <span className="font-(family-name:--font-heading) text-base font-light tracking-[0.15em] text-foreground group-hover:text-primary transition-colors leading-tight">
              BONSAI
            </span>
            <span className="font-(family-name:--font-heading) text-base font-semibold tracking-[0.3em] text-primary leading-tight">
              MAGIC
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="relative px-3 py-1.5 text-[11px] tracking-[0.1em] uppercase font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 rounded-sm hover:bg-muted/60 whitespace-nowrap"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-0.5 ml-auto">
            <ThemeToggle />
            <Link
              href="/wishlist"
              className="relative p-2 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors duration-150"
              aria-label="Wishlist"
            >
              <Heart size={16} />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-rose-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              onClick={openCart}
              className="relative p-2 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors duration-150"
              aria-label="Open cart"
            >
              <ShoppingCart size={16} />
              {itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              className={cn('md:hidden p-2 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors duration-150')}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-background border-t border-border/60 px-6 py-5">
          <nav className="flex flex-col gap-1">
            {[{ label: 'Home', href: '/' }, ...NAV_LINKS].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 text-[11px] tracking-[0.1em] uppercase font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-sm transition-colors duration-150"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
