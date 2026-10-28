# Rooted Goods, eindiagnose

> 28 oktober 2026. Dit is de schone versie na drie onderzoeksrondes en twee kritische
> reviews. De eerdere versies staan als `diagnose-2026-10-versie2.md` en
> `diagnose-2026-10-werkversie.md`; daar staat het onderzoek in de volgorde waarin het
> gebeurde, inclusief zeven conclusies die onderweg zijn ingetrokken. Hier staat alleen wat
> overeind blijft.
>
> **Bronnen:** Google Ads API (account 9393286984), GA4 Data API (property 551909322),
> Microsoft Clarity (project y9d3vyhhk8, twee exportrondes plus API), Google Search Console,
> PageSpeed Insights API, de GTM-container GTM-MJ83DVQK, en directe inspectie van de live
> site en de eigen CSS. Periode overal **6 t/m 27 oktober 2026** tenzij anders vermeld.

---

## 1. De kern

**De klikken komen aan. De bezoekers komen een cookiemuur tegen. Wie daar voorbij komt
bladert door de catalogus, opent nooit een product, en komt dus nooit bij de offerte.**

Het aanvraagmechanisme werkt: een testaanvraag op 27 oktober kwam zowel in de mailbox als in
GA4 aan. En er is in oktober **één echte aanvraag** binnengekomen.

**Die ene aanvraag staat niet in GA4.** Over heel oktober telt GA4 precies één
`generate_lead`, en dat is de test van 27 oktober. Op `/offerte` staat de hele maand geen
enkele formulierverzending. De enige conversie die je had, is dus niet gemeten, vrijwel zeker
omdat de bezoeker geen cookietoestemming gaf. Dat is de scherpste illustratie van het
meetprobleem die er is: precies het ene dat je moet kunnen zien, werd gemist.

Eén aanvraag op 740 klikken is 0,135%, al weten we niet of die aanvraag van een
advertentieklik kwam.

### De trechter

| Stap | Aantal | Bron |
|---|---|---|
| Advertentieklikken | **740** | Google Ads |
| Waarvan zoekpartners | 157 (21%) | Google Ads |
| Ongeldige klikken die Google wegfilterde | 166 | Google Ads |
| Paginaweergaven uit advertenties | **841**, waarvan 1 bot | Clarity, filter `gad_` |
| Tikt de cookiemodal weg | **32 tot 44%** | Clarity taps |
| Pagina's per sessie (wie toestemming gaf) | 2,73 | GA4 |
| Productpagina's geopend | **86 verschillende, 138 weergaven (20,5%)** | GA4 |
| Waarvan met 1 of 2 weergaven | 75 van de 86 | GA4 |
| Weergaven `/offerte` | 13, waarvan 4 bots | Clarity |
| Weergaven productofferteformulier | 2 | Clarity |
| **Verstuurd** | **2 van 2, vrijwel zeker eigen tests** | Clarity |
| Aanvragen in de mailbox | **1** | Ward |
| Daarvan terug te vinden in GA4 | **0** | GA4 |

### De zes oorzaken, op volgorde

| # | Oorzaak | Bewijs in één getal |
|---|---|---|
| 1 | **Iedereen opent een ander product en komt daarna niet verder** | 86 productpagina's, 138 weergaven, waarvan 75 met 1 of 2 |
| 2 | **De cookiebanner is een schermvullende modal met blur en scrollslot** | 40,6% van alle taps gaat erheen; hooguit 32 tot 44% tikt hem weg |
| 3 | **Een vijfde van het verkeer is geen inkoper** | 157 zoekpartnerklikken met 65% CTR, 166 ongeldige klikken, 145 in-app browsers |
| 4 | **Wat er na de productpagina gebeurt is niet gemeten** | geen Clarity-export van een productpagina of /checkout, 0 e-commercegebeurtenissen |
| 5 | **De meting verliest de advertentieherkomst** | GA4 ziet 41 van 841 betaalde paginaweergaven, ongeveer 5% |
| 6 | **De webshop meet niets commercieels** | 0 van 14 e-commercegebeurtenissen bestaat; geen enkele `AW-`-conversietag in GTM |

