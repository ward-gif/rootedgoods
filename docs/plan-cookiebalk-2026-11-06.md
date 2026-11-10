# Plan: de cookiebalk, 6 november 2026

Ward: "Maak even een plannetje van de cookiebalk. We moeten er niet weer problemen mee
krijgen, maar het kan beter ten opzichte van nu."

Dit is een plan en geen bouwopdracht. Er is niets aangepast.

## Eerst een correctie

In de stukken van 5 november (`docs/plan-themapagina-2026-11-05.md`, deel A, en de
hero-analyses) staat dat de cookiebalk op `/eindejaarsgeschenken` **40,7% van alle taps**
krijgt (129 van 317). **Dat is de oude modal, niet de balk die er nu staat.**

De meting is van 1 tot 27 oktober (`docs/metingen/nulmeting-cookiebanner-2026-10-28.md`).
Toen stond er een schermvullende modal met donkere overlay, blur en scrollslot, die
elke tik opving. Die is op 28 oktober verwijderd (CSS sectie 50) en de balk staat sindsdien
weer in de Shopware-standaardvorm: een onderbalk. **Wat de huidige balk aan taps kost is
niet gemeten.** De nameting daarvoor staat in dat bestand voor "over veertien dagen",
dus rond **11 november**, met exact dezelfde Clarity-filters.

Gevolg voor dit plan: dat het "beter kan" is een redelijke verwachting, geen vastgesteld
feit. Wat wel gemeten is staat hieronder.

## Wat er nu is

| | Gemeten | Bron |
|---|---|---|
| Vorm | Onderbalk, `position: fixed`, geen overlay, geen scrollslot | thema-CSS `all.css` |
| Hoogte desktop | circa 66 px | replica 5 november |
| Hoogte mobiel | **244 px**, drie gestapelde knoppen plus tekst | replica 5 november |
| Op 375 x 667 | de balk begint op y=423; knop in de hero staat erboven (303 tot 351) | replica |
| Op 390 x 844 | begint op y=600 | replica |
| Knoppen | Weigeren, Configureren, Aanvaard alle cookies; alle drie `.btn.btn-primary` | HTML |
| Tekst | "Deze website maakt gebruik van cookies om de best mogelijke ervaring te garanderen. Meer informatie..." | HTML |
| Weigeren | werkt: balk verdwijnt (nagedaan door Ward, privévenster, 3 november) | `promidata-vragen.md` E4 |
| Configureren | **niet nagekeken** of dit een scherm opent | `promidata-vragen.md` E4 |
| Onze eigen CSS | alleen knopkleur: accepteren gevuld, de andere twee omlijnd, gelijke grootte, geen pijl (sectie 50b) | `rootedgoods.css` |

De balk verdwijnt voor de bezoeker bij een keuze. Hoe lang die keuze bewaard blijft weten
we niet; Shopware bewaart `cookie-preference` standaard een beperkte tijd en daarna komt de
balk terug. Niet gemeten.

## Wat we mogen aanpassen, en waar

Het grootste deel zit niet in onze handen. Dat bepaalt het plan.

| Wat | Wie | Hoe |
|---|---|---|
| Uiterlijk van de balk (kleur, ruimte, lettergrootte, rij of stapel) | wij | alleen onze eigen CSS, zonder Promidata |
| De tekst van de balk | Ward | Shopware-beheer, snippets (zoek op "gebruik van cookies"); geen code, geen plakken |
| De werking (opslaan, tonen, de modal bij Configureren) | Promidata / Shopware-core | wij kunnen dit niet stuk of heel maken met CSS |
| Wat er na een keuze met toestemming gebeurt | GTM | `docs/gtm/toestemming-bijwerken.md`, sinds 28 oktober gepubliceerd |
| Een heel ander systeem (een Consent Management Platform) | Promidata | groot, zie "Niet doen" |

## Wat er mis is gegaan, en wat we daaruit onthouden

| Wat gebeurde | Les voor dit plan |
|---|---|
| Een center-modal met overlay, blur en scrollslot kostte tot 40,7% van de taps op mobiel en liet bezoekers niets anders aanraken | **Geen overlay, geen scrollslot, niets dat tikken opvangt.** De balk mag ruimte innemen, nooit de pagina blokkeren. |
| Toestemming stond na accepteren nog op `false` tot een herlaadbeurt; de landingspagina van een advertentieklik telde nooit mee | Opgelost op 28 oktober. Bij elke wijziging aan de balk opnieuw controleren dat de keuze direct doorwerkt. |
| De meting van 28 oktober zei "Weigeren doet niets"; in een echt venster werkte het wel | **Een klik die niets doet in Playwright is niet hetzelfde als een knop die stuk is.** Test in een privévenster, zonder Resource Override, op een echt toestel. |
| De modal is gebouwd en pas achteraf gemeten wat hij kostte | **Eerst meten, dan bouwen.** Dat staat letterlijk in sectie 50 van de CSS. |
| Layoutregels voor de modal (`flex-direction`, `order`, `width`) pasten niet op een onderbalk | Wat nu wel layout raakt, apart en klein houden, achter een eigen marker. |

