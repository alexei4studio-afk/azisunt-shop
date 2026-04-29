'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function CreateProductPage() {
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    category: '',
    description: '',
    features: '',
    affiliateUrl: '',
    viralSource: '',
    active: true,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [customCategory, setCustomCategory] = useState(false);
  const [showToast, setShowToast] = useState<{ title: string; description: string; variant?: 'default' | 'destructive' } | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCategories(data) })
      .catch(() => {})
  }, []);

  // Show toast after hydration to avoid mismatch
  useEffect(() => {
    if (showToast) {
      toast({
        title: showToast.title,
        description: showToast.description,
        variant: showToast.variant || 'default',
      });
      setShowToast(null);
    }
  }, [showToast, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'price' ? (value === '' ? 0 : parseFloat(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!formData.name || !formData.price || !formData.category) {
        throw new Error('Name, price, and category are required');
      }

      const { data, error } = await supabase
        .from('products')
        .insert({
          name: formData.name,
          price: formData.price,
          category: formData.category,
          description: formData.description,
          features: formData.features,
          affiliate_url: formData.affiliateUrl,
          viral_source: formData.viralSource,
          active: formData.active,
        })
        .select();

      if (error) throw error;
      
      setShowToast({
        title: 'Produs creat',
        description: 'Produsul a fost creat cu succes!',
      });
      
      // Redirect to products list
      router.replace('/admin/products');
    } catch (err: any) {
      setShowToast({
        title: 'Eroare la creare produs',
        description: err.message,
        variant: 'destructive',
      });
      console.error('Error creating product:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Adaugă Produs Nou</h1>
        <p className="text-gray-600">Completează formularul de mai jos pentru a adăuga un nou produs în catalog.</p>
      </div>
      
      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Nume Produs *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Preț *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Categorie *</label>
            {!customCategory ? (
              <div className="space-y-2">
                <select
                  name="category"
                  value={formData.category}
                  onChange={(e) => {
                    if (e.target.value === '__new__') {
                      setCustomCategory(true);
                      setFormData(prev => ({ ...prev, category: '' }));
                    } else {
                      setFormData(prev => ({ ...prev, category: e.target.value }));
                    }
                  }}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Alege categorie --</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="__new__">+ Categorie nouă...</option>
                </select>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  placeholder="Introdu categorie nouă"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setCustomCategory(false)}
                  className="px-3 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                >
                  Lista
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Descriere</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Features (listează fiecare pe o linie nouă)</label>
          <textarea
            name="features"
            value={formData.features}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Feature 1\nFeature 2\nFeature 3"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">URL Afiliat</label>
            <input
              type="url"
              name="affiliateUrl"
              value={formData.affiliateUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/product"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Sursă Virală</label>
            <input
              type="text"
              name="viralSource"
              value={formData.viralSource}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: TikTok, Instagram, etc."
            />
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="active"
              name="active"
              type="checkbox"
              checked={formData.active}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="active" className="font-medium text-gray-700">
              Produs activ
            </label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.replace('/admin/products')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Anulează
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Salvare...' : 'Salvează Produs'}
          </button>
        </div>
      </form>
    </div>
  );
}
