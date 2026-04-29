const { chromium } = require('playwright');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const EMAG_BESTSELLER_PAGES = [
  'https://www.emag.ro/bestsellers',
  'https://www.emag.ro/oferte-zi',
];

const MAX_URLS = 8;

async function scoutTrends() {
  console.log("🌍 [TREND SCOUT] Pornire vânătoare produse trending pe eMAG...\n");

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 }
    });

    const allUrls = [];

    for (const pageUrl of EMAG_BESTSELLER_PAGES) {
      console.log(`🔍 Scanez: ${pageUrl}`);
      const page = await context.newPage();

      try {
        await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(2000);

        const urls = await page.evaluate(() => {
          const links = Array.from(document.querySelectorAll('a.card-v2-title, a.product-title, .card-v2 a[href*="/p/"]'));
          return links
            .map(a => a.href)
            .filter(href => href && href.includes('emag.ro') && href.includes('/p/'))
            .map(href => href.split('?')[0]);
        });

        const unique = [...new Set(urls)];
        console.log(`   Găsite ${unique.length} produse pe ${pageUrl}`);
        allUrls.push(...unique);
      } catch (e) {
        console.error(`   ❌ Eroare la ${pageUrl}: ${e.message}`);
      }

      await page.close();
    }

    await browser.close();

    const uniqueUrls = [...new Set(allUrls)].slice(0, MAX_URLS * 2);
    console.log(`\n📋 Total URL-uri unice extrase: ${uniqueUrls.length}`);

    if (uniqueUrls.length === 0) {
      console.log("⚠️ Niciun produs găsit. Verifică selectorii CSS.");
      console.log(JSON.stringify([]));
      return;
    }

    console.log("🤖 Filtrez prin Gemini AI pentru criterii Quiet Luxury...\n");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const aiPrompt = `
      Ești curator pentru AZISUNT.SHOP, un mall digital de lux.
      Filtrează aceste URL-uri eMAG și selectează MAXIM ${MAX_URLS} care par a fi produse premium/luxury/tech de calitate.
      Exclude produse ieftine, generice, sau fără potențial "Quiet Luxury".

      URL-uri:
      ${uniqueUrls.map((u, i) => `${i + 1}. ${u}`).join('\n')}

      Răspunde DOAR cu un JSON array de URL-uri selectate:
      ["url1", "url2", ...]
    `;

    const result = await model.generateContent(aiPrompt);
    const filtered = JSON.parse(result.response.text().replace(/```json|```/g, '').trim());

    console.log(`✅ Gemini a selectat ${filtered.length} produse premium:\n`);
    filtered.forEach((url, i) => console.log(`   ${i + 1}. ${url}`));

    console.log('\n---TREND_SCOUT_URLS_START---');
    console.log(JSON.stringify(filtered));
    console.log('---TREND_SCOUT_URLS_END---');

  } catch (e) {
    console.error(`❌ Eroare Trend Scout: ${e.message}`);
    if (browser) await browser.close();
    console.log('\n---TREND_SCOUT_URLS_START---');
    console.log(JSON.stringify([]));
    console.log('---TREND_SCOUT_URLS_END---');
  }
}

scoutTrends();
