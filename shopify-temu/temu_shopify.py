"""
Temu → Shopify Batch Uploader
azisunt.shop | Afiliere Temu
-------------------------------
Instalare:
    pip install playwright requests pillow python-dotenv
    playwright install chromium

Configurare:
    Pune tokenul tău Shopify în variabila SHOPIFY_TOKEN de mai jos.
    Pune domeniul magazinului în SHOPIFY_STORE.

Rulare:
    python temu_shopify.py
"""

import asyncio
import re
import sys
import time
import os
from dotenv import load_dotenv

import requests
from playwright.async_api import async_playwright

# Încarcă variabilele din .env.local dacă există
load_dotenv(os.path.join(os.path.dirname(__file__), "../.env.local"))

# ─────────────────────────────────────────────
# CONFIGURARE — editează doar această secțiune
# ─────────────────────────────────────────────

SHOPIFY_TOKEN = os.getenv("SHOPIFY_ADMIN_API_ACCESS_TOKEN", "9c7ca81233c5362c794fc40e1bd22230")
SHOPIFY_STORE = os.getenv("SHOPIFY_STORE_DOMAIN", "azisunt.shop")          # fără https://
TEMU_AFFILIATE_BASE = "https://temu.to/k/eye6kqbhfbg"  # linkul tău de afiliat

# ─────────────────────────────────────────────

SHOPIFY_API_VERSION = "2024-01"
SHOPIFY_BASE = f"https://{SHOPIFY_STORE}/admin/api/{SHOPIFY_API_VERSION}"
HEADERS = {
    "X-Shopify-Access-Token": SHOPIFY_TOKEN,
    "Content-Type": "application/json",
}


# ═══════════════════════════════════════════════════════════
# 1. SCRAPER TEMU
# ═══════════════════════════════════════════════════════════

async def scrape_temu_product(url: str) -> dict:
    """Extrage datele unui produs Temu folosind Playwright."""
    print(f"\nSCRAPING: {url}")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            locale="ro-RO",
        )
        page = await context.new_page()

        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=30000)
            await page.wait_for_timeout(4000)  # așteptăm JS să se încarce

            # ── Titlu ──────────────────────────────────────────────
            title_raw = await page.evaluate("""
                () => {
                    const el = document.querySelector('h1') ||
                               document.querySelector('[class*="title"]') ||
                               document.querySelector('[class*="product-name"]');
                    return el ? el.innerText : '';
                }
            """)
            title = clean_title(title_raw)

            # ── Preț ───────────────────────────────────────────────
            price_data = await page.evaluate("""
                () => {
                    const selectors = [
                        '[class*="price"]',
                        '[class*="Price"]',
                        '[data-testid*="price"]'
                    ];
                    for (const sel of selectors) {
                        const el = document.querySelector(sel);
                        if (el && el.innerText.match(/[0-9]/)) {
                            return el.innerText.trim();
                        }
                    }
                    return '0';
                }
            """)
            price = extract_price(price_data)

            # ── Imagini ────────────────────────────────────────────
            images = await page.evaluate("""
                () => {
                    const imgs = [];
                    // Imagini principale produs
                    document.querySelectorAll('img').forEach(img => {
                        const src = img.src || img.getAttribute('data-src') || '';
                        if (src.includes('img.kwcdn.com') || src.includes('temu.com/goods')) {
                            // Maximizăm rezoluția
                            const hq = src
                                .replace(/_\\d+x\\d+\\./, '_800x800.')
                                .replace(/thumbnail/, 'origin')
                                .replace(/\\?.*$/, '');
                            if (!imgs.includes(hq) && hq.startsWith('http')) {
                                imgs.push(hq);
                            }
                        }
                    });
                    return imgs.slice(0, 10); // max 10 imagini
                }
            """)

            # ── Descriere ──────────────────────────────────────────
            description_raw = await page.evaluate("""
                () => {
                    const selectors = [
                        '[class*="description"]',
                        '[class*="detail"]',
                        '[class*="spec"]',
                        '[data-testid="description"]'
                    ];
                    for (const sel of selectors) {
                        const el = document.querySelector(sel);
                        if (el && el.innerText.length > 50) {
                            return el.innerText;
                        }
                    }
                    return '';
                }
            """)
            description_html = format_description(description_raw, title)

            # ── URL produs real (după redirect afiliat) ────────────
            real_url = page.url

        except Exception as e:
            print(f"  ERROR SCRAPING: {e}")
            return {}
        finally:
            await browser.close()

    return {
        "title": title,
        "price": price,
        "images": images,
        "description_html": description_html,
        "source_url": real_url,
        "affiliate_url": url,
    }


