# Kersthero op desktop en mobiel, 5 november 2026

Ruwe metingen bij `docs/hero-analyse-desktop-mobiel-2026-11-05.md`. Geen conclusies
hier; die staan in dat document.

## Wat er gedaan is

1. **Testpagina één keer opgehaald** met `curl` (HTTP 200, 192.453 bytes, 13.30 uur).
   Het heroblok daarin is, genormaliseerd op witruimte, gelijk aan
   `blokken-def/thema-eindejaarsgeschenken-band.html`. De slider toont 9 pakketten.
2. **Replica gebouwd**: dezelfde HTML met de twee jsDelivr-links vervangen door
   `file://`-paden naar `rootedgoods.css` en `rootedgoods.js` uit de repo, en een
   `<base href="https://rootedgoods.eu/Test-page-concepts12">` zodat thema-CSS, fonts en
   beelden van de site laden. De replica zelf staat niet in deze map (192 kB kopie van
   een live pagina); hij is in twee minuten opnieuw te maken met de stappen hierboven.
3. **Headless Chromium** (`chrome-headless-shell` uit `~/Library/Caches/ms-playwright/`,
   versie 1234) via het DevTools-protocol, aangestuurd met Node 24 (ingebouwde
   WebSocket, geen afhankelijkheden). Eén paginalading per script; viewports gewisseld
   met `Emulation.setDeviceMetricsOverride` zonder herladen. Totaal verkeer naar
   rootedgoods.eu: één `curl` van de testpagina, één van `/offerte`, en de
   paginaladingen van de scripts (thema-assets, grotendeels uit de profielcache).
4. **Wards schermafdruk** (`hero-desktop-1800px.png`, 3840 × 2160) in pixels gemeten met
   `meet-desktop.py` (Pillow). Knophoogte en kopregelafstand geven allebei 1,8
   device-px per CSS-px: Arc op 90% zoom, layout-viewport circa 1931 × 1112 CSS-px.
   De schermafdruk zelf staat in Wards scratchpad en niet hier.

## Bestanden

| Bestand | Wat |
|---|---|
| `metingen.json` | Eerste ronde: 390×844, 360×780, 414×896, 520×953, 992×900, 1440×900, 1738×1001. Per viewport rects en computed styles van header, hero, kop, feiten, vraag, knop, logo's, band, tegels, link, volgende sectie. |
| `metingen-2.json` | Tweede ronde: 390×844, 375×667, 1931×1112, 1280×800. Zelfde velden (`regels` is leeg door een escapefout in het script; de regelafbrekingen staan in `titelvarianten.json`). |
| `titelvarianten.json` | Kop als nu, met harde spaties, op de basismaat van 41.1 (41,6/70,4 px), op 36/64 px, optie B, en met de bestaande `em`-accentregel. Per variant op 390, 1280 en 1931: lettergrootte, regels met hun woorden, kophoogte, herohoogte, y van de band. |
| `gewichtvarianten.json` | Kop met basisgewicht 400 en 500 en één woordgroep in 700, op 32/56 en 36/64 px. Zelfde velden. |
| `replica-<b>x<h>.png` | Schermafdruk van het eerste scherm per viewport (mobiel op 2x). |
| `replica-<b>-lang.png` | Mobiel, 1700 px hoog, tot voorbij de link onder de band. |
| `variant-*.png` | Schermafdrukken van de kopvarianten, 390, 1280 en 1931. |
| `cdp-meting.mjs`, `cdp-meting-2.mjs`, `cdp-varianten.mjs`, `cdp-gewicht.mjs` | De meetscripts. Paden naar de scratchpad erin; aanpassen voor hergebruik. |
| `meet-desktop.py` | De pixelmeting van Wards schermafdruk. |

## Kerngetallen

