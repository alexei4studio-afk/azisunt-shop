import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/products'
import { Sparkles, ArrowUpRight } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link 
      href={`/p/${product.slug}`}
      className="group block card-hover"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-secondary transition-all">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.badge && (
            <div className="glass px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
              <Sparkles className="h-3 w-3 text-accent" />
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
                {product.badge}
              </span>
            </div>
          )}
        </div>

        {product.comparePrice && (
          <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1.5 rounded-full shadow-lg">
            -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
          </div>
        )}

        {/* Action Button - Hidden on Mobile, Hover on Desktop */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <div className="glass py-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest shadow-xl">
            Descoperă Detalii
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </div>
      
      <div className="mt-6 space-y-1 text-center px-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {product.category}
        </p>
        <h3 className="text-lg font-medium text-foreground line-clamp-1 tracking-tight">
          {product.name}
        </h3>
        <div className="flex items-center justify-center gap-3 pt-1">
          <p className="text-xl font-bold text-foreground">{product.price} Lei</p>
          {product.comparePrice && (
            <p className="text-sm text-muted-foreground line-through opacity-50">{product.comparePrice} Lei</p>
          )}
        </div>
      </div>
    </Link>
  )
}
