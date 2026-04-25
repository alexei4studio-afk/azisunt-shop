import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termeni și Condiții - azisunt.shop',
  description: 'Termenii și condițiile de utilizare a platformei azisunt.shop',
}

export default function TermeniSiConditii() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-semibold text-foreground mb-12">
            Termeni și Condiții
          </h1>
          
          <div className="space-y-10">
            {/* Introducere */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                Introducere
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Bine ați venit pe azisunt.shop. Acest site funcționează ca un agregator de produse și platformă de recomandări în nișele Sport, Wellness și Tech.
              </p>
            </section>

            {/* Natura Serviciilor */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                Natura Serviciilor
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                azisunt.shop nu vinde direct produse. Toate tranzacțiile, plățile și livrările sunt procesate pe site-urile partenerilor noștri (advertiseri).
              </p>
            </section>

            {/* Afiliere */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                Afiliere
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Utilizatorul ia la cunoștință faptul că accesarea anumitor butoane (ex: &quot;Verifică Disponibilitatea&quot;) poate genera un comision pentru azisunt.shop, fără niciun cost suplimentar pentru utilizator.
              </p>
            </section>

            {/* Răspundere */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                Răspundere
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Nu ne asumăm răspunderea pentru modificările de preț, stoc sau politici de retur ale magazinelor partenere. Recomandăm verificarea specificațiilor direct pe site-ul vânzătorului final.
              </p>
            </section>

            {/* Proprietate Intelectuală */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                Proprietate Intelectuală
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Design-ul site-ului și selecția de conținut aparțin azisunt.shop.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
