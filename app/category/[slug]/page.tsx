import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { getProductsByCategory, getAllProducts } from '@/lib/products'
import { notFound } from 'next/navigation'

const categoryInfo: Record<string, { title: string; description: string }> = {
  sanctuary: {
    title: 'The Sanctuary',
    description: 'Home, Deco & Wellness. Transformă-ți spațiul într-un refugiu de liniște și rafinament.'
  },
  executive: {
    title: 'The Executive',
    description: 'Tech & Productivity. Instrumente de precizie pentru un stil de lucru sofisticat.'
  },
  voyager: {
    title: 'The Voyager',
    description: 'Lifestyle & Travel. Accesorii esențiale pentru exploratorul urban modern.'
  },
  athlete: {
    title: 'The Athlete',
    description: 'Sport & Performance. Optimizare umană prin tehnologie și design minimalist.'
  },
  all: {
    title: 'The Discovery Catalog',
    description: 'Explorează întreaga noastră selecție curată de produse virale globale.'
  }
}

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return ['sanctuary', 'executive', 'voyager', 'athlete', 'all'].map((slug) => ({ slug }))
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

export const revalidate = 60;

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const info = categoryInfo[slug]
  
  if (!info) {
    notFound()
  }

  const categoryProducts = await (slug === 'all' ? getAllProducts() : getProductsByCategory(slug))

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-32 pb-24 lg:pt-48">
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
                <p className="mt-4 text-sm text-muted-foreground/60 uppercase tracking-widest">Revenim cu noutăți virale în această colecție.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
