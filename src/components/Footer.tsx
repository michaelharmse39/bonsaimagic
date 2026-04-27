import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-green-900 text-green-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-white mb-3">Bonsai Magic</h3>
            <p className="text-green-300 text-sm leading-relaxed">
              Handcrafted bonsai trees cultivated with care, delivered safely across South Africa.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 uppercase tracking-wide text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm text-green-300">
              <li><Link href="/shop" className="hover:text-white transition-colors">Shop All Trees</Link></li>
              <li><Link href="/shop?category=beginners" className="hover:text-white transition-colors">Beginner Trees</Link></li>
              <li><Link href="/shop?category=premium" className="hover:text-white transition-colors">Premium Collection</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 uppercase tracking-wide text-sm">Contact</h4>
            <ul className="space-y-2 text-sm text-green-300">
              <li>📧 info@bonsaimagic.co.za</li>
              <li>🚚 Delivered via The Courier Guy</li>
              <li>💳 Secure payments via PayFast</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-green-800 mt-8 pt-6 text-center text-xs text-green-400">
          © {new Date().getFullYear()} Bonsai Magic. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
