const { chromium } = require('playwright');
const { execSync } = require('child_process');

async function scoutEmagCategory(categoryUrl, count = 3) {
    console.log(`\n🕵️ [EMAG SCOUT] Începem scanarea categoriei: ${categoryUrl}`);
    
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        await page.goto(categoryUrl, { waitUntil: 'networkidle' });
        
        // Extragem primele link-uri de produse care par premium
        const productLinks = await page.evaluate((maxCount) => {
            const cards = Array.from(document.querySelectorAll('.card-item'));
            return cards
                .slice(0, maxCount * 2) // Luăm mai multe ca să avem de unde filtra
                .map(card => {
                    const link = card.querySelector('a.card-v2-title')?.href;
                    const rating = parseFloat(card.querySelector('.star-rating-text')?.innerText.replace(/[^\d.]/g, '') || "0");
                    return { link, rating };
                })
                .filter(p => p.link && p.rating >= 4.5)
                .slice(0, maxCount)
                .map(p => p.link);
        }, count);

        await browser.close();

        if (productLinks.length === 0) {
            console.log("⚠️ Nu am găsit produse care să respecte criteriul de 4.5 stele pe această pagină.");
            return;
        }

        console.log(`✅ Am găsit ${productLinks.length} produse de elită. Pornim importul...\n`);

        for (const link of productLinks) {
            console.log(`📦 Procesăm: ${link}`);
            try {
                // Folosim link-ul de Profitshare de bază (sau cel dat de tine)
                const affiliateBase = "https://l.profitshare.ro/l/15748651"; 
                execSync(`node mega-auto-import-emag.js "${link}" "${affiliateBase}"`, { stdio: 'inherit' });
            } catch (e) {
                console.error(`❌ Eroare la importul produsului: ${e.message}`);
            }
        }

    } catch (error) {
        console.error("❌ Eroare la scouting eMAG:", error);
        await browser.close();
    }
}

const url = process.argv[2];
const count = parseInt(process.argv[3]) || 3;
scoutEmagCategory(url, count);
