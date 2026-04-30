import { client } from '@/lib/sanity'
import { PRODUCTS_QUERY, CATEGORIES_QUERY } from '@/lib/queries'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export const revalidate = 60

interface SearchParams { category?: string }

export default async function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { category } = await searchParams
  const [allProducts, categories] = await Promise.all([
    client.fetch(PRODUCTS_QUERY).catch(() => []),
    client.fetch(CATEGORIES_QUERY).catch(() => []),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const products = category
    ? allProducts.filter((p: any) => p.category?.slug?.current === category)
    : allProducts

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10">
      {/* Page header */}
      <div className="py-16 border-b border-border/60">
        <p className="jp-label mb-3">Bonsai Magic</p>
        <h1 className="font-[family-name:var(--font-heading)] font-light text-foreground" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
          {category
            ? category.charAt(0).toUpperCase() + category.slice(1)
            : 'The Collection'}
        </h1>
      </div>

      {/* Filters + count */}
      <div className="flex items-center justify-between py-6 border-b border-border/60">
        <div className="flex items-center gap-1">
          <Link
            href="/shop"
            className={cn(
              'jp-label px-4 py-2 transition-colors',
              !category ? 'text-foreground border-b border-foreground' : 'hover:text-foreground'
            )}
          >
            All
          </Link>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {categories.map((cat: any) => (
            <Link
              key={cat._id}
              href={`/shop?category=${cat.slug.current}`}
              className={cn(
                'jp-label px-4 py-2 transition-colors',
                category === cat.slug.current
                  ? 'text-foreground border-b border-foreground'
                  : 'hover:text-foreground'
              )}
            >
              {cat.name}
            </Link>
          ))}
        </div>
        <p className="jp-label hidden sm:block">{products.length} {products.length === 1 ? 'tree' : 'trees'}</p>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="py-32 text-center">
          <span className="font-[family-name:var(--font-heading)] text-8xl font-light text-muted-foreground/20 block mb-6">空</span>
          <p className="jp-label mb-2">No trees found</p>
          <p className="text-sm text-muted-foreground">New trees are added regularly — check back soon.</p>
          {category && (
            <Link href="/shop" className="jp-label hover:text-foreground transition-colors mt-6 inline-block">
              View all trees →
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-border/30 mt-px">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {products.map((product: any) => (
            <div key={product._id} className="bg-background">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      <div className="h-24" />
    </div>
  )
}
