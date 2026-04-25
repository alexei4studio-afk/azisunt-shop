import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'Terms of Service | azisunt',
  description: 'Terms and conditions for using azisunt.shop.'
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-20">
        <article className="mx-auto max-w-3xl px-4 lg:px-8 py-16">
          <h1 className="text-4xl font-light text-foreground mb-8">
            Terms of Service
          </h1>
          
          <div className="prose prose-neutral max-w-none">
            <p className="text-muted-foreground leading-relaxed mb-6">
              Last updated: January 2026
            </p>
            
            <section className="mb-8">
              <h2 className="text-xl font-medium text-foreground mb-4">Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                By accessing or using azisunt.shop, you agree to be bound by these Terms of Service 
                and all applicable laws and regulations.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-medium text-foreground mb-4">Products and Pricing</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All prices are displayed in USD and are subject to change without notice. 
                We reserve the right to modify or discontinue any product at any time.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-medium text-foreground mb-4">Affiliate Disclosure</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                azisunt.shop participates in affiliate marketing programs. This means we may earn a 
                commission when you click on certain links and make a purchase. This comes at no 
                additional cost to you. We only recommend products we genuinely believe in.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-medium text-foreground mb-4">Returns and Refunds</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We offer a 30-day return policy on most items. Products must be unused and in their 
                original packaging. Refunds will be processed within 5-10 business days.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-medium text-foreground mb-4">Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                azisunt.shop shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages arising from your use of our services.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-medium text-foreground mb-4">Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions regarding these Terms, please contact us at legal@azisunt.shop.
              </p>
            </section>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
