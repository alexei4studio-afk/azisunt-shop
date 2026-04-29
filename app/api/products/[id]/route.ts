import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase Admin not configured' }, { status: 500 })
  }

  try {
    const { id } = await params
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting product from Supabase:', error.message);
    return NextResponse.json({ error: 'Failed to delete product', details: error.message }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase Admin not configured' }, { status: 500 })
  }

  try {
    const { id } = await params
    const updates = await request.json()
    
    // Separate images if they are being updated
    const { images, ...productUpdates } = updates;

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .update(productUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;

    // Update images if provided
    if (images && Array.isArray(images)) {
        // Delete old images
        await supabaseAdmin.from('product_images').delete().eq('product_id', id);
        
        // Insert new ones
        const imagesToInsert = images.map((url: string, index: number) => ({
            product_id: id,
            url,
            position: index,
            is_primary: index === 0
        }));
        
        const { error: imgError } = await supabaseAdmin.from('product_images').insert(imagesToInsert);
        if (imgError) console.error('Error updating product images:', imgError.message);
    }
    
    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    console.error('Error updating product in Supabase:', error.message);
    return NextResponse.json({ error: 'Failed to update product', details: error.message }, { status: 500 })
  }
}