| | 390×844 | 375×667 | 1280×800 | 1931×1112 |
|---|---:|---:|---:|---:|
| header | 96 | 96 | 141 | 141 |
| hero | 138 tot 531 | 138 tot 531 | 176 tot 604 | 177 tot 619 |
| kop | 32 px, 3 regels, 102 px | idem | 55,2 px, 2 regels | 56 px, 2 regels, 119 px |
| feiten | 16,3 px, 3 regels | idem | 20,2 px | 20,8 px |
| vraag | 16,2 px, 2 regels | idem | 18,4 px | 18,4 px |
| knop | 253 × 48, y 423 | idem | 253 × 48 | 253 × 48, y 468 |
| logo's | 3 × 22 px | idem | 4 × 35 px | 4 × 35 px |
| band | 531 tot 837 | 531 tot 837 | 604 tot 974 | 619 tot 989 |
| band zichtbaar | 306 | 136 | 196 | 370 |
| cookiebalk vanaf | 600 | 423 | 734 | 935 (op 1738: 935) |

Validatie: op 1931 zit de replica binnen 7 px van Wards schermafdruk (kop 233 tegen
240, knop 468 tegen 464, band 619 tegen 623).

## Nameting na de bouw (map `na/`)

Zelfde methode, replica opnieuw gebouwd uit `test.html` met het gewijzigde blok uit
`blokken-def/` en de gewijzigde `rootedgoods.css` en `rootedgoods.js` (CSS-sectie 55,
JS-stap 3b). Script `cdp-na.mjs`; uitvoer `na/metingen-na.json` en `na/na-*.png`.
De tabel met oud tegen nieuw staat in het verslag bij de oplevering en in
`docs/hero-analyse-desktop-mobiel-2026-11-05.md` is niets gewijzigd: dat document
beschrijft de toestand vóór de bouw.

## Nameting ronde 2 (map `na2/`)

Na Wards oordeel op 1931 px ("wat vol geduwd, slider en knop kunnen lager") is
CSS-laag 55.9 toegevoegd: extra lucht alleen vanaf 992 px, in twee stappen (992 tot
1599 px circa +36 px, vanaf 1600 px circa +84 px). Script `cdp-na2.mjs`, zelfde replica.
Gemeten band-begin: 390 px 482 (onveranderd), 1280 × 800 591 (209 px zichtbaar),
1440 × 900 597 (303 px), 1738 × 1001 658 (343 px; onderkant van de tegels op 1000),
1931 × 1112 658 (alles, link op 1032 tot 1069).

## Ontwerpvarianten (map `ontwerp/`) en nameting ronde 3 (map `na3/`)

`ontwerp/`: de varianten uit `docs/hero-ontwerpvoorstel-2026-11-05.md` (feitenregel
eruit, noot één regel, feitenstrook onder de band, regel twee in Montserrat), script
`cdp-ontwerp.mjs`. `na3/`: de bouw daarvan plus de laptoplaag (versprong uit, hero-lucht
deels terug, tegel 216 px tussen 992 en 1599) en de `title`-opschoning, script
`cdp-na3.mjs`. Nieuw in de meting: `prijsOnder` (onderkant van de prijsregel, maximum
over de eerste acht tegels), `tegelOnder`, `tegelBreedte`, `titles` (overgebleven
`title`-attributen in de band) en de positie van de strook.

## Beeldronde voor Ward (map `na5/`)

Script `cdp-na5.mjs`, twee paginaladingen (mobiel geladen op 390, desktop op 1931,
omdat de header-JS van de site bij een wissel van breedte zonder herladen de mobiele
header niet ombouwt). Erin: `basis-*` (de stand met CSS 55.11 en 56), `contour-5pct`,
`-8pct`, `-12pct` op 1931, `kop-V1/V2/V3` op 390 en 1931 (alleen in de replica
geïnjecteerd, niet in de repo), `cirkel-uit-*`, `cirkel-eindcta-*`,
`cirkel-featurerow-*`. `metingen-na5.json` heeft de posities en de regelafbrekingen.
De map `na4/` is dezelfde ronde vóór de laatste luchtcorrectie en met het
header-artefact; alleen bewaard voor de volledigheid.

## Mobiele lucht en cirkeldekking (map `na6/`)

