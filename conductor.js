const { execFileSync } = require('child_process');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

console.log('🎻 Orchestra (Conductor.js) pornește (SUPABASE)...');
console.log('====================================================\n');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
const socialKitBasePath = path.join(__dirname, 'social-media-kit');

const defaultConfig = {
  urls: [],
  steps: { trendScout: true, import: true, rewrite: true, qc: true, socialKit: true }
};
const config = process.env.ORCHESTRA_CONFIG
  ? JSON.parse(process.env.ORCHESTRA_CONFIG)
  : defaultConfig;

function generateMarketingPlan(product) {
  const { name, slug, marketing } = product;
  if (!marketing || !marketing.hook) {
    return null;
  }

  const scriptContent = Array.isArray(marketing.script)
    ? marketing.script.map(s => `**[${s.time}]** (VIZUAL: ${s.visual}) (TEXT: ${s.text_overlay || 'N/A'}) (SFX: ${s.sfx || 'N/A'})`).join('\n')
    : marketing.script
      ? marketing.script.split('\n').map(line => line.trim()).join('\n')
      : 'N/A';

  return `
=========================================
🚀 SOCIAL MEDIA AD PACKAGE: ${name}
=========================================

 THE HOOK:
"${marketing.hook}"

📖 THE STORY:
"${marketing.story || 'O piesă esențială pentru un stil de viață rafinat.'}"

🎬 TIKTOK/REELS SCRIPT:
${scriptContent}

📸 DESIGN PROMPT (Pentru AI Image Generation):
"High-end product photography of ${name}, minimalist luxury setting, soft natural lighting, 8k resolution, cinematic composition, quiet luxury aesthetic, neutral tones."

🔗 PRODUCT LINK:
https://azisunt.shop/p/${slug}

📱 HASHTAGS:
#quietluxury #minimalist #lifestyle #romania #azisunt #trending #premium
=========================================
  `.trim().replace(/^\s+/gm, '');
}

