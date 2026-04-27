import type { Metadata } from 'next'
import { Playfair_Display, Lato } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import { Toaster } from 'react-hot-toast'

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const lato = Lato({ subsets: ['latin'], weight: ['300', '400', '700'], variable: '--font-lato' })

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
    <html lang="en" className={`${playfair.variable} ${lato.variable} h-full`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-lato)]">
        <Navbar />
        <CartDrawer />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