---

## 2. Wat géén oorzaak is

Negen keer bleek iets wat leek te ontbreken of te haperen gewoon te bestaan en te werken.
Wie hieraan gaat bouwen, verspilt tijd.

| Wat | Status |
|---|---|
| Het offerteformulier | Werkt, maar bewezen met eigen tests: de twee sessies op het productformulier waren beide Edge, 198 seconden actief, 96,5% scrolldiepte, en Ward meldt nul aanvragen in de mailbox |
| De meetketen van aanvraag naar GA4 | Bewezen met een testaanvraag op 27 oktober: `generate_lead` kwam aan en staat als sleutelgebeurtenis aangevinkt |
| De e-mail van een aanvraag | Komt aan, bevestigd door Ward |
| Verloren klikken tussen advertentie en pagina | Bestaan niet. 841 paginaweergaven op 740 klikken, één bot |
| Staffelprijzen op de productpagina | Aanwezig: vanaf 1 / 250 / 500 / 1000 / 2500 |
| Logo-configurator | Aanwezig, met opdrukposities, bestandsupload en graveeropties |
| Productgebonden offerteaanvraag | Aanwezig op `/poconfigurator/request`, noemt het artikel bij naam, geen login nodig |
| De landingspagina tegenover de advertentie | Spreken elkaar niet tegen over minimale afname; de FAQ zegt hetzelfde als de advertentie |
| Productteksten | Steekproef van 45: nul leeg, nul Engels, allemaal Nederlands |
| De interne zoekfunctie | Werkt. `paraplu` 12 resultaten, `koffiebeker` 10, `mepal` 26 |

**Laadtijd is geen hoofdoorzaak.** Echte laadtijden: kerstpagina 2,20 s, home 3,55 s,
catalogus 7,89 s, betaald verkeer gemiddeld 4,24 s. De kerstpagina laadt snel en levert even
weinig op als de catalogus. Dat is zwak bewijs (bij nul overal bewijst niets iets), maar er
is geen enkel signaal dat laden de rem is.

**Reactiesnelheid is dat mogelijk wel.** INP staat op **500 ms** bij betaald verkeer, precies
de grens van "slecht". Dat is een halve seconde wachten per tik, en het verklaart waarom
mensen dubbel tikken. Dat is de enige snelheidsbevinding die overeind blijft.

**Dagdelen beperken is geen oplossing.** Zie paragraaf 4.

---

## 3. Oorzaak 1: de doorklik is diffuus, en daarna houdt de meting op

**Correctie op een eerdere versie.** Hier stond dat producten wel getoond maar nooit geopend
worden: 789 keer getoond, 14 keer geopend. Dat was onjuist. De 14 was het aantal weergaven
van de enige productpagina die de Clarity-toplijst haalde, en die lijst kapt af. De 789 is
het aantal keren dat de catalogus geladen werd met dat product vooraan, niet hoe vaak iemand
het zag.

GA4 over 6 t/m 27 oktober, alleen sessies met toestemming:

| | |
|---|---|
| Verschillende productpagina's geopend | **86** |
| Samen | **138 weergaven, 20,5% van alle paginaweergaven** |
| Daarvan met 1 of 2 weergaven | **75 van de 86** |
| Meest bekeken product | Strandtas BEACHEUR, 9 weergaven |
| `/alle-producten/`, alle varianten | 93 weergaven |

**Mensen openen dus wel degelijk producten. Iedereen opent alleen een ander product.**
Daardoor haalt geen enkele pagina een toplijst, en daardoor leek het alsof er niets gebeurde.

