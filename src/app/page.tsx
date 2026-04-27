import Link from 'next/link'
import { client } from '@/lib/sanity'
import { FEATURED_PRODUCTS_QUERY } from '@/lib/queries'
import ProductCard from '@/components/ProductCard'
import { ArrowRight, Truck, Shield, Leaf } from 'lucide-react'

export const revalidate = 60

export default async function HomePage() {
  const featured = await client.fetch(FEATURED_PRODUCTS_QUERY).catch(() => [])

  return (
    <>
      {/* Hero */}
      <section className="relative bg-green-900 text-white overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute inset-0 bg-[url('/hero-bonsai.jpg')] bg-cover bg-center opacity-30" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            <span className="text-green-300 text-sm uppercase tracking-widest font-semibold">Handcrafted in South Africa</span>
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl font-bold mt-3 mb-6 leading-tight">
              Living Art.<br />Ancient Wisdom.
            </h1>
            <p className="text-green-100 text-lg md:text-xl leading-relaxed mb-8">
              Each bonsai tree is a living sculpture, patiently shaped and cared for over years.
              Discover your perfect tree and bring nature&apos;s tranquility into your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-white text-green-900 font-semibold px-8 py-4 rounded-lg hover:bg-green-50 transition-colors"
              >
                Browse Trees <ArrowRight size={18} />
              </Link>
              <Link
                href="/shop?category=beginners"
                className="inline-flex items-center gap-2 border border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/10 transition-colors"
              >
                Starter Trees
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-[#f5f0e8] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Leaf size={24} />, title: 'Ethically Grown', desc: 'All trees are sustainably cultivated in South Africa.' },
              { icon: <Truck size={24} />, title: 'Safe Delivery', desc: 'Carefully packaged and shipped via The Courier Guy nationwide.' },
              { icon: <Shield size={24} />, title: 'Secure Payments', desc: 'Pay safely with PayFast — all major SA payment methods supported.' },
            ].map((f) => (
              <div key={f.title} className="flex gap-4 items-start p-4">
                <div className="text-green-700 mt-1 flex-shrink-0">{f.icon}</div>
                <div>
                  <h3 className="font-semibold text-stone-800">{f.title}</h3>
                  <p className="text-stone-500 text-sm mt-1">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-green-600 text-sm uppercase tracking-widest font-semibold">Handpicked for you</span>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-stone-800 mt-1">Featured Trees</h2>
            </div>
            <Link href="/shop" className="hidden md:flex items-center gap-1 text-green-700 hover:text-green-800 font-semibold text-sm">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {featured.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-green-800 text-white py-16 text-center px-4">
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold mb-4">
          Find Your Perfect Bonsai
        </h2>
        <p className="text-green-200 text-lg mb-8 max-w-xl mx-auto">
          Browse our full collection — from beginner-friendly to rare collector specimens.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-white text-green-800 font-semibold px-8 py-4 rounded-lg hover:bg-green-50 transition-colors"
        >
          Shop All Trees <ArrowRight size={18} />
        </Link>
      </section>
    </>
  )
}
