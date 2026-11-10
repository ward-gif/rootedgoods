# Kersthero op mobiel, 10 november 2026

Ruwe metingen bij `docs/hero-mobiel-verbeterplan-2026-11-10.md`. Geen conclusies hier.

## Wat er gedaan is

1. **Eén verse kopie van de live pagina** (`/eindejaarsgeschenken`, 200, 194.094 bytes,
   11.45 uur, mobiele UA). Daarin: het band-blok (`rg-page-hero--band` en de strook)
   staat live, het "Inspiratie"-blok staat er nog (3 treffers op `rg-cat-head`), de
   slider heeft 9 tegels, de blokcontainer van de hero heeft inline
   `padding: 20px 20px 20px 20px`.
2. **De live bundel op jsDelivr gecontroleerd** (2 verzoeken naar cdn.jsdelivr.net, niet
   naar rootedgoods.eu): `rootedgoods.min.css@main` (213.503 bytes) bevat
   `rg-page-hero--band` **0 keer**, `rootedgoods.min.js@main` (34.424 bytes) bevat
   `rg-band` **0 keer**. `git log origin/main..main` is leeg en `git show HEAD:rootedgoods.css`
   bevat de band-secties niet: secties 53 t/m 56 en de band-IIFE staan alleen in de
   werkkopie. Wat Ward op zijn schermafdruk ziet komt dus via Resource Override van
   localhost:8000, niet van de live site.
3. **Replica** (`bouw-replica.py`): de verse pagina met thema-CSS, logo's, pakketfoto's en
   twee Playfair-gewichten lokaal; onze CSS/JS uit de werkkopie via de symlink `repo`;
   Montserrat en de overige Playfair-gewichten als variabele fonts uit de showroom.
   Thema-JS, FontAwesome, Promifonto en GTM niet geladen. De replica zelf staat in de
   scratchpad (190 kB kopie van een live pagina), niet hier.
4. **Verkeer naar rootedgoods.eu, geteld:** 18 verzoeken in totaal, los en met 0,7 tot
   4 s ertussen: 1 (thema-CSS met de oude hash, 404), 1 pagina, 1 thema-CSS, 4 logo's,
   9 pakketfoto's, 2 fonts. Daarna heeft de meetbrowser het domein geblokkeerd
   (`Network.setBlockedURLs`), dus geen enkele paginalading raakte de site.
5. **Headless Chromium** (`chrome-headless-shell` 1234 uit de Playwright-cache) via het
   DevTools-protocol, Node 24. Cache uit (`Network.setCacheDisabled`), touch aan,
   dpr 2. Eén paginalading per viewport. De band is voor elke meting bevroren op t=0
   (eerste tegel op de inzet van 20 px), anders meet je een willekeurig moment van de
   animatie. Cookiebalk: de echte Shopware-container (`display:none` zonder thema-JS)
   zichtbaar gemaakt met één regel CSS en nagemeten: 245,2 px op 360 tot 390 px breed,
   169,1 px op 430 px.
6. **Wards schermafdruk** (`ward-schermafdruk-430x932.png`, 654 × 1410): de tegel van
   168 px is daarin 252 px, dus 1,52 beeldpixel per CSS-px en een viewport van circa
   430 × 927; een iPhone Pro Max (430 × 932) op 3x, verkleind. In de replica op
   430 × 932 staan kop, knop, logo's, band en strook binnen 6 px van zijn afdruk.

## Bestanden

