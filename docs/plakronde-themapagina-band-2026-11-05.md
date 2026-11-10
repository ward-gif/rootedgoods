# Plakronde: de band-hero op alle themapagina's, 5 november 2026

Zeven blokken met dezelfde hero als `thema-eindejaarsgeschenken-band`: tekst bovenaan,
daaronder de schuivende productband, de Europakaart erachter. Per thema een eigen kop.
Alles staat klaar in `plakklaar/`; plakken gaat met `bin/plak.sh <naam>`.

**Volgorde: eerst publiceren, dan plakken.** Zonder de CSS (secties 53 tot 56) en de
band-JS zie je kale HTML. De CSS en JS doen niets op pagina's zonder de marker
`.rg-page-hero--band`, dus publiceren verandert nog niets aan de site.

## De zeven blokken

| Pagina | Blok | Kop | Link onder de band | Logo's |
|---|---|---|---|---|
| Kerst | `thema-eindejaarsgeschenken-band` | Kerstpakketten met jouw logo, van **Europese makers** | Alle kerstpakketten | ja |
| Brievenbus | `thema-brievenbus-band` | Brievenbuscadeaus met jouw logo, **die overal aankomen** | Alle brievenbuscadeaus | ja |
| Dag van de leraar | `thema-dag-van-de-leraar-band` | Tastbare waardering voor de **Dag van de leraar** | Alle cadeaus | ja |
| Events | `thema-events-en-conferenties-band` | Een tastbare herinnering voor **jouw event** | Alle event-geschenken | ja |
| Made in NL | `thema-made-in-nl-band` | Geschenken met jouw logo, **van Nederlandse makers** | Alle producten | nee |
| Merchandise | `thema-medewerker-merchandise-band` | Merchandise die collega's **écht willen dragen** | Alle merchandise | nee |
| Onboarding | `thema-onboarding-band` | Welkomstpakketten voor nieuwe collega's, **met jouw logo** | Alle welkomstpakketten | ja |

De vetgedrukte woorden staan in gewicht 700, de rest in 500. Logo's staan waar ze in het
oude blok al stonden. De koppen voor de zes nieuwe pagina's zijn **voorstellen**, gemaakt
van de oude kop en subregel; de kerstkop is door Ward gekozen.

## Wat anders is dan op de kerstpagina, en waarom

De feitenregel "vanaf € 25 per persoon · vanaf 10 stuks" staat **alleen** op de
kerstpagina. Die getallen zijn alleen daar gemeten (€ 25,00 en `min="10"` op alle elf
pakketten). Op de andere pagina's staat alleen "stel je eigen ... samen". Reden:

- **Minimale afname is niet gemeten voor die thema's** en loopt per product van 1 tot
  250 of meer. Meten kost een verzoek per product (354 producten); dat is na de
  blokkade van 5 november niet gedaan.
- Een vanaf-prijs valt onder `brand/claims.md` ("geen vanaf-prijs buiten een offerte").
  Ward heeft dat voor de kerstpagina bewust anders besloten, niet voor de rest.

De prijsondergrens per thema ligt wel vast (categoriedata van 3 november). Per stuk, en
de laagste staffelprijs, dus de prijs bij het grootste volume:

| Thema | Producten | Vanaf | Tot |
|---|---:|---:|---:|
| brievenbus | 16 | € 4,95 | € 30,00 |
| dag-van-de | 94 | € 1,81 | € 110,00 |
| events-conferenties | 22 | € 0,27 | € 18,13 |
| made-in-nl | 151 | € 0,27 | € 74,75 |
| medewerker-merchandise | 59 | € 1,67 | € 75,00 |
| onboarding-welkom | 12 | € 1,81 | € 69,00 |

Wil Ward er een vanaf-prijs bij: dat is één `<strong>` in de strook van dat blok. Let op
dat € 0,27 (events, made-in-nl) een pen bij een grote oplage is en op een
cadeaupagina weinig premium oogt.

In plaats van de seizoensvraag staat onder de knop **"Persoonlijk antwoord binnen één
werkdag."** Dat staat al op de site (Europakaart-blok).

## Besluiten van 10 november (Ward)

1. **De strooktekst blijft zoals hij staat**, ook "stel je eigen ... samen". Pas aanpassen
   als er een klikformulier is dat die belofte waarmaakt (open besluiten:
   `docs/plan-themapagina-2026-11-05.md`, deel B). Dan gaat het om 7 blokken.
2. **Per thema mag de strook iets anders zijn, of wegblijven.** Alleen met iets dat we
   voor dat thema kunnen staven. Uit de bronnen is voor de zes andere thema's niets
   gevonden dat sterk genoeg is: levertijd en minimale afname verschillen per product
   (`brand/claims.md`), en de oude blokken beloven "op tijd geleverd" en "past door elke
   brievenbus", wat we niet gemeten hebben. Daarom staat er per thema alleen de eigen
   "stel je eigen ... samen"-regel, zonder getal.
