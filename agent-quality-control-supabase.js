const { chromium } = require('playwright');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const CONCURRENCY = 1; 

async function checkProductStatus(browser, url) {
    if (!url) return true;
    let context;
    try {
        context = await browser.newContext();
        const page = await context.newPage();
        
        console.log(`🔍 Verific: ${url}`);
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        // Verificare eMAG / Profitshare
        if (url.includes('emag.ro') || url.includes('profitshare.ro')) {
            const isOutOfStock = await page.evaluate(() => {
                const text = document.body.innerText.toLowerCase();
                return text.includes('stoc epuizat') || 
                       text.includes('nu mai face parte din oferta') || 
                       text.includes('pagina nu a fost gasita') ||
                       document.title.includes('404');
            });
            await context.close();
            return !isOutOfStock;
        }

        // Verificare Temu
        if (url.includes('temu.com') || url.includes('temu.to')) {
            const isInvalid = await page.evaluate(() => {
                const text = document.body.innerText.toLowerCase();
                if (document.title.includes('Security Check') || text.includes('verify you are human')) {
                    return true; // Nu-l ștergem dacă e doar captchă temporară
                }
                const hasNoProduct = text.includes('nu am găsit niciun rezultat') || 
                                     text.includes('sold out') ||
                                     document.querySelectorAll('h1').length === 0;
                return hasNoProduct;
            });
            await context.close();
            return !isInvalid;
        }

        await context.close();
        return true;
    } catch (error) {
        console.error(`❌ Eroare ${url}:`, error.message);
        if (context) await context.close();
        return true; 
    }
}

async function runQualityControl() {
    console.log("====================================================");
    console.log("🛡️  AZISUNT QUALITY CONTROL & MAINTENANCE (SUPABASE)");
    console.log("====================================================\n");
    
    // Fetch products with their images
    const { data: products, error: fetchError } = await supabase
        .from('products')
        .select(`
            id,
            name,
            slug,
            affiliate_url,
            product_images (
                url
            )
        `);

    if (fetchError) {
        console.error('Error fetching products:', fetchError.message);
        return;
    }

    const initialCount = products.length;
    console.log(`Analyzing ${initialCount} products...`);
    
    const browser = await chromium.launch({ headless: true });

    for (let i = 0; i < products.length; i += CONCURRENCY) {
        const chunk = products.slice(i, i + CONCURRENCY);
        await Promise.all(chunk.map(async (p) => {
            console.log(`[QC] Analizând: ${p.name}...`);
            
            let valid = true;
            let reason = null;

            // 1. Verificare Imagine
            const image = p.product_images && p.product_images[0] && p.product_images[0].url;
            if (!image || image === "" || image.includes('null')) {
                valid = false;
                reason = 'No Image';
            } else if (!image.startsWith('http')) {
                // Check local file
                const path = require('path');
                const fs = require('fs');
                const imgPath = path.join(__dirname, 'public', image);
                if (!fs.existsSync(imgPath)) {
                    valid = false;
                    reason = 'Image Missing';
                }
            }

            // 2. Verificare Status Link
            if (valid) {
                const isActive = await checkProductStatus(browser, p.affiliate_url);
                if (!isActive) {
                    valid = false;
                    reason = 'Link Dead';
                }
            }

            if (!valid) {
                console.log(`🗑️ Eliminat din Supabase: ${p.name} (${reason})`);
                const { error: deleteError } = await supabase
                    .from('products')
                    .delete()
                    .eq('id', p.id);
                
                if (deleteError) {
                    console.error(`Error deleting ${p.name}:`, deleteError.message);
                }
            } else {
                console.log(`✅ OK: ${p.name}`);
            }
        }));
    }

    await browser.close();
    console.log(`\n✨ CURĂȚENIE FINALIZATĂ.`);
}

runQualityControl();