`cdp-na6.mjs`: afstanden tussen de hero-elementen op 390, 375 en 360 px na CSS 55.12
(`metingen-na6.json`, veld `afstanden`), met `mobiel-lucht-390/375.png` en de lange
versies tot 900 px. `cdp-cirkel.mjs`: de cirkelpijl met doorschijnend wit op 15, 20 en
30% (`cirkel-<pct>pct-hero-<breedte>.png` en `cirkel-<pct>pct-eindcta-<breedte>.png`,
390 en 1931), `cirkel-dekkingen.json` met de computed achtergrondkleur per stand.
Contrasten van de witte pijl op de gemengde cirkelkleur zijn berekend met de WCAG
2.x-formule: 15% 3,52, 20% 3,23, 25% 2,95, 30% 2,71.

## Contour, tweede keuzeronde (map `na7/`)

Ward zag 8% live als "te subtiel". `cdp-contour.mjs`: rechts afgesneden op 12, 16 en
20% effectief (twee achtergrondlagen van dezelfde SVG, zie CSS 55.11), een grotere
uitsnede op 16% (`contour-groot-16pct-1931.png`, kader 1100 × 700, kaart begint op
x=981 en loopt dus achter de kop), en een laptopvariant op 1280 en 1440 (`contour-
laptop-16pct-*.png`, kleiner en rechtsonder; op 1280 overlapt de kaart de kop nog 84 px,
op 1440 32 px). `cdp-contour2.mjs`: gecentreerd achter de hele inhoud op 16 en 20%
(`contour-centr-*pct-1931.png`). `contour-varianten.json` heeft per variant de
kaartmaat, de linkerrand van de kaart en de rechterrand van de kop. Contrast van de kop
over de donkerste kaartlijn, berekend: 12% 7,93, 16% 7,40, 20% 6,88 (op crème 9,68).

## Variant D gebouwd, eindcontrole (map `na8/`)

Contour gecentreerd achter de inhoud, 20% effectief, vanaf 992 px (CSS 55.11).
`cdp-na8.mjs`, `metingen-na8.json`, `D-<breedte>.png` op 390, 375, 1280, 1440 en 1931.
Band-begin, tegels en prijsregel identiek aan `na6/` (de contour kost geen hoogte):
390 band 415, prijs tot 644; 375 marge 23; 1280 band 499, prijs tot 776 (marge 24);
1440 prijs tot 782; 1931 prijs tot 916. Kaart op 1280: 1021 × 646 px, kader 180% van
de herohoogte, gecentreerd; de kop staat erop, zoals bedoeld.

## Contour als masker op `.cms-page`, kleurkeuze (map `na9/`)

