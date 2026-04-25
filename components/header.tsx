'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, ShoppingBag, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'The Sanctuary', href: '/category/sanctuary' },
  { name: 'The Executive', href: '/category/executive' },
  { name: 'The Voyager', href: '/category/voyager' },
  { name: 'The Athlete', href: '/category/athlete' },
  { name: 'Discovery', href: '/category/all' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={cn(
      "fixed top-0 inset-x-0 z-50 transition-all duration-300",
      isScrolled ? "glass py-3" : "bg-transparent py-5"
    )}>
      <nav className="mx-auto max-w-7xl px-6 lg:px-12 flex items-center justify-between">
        <div className="flex lg:flex-1">
          <Link href="/" className="group flex items-center gap-2">
            <span className={cn(
                "text-2xl font-bold tracking-tighter transition-colors",
                isScrolled ? "text-foreground" : "text-foreground"
            )}>
              AZISUNT
            </span>
            <span className="bg-accent text-[10px] text-white font-black px-1.5 py-0.5 rounded uppercase tracking-widest">
              SHOP
            </span>
          </Link>
        </div>

        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/70 hover:text-foreground transition-colors relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="flex lg:flex-1 lg:justify-end items-center gap-6">
          <button className="text-foreground/80 hover:text-foreground transition-colors">
            <Search className="h-5 w-5" />
          </button>
          <button className="relative text-foreground/80 hover:text-foreground transition-colors">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-medium text-white">
              {/* This would ideally be dynamic */}
              0
            </span>
          </button>
          <div className="lg:hidden">
            <button
              type="button"
              className="text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={cn(
        "lg:hidden fixed inset-0 z-40 bg-background/98 backdrop-blur-xl transition-transform duration-500 pt-32 px-10",
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col gap-y-10">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-4xl font-bold tracking-tighter border-b border-border/40 pb-6"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
