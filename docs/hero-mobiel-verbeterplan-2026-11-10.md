# Kersthero op mobiel: wat er staat en wat er moet veranderen, 10 november 2026

Ward, na het plakken van het band-blok: "niet per se beter dan voorheen en nog niet
goed to go." Hieronder wat ik gemeten heb, een voorstel dat in één ronde CSS en JS
gebouwd kan worden zonder opnieuw te plakken, en de getallen waarmee de bouwer kan
bewijzen dat het beter is. Ruwe uitvoer, scripts en beelden:
`docs/metingen/2026-11-10-mobiel-hero-analyse/` (lees `notities.md` daar eerst).

**Hoe ik gekeken heb.** Eén verse kopie van de live pagina (11.45 uur), nagebouwd als
replica met de thema-CSS, de echte logo's en pakketfoto's en onze CSS/JS uit de
werkkopie; headless Chromium, cache uit, rootedgoods.eu geblokkeerd. 18 verzoeken aan
de site in totaal, daarna nul. Viewports 360 × 740, 375 × 667, 390 × 844 en 430 × 932,
met en zonder de cookiebalk (nagemeten: 245 px tot 390 px breed, 169 px op 430).
Wards schermafdruk is een 430 × 932 (iPhone Pro Max); de replica staat daar binnen 6 px
van. Desktop (1280 × 800, 1931 × 1112) is alleen gemeten om te bewijzen dat het voorstel
daar niets verandert.

---

## 0. Eerst dit: de band staat niet live

`git log origin/main..main` is leeg, en `rootedgoods.min.css@main` op jsDelivr bevat
`rg-page-hero--band` **0 keer**, `rootedgoods.min.js@main` bevat `rg-band` **0 keer**
(beide opgehaald 10 november, 11.44 uur). Secties 53 tot en met 56 en de band-IIFE
staan alleen in de werkkopie (`git diff HEAD --stat`: 1.355 regels CSS, 362 regels JS
niet gecommit). Het blok zelf staat wél live (`rg-page-hero--band` en de strook staan
in de verse kopie).

Wat Ward ziet is dus zijn werkkopie via Resource Override. Wat een bezoeker ziet is het
band-blok zonder zijn CSS en JS: de hero in de opmaak van sectie 36 (gewicht 800,
15ch), de strook verborgen (`hidden`), de Shopware-slider als gewone tiny-slider, en het
"Inspiratie"-blok ertussen. Alles hieronder gaat over de werkkopie; stap 0 van het
voorstel is publiceren.

---

## 1. Wat ik zie, gemeten

Op volgorde van effect op de conversie op mobiel (89,6% van het verkeer, 29 oktober tot
en met 2 november). Getallen in CSS-px vanaf de bovenkant van de pagina, viewport
375 × 667 tenzij anders gezegd. "Nu" is de werkkopie van 10 november.

**1. De hero-kolom staat op x = 40, de rest op x = 20.** De CMS-blokcontainer van de hero
heeft inline `padding: 20px 20px 20px 20px` (live HTML, regel 1293) en de hero heeft
zelf 20 px (sectie 53.1). De band, de strook en de link staan op 20. Twee linkerlijnen
op één scherm, en 40 px minder kolom: 295 px op 375, 280 op 360. Daardoor:

**2. De kop is op 375 en 360 px vier regels, met een streepje.** "Kerstpak-" / "ketten
met" / "jouw logo, van" / "Europese makers" (sectie 36 zet `hyphens: auto`; met de
statische Playfair 500/700 van de site nagemeten). Op 390 en 430: drie regels. De
nameting van 5 november gaf op 375 nog drie regels; toen stond de kolom op 350 px, op
de testpagina zonder blokpadding. De vierde regel kost 38 px, en daarmee:

**3. De prijs staat op 375 × 667 onder de vouw.** Band op 453, prijsregel van de eerste
tegel tot 682: **15 px onder** de vouw. Ward's eis was 23 px erboven, en dat was het op
5 november ook (644). Op 360 × 740 37 px marge, op 390 × 844 200 px.

