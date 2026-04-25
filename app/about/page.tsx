import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'About Us | azisunt',
  description: 'Our mission is to make mindful living accessible through sustainable, thoughtfully curated products.'
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-sand">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl lg:text-5xl font-light text-foreground leading-tight">
                Living Well, <span className="font-medium">Mindfully</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                azisunt was born from a simple belief: that the products we surround ourselves with 
                should support both our wellbeing and the health of our planet.
              </p>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80"
                  alt="Mindful living"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div>
                <h2 className="text-3xl font-light text-foreground mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    We started azisunt after years of searching for products that aligned with our 
                    values—sustainable, beautifully designed, and genuinely useful.
                  </p>
                  <p>
                    Today, we partner with artisans and suppliers around the world who share our 
                    commitment to ethical practices, sustainable materials, and exceptional craftsmanship.
                  </p>
                  <p>
                    Every product in our collection has been personally tested and thoughtfully selected 
                    to help you build daily rituals that nourish your body and mind.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 lg:py-28 bg-sand">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <h2 className="text-3xl font-light text-foreground text-center mb-16">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-olive/10 flex items-center justify-center">
                  <span className="text-2xl text-olive">01</span>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-3">Sustainability First</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Every product is evaluated for environmental impact, from materials to packaging.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-olive/10 flex items-center justify-center">
                  <span className="text-2xl text-olive">02</span>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-3">Quality Over Quantity</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We curate fewer, better things designed to last and bring joy for years.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-olive/10 flex items-center justify-center">
                  <span className="text-2xl text-olive">03</span>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-3">Radical Transparency</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We believe you deserve to know where products come from and how they're made.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
            <h2 className="text-3xl font-light text-foreground mb-6">
              Begin Your Journey
            </h2>
            <p className="text-muted-foreground mb-10 max-w-lg mx-auto">
              Explore our collection and discover products that support a healthier, more mindful way of living.
            </p>
            <Link
              href="/category/all"
              className="inline-flex items-center justify-center gap-2 bg-olive text-white font-medium px-8 py-4 rounded-full transition-all hover:bg-olive-light hover:shadow-lg"
            >
              Shop All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
