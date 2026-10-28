# Rooted Goods, totale diagnose

> 27 oktober 2026. Dit document vervangt `q4-aanvragen-plan.md` als ingang. Dat bestand
> blijft staan als werkjournaal, inclusief de correcties die ik onderweg op mezelf moest
> maken; hier staat alleen wat er na al dat meten overeind blijft.
>
> Elk getal hieronder is gemeten, niet geschat, en draagt zijn periode en bron. Waar iets
> een hypothese is, staat dat erbij.

## De kern in vijf regels

1. De advertenties werken. De klik is niet het probleem.
2. De site rendert te traag om iets met die klik te doen, en verliest daardoor ook de meting.
3. Alles wat je nodig hebt om een aanvraag te krijgen bestaat al. Het wordt alleen niet gevonden.
4. Je propositie op de pagina beantwoordt een andere vraag dan waar mensen op zoeken.
5. Niet één van je eigen pagina's staat in de sitemap.

## 1. De trechter, van klik tot aanvraag

Google Ads 1 t/m 27 oktober, GA4 6 t/m 27 oktober (22 dagen), property 551909322.

| Stap | Aantal | Verhouding |
|---|---|---|
| Vertoningen | 6.130 | |
| Klikken | **702** | CTR 11,1% |
| Kosten | € 932 | CPC € 1,33 |
| Sessies die GA4 ziet, alle bronnen | **211** | 30% van de klikken |
| Daarvan toegeschreven aan betaald zoeken | **37** | **5,3%** van de klikken |
| Paginaweergaven `/offerte` | **2** | |
| Paginaweergaven `/poconfigurator/request` | **0** | |
| `generate_lead`-events | **0** | |
| Aanvragen | **0** | |

Nul op 702 is geen pech. Met de vuistregel van drie ligt het werkelijke aanvraagpercentage
met redelijke zekerheid onder de **0,45%**. De ondergrens van een werkende zakelijke
aanvraagsite is ongeveer 1%.

Gedrag per apparaat, alle verkeer:

| Apparaat | Sessies | Betrokkenheid | Duur | Pagina's per sessie |
|---|---|---|---|---|
| Mobiel | 128 | 65,6% | **90,8 s** | **2,0** |
| Desktop | 74 | 77,0% | **320,6 s** | **4,6** |
| Tablet | 8 | 50,0% | 109,9 s | 3,0 |

Desktopbezoekers blijven drieënhalf keer zo lang en zien ruim twee keer zoveel pagina's.
Op mobiel komt 84% van je advertentieverkeer binnen.

## 2. Wat er niet mis is

Dit staat vooraan omdat ik er in de loop van het onderzoek drie keer naast zat, telkens in
dezelfde richting: ik nam aan dat iets ontbrak, en het bleek te bestaan.

- **De zoekwoorden zijn goed.** 74,3% van € 449 aan gemeten zoektermen heeft echte
  zakelijke intentie. Weggegooid geld is ongeveer 5%.
- **De advertenties zijn goed.** CTR 11,1% is voor deze markt bovengemiddeld. Google
  beoordeelt advertentierelevantie en verwachte CTR als bovengemiddeld.
- **De productpagina heeft staffelprijzen.** Vanaf 1 / 250 / 500 / 1000 / 2500, met
  prijs per eenheid.
- **De productpagina heeft een logo-configurator**, met opdrukposities, bestandsupload
  en graveeropties.
- **Er is een productgebonden offerteaanvraag.** Knop "Offerte aanvragen" in de
  koopwidget gaat naar `/poconfigurator/request?productId=…`, en dat formulier noemt het
  artikel bij naam en nummer. Het werkt zonder inloggen.
- **De meetopzet klopt.** GTM-MJ83DVQK, GA4 `G-VT3YF07ZGB`, Clarity-project `y9d3vyhhk8`
  met de GA4-sessie-id meegegeven. Alle drie de aanvraagpaden hebben een trigger:
  `/offerte` op formulier-id, `/contact` op formulier-id, en het productformulier op
  `/request/send`. **Die laatste noemde ik eerder dood. Dat was onjuist**: hij hoort bij
  het configurator-formulier, niet bij `/offerte`.