**4. Bij een eerste bezoek is er op een telefoon geen product en geen prijs in beeld.**
De cookiebalk begint op 375 × 667 op y = 422, op 390 × 844 op 599. Boven de balk op
375: kop, knop, noot, logo's, en **0 px** tegel; op 360 × 740: 14 px tegel. Op
390 × 844 wel 177 px tegel, maar een iPhone 12 tot 15 in Safari houdt met adres- en
tabbalk circa 390 × 660 over (publieke toestelmaten, niet gemeten), en dan is het
weer 0. Op `/eindejaarsgeschenken` gingen 129 van de 317 taps (40,7%) naar de
cookiecontainer (Clarity, 1 tot 27 oktober, `docs/plan-cookiebalk-2026-11-06.md`). Dat
eerste scherm is dus wat de helft van de bezoekers een tijd ziet, en het zegt niets
over prijs of afname. Het laatste wat erboven staat zijn drie grijze logo's.

**5. De feitenregel onder de band is een lijstje van drie, en hij valt onder de vouw.**
Drie regels van 25,2 px (725 tot 801 op 375; 687 tot 763 op 390), elk "vet, dan zacht":
"**Vanaf € 25** per persoon" / "**vanaf 10** stuks" / "**stel je eigen pakket** samen".
Drie keer hetzelfde patroon leest als een opsomming (`brand/voice.md`: geen rij
vinkjes-met-voordeel), de hoofdletter wisselt (Vanaf, vanaf, stel), en het derde item
is een werkwoordszin tussen twee getallen (`voice.md`: labels in een rij in dezelfde
grammaticale vorm). Op 375 × 667 staat de hele regel onder de vouw, en op elke
telefoon met cookiebalk achter de balk. De twee getallen die een inkoper als eerste
wil weten (`audience/icp.md`: "minimumaantallen, levertijd, sample") staan dus op de
plek die het minst gezien wordt. Contrast is in orde: zacht groen 5,10:1, inkt 13,2:1.

**6. De logo's kosten 54 px van de hero en bewijzen op deze maat weinig.** Drie logo's
op 34 px, grijs met opacity 0,65. Pixelanalyse op 2x: het Zuiderzorg-woordmerk is
10,5 px hoog en de onderregel 2 px; "ifes" 23 px met "Nederland" op 5,5 px; Erasmus MC
is één blok handschrift van 34 px. Zonder label. Ze staan tussen de noot en de band en
sluiten bij een eerste bezoek het scherm af (punt 4). Ward houdt ze; de vraag is waar.

**7. De tegels.** Naam in 11,2 px kapitalen, cognac, spatiëring 0,08 em: dat is het
kicker-idioom dat Ward op 5 november uit de hero heeft gehaald, negen keer terug op de
band. Cognac op wit haalt 4,56:1, net AA voor 11 px kapitalen, en `brand/visual.md`
zegt: cognac is actie. 1 van de 9 namen wordt afgekapt ("Koffiebeker, lunchbox en
Bambook", 3 regels in een clamp van 2; de naam is 200 tot 229 px breed op elke geteste
maat, hij past nergens). Prijs 14,7 px inkt, prima. Bij het laden staan er op 375 twee
tegels van 168 px precies in de kolom (20 tot 188, 200 tot 368) en **0 px** van de
derde: de rij leest pas als schuifbaar zodra hij beweegt; op 390 10 px, op 430 50 px.
Inhoud: 4 van de 9 tegels zijn een borrelplank (tegel 1, 5, 7 en 8), op Wards afdruk
staan er twee naast elkaar; Bak pakket (€ 25) staat niet in de slider, de goedkoopste
tegel is € 31, dus "vanaf € 25" belooft een prijs die je niet ziet. Dat is CMS-werk en
staat al in `docs/plakronde-themapagina-band-2026-11-05.md`.

**8. De link "Alle kerstpakketten" is 36,6 px hoog**, onder de 44 px voor een tikdoel.

**9. Ritme.** Kop naar knop 24, knop naar noot 20, noot naar logo's 16, logo's naar tegel
28, tegel naar strook 28, strook naar link 20, link naar volgende kop 90. Alles tussen
16 en 28: niets hoort bij elkaar en niets staat los. De noot hoort bij de knop en staat
er 20 px vanaf; de logo's horen nergens bij en staan er 16 px vanaf.

