import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Product {
  id: string
  slug: string
  name: string
  price: number
  comparePrice?: number
  category: string
  description: string
  features?: string[]
  images: string[]
  inStock: boolean
  affiliateUrl: string
  isViral?: boolean
  viralSource?: string
  badge?: string
  marketing?: {
    story?: string
  }
}

function mapRow(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    price: row.price,
    comparePrice: row.compare_price || undefined,
    category: row.category,
    description: row.description || '',
    features: row.features || [],
    images: row.product_images?.map((img: any) => img.url) || row.images || [],
    inStock: row.in_stock ?? true,
    affiliateUrl: row.affiliate_url || '',
    isViral: row.is_viral || false,
    viralSource: row.viral_source || undefined,
    badge: row.badge || undefined,
    marketing: row.marketing || undefined,
  }
}

async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(url, is_primary)')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map(mapRow)
  } catch (error) {
    console.error('Error fetching products from Supabase:', error)
    return []
  }
}

export async function getShopifyProducts(): Promise<Product[]> {
  return fetchProducts()
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(url, is_primary)')
      .eq('slug', slug)
      .single()

    if (error || !data) return undefined
    return mapRow(data)
  } catch {
    return undefined
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  if (category === 'all') return fetchProducts()

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(url, is_primary)')
      .eq('category', category)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map(mapRow)
  } catch (error) {
    console.error('Error fetching products by category:', error)
    return []
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(url, is_primary)')
      .order('created_at', { ascending: false })
      .limit(8)

    if (error) throw error
    return (data || []).map(mapRow)
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
}

export async function getNewProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(url, is_primary)')
      .order('created_at', { ascending: false })
      .limit(4)

    if (error) throw error
    return (data || []).map(mapRow)
  } catch (error) {
    console.error('Error fetching new products:', error)
    return []
  }
}

export async function getAllProducts(): Promise<Product[]> {
  return fetchProducts()
}

export async function getCategories(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('category')

    if (error) throw error
    const unique = [...new Set((data || []).map((r: any) => r.category).filter(Boolean))]
    return unique.sort()
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}
