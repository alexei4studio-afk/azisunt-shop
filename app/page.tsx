import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/hero'
import { ProductCard } from '@/components/product-card'
import { getFeaturedProducts } from '@/lib/products'
import Link from 'next/link'
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react'

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <Hero />

        {/* Value Proposition - Marketing Research Focus */}
        <section className="py-24 border-y border-border/40">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-widest">Market Research</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Analizăm peste 10.000 de puncte de date zilnic pentru a identifica produsele cu cel mai mare potențial viral.
                </p>
              </div>
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-widest">AI Curation</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Fiecare produs este trecut prin filtrul nostru AI pentru a asigura calitatea și relevanța în piața curentă.
                </p>
              </div>
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-widest">Verified Value</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Garantăm cel mai bun raport preț-calitate prin compararea directă cu marile platforme globale.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* New Categories Section - Luxury Edition */}
        <section className="py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="mb-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">The Collections</h2>
              <p className="text-muted-foreground text-lg italic font-serif">Selectate pentru a defini stilul tău de viață.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <Link 
                href="/category/home"
                className="group relative h-[500px] overflow-hidden rounded-[3rem] card-hover"
              >
                <img 
                  src="https://images.weserv.nl/?url=images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1000" 
                  alt="Home & Deco" 
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-12 left-12">
                  <p className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-2">Essential</p>
                  <h3 className="text-4xl font-bold text-white mb-4">Home & Deco</h3>
                  <div className="inline-flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                    <span className="text-sm font-bold uppercase tracking-widest">Explorează</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>

              <Link 
                href="/category/tech"
                className="group relative h-[500px] overflow-hidden rounded-[3rem] card-hover"
              >
                <img 
                  src="https://images.weserv.nl/?url=images.unsplash.com/photo-1616533703901-2a5b6f345686?w=1000" 
                  alt="Tech & Gear" 
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-12 left-12">
                  <p className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-2">Innovation</p>
                  <h3 className="text-4xl font-bold text-white mb-4">Tech & Gear</h3>
                  <div className="inline-flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                    <span className="text-sm font-bold uppercase tracking-widest">Explorează</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products - High Contrast */}
        <section className="py-32 bg-secondary/30 border-y border-border/40">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div>
                <p className="text-primary text-xs font-black uppercase tracking-[0.4em] mb-4">Selected</p>
                <h2 className="text-5xl font-bold tracking-tight">Viral Picks</h2>
              </div>
              <Link 
                href="/category/all"
                className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.2em] group"
              >
                Vezi Tot Catalogul
                <ArrowRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-2" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA - SEO/Trust focused */}
        <section className="py-32 bg-primary text-primary-foreground text-center">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 italic font-serif">Investește în Calitate.</h2>
            <p className="text-lg md:text-xl opacity-80 mb-12 font-light">
              Fiecare produs din magazinul nostru este rezultatul unui proces riguros de cercetare de piață și analiză a tendințelor. Nu facem compromisuri la calitate.
            </p>
            <Link href="/category/all" className="bg-background text-foreground px-12 py-5 rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform inline-block">
              Alătură-te Comunității
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
