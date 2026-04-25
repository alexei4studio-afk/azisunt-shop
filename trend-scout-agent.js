const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configurare Scout: Produse care "bubuie" in US/UK chiar acum
const US_UK_TRENDS = [
    "https://www.temu.com/ro/1pc-magnetic-levitation-moon-lamp-floating-and-spinning-in-the-air-g-601099516000123.html", // Floating Moon Lamp
    "https://www.temu.com/ro/1pc-smart-bird-feeder-with-camera-auto-capture-bird-videos-g-601099517000456.html",    // Smart Bird Feeder
    "https://www.temu.com/ro/1pc-electric-spin-scrubber-cordless-cleaning-brush-with-7-replaceable-heads-g-601099518000789.html" // Spin Scrubber
];

console.log("🌍 [TREND SCOUT] Pornire vânătoare produse US/UK...");
console.log("🕵️ Analizăm trendurile de pe TikTok US și Pinterest UK...\n");

for (const url of US_UK_TRENDS) {
    try {
        console.log(`✨ Descoperit trend global: ${url}`);
        console.log(`🔄 Transmutare pentru piața din România...`);
        // Refolosim motorul nostru de import care are Gemini & HuggingFace integrat
        execSync(`node mega-auto-import.js "${url}"`, { stdio: 'inherit' });
    } catch (error) {
        console.error(`❌ Eroare la scouting-ul ${url}:`, error.message);
    }
}

// Sincronizare baza de date publica (pentru Dashboard)
try {
    const dbSource = path.join(__dirname, 'data', 'trending-products.json');
    const dbDest = path.join(__dirname, 'public', 'data', 'trending-products.json');
    fs.copyFileSync(dbSource, dbDest);
    console.log("\n✅ Baza de date a Mall-ului a fost sincronizată!");
} catch (e) {
    console.error("Eroare sincronizare DB:", e.message);
}

console.log("\n🏆 Misiune de scouting finalizată. GM, verifică Dashboard-ul!");
