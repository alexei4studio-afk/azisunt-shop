const { chromium } = require('playwright');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { HfInference } = require("@huggingface/inference");
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const DATABASE_PATH = path.join(__dirname, 'data', 'trending-products.json');

async function importEmag(emagUrl, affiliateUrl) {
    console.log(`\n🚀 PORNIRE AGENT EMAG PENTRU: ${emagUrl}`);
    
    let browser;
    try {
        console.log("🔍 [1/4] Scrapez eMAG...");
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(emagUrl, { waitUntil: 'networkidle', timeout: 60000 });
        
        const rawData = await page.evaluate(() => {
            const title = document.querySelector('.page-title')?.innerText || "Produs eMAG";
            const priceText = document.querySelector('.product-new-price')?.innerText || "0";
            const price = priceText.replace(/[^\d]/g, '');
            return { title, price };
        });
        await browser.close();

        console.log(`   ✅ Date găsite: ${rawData.title} @ ${rawData.price} Lei`);

        console.log("🧠 [2/4] Agentul Gemini ridică standardul de lux...");
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const aiPrompt = `
            Ești un expert în e-commerce de lux și copywriter AEO. 
            Analizează acest produs eMAG: "${rawData.title}".
            
            SARCINĂ:
            1. Creează un nume premium, scurt, în română (ex: "Acustica Pura" în loc de "Casti Bowers & Wilkins").
            2. Scrie o descriere sofisticată care să explice de ce este o investiție în stilul de viață.
            3. Generează 3 beneficii elitiste.
            4. Prompt imagine (English) pentru Stable Diffusion XL: Context "Quiet Luxury" (birou designer, lumină naturală, texturi premium).
            5. Categorie: ["tech", "lifestyle", "home", "wellness"].
            6. Script TikTok Viral (15s).

            Returnează DOAR JSON:
            {
              "name": "...",
              "description": "...",
              "features": ["...", "...", "..."],
              "category": "...",
              "prompt": "...",
              "marketing": { "hook": "...", "script": "..." }
            }
        `;
        
        const result = await model.generateContent(aiPrompt);
        const aiResponse = JSON.parse(result.response.text().replace(/```json|```/g, '').trim());

        console.log("🎨 [3/4] Generare imagine de brand...");
        const imageBlob = await hf.textToImage({
            inputs: aiResponse.prompt,
            model: 'stabilityai/stable-diffusion-xl-base-1.0',
        });
        const imageName = `emag-${Date.now()}.png`;
        const buffer = Buffer.from(await imageBlob.arrayBuffer());
        fs.writeFileSync(path.join(__dirname, 'public', 'products', imageName), buffer);

        console.log("💾 [4/4] Integrare în Mall...");
        const products = JSON.parse(fs.readFileSync(DATABASE_PATH, 'utf8'));
        
        const newProduct = {
            id: `emag-${Date.now()}`,
            slug: aiResponse.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            name: aiResponse.name,
            price: parseInt(rawData.price) / 100, // eMAG has decimals often
            comparePrice: (parseInt(rawData.price) / 100) * 1.4,
            category: aiResponse.category || "tech",
            description: aiResponse.description,
            features: aiResponse.features,
            images: [`/products/${imageName}`],
            inStock: true,
            affiliateUrl: affiliateUrl,
            isViral: true,
            badge: "DISCOVERY OF THE WEEK",
            marketing: aiResponse.marketing
        };
        
        products.push(newProduct);
        fs.writeFileSync(DATABASE_PATH, JSON.stringify(products, null, 2));
        console.log(`\n✨ SUCCES! "${newProduct.name}" este acum în Mall-ul tău.`);

    } catch (error) {
        console.error("\n❌ EROARE AGENT EMAG:", error);
        if (browser) await browser.close();
    }
}

const emagUrl = process.argv[2];
const affiliateUrl = process.argv[3];
importEmag(emagUrl, affiliateUrl);
