# Laden en gebruikservaring: wat we gemeten en aangepast hebben, 10 november 2026

Gevraagd door Ward: de themapagina's flikkeren nog bij het laden, en kijk site-breed of er winst
te halen is. Alle metingen zijn op de live site (alleen lezen), headless Chromium, mobiel 390 x 844,
eerste bezoek (verse profielmap, cache uit), tenzij anders gezegd. "Traag" is Slow 4G (1,6 Mbit,
150 ms) met de CPU 4x trager; "snel" is 10 Mbit, 40 ms, CPU 2x. Ruwe uitvoer en de scripts staan in
`docs/metingen/2026-11-10-laden-themapagina/` en `docs/metingen/2026-11-10-site-laden/`.

## Wat de bezoeker zag

Op de kerstpagina één layout-shift van 0,8791 op een eerste bezoek (totaal 0,94, twee runs). Tot dat
moment stond de ruwe Shopware-slider als één tegel van 379 x 390 px op de plek van de band. Alle
band-opmaak hangt aan een klasse die pas door de band-JS op `<html>` komt, en die JS laadt extern.
De pagina stond dus eerst in de kale stand en sprong daarna.

De mobiele header deed hetzelfde op elke pagina: vóór de JS stond het logo links (x=12) met de iconen
ernaast, erna gecentreerd met de iconen rechts, en de USP-balk was 12,8 px in plaats van 29,6 px. Layout-shift
0,0204 in elke meting.

## Wat er gebouwd is (alles in `rootedgoods.css` en `rootedgoods.js`, nog niet gepubliceerd)

