const { chromium } = require('playwright');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        if (!url) return reject(new Error("URL lipsă"));
        const req = https.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                   .on('error', reject)
                   .on('finish', resolve);
            } else {
                res.resume();
                reject(new Error(`Status: ${res.statusCode}`));
            }
        });
        req.on('error', reject);
    });
}

async function importTemu(temuUrl) {
    console.log(`\n🚀 [Temu Agent] Import: ${temuUrl} (SUPABASE)`);
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });
        const page = await context.newPage();
        
        await page.goto(temuUrl, { waitUntil: 'networkidle', timeout: 60000 });
        await page.waitForTimeout(3000);

        const rawData = await page.evaluate(() => {
            const titleEl = document.querySelector('h1');
            const priceEl = document.querySelector('[class*="price"]');
            
            if (!titleEl || titleEl.innerText.includes('Sign in')) return null;

            const title = titleEl.innerText.trim();
            const price = priceEl ? priceEl.innerText.replace(/[^\d]/g, '') : "50";
            
            let imgs = Array.from(document.querySelectorAll('img'))
                        .map(img => img.src || img.dataset.src)
                        .filter(src => src && src.includes('http') && src.includes('goods') && !src.includes('base64'))
                        .slice(0, 3);
            
            return { title, price, imgs: [...new Set(imgs)] };
        });
        await browser.close();

        if (!rawData || !rawData.title || rawData.title.length < 5) {
            throw new Error("Date invalide extrase (posibil login wall).");
        }

        console.log(`   💎 Detectat: ${rawData.title}`);

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const aiPrompt = `
            Produs Temu: "${rawData.title}".
            Ești curator pentru AZISUNT.SHOP.
            1. Verifică dacă e produs estetic/viral. Dacă e industrial/junk, răspunde {"reject": true}.
            2. Returnează JSON:
            {
              "name": "Nume Premium",
              "description": "Descriere",
              "features": ["3 features"],
              "badge": "TRENDING / VIRAL",
              "category": "sanctuary/executive/voyager/athlete"
            }
        `;
        const result = await model.generateContent(aiPrompt);
        const aiResponse = JSON.parse(result.response.text().replace(/```json|```/g, '').trim());

        if (aiResponse.reject) {
            console.log("   🚫 Respins.");
            return;
        }

        const localImages = [];
        const productsDir = path.join(__dirname, 'public', 'products');
        if (!fs.existsSync(productsDir)) fs.mkdirSync(productsDir, { recursive: true });

        for (let i = 0; i < rawData.imgs.length; i++) {
            const imageName = `temu-${Date.now()}-${i}.jpg`;
            try {
                await downloadImage(rawData.imgs[i], path.join(productsDir, imageName));
                localImages.push(`/products/${imageName}`);
            } catch (e) {}
        }

        if (localImages.length === 0) throw new Error("Nu am putut descărca imagini.");

        // Insert into Supabase
        const { data: productData, error: productError } = await supabase
            .from('products')
            .upsert({
                slug: aiResponse.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                name: aiResponse.name,
                price: parseInt(rawData.price) || 50,
                compare_price: (parseInt(rawData.price) || 50) * 2.5,
                category: aiResponse.category || "lifestyle",
                description: aiResponse.description,
                features: aiResponse.features,
                is_viral: false,
                badge: aiResponse.badge || "VIRAL DISCOVERY",
                affiliate_url: temuUrl
            }, { onConflict: 'slug' })
            .select()
            .single();

        if (productError) {
            throw new Error(`Supabase Insert Error: ${productError.message}`);
        }

        const productId = productData.id;

        // Insert Images
        if (localImages.length > 0) {
            const imagesToInsert = localImages.map((img, index) => ({
                product_id: productId,
                url: img,
                position: index,
                is_primary: index === 0
            }));
            
            await supabase.from('product_images').delete().eq('product_id', productId);
            await supabase.from('product_images').insert(imagesToInsert);

            await supabase.from('products').update({ images: localImages }).eq('id', productId);
        }

        console.log(`✅ Adăugat în Supabase: ${aiResponse.name}`);
    } catch (e) {
        console.error(`❌ Eroare: ${e.message}`);
        if (browser) await browser.close();
    }
}

const url = process.argv[2];
if (url) importTemu(url);