def clean_title(raw: str) -> str:
    """Curăță keyword stuffing din titlu."""
    if not raw:
        return "Produs Temu"
    # Elimină repetițiile de cuvinte
    title = raw.strip()
    title = re.sub(r'\s+', ' ', title)
    # Elimină sufixuri comune de keyword stuffing
    patterns = [
        r'\|.*$', r'\-.*descriere.*$', r'cumpara.*$',
        r'pret.*$', r'oferta.*$', r'reducere.*$',
    ]
    for p in patterns:
        title = re.sub(p, '', title, flags=re.IGNORECASE).strip()
    # Limitează la 100 caractere
    return title[:100].strip()


def extract_price(raw: str) -> str:
    """Extrage prețul numeric din string. Suportă format european (1.299,99) și US (1,299.99)."""
    # Format european: punct = separator mii, virgulă = zecimale (ex: 1.299,99)
    m = re.search(r'(\d{1,3}(?:\.\d{3})*),(\d{2})\b', raw)
    if m:
        return m.group(1).replace('.', '') + '.' + m.group(2)
    # Format US/standard: virgulă = separator mii, punct = zecimale (ex: 1,299.99)
    m = re.search(r'(\d{1,3}(?:,\d{3})*)\.(\d{2})\b', raw)
    if m:
        return m.group(1).replace(',', '') + '.' + m.group(2)
    # Fallback: primul număr simplu găsit
    numbers = re.findall(r'\d+', raw)
    if numbers:
        return numbers[0] + '.00'
    return "0.00"


def format_description(raw: str, title: str) -> str:
    """Formatează descrierea în HTML curat."""
    if not raw or len(raw) < 10:
        return f"<p>Produs de calitate: <strong>{title}</strong></p>"

    lines = [l.strip() for l in raw.split('\n') if l.strip()]
    html_parts = [f"<h2>Detalii produs</h2>"]

    bullet_lines = []
    for line in lines:
        if len(line) < 5:
            continue
        if re.match(r'^[\-\•\*]', line) or len(line) < 80:
            bullet_lines.append(f"<li>{line.lstrip('-•* ')}</li>")
        else:
            if bullet_lines:
                html_parts.append(f"<ul>{''.join(bullet_lines)}</ul>")
                bullet_lines = []
            html_parts.append(f"<p>{line}</p>")

    if bullet_lines:
        html_parts.append(f"<ul>{''.join(bullet_lines)}</ul>")

    html_parts.append(
        f'<p><strong>👉 <a href="{TEMU_AFFILIATE_BASE}" target="_blank" rel="nofollow">'
        f'Vezi prețul actual pe Temu</a></strong></p>'
    )

    return '\n'.join(html_parts)


# ═══════════════════════════════════════════════════════════
# 2. SHOPIFY UPLOADER
# ═══════════════════════════════════════════════════════════

def upload_image_to_shopify(image_url: str, product_id: str, position: int) -> bool:
    """Adaugă o imagine la un produs Shopify direct din URL extern."""
    endpoint = f"{SHOPIFY_BASE}/products/{product_id}/images.json"
    payload = {
        "image": {
            "src": image_url,
            "position": position,
        }
    }
    resp = requests.post(endpoint, headers=HEADERS, json=payload, timeout=30)
    if resp.status_code in (200, 201):
        print(f"    IMAGE {position} UPLOADED")
        return True
    else:
        print(f"    IMAGE {position} FAILED: {resp.status_code}")
        return False


def set_metafield(product_id: str, affiliate_url: str):
    """Setează metafield-ul custom.link_temu."""
    endpoint = f"{SHOPIFY_BASE}/products/{product_id}/metafields.json"
    payload = {
        "metafield": {
            "namespace": "custom",
            "key": "link_temu",
            "value": affiliate_url,
            "type": "url",
        }
    }
    resp = requests.post(endpoint, headers=HEADERS, json=payload, timeout=15)
    if resp.status_code in (200, 201):
        print(f"    METAFIELD SET")
    else:
        print(f"    METAFIELD FAILED: {resp.status_code}")


def create_shopify_product(data: dict) -> str | None:
    """Creează produsul în Shopify și returnează product_id."""
    endpoint = f"{SHOPIFY_BASE}/products.json"

    payload = {
        "product": {
            "title": data["title"],
            "body_html": data["description_html"],
            "vendor": "Temu",
            "product_type": "Afiliere",
            "tags": "temu-afiliat, import-auto",
            "status": "draft",  # draft mai întâi, verifici și publici manual
            "variants": [
                {
                    "price": data["price"],
                    "inventory_management": None,
                    "fulfillment_service": "manual",
                    "requires_shipping": False,
                }
            ],
        }
    }

    resp = requests.post(endpoint, headers=HEADERS, json=payload, timeout=30)

    if resp.status_code in (200, 201):
        product = resp.json()["product"]
        product_id = product["id"]
        print(f"  PRODUCT CREATED: {data['title']} (ID: {product_id})")
        return str(product_id)
    else:
        print(f"  ERROR CREATING PRODUCT: {resp.status_code}")
        return None


