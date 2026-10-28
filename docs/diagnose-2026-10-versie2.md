# Rooted Goods, eindiagnose

> 27 oktober 2026, **herzien na kritische review**. Vier conclusies uit de eerste versie zijn
> onjuist gebleken en staan hieronder rechtgezet; paragraaf 0 vat ze samen. Alles is gemeten,
> met periode en bron. Waar iets een hypothese is, staat dat erbij.
>
> Bronnen: Google Ads API (account 9393286984), GA4 Data API (property 551909322),
> PageSpeed Insights API, GTM-container GTM-MJ83DVQK, eigen metingen op de live pagina's.
> Periode overal **6 t/m 27 oktober**, met de 27e nog lopend.

## 0. Wat er onderweg is rechtgezet

Deze diagnose is twee keer herzien: na een kritische review, en na het binnenhalen van de
Clarity-data over oktober. Vijf conclusies gingen daarbij om.

| Eerder gesteld | Werkelijkheid | Bewijs |
|---|---|---|
| "De pagina laadt in 31,6 s op mobiel, dat is oorzaak 1" | **Echte bezoekers krijgen 2,20 s op de kerstpagina, 3,55 s op home en 7,89 s op de catalogus.** Mijn getal was een labsimulatie van traag 4G en zat er op de homepage een factor negen naast | Clarity-prestatiecijfers over 1.345 sessies, oktober |
| "De advertenties werken, CTR 11,1%" | 21% van de klikken komt van zoekpartners met 65% CTR. Op Google zelf is het 9,7%. Daarbovenop 166 ongeldige klikken, 22,4% op de grootste campagne | Netwerksplitsing; tablet-partners 37 klikken op 38 vertoningen |
| "Traag, dus weg voor de banner, dus niet gemeten" | Faalt de desktoptest: daar rendert de pagina in 1,0 s en zien we nog steeds maar 9,1% | 6 GA4-sessies op 66 desktopklikken |
| "Luxe en origineel zijn je goudmijn" | Die termen zijn vrijwel volledig zoekpartner. De lage CPC was geen kwaliteitssignaal | zie netwerksplitsing |
| "De advertentie spreekt de site tegen over minimale afname" | De landingspagina zegt hetzelfde als de advertentie. De tegenspraak staat op een minderheid van de productpagina's | FAQ op `/eindejaarsgeschenken`; steekproef 160 productpagina's gaf 5 treffers |

**De les uit die eerste regel is groter dan de correctie zelf:** labmetingen van PageSpeed
simuleren een traag mobiel netwerk en zijn ongeschikt om te zeggen wat bezoekers ervaren.
Pas toen Clarity erbij kwam, hadden we echte cijfers. Alle snelheidsuitspraken hieronder
komen nu uit die bron.

## In één oogopslag

Clarity kan filteren op `gad_`, de parameter die Google Ads aan elke advertentieklik hangt.
Daarmee is voor het eerst **alleen het betaalde verkeer** te bekijken, los van organisch,
direct en bots. Dat levert het sluitende beeld op.

### Het betaalde verkeer als groep, 1 t/m 27 oktober

| | Gemeten |
|---|---|
| Sessies uit advertenties | **841** |
| Waarvan bots | **1** |
| **Pagina's per sessie** | **1,0** |
| Scrolldiepte | 39,5% |
| Actieve tijd | 14 s |
| LCP | 4,24 s |
| INP | **500 ms** (drempel voor "slecht") |
| Verwijzer `syndicatedsearch.goog` | **157** |
| In-app browsers (Facebook 113, Instagram 32) | 145 (17%) |
| **Gebeurtenis "Offerte aanvragen"** | **2 (0,24%)** |

**Twee dingen zijn hiermee beslist.**

Ten eerste: **de klikken komen aan.** 841 sessies op 740 gemeten klikken, met één bot. Er is
dus geen verlies tussen klik en pagina. Het meetgat van 95% in GA4 komt volledig door
toestemming, niet doordat bezoekers nooit arriveren. De serverlogs hoeven we daar niet meer
voor op te halen.

