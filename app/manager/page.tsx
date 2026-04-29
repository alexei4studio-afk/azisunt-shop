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
  ArrowRight,
  Link as LinkIcon,
  Copy,
  Check,
  Users,
  Download,
  Sparkles,
  Music
} from 'lucide-react'
import Link from 'next/link'

export default function ManagerDashboard() {
  const [products, setProducts] = useState<any[]>([])
  const [sources, setSources] = useState([])
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [maintenanceRunning, setMaintenanceRunning] = useState(false)
  const [rewritingId, setRewritingId] = useState<string | null>(null)
  const [orchestraRunning, setOrchestraRunning] = useState(false)
  const [maintenanceLog, setMaintenanceLog] = useState('')
  const [showImportModal, setShowImportModal] = useState(false)
  const [importConfig, setImportConfig] = useState({ sourceId: 'temu', url: '', count: 5 })

  // Orchestra config
  const [orchestraUrls, setOrchestraUrls] = useState('')
  const [orchestraSteps, setOrchestraSteps] = useState({
    trendScout: true,
    import: true,
    rewrite: true,
    qc: true,
    socialKit: true,
  })
  
  // Profitshare Tool State
  const [targetUrl, setTargetUrl] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const [copied, setCopied] = useState(false)

  const PS_EMAG_HASH = "15748651"

  const fetchData = () => {
    const timestamp = Date.now();
    setLoading(true);
    Promise.all([
      fetch(`/api/products?v=${timestamp}`).then(res => res.json()),
      fetch(`/data/sources.json?v=${timestamp}`).then(res => res.json()),
      fetch(`/api/newsletter?v=${timestamp}`).then(res => res.json())
    ]).then(([pData, sData, lData]) => {
      setProducts(pData.reverse())
      setSources(sData)
      setLeads(lData || [])
      setLoading(false)
    }).catch(err => {
      console.error("Error loading data:", err);
      setLoading(false);
    })
  }

  const checkMaintenanceStatus = async () => {
    try {
      const res = await fetch('/api/manager/maintenance')
      const data = await res.json()
      if (data.status === 'running') {
        setMaintenanceRunning(true)
        setMaintenanceLog(data.log)
        setTimeout(checkMaintenanceStatus, 3000)
      } else if (data.status === 'finished') {
        setMaintenanceLog('Curățenie finalizată.')
        if (maintenanceRunning) {
           setMaintenanceRunning(false)
           fetchData()
        }
      }
    } catch (e) {}
  }

  useEffect(() => {
    fetchData()
  }, [])

  const editProduct = async (p: any) => {
    const newName = prompt('Nume nou produs:', p.name)
    const newPrice = prompt('Preț nou (Lei):', p.price)
    const newDesc = prompt('Descriere nouă:', p.description)
    
    console.log('Imagini actuale:', p.images)
    const newImgsRaw = prompt('Imagini (separate prin virgulă):', p.images.join(', '))
    
    if (newName && newPrice) {
      const imagesArray = newImgsRaw ? newImgsRaw.split(',').map(s => s.trim()) : p.images
      
      const res = await fetch(`/api/products/${p.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ 
          name: newName, 
          price: parseFloat(newPrice),
          description: newDesc || p.description,
          images: imagesArray
        })
      })
      if (res.ok) fetchData()
    }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Ești sigur că vrei să ștergi acest produs?')) return
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
    if (res.ok) fetchData()
  }

  const rewriteWithAI = async (id: string) => {
    setRewritingId(id)
    try {
      const res = await fetch('/api/manager/rewrite', {
        method: 'POST',
        body: JSON.stringify({ id })
      })
      if (res.ok) {
        alert('Rescrierea de lux a început. Revizuiește catalogul în 10-20 secunde.')
        setTimeout(fetchData, 15000) // Refresh after 15s
      }
    } catch (e) {
      alert('Eroare la pornirea procesului AI.')
    } finally {
      setRewritingId(null)
    }
  }

  const runOrchestra = async () => {
    const urls = orchestraUrls
      .split('\n')
      .map(u => u.trim())
      .filter(u => u.startsWith('http'))

    const activeSteps = Object.entries(orchestraSteps).filter(([, v]) => v).map(([k]) => k)
    if (activeSteps.length === 0 && urls.length === 0) {
      alert('Selectează cel puțin un pas sau adaugă URL-uri.')
      return
    }

    setOrchestraRunning(true)
    try {
      const res = await fetch('/api/manager/orchestra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          urls,
          steps: orchestraSteps,
        })
      })
      if (res.ok) {
        const stepNames: Record<string, string> = {
          trendScout: 'Trend Scout',
          import: 'Import',
          rewrite: 'AI Rewrite',
          qc: 'Quality Control',
          socialKit: 'Social Media Kit'
        }
        const active = activeSteps.map(s => stepNames[s] || s).join(' → ')
        alert(`Orchestra a început! Pași activi: ${active}${urls.length > 0 ? ` + ${urls.length} URL-uri custom` : ''}`)
      }
    } catch (e) {
      alert('Eroare la pornirea orchestrei.')
    } finally {
      setTimeout(() => setOrchestraRunning(false), 5000)
    }
  }

  const togglePromo = async (id: string, currentPromo: boolean) => {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isViral: !currentPromo, badge: !currentPromo ? 'TRENDING' : 'LIMITED EDITION' })
    })
    if (res.ok) fetchData()
  }

  const runMaintenance = async () => {
    if (!confirm('Vrei să pornești curățenia generală? Acest proces va șterge link-urile moarte și produsele fără poze.')) return
    setMaintenanceRunning(true)
    try {
      await fetch('/api/manager/maintenance', { method: 'POST' })
      setMaintenanceLog('Se pornește agentul...')
      setTimeout(checkMaintenanceStatus, 2000)
    } catch (e) {
      alert('Eroare la pornire')
      setMaintenanceRunning(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }


  const handleBatchImport = async () => {
    const res = await fetch('/api/manager/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(importConfig)
    })
    if (res.ok) {
      alert('Importul a fost pornit în fundal. Produsele vor apărea în câteva minute.')
      setShowImportModal(false)
    }
  }

  const [deploying, setDeploying] = useState(false)
  const [deployLog, setDeployLog] = useState('')

  const generatePSLink = () => {
    if (!targetUrl) return
    const link = `https://l.profitshare.ro/l/${PS_EMAG_HASH}?redirect=${encodeURIComponent(targetUrl)}`
    setGeneratedLink(link)
  }

  const exportLeadsToCSV = () => {
    if (leads.length === 0) {
      alert('Nu există lead-uri de exportat.');
      return;
    }
    
    const headers = ['Email', 'Data', 'Sursa'];
    const rows = leads.map((l: any) => [
      l.email, 
      new Date(l.date).toLocaleString('ro-RO'), 
      l.source
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `azisunt-leads-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <button 
            onClick={runMaintenance}
            disabled={maintenanceRunning}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${maintenanceRunning ? 'text-white/20' : 'text-white/60 hover:bg-white/5'}`}
          >
            <RefreshCcw className={`h-4 w-4 ${maintenanceRunning ? 'animate-spin' : ''}`} /> 
            {maintenanceRunning ? 'Curățare...' : 'Maintenance Agent'}
          </button>

          {maintenanceLog && (
            <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-[9px] uppercase font-bold text-white/40 mb-1">Live Log</p>
              <p className="text-[10px] font-mono text-primary/80 line-clamp-3">{maintenanceLog}</p>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-[9px] uppercase font-bold text-white/30 mb-2 tracking-widest px-4">Admin</p>
            <Link
              href="/admin/products/create"
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl text-sm font-medium text-white/60"
            >
              <PlusCircle className="h-4 w-4 text-green-400" /> Add Product
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl text-sm font-medium text-white/60"
            >
              <Settings className="h-4 w-4" /> Product Editor
            </Link>
          </div>
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

        {/* Master Orchestra & Maintenance Control */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Orchestra Card */}
          <div className="bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30 rounded-[2.5rem] p-10 relative overflow-hidden group lg:col-span-2">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
               <Music className="h-32 w-32" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black tracking-tighter mb-6 flex items-center gap-3">
                <span className="bg-primary text-black px-3 py-1 rounded-xl text-sm">PRO</span>
                THE ORCHESTRA
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Step Toggles */}
                <div>
                  <p className="text-[10px] uppercase font-bold text-white/40 mb-3 tracking-widest">Pași Pipeline</p>
                  <div className="space-y-2">
                    {[
                      { key: 'trendScout', label: 'Trend Scout', desc: 'Caută produse trending pe eMAG' },
                      { key: 'import', label: 'Import', desc: 'Importă produse din URL-uri' },
                      { key: 'rewrite', label: 'AI Rewrite', desc: 'Rescriere luxury cu Gemini' },
                      { key: 'qc', label: 'Quality Control', desc: 'Verifică linkuri + imagini' },
                      { key: 'socialKit', label: 'Social Media Kit', desc: 'Generează materiale marketing' },
                    ].map(step => (
                      <label key={step.key} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={orchestraSteps[step.key as keyof typeof orchestraSteps]}
                          onChange={() => setOrchestraSteps(prev => ({
                            ...prev,
                            [step.key]: !prev[step.key as keyof typeof prev]
                          }))}
                          className="w-4 h-4 accent-amber-400 rounded"
                        />
                        <div>
                          <p className="text-sm font-bold">{step.label}</p>
                          <p className="text-[10px] text-white/40">{step.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Custom URLs */}
                <div>
                  <p className="text-[10px] uppercase font-bold text-white/40 mb-3 tracking-widest">URL-uri Custom (opțional)</p>
                  <textarea
                    value={orchestraUrls}
                    onChange={(e) => setOrchestraUrls(e.target.value)}
                    placeholder={"Pune câte un link pe linie:\nhttps://www.emag.ro/p/produs-1\nhttps://www.emag.ro/p/produs-2\nhttps://www.temu.com/..."}
                    className="w-full h-44 bg-black/40 border border-white/10 rounded-xl p-4 text-sm font-mono text-white/80 placeholder:text-white/20 resize-none focus:border-primary/50 focus:outline-none transition-colors"
                  />
                  <p className="text-[10px] text-white/30 mt-2">
                    {orchestraUrls.split('\n').filter(u => u.trim().startsWith('http')).length} URL-uri detectate — se adaugă la Trend Scout
                  </p>
                </div>
              </div>

              <button
                onClick={runOrchestra}
                disabled={orchestraRunning}
                className={`group flex items-center justify-center gap-4 w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-sm transition-all ${
                  orchestraRunning
                  ? 'bg-white/5 text-white/20'
                  : 'bg-primary text-black hover:bg-white hover:scale-[1.02] shadow-[0_0_50px_-12px_rgba(255,215,0,0.3)]'
                }`}
              >
                {orchestraRunning ? 'Orchestra is Playing...' : 'ACTIVATE ORCHESTRA'}
                {!orchestraRunning && <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />}
              </button>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group">
            <div className={`absolute inset-0 bg-primary/5 transition-opacity ${maintenanceRunning ? 'opacity-100' : 'opacity-0'}`}>
              <div className="absolute inset-0 animate-pulse bg-primary/10"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <RefreshCcw className={`h-6 w-6 text-primary ${maintenanceRunning ? 'animate-spin' : ''}`} />
                  <h2 className="text-xl font-bold">System Maintenance</h2>
                </div>
                {maintenanceRunning && (
                  <span className="bg-primary/20 text-primary text-[10px] font-black px-2 py-1 rounded-full animate-pulse">
                    RUNNING
                  </span>
                )}
              </div>
              
              <p className="text-sm text-white/40 mb-8">
                Verifică link-urile moarte, stocurile eMAG și Temu, și curăță baza de date de duplicate.
              </p>

              <button 
                onClick={runMaintenance}
                disabled={maintenanceRunning}
                className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all ${
                  maintenanceRunning 
                  ? 'bg-white/5 text-white/20 cursor-not-allowed' 
                  : 'bg-white text-black hover:bg-primary hover:scale-[1.02]'
                }`}
              >
                {maintenanceRunning ? 'Processing Catalog...' : 'START FULL SYSTEM SCAN'}
              </button>
            </div>
          </div>
        </div>

        {/* Profitshare Deep Link Tool */}

        {/* Modal Import */}
        {showImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
            <div className="bg-[#1A1A1A] border border-white/10 w-full max-w-lg rounded-[2.5rem] p-10 space-y-8">
              <h2 className="text-2xl font-bold">Batch Import Wizard</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-white/40 mb-2 block">Selectează Magazinul</label>
                  <select 
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white"
                    value={importConfig.sourceId}
                    onChange={(e) => setImportConfig({...importConfig, sourceId: e.target.value})}
                  >
                    <option value="temu">Temu (Global Arbitrage)</option>
                    <option value="emag">eMAG (Affiliate Profitshare)</option>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
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
             <p className="text-xl font-bold text-green-500 uppercase tracking-widest">Optimized</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] border-primary/20">
             <p className="text-[10px] uppercase tracking-widest text-primary mb-2 font-bold">Deploy</p>
             <button
               onClick={async () => {
                 if (!confirm('Push to production? Vercel va face deploy automat.')) return
                 setDeploying(true)
                 setDeployLog('')
                 try {
                   const res = await fetch('/api/manager/deploy', { method: 'POST' })
                   const data = await res.json()
                   if (res.ok) {
                     setDeployLog(data.message || 'Push reușit!')
                   } else {
                     setDeployLog(data.error || 'Eroare la push')
                   }
                 } catch (e) {
                   setDeployLog('Eroare de conexiune')
                 } finally {
                   setDeploying(false)
                 }
               }}
               disabled={deploying}
               className={`w-full text-[9px] font-black uppercase tracking-widest px-2 py-3 rounded transition-all ${
                 deploying ? 'bg-white/10 text-white/30' : 'bg-primary text-black hover:bg-white'
               }`}
             >
               {deploying ? 'Pushing...' : 'Git Push & Deploy'}
             </button>
             {deployLog && (
               <p className="text-[10px] mt-2 text-primary/80 font-mono">{deployLog}</p>
             )}
          </div>
        </div>

        {/* VIP Leads Section */}
        <div className="flex items-center justify-between mb-6 mt-16">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Users className="h-6 w-6 text-accent" /> VIP Leads (Newsletter)
          </h2>
          <button 
            onClick={exportLeadsToCSV}
            className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all"
          >
            <Download className="h-3 w-3" /> Export CSV
          </button>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden mb-16">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-white/40 border-b border-white/10">
                <th className="px-8 py-6 font-bold">Email</th>
                <th className="px-8 py-6 font-bold">Data Înscrierii</th>
                <th className="px-8 py-6 font-bold">Sursă</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-8 py-12 text-center text-white/20 italic text-sm">
                    Niciun lead înregistrat momentan.
                  </td>
                </tr>
              ) : (
                leads.map((lead: any, idx: number) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6 font-bold text-sm text-primary">{lead.email}</td>
                    <td className="px-8 py-6 text-xs text-white/40">
                      {new Date(lead.date).toLocaleString('ro-RO')}
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[9px] font-black bg-white/10 px-2 py-1 rounded">
                        {lead.source}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Inventory List */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Zap className="h-6 w-6 text-primary" /> Inventar Detaliat
        </h2>
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-white/40 border-b border-white/10">
                <th className="px-8 py-6 font-bold">Produs</th>
                <th className="px-8 py-6 font-bold">Preț</th>
                <th className="px-8 py-6 font-bold">Colecție</th>
                <th className="px-8 py-6 font-bold">Link Afiliere</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img src={p.images[0]} className="h-10 w-10 rounded-lg object-cover border border-white/10" />
                      <div>
                        <p className="font-bold text-sm">{p.name}</p>
                        <p className="text-[9px] text-white/40 uppercase font-black tracking-widest">
                          {p.affiliateUrl.includes('emag') ? 'eMAG' : 'Temu'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-bold text-sm">{p.price} Lei</td>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => togglePromo(p.id, p.isViral)}
                      className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded transition-colors ${p.isViral ? 'bg-accent text-black' : 'bg-white/10 text-white/40 hover:bg-white/20'}`}
                    >
                      {p.isViral ? '🔥 PROMO ACTIVE' : 'SET PROMO'}
                    </button>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <a href={p.affiliateUrl} target="_blank" className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-primary" title="View Link">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <button 
                        onClick={() => rewriteWithAI(p.id)}
                        disabled={rewritingId === p.id}
                        className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${rewritingId === p.id ? 'text-primary' : 'text-white/40 hover:text-primary'}`}
                        title="Luxury Rewrite"
                      >
                        <Sparkles className={`h-4 w-4 ${rewritingId === p.id ? 'animate-spin' : ''}`} />
                      </button>
                      <button 
                        onClick={() => editProduct(p)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-primary" 
                        title="Edit Product"
                      >
                        <Settings className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => deleteProduct(p.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-white/40 hover:text-red-500" 
                        title="Delete Product"
                      >
                        <PlusCircle className="h-4 w-4 rotate-45" />
                      </button>
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
