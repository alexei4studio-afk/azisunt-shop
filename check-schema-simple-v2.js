const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkCurrentSchema() {
  console.log('Checking current schema of products table...');
  
  const columnsToCheck = ['id', 'slug', 'name', 'price', 'compare_price', 'category', 'description', 'is_viral', 'badge', 'affiliate_url', 'features', 'viral_source', 'sort_order', 'created_at', 'in_stock', 'marketing'];
  const existingColumns = [];
  const missingColumns = [];
  
  for (const column of columnsToCheck) {
    try {
      const { error: colError } = await supabase
        .from('products')
        .select(column)
        .limit(1);
        
      if (colError && colError.code === '42703') { // Undefined column
        missingColumns.push(column);
      } else {
        existingColumns.push(column);
      }
    } catch (err) {
      missingColumns.push(column);
    }
  }
  
  console.log('Existing columns:', existingColumns.join(', '));
  console.log('Missing columns:', missingColumns.join(', '));
}

checkCurrentSchema();
