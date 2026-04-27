'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/store/cart'
import { urlFor } from '@/lib/sanity'
import toast from 'react-hot-toast'

interface Product {
  _id: string
  name: string
  slug: { current: string }
  price: number
  comparePrice?: number
  stock: number
  shortDescription?: string
  image: unknown
  weight?: number
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, openCart } = useCart()

  const imageUrl = product.image
    ? urlFor(product.image as Parameters<typeof urlFor>[0]).width(400).height(400).fit('crop').url()
    : null

  function handleAddToCart() {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: imageUrl ?? '',
      quantity: 1,
      weight: product.weight ?? 1,
      slug: product.slug.current,
    })
    toast.success(`${product.name} added to cart`)
    openCart()
  }

  const outOfStock = product.stock <= 0

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-stone-100">
      <Link href={`/shop/${product.slug.current}`}>
        <div className="relative aspect-square overflow-hidden bg-stone-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300 text-6xl">🌿</div>
          )}
          {outOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-stone-700 text-xs font-semibold px-3 py-1 rounded-full">Sold Out</span>
            </div>
          )}
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              SALE
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/shop/${product.slug.current}`}>
          <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-stone-800 hover:text-green-700 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        {product.shortDescription && (
          <p className="text-stone-500 text-xs mt-1 line-clamp-2">{product.shortDescription}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-green-700 font-bold text-lg">R{product.price.toFixed(2)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-stone-400 text-sm line-through ml-2">R{product.comparePrice.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="flex items-center gap-1.5 bg-green-700 hover:bg-green-800 disabled:bg-stone-300 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
          >
            <ShoppingCart size={14} />
            {outOfStock ? 'Sold Out' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  )
}
