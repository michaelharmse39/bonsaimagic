import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from 'react-hot-toast'
import { cn } from '@/lib/utils'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-heading',
})
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Bonsai Magic | Handcrafted Bonsai Trees South Africa',
  description: 'Discover handcrafted bonsai trees, carefully cultivated and delivered across South Africa.',
  keywords: 'bonsai, bonsai trees, South Africa, buy bonsai, bonsai for sale',
  openGraph: {
    title: 'Bonsai Magic',
    description: 'Handcrafted bonsai trees delivered across South Africa.',
    url: 'https://bonsaimagic.co.za',
    siteName: 'Bonsai Magic',
    locale: 'en_ZA',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(cormorant.variable, inter.variable)}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-sans)] text-[15px] leading-relaxed">
        <ThemeProvider>
          <Navbar />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--card)',
                color: 'var(--card-foreground)',
                border: '1px solid var(--border)',
                borderRadius: '2px',
                fontSize: '13px',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
