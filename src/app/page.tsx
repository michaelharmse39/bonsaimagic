import Link from 'next/link'
import { client } from '@/lib/sanity'
import { FEATURED_PRODUCTS_QUERY } from '@/lib/queries'
import ProductCard from '@/components/ProductCard'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const revalidate = 60

export default async function HomePage() {
  const featured = await client.fetch(FEATURED_PRODUCTS_QUERY).catch(() => [])

  return (
    <>
      {/* Hero — full bleed editorial */}
      <section className="relative min-h-[92vh] flex items-end bg-[#0e0d0b] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-bonsai.jpg')] bg-cover bg-center opacity-40" />
        {/* Subtle vertical line — Japanese aesthetic */}
        <div className="absolute left-[10%] top-0 bottom-0 w-px bg-white/10 hidden lg:block" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pb-20 pt-32">
          <div className="max-w-xl">
            <p className="jp-label text-white/50 mb-6">South Africa · Est. 2024</p>
            <h1 className="font-[family-name:var(--font-heading)] font-light text-white leading-[1.1] mb-8" style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)' }}>
              Living<br />
              <em className="not-italic font-semibold">Art.</em>
            </h1>
            <div className="w-12 h-px bg-white/40 mb-8" />
            <p className="text-white/60 text-base leading-loose mb-10 max-w-sm font-light">
              Each bonsai is a living sculpture — patiently shaped over years,
              rooted in the ancient art of Japan.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/shop"
                className={cn(
                  buttonVariants(),
                  'bg-white text-[#0e0d0b] hover:bg-white/90 rounded-none px-8 py-3 h-auto text-xs tracking-[0.15em] uppercase font-medium gap-2'
                )}
              >
                Explore Collection <ArrowRight size={14} />
              </Link>
              <Link
                href="/shop?category=beginners"
                className="text-white/60 hover:text-white text-xs tracking-[0.15em] uppercase flex items-center gap-2 transition-colors px-2"
              >
                Beginner Trees
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy strip */}
      <section className="border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/50">
          {[
            { kanji: '自然', label: 'Shizen', desc: 'Naturally cultivated in South Africa, embracing imperfection.' },
            { kanji: '間', label: 'Ma', desc: 'Delivered with care via The Courier Guy to your door.' },
            { kanji: '静', label: 'Shizuka', desc: 'Secure payment via PayFast. Complete peace of mind.' },
          ].map((item) => (
            <div key={item.kanji} className="py-8 md:py-0 md:px-10 first:pl-0 last:pr-0">
              <span className="font-[family-name:var(--font-heading)] text-4xl font-light text-muted-foreground/40 block mb-3">
                {item.kanji}
              </span>
              <p className="jp-label text-foreground mb-2">{item.label}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="jp-label mb-3">Handpicked Selection</p>
              <h2 className="font-[family-name:var(--font-heading)] font-light text-foreground" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                Featured Trees
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden md:flex items-center gap-2 jp-label hover:text-foreground transition-colors"
            >
              All Trees <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border/40">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {featured.map((product: any) => (
              <div key={product._id} className="bg-background">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <div className="mt-10 text-center md:hidden">
            <Link href="/shop" className="jp-label hover:text-foreground transition-colors inline-flex items-center gap-2">
              View All Trees <ArrowRight size={12} />
            </Link>
          </div>
        </section>
      )}

      {/* Quote / CTA */}
      <section className="border-t border-border/50 bg-muted/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="jp-label mb-6">The Bonsai Magic Way</p>
            <blockquote className="font-[family-name:var(--font-heading)] font-light text-foreground leading-snug" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              &ldquo;In the space between root and sky, patience becomes art.&rdquo;
            </blockquote>
          </div>
          <div className="flex flex-col gap-4 lg:items-end">
            <p className="text-muted-foreground text-sm leading-loose max-w-sm lg:text-right">
              Every tree in our collection has been grown, shaped, and cared for
              over many years before finding its new home.
            </p>
            <Link
              href="/shop"
              className={cn(
                buttonVariants(),
                'bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-8 py-3 h-auto text-xs tracking-[0.15em] uppercase font-medium gap-2 w-fit'
              )}
            >
              Shop All Trees <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
