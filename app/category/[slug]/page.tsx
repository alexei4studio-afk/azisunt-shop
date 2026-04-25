import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { getProductsByCategory, getShopifyProducts } from '@/lib/products'
import { notFound } from 'next/navigation'

const categoryInfo: Record<string, { title: string; description: string }> = {
  home: {
    title: 'Home & Living',
    description: 'Transformă-ți spațiul cu obiecte care îmbină utilul cu estetica modernă.'
  },
  tech: {
    title: 'Tech & Gadgets',
    description: 'Inovație la îndemâna ta. Gadgeturi testate care îți fac viața mai ușoară.'
  },
  lifestyle: {
    title: 'Lifestyle Essentials',
    description: 'Accesorii și obiecte care definesc stilul tău de viață activ și modern.'
  },
  wellness: {
    title: 'Wellness & Health',
    description: 'Echipamente și accesorii pentru o stare de bine zilnică.'
  },
  all: {
    title: 'Toate Produsele',
    description: 'Explorează întreaga noastră colecție curată de produse virale.'
  }
}

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return ['home', 'tech', 'lifestyle', 'wellness', 'all'].map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  const info = categoryInfo[slug]
  
  if (!info) {
    return { title: 'Categorie Negăsită | AZISUNT' }
  }
  
  return {
    title: `${info.title} | AZISUNT`,
    description: info.description
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const info = categoryInfo[slug]
  
  if (!info) {
    notFound()
  }

  const categoryProducts = await (slug === 'all' ? getShopifyProducts() : getProductsByCategory(slug))

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-32 pb-24 lg:pt-48">
        {/* Category Header */}
        <section className="pb-16 lg:pb-24 border-b border-border/40">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="max-w-2xl">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-accent mb-4">Collection</p>
                    <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[0.9]">
                    {info.title}
                    </h1>
                    <p className="mt-8 text-lg md:text-xl text-muted-foreground font-light max-w-xl leading-relaxed">
                    {info.description}
                    </p>
                </div>
                <div className="text-sm font-bold uppercase tracking-widest opacity-50">
                    {categoryProducts.length} Results
                </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-20 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            {categoryProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-32 glass rounded-[3rem]">
                <p className="text-xl text-muted-foreground italic font-serif">În curând...</p>
                <p className="mt-4 text-sm text-muted-foreground/60 uppercase tracking-widest">Revenim cu noutăți virale în această categorie.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
