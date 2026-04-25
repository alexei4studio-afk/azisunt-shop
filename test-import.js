const { execSync } = require('child_process');

const products = [
    "https://www.temu.com/ro/1pc-led-crystal-ball-night-light-3d-solar-system-moon-galaxy-crystal-ball-g-601099512395123.html",
    "https://www.temu.com/ro/1pc-desktop-water-fountain-with-led-light-indoor-zen-relaxation-waterfall-g-601099513361789.html",
    "https://www.temu.com/ro/1pc-portable-mini-sewing-machine-handheld-electric-stitch-tool-for-home-travel-g-601099514000123.html",
    "https://www.temu.com/ro/1pc-rechargeable-led-headlamp-super-bright-waterproof-headlight-for-camping-running-g-601099515000456.html",
    "https://www.temu.com/ro/1pc-wooden-digital-alarm-clock-with-wireless-charging-led-display-g-601099516000789.html"
];

console.log("🚀 Pornire Batch Import de test (5 produse)...");

for (const url of products) {
    try {
        console.log(`\n📦 Importare: ${url}`);
        execSync(`node mega-auto-import.js "${url}"`, { stdio: 'inherit' });
    } catch (error) {
        console.error(`❌ Eroare la importul ${url}:`, error.message);
    }
}

console.log("\n✅ Batch Import Finalizat!");
