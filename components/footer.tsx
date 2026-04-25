import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-background border-t border-border/40 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 lg:gap-24">
          {/* Brand */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="text-2xl font-bold tracking-tighter">
              AZISUNT
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm italic font-serif">
              "The Art of Discovery." Curatorierea celor mai fascinante tendințe globale, transformate în experiențe de lux accesibile.
            </p>
            <div className="flex gap-4">
              {/* Placeholder for social links */}
              <div className="w-8 h-8 rounded-full bg-secondary/50" />
              <div className="w-8 h-8 rounded-full bg-secondary/50" />
              <div className="w-8 h-8 rounded-full bg-secondary/50" />
            </div>
          </div>

          {/* Collections */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground mb-8">Colecții</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/category/sanctuary" className="text-sm text-muted-foreground hover:text-accent transition-colors font-medium">
                  The Sanctuary
                </Link>
              </li>
              <li>
                <Link href="/category/executive" className="text-sm text-muted-foreground hover:text-accent transition-colors font-medium">
                  The Executive
                </Link>
              </li>
              <li>
                <Link href="/category/voyager" className="text-sm text-muted-foreground hover:text-accent transition-colors font-medium">
                  The Voyager
                </Link>
              </li>
              <li>
                <Link href="/category/athlete" className="text-sm text-muted-foreground hover:text-accent transition-colors font-medium">
                  The Athlete
                </Link>
              </li>
            </ul>
          </div>

          {/* Intelligence */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground mb-8">Intelligence</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/despre-noi" className="text-sm text-muted-foreground hover:text-accent transition-colors font-medium">
                  About Discovery
                </Link>
              </li>
              <li>
                <Link href="/politica-de-confidentialitate" className="text-sm text-muted-foreground hover:text-accent transition-colors font-medium">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/termeni-si-conditii" className="text-sm text-muted-foreground hover:text-accent transition-colors font-medium">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-24 pt-12 border-t border-border/40">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
              © {new Date().getFullYear()} AZISUNT.SHOP. Toate drepturile rezervate.
            </p>
            <p className="text-[10px] text-muted-foreground text-center md:text-right max-w-md uppercase tracking-widest leading-loose font-bold opacity-60">
              <span className="text-accent">Disclosure:</span> Selectăm produse prin cercetare de piață riguroasă. Putem câștiga comisioane prin link-uri de afiliere verificate.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
