const { execSync } = require('child_process');

const products = [
    "https://www.temu.com/ro/1pc-magnetic-suction-lamp-stepless-dimming-rechargeable-reading-lamp-for-dormitory-desk-wardrobe-g-601099513361427.html",
    "https://www.temu.com/ro/1pc-transparent-led-note-board-with-pen-usb-powered-night-light-rewritable-message-board-g-601099512395350.html",
    "https://www.temu.com/ro/1pc-mini-portable-clothes-steamer-handheld-garment-steamer-for-travel-home-g-601099513000123.html",
    "https://www.temu.com/ro/1pc-smart-temperature-display-water-bottle-stainless-steel-vacuum-flask-g-601099514000456.html",
    "https://www.temu.com/ro/1pc-foldable-bluetooth-keyboard-portable-wireless-keyboard-for-tablet-phone-g-601099515000789.html"
];

console.log("🏁 Pornire Batch Import (5 produse)...");

for (const url of products) {
    try {
        console.log(`\n---------------------------------------------------`);
        console.log(`📦 Importare: ${url}`);
        execSync(`node mega-auto-import.js "${url}"`, { stdio: 'inherit' });
    } catch (error) {
        console.error(`❌ Eroare la importul ${url}:`, error.message);
    }
}

console.log("\n✅ Batch Import Finalizat!");
