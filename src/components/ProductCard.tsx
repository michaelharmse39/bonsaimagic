'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Plus } from 'lucide-react'
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
    ? urlFor(product.image).width(600).height(700).fit('crop').url()
    : null

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: imageUrl ?? '',
      quantity: 1,
      weight: product.weight ?? 1,
      slug: product.slug.current,
    })
    toast.success(`${product.name} added`)
    openCart()
  }

  const outOfStock = product.stock <= 0
  const onSale = product.comparePrice && product.comparePrice > product.price

  return (
    <Link href={`/shop/${product.slug.current}`} className="group block p-5 hover:bg-muted/30 transition-colors">
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-muted mb-4">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-7xl select-none">
            🌿
          </div>
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="jp-label">Sold Out</span>
          </div>
        )}
        {onSale && !outOfStock && (
          <span className="absolute top-3 left-3 jp-label bg-accent text-accent-foreground px-2 py-1">
            Sale
          </span>
        )}
        {/* Add button on hover */}
        {!outOfStock && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 w-9 h-9 bg-background/90 hover:bg-background text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-border/50"
            aria-label="Add to cart"
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {/* Info */}
      <div>
        <h3 className="font-[family-name:var(--font-heading)] font-medium text-[1.1rem] text-foreground leading-tight mb-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        {product.shortDescription && (
          <p className="text-xs text-muted-foreground leading-relaxed mb-2 line-clamp-1">{product.shortDescription}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <span className="font-[family-name:var(--font-heading)] text-lg text-foreground">
            R{product.price.toFixed(2)}
          </span>
          {onSale && (
            <span className="text-sm text-muted-foreground line-through">R{product.comparePrice!.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