- **Alt-teksten zijn compleet.** Nul ontbrekend op 190 afbeeldingen in de CMS-blokken.
- **Het palet is schoon.** Geen oud goud, geen `#ca853f` als tekst, geen zwarte schaduwen.
- **Je verkeer is volledig Nederlands**, met Amsterdam, Rotterdam en Den Haag bovenaan.

Je hebt dus geen functionaliteitsprobleem. Dat is goed nieuws, want functionaliteit bouwen
duurt weken en de dingen hieronder duren dagen.

## 3. De vier echte problemen

### Probleem 1: de pagina rendert niet op tijd

PageSpeed, mobiel, gemeten 27 oktober:

| Pagina | Score | LCP | TBT | Speed Index |
|---|---|---|---|---|
| `/` | 37 | **30,9 s** | 1.190 ms | 6,6 s |
| `/eindejaarsgeschenken` | 57 | 5,6 s | 540 ms | 4,4 s |
| `/alle-producten/` | 45 | 6,6 s | 690 ms | 11,9 s |
| `/offerte` | 55 | **9,2 s** | 340 ms | 5,8 s |

De drempel voor "goed" is 2,5 seconden. In augustus was de homepage 35,5 s, nu 30,9 s. In
twee maanden is er in de beeldpijplijn dus niets veranderd.

Waar het gewicht zit, gemeten per `<img>` met de variant die een telefoon van 390 px echt
kiest:

| Groep | n | Nu | Waarvan direct | Als webp |
|---|---|---|---|---|
| Productfoto in slider of grid | 17 | 5.679 kB | 0 kB | 514 kB |
| **Galerijslides binnen de productkaart** | 15 | 3.355 kB | **3.355 kB** | 265 kB |
| Klantlogo-wall | 23 | 170 kB | 170 kB | 88 kB |
| Betaal- en verzendicoon | 4 | 29 kB | 29 kB | 13 kB |

Het directe beeldgewicht van de homepage bestaat vrijwel volledig uit **galerijslides in
productkaarten**: elke kaart laadt zijn hele fotogalerij, terwijl je alleen de eerste ziet.
Tien ervan zijn kleuren van één Samsonite-koffer, 217 tot 365 kB per stuk.

Alle 59 gemeten PNG's samen zijn 9,02 MB. Als JPEG levert dat maar 10% op, want het zijn
uitgesneden productfoto's met een echt alfakanaal. **Als webp: 0,86 MB, een besparing van
91%.** Webp is hier dus niet een optimalisatie maar het enige middel dat werkt.

Google rekent het ons ook aan. Op elk zoekwoord met een kwaliteitsscore staat
`post_click_quality_score` op **ondergemiddeld**, terwijl advertentierelevantie en
verwachte CTR bovengemiddeld zijn. We verloren 53 tot 90% van de vertoningen aan positie.
Sinds ongeveer 21 oktober, op € 55 per dag, lopen we ook tegen het budget aan.

### Probleem 2: we meten één op de twintig advertentieklikken

37 betaalde sessies op 702 klikken. Direct verkeer is met 155 sessies vier keer zo groot
als betaald, op een site waarvan de branded campagne de hele maand **5 vertoningen** haalde.

**Hypothese, nog niet bevestigd:** bezoekers vertrekken voordat de pagina staat, en dus
voordat ze de cookiebanner beantwoorden. Consent Mode staat standaard op denied, dus zonder
antwoord vuurt de Google-tag niet. Traagheid kost ons dan niet alleen de bezoeker maar ook
het bewijs dat hij er was. Dat verklaart waarom koud betaald verkeer veel slechter gemeten
wordt dan direct verkeer van mensen die de site al kennen.

Te bevestigen met het acceptatiepercentage van de banner. Dat zit niet in de Data API.