**10. Wat een bezoeker in de eerste drie seconden begrijpt en kan doen.** Begrijpt:
kerstpakketten, met jouw logo, Europese makers; er is een knop die vraagt wat je zoekt.
Begrijpt niet: wat het kost, vanaf hoeveel stuks, hoe het eruitziet (op 375 en bij een
eerste bezoek). Kan doen: de knop (260 × 48, 4,56:1 wit op cognac, in orde) of de
cookiebalk.

**Wat klopt en blijft.** De kop: 36 px, gewicht 500 met het accent in 700, 9,68:1, drie
regels op 390 en 430. De knop met de cirkelpijl. De noot op één regel (13,6 px, 5,10:1).
De band technisch: alleen `transform`, pauze buiten beeld en bij slepen, klonen
`aria-hidden`. Desktop: band op 601 op 1931 × 1112, kop twee regels, strook één regel.

---

## 2. Voorstel, uitvoerbaar

Eén ronde, alleen CSS en JS, **geen herplak nodig**. Alles achter de markers
`.rg-page-hero--band` / `.rg-band-pagina` en onder 992 px; desktop blijft byte voor byte
gelijk (gemeten, zie 3). De code staat kant-en-klaar in
`docs/metingen/2026-11-10-mobiel-hero-analyse/voorstel-sectie-57.css` en
`voorstel-stap-8b.js`; de meting `na-def.json` is van precies die twee bestanden.

De gedachte in één zin: **zet de twee getallen in de hero en de logo's onder de band,
dan staat op elke telefoon bij een eerste bezoek de prijs in beeld, begint de band boven
de cookiebalk, en staat de prijsregel van de tegels op 375 × 667 55 px boven de vouw in
plaats van 15 eronder.**

### Stap 0. Publiceren

`bin/publiceer.sh "Kersthero: band-CSS en band-JS, plus sectie 57 en stap 8b"`. Zonder
deze stap ziet de bezoeker het kale blok (deel 0). Houd rekening met regel 3 uit
CLAUDE.md: wie de site deze week bezocht heeft, heeft de oude bundel zeven dagen in de
browser. Herplak: nee. Risico: de purge op `@main` komt niet altijd door (regel 2);
controleer met een SHA-URL.

### Stap 1. CSS: sectie 57, helemaal achteraan in `rootedgoods.css`

Ná 55.13 (de laatste regels van het bestand), want 53, 55, 55.12 en 55.13 zetten
dezelfde marges en bij gelijke specificiteit wint de laatste. Volledige inhoud:
`voorstel-sectie-57.css`. Per onderdeel:

