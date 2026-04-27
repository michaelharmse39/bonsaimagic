'use client'
import { useCart } from '@/store/cart'
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCart()

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={closeCart} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold">Your Cart</h2>
          <button onClick={closeCart} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-stone-400">
            <ShoppingBag size={48} strokeWidth={1} />
            <p className="text-lg">Your cart is empty</p>
            <button onClick={closeCart} className="text-green-700 underline text-sm">Continue shopping</button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 bg-stone-50 rounded-lg p-3">
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-stone-200">
                    {item.image && (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-stone-800 truncate">{item.name}</p>
                    <p className="text-green-700 font-semibold text-sm mt-1">R{item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 bg-white border border-stone-200 rounded hover:bg-stone-50"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 bg-white border border-stone-200 rounded hover:bg-stone-50"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 text-stone-400 hover:text-red-500 transition-colors self-start"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Subtotal</span>
                <span className="text-green-700">R{total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-stone-500">Shipping calculated at checkout</p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full bg-green-700 hover:bg-green-800 text-white text-center py-3 rounded-lg font-semibold transition-colors"
              >
                Proceed to Checkout
              </Link>
              <button
                onClick={closeCart}
                className="block w-full text-center text-sm text-stone-500 hover:text-stone-700"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