Dit is duurder dan het lijkt. Zolang we 5% zien kan Smart Bidding nooit werken, kunnen we
geen enkele verbetering aantonen, en is elk percentage in dit document een ondergrens.

### Probleem 3: de pagina beantwoordt een andere vraag dan de zoekvraag

Gemeten op 27 oktober, zelfde methode op beide sites:

| | Rooted Goods home | Giftcampaign home |
|---|---|---|
| h1 | "Relatiegeschenken gemaakt in Europa" | "Relatiegeschenken met logo voor jouw merk" |
| "vanaf" op de pagina | **1x** | **22x** |
| "logo" op de pagina | 27x | **98x** |
| "gratis" | 1x | 11x |
| "digitale proef" | 0x | 2x |
| "staffel" | 0x | 1x |
| webp/avif | **0** | **56** |
| afbeeldingen met lazy | 28 van 208 (13%) | 89 van 202 (44%) |

Jouw duurste zoekterm is "relatiegeschenken met logo". Jouw h1 zegt "gemaakt in Europa".
Dat is een goed verhaal en het is je onderscheid, maar het is het antwoord op de tweede
vraag, niet op de eerste.

En wat je bezoekers zelf intypen in je zoekbalk, 32 keer in 22 dagen:

> paraplu, kerstbal, kersthanger, mepal lunchpot, sleutelhangers, sokken, TapOut, bidon,
> fles, gieter, kaas, king pepermunt, koffie, koffiebeker, laptop, luchtverfrisser,
> lunchpot, rolmaat, schaaf, stressbal, tablet, trui, waterfles

Allemaal **producten**. Nul keer een thema, een gelegenheid of "relatiegeschenk met logo".
Mensen komen binnen met een artikel in hun hoofd. De site leidt met thema's en met een
catalogus van 179 tegels zonder `<h1>`.

### Probleem 4: niets van jou staat in de sitemap

De sitemap bevat 1.507 URL's. Gecontroleerd op 27 oktober:

| Pagina | In sitemap |
|---|---|
| `/`, `/offerte`, `/eindejaarsgeschenken`, `/contact`, `/over-ons`, `/faq`, `/made-in-nl`, `/merken/`, `/onboarding-welkomstpakket`, `/warehousing-fulfillment`, `/medewerker-merchandise` | **geen enkele** |
| Shopware-categorieën en 1.201 productpagina's | ja |

Daar komt bij: `/thema-s/kerstpakketten-eindejaar/` staat er wél in en heeft een **lege h1**,
terwijl `/eindejaarsgeschenken` een nette h1 heeft en er niet in staat. De zwakke pagina is
vindbaar, de goede niet, voor dezelfde zoekvraag.

En van die 1.201 product-URL's gaan er maar **636 over een uniek product**. 182 producten
hebben meerdere variant-URL's, samen **565 extra pagina's** met vrijwel dezelfde tekst.
Pulltap's kelnersmes heeft er ongeveer 45.

## 4. De kansen

1. **Webp is 91% van je beeldgewicht.** Geen ontwerpwijziging, geen contentwijziging.
2. **De galerijslides uitzetten is gratis** en haalt 3,28 MB direct gewicht weg. Eén
   template-ingreep die zowel de homepage als de categoriepagina's raakt.
3. **Het aanvraagpad bestaat al en is product-gebonden.** Het hoeft niet gebouwd te worden,
   alleen gevonden. Nu is het de derde knop in de stapel, in outline-stijl, onder een
   configurator.
4. **De showroom als drempelverlager.** Je hebt een generator voor deelbare
   voorstelpagina's met het logo van de klant erop. De branche mailt een mockup-PDF.
   Zet dat vóór de offerte: "stuur je logo, dan krijg je binnen één werkdag een eigen
   voorstelpagina". Dat vraagt geen beslissing en geen budget van de bezoeker, en niemand
   anders in deze markt biedt het. Dit blijft het sterkste idee in dit hele onderzoek.
