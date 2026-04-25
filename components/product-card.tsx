'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/products'
import { Sparkles, ArrowUpRight } from 'lucide-react'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [imgSrc, setImgSrc] = useState(product.images[0] || "/placeholder.svg")
  const [hasError, setHasError] = useState(false)

  return (
    <Link 
      href={`/p/${product.slug}`}
      className="group block card-hover"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-secondary transition-all">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-700 group-hover:scale-110 ${hasError ? 'opacity-20 grayscale' : ''}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          onError={() => {
            setImgSrc("/placeholder.svg")
            setHasError(true)
          }}
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
        
        {/* Badges */}
        <div className="absolute top-5 left-5 flex flex-col gap-2">
          {product.badge && (
            <div className="glass px-4 py-2 rounded-full flex items-center gap-2 shadow-sm border-white/40">
              <Sparkles className="h-3 w-3 text-accent" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground">
                {product.badge}
              </span>
            </div>
          )}
        </div>

        {product.comparePrice && (
          <div className="absolute top-5 right-5 bg-primary text-primary-foreground text-[10px] font-black px-3 py-1.5 rounded-full shadow-xl">
            -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
          </div>
        )}

        {/* Action Button */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <div className="glass py-4 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl border-white/40">
            View Details
            <ArrowUpRight className="h-4 w-4 text-accent" />
          </div>
        </div>
      </div>
      
      <div className="mt-6 space-y-1.5 text-center px-4">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-accent/80">
          {product.category}
        </p>
        <h3 className="text-lg font-bold text-foreground line-clamp-1 tracking-tight">
          {product.name}
        </h3>
        <div className="flex items-center justify-center gap-3">
          <p className="text-xl font-black text-foreground">{product.price} Lei</p>
          {product.comparePrice && (
            <p className="text-sm text-muted-foreground line-through opacity-40">{product.comparePrice} Lei</p>
          )}
        </div>
      </div>
    </Link>
  )
}
