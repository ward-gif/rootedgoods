# Mobiele header, 10 november 2026

Gemeten op de **live** site (rootedgoods.eu, alleen lezen) met headless Chromium,
`meet.mjs`, viewports 320/360/375/390/430/768 px, cache uit. Eén paginalading per
viewport. De wishlist is gesimuleerd door de badge `3` te geven (zoals Shopware dat
doet); er is niets op de site veranderd.

`voor.json`/`voor768.json` zijn de live stand, `na.json` de live stand met sectie 58
uit `rootedgoods.css` er ná ingevoegd (`sectie-58.css`). `proto-1.css` en `proto-2.css`
zijn de tussenstappen. Schermafdrukken: `voor-*`, `na-*`, `proto2-*`.

| | voor | na |
|---|---|---|
| Logo t.o.v. het midden, 360/390/430 px | 2 / 17 / 37 px te links | 0 / 0 / 0 |
| Zoekicoon bij gevulde wishlist | 46 px naar links, tegen het logo | blijft staan (wishlist-icoon weg op <992 px) |
| Zoekbalk openen: eerste frame | 0 naar 36 px in één frame | begint op 0, grootste stap 4,3 px per frame |
| Zoekbalk openen: laatste frame | n.v.t. | monotoon tot 79,2 px, geen sprong aan het eind |
| Zoekbalk sluiten | niet gemeten | grootste stap 4,3 tot 4,7 px per frame |
| Headerhoogte | 95,6 px | 95,6 px (96 px op 320) |
| Icoon-rand links/rechts | 24 / 26 px | 16 / 16 px (<400 px), 20 / 20 px (>=400 px) |

Oorzaken:
- Het logo: `<picture class="header-logo-picture">` heeft van het thema `width: 200px`
  en `min-width: 200px`; het logo (157 px) zat links in dat vak.
- De sprong van het zoekicoon: het icoonblok groeit 46 px zodra het hartje verschijnt.
- Het haperen: 36 px padding (1rem + 1.25rem) op `.collapse.show/.collapsing`. Een
  eerste poging met de padding op `.header-search` miste dat tijdens de animatie de
  class `.collapse` ontbreekt (`.collapsing`); de balk sprong dan aan het eind alsnog
  36 px. Beide selectors zijn nodig.

Niet gemeten: een echt toestel, iOS Safari (toetsenbord dat opent bij focus,
adresbalk), tikdoelen (knoppen zijn 46 x 34 px, hoogte onder de 44 px; niet aangeraakt,
omdat de pagina eronder een vaste headerhoogte compenseert), en de zwevende
wishlist-knop op een echt toestel (alleen dat hij `display: flex` krijgt).
