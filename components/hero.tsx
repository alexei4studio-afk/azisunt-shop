import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background Abstract Shapes */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-12 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full mb-8 animate-fade-in">
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Curated Excellence 2026
          </span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[0.9]">
          The Art of <br />
          <span className="text-accent italic font-serif font-light">Discovery</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-12 font-light leading-relaxed">
          Nu vindem doar produse, selectăm viitorul. O vitrină exclusivistă cu obiectele care definesc tendințele globale, acum la îndemâna ta.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/category/all" className="btn-primary flex items-center gap-2 group">
            Explorează Colecția
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/category/new" className="text-sm font-semibold hover:text-accent transition-colors flex items-center gap-1">
            Vezi ultimele noutăți
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="absolute bottom-12 inset-x-0 hidden md:flex justify-center gap-24 border-t border-border/40 pt-12 mx-auto max-w-5xl">
        <div className="text-center">
          <div className="text-2xl font-bold">500+</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Produse Curate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">24H</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Trend Update</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">∞</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Inspirație Zilnică</div>
        </div>
      </div>
    </section>
  )
}