5. **Je zoekbalk vertelt gratis wat er moet komen.** Mensen zoeken producten, geen thema's.
6. **Je hebt het goede verhaal, op de verkeerde plek.** "Gemaakt in Europa" is je
   onderscheid en het werkt, maar pas nadat iemand weet dat hij hier zijn logo op 250 stuks
   kan krijgen voor een bekende prijs.

## 5. Wat we gaan doen

Verkoopvenster: tot begin december. Alles hieronder is gesorteerd op wat binnen twee weken
terugverdiend is. **(ik)** = in code of config, **(jij)** = Shopware, account of besluit,
**(samen)** = ik lever voor, jij beslist.

### Nu, deze week

| # | Wat | Wie | Waarom |
|---|---|---|---|
| 1 | Galerijslides in de productkaart niet meer eager laden | jij | 3,28 MB direct gewicht, gratis, raakt home én categorieën |
| 2 | Lazy loading in de CMS-blokken live zetten | jij (plakken) | **klaar in de repo**, 135 afbeeldingen |
| 3 | Webp regelen: eerst Shopware Store op een eenmalige plugin, anders Cloudflare Pro | samen | 91% van het beeldgewicht |
| 4 | Eigen pagina's in de sitemap krijgen | jij | ze bestaan nu simpelweg niet voor Google |
| 5 | Nameting met `bin/psi.sh` na elke stap | ik | anders is het een aanname |

### Week 2

| # | Wat | Wie |
|---|---|---|
| 6 | "Offerte aanvragen" naar de eerste knoppositie op de productpagina, met duidelijke tekst | samen |
| 7 | De h1 van home en `/alle-producten/` op de zoekvraag zetten, en `/alle-producten/` een h1 geven | samen |
| 8 | Vanaf-prijs per stuk, excl. btw, en minimale afname zichtbaar op de tegel | samen |
| 9 | Het showroom-aanbod als drempelverlager op de advertentiepagina's | samen |
| 10 | Variant-URL's canonicaliseren naar het hoofdproduct | jij, via Promidata |

### Week 3 en verder

| # | Wat | Wie |
|---|---|---|
| 11 | Formulierpad end-to-end testen zodra er verkeer doorheen gaat | ik |
| 12 | Clarity-opnames bekijken op de verbeterde pagina's | samen |
| 13 | Pas naar Smart Bidding als er dertig gemeten aanvragen in dertig dagen zijn | ik |
| 14 | `width`/`height` op de afbeeldingen, na visuele controle | ik |

### Niet nu

De merkherziening uit `DESIGN-AUDIT.md` (Fase 3 en 4), de 992 `!important`, en de
`@main`-verwijzing naar jsdelivr. Allemaal echt, allemaal januari.

## 6. Waar we op sturen

Eén getal: **gemeten aanvraagpercentage op advertentieverkeer, per week.** Nu 0 van 702.

Maar eerst een ander getal, want zonder dat betekent het eerste niets:
**het aandeel advertentieklikken dat GA4 überhaupt ziet.** Nu 5,3%. Zolang dat onder de
50% blijft, is elke conclusie over conversie een gok.

| Aanvraagpercentage | Aanvragen per week bij 220 klikken | Kosten per aanvraag bij € 1,33 |
|---|---|---|
| 0,5% | 1,1 | € 266 |
| 1,0% | 2,2 | € 133 |
| 2,0% | 4,4 | € 67 |

## 7. Wat nog niet onderzocht is

- **Of die offerteknop daadwerkelijk werkt als je hem indrukt.** Hij is `href="#"` met een
  `onclick`. De Chrome-koppeling deed het vandaag niet, dus ik heb hem niet kunnen
  aanklikken. Dit is de belangrijkste openstaande test.
- **Het acceptatiepercentage van de cookiebanner.** Bepaalt of probleem 2 klopt.
- **Clarity.** De tag staat er en de koppeling met GA4 ook, maar ik heb geen enkele opname
  of heatmap gezien. Opnames leven ongeveer dertig dagen, dus oktober verdwijnt binnenkort.
