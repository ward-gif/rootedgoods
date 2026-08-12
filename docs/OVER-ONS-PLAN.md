# Over ons v7 — "De Route van Rooted" · Plan van aanpak

> **Voor de uitvoerende sessie:** dit is het goedgekeurde bouwplan voor de nieuwe
> Over ons-pagina. Lees dit hele document vóór je begint. Werkwijze van dit
> project: CSS/JS via `rootedgoods.css`/`rootedgoods.js` (jsDelivr, na elke push
> purgen), HTML-blokken als repo-bestand dat Ward in het Shopware-CMS plakt,
> commit+push na elke stap, brace-check op de CSS, lokale preview via
> `_preview.html` op poort 8010 (alleen renderen als Ward erom vraagt).
> Copy-regels: geen em-dashes, `&` in Playfair-koppen via `<span class="rg-amp">`,
> alle interne URLs lowercase. Playfair cursief = faux oblique (nooit de ital-as
> laden).

---

## 1. Concept

**Eén doorlopende kaartreis van Porto naar de Achterhoek.** De pagina ís de
kaart. Een dikke cognac routelijn is de ruggengraat van het verhaal; hij tekent
zichzelf terwijl je scrolt en voert je langs land-outlines die als losse lagen
met eigen snelheid voorbijschuiven (Independent Brewers-mechaniek). Bij elk land
een verhaalstop in Flyward-stijl: genummerde dot, plaatsnaam, korte kernachtige
copy. De reis eindigt thuis, in de Achterhoek, met de belofte.

De narratieve boog: **we vertrokken met een vraag en kwamen thuis met een
bedrijf.**

Geen hero-zoom, geen parallax-fotobanden. Clean, typografisch, met de route +
outlines als enige (maar perfect uitgevoerde) animatie.

## 2. Paginastructuur

### 2.0 Proloog (hero, clean)
- Crème canvas. Eyebrow "Over ons", grote Playfair-kop:
  "Geworteld in *Europees vakmanschap*." + 1 zin lede: de vraag
  ("Kan merchandise gewoon in Europa in elkaar worden gezet? We gingen kijken.")
- De grote Europa-outline (bestaand asset `Europa map.svg`) staat groot en
  ingezoomd half achter de kop, als stille eerste kaartlaag.
- De routelijn begint hier: een kort stukje tekent direct bij binnenkomst
  (scroll-cue; vervangt een pijltje).

### 2.1 Stop 1 — Porto, Portugal · "Het begin"
- Portugal-outline schuift als achtergrondlaag voorbij (groot, aan een zijkant,
  deels buiten beeld).
- Dot "1" + plaatslabel "PORTO · 41.1° N, 8.6° W".
- Copy (kort): de zoektocht, werkplaatsen en ateliers, koffie tussen de
  machines. Antwoord: volmondig ja.

### 2.2 Stop 2 — Savoie, Frankrijk · "Waarom Europa"
- Frankrijk-outline als laag, andere kant, andere snelheid.
- Copy: de grillige wereld (handelsoorlogen, containers) tegenover werkplaatsen
  die je kunt bellen, bezoeken en bij naam kunt noemen.
- Groot quote-moment: "Elke bestelling is een stem voor maakindustrie op
  *eigen bodem*."

### 2.3 Stop 3 — (optioneel land, bv. Duitsland) · "Onze naam"
- De drie wortels, compact (3 hairline-kolommen, bestaand idioom):
  stevigheid / herkomst / voeding. Elk 1-2 zinnen.

### 2.4 Stop 4 — De Achterhoek, Nederland · "Thuis: onze belofte"
- Nederland-outline. De lijn komt thuis.
- Donkergroen statement-paneel: "Geassembleerd in Europa. Op dat woord zijn we
  precies." + 4 beloftes-checks + "Houd ons eraan, daar worden we beter van."

### 2.5 Epiloog — Het team
- Kort: teamfoto + 2 zinnen + belafspraak-kaart (bestaand
  `rg-contact-head__callcard`-component, cal.com werkt automatisch).
- Daarna het bestaande eind-CTA-blok als los CMS-blok.

