'use client'
import Link from 'next/link'
import { ShoppingCart, Menu, X, Heart } from 'lucide-react'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/ThemeToggle'
import { cn } from '@/lib/utils'

interface NavbarProps {
  user: { firstName: string; email: string } | null
}

const linkCls = 'px-2 py-1 text-[10px] tracking-[0.08em] uppercase font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-sm transition-colors duration-150 whitespace-nowrap'
const iconCls = 'relative p-2 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors duration-150'

export default function Navbar({ user }: NavbarProps) {
  const { items, openCart } = useCart()
  const { items: wishlistItems } = useWishlist()
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const wishlistCount = wishlistItems.length
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const guestLinks = [
    { label: 'My Account', href: '/login' },
  ]

  const authLinks = [
    { label: 'Orders', href: '/orders' },
    { label: 'Profile', href: '/profile' },
    { label: 'Track Order', href: '/track' },
  ]

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
            <Link href="/shop" className={linkCls}>Collection</Link>
          </nav>

          <div className="flex-1" />

          {/* Desktop account nav */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center gap-1 pr-3 mr-3 border-r border-border/60">
              {user ? (
                <>
                  {authLinks.map(({ label, href }) => (
                    <Link key={label} href={href} className={linkCls}>{label}</Link>
                  ))}
                  <button onClick={handleLogout} className={linkCls}>Sign Out</button>
                </>
              ) : (
                guestLinks.map(({ label, href }) => (
                  <Link key={label} href={href} className={linkCls}>{label}</Link>
                ))
              )}
            </div>

            <div className="flex items-center gap-0.5">
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
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile icons + hamburger */}
          <div className="flex md:hidden items-center gap-0.5 ml-auto">
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
            <ThemeToggle />
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
            <Link href="/" onClick={() => setMenuOpen(false)} className={linkCls}>Home</Link>
            <Link href="/shop" onClick={() => setMenuOpen(false)} className={linkCls}>Collection</Link>
            {user ? (
              <>
                {authLinks.map(({ label, href }) => (
                  <Link key={label} href={href} onClick={() => setMenuOpen(false)} className={linkCls}>{label}</Link>
                ))}
                <button onClick={() => { setMenuOpen(false); handleLogout() }} className={cn(linkCls, 'text-left')}>Sign Out</button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)} className={linkCls}>Login</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