Op de catalogus gaan de aanrakingen ongeveer gelijk op: **87 naar de paginering en 74 naar
een productkaart.** (Een eerdere versie zei 172 tegen 74. De paginering bestaat uit een
zichtbaar `LABEL.page-link` met een verborgen `INPUT.d-none` ernaast; Clarity telt beide bij
één tik. In de export staan de paren letterlijk naast elkaar: 38/38, 25/25, 12/12, 4/4.)

Wat overblijft is wel een echte bevinding, alleen anders: **de route van product naar
aanvraag is nergens gemeten.** Er is geen Clarity-export van een productpagina of van
`/checkout`, en GA4 kent geen enkele e-commercegebeurtenis. We weten dat mensen producten
openen en dat er vrijwel geen aanvragen komen. Wat daartussen misgaat is onbekend.

De tegel geeft wel weinig houvast: productnaam, een vanaf-prijs en een knop die **"Details"**
heet. Geen prijs per stuk, geen excl. btw, geen minimale afname, geen vermelding dat er een
logo op kan. Of een betere tegel helpt is aannemelijk, niet gemeten.

## 4. Oorzaak 2: de cookiemodal

In `rootedgoods.min.css`, jouw eigen bestand op jsDelivr:

```css
.cookie-permission-container[style*="display: block"]{
  position:fixed!important; inset:0!important;
  background-color:rgba(20,26,15,.55)!important;
  backdrop-filter:blur(4px); display:flex!important; ...}
body:has(.cookie-permission-container[style*="display: block"]){overflow:hidden}
```

Donkere overlay over de hele pagina, vier pixels blur, een kaart van 560 px in het midden,
en de body op scrollslot. Bewust gebouwd, commit `8d0579b`.

| Pagina | Weergaven | Taps "Accepteren" | Taps "Weigeren" |
|---|---|---|---|
| Home, betaald verkeer | 171 | 54 (32%) | **0** |
| `/eindejaarsgeschenken` | 292 | 129 (44%) | **0** |
| `/alle-producten/` | 691 | 96 | **0** |

Op elke gemeten pagina gaat ongeveer 40% van alle aanrakingen naar deze modal. Niemand tikt
ooit op "Weigeren", op geen van de drie pagina's.

**Gevolg voor de rest van de meetdata:** scrolldiepte en afhaakpunten meten deels hoe mensen
een geblurde pagina achter een modal bekijken. Op iOS Safari wordt `overflow:hidden` op body
genegeerd, dus daar scrolt de pagina wel mee. Bouw een herindeling van de kerstpagina niet
op die scrollcijfers voordat de modal weg is en er opnieuw gemeten is.

**Gevolg voor de meting:** dit acceptatiepercentage van 32 tot 44% is het plafond voor wat
GA4 ooit kan zien, ook na reparatie van de tags.

---

## 5. Oorzaak 3: de kwaliteit van het verkeer

### Zoekpartners

| Netwerk | Vertoningen | Klikken | CTR | Kosten |
|---|---|---|---|---|
| Google Search | 6.027 | 583 | 9,7% | € 857 |
| **Zoekpartners** | **242** | **157** | **65%** | € 114 |

Op tablet gaven de partners 37 klikken op 38 vertoningen, oftewel 97%. Geen mens klikt zo.

Dit is te zien in drie onafhankelijke bronnen die elkaar bevestigen: de netwerksplitsing in
Ads (157), de verwijzer `syndicatedsearch.goog` in Clarity (157), en de in-app browsers
(FacebookApp 113 plus InstagramApp 32 = 145, terwijl er geen advertenties op die kanalen
draaien; het zijn partnersites geopend binnen de Facebook-app).

**Het juiste veld om dit uit te zetten is `target_search_network`, dat op `true` staat.** In
de interface is dat het vinkje "Google-zoekpartners opnemen" onder Instellingen → Netwerken.
Het veld `target_partner_search_network` staat op `false` maar dat is iets anders, namelijk
het Google Partner Network voor geselecteerde accounts.

