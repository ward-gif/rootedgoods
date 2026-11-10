# De homepage als funnel: advies, 10 november 2026

Ward: "Ik wil op home eigenlijk wat beter de bezoeker begeleiden naar wat hij mogelijk
zoekt. Nu tonen we op de hero 4 producten, dat is eigenlijk te specifiek. Logischer zou
zijn om te filteren op geef-momenten zoals de sectie eronder toont. Om dubbelheid te
voorkomen moeten we even een planneetje maken over hoe we de home wat logischer
inrichten."

Dit is dat plan. Er is niets gebouwd en niets geplakt. De metingen staan in
`docs/metingen/2026-11-10-home-funnel/` (lees `notities.md` daar voor de werkwijze en
de voorbehouden). Een belangrijke beperking vooraf: **GA4 en Search Console waren
vandaag niet te lezen**, de credentials zijn verlopen en vernieuwen kan alleen in een
browser. Wat GA4 had moeten leveren (de tweede pagina na de home) staat in deel 8 met
het commando om het alsnog op te halen. Alles hieronder komt uit Clarity, Google Ads,
de live pagina zelf en de eerdere analyses.

## In het kort

De home doet nu vier dingen door elkaar: ze verkoopt het merk, toont vier merken, toont
vijf momenten, toont 28 producten en vraagt vier keer om een offerte. Van de 77 tikken
die bezoekers in oktober op de betaalde mobiele home deden (cookiebalk niet meegeteld),
gingen er 34 naar een productplaatje in de hero, 18 naar een momenttegel en 3 naar de
offerteknop. Mensen tikken op beeld, en ze tikken op Kerst. Het voorstel: de hero wordt
de momentkeuze (zes momenten, één knop), de sectie "Cadeaus per moment" vervalt omdat
haar taak naar boven verhuist, de 28-productenslider gaat van de home, en wie al weet
wat hij zoekt krijgt één compacte sectie met zoekveld, categorieën en merken. Acht
secties worden vijf. Alles is te bouwen met eigen blokken en CSS; Promidata is niet
nodig.

## 1. Wat er nu staat

### De volgorde, gemeten op de live pagina

De DOM is op mobiel en desktop dezelfde (de HTML met iPhone- en desktop-UA verschilt
alleen in script-nonces); de verschillen zitten in CSS. Posities in CSS-px, 10 november,
uit `live.json`.

| # | Sectie | Blok | Doel zoals het er staat | Links | 375 × 667 | 1440 × 900 |
|---|---|---|---|---|---:|---:|
| 0 | Hero | `hero-sectie-v2` | merkclaim, offerte, vier merken | `/offerte`, `/alle-producten/`, 4 × merkfilter op `/alle-producten/?properties=…`, `/contact` (Richard) | 138 tot 903 | 176 tot 758 |
| 0b | Logo-carrousel | Shopware-element in dezelfde sectie | sociaal bewijs | 20 logo's van `bambook.08.promidata.shop`, één kapotte href | circa 903 tot 1015 | onder de hero |
| 1 | "Cadeaus per moment" | `thema-tegels-home` | kiezen op aanleiding | 5 thema-LP's, `/alle-thema-s` | 1015 tot 1959 | 876 tot 1600 |
| 2 | "Europa maakt het nog / Wij weten waar" | `europa map sectie` | het waarom, met kaart | `/offerte`, `/alle-producten/` | 1959 tot 2833 | 1600 tot 2459 |
| 3 | "Ontdek Europese producten" | Shopware-productslider + kopje | producten tonen | 28 producten, `/alle-producten/` | 2833 tot 3375 | 2459 tot 3042 |
| 4 | "Waarom Rooted Goods" | `waarom-rooted-goods` | het waarom, nog een keer | `/over-ons` | 3375 tot 4319 | 3042 tot 3620 |
| 5 | "Zo werkt het" | `zo-werkt-het` | proces | `/offerte` | 4319 tot 5213 | 3620 tot 4198 |
| 6 | "Services & ontzorging" | `home-services-blok` | diensten | 3 servicepagina's, `/services/` | 5213 tot 6244 | 4198 tot 5020 |
| 7 | Eind-CTA | `eind-cta` | offerte, kennismaking, Richard | `/offerte`, cal.com, `/contact` | 6244 tot 7154 | 5020 tot 5799 |
| | footer | | | | tot 7830 | tot 6298 |

Op een telefoon van 375 px is de pagina 7.830 px hoog, bijna twaalf schermen. De
productslider alleen is 340 kB HTML met 93 afbeeldingen (van de 137 op de pagina).

### Wat mobiel anders doet dan desktop