Ten tweede: die 157 sessies vanaf `syndicatedsearch.goog` zijn **exact de 157
zoekpartnerklikken** die ik in Google Ads mat. Twee onafhankelijke bronnen, hetzelfde getal.

### De trechter van betaald verkeer

| Stap | Sessies |
|---|---|
| Komt binnen via een advertentie | **841** |
| Ziet een tweede pagina | **vrijwel niemand** (1,0 pagina per sessie) |
| Bereikt `/offerte` | 13, waarvan 4 bots, en **allemaal via interne navigatie, niet vanaf een advertentie** |
| Bereikt het productgebonden offerteformulier | **2** |
| Verstuurt dat formulier | **2 van 2 (100%)** |

Het aanvraagmechanisme werkt dus perfect. Van de twee mensen die het ooit bereikten,
verstuurden er twee. Het probleem is dat er maar twee kwamen.

### Waar ze afhaken

Op de homepage met advertentieverkeer (231 sessies, 171 mobiele weergaven):

| Scrolldiepte | Bezoekers over | Weg |
|---|---|---|
| 5% | 170 | 0,6% |
| 10% | 147 | 14,0% |
| **15%** | **92** | **46,2%** |
| 25% | 66 | 61,4% |
| 50% | 18 | 89,5% |

**Bijna de helft is weg voordat een zesde van de pagina voorbij is.**

En waar gaan hun aanrakingen heen? Van de 133 taps op de betaalde homepage: **54 op de
cookiebanner, oftewel 40,6%.** Precies hetzelfde aandeel als op de kerstpagina (40,7%).

Mijn eerdere homepagecijfer van 14% kwam uit de export zonder advertentieverkeer. Bij de
bezoekers waar je voor betaalt is de cookiebanner dus net zo dominant.

### De oorzaken, op volgorde

| # | Oorzaak | Het bewijs in één getal |
|---|---|---|
| 1 | **Niemand ziet een tweede pagina** | 1,0 pagina per sessie over 841 betaalde sessies |
| 2 | **De cookiebanner is het grootste interactiemoment** | 40,6% van de taps op de betaalde homepage, 40,7% op de kerstpagina |
| 3 | **Bijna de helft haakt af in het eerste zesde deel van de pagina** | 92 van 171 over bij 15% scrolldiepte |
| 4 | **De aanvraagknop wordt niet aangeraakt** | 0 taps op drie offerteknoppen in 292 weergaven van de kerstpagina |
| 5 | **Een vijfde van het verkeer is geen inkoper** | 157 zoekpartnersessies, 166 ongeldige klikken, 145 in-app browsers |
| 6 | **De catalogus opent met het goedkoopste wat je hebt** | papieren zak 0,39 euro bovenaan |
| 7 | **De meting verliest de advertentieherkomst** | GA4 ziet 41 van 841 betaalde sessies |
| 8 | **De webshop meet niets commercieels** | 0 van 14 e-commerce-gebeurtenissen |

**Snelheid staat er niet bij.** De LCP van betaald verkeer is 4,24 s, boven de drempel maar
niet rampzalig, en de kerstpagina haalt zelfs 2,20 s en presteert daar net zo slecht. Wel
opvallend: **INP 500 ms**, precies de grens van "slecht". Dat gaat niet over laden maar over
hoe traag de pagina reageert op een aanraking, en dat past bij een bezoeker die veertien
seconden actief is.

### Wat géén oorzaak is

- **Staffelprijzen, logo-configurator en een productgebonden offerteaanvraag**: bestaan alle drie
- **De meetketen van aanvraag naar Analytics**: bewezen werkend
- **Het offerteformulier zelf**: 100% verzendratio bij de twee die het bereikten
- **Verloren klikken tussen advertentie en pagina**: er zijn er geen
- **De landingspagina tegenover de advertentie**: spreken elkaar niet tegen
- **Productteksten**: steekproef van 45, nul leeg, nul Engels

## 1. Gedrag op de pagina

