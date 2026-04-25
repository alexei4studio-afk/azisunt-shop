import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-20 bg-background">
      {/* Background Abstract Shapes - Soft Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[40%] h-[40%] bg-accent/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-12 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 bg-secondary/80 backdrop-blur-sm border border-border/50 px-5 py-2.5 rounded-full mb-10 animate-fade-in shadow-sm">
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-foreground/80">
            Curated Excellence • 2026 Edition
          </span>
        </div>
        
        <h1 className="text-6xl sm:text-7xl md:text-9xl font-bold tracking-tight mb-8 leading-[0.85] text-foreground">
          The Art of <br />
          <span className="text-accent italic font-serif font-light relative inline-block mt-2">
            Discovery
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-accent/20 rounded-full" />
          </span>
        </h1>
        
        <p className="max-w-xl mx-auto text-lg md:text-xl text-muted-foreground mb-14 font-light leading-relaxed tracking-tight">
          Curatorie de elită pentru obiectele care definesc tendințele globale. Simplitate, inovație și rafinament, toate într-o singură destinație.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <Link href="/category/all" className="btn-primary flex items-center gap-3 group px-10 py-5">
            Explorează Acum
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />
          </Link>
          <Link href="/category/new" className="text-sm font-bold uppercase tracking-widest hover:text-accent transition-all flex items-center gap-2 group">
            Noutăți Trending
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Floating Elements / Decorative Lines */}
      <div className="absolute bottom-20 left-10 hidden xl:block opacity-20">
        <div className="h-px w-32 bg-foreground" />
      </div>
      <div className="absolute bottom-20 right-10 hidden xl:block opacity-20">
        <div className="h-px w-32 bg-foreground" />
      </div>
    </section>
  )
}
