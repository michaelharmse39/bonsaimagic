'use client'
import Link from 'next/link'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useCart } from '@/store/cart'
import { useState } from 'react'

export default function Navbar() {
  const { itemCount, openCart } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-[family-name:var(--font-playfair)] font-bold text-green-800">
              Bonsai Magic
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-stone-700 hover:text-green-700 transition-colors text-sm tracking-wide uppercase">Home</Link>
            <Link href="/shop" className="text-stone-700 hover:text-green-700 transition-colors text-sm tracking-wide uppercase">Shop</Link>
            <Link href="/shop?category=beginners" className="text-stone-700 hover:text-green-700 transition-colors text-sm tracking-wide uppercase">Beginners</Link>
            <Link href="/shop?category=premium" className="text-stone-700 hover:text-green-700 transition-colors text-sm tracking-wide uppercase">Premium</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={openCart}
              className="relative p-2 text-stone-700 hover:text-green-700 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              className="md:hidden p-2 text-stone-700"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-stone-100 px-4 pb-4">
          <nav className="flex flex-col gap-3 pt-3">
            <Link href="/" onClick={() => setMenuOpen(false)} className="text-stone-700 py-2 border-b border-stone-100">Home</Link>
            <Link href="/shop" onClick={() => setMenuOpen(false)} className="text-stone-700 py-2 border-b border-stone-100">Shop</Link>
            <Link href="/shop?category=beginners" onClick={() => setMenuOpen(false)} className="text-stone-700 py-2 border-b border-stone-100">Beginners</Link>
            <Link href="/shop?category=premium" onClick={() => setMenuOpen(false)} className="text-stone-700 py-2">Premium</Link>
          </nav>
        </div>
      )}
    </header>
  )
}
