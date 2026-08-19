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
1. **Geen enkele JSON-LD** in de build (0 treffers). Toevoegen: `Organization`, `BreadcrumbList`, `WebSite` (Promidata's Structured Data-plugin, €100, checken of deze ondersteund worden), `Product` (checken of Shopware dit al standaard levert), `FAQPage` (**zelf bouwen** — geen Shopware FAQ-module, onze FAQ is eigen `<details>/<summary>`-HTML, dus JSON-LD moet met de hand mee, gebaseerd op `faq-bron.md`).
2. **Breadcrumbs bewust verborgen** via `.cms-breadcrumb{display:none}` op thema/service/merken → kost navigatie + BreadcrumbList-signalen. Heroverwegen.
3. **Overzichtspagina's missen `<h1>`** (services-overzicht: h1=0, kop is `h2.rg-theme-heading`); idem waarschijnlijk merken/thema-overzicht.
4. **`<title>` + meta-description per pagina**: CMS-niveau (Shopware) — Ward vult later per pagina in. Verifiëren dat ze uniek + keyword-gericht zijn.
5. **Interne links** wat plat: spokes linken niet terug, geen breadcrumbs.

## 🟡 GEO (AI-antwoorden)
- Sterk: niet/wel- en verhaal-blokken zijn expliciet + citeerbaar.
- Mist: `FAQPage`-schema, antwoord-eerst samenvattingen, entiteits-koppeling (`Organization` + `sameAs`).

## ♿ Toegankelijkheid
- **Contrast**: cognac `#CA853F` op crème `#F7F5F2` ≈ 2.8:1 → zakt onder WCAG AA (4.5:1) voor tekst-eyebrows (site-breed). Donkerder oker of groter/vetter overwegen.

## 🔍 Nog zelf te checken (n.a.v. Promidata-vragenronde 19 aug 2026)
Onderstaande punten kunnen we zelf verifiëren, geen vraag aan Promidata nodig:
1. **Product slider**: reserveert hij ruimte vóór het laden van de afbeeldingen (aspect-ratio/width+height), of schuift de pagina nog als ze binnenkomen? Laadt hij alle slides vooraf of pas als ze in beeld komen?
2. ~~Autoplay op de slider~~ — **al uit**, bevestigd 19 aug.
3. **Server-side caching**: draait sowieso, wisbaar via de Shopware-backend. Checken welk type cache precies actief is en hoe snel een CMS-wijziging na publiceren zichtbaar is.
4. **JSON-LD**: audit van 6 aug vond 0 treffers (zie hierboven). Na alle CMS-wijzigingen sindsdien opnieuw checken of dat nog steeds klopt, en of Shopware zelf iets genereert dat we over het hoofd zien.
5. **XML-sitemap**: checken of die de losse thema-CMS-pagina's automatisch meeneemt.

**Redirects domein-switch (was vraag 7 aan Promidata)**: niet nodig — bevestigd 19 aug dat er nog geen live/geïndexeerde versie van rootedgoods.eu bestaat, alleen deze dev-omgeving. Geen SEO-waarde om te behouden bij de switch.

## 🧩 CMS-content (gevonden tijdens mobile-audit 14 aug 2026)
1. ~~Dubbel contentblok op `/onboarding-welkomstpakket`~~ — **opgelost** (18 aug, Ward heeft het dubbele blok uit het CMS verwijderd).
2. **Verouderde links in het "Services & ontzorging"-blok op de homepage**: linkt naar `/fulfillment-warehousing` en `/verzending-meerdere-locaties`; de echte pagina's heten `/warehousing-fulfillment` en `/verzending-naar-meerdere-locaties` (bevestigd via de `/services/`-pagina). `home-services-blok.html` in de repo heeft al de juiste links — het live CMS-blok op de homepage is een oudere versie die opnieuw geplakt moet worden.

## 📊 Prioritering
1. `<title>` + meta-description per pagina (CMS) — grootste hefboom. *(Ward doet dit in Shopware.)*
2. JSON-LD: `Organization`/`BreadcrumbList`/`WebSite` via Promidata's plugin (€100, dekking nog checken) + `FAQPage` zelf bouwen (service/thema). *(FAQ-bron staat in `faq-bron.md`.)*
3. `width`/`height` op alle content-`<img>` + `fetchpriority=high` op hero.
4. Hero-hoogte-JS herzien (CLS ná paint) + `<h1>` op overzichtspagina's.
5. Breadcrumbs heroverwegen (of BreadcrumbList-schema zonder UI).
6. Cognac-eyebrow contrast; CSS minifien/splitsen; jsDelivr-SPOF afwegen.

**Meet eerst:** Lighthouse/PageSpeed op een live thema-pagina mét echte foto's.