async function runOrchestra() {
  const startTime = Date.now();

  try {
    // --- PASUL 1: Trend Scout ---
    let trendUrls = [];
    if (config.steps.trendScout) {
      console.log('--- PASUL 1/5: Trend Scout (Căutare produse trending) ---');
      try {
        const output = execFileSync('node', [path.join(__dirname, 'scripts', 'trend-scout.js')], {
          encoding: 'utf-8',
          timeout: 120000,
        });
        console.log(output);

        const match = output.match(/---TREND_SCOUT_URLS_START---\s*([\s\S]*?)\s*---TREND_SCOUT_URLS_END---/);
        if (match) {
          trendUrls = JSON.parse(match[1].trim());
        }
      } catch (e) {
        console.error(`   ⚠️ Trend Scout a eșuat: ${e.message}`);
        console.log('   -> Se continuă fără produse noi.\n');
      }
      console.log(`--- ✅ Trend Scout finalizat. Găsite ${trendUrls.length} URL-uri. ---\n`);
    } else {
      console.log('--- PASUL 1/5: Trend Scout — SKIP ---\n');
    }

    // Merge custom URLs with trend scout URLs
    if (config.urls.length > 0) {
      console.log(`📌 ${config.urls.length} URL-uri custom adăugate manual.`);
      trendUrls = [...config.urls, ...trendUrls];
    }

    // --- PASUL 2: Import produse noi ---
    if (config.steps.import && trendUrls.length > 0) {
      console.log('--- PASUL 2/5: Import produse noi ---');
      let imported = 0;
      for (const url of trendUrls) {
        try {
          console.log(`   🔄 Import: ${url}`);
          const importScript = url.includes('temu.com') || url.includes('temu.to')
            ? path.join(__dirname, 'mega-auto-import.js')
            : path.join(__dirname, 'mega-auto-import-emag.js');
          execFileSync('node', [importScript, url], {
            stdio: 'inherit',
            timeout: 120000,
          });
          imported++;
        } catch (e) {
          console.error(`   ❌ Eroare import ${url}: ${e.message}`);
        }
      }
      console.log(`--- ✅ Import finalizat. ${imported}/${trendUrls.length} produse importate. ---\n`);
    } else if (!config.steps.import) {
      console.log('--- PASUL 2/5: Import — SKIP ---\n');
    } else {
      console.log('--- PASUL 2/5: Import — Niciun URL de importat. ---\n');
    }

    // --- PASUL 3: AI Luxury Rewrite ---
    if (config.steps.rewrite) {
      console.log('--- PASUL 3/5: AI Luxury Rewrite (produse fără marketing) ---');
      const { data: productsToRewrite, error: rwError } = await supabase
        .from('products')
        .select('id, name, marketing')
        .is('marketing', null);

      if (rwError) {
        console.error(`   ⚠️ Eroare la fetch produse pentru rewrite: ${rwError.message}`);
      } else if (productsToRewrite && productsToRewrite.length > 0) {
        console.log(`   Găsite ${productsToRewrite.length} produse fără marketing data.`);
        for (const p of productsToRewrite) {
          try {
            console.log(`   ✍️ Rescriere: ${p.name}...`);
            execFileSync('node', [path.join(__dirname, 'scripts', 'luxury-rewrite.js'), p.id], {
              stdio: 'inherit',
              timeout: 60000,
            });
          } catch (e) {
            console.error(`   ❌ Eroare rewrite ${p.name}: ${e.message}`);
          }
        }
      } else {
        console.log('   -> Toate produsele au deja marketing data.');
      }
      console.log('--- ✅ AI Rewrite finalizat. ---\n');
    } else {
      console.log('--- PASUL 3/5: AI Rewrite — SKIP ---\n');
    }

    // --- PASUL 4: Quality Control ---
    if (config.steps.qc) {
      console.log('--- PASUL 4/5: Quality Control (verificare linkuri + imagini) ---');
      try {
        execFileSync('node', [path.join(__dirname, 'agent-quality-control.js')], {
          stdio: 'inherit',
          timeout: 300000,
        });
      } catch (e) {
        console.error(`   ⚠️ QC a eșuat: ${e.message}`);
      }
      console.log('--- ✅ Quality Control finalizat. ---\n');
    } else {
      console.log('--- PASUL 4/5: Quality Control — SKIP ---\n');
    }

    // --- PASUL 5: Export Social Media Kit ---
    if (config.steps.socialKit) {
      console.log('--- PASUL 5/5: Export Social Media Kit ---');
      const { data: products, error } = await supabase
        .from('products')
        .select('*, product_images(url)');

      if (error) {
        console.error('Error fetching products for marketing:', error.message);
      } else {
        let filesGenerated = 0;

        for (const product of products) {
          if (product.marketing) {
            const planContent = generateMarketingPlan(product);
            if (planContent) {
              const productKitDir = path.join(socialKitBasePath, product.slug);
              if (!fs.existsSync(productKitDir)) {
                fs.mkdirSync(productKitDir, { recursive: true });
              }
              const marketingPlanPath = path.join(productKitDir, 'marketing-plan.txt');
              fs.writeFileSync(marketingPlanPath, planContent);
              console.log(`   ✅ Kit generat pentru: ${product.name}`);
              filesGenerated++;
            }
          }
        }

        if (filesGenerated > 0) {
          console.log(`\n   🎉 ${filesGenerated} kit-uri de social media generate în /social-media-kit.`);
        } else {
          console.log('   -> Nu au fost găsite produse cu date de marketing pentru kit-uri.');
        }
      }
      console.log('--- ✅ Export Social Media finalizat. ---\n');
    } else {
      console.log('--- PASUL 5/5: Social Media Kit — SKIP ---\n');
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`🎻 Orchestra finalizată în ${elapsed}s.`);
  } catch (error) {
    console.error('❌ Eroare majoră în Orchestra:', error);
  }
}

runOrchestra();
