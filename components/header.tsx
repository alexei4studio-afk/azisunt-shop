'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, ShoppingBag, Search, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

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
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 2) {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        const data = await res.json()
        setSearchResults(data)
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  return (
    <header className={cn(
      "fixed top-0 inset-x-0 z-50 transition-all duration-300",
      isScrolled || searchOpen ? "glass py-3 border-b border-white/5" : "bg-transparent py-5"
    )}>
      <nav className="mx-auto max-w-7xl px-6 lg:px-12 flex items-center justify-between relative z-50">
        <div className="flex lg:flex-1">
          <a href="/" className="group flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter text-foreground">
              AZISUNT
            </span>
            <span className="bg-accent text-[10px] text-white font-black px-1.5 py-0.5 rounded uppercase tracking-widest">
              SHOP
            </span>
          </a>
        </div>

        <div className={cn(
          "hidden lg:flex lg:gap-x-12 transition-opacity duration-300",
          searchOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        )}>
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/70 hover:text-foreground transition-colors relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex lg:flex-1 lg:justify-end items-center gap-6">
          <button 
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>
          
          <button className="relative text-foreground/80 hover:text-foreground transition-colors">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-medium text-white">
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

      {/* Full Screen Search Overlay */}
      <div className={cn(
        "absolute inset-x-0 top-0 bg-background/98 backdrop-blur-xl transition-all duration-500 overflow-hidden",
        searchOpen ? "h-screen border-b border-white/10" : "h-0"
      )}>
        <div className="mx-auto max-w-4xl px-6 pt-32 pb-24">
          <div className="relative border-b-2 border-primary/20 pb-4">
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="CAUTĂ LUXUL..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-4xl lg:text-6xl font-black uppercase tracking-tighter focus:ring-0 text-foreground placeholder:text-white/5"
            />
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {searchResults.length > 0 ? (
              searchResults.map((p: any) => (
                <a 
                  key={p.id} 
                  href={`/p/${p.slug}`}
                  onClick={() => setSearchOpen(false)}
                  className="group flex items-center gap-6 p-4 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
                >
                  <div className="h-20 w-20 rounded-2xl overflow-hidden bg-black flex-shrink-0 relative">
                    <img src={p.images[0]} alt={p.name} className="object-cover h-full w-full" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-widest text-primary font-black mb-1">{p.category}</p>
                    <h3 className="text-xl font-bold leading-none mb-2">{p.name}</h3>
                    <div className="flex items-center justify-between">
                       <span className="text-sm font-medium text-white/60">{p.price} Lei</span>
                       <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                    </div>
                  </div>
                </a>
              ))
            ) : searchQuery.length > 2 ? (
              <p className="col-span-2 text-center py-20 text-white/20 italic">Nu am găsit nimic pentru această selecție.</p>
            ) : (
              <div className="col-span-2 text-center py-20">
                <p className="text-[10px] uppercase tracking-[0.5em] text-white/20 font-black mb-4">Selecții Sugerate</p>
                <div className="flex flex-wrap justify-center gap-3">
                   {['Dyson', 'Sony', 'Minimalist', 'Tech'].map(tag => (
                     <button 
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-4 py-2 rounded-full border border-white/10 text-xs font-bold hover:bg-white hover:text-black transition-all"
                     >
                       {tag}
                     </button>
                   ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "lg:hidden fixed inset-0 z-40 bg-background/98 backdrop-blur-xl transition-transform duration-500 pt-32 px-10",
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col gap-y-10">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-4xl font-bold tracking-tighter border-b border-border/40 pb-6"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </header>
  )
}
