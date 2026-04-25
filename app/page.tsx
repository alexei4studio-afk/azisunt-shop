import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/hero'
import { ProductCard } from '@/components/product-card'
import { getFeaturedProducts } from '@/lib/products'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <Hero />

        {/* Categories Section */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <h2 className="text-3xl font-light text-foreground mb-12">Categorii Populare</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Link 
                href="/category/clothing"
                className="group relative h-80 overflow-hidden rounded-3xl"
              >
                <img 
                  src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1000&q=80" 
                  alt="Clothing" 
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-2xl font-semibold text-white">Îmbrăcăminte Sport</h3>
                  <p className="text-white/80 mt-2">Descoperă colecția noastră</p>
                </div>
              </Link>
              <Link 
                href="/category/wellness"
                className="group relative h-80 overflow-hidden rounded-3xl"
              >
                <img 
                  src="https://images.unsplash.com/photo-1523362628745-0c100150b504?w=1000&q=80" 
                  alt="Wellness" 
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-2xl font-semibold text-white">Accesorii Wellness</h3>
                  <p className="text-white/80 mt-2">Echipament de calitate</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20 lg:py-28 bg-sand">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl font-light text-foreground">Produse Recomandate</h2>
                <p className="text-muted-foreground mt-4">Descoperă cele mai noi adăugiri în magazin</p>
              </div>
              <Link 
                href="/category/all"
                className="hidden md:flex items-center gap-2 text-sm font-semibold text-blue hover:underline"
              >
                Vezi toate produsele
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-12 md:hidden">
              <Link 
                href="/category/all"
                className="flex items-center justify-center gap-2 bg-blue text-white font-semibold py-4 rounded-lg"
              >
                Vezi toate produsele
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