## Harde randvoorwaarden

Dit zijn de grenzen waar elk voorstel binnen moet blijven. Ik ben geen jurist; de
Autoriteit Persoonsgegevens heeft hier regels over, en dit zijn de punten waar de huidige
CSS zich al aan houdt (sectie 50b) of waar een wijziging ze zou kunnen breken.

1. **Weigeren moet even makkelijk zijn als accepteren.** Op dezelfde balk, één klik,
   even groot. Nooit verstoppen onder "Configureren".
2. **Nooit een cookiemuur.** De site moet bruikbaar zijn zonder te kiezen.
3. **Geen overlay, geen scrollslot, geen blur** (zie hierboven).
4. **Geen automatische toestemming** door scrollen of doorklikken.
5. **Tikdoelen niet kleiner dan nu.** De knoppen zijn 48 px hoog; compacter kan, maar
   niet onder 40 px, anders tikt iemand ernaast en weigert of accepteert per ongeluk.
6. **De keuze moet direct doorwerken** (GA4 `gcs=G111` zonder herladen).
7. **De tekst blijft eerlijk.** Korter mag, maar het moet nog zeggen dat er cookies zijn
   en waarvoor, met de link naar het volledige beleid erbij.
8. **Geen layoutverschuiving.** De balk staat `fixed` en mag de pagina niet verplaatsen.

## Wat ons problemen kan geven, los van de balk

Dit is de verrassing in dit plan. **Een perfecte balk helpt niet als er trackers
omheen staan die er niets van merken.** Gelezen uit de gepubliceerde GTM-container
(GTM-MJ83DVQK, 6 november, 21 tags):

| Tag | Wat | Toestemmingsvoorwaarde |
|---|---|---|
| 3, 8 tot 46 | GA4 (`googtag`, `gaawe`) | geen veld, maar Google-tags controleren zelf de toestemmingsstatus |
| 25 | Google Ads (`awct`) | idem |
| 6 | sjabloontag, vereist `analytics_storage` | **ja** |
| 22 | onze eigen toestemmingsupdate na de keuze | hoort er geen te hebben |
| **52** | **Apollo-tracker** (`assets.apollo.io`), sinds 3 november | **geen, en geen ingebouwde controle** |
| 13 | gepauzeerd (de oude Leadinfo-tag) | n.v.t. |

Dus: de Apollo-tag heeft **geen voorwaarde dat er toestemming is**. Wat de trigger is,
heb ik niet kunnen lezen; als hij op "Alle pagina's" staat, laadt hij voor iedereen,
ook voor wie nog niet gekozen heeft of weigert. Apollo herkent bezoekers aan hun IP-adres,
dus dit raakt precies waar de balk voor bedoeld is.

Daarnaast: er komen `leadinfo_interaction`-gebeurtenissen binnen (23 over zes maanden)
terwijl de Leadinfo-tag gepauzeerd is en niet in de container zit. Waar die vandaan komen
is niet bekend (waarschijnlijk het thema, 3 november).

**Dit hoort in stap 1 van het plan**, voor elke visuele verbetering.

## De opties

### A. Eerst meten, niets veranderen
- **Kosten:** niets. De nameting bestaat al en staat voor 11 november.
- **Opbrengst:** weten of er überhaupt een probleem is. Nu bouwen is gokken.
- **Risico:** we wachten een week terwijl bezoekers de balk zien.

### B. De tekst korter, via Shopware-beheer
- **Wat:** de twee zinnen terugbrengen tot één. Op mobiel scheelt dat waarschijnlijk een
  paar regels; de balk is nu 244 px, waarvan de tekst een deel is.
- **Kosten:** een paar minuten, geen code, geen plakken, direct terug te draaien.
- **Risico:** de tekst moet blijven zeggen waarvoor de cookies zijn. Niet gemeten hoeveel
  px dit oplevert, want het hangt van de nieuwe tekst af.

### C. De drie knoppen op één rij op mobiel, via onze CSS
- **Wat:** 244 px naar schatting 110 tot 130 px (tekst op twee regels, drie compacte
  knoppen naast elkaar). **Dat is een schatting.** Op 375 px is een rij van drie knoppen
  tot 105 px breed per knop; "Aanvaard alle cookies" past daar niet zonder af te breken.
  Dat is het eigenlijke probleem en niet te beloven zonder het te bouwen en te zien.
- **Kosten:** één CSS-sectie achteraan, achter een eigen marker, met een terugdraaiknop.
- **Risico:** dit is precies het soort ingreep dat op 28 oktober is teruggedraaid. Het
  verschil: geen overlay, geen scrollslot, en gemeten voordat het live gaat. Randvoorwaarde
  5 (tikdoelen) en 1 (gelijke knoppen) staan hier het meest onder druk.

### D. Aan Promidata vragen
- **Wat:** vragen of de balk in het thema compacter kan (één rij, kortere tekst) of dat er
  een instelling voor is. Past als punt **E5** op `docs/promidata-vragen.md`.
- **Kosten:** onbekend; elke themawijziging kost geld (CLAUDE.md, harde regel 6).
- **Voordeel:** wijzigt de balk zelf en niet alleen het uiterlijk.

