import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductGallery } from '@/components/product-gallery'
import { ProductCard } from '@/components/product-card'
import { getProductBySlug, getShopifyProducts, getProductsByCategory } from '@/lib/products'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Check, Truck, RefreshCcw, ChevronLeft, Sparkles, ShieldCheck } from 'lucide-react'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getShopifyProducts()
  return products.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  
  if (!product) {
    return { title: 'Produs Negăsit | AZISUNT' }
  }
  
  const title = `${product.name} | Selecție Premium AZISUNT SHOP`
  const description = `${product.description.slice(0, 160)}... Cumpără ${product.name} la cel mai bun preț. Selecție exclusivă de lux și produse virale.`
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [product.images[0]],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.images[0]],
    },
    alternates: {
      canonical: `https://azisunt.shop/p/${slug}`,
    }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  
  if (!product) {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'AZISUNT Curated'
    },
    offers: {
      '@type': 'Offer',
      url: `https://azisunt.shop/p/${product.slug}`,
      priceCurrency: 'RON',
      price: product.price,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition'
    }
  }

  const allRelatedProducts = await getProductsByCategory(product.category)
  const relatedProducts = allRelatedProducts
    .filter(p => p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      
      <main className="pt-24 lg:pt-32">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-7xl px-6 lg:px-12 mb-8">
          <Link 
            href={`/category/${product.category}`}
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            {product.category}
          </Link>
        </div>

        {/* Product Detail */}
        <section className="pb-24 lg:pb-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
              {/* Gallery & Desktop CTA */}
              <div className="relative space-y-8">
                <ProductGallery images={product.images} productName={product.name} />
                {product.badge && (
                  <div className="absolute top-8 left-8 glass px-4 py-2 rounded-full flex items-center gap-2 z-10">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <span className="text-xs font-bold uppercase tracking-widest">{product.badge}</span>
                  </div>
                )}
                
                {/* Desktop CTA - Directly under photos */}
                <div className="hidden lg:block">
                  <Link 
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full flex items-center justify-center text-lg h-20 shadow-2xl shadow-accent/20"
                  >
                    SHOP NOW
                  </Link>
                  <p className="mt-4 text-center text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                    Stoc Limitat • Livrare Prioritară
                  </p>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col">
                <div className="space-y-8">
                  {product.isViral && (
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-accent animate-pulse">
                      Trending on {product.viralSource}
                    </div>
                  )}
                  
                  <div>
                    <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                      {product.name}
                    </h1>
                    <div className="flex items-center gap-6 mt-6">
                      <div className="flex flex-col">
                        <p className="text-3xl font-medium text-foreground">
                          {product.price} Lei
                        </p>
                        {/* Scarcity Logic */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-red-500/80">
                            DOAR {Math.floor((product.price % 5) + 2)} UNITĂȚI RĂMASE ÎN SELECȚIA CURENTĂ
                          </p>
                        </div>
                      </div>
                      {product.comparePrice && (
                        <div className="flex items-center gap-3">
                          <p className="text-lg text-muted-foreground line-through opacity-50">
                            {product.comparePrice} Lei
                          </p>
                          <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full">
                            SAVING {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Mobile CTA - Right under title/price */}
                    <div className="lg:hidden pt-8">
                      <Link 
                        href={product.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary w-full flex items-center justify-center text-lg h-16 shadow-2xl shadow-accent/20"
                      >
                        SHOP NOW
                      </Link>
                    </div>
                  </div>

                  <div className="h-px bg-border/40 mt-8" />

                  <div className="space-y-6 mt-8">
                    <p className="text-lg text-muted-foreground font-light leading-relaxed">
                      {product.description}
                    </p>

                    {/* Marketing Story / Curator's Perspective */}
                    {product.marketing?.story && (
                      <div className="bg-primary/5 border-l-2 border-primary p-8 my-12 italic">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-4 font-black not-italic">The Curator&apos;s Perspective</p>
                        <p className="text-xl text-white/80 font-serif leading-relaxed">
                          &quot;{product.marketing.story}&quot;
                        </p>
                      </div>
                    )}

                    {product.features && (
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-3 text-sm font-medium">
                            <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-3 gap-4 pt-12 border-t border-border/40">
                    <div className="text-center space-y-2">
                      <ShieldCheck className="h-5 w-5 mx-auto text-accent" />
                      <p className="text-[10px] font-bold uppercase tracking-tighter">Calitate Garantată</p>
                    </div>
                    <div className="text-center space-y-2">
                      <Truck className="h-5 w-5 mx-auto text-accent" />
                      <p className="text-[10px] font-bold uppercase tracking-tighter">Livrare Rapidă</p>
                    </div>
                    <div className="text-center space-y-2">
                      <RefreshCcw className="h-5 w-5 mx-auto text-accent" />
                      <p className="text-[10px] font-bold uppercase tracking-tighter">30 Zile Retur</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
              <h2 className="text-3xl font-bold tracking-tight mb-12">S-ar putea să-ți placă</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