| # | Wat | Waarom (meting) | Hoe | Zeker of aanname |
|---|---|---|---|---|
| 57.1 | Blokpadding links en rechts van het hero-blok op 0 onder 992 px | Kolom 295 in plaats van 335 op 375, kop 4 regels, prijs 15 px onder de vouw (punt 1 tot 3) | `.rg-band-pagina .cms-section:has(.rg-page-hero--band) .cms-block-container` en `…[style]`: `padding-left:0 !important; padding-right:0 !important` | Zeker: kolom terug naar 335, kop 3 regels op 360, 375, 390 en 430 (gemeten) |
| 57.2 | Kop nooit met streepje | "Kerstpak-ketten" (punt 2) | `hyphens: manual` op `.rg-page-hero--band .rg-page-hero__title`, `margin-bottom: 0.75rem` | Zeker voor de geteste breedtes; onder 360 niet gemeten |
| 57.3 | De twee getallen als één regel onder de kop | Punt 4 en 5: prijs en afname boven de cookiebalk op elke telefoon | Nieuw element `.rg-page-hero__cijfers` (maakt stap 8b), Montserrat 0,95 rem onder 400 px, 1 rem erboven, zacht groen met de getallen in inkt 700, middelpuntje in `--rg-muted`, `margin: 0 0 1.25rem` | Gemeten breedte "Vanaf € 25 per persoon · vanaf 10 stuks": 300,8 px bij 15,2 px, 316,6 bij 16 px; kolom 320 op 360, 335 op 375. Eén regel op alle vier de breedtes (gemeten) |
| 57.4 | Ritme | Punt 9 | padding 16 boven, 24 onder; kop 12 naar cijfers, cijfers 20 naar knop, knop 12 naar noot, noot 24 naar de tegels | Keuze, niet meetbaar beter; drie afstanden (12, 20, 24) in plaats van zes |
| 57.5 | Band `padding-top: 4px` in plaats van 8 | De versprong staat onder 992 uit (55.7), de 8 px zijn leeg; 4 blijft voor de focusring | `.rg-band-pagina .rg-band { padding-top: 4px !important }` | Zeker |
| 57.6 | Derde feit als regel boven de link, met hoofdletter; link 51 px hoog | Punt 5 en 8 | `.rg-page-hero__strook--onder` 0,95 rem, `::first-letter { text-transform: uppercase }` op het blok-span; `.rg-band__meer { padding: 0.85rem 0.1rem }` | Zeker: tikhoogte 51,0 (gemeten) |
| 57.7 | Logo's onder de band, na de link, op 34 px | Punt 4 en 6: 54 px hero-hoogte; het eerste scherm sluit nu op grijs | `.rg-page-hero__logos--onder { margin: 1.5rem 0 0 20px }` en `img { height: 34px }` (zonder die regel vallen ze terug op de 22 px van sectie 36, gemeten in prototype B) | Zeker qua maat. Aanname: onder "Alle kerstpakketten" lezen drie grijze logo's als klanten, niet als makers. Niet getest met bezoekers |
| 57.8 | Tegelnaam zinsletters, bosgroen, 12,8 px, gewicht 500, geen spatiëring; prijs 15,2 px | Punt 7: kicker-idioom, cognac als decoratie, 4,56:1 | `.rg-band-pagina .rg-band .product-name` met `!important` op gewicht en kleur (tegen sectie 10 en 53.4, die dat ook met `!important` zetten) | Zeker: 10,53:1 op wit; nog steeds 1 van 9 namen afgekapt, dat lost geen maat op (zie CMS) |
| 57.9 | Tegel 156 px onder 576 px, card-body 8/8/12 | Punt 7: 0 px van de derde tegel bij het laden | `--rg-band-tile: 156px` | Zeker: 19 px van de derde tegel op 375, 34 op 390, 74 op 430; packshot 136 in plaats van 148 px breed. Aanname: 136 px is genoeg voor een borrelplank (beeld `na-def-375x667.png`) |

Specificiteitsval, voor de bouwer: niets hiervan werkt als het vóór sectie 53 of 55
komt te staan, en de `!important`'s in 57.8 zijn niet uit luiheid maar omdat sectie 10
(regel ~1858 en ~1917) dezelfde eigenschappen met `!important` zet. Brace-check vóór de
push doet `bin/publiceer.sh`.

### Stap 2. JS: stap 8b van de band-IIFE vervangen

In `rootedgoods.js`, het blok "8b. De feitenstrook" (regel ~2755) volledig vervangen door
de inhoud van `voorstel-stap-8b.js` (zonder de buitenste wrapper en de twee
`querySelector`-regels voor `marker` en `slider`, die bestaan daar al). Wat het doet:

- Onder 992 px (`matchMedia`, één keer bij laden): maakt `<p class="rg-page-hero__cijfers">`
  met de eerste twee `.rg-page-hero__strook-feit`-spans en het eerste puntje, zet dat
  direct na de kop; haalt het tweede puntje weg; zet `rg-page-hero__strook--onder` op
  de strook met alleen het derde feit; verplaatst de strook onder de slider (zoals nu);
  verplaatst `.rg-page-hero__logos` naar na `.rg-band__meer` met de class
  `rg-page-hero__logos--onder`.
- Vanaf 992 px: precies wat het nu doet, strook onder de band, logo's in de hero.
- Werkt op het blok zoals het nu geplakt is (drie feit-spans, twee punt-spans). Minder
  dan drie feiten (de zes andere themablokken hebben er één): niets splitsen, strook
  onder de band zoals nu, logo's wél onder de band. Dat is op die pagina's hetzelfde
  effect zonder cijferregel; niet gemeten, zie 5.

Herplak: nee. Risico: een venster dat ná het laden over de 992-grens wordt gesleept
houdt de layout van het laadmoment. Op een telefoon kan dat niet (ook liggend blijft
hij onder 992); op een laptop is het geen gebruikssituatie. Gemeten: `na-def.json`.

