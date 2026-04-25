'use client'

import { useState, useEffect } from 'react'
import { 
  LayoutDashboard, 
  PlusCircle, 
  TrendingUp, 
  Settings, 
  Search, 
  CheckCircle2, 
  Video,
  ExternalLink,
  RefreshCcw,
  Store,
  Zap,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export default function ManagerDashboard() {
  const [products, setProducts] = useState([])
  const [sources, setSources] = useState([])
  const [loading, setLoading] = useState(true)
  const [showImportModal, setShowImportModal] = useState(false)
  const [importConfig, setImportConfig] = useState({ sourceId: '', url: '', count: 5 })

  useEffect(() => {
    // Load products and sources from public/data
    Promise.all([
      fetch('/data/trending-products.json').then(res => res.json()),
      fetch('/data/sources.json').then(res => res.json())
    ]).then(([pData, sData]) => {
      setProducts(pData.reverse())
      setSources(sData)
      setLoading(false)
    }).catch(err => {
      console.error("Error loading data:", err);
      setLoading(false);
    })
  }, [])

  const handleBatchImport = () => {
    alert(`Comandă trimisă către Agent: Importă ${importConfig.count} produse de la ${importConfig.sourceId} folosind link-ul: ${importConfig.url}`);
    setShowImportModal(false);
    // Aici s-ar apela un API route care pornește mega-batch-scouter.js
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white font-sans">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-black/40 border-r border-white/10 p-6 flex flex-col gap-8">
        <div className="flex items-center gap-2 px-2">
          <span className="text-xl font-black tracking-tighter">AZISUNT</span>
          <span className="bg-primary text-[10px] text-black font-black px-1.5 py-0.5 rounded uppercase">HQ</span>
        </div>

        <nav className="flex flex-col gap-2">
          <button className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl text-sm font-bold">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </button>
          <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl text-sm font-medium text-white/60">
            <Store className="h-4 w-4" /> Magazine Partenerre
          </button>
          <button 
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl text-sm font-medium text-white/60"
          >
            <Zap className="h-4 w-4 text-primary" /> Batch Import
          </button>
          <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl text-sm font-medium text-white/60">
            <TrendingUp className="h-4 w-4" /> Global Trend Scout
          </button>
        </nav>

        <div className="mt-auto bg-white/5 p-4 rounded-2xl border border-white/10 text-xs">
          <p className="uppercase text-white/40 font-bold mb-3 tracking-widest">System Health</p>
          <div className="space-y-2">
            <div className="flex justify-between"><span>Gemini 2.5:</span> <span className="text-green-500">Active</span></div>
            <div className="flex justify-between"><span>HuggingFace:</span> <span className="text-green-500">Active</span></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="ml-64 p-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Mall Control Panel</h1>
            <p className="text-white/40 italic">Manager general: Supraveghere flux hibrid Profitshare + Temu.</p>
          </div>
          <div className="flex gap-4">
            <button className="border border-white/10 bg-white/5 text-white px-6 py-3 rounded-full font-bold text-xs hover:bg-white/10 transition-colors">
              Adaugă Magazin
            </button>
            <button className="bg-primary text-black px-6 py-3 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform">
              Manual Add Product
            </button>
          </div>
        </div>

        {/* Modal Import (Simulat) */}
        {showImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
            <div className="bg-[#1A1A1A] border border-white/10 w-full max-w-lg rounded-[2.5rem] p-10 space-y-8">
              <h2 className="text-2xl font-bold">Batch Import Wizard</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-white/40 mb-2 block">Selectează Magazinul</label>
                  <select 
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm"
                    onChange={(e) => setImportConfig({...importConfig, sourceId: e.target.value})}
                  >
                    <option value="">Alege sursa...</option>
                    {sources.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-white/40 mb-2 block">Link Categorie/Căutare</label>
                  <input 
                    type="text" 
                    placeholder="https://..." 
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm"
                    onChange={(e) => setImportConfig({...importConfig, url: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-white/40 mb-2 block">Număr de produse (Max 20)</label>
                  <input 
                    type="number" 
                    placeholder="5" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm"
                    onChange={(e) => setImportConfig({...importConfig, count: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handleBatchImport}
                  className="flex-1 bg-primary text-black font-black uppercase tracking-widest text-xs py-4 rounded-xl hover:scale-[1.02] transition-transform"
                >
                  Start Import Agent
                </button>
                <button 
                  onClick={() => setShowImportModal(false)}
                  className="flex-1 bg-white/5 border border-white/10 font-bold text-xs py-4 rounded-xl"
                >
                  Anulează
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Store className="h-20 w-20" />
             </div>
             <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2 font-bold">Magazine Active</p>
             <p className="text-4xl font-bold">{sources.length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap className="h-20 w-20" />
             </div>
             <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2 font-bold">Produse Importate</p>
             <p className="text-4xl font-bold text-primary">{products.length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <CheckCircle2 className="h-20 w-20" />
             </div>
             <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2 font-bold">Catalog Health</p>
             <p className="text-xl font-bold text-green-500">OPTIMIZED</p>
          </div>
        </div>

        {/* Sources Table */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Store className="h-6 w-6 text-primary" /> Rețeaua de Magazine
          </h2>
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
             <table className="w-full text-left">
                <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-white/40">
                  <tr>
                    <th className="px-8 py-6">Magazin</th>
                    <th className="px-8 py-6">Tip Afiliere</th>
                    <th className="px-8 py-6">Status</th>
                    <th className="px-8 py-6">Acțiuni Quick-Import</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sources.map(s => (
                    <tr key={s.id} className="hover:bg-white/[0.02]">
                      <td className="px-8 py-6 font-bold">{s.name}</td>
                      <td className="px-8 py-6 text-white/60">{s.affiliateType}</td>
                      <td className="px-8 py-6">
                        <span className="bg-green-500/10 text-green-500 text-[9px] font-black px-2 py-1 rounded-full uppercase">
                          {s.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                         <button className="flex items-center gap-2 text-[10px] font-black uppercase text-primary tracking-widest">
                           Import Next 5 <ArrowRight className="h-3 w-3" />
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        </div>

        {/* Existing Products List... (kept from before but improved styling) */}
        <h2 className="text-2xl font-bold mb-6">Inventar Detaliat</h2>
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-white/40 border-b border-white/10">
                <th className="px-8 py-6 font-bold">Produs</th>
                <th className="px-8 py-6 font-bold">Preț</th>
                <th className="px-8 py-6 font-bold">Surse</th>
                <th className="px-8 py-6 font-bold">Status Marketing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img src={p.images[0]} className="h-10 w-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-sm">{p.name}</p>
                        <p className="text-[10px] text-white/40 uppercase tracking-tighter">{p.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-bold">{p.price} Lei</td>
                  <td className="px-8 py-6 text-xs text-white/60">
                    {p.affiliateUrl.includes('emag') ? 'eMAG' : 'Temu'}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-[10px] font-black text-accent uppercase tracking-widest">
                       <Video className="h-3 w-3" /> Script Ready
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
