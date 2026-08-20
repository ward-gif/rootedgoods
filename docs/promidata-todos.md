# Promidata TODO's & checks

Lijst van wijzigingen die bij Promidata moeten worden gecontroleerd of doorgevoerd, omdat ze niet via onze eigen CSS/JS efficiënt op te lossen zijn.

---

## 1. Productslider — `productboxMinWidth` verhogen

**Huidige config** (in `data-product-slider-options` op `.base-slider.product-slider`):
```json
{
  "productboxMinWidth": "300",
  "slider": { "gutter": 30, ... }
}
```

**Voorstel**: verhoog `productboxMinWidth` van **300 → 400**.

**Waarom**:
- Met `300` past er op een 1900px scherm ~6 tegels zichtbaar (te veel, geen peek-effect mogelijk).
- Met `400` past er natuurlijk 4–5 tegels met een ingebouwde peek aan de rand.
- Voorkomt dat we via custom CSS de tegel-breedte moeten overschrijven, wat conflict veroorzaakt met TinySlider's interne transform-berekening (gekloonde tegels werden zichtbaar links).

**Impact**: alleen de homepage productslider — geen invloed op PLP, zoekresultaten of andere slots.

---

## 2. Globale implementatie van CSS en JS — DONE ✓

Promidata heeft globaal in het thema toegevoegd:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/ward-gif/rootedgoods@main/rootedgoods.css">
<script src="https://cdn.jsdelivr.net/gh/ward-gif/rootedgoods@main/rootedgoods.js" defer></script>
```

**Caching opmerking**: jsDelivr cached `@main` URLs tot 12 uur. Bij urgente updates kan
de cache geforceerd worden ververst via:
- `https://purge.jsdelivr.net/gh/ward-gif/rootedgoods@main/rootedgoods.css`
- `https://purge.jsdelivr.net/gh/ward-gif/rootedgoods@main/rootedgoods.js`

**Toekomstige verbetering**: switchen van `@main` naar versietags (bv. `@v1.0.0`)
voor controle over wanneer wijzigingen live komen. Vereist git tags maken bij releases.

**Cache-bust trucje**: als jsDelivr `@main` blijft hangen op een oude versie (purge
throttled tot 54 min), forceer een refresh door een micro-commit te pushen — bv.
een spatie of comment toevoegen en pushen. jsDelivr ziet de nieuwe SHA en fetcht
opnieuw. Of vervang `@main` tijdelijk door een commit-SHA in de Promidata theme
URL: `@<sha>/rootedgoods.js` — die is permanent gecached en altijd correct.

**Browser-cache is de échte boosdoener (bevestigd 20 aug), niet alleen de
jsDelivr-edge**: response-headers zijn `Cache-Control: public, max-age=604800,
s-maxage=43200` — de edge (`s-maxage`) ververst na 12u zoals hierboven, maar
elke bezoeker z'n BROWSER onthoudt het bestand zelf **7 dagen** (`max-age`) en
checkt in die tijd niet eens bij de server of er iets nieuws is, ook niet na
een geslaagde edge-purge. Verklaart waarom wijzigingen soms bij de één al
zichtbaar zijn en bij de ander niet: alleen een harde refresh (Cmd/Ctrl+Shift+R)
of een incognito-venster forceert een echte herfetch. Structurele oplossing:
een versie-query in de theme-URL (`rootedgoods.css?v=2`, ophogen per release)
zodat elke wijziging vanzelf een nieuwe, nooit-gecachete URL krijgt i.p.v. te
leunen op purges/hard-refreshes.

---

## 3. (Toekomstig) Custom slider library

Als we ooit het volledige Merchery-niveau aan slider-gedrag willen (smoothe resize, geen clone-issues), zou Promidata kunnen overwegen om Tiny Slider te vervangen door **Swiper.js**. Dat is een grotere change en kost ontwikkeluren — alleen relevant als de huidige fixes onvoldoende zijn.

---

*Laatst bijgewerkt: 23 april 2026*
