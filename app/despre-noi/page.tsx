import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Zap, Filter, Cpu, Heart } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Despre Noi | azisunt.shop',
  description: 'Suntem o platformă dedicată pasionaților de mișcare și tehnologie. Misiunea noastră este să filtrăm zgomotul din piața de e-commerce.',
}

export default function DespreNoiPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-semibold text-foreground mb-6">
              Despre azisunt.shop
            </h1>
            <div className="w-16 h-1 bg-blue mx-auto rounded-full" />
          </div>

          {/* Main Pitch */}
          <div className="bg-sand rounded-lg p-8 lg:p-12 mb-12">
            <p className="text-lg lg:text-xl text-foreground leading-relaxed text-center">
              Suntem o platformă dedicată pasionaților de mișcare și tehnologie. 
              Misiunea noastră este să filtrăm zgomotul din piața de e-commerce și să 
              oferim utilizatorilor o <span className="font-semibold text-blue">selecție curată</span> de 
              echipamente sportive și gadget-uri tech care contează cu adevărat.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-background border border-border rounded-lg p-6">
              <div className="w-12 h-12 bg-blue/10 rounded-lg flex items-center justify-center mb-4">
                <Filter className="w-6 h-6 text-blue" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Selecție Curată
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Filtrăm zgomotul din piața de e-commerce pentru a vă oferi doar produsele care contează cu adevărat.
              </p>
            </div>

            <div className="bg-background border border-border rounded-lg p-6">
              <div className="w-12 h-12 bg-blue/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Viteză Instantanee
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Infrastructură modernă bazată pe Next.js și Vercel pentru o experiență de navigare rapidă.
              </p>
            </div>

            <div className="bg-background border border-border rounded-lg p-6">
              <div className="w-12 h-12 bg-blue/10 rounded-lg flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6 text-blue" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Tehnologie Modernă
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Accent pe calitatea informației și simplitatea vizuală, folosind cele mai noi tehnologii web.
              </p>
            </div>

            <div className="bg-background border border-border rounded-lg p-6">
              <div className="w-12 h-12 bg-blue/10 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-blue" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Alegeri Inteligente
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Credem că un stil de viață sănătos începe cu alegeri inteligente și informate.
              </p>
            </div>
          </div>

          {/* Closing Statement */}
          <div className="text-center bg-foreground text-background rounded-lg p-8 lg:p-12">
            <p className="text-lg lg:text-xl font-medium leading-relaxed">
              La azisunt, credem că un stil de viață sănătos începe cu alegeri inteligente.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
