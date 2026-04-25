import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-sand border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="text-xl font-bold text-foreground">
              azisunt
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-md">
              Produse selectate pentru un stil de viață activ și sănătos. Îmbrăcăminte sport și accesorii wellness de calitate premium.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Magazin</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/category/new" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Noutăți
                </Link>
              </li>
              <li>
                <Link href="/category/clothing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Îmbrăcăminte Sport
                </Link>
              </li>
              <li>
                <Link href="/category/wellness" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Accesorii Wellness
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/despre-noi" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Despre Noi
                </Link>
              </li>
              <li>
                <Link href="/politica-de-confidentialitate" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Politica de Confidențialitate
                </Link>
              </li>
              <li>
                <Link href="/termeni-si-conditii" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Termeni și Condiții
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              {new Date().getFullYear()} azisunt.shop. Toate drepturile rezervate.
            </p>
            <p className="text-xs text-muted-foreground text-center md:text-right max-w-md">
              <span className="font-medium">Declarație Afiliere:</span> Unele link-uri de pe acest site sunt link-uri afiliate. Putem câștiga un comision fără costuri suplimentare pentru tine.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
