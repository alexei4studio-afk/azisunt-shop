# Temu → Shopify Uploader | azisunt.shop

## Fișiere incluse

| Fișier | Unde merge |
|--------|-----------|
| `temu_shopify.py` | Local pe PC, rulezi din terminal |
| `temu-custom.css` | Shopify → Assets |
| `temu-buy-button.liquid` | Shopify → Snippets |

---

## PASUL 1 — Instalare Python

```bash
pip install playwright requests
playwright install chromium
```

---

## PASUL 2 — Configurare script

Deschide `temu_shopify.py` și editează linia 30:

```python
SHOPIFY_TOKEN = "shpat_PUNE_TOKENUL_TAU_AICI"
```

Pune tokenul tău real care începe cu `shpat_`.

---

## PASUL 3 — Rulare

**Mod interactiv (lipești URL-urile manual):**
```bash
python temu_shopify.py
```
→ Lipești URL-urile Temu, unul pe linie, Enter gol la final.

**Mod fișier (ai multe URL-uri):**
```bash
# Creează urls.txt cu un URL pe linie
python temu_shopify.py urls.txt
```

---

## PASUL 4 — Tema Shopify

### 4.1 Adaugă CSS-ul
1. Shopify Admin → Online Store → Themes → Dawn → **Edit code**
2. `Assets` → **Add a new asset** → blank file → numește-l `temu-custom.css`
3. Copiază conținutul din `temu-custom.css`
4. În `layout/theme.liquid`, adaugă înainte de `</head>`:
   ```liquid
   {{ 'temu-custom.css' | asset_url | stylesheet_tag }}
   ```

### 4.2 Adaugă snippet-ul butonului
1. `Snippets` → **Add a new snippet** → `temu-buy-button`
2. Copiază conținutul din `temu-buy-button.liquid`

### 4.3 Modifică pagina de produs
În `sections/main-product.liquid`:

**Găsește** zona butonului de cumpărare (caută `product-form__submit`)
și adaugă **înainte** de `</form>` sau după form:
```liquid
{% render 'temu-buy-button', product: product %}
```

**Găsește** primul `<div` mare din secțiune și adaugă atributul:
```liquid
data-product-tags="{{ product.tags | join: ',' }}"
```

---

## Cum funcționează

```
URL Temu (batch)
    ↓
Playwright deschide pagina în browser headless
    ↓
Extrage: titlu, preț, imagini, descriere
    ↓
Creează produs în Shopify (status: Draft)
    ↓
Uploadează imaginile în ordinea originală
    ↓
Setează metafield custom.link_temu = linkul tău afiliat
    ↓
Produsul apare în Shopify Admin → Products (Draft)
    ↓
Tu verifici și dai Publish
```

---

## Rezolvare erori comune

| Eroare | Cauză | Soluție |
|--------|-------|---------|
| `401 Unauthorized` | Token greșit | Verifică `SHOPIFY_TOKEN` |
| `Timeout` | Temu blochează | Mărește timeout la 60000 |
| `No images found` | JS nu s-a încărcat | Mărește `wait_for_timeout` la 6000 |
| `playwright not found` | Nu e instalat | `pip install playwright && playwright install chromium` |

---

## Note legale
- Produsele se creează ca **Draft** — verifici înainte de publicare
- Adaugă în Termeni și Condiții că ești site de afiliere
- Veniturile din afiliere se declară ca venituri din drepturi de autor / activități independente