| Sectie | Wat | Effect |
|---|---|---|
| CSS 59 | Themapagina: de stand vóór de JS gelijk aan de stand erna (ruimte boven de hero, hoogte van de slidersectie, logo's, getallenregel). De ruwe slider is `display: none` tot de JS draait, met achtervang na 4 s. | Kerst mobiel 0,94 naar 0,060; tablet 0,91 naar 0,010 |
| CSS 60 | Mobiele header: dezelfde kolommen met expliciete plek, hamburger vooraf op zijn plek, rij-padding en USP-balk alvast op hoogte | Header vóór en na de JS gelijk op 7 breedtes (320 tot 991 px); 0,0204 per pagina weg |
| CSS 61 + JS 4b | Wat de JS bouwt (band, getallenregel, strook, link, logo's, foto's) fadet in | Visueel zachter, geen layout-effect |
| JS stap 0 + algemene stap onderaan | Voor tegelfoto's de kleinste `srcset`-kandidaat kiezen die de getoonde breedte bij maximaal 2x dekt | Beeldgewicht kerstpagina 3.415 kB naar 696 kB (-80%), alle-producten -50%, categorie -47%, thema-overzicht -59% |
| CSS 62 | Vinkjes in de USP-balk als SVG-masker | Font Awesome (155 kB) wordt niet meer opgehaald, op elke pagina |

Sectie 58 (mobiele header, mooi gecentreerd, geen sprong met wishlist, soepele zoekbalk) is al gepubliceerd in
commit f19731b, maar de `.min.css` op `@main` serveerde op 10 november nog de oude versie (zie CLAUDE.md, punt 2).

## Voor en na (traag, live tegen lokale bestanden)

| Pagina | CLS voor | CLS na | LCP voor (ms) | LCP na (ms) | Lettertypen kB |
|---|---:|---:|---:|---:|---:|
| `/` | 0,108 | 0,097 | 3.892 | 3.520 | 259 naar 105 |
| `/alle-producten/` | 0,133 | 0,001 | 14.340 | 10.952 | 237 naar 82 |
| `/huis-keuken/` | 0,044 | 0,001 | 10.808 | 5.488 | 237 naar 82 |
| PDP (Borrelplank) | 0,089 | 0,064 | 5.076 | 4.684 | 251 naar 97 |
| `/eindejaarsgeschenken` | 0,959 | 0,060 | 2.340 | 2.216 | 282 naar 127 |
| `/thema-s/` | 0,021 | 0,000 | 10.180 | 8.304 | 237 naar 82 |
| `/offerte` | 0,034 | 0,014 | 2.388 | 2.240 | 237 naar 82 |
| `/over-ons` | 0,030 | 0,010 | 5.028 | 4.812 | 259 naar 105 |
| `/merken/` | 0,021 | 0,000 | 2.404 | 2.216 | 245 naar 90 |
| `/search?search=kerstbal` | 0,022 | 0,001 | 2.320 | 2.212 | 237 naar 82 |
| `/contact` | 0,032 | 0,011 | 2.364 | 2.236 | 282 naar 128 |

Op het snelle profiel is de kerstpagina 0,973 naar 0,011. Beeldgewicht (12 s na laden, snel): kerst
3.415 naar 696 kB, alle-producten 2.625 naar 1.324, categorie 1.493 naar 793, thema-overzicht 2.191 naar 892.

**Let op bij het lezen van de tabel:** "na" draait tegen onze lokale, niet-geminificeerde bestanden. De
totale kB in de ruwe JSON is daardoor opgeblazen (de CSS is 519 kB ongecomprimeerd); bruikbaar zijn de
kolommen hierboven en de beeld- en lettertypegewichten. De LCP-waarden van de lijst- en categoriepagina's
zijn die van de cookiebalktekst (zie hieronder), geen echte inhoud.

## Wat er nog beweegt, en wat het kost

- **Het lettertype Playfair wisselt nog** nadat de kop getoond is: 0,0557 op de kerstpagina, 0,0878 op de home
  (over-ons 0,057 op het snelle profiel). Zonder Playfair is het 0,009 respectievelijk 0,000. Een preload van
  de twee of drie gewichten haalt het terug naar 0,001 tot 0,02, tegen een kwart seconde latere LCP op een trage
  verbinding. Dat kan alleen in de `<head>`: staat nu als A5 in `docs/promidata-vragen.md`.
- **De PDP-configurator** verspringt met 0,064 (`product-detail-configurator-group`). Dat is Promidata's JS, niet de onze.
- **Vanaf ~1900 px bij een hoog venster** verdeelt de band-JS de overgebleven schermruimte (`--rg-lucht`, stap 9), en
  dat verschuift de hero tot 16 px en de sectie tot 25 px. Niet te voorspellen vóór de JS.
- **De Europakaart-achtergrond** (vanaf 992 px) verschijnt nog pas na de JS. Geen layout-shift, wel een zichtbare inval.

## Wat we vonden en niet aangepast hebben

- **De cookiebalk is de LCP** op de lijst- en categoriepagina's (`/alle-producten/`, `/huis-keuken/`, `/thema-s/`): de tekst
  van de balk is daar het grootste element, en verschijnt pas als de thema-JS draait (traag 8 tot 14 s, snel 1,8 tot 2,3 s). Dat
  is het gemeten effect van de balk, niet van de pagina. Het compacte-balkplan (`docs/plan-cookiebalk-2026-11-06.md`) pakt dit aan.
- **`/over-ons` heeft 2,6 s CPU (traag, 4x) in één anonieme functie in onze JS**, regel 1812 van `rootedgoods.js`: de route-opbouw
  (400 stappen `getPointAtLength`, en hij draait opnieuw na elke `ScrollTrigger.refresh()` en na het laden van beelden). Weinig verkeer
  (28 weergaven in 36 dagen), dus laag in de rij, maar het is echte INP-last op een telefoon. Voorstel: één keer na `load`, en 160 in plaats van 400 stappen.
- **De home**: 217 afbeeldingen (211 zonder `width` en `height`), 2,6 MB, TBT ~580 ms (traag). De home staat geparkeerd (homeconcept).
- **`promifonto.css`** (S3, render-blokkerend in de head), `all.css` (191 kB) en `all.js` (179 kB) van het thema: niet aan te raken zonder Promidata.
- **Een `preconnect` naar jsDelivr** heeft geen meetbaar effect op de eerste paint (3 rondes, ±30 ms ruis), en is dus niet gevraagd.

## Niet gemeten

- Een echt toestel, Safari (adresbalk, toetsenbord) en andere netwerken dan de twee profielen. Alle bedragen zijn emulatie.
- Of `display` een aangepaste eigenschap via `@keyframes` (de achtervang in sectie 59) in elke Safari-versie na 4 s omzet. In Chromium getest
  (JS geblokkeerd, na 6,5 s staat de slider er); Safari niet.
- De fade in sectie 61 en stap 4b alleen op beeld bekeken (drie opeenvolgende frames), niet op een telefoon.
- Of een tegelfoto op een telefoon met 3x scherm op 400w zichtbaar zachter is dan op 800w: gekozen is een grens van 2x dichtheid; de bronnen
  zijn vaak 500 x 500 px, dus 800w is in die gevallen een opgeblazen bestand, maar dat is per product niet nagelopen.
- PDP, winkelmandje en afrekenen zijn niet doorgemeten op de JS-wijzigingen behalve het laden van de PDP.
- De niet-gepubliceerde stand: alles hierboven staat lokaal (`localhost:8000`) en nog niet op jsDelivr.
