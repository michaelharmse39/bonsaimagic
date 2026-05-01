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
  { label: 'Beginners', href: '/shop?category=beginners' },
  { label: 'Premium', href: '/shop?category=premium' },
  { label: 'Track Order', href: '/track' },
]

const ACCOUNT_LINKS = [
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
      {/* Account bar */}
      <div className="hidden md:block border-b border-border/40 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-end gap-1 h-9">
            {ACCOUNT_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="jp-label text-[10px] px-3 py-1 hover:text-foreground transition-colors border-r border-border/40 last:border-r-0"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group">
            <span className="font-[family-name:var(--font-heading)] text-xl font-light tracking-[0.15em] text-foreground group-hover:text-primary transition-colors">
              BONSAI
            </span>
            <span className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[0.3em] text-primary">
              MAGIC
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <Link key={label} href={href} className="jp-label hover:text-foreground transition-colors">
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
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
            <div className="border-t border-border/40 pt-4 flex flex-col gap-4">
              {ACCOUNT_LINKS.map(({ label, href }) => (
                <Link key={label} href={href} onClick={() => setMenuOpen(false)} className="jp-label hover:text-foreground transition-colors flex items-center gap-2">
                  <User size={13} />{label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
