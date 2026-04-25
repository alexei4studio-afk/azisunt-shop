import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'Privacy Policy | azisunt',
  description: 'Our privacy policy explains how we collect, use, and protect your information.'
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-20">
        <article className="mx-auto max-w-3xl px-4 lg:px-8 py-16">
          <h1 className="text-4xl font-light text-foreground mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-neutral max-w-none">
            <p className="text-muted-foreground leading-relaxed mb-6">
              Last updated: January 2026
            </p>
            
            <section className="mb-8">
              <h2 className="text-xl font-medium text-foreground mb-4">Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                make a purchase, subscribe to our newsletter, or contact us for support.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-medium text-foreground mb-4">How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the information we collect to process transactions, send you order confirmations, 
                respond to your requests, and improve our services.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-medium text-foreground mb-4">Information Sharing</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your personal information to outside parties 
                except as described in this policy or with your consent.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-medium text-foreground mb-4">Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use cookies to enhance your experience, analyze site traffic, and for marketing purposes. 
                You can control cookies through your browser settings.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-medium text-foreground mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this Privacy Policy, please contact us at privacy@azisunt.shop.
              </p>
            </section>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
