import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans',
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: 'AZISUNT | The Art of Viral Discovery & Market Research',
  description: 'Descoperă produsele care definesc tendințele globale. Cercetare de piață bazată pe date și curatoriere AI pentru un stil de viață modern și rafinat.',
  keywords: 'trending products, viral tiktok, luxury tech, home decor hacks, market research gadgets, azisunt.shop',
  openGraph: {
    title: 'AZISUNT | Curated Excellence',
    description: 'The Art of Viral Discovery. Descoperă produsele viitorului.',
    url: 'https://azisunt.shop',
    siteName: 'AZISUNT.SHOP',
    locale: 'ro_RO',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#FDFCF0', // Champagne theme color
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AZISUNT SHOP',
    url: 'https://azisunt.shop',
    description: 'The Art of Viral Discovery. Descoperă produsele care definesc tendințele globale.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://azisunt.shop/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <html lang="ro" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://azisunt.shop" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