### Ongeldige klikken

166 stuks, waarvan 129 op AlwaysOn: een percentage van **22,4%**, tegen enkele procenten als
norm. Die zijn niet gefactureerd, maar ze zeggen iets over de bron.

### Consumentenverkeer zit in één zoekwoord, niet in de avonduren

Aandeel avondklikken per advertentiegroep, alleen Google Search:

| Advertentiegroep | Klikken | Avond 19-24 | Kantoor 9-17 |
|---|---|---|---|
| Relatiegeschenken met logo | 225 | **56,9%** | 26,2% |
| Kerstpakket met logo | 170 | 55,3% | 24,7% |
| Gepersonaliseerd cadeau zakelijk | 99 | **51,5%** | 27,3% |
| Duurzaam kerstpakket | 73 | 49,3% | 34,2% |

Als de avondpiek door consumenten kwam, zou de meest dubbelzinnige groep
("Gepersonaliseerd cadeau zakelijk") het hoogst moeten scoren. Hij scoort juist lager dan de
meest uitgesproken B2B-groep. De piek is uniform, en dat past bij restveilingen: overdag
verlies je van adverteerders met hogere biedingen, 's avonds win je wat overblijft. Verloren
vertoningsaandeel door rang is 70 tot 90%, door budget 1 tot 6%.

En het gedrag verschilt nauwelijks (GA4, betaald plus direct):

| Blok | Sessies | Betrokken | Pagina's per sessie | Duur |
|---|---|---|---|---|
| Kantoor 09-17 | 107 | 80,4% | 3,20 | 190 s |
| Avond 19-24 | 84 | 66,7% | 2,95 | 189 s |

**Dagdelen beperken zou dus de helft van het volume schrappen voor een bescheiden
kwaliteitswinst. Niet doen.**

Het échte consumentenlek zit in één zoekwoord: **`gepersonaliseerd kerstgeschenk`** (phrase
en exact samen, 90 klikken, € 135, 15% van het Thema-budget). Daaronder vallen zoektermen
als "kerstsok met naam", "baby's eerste kerstbal met naam", "kerstbal met naam en
geboortedatum", "gepersonaliseerd kerstcadeau man".

---

## 6. Oorzaak 5 en 6: de meting

### GA4 ziet ongeveer 5%

GA4 telt 41 betaalde sessies tegenover 841 paginaweergaven in Clarity. De mechaniek, gelezen
uit de pagina en de container:

1. Consent Mode staat standaard op **denied** tot de cookie `dtgsAllowGtmTracking=1` bestaat.
2. De GA4-configuratietag (`__googtag`) heeft **geen consent-vereiste** en vuurt dus direct,
   als cookieloze ping. Die wordt bij dit volume geen sessie in de rapporten.
3. Klikt iemand daarna op accepteren, dan pusht de Shopware-plugin een consent-event.
   **Geen enkele tag in de container luistert daarnaar.** De pageview wordt niet opnieuw
   gestuurd.
4. Wie pas op pagina twee accepteert, wordt geteld als Direct zonder gclid. Vandaar 162
   Direct-sessies tegenover 44 Paid Search.

De reparatie is één tag die na de consent-update alsnog een `page_view` met de huidige
`page_location` stuurt.

### De webshop meet niets commercieels

GA4 kent precies **acht** eventsoorten: `page_view`, `user_engagement`, `session_start`,
`first_visit`, `scroll`, `form_start`, `view_search_results`, `form_submit`.

Ontbrekend: `view_item`, `add_to_cart`, `begin_checkout`, `purchase`, en alle andere
e-commercegebeurtenissen. De primaire knop op elke productpagina is "In het winkelmandje" en
er wordt nergens gemeten of iemand erop klikt. De Shopware-plugin vult de `dataLayer` wel;
er is alleen geen tag die hem uitleest.