- **Search Console.** Geen koppeling, dus geen enkel cijfer over organische posities.
- **Desktop PageSpeed.** Alleen mobiel gemeten.
- **De concurrentievergelijking is één meting op twee homepages.** Giftcampaign en Rooted
  Goods, op woordgebruik en techniek. Geen productpagina's vergeleken, geen prijsniveau,
  geen aanbod. Het is een aanwijzing, geen marktonderzoek.
- **Waarom `/offerte` 9,2 seconden doet** terwijl die pagina 0,04 MB aan beeld heeft. Ik mat
  2,14 s tot het eerste byte. Dat is server of rendering, niet beeld.

---

## 8. Nagekomen, 27 oktober laat

### 8.1 De offerteknop is vrijwel zeker niet stuk

Ik kon hem niet aanklikken (Chrome-koppeling deed het niet), maar wel ontleden:

```html
<a id="js-request-offer" href="#" target="_blank"
   onclick="window.location.href='/poconfigurator/request?productId=…'; return false;"
   class="btn btn-block btn-outline-primary btn-custom-action">Offerte aanvragen</a>
```

Dat is een kale inline `onclick`, geen framework, geen event-delegatie, geen afhankelijkheid
van een plugin die kan falen. Zoiets werkt tenzij JavaScript helemaal uit staat. De
bestemming werkt ook: `/poconfigurator/request` geeft HTTP 200, toont het artikel bij naam
en nummer, heeft het formulier, draagt de GTM-container én de `dataLayer`, en vereist geen
login.

**Herziene conclusie:** het is geen techniekprobleem maar een zichtbaarheidsprobleem. De
knop is de derde in de stapel, in outline-stijl, onder "In het winkelmandje" en onder een
configurator. Dat maakt de oplossing goedkoper dan wanneer hij stuk was geweest.

Blijft staan: één echte testaanvraag erdoorheen, zodat we zien of `generate_lead` in GA4
aankomt. Dat is Wards handeling, want het stuurt een echte mail naar het bedrijf.

### 8.2 Slider: slides eraf, niet slider kleiner

Gemeten op beide pagina's, per productkaart het gewicht van de eerste slide tegenover de rest:

| | Home | Alle-producten |
|---|---|---|
| Productkaarten | 28 | 24 |
| Beeld in die kaarten nu | 5.612 kB | 5.259 kB |
| Alleen de eerste slide per kaart | 1.041 kB | 604 kB |
| **De overige slides** | **4.572 kB (81%)** | **4.655 kB (89%)** |
| Na strippen, daarna webp (schatting) | ~125 kB | ~73 kB |

Eén kaart op de catalogus heeft **17 slides**, een op de homepage heeft er 10. Verdeling
op home: 7 kaarten zonder slides, 3 met 1, 4 met 2, 6 met 3, 6 met 4, 1 met 5, 1 met 10.

Slider kleiner maken kost producten en bespaart evenredig. Slides eraf kost niets zichtbaars
en haalt vier vijfde weg. Op de categoriepagina's is het effect groter dan op de homepage,
dus ja, daar ook.

### 8.3 Waarop wordt er gezocht

**In Google, waar je voor betaalt.** 500 termen, 1 t/m 26 oktober, € 449 van de € 884
(Google verbergt termen met weinig volume). Een term kan in meer dan één thema vallen.

