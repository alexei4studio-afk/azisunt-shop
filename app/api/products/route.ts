import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase Admin not configured' }, { status: 500 })
  }

  try {
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        product_images (
          url,
          is_primary
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map to the format expected by the frontend (with flat images array)
    const formattedProducts = products.map((p: any) => ({
      ...p,
      images: p.product_images?.map((img: any) => img.url) || []
    }));

    console.log(`[API] Returning ${formattedProducts.length} products from Supabase.`);
    return NextResponse.json(formattedProducts)
  } catch (error: any) {
    console.error('Error fetching products from Supabase:', error.message);
    return NextResponse.json({ error: 'Failed to load products', details: error.message }, { status: 500 })
  }
}
