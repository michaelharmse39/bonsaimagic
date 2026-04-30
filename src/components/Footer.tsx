import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <span className="font-[family-name:var(--font-heading)] text-2xl font-light tracking-[0.15em] text-foreground block">BONSAI</span>
              <span className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-[0.3em] text-primary block">MAGIC</span>
            </div>
            <p className="text-sm text-muted-foreground leading-loose max-w-xs">
              Handcrafted bonsai trees, grown with patience and delivered with care across South Africa.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="jp-label mb-5">Collection</p>
            <ul className="space-y-3">
              {[
                ['All Trees', '/shop'],
                ['Beginner Trees', '/shop?category=beginners'],
                ['Premium Collection', '/shop?category=premium'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="jp-label mb-5">Contact</p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>info@bonsaimagic.co.za</li>
              <li>Courier: The Courier Guy</li>
              <li>Payment: PayFast</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/60 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} Bonsai Magic. All rights reserved.
          </p>
          <p className="font-[family-name:var(--font-heading)] text-lg font-light text-muted-foreground/30 tracking-widest">
            盆栽
          </p>
        </div>
      </div>
    </footer>
  )
}