| Thema | Termen | Vertoningen | Klikken | Kosten | CTR |
|---|---|---|---|---|---|
| Klant / relatie | 162 | 805 | 199 | € 224,95 | 24,7% |
| Logo / bedrukking | 293 | 897 | 127 | € 191,90 | 14,2% |
| Kerst / eindejaar | 70 | 906 | 121 | € 181,18 | 13,4% |
| **Origineel / idee** | 20 | 122 | 49 | € 46,13 | **40,2%** |
| Duurzaam / eco | 21 | 148 | 29 | € 37,69 | 19,6% |
| **Luxe / premium** | 16 | 125 | 60 | € 37,01 | **48,0%** |
| Pakket / box | 22 | 120 | 19 | € 27,97 | 15,8% |
| Collega / personeel | 27 | 269 | 19 | € 23,45 | **7,1%** |
| Kleine oplage | 18 | 63 | 11 | € 16,54 | 17,5% |
| Concreet product | 82 | 176 | 13 | € 15,10 | **7,4%** |
| Prijs / goedkoop | 13 | 45 | 6 | € 9,36 | 13,3% |

Drie dingen springen eruit.

**"Luxe" en "origineel" zijn je goudmijn en je behandelt ze niet als zodanig.** Twee termen,
`luxe relatiegeschenken` (51 klikken, € 29,32) en `originele relatiegeschenken` (35 klikken,
€ 28,62), zijn samen **86 van de 360 klikken (24%) voor € 58 (13% van de kosten)**. Hun CPC
ligt rond € 0,57 en € 0,82, tegenover € 1,33 gemiddeld. Mensen die zo zoeken willen
geïnspireerd worden, niet filteren. Ze krijgen nu een catalogus van 179 tegels zonder h1.

**"Collega / personeel" en "concreet product" presteren slecht**, 7,1% en 7,4% CTR tegenover
11,1% gemiddeld. 269 vertoningen op collega-termen leverden 19 klikken. Daar wordt de
advertentie niet herkend als antwoord.

**"Kleine oplage" is een gemiste aansluiting.** 18 termen, 17,5% CTR, dus ze klikken graag.
Daarna komen ze op een catalogus waar de minimale afname van bijvoorbeeld 150 stuks in een
lap leverancierstekst verstopt zit. Dat is precies de belofte die de pagina niet nakomt.

**In je eigen zoekbalk, waar je niets voor betaalt.** 25 unieke termen, 32 zoekopdrachten,
26 personen, 6 t/m 27 oktober:

| | |
|---|---|
| Drinkwaren | bidon, fles, koffie, koffiebeker, waterfles |
| Gereedschap en outdoor | paraplu (3x), gieter, rolmaat, schaaf, kracht |
| Kleine giveaways | sleutelhangers, king pepermunt, luchtverfrisser, stressbal |
| Lunch | mepal lunchpot, lunchpot, kaas |
| Kerst | kerstbal, kersthanger |
| Kleding | sokken, trui |
| Elektronica | laptop, tablet |
| Merknamen | Mepal, TapOut |

**Het verschil tussen die twee lijsten is de diagnose van je navigatie.** In Google zoeken
mensen op categorie ("luxe relatiegeschenken", "relatiegeschenken met logo"). Eenmaal binnen
zoeken ze op **product** (paraplu, koffiebeker, sokken). Niemand typt een thema. Jouw site
leidt met thema's: eindejaar, onboarding, medewerker merchandise, events.

Let ook op `kerstbal` en `kersthanger`, die je niet voert, en op `custom tosti ijzer` in het
Ads-rapport, wat het Falk-product uit het showroomproject is.

### 8.4 Wat dit toevoegt aan de lijst

| # | Wat | Wie |
|---|---|---|
| 1a | Galerijslides strippen op home **en** categoriepagina's, niet de slider verkleinen | jij |
| 6a | Offerteknop naar de eerste positie, en één testaanvraag erdoorheen om de meetketen te bewijzen | samen |
| 7a | Een eigen advertentiegroep en landingspagina voor "luxe" en "origineel", de twee goedkoopste en best presterende termen | samen |
| 8a | Minimale afname als zichtbaar kenmerk, want "kleine oplage" klikt goed en loopt daarna vast | samen |
| 15 | Productgericht zoeken vooropzetten in de navigatie, naast de thema's | samen |
| 16 | Collega- en productspecifieke advertentiegroepen herzien of pauzeren, CTR 7% tegenover 11% gemiddeld | ik |