Na Wards oordeel live ("te aanwezig, lichter, strak tegen het menu, onder de slider
door"). De SVG staat nu als `mask-image` op `.cms-page::before` met een effen
achtergrondkleur, dus kleur en dekking zijn variabelen; daarvoor is
`svg/europa-contour-vol.svg` gemaakt (stroke-opacity 1, nog niet gecommit, relatieve
URL in de CSS, vóór publicatie naar een SHA). Let op bij meten: een `mask-image` laadt
niet vanaf `file://` (CORS), dus de replica is voor deze ronde via een lokale http-server
op poort 8777 bediend, met de repo als submap; het script `cdp-na9.mjs` verwacht die.
Vier combinaties op 1931 (`contour-A-zand-100`, `B-warmgrijs-45`, `C-zachtgroen-22`,
`D-bosgroen-12`), een lange afdruk van C tot onder de band, C op 1280, en de
structuurcheck (`metingen-na9b.json`):
`.cms-page` begint op 141 direct onder de header op 1931 en 1280; hero, band en
prijsregel ongewijzigd (390 band 415 prijs 644; 1280 band 499 prijs 776; 1931 band 589
prijs 916). Berekende lijnkleur over crème en contrast van de kop erop: A (234,227,215)
lijn 1,17 kop 8,26; B (199,195,188) 1,61 en 6,00; C (213,215,207) 1,34 en 7,25;
D (223,224,218) 1,22 en 7,93.

## De hele kaart (map `na10/`)

Ward live: "wordt afgesneden aan de onderkant, moet doorlopen." `cdp-opaak.mjs` mat eerst
of dat kan: `.cms-page` is op 1931 tot y=4721 transparant, geen sectie heeft een eigen
achtergrond; het eerste opake element onder de band is de foto van de feature-rij
(y=1347, 680 px breed). Daarna masker op `mask-size: contain`, bovenaan, 1140 px hoog
vanaf 1600 en 900 px op 992 tot 1599 (`cdp-na10.mjs`, `metingen-na10.json`). Gemeten:
1931 kaart 1803 × 1140, van 141 tot 1281, strook 959 tot 987, link 1015 tot 1051,
introkop 1153, foto 1347; 1280 kaart 1280 × 809 (breedte knelt eerst), van 140 tot 949,
link 875 tot 912, introkop 1014. Mobiel ongewijzigd (pseudo `none`, band 415, prijs 644).
Beelden `contour-heel-1931-lang.png` (1500 px) en `contour-heel-1280-lang.png` (1200 px).

## De "dubbele lijnen" in de kaart (mappen `na11/` en `na12/`)

`cdp-svggroepen.mjs`: de twee stijlgroepen van `svg/europa-contour.svg` apart gerenderd,
kaal in donkere lijnen (`svg-kaal-st0/st1/beide.png`) en op de pagina in zand
(`pagina-alleen-st0/alleen-st1/beide-1931.png`). `.st0` (35 paden, 12 polygonen) zijn
47 kleine eilanden; `.st1` (91 paden, 55 polygonen) is de kaart. De dubbeling zit in
`.st1` zelf: landen zijn losse gesloten vormen, elke binnengrens staat twee keer.
`cdp-dikte.mjs`: lijndikte 0,8 (zoals het was), 1,4 en 2,0, elk op de pagina en als
uitsnede van Midden-Europa op 2x (`grenzen-*-uitsnede.png`). Op 1,4 vallen de twee
grenslijnen samen; gekozen en in het bestand gezet. Beide groepen blijven.

## De gevulde kaart als masker (map `na13/`)

Na Wards afwijzing van lijndikte 1,4 (teruggedraaid naar 0,8). `cdp-vlak.mjs` rendert
`svg/europa-vlak.svg` als masker (testvariant met de eilanden gevuld) op 1931: zand op
10, 16, 22 en 100% en zachtgroen op 10 en 16%, elk met een uitsnede van Iberië op 2x
(`vlak-<kleur>-<pct>-1931.png`, `vlak-<kleur>-<pct>-uitsnede-iberie.png`). Gevuld geeft
een lijn per grens (de kier tussen de landen), nooit dubbel. Berekend, vlak tegen crème
en kop op het vlak: zand 10% 1,02 en 9,52; 16% 1,03 en 9,44; 22% 1,04 en 9,35; 100% 1,17
en 8,26. Op 10 tot 22% zand zijn de grenzen op de pagina niet te zien; op 100% wel. De
CSS staat sinds deze ronde op `europa-vlak.svg`, zand 100%, eilanden in het bestand
gevuld.

## Opvallend tijdens het meten

- `.rg-cat-head` (het Inspiratie-blok) meldt `display: flex` maar is onzichtbaar: zijn
  ouder `.cms-block-text` staat op `display: none`. De band begint exact op de onderkant
  van de hero, dus het blok neemt geen ruimte in.
- Het vinkje in de topbalk rendert in de replica als een leeg vierkantje: de Promifonto-
  iconfont laadt niet vanaf `file://`. Op de live pagina staat het vinkje er wel.
- De bestaande `em`-regel voor hero-koppen (41.1) zet `display: inline-block` voor de
  skew. Daardoor mag de regel breken tussen het accent en de komma erna: op 1280 en
  1931 begint regel twee met ", van Europese makers". Met `<strong>` (inline) blijft de
  komma aan "logo" hangen.
- `/offerte` heeft één formulier (`form_018e5c1092a47207896e05675fea9324`, post naar
  `/custom-form/send`): textarea "Waar kunnen we je mee helpen?", naam, e-mail en bedrijf
  verplicht, telefoon optioneel.


## na15: dezelfde kaart als over-ons (door de coördinator, niet door Fable)

Ward: "te onrustig, het moet wel die met lijnen zijn, hoezo niet gewoon dezelfde
pakken als over-ons?" Dat bleek de oorzaak van de hele middag: wat we vergeleken en
bijstelden was `europa-contour.svg` (851,6 x 538,4; 114 paden; elk land een eigen
gesloten vorm met een kier tussen buren). Over-ons laadt `land-europa.svg`
(527,5 x 513,2; 40 paden; `fill: none`; lijn #D1C9BB, 1,5 px, non-scaling) waarin elke
grens een gedeelde lijn is.

Gedaan: masker = `land-europa.svg` op de SHA die over-ons al gebruikt
(7f5f6c06...), kleur `#d1c9bb`, dekking 1. Lokaal bestand en SHA-versie gelijk met
`cmp` (220424 bytes), CORS `*`, een jaar immutable. `europa-contour.svg` en
`europa-vlak.svg` zijn teruggezet naar HEAD. Render op 1931, 1440 en 1280 in `na15/`
(`cdp-lijnen.mjs`), uitsnede van het midden op 2x in `lijnen-uitsnede-midden.png`.

Niet gezien: echte browser van Ward, mobiel (masker staat uit onder 992 px).
Bekend: de fjorden van Noorwegen staan in dit bestand zelf druk getekend en lopen
achter de kop; op /over-ons is dat ook zo.

## na16: lichter, groter, en de schermruimte verdeeld

Ward: kleur lichter; kaart groter zodat hij deels doorloopt in de sectie eronder;
meer ruimte tussen menu en titel; link onder de band praktisch onderaan met lucht
tussen slider en link.

- Kleur `#ddd6ca` (was `#d1c9bb`, de lijnkleur van over-ons). Maskerhoogte 1560 px
  vanaf 1600, 1200 px van 992 tot 1599 (was 1140 en 900).
- Ruimte: band-JS stap 9 meet hoe ver de link van de vouw staat en zet `--rg-lucht`
  (0 tot 220 px) op `<html>`; CSS 55.13 geeft 40% aan de ruimte boven de titel en 60%
  aan de ruimte tussen slider en strook. Vaste basis: 40 px menu-titel op laptops
  (was 24), 72 px plus 20 vanaf 1600 (was 56 plus 20).

Gemeten in de replica (`na16/`, `meting-voor.json` en `meting-na.json`, scripts
`cdp-meet16.mjs` en `cdp-meet16b.mjs`; link t.o.v. de vouw):

| Venster | voor | na | `--rg-lucht` |
|---|---|---|---|
| 1931 x 1112 | 61 px erboven | 24 px erboven (op de afgesproken 24) | 41 px |
| 1738 x 1001 | 50 onder de vouw | 46 onder de vouw | 0 |
| 1512 x 890 | 29 onder | 45 onder | 0 |
| 1440 x 900 | 18 onder | 34 onder | 0 |
| 1280 x 800 | 112 onder | 128 onder | 0 |

Op alles onder circa 1100 px hoogte is er niets te verdelen: de link staat daar al
onder de vouw, en de vaste basis van +16 px maakt dat 16 px erger. Prijsregel op
1280 x 800 staat nu op 792 (marge 8 px, was 24). Wil Ward op laptops de link omhoog,
dan kost dat tegelgrootte of logohoogte; niet gedaan, niet gevraagd.

Valkuil bij het nameten: de replica-browser bewaarde `rootedgoods.js` in een
persistent profiel en de Python-server stuurt geen `Cache-Control`. Zonder
`Network.setCacheDisabled` draaide de oude JS en bleef `--rg-lucht` op 0.
