import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { ArrowLeft, Shield, Cookie, Settings, Scale } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politica de Confidențialitate | azisunt.shop',
  description: 'Politica de confidențialitate și utilizare cookie-uri pentru azisunt.shop.',
}

export default function PoliticaDeConfidentialitate() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          {/* Back Link */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Înapoi la magazin
          </Link>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl lg:text-4xl font-semibold text-foreground mb-4">
              Politica de Confidențialitate și utilizare Cookie-uri
            </h1>
            <p className="text-muted-foreground">
              Ultima actualizare: Martie 2026
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-10">
            {/* Date Colectate */}
            <section className="bg-sand rounded-lg p-6 lg:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-blue" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Date Colectate
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    azisunt.shop nu colectează date cu caracter personal (nume, card, adresă) deoarece nu procesăm comenzi directe. Putem colecta date tehnice anonime (IP, tip browser) prin Google Analytics pentru optimizarea experienței.
                  </p>
                </div>
              </div>
            </section>

            {/* Cookie-uri de Afiliere */}
            <section className="bg-sand rounded-lg p-6 lg:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue/10 rounded-lg flex items-center justify-center">
                  <Cookie className="h-5 w-5 text-blue" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Ce sunt Cookie-urile de Afiliere?
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Atunci când faceți click pe un link de pe site-ul nostru, un fișier "cookie" este plasat în browser-ul dumneavoastră pentru o perioadă limitată (de regulă 30 zile). Acesta servește strict la identificarea sursei vânzării pentru a ne atribui comisionul de marketing.
                  </p>
                </div>
              </div>
            </section>

            {/* Controlul Utilizatorului */}
            <section className="bg-sand rounded-lg p-6 lg:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue/10 rounded-lg flex items-center justify-center">
                  <Settings className="h-5 w-5 text-blue" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Controlul Utilizatorului
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Puteți șterge sau bloca cookie-urile din setările browser-ului dumneavoastră în orice moment.
                  </p>
                </div>
              </div>
            </section>

            {/* GDPR */}
            <section className="bg-sand rounded-lg p-6 lg:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue/10 rounded-lg flex items-center justify-center">
                  <Scale className="h-5 w-5 text-blue" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    GDPR
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Respectăm drepturile utilizatorilor conform legislației UE. Pentru orice solicitare, ne puteți contacta prin formularele dedicate.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Back to Shop */}
          <div className="mt-12 pt-8 border-t border-border">
            <Link 
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-blue text-white font-semibold px-6 py-3 rounded-lg transition-all hover:bg-blue-light hover:shadow-lg"
            >
              <ArrowLeft className="h-4 w-4" />
              Înapoi la magazin
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