Dit is de belangrijkste paragraaf, en hij bestaat pas sinds Clarity is uitgelezen.
Clarity registreert ook zonder cookietoestemming en zag daardoor 1.345 sessies op drie
pagina's in oktober, waar GA4 er 211 over de hele site telde.

### Niemand gaat naar een tweede pagina

Pagina's per sessie is **1,0** op alle drie de pagina's (home 1,0056, catalogus 1,0,
kerstpagina 1,0). De toppagina-lijst van de homepage is letterlijk: home 177 sessies,
`/contact` 1 sessie.

Clarity meldt ook nul terugkerende gebruikers op alle drie de pagina's, maar **dat getal is
onbetrouwbaar**: GA4 telt over dezelfde periode 40 terugkerende sessies van 23 gebruikers
(17%). Bouw daar dus niets op.

Dat is de kern. Je betaalt 1,33 euro voor een bezoeker die precies één pagina ziet en nooit
meer terugkomt. Elke andere bevinding hieronder is een verklaring voor dit ene feit.

### De cookiebanner is het grootste interactiemoment van de site

| Pagina | Taps totaal | Taps op de cookiebanner | Aandeel |
|---|---|---|---|
| `/eindejaarsgeschenken` | 317 | **129** | **40,7%** |
| `/alle-producten/` | 811 | 96 | 11,8% |
| `/` | 43 | 6 | 14,0% |

Op je belangrijkste advertentiepagina gaat vier van de tien aanrakingen naar het wegklikken
van een banner. Dat is geen randverschijnsel maar het eerste en vaakst herhaalde dat een
bezoeker op je site doet.

### Mensen zien een derde van de pagina

| Pagina | Scrolldiepte | Hoogte op mobiel |
|---|---|---|
| `/` | **26,8%** | |
| `/eindejaarsgeschenken` | **32,0%** | 7.429 px, ongeveer 20 schermen |
| `/alle-producten/` | 66,7% | |

De kerstpagina bevat een FAQ met precies het antwoord op de belangrijkste vraag van een
inkoper: *"Dat verschilt per product. Er is geen vaste minimale afname."* In de heatmap
staat dat blok ruim voorbij het punt waar twee van de drie bezoekers al weg zijn.

De catalogus scoort hoger op scrolldiepte, maar dat zegt weinig: dat is een raster met
tegels dat je nu eenmaal doorscrollt.

### Snelheid is niet de oorzaak

| Pagina | LCP bij echte bezoekers | Score |
|---|---|---|
| `/eindejaarsgeschenken` | **2,20 s** | 85,5 |
| `/` | 3,55 s | 81,6 |
| `/alle-producten/` | **7,89 s** | 72,9 |

De kerstpagina zit onder de drempel van 2,5 s en presteert dus goed. Daar gebeurt precies
hetzelfde als op de trage pagina's: 1,0 pagina per sessie, 32% scrolldiepte, 15 seconden
actieve tijd, nul aanvragen.

Alleen `/alle-producten/` op 7,89 s is traag genoeg om op te ruimen, en dat is ook de pagina
waar het beeldgewicht zit: 5.259 kB in productkaarten waarvan 4.655 kB (89%) in
galerijslides die niemand ziet. Dat opruimen blijft de moeite, maar als verklaring voor nul
aanvragen is snelheid van tafel.

### De catalogus opent met het goedkoopste wat je hebt

De scrollheatmap laat de sortering zien, oplopend in prijs: papieren zak 0,39 euro, pen
0,42, reflector 0,49, sleutelhanger 0,52, liniaal 0,61, oordopjes 0,64, schoenveters 0,87,
rol pepermunt 1,02.

Iemand die op "luxe relatiegeschenken" klikt, krijgt dus eerst je goedkoopste artikelen te
zien. Dat is het tegenovergestelde van de positionering, en het is één sorteerinstelling.

### Waar de kerstbezoeker precies afhaakt