| Bestand | Wat |
|---|---|
| `bouw-replica.py` | bouwt de replica uit de verse kopie |
| `meet.mjs` | de meting: `node meet.mjs <variant> [css] [js]`, mobiel 360×740, 375×667, 390×844, 430×932; `VP="1280x800,1931x1112"` voor desktop |
| `extra.mjs`, `extra.json` | wat er tussen header en hero zit, breedte van de feitenregel per lettergrootte (canvas, Montserrat), breedte van de tegelnamen, pixelanalyse van de logo's |
| `voor.json`, `voor-*.png` | nulmeting, werkkopie van 10 november, 4 viewports, met en zonder cookiebalk, plus lange afdruk 1400 px |
| `voor-desktop.json` | nulmeting 1280×800 en 1931×1112 |
| `proto-A.css/.js`, `na-A.json`, `na-A-*.png` | prototype A: kolom op 20, cijfers in de hero, logo's blijven in de hero, tegel 156 |
| `proto-A2.css`, `na-A2.*` | A met strakkere marges |
| `proto-B.css/.js`, `na-B.*` | A plus logo's onder de band (op 22 px, de regel van sectie 36; fout, zie B2) |
| `proto-B2.css`, `na-B2.*` | B met logo's op 34 px en cijfers op 0,95 rem onder 400 px |
| `voorstel-sectie-57.css`, `voorstel-stap-8b.js` | **het voorstel zoals het in het plan staat**, met de definitieve klassenamen |
| `na-def.json`, `na-def-*.png`, `na-def-desktop.json` | de meting van het voorstel, mobiel en desktop |
| `ward-schermafdruk-430x932.png` | Wards afdruk, voor de ijking |

## Kerngetallen (y in CSS-px vanaf de bovenkant van de pagina)

| | 375×667 nu | 375×667 voorstel | 390×844 nu | 390×844 voorstel |
|---|---:|---:|---:|---:|
| kolom begint op x | 40 | 20 | 40 | 20 |
| kop, regels | **4** ("Kerstpak-ketten", losse "met") | 3 | 3 | 3 |
| hero, hoogte | 351 | 290 | 313 | 290 |
| band begint | 453 | 392 | 415 | 392 |
| prijsregel van de tegels tot | 682 (**15 onder de vouw**) | 612 (55 erboven) | 644 | 612 |
| tegel boven de cookiebalk bij eerste bezoek | 0 px | 27 px | 177 px | 204 px |
| prijs en afname boven de cookiebalk | nee | ja (regel op 245 tot 267) | nee | ja |
| derde tegel in beeld bij laden | 0 px | 19 px | 10 px | 34 px |
| feitenregel onder de band | 3 regels, 76 px | 1 regel, 23 px | 3 regels | 1 regel |
| link "Alle kerstpakketten", tikhoogte | 36,6 px | 51 px | 36,6 | 51 |
| tegelnaam | 11,2 px kapitalen cognac, 4,56:1 op wit | 12,8 px zinsletters bosgroen, 10,5:1 | idem | idem |
| afgekapte namen (van 9) | 1 | 1 | 1 | 1 |

Desktop (1280×800 en 1931×1112): alle kerngetallen vóór en na identiek (`na-def-desktop.json`
tegen `voor-desktop.json`, vergelijking in de terminaluitvoer; `gelijk: True`).

## Opvallend tijdens het meten

- `main.content-main` heeft sitewide `padding-top: 102px !important` (regel 193), de
  header is op mobiel 95,6 px hoog: 6 px crème tussen header en hero die van niemand is.
  Niet aangeraakt.
- Op 430 px mat de meting de ifes-logo één keer op 40,2 px breed in plaats van 61,1: de
  afbeelding was op dat moment nog niet volledig gedecodeerd. Timing, geen layout.
- De topbalk toont in de replica een andere USP dan op Wards afdruk; de cycler kiest er
  een. Zonder Promifonto ontbreekt het vinkje.
- De tegelnaam "Koffiebeker, lunchbox en Bambook" past in geen enkele geteste maat
  (11,2, 12 en 12,8 px) in twee regels van 132 tot 140 px: 200 tot 229 px breed.
- Logo's op 34 px, pixelanalyse op 2x: Erasmus MC is één blok handschrift van 34 px;
  ifes-woordmerk 23 px met "Nederland" op 5,5 px; Zuiderzorg-woordmerk 10,5 px met de
  onderregel op 2 px. Donkerste pixel bij opacity 0,65 op crème: 6,76:1; de dunne
  lijnen van het handschrift halen dat niet.
