const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function migrate() {
  const productsPath = path.join(__dirname, 'data', 'trending-products.json');
  if (!fs.existsSync(productsPath)) {
    console.error('JSON file not found');
    return;
  }

  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  console.log(`Found ${products.length} products to migrate.`);

  for (const p of products) {
    console.log(`Migrating: ${p.name}`);
    
    // Insert product
    const { data: productData, error: productError } = await supabase
      .from('products')
      .upsert({
        slug: p.slug,
        name: p.name,
        price: p.price,
        compare_price: p.comparePrice || null,
        category: p.category,
        description: p.description,
        is_viral: p.isViral || false,
        badge: p.badge || null,
        affiliate_url: p.affiliateUrl || null,
        features: p.features || null,
        // inStock is missing in DB schema, omitting for now
      }, { onConflict: 'slug' })
      .select()
      .single();

    if (productError) {
      console.error(`Error migrating product ${p.name}:`, productError.message);
      continue;
    }

    const productId = productData.id;

    // Insert images
    if (p.images && p.images.length > 0) {
      const imagesToInsert = p.images.map((img, index) => ({
        product_id: productId,
        url: img,
        position: index,
        is_primary: index === 0
      }));

      // Delete existing images for this product first to avoid duplicates if re-running
      await supabase.from('product_images').delete().eq('product_id', productId);

      const { error: imageError } = await supabase
        .from('product_images')
        .insert(imagesToInsert);

      if (imageError) {
        console.error(`Error migrating images for ${p.name}:`, imageError.message);
      }
    }
  }

  console.log('Migration completed!');
}

migrate();