### E. Een ander systeem (Cookiebot, Complianz, ...)
- **Niet doen, nu.** Groot, kost geld, en het raakt GTM, de toestemmingsstatus en de
  hele meting die net op 28 oktober is gerepareerd. Alleen het overwegen waard als B tot D
  aantoonbaar tekortschieten.

### Niet doen, nooit
Een overlay, een scrollslot, "doorscrollen is akkoord", weigeren verstoppen of kleiner
maken, de balk automatisch laten verdwijnen, of een tekst die de keuze stuurt.

## Aanbevolen volgorde

| Stap | Wat | Wanneer | Waarom eerst |
|---|---|---|---|
| 1 | **Inventaris wat er vóór toestemming vuurt.** Privévenster, niets aanklikken, Tag Assistant en netwerktab. Apollo (tag 52) specifiek. | deze week, 15 minuten | De enige stap die een echt risico kan wegnemen. |
| 2 | **Nakijken of Configureren een scherm opent.** | deze week, 2 minuten | Het openstaande deel van E4. Is het stuk, dan is dat compliance en gaat het voor alles. |
| 3 | **Nameting uitvoeren**, exact de filters van de nulmeting. | rond 11 november | Het enige echte getal over de huidige balk. |
| 4 | **Beslissen**, aan de hand van stap 3: | na de nameting | |
| | taps op de balk laag en scrolldiepte hoog: **niets doen** | | |
| | taps hoog op mobiel: **B** (tekst) eerst, dan **C** (rij) als B niet genoeg is | | B is goedkoper en omkeerbaar |
| | alles tekortschietend: **D** | | |

Stap 1 en 2 hangen niet van de nameting af en kunnen vandaag.

## Een wijziging controleren

Voor elke wijziging, ook B:

1. **Echt toestel**, privévenster, geen Resource Override, geen extensies. De replica
   van deze week heeft geen echte Safari-adresbalk.
2. **Weigeren, Configureren en Accepteren** alle drie aanklikken en het resultaat zien.
   Niet met een script alleen (de les van E4).
3. **Direct na de klik** in de netwerktab: `google-analytics.com/g/collect` met
   `gcs=G111` na accepteren en `G100` na weigeren, zonder herladen.
4. **Hoogte** gemeten op 375 x 667, 390 x 844 en 1280 x 800, en dat de prijsregel van de
   hero er niet ónder verdwijnt.
5. **Geen horizontale scroll** en geen verschuiving van de pagina.
6. **Terugdraaiknop vooraf**: een wijziging in CSS is één sectie weghalen, een wijziging
   in de tekst is de oude tekst terugzetten. Opschrijven vóór het live gaat.
7. **Nameting veertien dagen later**, met dezelfde filters als nu, en dezelfde ruisgrens:
   een verschil onder tien procentpunt is geen bewijs.

## Waar op te letten in de meting

- Het aandeel taps op de cookiecontainer moet dalen, het aandeel weergaven met minstens
  een tap daarbuiten stijgen, de scrolldiepte op de twee landingspagina's stijgen
  (nulmeting: 28,6% en 32,0%).
- **Vergelijk de verhouding, niet het absolute getal.** Bij een INP van 500 ms tikken
  mensen dubbel. 54 taps op 171 weergaven is een bovengrens en geen acceptatiepercentage.
- De uitkomst van 28 oktober (modal) is **geen** referentie voor de balk. Alleen de
  nameting van deze balk is dat.
- GA4: de kanaalverdeling (Direct tegenover Paid Search) is de eindcheck of toestemming
  doorwerkt. Zie `docs/metingen/2026-11-03-kanaalverdeling/LEESMIJ.md`.

## Wat niet gemeten is

- **Wat de huidige balk aan taps kost.** Zie de correctie bovenaan.
- **Hoe groot het deel is dat de balk ziet maar nooit kiest.**
- **Hoe lang een keuze bewaard blijft**, en dus hoe vaak terugkerende bezoekers de balk
  opnieuw zien.
- **Of Configureren werkt.**
- **Wanneer tag 52 (Apollo) afgaat**: de trigger is niet gelezen, alleen dat er geen
  toestemmingsvoorwaarde is. Of de tracker vóór een keuze laadt moet in een privévenster
  worden gezien.
- **Echte toestellen.** Alles over de hoogte van de balk komt uit een replica in headless
  Chromium op 375 en 390 px.
- **Wat de AP vandaag precies eist.** Dit plan benoemt de punten waar de bestaande aanpak
  op steunt; het is geen juridisch advies.

## Voorgestelde aanvulling op de Promidata-lijst

> **E5. De cookiebalk compacter op mobiel.** De balk is op een telefoon 244 px hoog (drie
> gestapelde knoppen, twee zinnen tekst). Kan het thema de drie knoppen op één rij zetten
> en de tekst korter, of is daar een instelling voor? Gemeten 5 november in een replica op
> 375 en 390 px; nog niet op een echt toestel. Prioriteit: laag tot de nameting van
> 11 november laat zien dat de balk taps kost. Niet versturen vóór die nameting.
