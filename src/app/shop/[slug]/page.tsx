'use client'
import { useEffect, useState } from 'react'
import { client, urlFor } from '@/lib/sanity'
import { PRODUCT_BY_SLUG_QUERY } from '@/lib/queries'
import { useCart } from '@/store/cart'
import { PortableText } from 'next-sanity'
import Image from 'next/image'
import { ShoppingCart, Minus, Plus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { use } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface ProductDetails { species?: string; age?: number; height?: number; potSize?: string; style?: string }
interface Product {
  _id: string; name: string; slug: { current: string }; price: number; comparePrice?: number
  stock: number; description?: unknown[]; shortDescription?: string; images?: unknown[]
  details?: ProductDetails; weight?: number
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem, openCart } = useCart()

  useEffect(() => {
    client.fetch(PRODUCT_BY_SLUG_QUERY, { slug }).then((data) => {
      setProduct(data)
      setLoading(false)
    })
  }, [slug])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-green-600 dark:text-green-400 text-lg animate-pulse">Loading...</div>
    </div>
  )

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-muted-foreground text-xl">Tree not found</p>
      <Link href="/shop" className={buttonVariants({ variant: 'link' })}>Back to shop</Link>
    </div>
  )

  const images = product.images ?? []
  const currentImageUrl = images[selectedImage]
    ? urlFor(images[selectedImage]).width(800).height(800).fit('crop').url()
    : null

  function handleAddToCart() {
    if (!product) return
    const imageUrl = images[0] ? urlFor(images[0]).width(400).height(400).fit('crop').url() : ''
    addItem({ id: product._id, name: product.name, price: product.price, image: imageUrl, quantity, weight: product.weight ?? 1, slug: product.slug.current })
    toast.success(`${product.name} added to cart`)
    openCart()
  }

  const outOfStock = product.stock <= 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/shop" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'mb-6 gap-1 text-muted-foreground')}>
        <ArrowLeft size={16} /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted mb-3">
            {currentImageUrl ? (
              <Image src={currentImageUrl} alt={product.name} fill className="object-cover" priority />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">🌿</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, i) => {
                const thumbUrl = urlFor(img).width(100).height(100).fit('crop').url()
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      'relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors',
                      selectedImage === i ? 'border-green-600 dark:border-green-400' : 'border-transparent'
                    )}
                  >
                    <Image src={thumbUrl} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold text-foreground mb-2">
            {product.name}
          </h1>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-green-600 dark:text-green-400">R{product.price.toFixed(2)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <>
                <span className="text-xl text-muted-foreground line-through">R{product.comparePrice.toFixed(2)}</span>
                <Badge className="bg-red-500 hover:bg-red-500">SALE</Badge>
              </>
            )}
          </div>

          {product.shortDescription && (
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">{product.shortDescription}</p>
          )}

          {/* Tree details */}
          {product.details && (
            <div className="bg-muted/60 rounded-xl p-4 mb-6 grid grid-cols-2 gap-3">
              {product.details.species && <div><p className="text-xs text-muted-foreground uppercase tracking-wide">Species</p><p className="font-semibold text-foreground">{product.details.species}</p></div>}
              {product.details.age && <div><p className="text-xs text-muted-foreground uppercase tracking-wide">Age</p><p className="font-semibold text-foreground">{product.details.age} years</p></div>}
              {product.details.height && <div><p className="text-xs text-muted-foreground uppercase tracking-wide">Height</p><p className="font-semibold text-foreground">{product.details.height} cm</p></div>}
              {product.details.style && <div><p className="text-xs text-muted-foreground uppercase tracking-wide">Style</p><p className="font-semibold text-foreground">{product.details.style}</p></div>}
              {product.details.potSize && <div><p className="text-xs text-muted-foreground uppercase tracking-wide">Pot Size</p><p className="font-semibold text-foreground">{product.details.potSize}</p></div>}
            </div>
          )}

          {/* Quantity + Add to cart */}
          {!outOfStock ? (
            <div className="flex gap-3 mb-6">
              <div className="flex items-center border border-border rounded-lg bg-background">
                <Button variant="ghost" size="icon-sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={14} /></Button>
                <span className="px-4 font-semibold text-foreground">{quantity}</span>
                <Button variant="ghost" size="icon-sm" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}><Plus size={14} /></Button>
              </div>
              <Button onClick={handleAddToCart} className="flex-1 bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 text-white gap-2">
                <ShoppingCart size={18} /> Add to Cart
              </Button>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-muted rounded-lg text-center text-muted-foreground font-medium">
              Currently Out of Stock
            </div>
          )}

          <p className="text-xs text-muted-foreground mb-8">🚚 Ships via The Courier Guy · 💳 Secure payment via PayFast</p>

          {/* Description */}
          {product.description && (
            <div className="prose prose-stone dark:prose-invert max-w-none border-t border-border pt-6">
              <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-foreground mb-3">About this tree</h3>
              <div className="text-muted-foreground leading-relaxed">
                <PortableText value={product.description as Parameters<typeof PortableText>[0]['value']} />
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator className="my-12" />
    </div>
  )
}
