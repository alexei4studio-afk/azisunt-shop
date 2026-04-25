import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { getProductsByCategory, getShopifyProducts } from '@/lib/products'
import { notFound } from 'next/navigation'

const categoryInfo: Record<string, { title: string; description: string }> = {
  new: {
    title: 'Noutăți',
    description: 'Cele mai recente produse din colecția noastră'
  },
  clothing: {
    title: 'Îmbrăcăminte Sport',
    description: 'Articole pentru antrenamente și stil de viață activ'
  },
  wellness: {
    title: 'Accesorii Wellness',
    description: 'Instrumente și accesorii pentru minte și corp'
  },
  all: {
    title: 'Toate Produsele',
    description: 'Explorează întreaga noastră colecție'
  }
}

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return ['new', 'clothing', 'wellness', 'all'].map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  const info = categoryInfo[slug]
  
  if (!info) {
    return { title: 'Category Not Found | azisunt' }
  }
  
  return {
    title: `${info.title} | azisunt`,
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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-20">
        {/* Category Header */}
        <section className="bg-sand py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <h1 className="text-4xl lg:text-5xl font-light text-foreground">
              {info.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl">
              {info.description}
            </p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-muted-foreground">
                {categoryProducts.length} {categoryProducts.length === 1 ? 'produs' : 'produse'}
              </p>
            </div>

            {categoryProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground">Nu s-au găsit produse în această categorie.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
