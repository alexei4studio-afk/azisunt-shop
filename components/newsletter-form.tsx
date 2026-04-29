'use client'

import { useState } from 'react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: { 'Content-Type': 'application/json' }
      })

      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      {status === 'success' ? (
        <div className="p-6 bg-primary/10 border border-primary/20 rounded-3xl animate-in fade-in zoom-in duration-500">
          <p className="text-primary font-bold uppercase tracking-widest text-sm">
            Accesul tău a fost înregistrat!
          </p>
          <p className="text-white/60 text-xs mt-2">Te vom contacta în curând cu primele selecții VIP.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 p-2 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
          <input 
            type="email" 
            required
            placeholder="Introdu adresa de email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            className="bg-transparent border-none focus:ring-0 text-white px-6 py-4 flex-1 text-sm font-medium disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={status === 'loading'}
            className="bg-primary text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Se procesează...' : 'Cere Acces'}
          </button>
        </form>
      )}
      {status === 'error' && (
        <p className="mt-2 text-red-500 text-[10px] uppercase font-bold tracking-widest">
          Eroare. Te rugăm să încerci din nou.
        </p>
      ) }
      <p className="mt-4 text-[10px] text-white/20 uppercase tracking-widest font-bold">
        Fără spam. Doar selecții de elită.
      </p>
    </div>
  )
}
