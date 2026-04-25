import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'trending-products.json')
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const products = JSON.parse(fileContent)
    console.log(`[API] Returning ${products.length} products to client.`);
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 })
  }
}