### Stap 3. In de CMS-editor (Ward, geen code)

Al bekend uit `docs/plakronde-themapagina-band-2026-11-05.md`, hier met het gemeten
gevolg erbij:

1. **Bak pakket (€ 25) in de slider.** De strook zegt "vanaf € 25", de goedkoopste tegel
   is € 31. Zolang dat zo is belooft de hero iets dat de band niet laat zien.
2. **Twee van de vier borrelplanken eruit** of uit elkaar zetten (nu tegel 1, 5, 7, 8).
3. **"Inspiratie"-blok weg.** Staat er nog (3 treffers in de verse kopie); CSS verbergt
   het, maar wat alleen door CSS onzichtbaar is komt terug zodra de CSS achterloopt.
4. **Blokpadding van het hero-blok op 0.** 57.1 vangt het af, maar dan klopt de bron ook.
5. **Productnaam "Koffiebeker, lunchbox en Bambook" korter** (bijvoorbeeld "Koffiebeker
   en lunchbox"), of accepteren dat hij op de band met een ellips eindigt. Hij is 200 tot
   229 px breed en past op geen enkele maat in twee regels van 132 tot 140 px.

### Stap 4. Bij de volgende herplak, niet nu

Bundelen met de herplak die het klikformulier toch vraagt (besluit 1 van 10 november:
de strooktekst verandert dan). Drie dingen die alleen in HTML kunnen:

- `met&nbsp;jouw` in de kop: voorkomt een losse "met" op kolommen onder 320 px. Op 360 tot
  430 is hij er met 57.1 al niet meer.
- De strook als twee alinea's in de bron in plaats van één die de JS splitst:
  `<p class="rg-page-hero__cijfers" hidden>…</p>` en `<p class="rg-page-hero__strook" hidden>…</p>`;
  stap 8b wordt dan drie regels korter en de `::first-letter`-truc kan weg omdat "Stel"
  gewoon met een hoofdletter in de bron staat.
- `data-rg-band-label` blijft "Alle kerstpakketten".

### Waarom niet de variant met de logo's in de hero

Gemeten als prototype A2 (`na-A2.json`): cijfers in de hero, logo's erin gehouden, marges
strakker. Op 375 × 667 komt de prijsregel dan op 645, **22 px** boven de vouw (eis 23),
en bij een eerste bezoek staat er **0 px** tegel boven de cookiebalk; de logo's blijven
het laatste wat je ziet. Het voorstel haalt 55 px en 27 px. Het verschil is precies de
54 px van de logo-rij.

---

## 3. Acceptatiecriteria, in cijfers

Nulmeting = werkkopie 10 november (`voor.json`). Doel = `na-def.json`. De bouwer meet na
met dezelfde replica:

```bash
cd docs/metingen/2026-11-10-mobiel-hero-analyse
# replica bouwen (één keer; de verse kopie staat in de scratchpad, zie notities.md)
python3 bouw-replica.py <scratchpad>/serve
(cd <scratchpad>/serve && python3 -m http.server 8777 --bind 127.0.0.1 &)
# na de bouw in rootedgoods.css en rootedgoods.js: zonder prototype-bestanden meten
node meet.mjs na-bouw
VP="1280x800,1931x1112" node meet.mjs na-bouw-desktop
```

`meet.mjs` print per viewport de getallen hieronder en schrijft `na-bouw.json` plus de
schermafdrukken. Vergelijk met de doelkolom; een afwijking van 2 px is font-rendering,
meer is een fout.

| Criterium | Nu (375 × 667) | Doel | Waar in JSON |
|---|---:|---:|---|
| Prijsregel van de eerste tegel boven de vouw | −15 px | **≥ 50 px** (gemeten 55) | `vouw.margePrijs` |
| Tegel zichtbaar boven de cookiebalk bij eerste bezoek | 0 px | **≥ 24 px** (gemeten 27) | `vouw.bovenCookie.tegelPxBovenBalk` |
| Prijs en afname boven de cookiebalk | nee | **ja**: `.rg-page-hero__cijfers` onder ≤ 300 (gemeten 267) | `feiten.rect.onder` |
| Kop, aantal regels, zonder koppelteken | 4, met | **3**, zonder, op 360, 375, 390 en 430 | `title.regels` |
| Kolom begint op | x = 40 | **x = 20**, gelijk aan band, strook en link | `title.rect.x`, `strook.rect.x`, `meer.rect.x` |
| Cijferregel, aantal regels | n.v.t. | **1** op alle vier de breedtes | `feiten.regels` |
| Feitenregel onder de band, aantal regels | 3 | **1** ("Stel je eigen pakket samen", hoofdletter zichtbaar) | `strook.regels` |
| Afstanden in de hero | 24 / 20 / 16 / 28 | kop→cijfers **12**, cijfers→knop **20**, knop→noot **12**, noot→tegel **24** (±1) | `title.rect.onder`, `feiten.rect`, `btn.rect`, `noot.rect`, `band.eersteTegel.y` |
| Tikhoogte link "Alle kerstpakketten" | 36,6 px | **≥ 44 px** (gemeten 51) | `meer.tapHoogte` |
| Knop | 260 × 48 | **≥ 44 px hoog**, ongewijzigd | `btn.rect` |
| Contrast lopende tekst (kop, cijfers, noot, strook, link, tegelnaam, prijs) | tegelnaam 4,56 | **alle ≥ 4,5:1**; tegelnaam **≥ 7:1** (gemeten 10,53) | `*.contrast`, `band.tegels[].naam.contrast` |
| Tegelnaam | 11,2 px kapitalen cognac | **12,8 px**, `text-transform: none`, `rgb(45, 69, 40)` | `band.tegels[0].naam` |
| Derde tegel in beeld bij laden | 0 px | **≥ 16 px** op 375 (gemeten 19), ≥ 30 op 390 (34) | `band.zichtbaar` (derde niet-kloon) |
| Afgekapte tegelnamen | 1 van 9 | **≤ 1 van 9** en alleen met ellips (`-webkit-line-clamp: 2`), 0 na stap 3.5 | `band.tegels[].naam.afgekapt` |
| Logo's | 3 × 34 px in de hero | 3 × **34 px**, y ná `meer.rect.onder`, vóór `volgende.y` | `logos.imgs`, `logos.rect.y` |
| Horizontale scroll | geen | **`scrollW` = `vw`** op alle breedtes | `scrollW` |
| Desktop 1280 × 800 en 1931 × 1112 | | **identiek** aan `voor-desktop.json` voor hero, kop, knop, logo's, band, tegel, strook, link, tegelnaam | vergelijking zoals in `notities.md` |
| Console | | geen `rg-band:`-waarschuwing | `Runtime.consoleAPICalled` (handmatig) |

Daarnaast op de live site, na publiceren, met een harde ververs: dezelfde drie getallen
(prijsmarge, tegel boven de balk, kopregels) op een echte iPhone in Safari met de
cookiebalk nog open. Dat kan ik niet; zie 5.

---

## 4. Beelden

In `docs/metingen/2026-11-10-mobiel-hero-analyse/`:

| Voor (nu) | Na (voorstel) |
|---|---|
| `voor-375x667.png` | `na-def-375x667.png` |
| `voor-375x667-cookie.png` | `na-def-375x667-cookie.png` |
| `voor-390x844.png` | `na-def-390x844.png` |
| `voor-390x844-cookie.png` | `na-def-390x844-cookie.png` |
| `voor-375-lang.png`, `voor-390-lang.png` (1400 px) | `na-def-375-lang.png`, `na-def-390-lang.png` |
| `voor-360x740*.png`, `voor-430x932*.png` | `na-def-360x740*.png`, `na-def-430x932*.png` |
| `ward-schermafdruk-430x932.png` | de afdruk van Ward, ter ijking |

De tussenstappen (`na-A`, `na-A2`, `na-B`, `na-B2`) staan er ook, met hun prototype-CSS.
De band is op alle afdrukken bevroren op t = 0 (eerste tegel op de inzet); op Wards
afdruk loopt hij, vandaar de halve tegel links.

---

## 5. Wat ik niet kon meten, en wat bij Ward ligt

**Niet gemeten of alleen aannemelijk.**

- Een echte telefoon. De replica is Chromium zonder thema-JS; Safari's viewporthoogte
  met open adresbalk (circa 660 op een 844-toestel) is een publieke maat, geen meting.
  De 375 × 667-kolom is daar de beste benadering van.
- Montserrat en Playfair 400/600 komen in de replica uit de variabele fonts van de
  showroom; alleen Playfair 500 en 700 (de kop) zijn de statische bestanden van de site.
  De breedtematen van de cijferregel kunnen op de site 1 tot 2 px afwijken; daarom staat
  hij onder 400 px op 0,95 rem met 19 px over.
- Of de logo's onder "Alle kerstpakketten" als klanten gelezen worden. Niet te meten
  zonder bezoekers; de aria-label "Vertrouwd door" blijft staan.
- De zes andere themapagina's: hun sliders en hun strook met één feit zijn niet gezien.
  Stap 8b laat die strook heel; de logo's gaan daar ook onder de band.
- Prestaties: geen Lighthouse of INP-meting van de wijziging. Stap 8b verplaatst twee
  elementen extra, dat is geen meetbare kostenpost; de band zelf is ongewijzigd.
- Effect op conversie: er is geen A/B-mogelijkheid. Het bewijs hierboven is dat de
  informatie en het product eerder in beeld staan, niet dat er meer aanvragen komen.
- De cookiebalk zelf: 245 px, geparkeerd plan, niet aangeraakt. Elke pixel hierboven is
  gewonnen ondanks die balk; een balk van 110 tot 130 px (plan E5) zou meer opleveren
  dan dit hele voorstel.

**Besluiten voor Ward, elk met mijn aanbeveling.**

1. **Logo's op mobiel onder de band, na de link.** Aanbeveling: ja. Het is het verschil
   tussen 22 en 55 px prijsmarge en tussen 0 en 27 px tegel boven de cookiebalk. Desktop
   houdt ze in de hero.
2. **De twee getallen op mobiel in de hero, onder de kop; desktop houdt ze onder de
   band.** Aanbeveling: ja, zo. Het voorbehoud van 5 november ("de positie onder de band
   is het voorbehoud") is sinds het besluit van 10 november niet meer nodig: € 25 en
   min 10 zijn op alle elf pakketten gemeten, de regel is dus waar los van wat er in de
   slider staat. Desktop meeverhuizen is een aparte ronde met een eigen meting; niet nu.
3. **Tegelnaam in bosgroen zinsletters in plaats van cognac kapitalen.** Aanbeveling: ja.
   Cognac blijft voor de knop en voor hover.
4. **Tegel 156 px op telefoons.** Aanbeveling: ja. Als het packshot te klein oogt: 160 px
   geeft 11 px van de derde tegel op 375 en kost 3 px hoogte; onder 156 niet gaan.
5. **De CMS-punten uit stap 3**, vooral Bak pakket in de slider. Aanbeveling: vandaag,
   vóór het publiceren, zodat de strook en de band bij de eerste bezoeker al kloppen.

---

## 6. Gebouwd en nagemeten, 10 november 2026

Ward akkoord op besluit 1 tot en met 4. Sectie 57 staat achteraan in `rootedgoods.css`
(502.939 bytes, brace-diepte 0), stap 8b in `rootedgoods.js` is vervangen
(`node --check` goed). Niet gepubliceerd op het moment van schrijven.

Nameting met `meet.mjs na-bouw` (zelfde replica en scripts, geen prototypebestanden):
`na-bouw.json`, `na-bouw-desktop.json` en `na-bouw-*.png` in
`docs/metingen/2026-11-10-mobiel-hero-analyse/`.

- Mobiel, vier viewports, 2684 velden: 2 wijken af van `na-def.json` (de ifes-afbeelding
  die nog niet gedecodeerd was op 430 px, zoals in de notities al beschreven). De rest
  gelijk binnen 2 px.
- Desktop, 1280 x 800 en 1931 x 1112, 1308 velden: 0 wijken af van `voor-desktop.json`.
- 375 x 667: prijsmarge 55 px (was -15), 27,3 px tegel boven de cookiebalk (was 0),
  kop 3 regels op x = 20, cijferregel 1 regel (contrast 5,1:1), strook 1 regel,
  link 51 px hoog, tegelnaam 12,8 px met 10,53:1, geen horizontale scroll.

Niet gemeten: een echt toestel, de zes andere themapagina's, Safari met adresbalk.