Uit de scrolldata van 292 mobiele weergaven: **91 bezoekers (31%) vertrekken in één stap van
371 pixels**, tussen 1.486 en 1.857 px op een pagina van 7.429. Op de heatmap is dat precies
de plek direct onder de productcarrousel "Inspiratie" en de knop "Bekijk alle producten".

De taps op diezelfde pagina, 317 in totaal:

| Element | Taps | Aandeel |
|---|---|---|
| Cookiebanner | 129 | 40,7% |
| **Carrouselpijl "volgende"** | **90** | **28,4%** |
| Knop "Bekijk alle producten" | 25 | 7,9% |
| Productkaarten (naam 10, afbeelding 7) | 17 | 5,4% |
| FAQ openklappen | 2 | 0,6% |
| **"Vraag een offerte aan" (drie knoppen)** | **0** | **0%** |

Dat is de scherpste zin van dit hele onderzoek: **in 292 weergaven is er niet één keer op
een offerteknop getikt**, terwijl er 90 keer op een carrouselpijl is getikt. De lijst loopt
door tot elementen met één tap, dus die nul is echt nul.

De carrousel toont twee producten per scherm en kost dus 90 aanrakingen om een handvol
artikelen te zien. En de 25 taps die wél doorklikken gaan naar `/thema-s/kerstpakketten/`,
dat **301-redirect** naar `/thema-s/kerstpakketten-eindejaar/`: elf pakketten van 25 tot 70
euro, zonder h1 en zonder meta-omschrijving.

### De catalogus: mensen bladeren, ze kiezen niet

811 taps op 691 mobiele weergaven:

| Element | Taps | Aandeel |
|---|---|---|
| **Paginering** | **172** | **21,2%** |
| Cookiebanner | 96 | 11,8% |
| Productkaart (afbeelding 48, naam 26) | 74 | 9,1% |
| Zoeken | 27 | 3,3% |
| Filterknop | 23 | 2,8% |
| Sorteren | 21 | 2,6% |

Mensen bladeren dus ruim twee keer zo vaak door naar de volgende pagina als dat ze een
product aantikken. 23 pagina's van 24 producten. 45% scrollt tot 90% van de pagina en tikt
dan op "pagina 2".

### Desktop: de heetste klik ligt in lege ruimte

Op de desktopcatalogus (98 klikken op 66 weergaven) is het meest aangeklikte element
`DIV.cms-section-sidebar-sidebar-content` zelf, **9 klikken, en dat is geen link**. De
hotspot zit onder "Thema's" in de categorielijst. Met een CLS van 0,343 op die pagina is de
verklaring waarschijnlijk dat de lijst na het laden verschuift en mensen klikken waar een
categorie stónd.

Ook hier: **nul klikken op de oranje "Offerte aanvragen"-knop in de header.**

### Kleinere signalen uit dezelfde data

## 2. Meting

### De trechter

| Stap | Aantal |
|---|---|
| Advertentieklikken, 6 t/m 27 okt | 740 |
| Waarvan Google Search zelf | 583 |
| GA4 Paid Search-sessies | 39 (5,3% van alle klikken, 6,7% van de echte) |
| GA4 Direct-sessies | 155 |
| Weergaven `/offerte` | 2 |
| Weergaven `/poconfigurator/request` | 0 |
| `generate_lead`-events | 0 |

### Waarom "5,3%" het verkeerde getal is

Mijn eerste verklaring was: de pagina is traag, mensen vertrekken voor de cookiebanner, dus
ze worden niet gemeten. **Die verklaring faalt de directe test.**

| Apparaat | Ads-klikken | GA4 Paid-sessies | Zichtbaar |
|---|---|---|---|
| Desktop | 66 | 6 | **9,1%** |
| Mobiel | 615 | 27 | 4,4% |
| Tablet | 59 | 6 | 10,2% |

Op desktop rendert de pagina in 1,0 seconde (gemeten LCP 1.041 ms) en zien we nog steeds maar
9,1%. Snelheid verklaart hooguit het verschil tussen 9% en 4,4%, niet de 91% die op desktop
ook ontbreekt. De aantallen zijn klein (desktop n=6), dus dit is richtinggevend, maar zelfs de
bovenkant van dat betrouwbaarheidsinterval ligt ver onder wat je zou willen.