def upload_product(data: dict) -> bool:
    """Pipeline complet: creare produs + imagini + metafield."""
    if not data:
        return False

    # 1. Creare produs
    product_id = create_shopify_product(data)
    if not product_id:
        return False

    # 2. Imagini
    print(f"  UPLOADING {len(data['images'])} images...")
    for i, img_url in enumerate(data["images"], start=1):
        upload_image_to_shopify(img_url, product_id, i)
        time.sleep(0.5)  # evităm rate limiting

    # 3. Metafield afiliat
    set_metafield(product_id, data["affiliate_url"])

    return True


# ═══════════════════════════════════════════════════════════
# 3. INTERFAȚĂ BATCH
# ═══════════════════════════════════════════════════════════

async def run_batch(urls: list[str]):
    """Procesează o listă de URL-uri Temu."""
    print(f"\n{'='*50}")
    print(f"  TEMU -> SHOPIFY UPLOADER | azisunt.shop")
    print(f"  {len(urls)} products to process")
    print(f"{'='*50}")

    success = 0
    failed = 0

    for i, url in enumerate(urls, 1):
        print(f"\n[{i}/{len(urls)}] PROCESSING...")
        url = url.strip()
        if not url:
            continue

        # Scrape
        data = await scrape_temu_product(url)

        if not data or not data.get("title"):
            print(f"  ERROR: Could not extract data from: {url}")
            failed += 1
            continue

        # Upload
        ok = upload_product(data)
        if ok:
            success += 1
        else:
            failed += 1

        # Pauză între produse (evită ban Temu)
        if i < len(urls):
            print(f"  WAIT 3 SECONDS...")
            await asyncio.sleep(3)

    print(f"\n{'='*50}")
    print(f"  SUCCESS: {success} products")
    print(f"  FAILED: {failed} products")
    print(f"  All products are in Draft - check and publish in Shopify Admin")
    print(f"{'='*50}\n")


def get_urls_from_user() -> list[str]:
    """Citește URL-urile de la utilizator (paste multiplu)."""
    print("\n" + "="*50)
    print("  TEMU -> SHOPIFY BATCH UPLOADER")
    print("  azisunt.shop")
    print("="*50)
    print("\nLipește URL-urile Temu (unul pe linie).")
    print("   Apasă ENTER pe o linie goală când termini:\n")

    urls = []
    while True:
        try:
            line = input()
            if line.strip() == "":
                if urls:
                    break
                continue
            urls.append(line.strip())
        except EOFError:
            break

    return urls


def load_urls_from_file(filepath: str) -> list[str]:
    """Încarcă URL-uri dintr-un fișier text (unul pe linie)."""
    with open(filepath, "r", encoding="utf-8") as f:
        return [l.strip() for l in f.readlines() if l.strip()]


# ═══════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════

def check_shopify_connection():
    """Verifică dacă tokenul și domeniul sunt valide."""
    endpoint = f"{SHOPIFY_BASE}/shop.json"
    try:
        resp = requests.get(endpoint, headers=HEADERS, timeout=10)
        if resp.status_code == 200:
            shop_name = resp.json().get("shop", {}).get("name", "Shopify Store")
            print(f"CONNECTED TO: {shop_name}")
            return True
        else:
            print(f"CONNECTION FAILED: {resp.status_code} - {resp.text}")
            return False
    except Exception as e:
        print(f"CONNECTION ERROR: {e}")
        return False


if __name__ == "__main__":
    # Verificare conexiune
    if not check_shopify_connection():
        print("\nERROR: Could not connect to Shopify.")
        print("Please check your SHOPIFY_ADMIN_API_ACCESS_TOKEN and SHOPIFY_STORE_DOMAIN in .env.local")
        print("Make sure the token starts with 'shpat_'.")
        sys.exit(1)

    # Mod de rulare
    if len(sys.argv) > 1:
        # python temu_shopify.py urls.txt
        urls = load_urls_from_file(sys.argv[1])
        print(f"LOADED {len(urls)} URLS from {sys.argv[1]}")
    else:
        # Mod interactiv
        urls = get_urls_from_user()

    if not urls:
        print("No URLS provided. Exiting.")
        sys.exit(0)

    asyncio.run(run_batch(urls))