### Mobiel (per sectie)
- Outlines: kleiner en subtieler (lagere opacity, deels buiten beeld), zelfde
  parallax maar minder verplaatsing.
- Route: bijna-verticale slinger met dezelfde stops; blijft geanimeerd (zie §4:
  het lijnsysteem werkt op elke breedte omdat we niet meer non-uniform rekken).
- Stops worden full-width blokken, dots inline boven de kop.
- Alles getest op 390px en 768px.

## 3. Animatie-systeem

**Library: GSAP + ScrollTrigger** (sinds v3.13 volledig gratis incl. alle
plugins). Motivatie: scrub-gebonden lijn-tekening, gelaagde parallax met
verschillende snelheden en betrouwbare pinning zijn precies waar ScrollTrigger
voor gebouwd is; zelf bouwen kost meer code en is minder soepel. Bundelgrootte
~36KB gzipped (core + ScrollTrigger), alleen op deze pagina geladen:
`rootedgoods.js` detecteert `.rg-route` en injecteert de scripts dan pas
(jsDelivr, defer). Optioneel daarbovenop: **Lenis** (~4KB) voor de boterzachte
scroll-feel, ook alleen op deze pagina.

Wat animeert (alles scrub-gebonden, geen autonome animaties):
1. **Routelijn**: tekent met de scroll (DrawSVG of dashoffset). Het al
   getekende deel is solide cognac (6-7px); het nog af te leggen deel is een
   zwakke stippellijn (kaart-idioom én scroll-affordance).
2. **Land-outlines**: 2 lagen per sectie (bv. outline + schaduwkopie of tweede
   land) met verschillende `yPercent`-snelheden en heel subtiele rotatie.
3. **Dots + plaatslabels**: pop-in (scale + kleur groen naar cognac) op het
   moment dat de lijn ze bereikt.
4. **Copy**: rustige fade/slide-in per stop (1 beweging, geen fade-cascade).
5. **Kilometerteller** (zie §6): telt op met de scroll.
6. **Het reizende blad** (BESLOTEN): het Rooted-bladlogo reist als klein
   element mee op de punt van de getekende lijn (GSAP MotionPathPlugin,
   gratis onderdeel). Het kantelt subtiel mee met de bochtrichting. Geen
   gebounce: rustig meereizen, als de reiziger van het verhaal. Bij de
   laatste stop 'landt' het blad naast de belofte.

**Technische les uit v1-v6 (belangrijk voor de uitvoerder):** gebruik GEEN
`preserveAspectRatio="none"` op de route-SVG's. Non-uniforme rek maakte
dash-technieken kapot (fragmentatie) en vervormde de paden. Nieuw systeem: elk
routesegment is een SVG met vaste aspect-ratio, ontworpen op de werkelijke
verhouding, desnoods per breakpoint een eigen pad (`<path>` wisselen via media
query/JS). Dan werken DrawSVG/dashoffset perfect.

Toegankelijkheid: `prefers-reduced-motion` = lijn volledig getekend, outlines
statisch, geen scrub. Zonder JS idem (CSS-default is de eindstand).

## 4. Assets

### Bestaand (herbruikbaar)
- `Europa map.svg` (Shopware-media, outline zonder binnengrenzen) voor de
  proloog. Kopie in repo zetten voor jsDelivr.
- Teamfoto + belafspraak-avatars (bestaande media).

### Door Ward aan te leveren: land-outlines
Specificaties per land (zelfde stijl als Europa map.svg):
- **SVG, alleen de buitencontour** van het land, geen binnengrenzen/steden.
- Eén path (compound mag), **geen achtergrond-rect**, fill maakt niet uit
  (styling doen wij), strakke viewBox om het land heen.
- Bestandsnamen: `land-portugal.svg`, `land-frankrijk.svg`,
  `land-nederland.svg`, optioneel `land-duitsland.svg` (en evt. extra
  "passeer-landen": Spanje, Zwitserland, Belgie).
- Aanleveren als bestand aan de sessie (komt in de repo, via jsDelivr geladen;
  domein-onafhankelijk, dus go-live-proof).
- **Plan B:** als aanleveren niet lukt, genereert de sessie ze zelf uit open
  kaartdata (Natural Earth) in dezelfde vereenvoudigde stijl.

