'use client';

import { useState, useEffect } from 'react';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const id = params?.id as string;

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    category: '',
    description: '',
    features: '',
    affiliateUrl: '',
    viralSource: '',
    active: true,
    comparePrice: 0,
  });
  
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [customCategory, setCustomCategory] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [linkStatus, setLinkStatus] = useState<{ valid?: boolean; status?: number; error?: string } | null>(null);
  const [showToast, setShowToast] = useState<{ title: string; description: string; variant?: 'default' | 'destructive' } | null>(null);

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

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCategories(data) })
      .catch(() => {})
  }, []);

  useEffect(() => {
    if (!id) return;
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) {
        router.replace('/admin/products');
        return;
      }

      setFormData({
        name: data.name || '',
        price: data.price || 0,
        category: data.category || '',
        description: data.description || '',
        features: Array.isArray(data.features) ? data.features.join('\n') : '',
        affiliateUrl: data.affiliate_url || '',
        viralSource: data.viral_source || '',
        active: data.active ?? true,
        comparePrice: data.compare_price || 0,
      });
      setExistingImages(data.images || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'price' || name === 'comparePrice' 
        ? (value === '' ? 0 : parseFloat(value)) 
        : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages(prev => [...prev, ...files]);
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_: any, i: number) => i !== index));
  };

  const removeExistingImage = (url: string) => {
    setExistingImages(prev => prev.filter(img => img !== url));
    setImagesToDelete(prev => [...prev, url]);
  };

  const uploadImages = async (files: File[]) => {
    const uploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

        const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file)

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrl);
    }
    return uploadedUrls;
  };

  const deleteImages = async (urls: string[]) => {
    for (const url of urls) {
      const filePath = url.split('/').pop();
      if (filePath) {
        await supabase.storage
          .from('product-images')
          .remove([`products/${filePath}`]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      if (!formData.name || !formData.price || !formData.category) {
        throw new Error('Name, price, and category are required');
      }

      // Upload new images
      let uploadedUrls: string[] = [];
      if (newImages.length > 0) {
        uploadedUrls = await uploadImages(newImages);
      }

      // Delete removed images
      if (imagesToDelete.length > 0) {
        await deleteImages(imagesToDelete);
      }

      const features = formData.features ? formData.features.split('\n').filter(f => f.trim()) : [];
      const allImages = [...existingImages, ...uploadedUrls];

      const { data, error } = await supabase
        .from('products')
        .update({
          name: formData.name,
          price: formData.price,
          compare_price: formData.comparePrice || null,
          category: formData.category,
          description: formData.description,
          features: features,
          affiliate_url: formData.affiliateUrl,
          viral_source: formData.viralSource,
          active: formData.active,
          images: allImages,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setShowToast({
        title: 'Produs actualizat',
        description: 'Produsul a fost actualizat cu succes!',
      });
      
      setTimeout(() => {
        router.replace('/admin/products');
      }, 500);
    } catch (err: any) {
      setShowToast({
        title: 'Eroare la actualizare',
        description: err.message,
        variant: 'destructive',
      });
      console.error('Error updating product:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading product...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <p className="text-gray-600">Update product details and images.</p>
      </div>
      
      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Product Name *</label>
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
            <label className="block text-sm font-medium mb-1">Price (Lei) *</label>
            <input
              type="number"
              name="price"
              value={formData.price || ''}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Compare Price (Lei)</label>
            <input
              type="number"
              name="comparePrice"
              value={formData.comparePrice || ''}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
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
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Features (one per line)</label>
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
            <label className="block text-sm font-medium mb-1">Affiliate URL</label>
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
            <label className="block text-sm font-medium mb-1">Viral Source</label>
            <input
              type="text"
              name="viralSource"
              value={formData.viralSource}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., TikTok, Instagram"
            />
          </div>
        </div>
        
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">Product Images</label>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">Upload one or more product images</p>
          </div>
          
          {/* New Images Preview */}
          {newImages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">New Images (to be uploaded):</p>
              <div className="grid grid-cols-3 gap-2">
                {newImages.map((file, index) => (
                  <div key={`new-${index}`} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-20 h-20 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Current Images (check to remove):</p>
              <div className="grid grid-cols-3 gap-2">
                {existingImages.map((url, index) => (
                  <div key={`existing-${index}`} className="relative group">
                    <img
                      src={url}
                      alt={`Product ${index}`}
                      className={`w-20 h-20 object-cover rounded border ${imagesToDelete.includes(url) ? 'opacity-50' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(url)}
                      className={`absolute top-0 right-0 rounded-full w-5 h-5 flex items-center justify-center text-xs transition-opacity ${
                        imagesToDelete.includes(url)
                          ? 'bg-green-500 text-white opacity-100'
                          : 'bg-red-500 text-white opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {imagesToDelete.includes(url) ? '✓' : '×'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
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
              Product Active
            </label>
          </div>
        </div>

        {/* AI Actions */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">AI Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              type="button"
              disabled={aiLoading !== null}
              onClick={async () => {
                setAiLoading('rewrite');
                try {
                  const res = await fetch('/api/manager/rewrite', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id }),
                  });
                  const data = await res.json();
                  if (data.error) throw new Error(data.error);
                  setShowToast({ title: 'AI Rewrite', description: 'Rescrierea a pornit. Reîncarcă pagina în 10-15s pentru a vedea rezultatul.' });
                } catch (err: any) {
                  setShowToast({ title: 'Eroare', description: err.message, variant: 'destructive' });
                } finally {
                  setAiLoading(null);
                }
              }}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {aiLoading === 'rewrite' ? (
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <span>&#9998;</span>
              )}
              Generează Descriere
            </button>

            <button
              type="button"
              disabled={aiLoading !== null || !formData.affiliateUrl}
              onClick={async () => {
                setAiLoading('check');
                setLinkStatus(null);
                try {
                  const res = await fetch('/api/manager/check-link', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: formData.affiliateUrl }),
                  });
                  const data = await res.json();
                  setLinkStatus(data);
                } catch (err: any) {
                  setLinkStatus({ valid: false, error: err.message });
                } finally {
                  setAiLoading(null);
                }
              }}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {aiLoading === 'check' ? (
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <span>&#128279;</span>
              )}
              Verifică Link
            </button>

            <button
              type="button"
              disabled
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-400 text-white rounded-md cursor-not-allowed"
              title="Necesită API key pentru generare imagini (DALL-E / Midjourney)"
            >
              <span>&#128247;</span>
              Generează Poze
            </button>
          </div>

          {linkStatus && (
            <div className={`mt-3 p-3 rounded-md text-sm ${linkStatus.valid ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {linkStatus.valid ? (
                <span>Link valid (status {linkStatus.status})</span>
              ) : (
                <span>Link invalid {linkStatus.status ? `(status ${linkStatus.status})` : ''} {linkStatus.error || ''}</span>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <Link href="/admin/products" className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