### De werkelijke oorzaak zit in de consent-mechaniek

Gelezen uit de live pagina en de GTM-container:

1. De pagina zet `gtag('consent','default')` op **denied** tenzij de cookie
   `dtgsAllowGtmTracking=1` er al staat.
2. De GA4-configuratietag (`__googtag`, tag 3) heeft **geen consent-vereiste** en vuurt dus
   direct op `gtm.init`. De landings-pageview vertrekt als cookieloze denied-ping en wordt bij
   dit volume geen sessie in de rapporten.
3. Klikt iemand daarna op "Aanvaard alle cookies", dan pusht de Shopware-plugin een
   consent-event. **Geen enkele tag in de container luistert daarnaar** (0 voorkomens van
   `cookieConsentGiven`, en de enige event-triggers zijn `gtm.init`, `gtm.js` en
   `gtm.formSubmit`). GA4 stuurt de pageview niet opnieuw.
4. Gevolg: wie pas op pagina twee accepteert, wordt geteld als sessie zonder gclid met het
   eigen domein als verwijzer. Dat is **Direct**.

Het bewijs past daarop: Direct is 155 sessies met **125 van de 131 gebruikers nieuw**, op een
merk waarvan de branded campagne de hele maand 5 vertoningen haalde. Direct landt bovendien
op de advertentiepagina's.

Direct plus Paid Search is 194 sessies op 740 klikken, ongeveer **26%**. Dat is een normaal
verlies bij een opt-in-banner plus adblockers. Het meetgat is dus geen 95% maar vooral een
attributiefout van zo'n twintig procentpunt.

Dat maakt de reparatie ook concreter: één tag die na de consent-update alsnog een `page_view`
met de huidige `page_location` stuurt.

### De webshop meet niets

GA4 kent precies **acht** eventsoorten: `page_view`, `user_engagement`, `session_start`,
`first_visit`, `scroll`, `form_start`, `view_search_results`, `form_submit`.

Ontbrekend: `view_item`, `view_item_list`, `add_to_cart`, `begin_checkout`, `purchase`,
`generate_lead`, `contact`. **Alle veertien e-commerce-events ontbreken.**

De primaire knop op elke productpagina is "In het winkelmandje", en er wordt nergens gemeten
of iemand daarop klikt. De Shopware-plugin vult de `dataLayer` wel (ik zie
`dataLayer.push({ecommerce: null})` en `dtgs-gtm-product-variantname` in de HTML), maar de
GTM-container heeft **geen enkele tag die dat uitleest**. Tien tags in totaal: de Google-tag,
Clarity, twee keer `generate_lead`, één `contact`, één gepauzeerde, drie
formulier-luisteraars en Leadinfo.

Dat is dus een paar uur werk in GTM, geen bouwklus.

### `generate_lead` ontbreekt, maar niet omdat de tag stuk is

