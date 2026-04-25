import fs from 'fs';
import path from 'path';

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

function getProductsData(): Product[] {
  const filePath = path.join(process.cwd(), 'data', 'trending-products.json');
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent) as Product[];
  } catch (error) {
    console.error("Error reading products data:", error);
    return [];
  }
}

export async function getShopifyProducts(): Promise<Product[]> {
  return getProductsData();
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = getProductsData();
  return products.find(p => p.slug === slug)
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = getProductsData();
  const sorted = [...products].reverse();
  if (category === 'all') return sorted
  return sorted.filter(p => p.category === category)
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = getProductsData();
  // Return the latest AI-curated products first
  return [...products].reverse().slice(0, 8)
}

export async function getNewProducts(): Promise<Product[]> {
  const products = getProductsData();
  return [...products].reverse().slice(0, 4);
}

export async function getAllProducts(): Promise<Product[]> {
  const products = getProductsData();
  return [...products].reverse();
}
