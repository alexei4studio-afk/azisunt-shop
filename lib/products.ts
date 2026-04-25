import productsData from '@/data/trending-products.json';

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
}

const products: Product[] = productsData as Product[];

export async function getShopifyProducts(): Promise<Product[]> {
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return products.find(p => p.slug === slug)
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  if (category === 'all') return products
  return products.filter(p => p.category === category)
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return products.slice(0, 4)
}

export async function getNewProducts(): Promise<Product[]> {
  return products.slice(0, 4);
}