3. **Een vanaf-prijs alleen als we het zeker weten en willen.** Nu: alleen kerst, waar
   `€ 25` en `min="10"` op alle elf pakketten gemeten zijn. Andere thema's: geen
   vanaf-prijs. `brand/claims.md` is hier nog niet op aangepast; de kerstuitzondering
   staat daar dus nog niet in.

Gevolg: het plakwerk is **19 blokken** (7 band-blokken plus 12 overige). Niet te plakken:
`thema-eindejaarsgeschenken-hero` (verouderd) en `thema-eindejaarsgeschenken-raster`
(voor de gedupliceerde testpagina, en met een niet gemeten besteldeadline van 27 november).

## Welk blok vervangt welk (10 november)

Een band-blok **vervangt** het oude thema-blok van die pagina; de 7 oude `thema-*`-blokken
dus niet plakken. De overige 12 vervangen elk hun eigen blok.

**Verplicht (de band werkt er niet zonder):**

| Pagina | Plak dit blok | Vervangt |
|---|---|---|
| `/eindejaarsgeschenken` (kerst) | `thema-eindejaarsgeschenken-band` | `thema-eindejaarsgeschenken` |
| `/brievenbus` | `thema-brievenbus-band` | `thema-brievenbus` |
| `/dag-van-de-leraar` | `thema-dag-van-de-leraar-band` | `thema-dag-van-de-leraar` |
| `/events-conferenties` | `thema-events-en-conferenties-band` | `thema-events-en-conferenties` |
| `/made-in-nl` | `thema-made-in-nl-band` | `thema-made-in-nl` |
| `/medewerker-merchandise` | `thema-medewerker-merchandise-band` | `thema-medewerker-merchandise` |
| `/onboarding-welkomstpakket` | `thema-onboarding-band` | `thema-onboarding` |

**Kickers en performance (12 blokken, lagere haast):** sectie 54 van de CSS verbergt de
kickers al zodra de CSS live is; het plakken haalt ze ook uit de HTML.

| Pagina | Blok | Wat er anders is |
|---|---|---|
| Homepage | `hero-sectie-v2` | kicker weg, `fetchpriority` van 4 naar 1 (performance, dus eerst) |
| Homepage | `europa map sectie` | kicker weg |
| Homepage | `thema-tegels-home` | kicker weg |
| `/thema-s` | `thema-overzicht` | kicker en "Trending"-label weg |
| `/merken` | `merken-overzicht` | kicker weg |
| `/over-ons` | `over-ons` | 2 kickers weg |
| `/offerte` | `offerte-kop` | kicker weg |
| `/services` | `services-overzicht` | kicker weg |
| service: full service | `service-detail-full-service` | 4 kickers weg |
| service: personalisatie | `service-detail-personalisatie` | 3 kickers weg |
| service: verzending | `service-detail-verzending` | 3 kickers weg |
| service: warehousing | `service-detail-warehousing` | 3 kickers weg |

De paginapaden komen uit de koppen van de blokken; de CMS-structuur zelf (of hero en
slider er nu in een of twee elementen staan) is niet gezien.

## Wat Ward in de CMS-editor moet doen, per pagina

1. **Een productslider direct onder het hero-blok.** De band maakt de bestaande
   Shopware-slider tot de schuivende rij. Zonder slider zie je alleen de tekst.
2. **Het tekstblok "Inspiratie" tussen hero en slider weghalen.** CSS verbergt het,
   maar wat alleen door CSS onzichtbaar is komt terug zodra de CSS achterloopt.
3. **De blok-padding op 0** voor het sliderblok, voor de volle breedte.
4. **De selectie in de slider controleren.** Alle pakketten van de kerstpagina hebben
   vooral dezelfde borrelplank; kies per pagina acht verschillende onderwerpen.
5. **Alleen op de kerstpagina:** zet **Bak pakket (€ 25)** in de slider. De strook zegt
   "vanaf € 25" en de goedkoopste tegel is nu € 31.

## Ook meegenomen

De knop in het onboarding-blok linkte naar `/thema-s/onboarding/`, een 301 naar
`/thema-s/onboarding-welkom/` (docs/deadlinks-2026-10-30.md). Het bandblok linkt direct
naar de goede URL; het oude blok niet aangeraakt.

## Niet gecontroleerd

- Alleen de kerstpagina is op de echte site gezien. De zes anderen zijn gemeten in de
  replica van die ene pagina, met hun eigen kop, noot en strook erin gezet. Hun eigen
  sliders (andere producten, andere beeldverhoudingen) zijn niet gezien.
- Mobiel: 375 × 667, 390 × 844; desktop 1931 × 1112. Op 375 × 667 staat de prijs boven de
  vouw met 23 px marge (57 px bij made-in-nl en merchandise, zonder logo's).
  Ruwe uitvoer: `docs/metingen/2026-11-05-hero-desktop-mobiel/na19/themas-meting.json`.
- De koppen zijn niet getest op zoekwoorden of advertentierelevantie. De oude koppen
  bevatten de zoekwoorden (brievenbuscadeaus, dag van de leraar, event, made in NL,
  merchandise, welkomstpakketten); die zijn behouden.
