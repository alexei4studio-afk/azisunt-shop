import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Create Supabase client with service role for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Check if required columns exist in the products table, and add them if missing
async function ensureTableSchema(): Promise<boolean> {
  try {
    // Try to select a simple column first to see if we can connect
    const { error: testError } = await supabase
      .from('products')
      .select('id')
      .limit(1);
      
    if (testError) {
      console.error('Error connecting to products table:', testError);
      return false;
    }
    
    // Now check for the specific columns we need
    const { error } = await supabase
      .from('products')
      .select('affiliateUrl, features, viralSource')
      .limit(1);

    if (error) {
      // If the error is about the column not existing, we need to alter the table
      if (error.code === '42703') { // undefined_column
        console.log('The products table is missing required columns. Adding them now...');
        // Try to add the missing columns
        const { error: alterError } = await supabase
          .from('products')
          .update({}) // Dummy update to trigger the alter table
          .neq('id', '00000000-0000-0000-0000-000000000000') // This won't match any rows
          .limit(1); // But we still need to handle this properly
          
        // Actually, let's try a different approach - we can't directly execute DDL through the supabase client
        // We'll need to inform the user to run the SQL, but let's make the message clearer
        console.log('❌ Unable to automatically alter table. Please run this SQL in your Supabase SQL editor:');
        console.log(`
          ALTER TABLE products
          ADD COLUMN IF NOT EXISTS affiliateUrl text,
          ADD COLUMN IF NOT EXISTS features text[],
          ADD COLUMN IF NOT EXISTS viralSource text;
        `);
        console.log('💡 After running the SQL above, please run the migration script again.');
        return false;
      } else {
        console.error('Unexpected error checking table schema:', error);
        return false;
      }
    }
    return true;
  } catch (err) {
    console.error('Error checking table schema:', err);
    return false;
  }
}

interface LocalProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  comparePrice?: number;
  category: string;
  description: string;
  features?: string[];
  images: string[];
  inStock: boolean;
  affiliateUrl: string;
  isViral?: boolean;
  viralSource?: string;
  badge?: string;
  marketing?: {
    hook?: string;
    script?: any[];
  };
}

async function migrateProducts() {
  console.log('Starting migration to Supabase...');
  
  // First, ensure the required columns exist in the products table
  const schemaOk = await ensureTableSchema();
  if (!schemaOk) {
    console.log('Migration cannot proceed until the table schema is updated.');
    console.log('Please run the SQL command shown above, then run this script again.');
    process.exit(1);
  }
  
  // Read products from JSON file
  const productsPath = path.join(process.cwd(), 'data', 'trending-products.json');
  const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8')) as LocalProduct[];
  
  console.log(`Found ${productsData.length} products to migrate`);
  
  // Process each product
  for (const product of productsData) {
    console.log(`Processing product: ${product.name} (${product.slug})`);
    
    try {
      // 1. Check if product already exists by slug
      const { data: existingProduct, error: checkError } = await supabase
        .from('products')
        .select('id, slug')
        .eq('slug', product.slug)
        .single();
      
      let productData: any;
      let productError: any = null;
      
      if (existingProduct) {
        // Product exists, update it and delete existing images
        console.log(`  Product with slug ${product.slug} already exists, updating...`);
        
        // Delete existing images for this product
        const { error: deleteImagesError } = await supabase
          .from('product_images')
          .delete()
          .eq('product_id', existingProduct.id);
          
        if (deleteImagesError) {
          console.error(`Error deleting existing images for product ${product.slug}:`, deleteImagesError);
          // Continue anyway - we'll try to insert new images
        }
        
        // Update product details
        const { data: updatedData, error: updateError } = await supabase
          .from('products')
          .update({
            name: product.name,
            price: product.price,
            compare_price: product.comparePrice,
            category: product.category,
            description: product.description,
            is_viral: product.isViral || false,
            badge: product.badge,
            affiliateUrl: product.affiliateUrl,
            features: product.features || [],
            viralSource: product.viralSource,
            sort_order: 0, // Reset sort order
          })
          .eq('slug', product.slug)
          .select()
          .single();
          
        productData = updatedData;
        productError = updateError;
      } else {
        // Product doesn't exist, insert it
        const { data: insertedData, error: insertError } = await supabase
          .from('products')
          .insert({
            slug: product.slug,
            name: product.name,
            price: product.price,
            compare_price: product.comparePrice,
            category: product.category,
            description: product.description,
            is_viral: product.isViral || false,
            badge: product.badge,
            affiliateUrl: product.affiliateUrl,
            features: product.features || [],
            viralSource: product.viralSource,
            sort_order: 0, // Default sort order
          })
          .select()
          .single();
          
        productData = insertedData;
        productError = insertError;
      }
      
      if (productError) {
        console.error(`Error inserting product ${product.slug}:`, productError);
        continue;
      }
      
      console.log(`  Inserted product with ID: ${productData.id}`);
      
      // 2. Process images
      const imagePromises = product.images.map(async (imagePath, index) => {
        // Determine if this is a local file or external URL
        const isLocal = imagePath.startsWith('/products/') || !imagePath.startsWith('http');
        let imageUrl = imagePath;
        
        if (isLocal) {
          // This is a local file - upload to Supabase Storage
          const localFilePath = path.join(process.cwd(), 'public', imagePath);
          
          try {
            const fileBuffer = fs.readFileSync(localFilePath);
            const fileName = path.basename(localFilePath);
            
            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase
              .storage
              .from('product-images')
              .upload(`${productData.id}/${fileName}`, fileBuffer, {
                contentType: 'image/png', // Assuming PNG, could detect from extension
                upsert: true
              });
              
            if (uploadError) {
              console.error(`Error uploading image ${imagePath}:`, uploadError);
              return null;
            }
            
            // Get public URL
            const { data: publicUrlData } = supabase
              .storage
              .from('product-images')
              .getPublicUrl(`${productData.id}/${fileName}`);
              
            imageUrl = publicUrlData.publicUrl;
            console.log(`    Uploaded image ${imagePath} to ${imageUrl}`);
          } catch (fileError) {
            console.error(`Error reading local file ${imagePath}:`, fileError);
            return null;
          }
        }
        
        // Insert image record into product_images table
        const { data: imageData, error: imageError } = await supabase
          .from('product_images')
          .insert({
            product_id: productData.id,
            url: imageUrl,
            alt_text: `${product.name} image ${index + 1}`,
            position: index,
            is_primary: index === 0, // First image is primary
          })
          .select()
          .single();
          
        if (imageError) {
          console.error(`Error inserting image record for ${product.slug}:`, imageError);
          return null;
        }
        
        return imageData;
      });
      
      // Wait for all image processing to complete
      const imageResults = await Promise.all(imagePromises);
      const successfulImages = imageResults.filter(img => img !== null);
      console.log(`    Processed ${successfulImages.length} images for product ${product.slug}`);
      
    } catch (error) {
      console.error(`Unexpected error processing product ${product.slug}:`, error);
    }
  }
  
  console.log('Migration completed!');
}

migrateProducts().catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
});