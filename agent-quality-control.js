const fs = require('fs');
const path = require('path');

const DATABASE_PATH = path.join(__dirname, 'data', 'trending-products.json');
const PRODUCTS_DIR = path.join(__dirname, 'public', 'products');

async function verifyProducts() {
    console.log("🔍 [QC AGENT] Pornire verificare integritate catalog...\n");
    
    if (!fs.existsSync(DATABASE_PATH)) {
        console.error("❌ Eroare: Baza de date nu există.");
        return;
    }

    const products = JSON.parse(fs.readFileSync(DATABASE_PATH, 'utf8'));
    let issuesFound = 0;

    products.forEach((product, index) => {
        console.log(`Checking [${index + 1}/${products.length}]: ${product.name}`);
        
        // 1. Verificare Imagini
        if (!product.images || product.images.length === 0) {
            console.warn(`   ⚠️ Lipsă imagini pentru: ${product.name}`);
            issuesFound++;
        } else {
            product.images.forEach(img => {
                if (img.startsWith('/products/')) {
                    const localPath = path.join(__dirname, 'public', img);
                    if (!fs.existsSync(localPath)) {
                        console.error(`   ❌ Imagine locală lipsă: ${img}`);
                        issuesFound++;
                    }
                } else if (img.startsWith('http')) {
                    // Check if external image URL looks sane
                    if (img.includes('placeholder')) {
                        console.warn(`   ⚠️ Produsul folosește placeholder: ${img}`);
                    }
                }
            });
        }

        // 2. Verificare URL Afiliere
        if (!product.affiliateUrl || product.affiliateUrl === "" || product.affiliateUrl === "#") {
            console.error(`   ❌ Link de afiliere invalid sau lipsă.`);
            issuesFound++;
        }

        // 3. Verificare Content (AEO/SEO)
        if (product.description.length < 50) {
            console.warn(`   ⚠️ Descriere prea scurtă pentru SEO/AEO.`);
            issuesFound++;
        }
    });

    console.log(`\n---------------------------------------------------`);
    if (issuesFound === 0) {
        console.log("✅ Catalogul este IMPECABIL. Toate produsele sunt gata de vânzare.");
    } else {
        console.log(`⚠️ S-au găsit ${issuesFound} probleme ce necesită atenție.`);
    }
}

verifyProducts();