Daarnaast: **nul `AW-`-conversietags** in de container. De enige conversieactie in Google Ads
is een GA4-import, en die is dus consent-afhankelijk.

### Google beoordeelt de landingspagina zelf als ondergemiddeld

`post_click_quality_score` staat op BELOW_AVERAGE voor zoekwoorden die samen **519 klikken**
trokken, terwijl advertentierelevantie en verwachte CTR overal bovengemiddeld zijn. Dat is
een onafhankelijke tweede bron voor dezelfde conclusie, en een gratis KPI: schuift die naar
"gemiddeld", dan werkt de ingreep, en de CPC daalt mee.

---

## 7. Wat er verder nog ligt

Echt, maar geen Q4-probleem.

- **Organisch bestaat niet.** 103 vertoningen en 20 klikken in 29 dagen, grotendeels op de
  merknaam. Gemiddelde positie 13,8. Geen enkele commerciële zoekvraag.
- **78 van de 98 contentpagina's missen een h1**, 68 missen een meta-omschrijving. Dat is
  vrijwel de hele categoriestructuur, plus `/alle-producten/` zelf.
- **Van de elf eigen pagina's staat alleen de homepage in de sitemap.**
- **1.201 product-URL's voor 636 unieke producten**: 565 variant-URL's met dezelfde tekst.
- **De staffel is het feitelijke minimum op ruim de helft van de productpagina's.** Steekproef
  van 59: bij 34 begint de prijstabel pas bij 12 tot 2000 stuks, meestal 50. Wie "Geen
  minimale afname" leest en dan een tabel ziet die bij 50 begint, leest een minimum.
- **Alleen iDEAL en kaart als betaalmethode**, nergens "op rekening".
- **Eén interne link op de homepage wijst naar `/Alle-Producten/`** met hoofdletter:
  `<a class="rg-cat-head__link" href="/Alle-Producten/">`. Goed voor 33 weergaven op een
  dubbele URL.
- **Een 301-redirect** van `/thema-s/kerstpakketten/` naar
  `/thema-s/kerstpakketten-eindejaar/`, en die laatste heeft geen h1.
- **JavaScript-fouten op de catalogus**: `json parse error: unexpected eof` en
  `unexpected token '<', <!doctype ...`. Een AJAX-aanroep krijgt HTML waar JSON wordt verwacht.
- **Dead clicks**: desktopcatalogus 8,51%, waarvan de heetste plek een lege
  `DIV.cms-section-sidebar-sidebar-content` is. Bij een CLS van 0,343 schuift de
  categorielijst waarschijnlijk weg onder de cursor.
- **Elf advertentiegroepen voeren allemaal "Geen minimale afname"**, en elf van de vijftien
  koppen zijn identiek. Vandaar advertentiesterkte "Gemiddeld" overal, met één advertentie
  per groep.
- **De sitelinks doen niets**: `/made-in-nl` 1.650 vertoningen en 0 klikken,
  `/onboarding-welkomstpakket` 1.537 en 1, `/merken/` 2.573 en 10.
- **Vier advertentiegroepen staan aan met nul vertoningen** (Paasgeschenk, Thuiswerkpakket,
  Zomerpakketten tweemaal).

---

## 8. Wat we niet weten, en waarom het nog uitmaakt

| Wat ontbreekt | Waarom het de keuze beïnvloedt |
|---|---|
| **Wat een aanvraag waard is** | Zonder orderwaarde en offerte-naar-orderkans weten we niet wat een klik mag kosten, en dus niet of dit kanaal rendabel kan zijn |
| **Of een bedrijf op rekening kan betalen** | Voor een order van honderden euro's bij een onbekende leverancier is factuur vaak voorwaarde. Als dat niet kan, verklaart dat een deel van de stilte |
| **Of een bestelling van begin tot eind werkt** | Met logo, oplage en drukproef nooit doorlopen. Als daar iets vastloopt, verklaart dat net zoveel als alles hierboven |
| **Wat er op de productpagina zelf gebeurt** | Geen enkele Clarity-export van een productpagina of van `/checkout`. We weten dat mensen er niet komen, niet wat ze doen als ze er zijn |
| **De mobiele ervaring met eigen ogen** | Alles over mobiel komt uit meetdata. De browserkoppeling werkte tijdens dit onderzoek niet |
| **Hoe we ons verhouden tot concurrenten** | Eén concurrent vergeleken, alleen op de homepage |

