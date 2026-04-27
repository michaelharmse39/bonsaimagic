import { client } from '@/lib/sanity'
import { PRODUCTS_QUERY, CATEGORIES_QUERY } from '@/lib/queries'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-stone-800">
          {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Collection` : 'All Bonsai Trees'}
        </h1>
        <p className="text-stone-500 mt-2">{products.length} tree{products.length !== 1 ? 's' : ''} available</p>
      </div>

      {/* Category filters */}
      {categories.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-8">
          <Link
            href="/shop"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !category ? 'bg-green-700 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All
          </Link>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {categories.map((cat: any) => (
            <Link
              key={cat._id}
              href={`/shop?category=${cat.slug.current}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === cat.slug.current
                  ? 'bg-green-700 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-6xl mb-4">🌿</p>
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-stone-600 mb-2">No trees found</h2>
          <p className="text-stone-400">Check back soon — new trees are added regularly.</p>
          {category && (
            <Link href="/shop" className="mt-4 inline-block text-green-700 underline">View all trees</Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {products.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