## 5. Opruimen (eerst doen, schone lei)
- `rootedgoods.css`: sectie 42 (.rg-about, alle v1-v6-regels) volledig
  verwijderen. Nieuwe namespace: **`.rg-route`**.
- `rootedgoods.js`: sectie 1.6 volledig vervangen door de nieuwe
  GSAP-loader + route-regie.
- Verwijderen uit repo: `svg/europa-frame.svg`, `kaarttextuur-tijdelijk.svg`
  (Flyward-asset, licentie!), `europa-contour-licht.svg` (tenzij hergebruikt).
  `svg/europa-vlak.svg`/`svg/europa-contour.svg` blijven (elders bruikbaar).
- `blokken/over-ons.html` volledig herschrijven.

## 6. Extra's die de pagina optillen (voorstel, keuze Ward)
1. **Kilometerteller** (aanrader): klein vast element dat de afgelegde
   kilometers optelt terwijl je scrolt, eindigend op de punchline:
   "2.100 km. Geen 19.000." De kernboodschap (dichtbij vs containerschip) als
   speels, meetbaar bewijs.
2. **Plaatslabels met coordinaten** (aanrader): "PORTO · 41.1° N, 8.6° W" in
   caps bij elke dot. Goedkoop, chic, maakt het kaartgevoel af.
3. **Merk-chips bij stops**: klein label per land met een echte maker/merk
   (bv. Opinel bij Frankrijk, Bambook bij Nederland). Verbindt het verhaal met
   het assortiment. Vereist akkoord op het noemen van merknamen.
4. **Paspoort-stempel per stop**: subtiel stempeltje dat in-roteert als je een
   stop bereikt. Speels; alleen doen als 1-3 niet al genoeg leven geven.
5. **JSON-LD**: `AboutPage` + `Organization` schema op deze pagina (SEO/GEO,
   sluit aan op de pre-golive-audit).

## 7. Bouwfasen (elke fase een commit + review-moment)
0. Ward levert land-outlines aan (of kiest Plan B) en beantwoordt de open
   vragen hieronder.
1. **Sloop + skelet**: oude code weg; nieuwe HTML-structuur + typografie +
   outlines statisch geplaatst. Geen animatie. Review op compositie.
2. **Routelijn + stops**: GSAP-loader, lijn-scrub, dots, labels. Review.
3. **Parallax-lagen + extra's**: outline-snelheden, km-teller, gekozen extra's.
   Review.
4. **Mobiel + reduced-motion + performance**: 390/768-pass, CLS/LCP-check,
   Lighthouse. Review.
5. **Copy-fijnslijp + echte teamfoto + JSON-LD.** Ward plakt het blok in het
   CMS; live natuning.

## 8. Besluiten (vastgelegd met Ward, 12 aug)
1. **Route**: verhaal is leidend, exacte plekken vrij. Gekozen route:
   Porto (PT) -> Savoie (FR) -> tussenstop naar keuze van de bouwer
   (bv. Zwarte Woud, DE) -> De Achterhoek (NL). Het gaat erom dat Europa
   wordt uitgelicht met stops die het verhaal dragen. Geen merknamen nodig.
2. **Lijnstijl**: getekend deel solide cognac; nog af te leggen deel als
   zwakke stippellijn (vooruitblik + scroll-cue).
3. **Libraries**: GSAP + ScrollTrigger + MotionPathPlugin + Lenis, alleen op
   deze pagina geladen (detectie op `.rg-route` in rootedgoods.js).
4. **Extra's**: kilometerteller JA (punchline "2.100 km. Geen 19.000."),
   coordinaten-plaatslabels JA, JSON-LD (AboutPage + Organization) JA,
   paspoort-stempels NEE. In plaats daarvan: het reizende blad (zie §3.6).
5. **Land-outlines**: Ward levert ze aan volgens de specs in §4. Tot die er
   zijn kan fase 1 (sloop + skelet + typografie) alvast gebouwd worden met
   de bestaande Europa map.svg; Plan B (zelf genereren uit Natural Earth)
   blijft de fallback als aanleveren niet lukt.
6. **Teamfoto**: dummy blijft tot er een echte is.
