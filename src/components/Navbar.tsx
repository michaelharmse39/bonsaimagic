'use client'
import Link from 'next/link'
import { ShoppingCart, Menu, X, Heart } from 'lucide-react'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import { useState } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { cn } from '@/lib/utils'

const SHOP_LINKS = [
  { label: 'Collection', href: '/shop' },
]

const ACCOUNT_LINKS = [
  { label: 'Track Order', href: '/track' },
  { label: 'Login', href: '/login' },
  { label: 'Register', href: '/register' },
  { label: 'Orders', href: '/orders' },
  { label: 'My Account', href: '/account' },
]

const linkCls = 'px-2 py-1 text-[10px] tracking-[0.08em] uppercase font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-sm transition-colors duration-150 whitespace-nowrap'
const iconCls = 'relative p-2 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors duration-150'

export default function Navbar() {
  const { itemCount, openCart } = useCart()
  const { count: wishlistCount } = useWishlist()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center h-12 gap-6">

          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group shrink-0">
            <span className="font-(family-name:--font-heading) text-sm font-light tracking-[0.15em] text-foreground group-hover:text-primary transition-colors leading-tight">BONSAI</span>
            <span className="font-(family-name:--font-heading) text-sm font-semibold tracking-[0.3em] text-primary leading-tight">MAGIC</span>
          </Link>

          {/* Shop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {SHOP_LINKS.map(({ label, href }) => (
              <Link key={label} href={href} className={linkCls}>{label}</Link>
            ))}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Account nav + icons grouped together */}
          <div className="hidden md:flex items-center">
            {/* Account links */}
            <div className="flex items-center gap-1 pr-3 mr-3 border-r border-border/60">
              {ACCOUNT_LINKS.map(({ label, href }) => (
                <Link key={label} href={href} className={linkCls}>{label}</Link>
              ))}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-0.5">
              <ThemeToggle />
              <Link href="/wishlist" className={iconCls} aria-label="Wishlist">
                <Heart size={16} />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-rose-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <button onClick={openCart} className={iconCls} aria-label="Open cart">
                <ShoppingCart size={16} />
                {itemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile: just icons + hamburger */}
          <div className="flex md:hidden items-center gap-0.5 ml-auto">
            <ThemeToggle />
            <Link href="/wishlist" className={iconCls} aria-label="Wishlist">
              <Heart size={16} />
            </Link>
            <button onClick={openCart} className={iconCls} aria-label="Open cart">
              <ShoppingCart size={16} />
              {itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none">
                  {itemCount}
                </span>
              )}
            </button>
            <button className={cn(iconCls)} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-background border-t border-border/60 px-6 py-5">
          <nav className="flex flex-col gap-1">
            {[{ label: 'Home', href: '/' }, ...SHOP_LINKS, ...ACCOUNT_LINKS].map(({ label, href }) => (
              <Link key={label} href={href} onClick={() => setMenuOpen(false)} className={linkCls}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