De veertien `form_submit`-events (GA4's eigen enhanced measurement) staan op `/search` (5),
`/` (4) en losse productpagina's. **Geen enkele op `/offerte`.** Er is nooit iets gebeurd dat
`generate_lead` had moeten laten vuren. De keten is **onbewezen**, niet aantoonbaar stuk.

De offerteknop op de productpagina is een kale inline `onclick` naar
`/poconfigurator/request?productId=…`. Die bestemming geeft HTTP 200, noemt het artikel bij
naam, draagt GTM én de `dataLayer` en vereist geen login. Techniek is vrijwel zeker in orde;
het is een **zichtbaarheidsprobleem**. De knop is de derde in de stapel, in outline-stijl,
onder "In het winkelmandje" en onder een configurator.

---

## 3. De belofte, bijgesteld

Alle elf advertentiegroepen voeren de kop **"Geen minimale afname"**.

**De landingspagina spreekt dat niet tegen.** De FAQ op `/eindejaarsgeschenken` zegt
letterlijk: *"Dat verschilt per product. Er is geen vaste minimale afname."* Dezelfde
boodschap, ook in de structured data. Mijn eerdere bewering dat hier een gebroken belofte
zat, was dus fout op het niveau waar het telt.

Waar het wél wringt: een **minderheid van de productpagina's** zet in leverancierstekst
"Minimale afname: 150 stuks". Een steekproef van 160 willekeurige product-URL's gaf 5
treffers, allemaal eigen A1352-textielproducten (sweater 50, bodywarmer 72, rugzak 100,
pet 150, capuchon 50). Geschat 30 tot 40 pagina's van de 1.426. Een bezoeker moet dus eerst
zo'n pagina openen om de tegenspraak te zien, en GA4 laat 2 betaalde sessies op zulke
pagina's zien.

Echt, klein, en een paar uur werk. Niet de hoofdoorzaak.

In diezelfde leveranciersomschrijving staat ook *"Bij annulering van de bestelling blijven
alle prototype- en technische kosten verschuldigd"*. Dat hoort in de voorwaarden, niet in
een productomschrijving.

### De advertenties beloven wel meer dan de pagina bevestigt

| Advertentiebelofte | Komt terug op de landingspagina |
|---|---|
| Voorstel binnen één werkdag | ja |
| Geen minimale afname | ja, in de FAQ |
| Bezorging door heel Europa | ja |
| Altijd een digitale drukproef | deels |
| Gratis ontwerp met je logo | nauwelijks |
| Eén vaste contactpersoon | nee |

En elf van de vijftien koppen zijn identiek in alle advertentiegroepen. Vandaar
advertentiesterkte "Gemiddeld" overal, met één advertentie per groep.

## 4. Waarop wordt gezocht

### In Google, waar je voor betaalt
500 termen, 1 t/m 26 oktober, € 449 van de € 884 (Google verbergt lage volumes).

| Thema | Klikken | Kosten | CTR |
|---|---|---|---|
| Klant / relatie | 199 | € 224,95 | 24,7% |
| Logo / bedrukking | 127 | € 191,90 | 14,2% |
| Kerst / eindejaar | 121 | € 181,18 | 13,4% |
| **Luxe / premium** | 60 | € 37,01 | **48,0%** |
| **Origineel / idee** | 49 | € 46,13 | **40,2%** |
| Duurzaam / eco | 29 | € 37,69 | 19,6% |
| Kleine oplage | 11 | € 16,54 | 17,5% |
| **Collega / personeel** | 19 | € 23,45 | **7,1%** |
| **Concreet product** | 13 | € 15,10 | **7,4%** |

**Let op: deze tabel is vervuild door zoekpartners.** `luxe relatiegeschenken`,
`originele relatiegeschenken` en `kerstgeschenk voor klanten` zijn vrijwel volledig
partnerverkeer, en zij dragen het grootste deel van de thema's "Luxe" en "Origineel". Hun
lage CPC was geen kwaliteitssignaal maar de prijs van partnerinventaris. Zet de partners uit
en meet deze tabel over twee weken opnieuw voordat je er iets op bouwt.

Wat wél overeind blijft: "Kleine oplage" klikt bovengemiddeld, en "Collega/personeel" en
"Concreet product" blijven achter. Die laatste twee zijn grotendeels consumentenvragen
(`persoonlijk afscheidscadeau collega`, `persoonlijke kerstcadeaus`) en horen uitgesloten,
niet herzien.

### In je eigen zoekbalk, gratis
25 termen, 26 personen, 6 t/m 27 oktober:

> paraplu (3x), kerstbal, kersthanger, mepal lunchpot, sleutelhangers, sokken, TapOut, bidon,
> fles, gieter, kaas, king pepermunt, koffie, koffiebeker, kracht, laptop, luchtverfrisser,
> lunchpot, rolmaat, schaaf, stressbal, tablet, trui, waterfles

**Het verschil tussen die twee lijsten is de diagnose van je navigatie.** In Google zoeken
mensen op categorie. Eenmaal binnen zoeken ze op **product**. Niemand typt een thema. Jouw site
leidt met thema's: eindejaar, onboarding, medewerker merchandise, events.

`kerstbal` en `kersthanger` voer je niet. `custom tosti ijzer` in het Ads-rapport is je
Falk-product uit het showroomproject.

---

## 5. Vindbaarheid

De sitemap bevat 1.507 URL's. De homepage staat er **wel** in (`https://rootedgoods.eu`),
maar van je andere eigen pagina's geen enkele: niet `/offerte`, niet `/eindejaarsgeschenken`,
niet `/over-ons`, niet `/faq`, niet `/contact`, niet `/merken/`.

Daarbij: `/thema-s/kerstpakketten-eindejaar/` staat er wél in en heeft **geen h1-tag**,
terwijl `/eindejaarsgeschenken` een nette h1 heeft en er niet in staat. De zwakke pagina is
vindbaar, de goede niet, voor dezelfde zoekvraag.

Van de 1.201 product-URL's gaan er maar **636 over een uniek product**. 565 extra pagina's
zijn kleur- en maatvarianten met vrijwel dezelfde tekst. Pulltap's kelnersmes heeft er
ongeveer 45.

Dit is echte SEO-schade, maar het is niet je Q4-probleem: organisch verkeer is 17 sessies.

---

## 6. Wat we gaan doen

Opnieuw geordend na de Clarity-data. **(ik)** = code of config, **(jij)** = Shopware,
account of besluit, **(samen)** = ik lever voor, jij beslist.

### Vandaag, twee vinkjes

| # | Wat | Wie | Effect |
|---|---|---|---|
| 1 | **Zoekpartners uitzetten** op AlwaysOn en Thema | jij | Eén vinkje per campagne. Haalt 21% van de klikken en 114 euro per maand weg, en maakt het zoektermenrapport pas betrouwbaar |
| 2 | **De catalogus niet meer op prijs oplopend sorteren** | jij | Eén instelling. Nu opent je "luxe" catalogus met een zak van 0,39 euro |

### Deze week, het doorklikprobleem

Dit is waar het geld zit. Elke ingreep hieronder gaat over dezelfde vraag: hoe krijg je
iemand van de eerste pagina naar een tweede.

| # | Wat | Wie |
|---|---|---|
| 3 | De cookiebanner kleiner, lager of minder blokkerend maken. Nu is hij het meest aangetikte element van de site | samen |
| 4 | Op de kerstpagina het antwoord naar boven halen: minimale afname, prijs per stuk en levertijd binnen de eerste 32% van de pagina | samen |
| 5 | Offerteknop naar de eerste positie op de productpagina, en zichtbaarder dan een omlijnde derde knop | samen |
| 6 | De kerstpagina inkorten. 7.429 px is twintig schermen; mensen zien er zes | samen |
| 7 | Een duidelijke doorklik naar producten op elke landingspagina, want 1,0 pagina per sessie betekent dat die nu niet werkt | samen |

### Deze week, de meting

| # | Wat | Wie |
|---|---|---|
| 8 | Pageview opnieuw sturen na toestemming. Het `cookieConsentGiven`-event bestaat al en **geen enkele tag luistert ernaar** | ik |
| 9 | E-commerce-gebeurtenissen in GTM aanzetten; de dataLayer wordt al gevuld | ik |
| 10 | Een cookieloze teller naast GA4 voor de echte noemer | ik |

### Week 2, opruimen

| # | Wat | Wie |
|---|---|---|
| 11 | Galerijslides strippen op catalogus en home: 4,5 MB per pagina, en de catalogus is met 7,89 s de enige echt trage | jij |
| 12 | De 135 lazy-afbeeldingen uit de blokken plakken | jij |
| 13 | De interne link met `/Alle-Producten/` opsporen en op kleine letters zetten | ik |
| 14 | De JavaScript-fout op de catalogus (`json parse error`) uitzoeken | ik |
| 15 | Dead clicks op de homepage (10,73%) opsporen via de klikheatmap | ik |
| 16 | De minimale-afnameregel en de annuleringsclausule op de A1352-productpagina's herschrijven | jij |
| 17 | Webp regelen: eerst Shopware Store, anders Cloudflare Pro | samen |

### Januari

Sitemap, h1's op 78 categoriepagina's, variant-URL's, de merkherziening uit
`DESIGN-AUDIT.md` en de ongebruikte JS en CSS. Allemaal echt, geen van alle een Q4-fix.
Organisch is dit kwartaal sowieso geen kanaal: 103 vertoningen in 29 dagen.

### Vervallen

Een eigen advertentiegroep en landingspagina voor "luxe" en "origineel": dat advies stond op
zoekpartnerverkeer. En snelheid als hoofdoorzaak: de snelste pagina presteert even slecht
als de traagste.

## 7. Waar we op sturen

Drie getallen, in deze volgorde:

1. **Komt een aanvraag aan in de mailbox?** Ja of nee. Zonder dat meet de rest niets.
2. **Het aandeel klikken dat we terugzien in GA4**, nu 5,3% als Paid Search. Tel Direct erbij
   en het is ongeveer 26%, en dat is waarschijnlijk dichter bij de waarheid, want Direct is
   hier grotendeels verloren advertentieherkomst (155 sessies, 125 van 131 gebruikers nieuw,
   op een merk met 5 branded vertoningen). Doel is niet "boven de 50%" zoals de eerste versie
   stelde, maar: **Paid Search omhoog en Direct omlaag** zonder dat het totaal verandert.
   Dat is het bewijs dat punt 5 uit het plan werkt.
3. **Gemeten aanvraagpercentage op advertentieverkeer.** Nu 0. Reken daarbij met de
   gecorrigeerde noemer: 740 klikken min 157 partners is ongeveer 583 echte zoekklikken, dus
   de bovengrens met de regel van drie is **0,51%**, niet 0,45%.

| Aanvraagpercentage | Aanvragen per week bij 185 echte klikken | Kosten per aanvraag |
|---|---|---|
| 0,5% | 0,9 | € 294 |
| 1,0% | 1,9 | € 147 |
| 2,0% | 3,7 | € 74 |

## 8. Wat we nog niet weten

Gerangschikt op wat het zou toevoegen.

| Gat | Waarom het ertoe doet | Hoe te sluiten |
|---|---|---|
| **Search Console** | Nul zicht op organische posities, vertoningen en zoekvragen, terwijl er 1.507 URL's geïndexeerd staan | Service account toevoegen in Search Console, dan kan ik het net als GA4 uitlezen |
| **Clarity** | De tag staat er en is aan GA4 gekoppeld, maar ik heb geen enkele opname of heatmap gezien. Opnames leven ~30 dagen, dus oktober verdwijnt | Jij exporteert, of een API-token |
| **De cookiebanner** | Bepaalt of oorzaak 2 klopt | Acceptatiepercentage uit GA4 of Clarity |
| **Mobiele UX met eigen ogen** | De Chrome-koppeling deed het de hele dag niet. Alles over mobiel in dit document komt uit meetdata, niet uit kijken | Browserkoppeling werkend krijgen |
| **Wat er na een aanvraag gebeurt** | Reactietijd, offerte-naar-order, orderwaarde. Zonder dat weten we niet wat een aanvraag waard is en dus niet wat een klik mag kosten | Jouw mailbox en CRM |
| **Concurrentie** | Eén vergelijking, één concurrent, alleen de homepage | Drie concurrenten, productpagina's erbij, op prijsweergave, minimale afname en offertepad |
| **Assortiment tegenover vraag** | Mensen zoeken kerstbal en kersthanger, die je niet voert. "Concreet product" heeft 7,4% CTR | Zoektermen naast de catalogus leggen |

Mijn advies voor de volgende ronde: **Search Console en Clarity**. Die twee sluiten de laatste
meetgaten. De rest is jouw input of wacht op de browserkoppeling.
