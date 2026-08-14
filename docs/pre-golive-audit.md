# Pre-golive audit — techniek, SEO, GEO, Core Web Vitals

> Analyse van 6 aug 2026 (nog placeholders in beeld). **Erbij pakken zodra de
> site zo goed als klaar is** en de echte foto's erin staan — dan pas Lighthouse
> draaien voor echte cijfers i.p.v. schattingen.

## ✅ Al goed
- Eén `<h1>` per thema/service-pagina, logische `h2`/`h3`, geen skips.
- 100% alt-dekking op content-afbeeldingen; decoratieve beelden `alt=""` + `aria-hidden`.
- FAQ = native `<details>/<summary>` (toegankelijk, geen JS/INP-kosten).
- Fonts met `display=swap` + `preconnect`; faux-oblique bespaart italic-bestanden.
- Relatieve URL's overal (go-live-proof).
- `aspect-ratio` op spec-cards, service-card-media en meeste `.rg-sd`-beelden.

## 🟠 Core Web Vitals
1. **CLS**: 1/12 images heeft `width`/`height`. Gaten: hero-collage (`.rg-page-hero__img`, desktop geen vaste hoogte/aspect), `.rg-feature-row__img`, product-slider-beelden.
2. **Hero-hoogte-JS** (rootedgoods.js ~510-521): zet ná load `minHeight` via `getBoundingClientRect` + `ResizeObserver` → hero verspringt ná eerste paint. Echte CLS-bron.
3. **LCP**: hero-beeld zonder `fetchpriority="high"`/dimensies; Playfair-`h1` swap geeft kleine tekst-shift.
4. **Render-blocking derde partijen**: CSS (228 KB onverkleind) + JS via jsDelivr, fonts via Google = 2 externe origins in kritiek pad + SPOF. jsDelivr serveert niet-geminified (geen `.min`-pad).
5. **INP**: `MutationObserver` op `document.documentElement` `subtree:true` (zwaarste variant; disconnect op load).

## 🔴 SEO
1. **Geen enkele JSON-LD** in de build (0 treffers). Toevoegen: `Organization`, `FAQPage` (per service/thema), `BreadcrumbList`, `WebSite`, `Product` (thema-check of Shopware levert).
2. **Breadcrumbs bewust verborgen** via `.cms-breadcrumb{display:none}` op thema/service/merken → kost navigatie + BreadcrumbList-signalen. Heroverwegen.
3. **Overzichtspagina's missen `<h1>`** (services-overzicht: h1=0, kop is `h2.rg-theme-heading`); idem waarschijnlijk merken/thema-overzicht.
4. **`<title>` + meta-description per pagina**: CMS-niveau (Shopware) — Ward vult later per pagina in. Verifiëren dat ze uniek + keyword-gericht zijn.
5. **Interne links** wat plat: spokes linken niet terug, geen breadcrumbs.

## 🟡 GEO (AI-antwoorden)
- Sterk: niet/wel- en verhaal-blokken zijn expliciet + citeerbaar.
- Mist: `FAQPage`-schema, antwoord-eerst samenvattingen, entiteits-koppeling (`Organization` + `sameAs`).

## ♿ Toegankelijkheid
- **Contrast**: cognac `#CA853F` op crème `#F7F5F2` ≈ 2.8:1 → zakt onder WCAG AA (4.5:1) voor tekst-eyebrows (site-breed). Donkerder oker of groter/vetter overwegen.

## 🧩 CMS-content (gevonden tijdens mobile-audit 14 aug 2026)
1. **Dubbel contentblok op `/onboarding-welkomstpakket`**: de sectie "Services & ontzorging" + de donkergroene "Van idee tot ingepakt"-CTA staat twee keer achter elkaar onderaan de pagina (de andere 6 thema-pagina's hebben dit niet). Lijkt een CMS-plak-fout op deze ene pagina — losse check/opschoning in Shopware.
2. **Verouderde links in het "Services & ontzorging"-blok op de homepage**: linkt naar `/fulfillment-warehousing` en `/verzending-meerdere-locaties`; de echte pagina's heten `/warehousing-fulfillment` en `/verzending-naar-meerdere-locaties` (bevestigd via de `/services/`-pagina). `home-services-blok.html` in de repo heeft al de juiste links — het live CMS-blok op de homepage is een oudere versie die opnieuw geplakt moet worden.

## 📊 Prioritering
1. `<title>` + meta-description per pagina (CMS) — grootste hefboom. *(Ward doet dit in Shopware.)*
2. JSON-LD: `Organization` (globaal) + `FAQPage` (service/thema). *(FAQ-bron staat in `faq-bron.md`.)*
3. `width`/`height` op alle content-`<img>` + `fetchpriority=high` op hero.
4. Hero-hoogte-JS herzien (CLS ná paint) + `<h1>` op overzichtspagina's.
5. Breadcrumbs heroverwegen (of BreadcrumbList-schema zonder UI).
6. Cognac-eyebrow contrast; CSS minifien/splitsen; jsDelivr-SPOF afwegen.

**Meet eerst:** Lighthouse/PageSpeed op een live thema-pagina mét echte foto's.