Niet meer nodig: **de serverlogs** (Clarity bewees dat de klikken aankomen) en **Leadinfo**
(dat staat niet op de site, ondanks een eerdere bewering van mij dat het er wel stond).

---

## 9. Methodische waarschuwingen voor wie hiermee verder werkt

Deze staan hier omdat ze onderweg tot zeven ingetrokken conclusies hebben geleid.

1. **Clarity telt geen sessies maar paginaweergaven.** In alle negen exports is "unieke
   gebruikers" exact gelijk aan "sessies" en "terugkerend" altijd nul. Het mechanisme is niet
   opgehelderd (de cookie-instelling in Clarity staat op Aan), maar de conclusie staat:
   **gebruik Clarity nooit voor pagina's per sessie of terugkerende bezoekers. Daarvoor is
   GA4 de bron**, en die zegt 2,73 pagina's per sessie voor betaald verkeer en 3,25 voor
   direct.
2. **PageSpeed-labmetingen simuleren traag mobiel internet** en zeggen niets over wat
   bezoekers ervaren. Mijn labwaarde van 31,6 s op de homepage werd 3,55 s bij echte
   bezoekers, een factor negen. Gebruik Clarity's prestatieblok, niet PageSpeed, voor
   uitspraken over beleefde snelheid. Eén losse PSI-meting schommelt bovendien met een factor
   twee tot drie; `bin/psi.sh --runs 3` neemt de mediaan.
3. **Filters in Clarity op "is precies" sluiten advertentieverkeer uit**, want automatische
   tagging hangt `?gclid=` en `?gad_source=` aan elke klik. Filter op `gad_` om alleen
   betaald verkeer te zien, en op `/?gad_` voor de betaalde homepage.
4. **Het zoektermenrapport van Google dekt ongeveer de helft van de kosten.** Alle
   verdelingen daaruit zijn ondergrenzen.
5. **Clarity's toplijsten kappen af**, en de tiklijst telt dubbel waar een zichtbaar label
   een verborgen input aanstuurt (de paginering). Tel nooit een afwezigheid in een toplijst
   als een nul, en controleer identieke aantallen op opeenvolgende regels.
6. **De GA4-toegang verloopt.** Bij "Reauthentication is needed":
   `CLOUDSDK_CONFIG=~/.config/gcloud-rootedgoods gcloud auth application-default login --impersonate-service-account=ga4-lezer@rootedgoods-analytics.iam.gserviceaccount.com`

---

## 10. Het gereedschap

| Wat | Waar | Opzet |
|---|---|---|
| GA4-rapporten | `bin/ga4.sh` | `bin/ga4-setup.md` |
| Search Console | `bin/gsc.sh` | `bin/gsc-setup.md` |
| PageSpeed, met mediaan | `bin/psi.sh --runs 3` | `bin/ga4-setup.md`, onderaan |
| Clarity-API | `bin/clarity.sh` | 10 aanroepen per dag, laatste 3 dagen |
| Clarity-exports oktober | `docs/clarity-2026-10/` en `ronde 2/` | filter staat op regel 5 van elke CSV |
| Metingen | `docs/metingen/*.json` | voor-en-na-vergelijking |

Alles draait op serviceaccount `ga4-lezer@rootedgoods-analytics.iam.gserviceaccount.com` via
impersonatie, zonder sleutelbestand, in een eigen Google Cloud-project onder de organisatie
van rootedgoods.eu. Volledig gescheiden van Bambook.