Onder 768 px: de subregel is verborgen, de tekst gecentreerd, de twee knoppen gestapeld,
het mozaïek (2 × 2, vierkant) staat tussen de knoppen en Richard, de bijschriften
"Zakmes uit Frankrijk" zijn weg (alleen de merknaam blijft). De vijf momenttegels staan
als één brede Kerst-tegel plus 2 × 2. De kickers ("Voor teams en relaties", "Nu
populair", "Zet Europa weer op de kaart", "Meer dan producten", "Relatiegeschenken
zonder gedoe") staan nog in de live HTML maar worden sinds vandaag door de CSS
verborgen; de plakronde die ze ook uit de HTML haalt staat nog open.

### Het eerste scherm bij een eerste bezoek

De cookiebalk is op 375 en 390 px breed 245 px hoog, op 430 px 169 px, op desktop
67 px. Wat daarboven klikbaar is:

| | vrij boven de balk | wat er staat | klikbaar boven de balk |
|---|---:|---|---|
| 375 × 667 (iPhone SE, 8) | 422 px | header, kop in vier regels, de offerteknop voor 50 van zijn 56 px | 4: menu, logo, zoeken, winkelmandje |
| 390 × 844 (iPhone 12 tot 15) | 599 px | kop in drie regels, beide knoppen, bovenste rij tegels | 8 |
| 430 × 932 (Pro Max) | 763 px | kop, knoppen, alle vier de tegels | 10 |
| 1440 × 900 | 833 px | de hele hero, Richard, logo's; "Cadeaus per moment" begint op 994 | 19 |

Een Safari-adresbalk komt daar op een echte iPhone nog bovenop (circa 80 tot 100 px,
niet gemeten). Op het meest voorkomende formaat ziet een nieuwe bezoeker dus: een kop,
een knop die half achter de balk zit, en verder niets van het aanbod. Op desktop zit
de momentkeuze onder de vouw.

### De dubbelingen

**Drie keer "kies een product", elk langs een andere as, zonder uitleg.** De hero
kiest op merk (Opinel, Bambook, Rebottled, Janzen, naar een gefilterde catalogus zonder
h1), sectie 1 kiest op moment, sectie 3 toont 28 losse producten in willekeurige
volgorde (van een Amuse-bowl tot padelballen en een Samsonite-koffer van € 129). Wards
intuïtie klopt: vier merken is te specifiek voor iemand die net binnenkomt, en een
merkfilter op de catalogus is bovendien precies de pagina waarvan de diagnose van
oktober vaststelde dat hij niets oplevert (86 productpagina's geopend, 75 ervan één of
twee keer, geen aanvraag).

**Vier offerteroutes plus de header.** Hero, Europa-statement, "Zo werkt het"
("Vertel wat je zoekt") en de eind-CTA linken alle vier naar `/offerte`; de header
heeft er een vijfde en de top-bar roept "Gratis offerte op maat". "Wat je zoekt" staat
zeven keer in de main. Richard staat twee keer (hero en eind-CTA), tegen regel 7 van
`design/niet-meer.md`.

**Het proces staat drie keer.** "Zo werkt het" (begeleiding A tot Z, drukproef,
verzending naar meerdere locaties) zijn dezelfde drie punten als de drie servicekaarten
(full-service, warehousing, verzending naar meerdere locaties), en de trust-strip in de
eind-CTA herhaalt drukproef en bezorging. "Waarom Rooted Goods" (gemaakt in Europa,
zekerheid, kwaliteit) herhaalt de Europa-statement erboven. De services-kaarten zijn
daarbij de "drie identieke kaarten" uit `niet-meer.md` punt 4.

**Twee keer "Bekijk alle producten" en één keer "Zelf producten zoeken",** alle drie
naar `/alle-producten/`.

## 2. Wat de data zegt

Elk getal met zijn basis. De ruwe bestanden staan in de meetmap.

### Hoe mensen op de home komen

- **Advertenties, 29 oktober t/m 9 november (12 dagen), Google Ads, account 9393286984:**
  519 klikken, € 910,79. De home was de eind-URL van **149 klikken (28,7%), € 237,94**,
  waarvan 126 mobiel (84,6%). Kerst kreeg 223 klikken (`/eindejaarsgeschenken` 157,
  `/thema-s/kerstpakketten-eindejaar/` 66), `/alle-producten/` 138, `/merken/` 9.
- **Kanaalverdeling sinds de toestemmingsreparatie:** 78% betaald, 18% direct, 2%
  organisch (GA4, 28 oktober t/m 2 november, 120 sessies,
  `docs/metingen/2026-11-03-kanaalverdeling/LEESMIJ.md`). Organisch is geen kanaal: 20
  klikken in heel oktober (Search Console, diagnose).
- **Mobiel:** 89,6% van de GA4-sessies (29 oktober t/m 2 november, `plan-themapagina`).
  Clarity 7 t/m 9 november: 282 van 486 sessies mobiel, maar daar zitten 29 PC-sessies
  van 0,7 seconde op de kale home-URL in die vrijwel zeker van onszelf zijn.

De home is dus een advertentielandingspagina voor ruwweg één op de drie betaalde
klikken, bijna altijd op een telefoon, voor mensen die "relatiegeschenken met logo"
of iets dergelijks typten (campagne AlwaysOn, 293 klikken in deze periode).

### Wat ze op de home doen

**Clarity, betaalde mobiele home (`/?gad`), 1 t/m 27 oktober, 171 weergaven, 133
tikken.** Gemeten mét de oude schermvullende cookiemodal, dus verhoudingen zijn
bruikbaar, absolute percentages niet.

| Waar de tik landde | Tikken | Aandeel zonder cookiebalk (n = 77) |
|---|---:|---:|
| cookiebalk, accepteren | 54 | |
| producttegel in de hero (Janzen 12, Opinel 10, Bambook 6, Rebottled 6) | 34 | 44% |
| momenttegel (Kerst 12, merchandise 3, events 2, onboarding 1, leraar 0) | 18 | 23% |
| productslider (pijl 5, knop 2, productnaam 1) | 8 | 10% |
| hero-knop "Bekijk alle producten" | 5 | 6% |
| hero-knop "Vraag een offerte aan" | 3 | 4% |
| header (zoeken 4, menu 1, top-bar 2) | 7 | 9% |
| Europa-statement (subregel, geen link), footer | 2 | 3% |

Twee van de 133 tikken staan niet in de lijst (CSV telt 131).

Wat dat zegt: bezoekers die net uit een advertentie komen tikken op plaatjes. Ze tikken
drie keer zo vaak op een momenttegel als op de offerteknop, en Kerst krijgt twee derde
van de momenttikken. Van de 34 tikken op producttegels zijn er 28 op het beeld of de
link zelf; die mensen kwamen op een catalogusfilter terecht.

**Scroll, dezelfde export:** 170 van 171 voorbij 5%, 147 voorbij 10%, 92 voorbij 15%,
66 voorbij 25%, 18 voorbij 50%, 10 voorbij 80%, 5 tot het einde. Gemiddeld 28,6%,
actieve tijd 15 seconden. Op de huidige lengte van de pagina ligt 25% bij het einde van
de momenttegels en 50% bij "Waarom Rooted Goods"; de eind-CTA begint op 80%. Als de
pagina in oktober dezelfde opbouw had (dat is niet vastgelegd; de audit van augustus
noemt een andere volgorde van de eerste drie secties), dan zagen hooguit 10 van de 171
bezoekers het blok met de offerteknop, de kennismaking en Richard. Twee derde van de
pagina bestaat voor de bezoeker niet.

**Clarity 7 t/m 9 november (API, na het verwijderen van de modal):** betaalde mobiele
home 50 sessies, scrolldiepte gewogen 24,0%, 14,7 seconden actief. Dat is drie dagen en
geen bewijs, maar het wijst niet op verbetering sinds oktober.

**De directe home (`is precies https://rootedgoods.eu/`, oktober, 31 mobiele
weergaven, 43 tikken):** 13 op menu en menuvenster, 5 op "Bekijk alle producten", 5 op
de slider-pijl, 5 op momenttegels, 4 op producttegels, 1 op offerte, 1 op Richard. Wie
de site al kent, gaat naar het menu en de catalogus.

### Waar de rest van de site het verkeer heeft

Clarity 7 t/m 9 november, weergaven per pad: `/` 102, `/alle-producten/` 91,
`/thema-s/kerstpakketten-eindejaar/` 59, `/eindejaarsgeschenken` 27, `/huis-keuken/` 14,
`/merken/` 14, `/over-ons` 12, `/alle-thema-s` 7, `/onboarding-welkomstpakket` 4. De
themapagina's events, merchandise, dag van de leraar, brievenbus en made-in-nl halen in
drie dagen geen van alle de 3. Buiten Kerst bestaat er op dit moment geen vraag naar een
specifiek moment; die moet de home dus zelf wekken, of de advertenties.

### Wat er niet gemeten is en zwaar weegt

- **De tweede pagina na de home.** Dat is de kernvraag van dit advies en hij staat in
  GA4 (`pagePath` met `pageReferrer` = home). Niet gelezen, zie deel 8. De tikken van
  oktober zijn de beste benadering: 44% naar een merkfilter, 23% naar een moment.
- **Conversies.** Vijf `generate_lead` in drie maanden (4 augustus t/m 2 november,
  `docs/metingen/2026-11-03-conversies/LEESMIJ.md`). Geen enkele uitspraak over de home
  kan op leads steunen; zie deel 6.
- **Clarity telt weergaven als sessies** (diagnose, paragraaf 9); "sessies" hierboven
  zijn weergaven van die URL.

## 3. Wat op een B2B-offertesite werkt, en wat daarvan hier past

Kort, en afgewogen tegen deze site: 7 thema's, 11 categorieën, 22 merken, 636
producten; een werkaanname van € 1.000 tot € 1.500 per order (`audience/icp.md`); een
beslissing die weken duurt; conversie is een offerte, niet een mandje.

1. **De homepage is een routeerpagina, geen verkooppagina.** Nielsen Norman Group
   zegt het al twintig jaar: de homepage moet in vijf seconden beantwoorden wat dit is
   en waar ik heen kan, en verder uit de weg gaan. Baymard vindt in zijn
   homepage-onderzoek steeds hetzelfde: bezoekers beginnen bij voorkeur met de
   hoofdcategorieën op de homepage zelf en niet in een menu, en een homepage die
   producten "pusht" voordat de bezoeker een richting heeft gekozen, wordt
   overgeslagen. Hier: de hero moet een keuze aanbieden, geen vier producten.
2. **Kies de as die bij de koopreden past.** Een geschenkinkoper heeft bijna altijd een
   aanleiding (eindejaar, nieuwe collega, event) en zelden een product in zijn hoofd;
   dat is waarom elke grote relatiegeschenkensite "per gelegenheid" als eerste
   ingang heeft. Het assortiment is hier bovendien zo breed en vlak (636 producten in
   11 categorieën) dat kiezen op product de bezoeker een catalogus in stuurt zonder
   houvast, en zo smal in thema's (7) dat die keuze in één blik past. De momentkeuze
   werkt alleen als er achter elk moment een pagina staat die de belofte inlost, en
   dat is sinds 10 november het geval: de band-hero's.
3. **Twee soorten bezoekers, twee routes, één scherm.** Gartner (B2B Buying Journey,
   2019) meet dat kopers 17% van hun tijd met leveranciers doorbrengen en de rest zelf
   zoeken; ze willen zelf kunnen kijken voordat ze een formulier invullen. De hero
   moet dus tegelijk een zelfbedieningsroute geven (de momenten, en voor wie al weet
   wat hij zoekt: zoeken, categorieën, merken) en een gespreksroute (één knop). Niet
   vier knoppen van gelijk gewicht.
4. **Eén primaire actie per scherm.** Hicks wet in de praktijk: de keuzetijd groeit met
   het aantal gelijkwaardige opties. Vijf offerteroutes op één pagina maken de knop
   niet zichtbaarder, ze maken hem gewoner. De herziene kerstopdracht van 29 oktober
   zei het al voor de themapagina ("één hoofdknop"); voor de home geldt het dubbel.
5. **Mobiel eerst betekent: wat staat er in 420 px.** Negen op de tien bezoekers komen
   op een telefoon, en bij een eerste bezoek staat de onderste 245 px vol met de
   cookiebalk. Baymards mobiele onderzoek en de duimzone-studies van Hoober zeggen
   allebei: het eerste scherm moet de belangrijkste keuze bevatten, horizontaal
   schuiven mag als de rij zichtbaar afgesneden is, en knoppen horen onderaan het
   scherm binnen duimbereik. Hier: de momentkeuze moet op 390 × 844 boven de balk
   beginnen, en op 375 × 667 ten minste zichtbaar zijn.
6. **Herhaling is geen nadruk.** De specificiteitstest uit `design/niet-meer.md`: wat
   op elke concurrent past, draagt niet. "Wij regelen alles" zeven keer op één pagina
   leest als vulling. Eén keer, op de plek waar de bezoeker het nodig heeft (vlak voor
   de offerteknop), is genoeg.
7. **Vertrouwen zit onderaan de trechter, niet bovenaan.** Logo's, proces en
   drukproefbelofte doen hun werk vlak voor de aanvraag. De eind-CTA heeft ze al; de
   hero hoeft ze niet te herhalen.

Wat hier níet past en ik dus niet voorstel: een prijsfilter in de hero (zie variant B),
een chat-widget, een "configurator op de home", of een landingspagina-stapel met
getallen als bewijs. Er zijn geen publiceerbare cases en geen cijfers
(`brand/claims.md`).

## 4. Het voorstel

### Wat de hero doet in plaats van vier producten

Drie varianten vergeleken.

**Variant A: kiezen op geef-moment.** Zes momenttegels in de hero, elk naar de
themapagina met de band-hero, plus één knop naar `/offerte`.

- Voor: sluit aan op hoe inkopers denken (aanleiding eerst); de momenttegels kregen in
  oktober al 18 tikken tegen 3 op de offerteknop, zonder dat ze boven de vouw stonden;
  elke bestemming is net herbouwd met een band die producten toont en een
  offerteknop heeft, dus de keuze loopt in één tik door naar een pagina die de belofte
  waarmaakt; de tegelfoto's bestaan al; het lost de dubbeling met "Cadeaus per moment"
  op door die sectie te laten vervallen.
- Tegen: buiten Kerst is er nu geen gemeten vraag naar een moment; de keuze is
  seizoensgebonden en moet per kwartaal herzien worden (een CMS-plak); "Dag van de
  leraar" in november is een vreemde eend; en wie een product zoekt moet nog één
  scherm verder.

**Variant B: kiezen op budget of aantal.** Tegels als "tot € 25 per stuk", "€ 25 tot
€ 50", "vanaf 50 stuks".

- Voor: het zijn de twee vragen die inkopers als eerste stellen
  (`audience/objections.md`: minimumaantallen, levertijd, sample).
- Tegen, en dat is doorslaggevend: er is geen bestemming voor. Een prijsfilter op
  `/alle-producten/` toont "Van € 3,15"-prijzen per stuk bij de grootste staffel,
  zonder "excl. btw" en zonder logo-kosten; de minimale afname loopt per product van 1
  tot 250 en is nergens als filter beschikbaar; `brand/claims.md` verbiedt een
  vanaf-prijs buiten een offerte. De enige plek waar deze getallen kloppen is de
  kerstband (€ 25 tot € 70, vanaf 10, gemeten op alle elf pakketten). Budget hoort
  dus op de themapagina en in het offerteformulier, niet als ingang op de home.

**Variant C: kiezen op productcategorie.** De elf categorieën als tegels.

- Voor: bedient wie al weet wat hij wil; de categoriepagina's bestaan.
- Tegen: het menu doet dit al ("Onze categorieën"); de categoriepagina's hebben geen
  h1 en zijn zwaar (menutraagheid, 3,75 MB); en elf tegels passen niet boven de vouw
  op een telefoon. Het is de route die in oktober niet converteerde.

**Keuze: A, met C als tweede sectie in compacte vorm.** De hero kiest op moment; wie
een product of merk zoekt krijgt direct onder de hero een scherm met zoekveld,
categorieën als tekstlinks en de merken. Budget en aantal komen op de themapagina's
(waar ze per thema te staven zijn) en in het formulier.

### De nieuwe volgorde

Vijf secties. Per sectie het doel, wat erin staat en waar het heen gaat.

| # | Sectie | Doel | Inhoud | Links |
|---|---|---|---|---|
| 1 | **Hero met momentkeuze** | oriëntatie en route in één scherm | H1 "Relatiegeschenken gemaakt in Europa" (blijft, mag van Ward in koppen); op desktop de subregel "Met jouw logo erop, van makers die je kunt aanwijzen op de kaart."; een kleine vraagkop "Voor welk moment?" boven zes tegels: Kerst & eindejaar, Onboarding & welkom, Events & conferenties, Medewerker merchandise, Brievenbus, Dag van de leraar; daaronder één knop "Vraag een offerte aan" en de rustige link "Alle thema's". Geen Richard, geen tweede knop, geen kicker. | 6 × thema-LP (`/eindejaarsgeschenken`, `/onboarding-welkomstpakket`, `/events-conferenties`, `/medewerker-merchandise`, `/brievenbus`, `/dag-van-de-leraar`), `/alle-thema-s`, `/offerte` |
| 1b | **Logo-rij** (bestaand Shopware-element) | bewijs | blijft onder de hero, met één regel erboven "Eerder voor", mits de bron gerepareerd is (zie deel 5) | geen, of de kapotte href eruit |
| 2 | **"Weet je al wat je zoekt?"** | de productzoeker in één scherm bedienen | zoekveld (gewoon formulier naar `/search`), de elf categorieën als tekstlinks in twee kolommen, een rij van zes merklogo's met "Alle merken", en de link "Alle producten". Geen kaarten, geen beelden behalve de logo's. | `/search?search=…`, 11 categoriepagina's, `/merken/`, `/alle-producten/` |
| 3 | **Europa-statement met kaart** | het waarom, één keer | kop en kaart blijven; één knop "Offerte aanvragen" en de link "Ons verhaal" naar `/over-ons`; "Zelf producten zoeken" vervalt (sectie 2 doet dat); de reassurance-regel blijft. | `/offerte`, `/over-ons` |
| 4 | **"Zo werkt het"** | de drempel voor de aanvraag wegnemen | de feature-row met vier stappen in plaats van drie bullets: je kiest een moment of vertelt wat je zoekt; binnen één werkdag een vrijblijvend voorstel met digitale drukproef; productie start na jouw akkoord; bezorging, ook naar meerdere adressen, opslag mogelijk. Daaronder de vier services als lijst met hairlines (full-service, personalisatie & drukwerk, warehousing & fulfillment, verzending naar meerdere locaties) en de link "Alle services". Geen knop naar `/offerte` hier. | 4 servicepagina's, `/services/` |
| 5 | **Eind-CTA** | de aanvraag | ongewijzigd: "Van idee tot ingepakt / Wij regelen alles", offerte, kennismaking, trust-strip, Richard. Dit is de enige Richard en de enige trust-strip. | `/offerte`, cal.com, `/contact` |

Wat verdwijnt: de sectie "Cadeaus per moment" (haar tegels verhuizen naar de hero), de
productslider met 28 producten en het kopje "Ontdek Europese producten", de feature-row
"Waarom Rooted Goods", de drie servicekaarten, de tweede heroknop, Richard in de hero.
Offerteroutes gaan van vier naar drie (hero, statement, eind-CTA), links naar
`/alle-producten/` van drie naar één, "wat je zoekt" van zeven naar hooguit twee.

### Hoe de keuze doorloopt naar de band-hero's

Elke momenttegel landt op de themapagina die sinds 10 november de band-hero draagt: kop
met het thema, één knop "Vertel ons wat je zoekt", de noot, de schuivende productband
en daaronder "Alle kerstpakketten" naar de Shopware-categorie. De home toont dus geen
producten meer; de band doet dat, met context, één tik later. Dat is ook waarom de
28-productenslider van de home kan: hij deed hetzelfde werk zonder context (8 van de 77
tikken, waarvan 5 op de pijl).

Drie dingen om gelijk te houden: de tegelnaam op de home en de H1 van de bandpagina
moeten hetzelfde moment noemen (nu: "Kerst & eindejaar" tegenover "Kerstpakketten met
jouw logo, van Europese makers", prima; "Dag van de leraar" tegenover "Tastbare
waardering voor de Dag van de leraar", prima); de tegelfoto op de home moet niet
dezelfde zijn als een product in de band (de tegels zijn sfeerbeelden, de band
packshots, dus dat klopt nu); en de advertenties wijzen tijdelijk naar de
Shopware-categorieën (`docs/ads-bestemmingen-2026-11-03.md`) terwijl de home naar de
LP's wijst. Dat is bewust en tijdelijk, maar het betekent dat een bezoeker die via de
home komt een andere kerstpagina ziet dan een bezoeker via de advertentie. Zodra de
band-LP's gemeten beter doen, horen de advertenties terug naar de LP's.

### Hoe de dubbelheid met "Cadeaus per moment" voorkomen wordt

De hero krijgt de taak; de sectie vervalt. Niet "allebei met een andere kop", want dan
staan er binnen 1.000 px twee keer vijf dezelfde foto's. De kop "Cadeaus per moment"
en de subregel komen niet terug; de vraagkop "Voor welk moment?" in de hero neemt die
rol over, in één regel. De link "Alle thema's" gaat mee naar de hero, onder de tegels.

Made in NL staat niet tussen de zes momenten. Het is een herkomst, geen aanleiding, en
de merkclaim ("gemaakt in Europa") staat al in de kop. Het krijgt een plek in sectie 2
als tekstlink bij de categorieën ("Made in NL"), en blijft op `/alle-thema-s`.

### Voor wie geen moment heeft maar een product of merk zoekt

Sectie 2, direct onder de hero. Drie ingangen, in deze volgorde: zoeken (het
header-zoekveld kreeg 4 van de 77 tikken en de interne zoekfunctie werkt, diagnose),
categorieën (de elf, als tekst, twee kolommen op mobiel; de menu-ingang is op een
telefoon verstopt achter de hamburger), merken (zes logo's die er al zijn, met "Alle
merken"). De terugkerende bezoeker die in oktober naar het menu en "Bekijk alle
producten" tikte, vindt hier hetzelfde zonder menu. Eén scherm hoog op mobiel is de eis;
geen kaarten met foto's, want dan concurreert het met de momenttegels erboven.

### Mobiel eerst: de eerste 667 px

Wat er op 375 × 667 in beeld moet zijn, van boven naar beneden, met de 245 px
cookiebalk erbij (422 px vrij, waarvan 96 header, dus 326 px voor de inhoud):

1. H1 in drie regels in plaats van vier: de kop staat op 375 px nu op 41,6 px en wordt
   "Relatie- / geschenken / gemaakt / in Europa" (178 px). Onder 400 px één maat
   kleiner, zoals sectie 57 voor de themahero deed; dat scheelt een regel. De
   doelmaat moet gemeten worden, niet beloofd.
2. De vraagkop "Voor welk moment?" op één regel.
3. De bovenkant van de momentrij: een horizontaal schuivende rij (scroll-snap) van zes
   tegels van circa 150 px breed met de naam eronder, waarvan er op 375 px 2,3 in beeld
   staan zodat de rij zichtbaar doorloopt. De eerste tegel is het dichtstbijzijnde
   moment (nu Kerst). Op 375 × 667 bij een eerste bezoek is het doel dat de bovenste
   helft van de tegels boven de balk staat; op 390 × 844 (599 px vrij) de hele rij plus
   de knop.
4. Dan de knop "Vraag een offerte aan" en de link "Alle thema's".

Wat niet in het eerste scherm komt: de subregel (blijft verborgen op mobiel), Richard,
de logo's, de tweede knop. Op desktop (vanaf 992 px): kop, subregel, vraagkop en knop
links; rechts het mozaïek met zes tegels in drie kolommen en twee rijen in plaats van
vier tegels in twee kolommen, zodat de hero niet hoger wordt dan nu (758 px onderkant op
1440 × 900, vouw 833 met cookiebalk).

Acceptatie voor de bouw, te meten met `meet-home.mjs` (zelfde viewports, zelfde JSON):
op 390 × 844 begint de momentrij boven 599 en eindigt de knop boven 599; op 375 × 667
begint de rij boven 422; op 1440 × 900 staat de hele hero boven 833; op geen enkele
breedte horizontale scroll buiten de rij; paginahoogte op 375 px onder 4.500 (nu 7.830).

### Copy, binnen de regels

Alles uit `brand/voice.md` en `brand/claims.md`, geen nieuwe claims.

- Hero H1: ongewijzigd. Subregel (desktop): "Met jouw logo erop, van makers die je
  kunt aanwijzen op de kaart." De tweede zin ("Jij zegt wat je zoekt, wij regelen
  alles…") vervalt; de eind-CTA zegt het.
- Vraagkop: "Voor welk moment?" Geen punt, geen kicker-opmaak (gewone kleine kop, inkt).
- Tegelnamen: zoals op `/alle-thema-s`, in dezelfde grammaticale vorm. De Kerst-tegel
  verliest "Je kan niet op tijd genoeg zijn..." (drie punten en een belofte die we niet
  staven); als er een regel bij moet: "Nog op tijd voor kerst? Vraag het vandaag.", de
  zin die op de kerstband al staat.
- Sectie 2 kop: "Weet je al wat je zoekt?" Zoekveld-placeholder: "Zoek een product of
  merk" (de header gebruikt die al).
- Sectie 4: de vier stappen letterlijk uit de claims: "binnen één werkdag een
  vrijblijvend voorstel, inclusief digitale drukproef", "pas na jouw akkoord gaat het in
  productie", "we verzenden door heel Europa", "opslag en gespreide uitlevering
  mogelijk". Geen levertijd, geen minimale afname, geen vanaf-prijs.

## 5. Wat het kost om te bouwen

Alles met eigen middelen: blokken die Ward plakt, CSS en eventueel JS via jsDelivr. Geen
Promidata nodig.

| Wat | Bestand | Nieuw of aanpassen |
|---|---|---|
| Hero met momentkeuze | `blokken-def/hero-sectie-v3.html` | nieuw; vervangt `hero-sectie-v2` in het CMS. Zes tegels met de bestaande themafoto's, de vraagkop, één knop, de link. Markup hergebruikt `.rg-hero-v2` met een modifier `--momenten`, zodat de bestaande sectie 38 het meeste al doet. |
| "Weet je al wat je zoekt?" | `blokken-def/home-kies-of-zoek.html` | nieuw. Zoekformulier (`<form action="/search" method="get">` met `name="search"`), twee kolommen tekstlinks, merkenrij met zes bestaande logo's. |
| Europa-statement | `blokken-def/europa map sectie.html` | aanpassen: tweede knop weg, link "Ons verhaal" erbij. (Bestandsnaam met spaties staat al op de lijst, audit 27 oktober.) |
| "Zo werkt het" met services | `blokken-def/home-zo-werkt-het.html` | nieuw; vervangt `zo-werkt-het` én `home-services-blok` op de home. `home-services-blok.html` zelf blijft bestaan, want het staat volgens zijn eigen kop ook op themapagina's. |
| Eind-CTA | `blokken-def/eind-cta.html` | ongewijzigd |
| Logo-rij | Shopware-element | Ward in het CMS: label-tekstblok erboven ("Eerder voor"), kapotte href eruit, beelden naar de eigen mediabibliotheek (nu `bambook.08.promidata.shop`, `docs/deadlinks-2026-10-30.md`). Geen code. |
| CSS | `rootedgoods.css`, één nieuwe sectie achteraan (59) | circa 250 tot 350 regels: de momentrij (scroll-snap, tegelmaat per breedte, 3 × 2 op desktop), de H1-maat onder 400 px, sectie 2 (formulier, kolommen, merkenrij), de hairline-lijst in sectie 4. Achteraan, want sectie 38 en 41 zetten dezelfde eigenschappen met `!important`. |
| JS | geen | De rij is CSS; de band-JS is niet nodig op de home. |
| CMS, Ward | | 4 blokken verwijderen (thema-tegels, productslider plus kopje, waarom-rij, servicesblok), 3 nieuwe plakken, 1 aangepaste plakken; blokpadding van de hero op 0 voor de rij van rand tot rand (zoals bij de band). |

Volgorde: eerst CSS publiceren (doet niets zonder de nieuwe markup), dan op de
testpagina plakken en meten met `meet-home.mjs`, dan de home. Houd rekening met regel
3 uit `CLAUDE.md`: wie de site deze week bezocht heeft, ziet de CSS pas na zeven dagen
of een harde ververs.

Risico's die vooraf getest moeten worden op de testpagina: of de Shopware-editor een
`<form>` in een HTML-blok laat staan (de FAQ-blokkop waarschuwt al voor strippen; valt
het weg, dan wordt het een link "Zoek een product" naar `/search`); of de elf
categorie-URL's kloppen (`/huis-keuken/`, `/drinkwaren/`, `/kantoor-schrijfwaren/`,
`/outdoor/`, `/sport-spel/`, `/eten-drinken/`, `/verzorging/` zijn gezien; kleding,
tassen, elektronica en giveaways nog controleren met een curl voordat ze geplakt
worden).

Wat niet kan zonder Promidata, en wat het volgens `CLAUDE.md` kost:

- De cookiebalk compacter op mobiel (punt E5 op de Promidata-lijst, nog niet
  versturen vóór de nameting van 11 november). Dit is de grootste hefboom voor het
  eerste scherm: 245 px, meer dan de hele hero-ingreep oplevert. Prijs onbekend.
- Het hoofdmenu op "momenten" inrichten (nu "Onze categorieën" voorop): navigatie
  € 250 tot € 500. Niet nodig voor dit plan; sectie 2 vangt het op.
- Een versie-query in de thema-head (punt A3), zodat een wijziging niet zeven dagen in
  de browsercache blijft hangen. Niet nodig voor dit plan, wel voor elke nameting.
- Alles op de PDP (€ 1.000) staat hier los van.

## 6. Hoe we het nameten

Eerst het eerlijke deel: met vijf leads in drie maanden is er geen meting op leads
mogelijk die vóór het voorjaar iets betekent. We meten dus of de home haar taak doet
(routeren), niet of er meer aanvragen komen.

### De nulmeting, vast te leggen vóór het plakken

| Maat | Bron | Hoe | Nu |
|---|---|---:|---|
| M1. Doorstroom: aandeel landingssessies op `/` met een tweede pagina | GA4 | `landingPage` = `/`, `bounceRate` en `screenPageViewsPerSession`, betaald en mobiel apart | onbekend, GA4 dicht |
| M2. Richting: tweede pagina na de home, per groep (thema-LP, categorie, merk, `/alle-producten/`, `/offerte`) | GA4 | `pagePath` met `pageReferrer` = home | onbekend; oktober-tikken: 44% product, 23% moment |
| M3. Offerte-intentie vanaf de home | GA4 | `form_start` op `/offerte` met `pageReferrer` = home; `generate_lead` alleen tellen | onbekend |
| M4. Tikken op de home, mobiel betaald | Clarity, filter `/?gad`, mobiel, tikken-CSV | aandeel momenttegels van de tikken buiten de cookiebalk | 23% (18 van 77, oktober) |
| M5. Bereik van de eind-CTA | Clarity scroll-CSV plus de sectiepositie uit `live.json` | aandeel weergaven voorbij de y van de eind-CTA; niet het gemiddelde percentage, want een kortere pagina maakt dat vanzelf hoger | hooguit 10 van 171 (oktober) |
| M6. Kwaliteit na de klik | Google Ads | `post_click_quality_score` van zoekwoorden met de home als eind-URL | BELOW_AVERAGE (diagnose) |

### Acceptatie, vooraf

- M2: minstens 40% van de tweede pagina's na de home is een thema-LP (nu naar
  schatting 23%), en `/alle-producten/` onder de 25%.
- M1: het aandeel met een tweede pagina stijgt met minstens 10 procentpunt. Onder de
  tien punten is bij deze aantallen ruis (zelfde grens als de cookiebalk-nulmeting).
- M4: momenttegels krijgen minstens 35% van de tikken buiten de cookiebalk, de
  offerteknop niet minder dan nu (4%).
- M5: het aandeel weergaven dat de eind-CTA bereikt verdubbelt ten opzichte van de
  nulmeting (van rond 6% naar 12% of meer).
- M6: in de vier weken erna van BELOW_AVERAGE naar AVERAGE op de AlwaysOn-zoekwoorden.
  Gratis, onafhankelijk, en het drukt de CPC.

### Hoe lang wachten

De home krijgt circa 10,5 betaalde mobiele klikken per dag (126 in 12 dagen) en
Clarity ziet er circa 17 mobiele weergaven per dag van (50 betaald in 3 dagen). Om een
verschuiving in een aandeel van 30% naar 45% met redelijke zekerheid te zien (tweezijdig,
5% kans op loos alarm, 80% kans om het te vinden) zijn ongeveer 160 sessies per kant
nodig. In Clarity is dat tien dagen, in GA4 (dat door toestemming minder ziet) eerder
drie weken. Voorstel: de drie weken vóór het plakken als nulmeting (29 oktober tot de
plakdatum, dat venster loopt al), drie weken erna als nameting, betaald mobiel apart,
en pas dan een uitspraak. December is een stoorzender: de kerstvraag groeit vanzelf,
dus vergelijk M2 per groep en niet alleen "meer naar Kerst".

## 7. Besluiten voor Ward

1. **De hero wordt de momentkeuze (variant A) en "Cadeaus per moment" vervalt als
   sectie.** Aanbeveling: ja. Het is de enige ingang die aansluit op hoe een inkoper
   begint, de bestemmingen zijn net gebouwd, en de tikken van oktober wijzen ernaar.
2. **De 28-productenslider gaat van de home; productzoekers krijgen "Weet je al wat je
   zoekt?"** Aanbeveling: ja. De slider kreeg 8 van de 77 tikken, weegt 340 kB HTML en
   93 beelden, en de band-hero's tonen producten nu met context.
3. **Samenvoegen: de "Waarom"-rij vervalt (de Europa-statement doet het), "Zo werkt
   het" en de services worden één sectie zonder kaarten, één offerteknop per sectie,
   Richard alleen in de eind-CTA.** Aanbeveling: ja. Acht secties worden vijf en de
   offerteroutes gaan van vijf naar drie plus header.
4. **Welke zes momenten, in welke volgorde, en wie ze per kwartaal herziet.**
   Aanbeveling: Kerst & eindejaar, Onboarding & welkom (januari komt eraan), Events &
   conferenties, Medewerker merchandise, Brievenbus, Dag van de leraar als laatste;
   Made in NL naar sectie 2. Herzien op 1 januari, 1 april, 1 juli en 1 september (vóór
   de Dag van de leraar), een plak van één blok. Jubileum en afscheid (het hele jaar
   door, `docs/ads-bestemmingen-2026-11-03.md`) komen erbij zodra er een pagina is.
5. **De logo-rij: houden onder de hero met het label "Eerder voor", mits de bron naar
   de eigen mediabibliotheek gaat en de kapotte href eruit is; anders weg tot dat
   gebeurd is.** Aanbeveling: houden en in dezelfde ronde repareren. Dit is CMS-werk
   zonder code en het is het enige bewijs op de pagina.

Niet als besluit maar als voorwaarde: GA4 opnieuw autoriseren voordat er geplakt wordt
(deel 8), zodat M1 tot en met M3 een nulmeting hebben. De gegevens blijven in GA4
bewaard, dus er hoeft niet gewacht te worden; er moet alleen toegang zijn.

## 8. Wat ik niet kon vaststellen

- **GA4 en Search Console.** `bin/ga4.sh` en `bin/gsc.sh` breken af op
  "Reauthentication is needed"; de credentials van 3 november zijn verlopen en de
  vernieuwing vraagt een browser. Herstel, eenmalig:
  `export CLOUDSDK_CONFIG=~/.config/gcloud-rootedgoods && gcloud auth application-default login --impersonate-service-account=ga4-lezer@rootedgoods-analytics.iam.gserviceaccount.com`,
  daarna `bin/ga4.sh --van 2026-10-29 --tot 2026-11-09`. Daarmee ontbreken: de
  tweede pagina na de home, landingssessies op `/` per kanaal en apparaat,
  `form_start` en `generate_lead` met de home als verwijzer, en de huidige
  kanaalverdeling. De oktober-tikken uit Clarity zijn de vervanger, en dat is een
  benadering.
- **De oktober-cijfers zijn gemeten onder de cookiemodal** met scrollslot (tot 28
  oktober). Verhoudingen tussen elementen zijn bruikbaar; scrolldiepte en absolute
  tikpercentages niet. De nameting van de huidige balk staat voor 11 november.
- **Of de sectievolgorde in oktober dezelfde was** als vandaag. De audit van augustus
  noemt hero, Europa-kaart, thema-tegels; vandaag staan de tegels vóór de kaart. De
  koppeling van scrolldiepte aan secties in deel 2 is daarom indicatief.
- **Clarity 7 t/m 9 november** is drie dagen en bevat 29 PC-weergaven van 0,7 seconde
  op de kale home die vrijwel zeker van onszelf zijn; ik heb ze weggelaten uit de
  conclusies maar niet kunnen bewijzen dat ze van ons zijn.
- **Geen echte telefoon.** Alle posities komen uit headless Chromium op 375, 390 en
  430 px breed; een Safari-adresbalk en de echte fontrendering kunnen 2 tot 100 px
  schelen. De cookiebalkhoogte klopt met de replica van 5 november.
- **Geen desktopgedrag.** Clarity-exports van oktober bestaan alleen voor mobiel; het
  Clarity-venster van drie dagen heeft 7 betaalde PC-sessies op de home.
- **Geen klanttaal, geen test op de doelgroep.** Ward op 5 november: "klanttaal hebben
  we niet echt." De vraagkop en de sectiekoppen zijn beredeneerd, niet getest.
- **Het effect op leads** is met vijf `generate_lead` in drie maanden pas in het
  voorjaar te zien, en dan nog alleen als de meting op `/offerte` en de PDP-configurator
  blijft werken.
- **De hoogtes van het voorstel zijn doelen, geen metingen.** De nieuwe hero bestaat
  niet; `meet-home.mjs` meet hem na de bouw met dezelfde JSON-velden als `live.json`.
- **Of een `<form>` in een Shopware-HTML-blok overeind blijft** is niet getest.
