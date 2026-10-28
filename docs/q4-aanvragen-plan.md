# Waarom er verkeer komt en geen aanvragen, en wat we daaraan doen in Q4

> **Dit is het werkjournaal. De diagnose staat in `diagnose-2026-10.md`.** Hieronder staat
> het onderzoek in de volgorde waarin het gebeurde, inclusief de aannames die ik onderweg
> moest terugnemen. Nuttig om te zien waarom iets besloten is, niet om uit te werken.

> **Bijgewerkt 27 oktober, na Wards antwoorden.** Drie dingen staan nu vast: er zijn
> **nul aanvragen** binnengekomen, webp/avif kan niet via Shopware, en de besteldeadline
> voor kerst is **begin december**. Daardoor is Fase A.1 beantwoord, is Fase B.1 vervangen
> door iets beters en goedkopers, en is er een meetkoppelingsplan bijgekomen. Lees
> **paragraaf 7** als je alleen het bijgewerkte deel wil.

> Opgesteld 27 oktober 2026. Nulmeting uit de Google Ads API (account 9393286984,
> "Rooted Goods", onder de Bambook-MCC) en uit eigen metingen op de live pagina's.
> Dit document vervangt `plan-van-aanpak-optimalisatie.md` niet: dat gaat over techniek
> en SEO en blijft de to-do-lijst daarvoor. Dit gaat over één vraag: waarom 662 klikken
> nul aanvragen opleverden, en wat we in de resterende weken van Q4 nog kunnen rechtzetten.

## Samenvatting

De advertenties werken. De klik is niet het probleem: CTR 11,1% is voor deze markt goed en
74% van het advertentiebudget ging naar zoektermen met echte zakelijke intentie. Wat erna
gebeurt is het probleem. 84% van de klikken komt binnen op een telefoon, en die telefoon
krijgt een pagina van vijf megabyte aan onbewerkte JPEG's voorgeschoteld. Google zegt dat
zelf ook: de ervaring na de klik staat op elk zoekwoord met een kwaliteitsscore op
"ondergemiddeld", en we verliezen 53 tot 90% van de vertoningen aan positie, niet aan
budget. Daarnaast landt iemand die "relatiegeschenken met logo" zoekt op een catalogus
zonder H1, waar het eerste product een consumentengadget is, waar de prijs "Van € 3,15"
zegt zonder "per stuk, excl. btw", en waar een minimale afname van 150 stuks verstopt zit
in leverancierstekst. Er is geen aanvraagpad dat aan een product hangt.

**Of er echt nul aanvragen zijn, kan ik van buitenaf niet vaststellen.** Dat is de eerste
vraag die beantwoord moet worden en de enige die ik niet zelf kan beantwoorden. Zie
"Wat jij moet aanleveren".

## 1. De nulmeting

Alle advertentiecijfers: account 9393286984, periode **6 t/m 26 oktober 2026 (21 dagen)**,
campagneniveau. Vóór 6 oktober liep er niets, dus dit is de hele historie.

| | waarde |
|---|---|
| Impressies | 5.942 |
| Klikken | 662 |
| Kosten | € 884,04 |
| CTR | 11,1% |
| Gemiddelde CPC | € 1,34 |
| **Conversies ("offerte- of productaanvraag")** | **0** |

Per campagne:

| Campagne | Impr. | Klikken | Kosten | CTR | CPC | Conv. |
|---|---|---|---|---|---|---|
| NL-Search-AlwaysOn | 3.385 | 424 | € 527,38 | 12,5% | € 1,24 | 0 |
| NL-Search-Thema | 2.552 | 235 | € 355,17 | 9,2% | € 1,51 | 0 |
| NL-Search-Branded | 5 | 3 | € 1,49 | 60,0% | € 0,50 | 0 |

Per apparaat:

| Apparaat | Klikken | Aandeel klikken | Kosten | Aandeel kosten |
|---|---|---|---|---|
| Mobiel | 554 | 83,7% | € 753,72 | 85,3% |
| Desktop | 63 | 9,5% | € 89,12 | 10,1% |
| Tablet | 45 | 6,8% | € 41,20 | 4,7% |

Het budget is in de loop van de maand opgevoerd: begin oktober € 5 tot € 10 per dag,
de laatste zes dagen rond € 55 per dag. Nul conversies is dus niet "nog te weinig data
om iets te zien" bij het huidige tempo, maar het is wél opgebouwd uit een periode waarin
het volume laag begon.

Waar de klikken landden (zelfde periode):

| Landingspagina | Klikken | Kosten | CTR |
|---|---|---|---|
| /eindejaarsgeschenken | 238 | € 357,13 | 5,4% |
| /alle-producten/ | 233 | € 316,51 | 12,8% |
| / (home) | 170 | € 177,60 | 6,3% |
| /merken/ | 9 | € 13,36 | 0,4% |
| /onboarding-welkomstpakket | 1 | € 1,53 | 0,07% |
| /made-in-nl | 0 | € 0,00 | 0% |

## 2. Wat er níet aan de hand is

Twee aannames die ik heb getoetst en die niet kloppen. Het is belangrijk dat we ze
wegstrepen, want ze kosten anders de verkeerde weken.

**De zoekwoorden zijn niet het probleem.** Ik heb het zoektermenrapport van 1 t/m
26 oktober (500 termen, 2.214 impressies, 360 klikken, € 449,20, ongeveer de helft van
het totale budget; Google houdt termen met weinig volume achter, dus dit is een
ondergrens) geclassificeerd op een expliciete woordenlijst:

| Categorie | Termen | Klikken | Kosten | % van kosten |
|---|---|---|---|---|
| Zakelijke intentie | 414 | 278 | € 333,81 | 74,3% |
| Onbepaald (meest "gepersonaliseerd kerstcadeau"-varianten) | 59 | 65 | € 94,13 | 21,0% |
| Consumentensignaal | 14 | 11 | € 11,90 | 2,6% |
| Prijsjager | 13 | 6 | € 9,36 | 2,1% |

Echt weggegooid geld is zo'n 5%. De grootste opruimpost is de categorie "onbepaald":
"gepersonaliseerd kerstcadeau" (8 klikken, € 13,93), "persoonlijke kerstcadeaus"
(8 klikken, € 13,36), "duurzaam kerstcadeau" (9 klikken, € 12,62). Dat zijn termen die
zowel een inkoper als een particulier kan typen. Die horen uitgesplitst, niet uitgesloten.
Een handvol echte uitsluitingen is een kwartier werk en levert ongeveer € 20 per maand op.
Dat is geen antwoord op nul aanvragen.

**De "te AI"-uitstraling is een echt probleem, maar niet dít probleem.** `DESIGN-AUDIT.md`
heeft het al scherp: 992 keer `!important`, zeven bijna-gelijke radiuswaarden, de
"eyebrow → Playfair-kop → subline → twee knoppen"-sjabloon op élke sectie, drie identieke
donkere kaarten als sectie. Dat kost vertrouwen en het is waard om op te lossen. Maar het
verklaart niet waarom 662 bezoekers in 21 dagen geen enkel formulier insturen. Een
bezoeker die afhaakt omdat elke sectie hetzelfde ritme heeft, haakt af na vijftien
seconden. Een bezoeker die afhaakt omdat de pagina niet rendert, haakt af na drie.
Fase 3 van de design-audit blijft daarom staan waar hij staat: januari, niet november.

## 3. De vier echte oorzaken, op volgorde van wat het kost

### Oorzaak 1: de pagina is te zwaar voor het apparaat waarop 84% binnenkomt

Eigen meting van 27 oktober, met een iPhone-user-agent en `Accept: image/avif,image/webp`,
waarbij per `<img>` is uitgerekend welke `srcset`-variant een telefoon van 390 px bij DPR 2
daadwerkelijk kiest:

| Pagina | Ads-klikken | Beeld totaal | Waarvan direct (niet lazy) | img-tags | Zonder lazy | webp/avif |
|---|---|---|---|---|---|---|
| / | 170 | 7,56 MB | **4,98 MB** | 208 | 180 | 0 |
| /alle-producten/ | 233 | 5,97 MB | **4,39 MB** | 179 | 155 | 0 |
| /eindejaarsgeschenken | 238 | 3,79 MB | 0,63 MB | 28 | 19 | 0 |

Drie dingen vallen op. Eén: **nul webp en nul avif op de hele site.** Alles is JPEG en PNG.
Dat is op zichzelf een besparing van grofweg 60 tot 80% op hetzelfde beeld, zonder dat er
iets aan het ontwerp verandert. Twee: op home en de catalogus staat respectievelijk 180 en
155 van de afbeeldingen zonder `loading="lazy"`, dus die komen allemaal direct binnen.
Drie: `/eindejaarsgeschenken` doet het juist goed (0,63 MB direct), dus dit is geen
onoplosbaar platformprobleem maar een kwestie van hoe die specifieke pagina's zijn
opgebouwd.

De nulmeting van 28 augustus in `plan-van-aanpak-optimalisatie.md` noemde dit al als
prioriteit 1 in Fase 2, met een mobiele LCP van 35,5 seconden op home. Twee maanden later
is er in de beeldpijplijn niets veranderd: nog steeds nul moderne formaten, nog steeds
180 afbeeldingen zonder lazy op home. Dit is dus geen nieuwe bevinding maar een niet
uitgevoerde.

Google rekent het ons ook aan, en dat is het dure deel. Op elk zoekwoord met een
kwaliteitsscore staat `post_click_quality_score` op **BELOW_AVERAGE**, bij een
kwaliteitsscore die verder op 7 staat met bovengemiddelde advertentierelevantie en
bovengemiddelde verwachte CTR. De ervaring na de klik is dus het enige onderdeel dat
onderpresteert. Gevolg: we verliezen **53 tot 90% van de vertoningen aan positie en niet
aan budget** (`search_rank_lost_impression_share`, dagelijks gemeten), en we betalen een
hogere CPC voor de vertoningen die we wel krijgen. Dezelfde euro koopt bij een gezonde
landingspagina ergens tussen anderhalf en twee keer zoveel klikken.

### Oorzaak 2: de landingspagina antwoordt niet op de zoekvraag

Iemand typt "relatiegeschenken met logo" en komt op `/alle-producten/`. Wat die persoon
daar aantreft, gemeten op de live pagina:

- **Geen `<h1>`.** Nul stuks. De pagina zegt niet waar hij over gaat.
- 179 producttegels zonder dat de advertentiebelofte ergens herhaald wordt.
- De eerste tegel is **LOKD Home**, een consumentengadget tegen telefoonverslaving, met
  consumentencopy erbij ("Zodat jij weer tijd hebt voor wat écht belangrijk is") op een
  pagina die zakelijke geschenken moet verkopen.
- Prijzen staan er als "Van € 3,15" en "Van € 30,00". Niet "per stuk", niet "excl. btw",
  niet "vanaf 100 stuks met logo". Voor een inkoper is "Van € 3,15" geen prijs maar een
  raadsel.
- De call to action op een tegel is **"Details"**.
- De **minimale afname staat verstopt in leverancierstekst** uit de Promidata-feed. Bij
  één product letterlijk: "Bedrukking: borduring 6 x 5 cm. Minimale afname: 150 stuks."
  midden in een lap specificaties. Iemand die zocht op "relatiegeschenken met logo kleine
  oplage" (dat is echt gebeurd, 6 klikken, € 9,40) kan niet zien waar hij wel of niet
  terecht kan.
- In dezelfde leveranciersomschrijving staat: **"Bij annulering van de bestelling blijven
  alle prototype- en technische kosten verschuldigd."** Dat is de eerste zin met juridische
  lading die een nieuwe bezoeker uit een advertentie te lezen krijgt.

Het aanvraagformulier zelf is overigens juist goed: `/offerte` weegt 0,04 MB aan beeld,
heeft vier velden (naam, e-mail, bedrijf verplicht, telefoon optioneel) plus een vrij
tekstveld. De drempel zit niet in het formulier. De drempel is dat niemand er komt, en dat
wie er komt zelf moet uittypen wat hij wil, omdat het formulier niet aan een product hangt.

### Oorzaak 3: de meting staat er wel, maar is onbewezen en hangt aan toestemming

Dit is goed nieuws en risico in één. De koppeling die je wilde maken, bestaat grotendeels al.
Uit de publiek opvraagbare GTM-container (`GTM-MJ83DVQK`, versie 14, 10 tags):

| Onderdeel | Status |
|---|---|
| GA4 | aanwezig, `G-VT3YF07ZGB`, via de Google-tag op `gtm.init` |
| Microsoft Clarity | **aanwezig**, officieel GTM-template, project `y9d3vyhhk8` |
| GA4-event `generate_lead` | aanwezig, trigger op formulier-id `form_018e5c…` |
| GA4-event `contact` | aanwezig, trigger op formulier-id `form_2c60f73e…` |
| Google Ads | GA4-sleutelgebeurtenis geïmporteerd als "offerte- of productaanvraag (GA4)", status ENABLED, primair voor het doel |
| Leadinfo/Radar | aanwezig als custom HTML |

Dus Clarity hoeft niet gekoppeld te worden, die staat er. Wat er wél mis is:

1. **Eén lead-trigger is dood.** Tag 17 (`generate_lead`) vuurt op een `gtm.elementUrl` die
   `/request/send` bevat. Het live formulier post naar `/custom-form/send`. Die trigger
   heeft dus nog nooit gevuurd. Niet fataal, want de trigger op formulier-id dekt `/offerte`
   al, maar het is wel precies het soort stille fout dat je hier niet wil hebben.
2. **De formulier-id's kloppen nu nog wél.** Ik heb het nagekeken: `form_018e5c1092a47207896e05675fea9324`
   staat op `/offerte` en `form_2c60f73e01c446da9fe6e7e55df9749a` op `/contact`, net als in de
   container. Maar een trigger die aan een Shopware-formulier-id hangt, breekt stil zodra dat
   CMS-blok ooit opnieuw wordt opgebouwd. Dat is een tijdbom onder je enige conversiemeting.
3. **Alles hangt aan toestemming.** De pagina zet Consent Mode v2 standaard op *denied* en
   leest `dtgsAllowGtmTracking=1` en `google-ads-enabled=1` uit cookies. De Clarity-tag heeft
   `consent: ['analytics_storage']`. Zonder akkoord op de cookiebanner is er geen
   Clarity-opname, geen GA4-cookie en geen Ads-conversie. Bij een centrale modal met
   verduisterde achtergrond (zie commit `8d0579b`) kan het acceptatiepercentage alles tussen
   40% en 90% zijn. Dat moet je weten voordat je één getal uit GA4 vertrouwt.
4. **Het hele formulier-submit-pad is nooit bewezen.** Of `gtm.formSubmit` daadwerkelijk
   vuurt, hangt ervan af of het Shopware-custom-form-blok een echte submit doet of via fetch
   verstuurt zonder submit-event. Dat is in tien minuten te testen en het is niet getest.

### Oorzaak 4: de uitstraling

Zie `DESIGN-AUDIT.md`, Fase 2 en 3. Echt probleem, verkeerde maand. Januari.

## 4. Het plan

Het is 27 oktober. Voor zakelijke kerstgeschenken met logo, met minimale afnames van
honderd tot honderdvijftig stuks en een drukproefronde erbij, sluit het besteluitje
ergens eind november. Reken op **vier tot vijf weken waarin de vraag er nog is**. Daarna
verkoop je januari-onboardingpakketten, wat een ander verhaal is. Alles hieronder is
daarop gesorteerd: wat binnen twee weken terugverdiend is, gaat voor.

Eigenaar: **(ik)** = ik kan dit in code of config doen, **(jij)** = Shopware-backend,
account-toegang of een besluit, **(samen)** = ik lever voor, jij plakt of beslist.

### Fase A, deze week, binnen 48 uur: eerst weten of we blind zijn

Zonder dit is al het andere gokken.

1. **(jij) Hoeveel aanvragen zijn er echt binnengekomen tussen 6 en 26 oktober?** Kijk in de
   mailbox en het CRM, niet in GA4. Dit getal splitst het plan in twee:
   - Zijn het er nul of één: de meting werkt vermoedelijk en de site converteert niet. Ga door
     met fase B en C.
   - Zijn het er vijf of meer: de meting is kapot en we hebben drie weken blind geadverteerd
     met handmatig bieden, terwijl we Smart Bidding hadden kunnen gebruiken. Dan is fase A.2
     prioriteit boven alles.
2. **(ik) Het formulierpad end-to-end testen.** Een echte testaanvraag op `/offerte`, met
   cookiebanner geaccepteerd, en dan controleren of `gtm.formSubmit` vuurt, of het
   `generate_lead`-event in GA4 realtime aankomt en of Ads het binnen 24 uur overneemt.
   Daarna hetzelfde zonder toestemming, zodat we weten wat we in dat geval kwijt zijn.
   *Dit vereist de Chrome-extensie, die nu niet reageerde. Zie beperkingen.*
3. **(ik) De dode trigger repareren**: tag 17 van `/request/send` naar `/custom-form/send`,
   of hem vervangen door een trigger op het formulier-`action`-attribuut, zodat hij niet meer
   aan een CMS-id hangt.
4. **(ik) Een tweede, onafhankelijke meting ernaast.** Een `generate_lead`-trigger op de
   bedankstap of op de zichtbaarheid van de succesmelding, zodat één gebroken formulier-id
   niet langer de hele Q4-meting uitzet. Faalt de een, dan meet de ander nog.
5. **(jij) Het acceptatiepercentage van de cookiebanner opzoeken** in GA4 of Clarity. Als dat
   onder de 60% ligt, is elk conversiepercentage dat we meten structureel te laag en moeten we
   dat in alle rapportage als correctiefactor meenemen.
6. **(samen) Uitsluitingen toevoegen**: de duidelijke consumententermen en prijsjagers uit de
   tabel in paragraaf 2. Kwartier werk, ongeveer € 20 per maand, en het houdt het
   zoektermenrapport leesbaar.

### Fase B, week 1, 28 oktober t/m 3 november: de pagina laten renderen

Dit is de duurste oorzaak en het snelste werk. Het verandert niets aan het ontwerp.

1. **(jij) Zet webp- of avif-conversie aan in Shopware** voor de thumbnailgeneratie, en laat
   de bestaande media opnieuw genereren. Dit is de enige stap die ik niet zelf kan doen en de
   grootste winst van het hele plan. Als Promidata-media buiten die pijplijn vallen, is dat
   het eerste wat je bij hen moet uitzoeken.
2. **(ik) `loading="lazy"` op alles onder de eerste schermhoogte** op `/` en
   `/alle-producten/`. Nu staat 180 van de 208 en 155 van de 179 afbeeldingen op eager.
   Doel: onder de 500 kB direct beeld op het eerste scherm, de grens die we in het
   showroomproject ook aanhouden.
3. **(ik) De zeven zwaarste bronbestanden opnieuw aanleveren** op een formaat dat past bij
   hoe ze getoond worden. De zwaarste nu: 595 kB, 513 kB, 365 kB, 358 kB, 328 kB, 320 kB.
   Die staan er in volle grootte op plekken waar 80 kB genoeg is.
4. **(ik) Meting voor en na** met PageSpeed op `/`, `/alle-producten/` en
   `/eindejaarsgeschenken`, mobiel en desktop, zodat we het effect zien en niet aannemen.
5. **(ik) Acht afbeeldingen op home gaven geen geldig antwoord op een HEAD-verzoek.** Uitzoeken
   of dat gebroken links zijn of een artefact van mijn meting.

Verwacht effect: lagere CPC en meer vertoningen voor hetzelfde budget, omdat
`post_click_quality_score` van ondergemiddeld naar gemiddeld kan. Op € 55 per dag is dat
grofweg € 300 tot € 500 extra bereik per maand zonder extra budget.

### Fase C, week 1 en 2, 28 oktober t/m 10 november: het aanvraagpad bouwen

Dit is het verschil tussen een catalogus en een shop waar iemand iets vraagt.

1. **(samen) Eén echte landingspagina voor "relatiegeschenken met logo"**, in plaats van
   `/alle-producten/`. Wat erop moet, in deze volgorde: de zoekvraag als H1, wat het kost per
   stuk bij 100 stuks inclusief logo, vanaf welk aantal het kan, hoe lang het duurt, en één
   knop. Een twintigtal producten, geen 179. `/eindejaarsgeschenken` is technisch al de beste
   pagina die we hebben en kan het model zijn.
2. **(samen) De drempelverlager die niemand in deze branche heeft: jouw showroom.** Je hebt al
   een generator voor deelbare voorstelpagina's met het logo van de klant erop. De hele branche
   mailt een mockup-PDF. Zet dat vóór de offerte in plaats van erachter: *"Stuur je logo, dan
   krijg je binnen één werkdag een eigen voorstelpagina met jouw logo op de producten."* Dat is
   een concreet en vooral asymmetrisch aanbod. Het vraagt geen beslissing en geen budget van de
   bezoeker, en het is precies waar `showroom/` voor gebouwd is. Dit is naar mijn inschatting
   het sterkste idee in dit document.
3. **(ik) Een aanvraagknop op de productpagina die het formulier vooraf invult** met product,
   artikelnummer en gewenst aantal. Nu moet iemand zelf uittypen wat hij wil, in een leeg
   tekstveld, op een andere pagina.
4. **(samen) Minimale afname als zichtbaar kenmerk**, niet als zin in leverancierstekst. Als
   badge op de tegel en als filter. Dit is ook een SEO- en relevantiewinst, want het is precies
   waar mensen op zoeken.
5. **(jij) De annuleringsclausule uit de productomschrijvingen halen.** "Bij annulering blijven
   alle prototype- en technische kosten verschuldigd" hoort in de voorwaarden, niet in de
   eerste alinea die een advertentiebezoeker leest. Zie ook
   `promidata-productomschrijving-prompt.md`, dat hier al over gaat.
6. **(ik) Een `<h1>` op `/alle-producten/`.** Er staat er nu nul.
7. **(samen) Prijsweergave herschrijven**: "Van € 3,15" wordt "vanaf € 3,15 per stuk, excl.
   btw, vanaf 100 stuks met logo". Zelfde getal, bruikbaar antwoord.
8. **(samen) Kerstdeadline zichtbaar op elke commerciële pagina.** "Besteld voor
   [datum], geleverd voor kerst." Dat is in november de hardst werkende regel op de site en hij
   staat er niet. Jij moet de datum bepalen, want die hangt aan drukproef en levertijd.

### Fase D, week 3 en 4, 11 t/m 24 november: bieden op echt signaal

Kan pas als fase A een werkende meting heeft opgeleverd.

1. **(ik) Micro-conversies in GA4** als tussensignaal, zolang er te weinig aanvragen zijn om
   op te bieden: drukproef- of monsteraanvraag, telefoonklik, mailklik, 60 seconden plus
   scrolldiepte op een productpagina.
2. **(ik) Van handmatig CPC naar Maximaliseer conversies met een doel-CPA**, zodra er dertig
   gemeten aanvragen in dertig dagen zijn. Niet eerder, want daaronder biedt het algoritme op
   ruis. Haalt de teller dat niet, dan blijft handmatig bieden met de huidige
   zoekwoordstructuur het eerlijkste.
3. **(ik) De drie campagnes opnieuw indelen** op wat het zoektermenrapport laat zien in plaats
   van op thema. De categorie "onbepaald" uit paragraaf 2 verdient een eigen advertentiegroep
   met zakelijke copy, zodat de particulier zelf afhaakt vóór de klik in plaats van erna.
4. **(ik) Twee extra advertenties per advertentiegroep.** Nu staat er één responsieve
   advertentie per groep, allemaal op advertentiesterkte "Gemiddeld". Er valt niets te
   vergelijken.
5. **(jij) De zes lege advertentiegroepen** (Paasgeschenk, Thuiswerkpakket, Zomerpakketten, en
   Duurzaam paasgeschenk met 8 impressies) pauzeren tot hun seizoen. Ze doen nu niets behalve
   het account onoverzichtelijk maken.
6. **(samen) Een Clarity-sessie-review van tien afhakers** op de nieuwe landingspagina, met
   jouw interpretatie erbij. Dit is het moment waarop jouw input uit Clarity het meest waard is,
   niet eerder: op de huidige pagina zie je alleen mensen wachten op beeld.

### Niet nu

- `DESIGN-AUDIT.md` Fase 3 en 4, de merkherziening. Januari.
- Het `!important`-opruimwerk en de tokenlaag. Januari, en het hoort bij het bovenstaande.
- Performance Max of Shopping. Niet zonder werkende conversiemeting en niet in vier weken.
- De `@main`-verwijzing naar jsdelivr in de theme-head. Dat is een echt risico (een
  onvastgezette versie van je eigen CSS en JS via een externe CDN in het kritieke pad, en de
  cacheklachten die in `plan-van-aanpak-optimalisatie.md` terugkomen zijn hier goed
  verklaarbaar), maar het raakt geen aanvragen deze maand. Zet het op de lijst voor december.

## 5. Waar we op sturen

Eén getal, en het is bewust niet "bezoekers":

**Gemeten aanvraagpercentage op advertentieverkeer, per week.** Nu 0 van 662 over 21 dagen.
Bij een normaal werkende B2B-site in deze markt hoort 1 tot 2% te kunnen. Op het huidige
tempo van ongeveer 220 klikken per week betekent dat:

| Aanvraagpercentage | Aanvragen per week | Kosten per aanvraag bij € 1,34 CPC |
|---|---|---|
| 0,5% | 1,1 | € 267 |
| 1,0% | 2,2 | € 134 |
| 2,0% | 4,4 | € 67 |
| 3,0% | 6,6 | € 45 |

Doel voor 15 november: **minstens 1,5% gemeten, en bewezen dat de meting klopt.** Wordt dat
gehaald, dan mag het budget omhoog en is er een gegrond verhaal voor december. Wordt het niet
gehaald terwijl de meting wel bewezen werkt, dan is de conclusie dat de site in deze vorm
geen zakelijke aanvragen trekt, en dan is dat een onderwerp voor januari en niet voor meer
advertentiebudget.

## 6. Wat ik niet heb kunnen vaststellen

- **Hoeveel aanvragen er werkelijk zijn binnengekomen.** Dat staat in je mailbox en je CRM, en
  daar kom ik niet. Zonder dat getal kan ik nul conversies niet onderscheiden van een gebroken
  meting. Dit is de belangrijkste openstaande vraag van dit hele document.
- **Of `gtm.formSubmit` echt vuurt bij een echte aanvraag.** De Chrome-extensie reageerde niet
  in deze sessie, dus ik heb geen live submit kunnen doen. Alles wat ik over de meetopzet zeg,
  komt uit de publieke GTM-container en uit de HTML van de live pagina's, niet uit een
  waargenomen conversie.
- **Geen GA4-cijfers.** Er is in deze sessie geen GA4-koppeling, dus ik heb geen bouncepercentage,
  geen sessieduur, geen uitstappunten en geen acceptatiepercentage van de cookiebanner. Alles over
  gedrag op de site in dit document is afgeleid uit paginagewicht en opbouw, niet uit gedragsdata.
  Hetzelfde geldt voor Clarity: ik weet dat de tag er staat, ik heb geen opname gezien.
- **De LCP van 35,5 seconden is van 28 augustus, niet van nu.** Ik heb paginagewicht en
  beeldformaten opnieuw gemeten en die zijn onveranderd, maar ik heb geen nieuwe
  Lighthouse-meting gedraaid. Het getal is dus onderbouwd als "oorzaak nog aanwezig", niet als
  "effect opnieuw bevestigd".
- **Het zoektermenrapport dekt € 449 van de € 884.** Google houdt termen met laag volume achter.
  De verdeling zakelijk-tegenover-consument is een ondergrens op de helft van het budget, geen
  volledige telling.
- **Geen concurrentievergelijking.** Je vroeg hoe we ons verhouden tot goedlopende shops. Wat
  hierboven staat over prijsstaffels, minimale afname en levertijd is gebaseerd op wat deze
  markt standaard toont en op wat de zoektermen vragen, niet op een gemeten vergelijking met
  specifieke concurrenten. Als je dat wil, is het een eigen opdracht van een halve dag.

---

## 7. Bijgewerkt op 27 oktober, na jouw antwoorden

### 7.1 Nul aanvragen: wat dat statistisch betekent

Je hebt niets binnengekregen. Dat haalt de hele "misschien is de meting stuk"-twijfel van
tafel als verklaring voor het resultaat, en het maakt het beeld harder dan het was.

Nul op 662 klikken is geen pech. Met de vuistregel van drie ligt het werkelijke
aanvraagpercentage met redelijke zekerheid **onder de 0,45%** (3 gedeeld door 662). De
ondergrens van wat een werkende zakelijke aanvraagsite in deze markt doet is ongeveer 1%.
Je zit dus niet net onder de norm, je zit onder een derde van de ondergrens. Dat is een
kapotte trechter, geen tegenvallende maand.

De meting moet alsnog getest worden, maar om een andere reden: niet om de nul te verklaren,
wel omdat we vanaf de eerste aanvraag moeten kunnen zien dát het werkt. Dat zakt van
"eerste prioriteit" naar "deze week af".

### 7.2 Het beeldprobleem is niet webp. Het zijn PNG's.

Dit is de belangrijkste nieuwe bevinding en hij maakt Cloudflare voorlopig onnodig.

Ik heb alle afbeeldingen die een telefoon van je drie advertentiepagina's binnenhaalt
opgehaald en op content-type geteld:

| Pagina | PNG | PNG-gewicht | JPEG | JPEG-gewicht | PNG-aandeel |
|---|---|---|---|---|---|
| / | 45 | 5,34 MB | 64 | 2,21 MB | **71%** |
| /eindejaarsgeschenken | 17 | 3,22 MB | 8 | 0,56 MB | **85%** |
| /alle-producten/ | 24 | 4,13 MB | 64 | 1,83 MB | **69%** |

De tien zwaarste afbeeldingen op de homepage zijn **alle tien PNG**: 595, 513, 365, 358,
328, 320, 316, 274, 250 en 225 kB. Het zijn bovendien gewoon correct verkleinde Shopware-
thumbnails van 800 bij 800 pixels. Shopware doet dus niets verkeerd: het bewaart het
formaat van het bronbestand, en het bronbestand is een foto die als PNG is geüpload.

Een foto van 800 bij 800 is als PNG 300 tot 600 kB en als JPEG op kwaliteit 82 ongeveer
55 tot 75 kB. Dat is een factor zes tot tien, vóórdat er ook maar iemand over webp begint.
Over de drie pagina's: **12,69 MB aan PNG wordt ongeveer 5,46 MB als JPEG, een besparing
van zo'n 7,2 MB.** (Schatting op 65 kB per 800x800 JPEG; de echte uitkomst hangt per foto
af, dus dit moet gemeten worden en niet aangenomen.)

Dit is geen techniekklus en geen plugin. Het is: de betreffende bronbestanden opnieuw
opslaan als JPEG en opnieuw uploaden in de Shopware-mediabibliotheek. Dat kan jij, vandaag,
zonder dat er iets aan de site verandert.

Tweede gratis winst, en die kan ik doen: in `blokken-def/` staan **190 img-tags, waarvan
0 met `loading="lazy"`, 0 met `srcset`, en 167 die naar `/media/` wijzen** (het onbewerkte
origineel) in plaats van naar een thumbnail. Dat is precies waarom er op home 180 van de
208 afbeeldingen direct binnenkomen. Ik pas de blokken in de repo aan, jij plakt ze opnieuw.
Let op: lazy loading hoort **niet** op het eerste schermbeeld, want dan verpest je de LCP
juist. De hero blijft eager met `fetchpriority="high"`.

### 7.3 Cloudflare: ja, maar niet nu en niet als eerste

Je zit er nu niet achter. Gemeten vandaag: `server: Apache`, nameservers `ns.zxcs.nl`,
A-record direct naar 80.70.184.175, geen enkele `cf-`-header. Dus dit is geen schakelaar
omzetten maar je hele live shop achter een proxy hangen.

Wat het zou opleveren en kosten:

- **Polish** is de functie die je wil. Die comprimeert en levert webp aan browsers die het
  ondersteunen. Het zit op het **Pro-plan**, ongeveer $25 per maand. Het converteert alleen
  het formaat; het verkleint geen afmetingen, dus het vervangt de thumbnails niet.
- Of Polish op dit moment ook avif levert, en onder welk plan, moet ik verifiëren voordat je
  erop rekent. Ik heb dat niet gecontroleerd.
- Risico: een proxy vóór een live Shopware-shop raakt checkout, sessies en de admin. SSL moet
  op Full (strict). Dat is bekend werk, maar het is geen ingreep die je halverwege november
  tussendoor doet terwijl het kerstseizoen loopt.

**Advies:** doe eerst 7.2. Dat is gratis, het is groter, en het ligt bij ons. Zet Cloudflare
in december op de rol als structurele oplossing voor daarna. Je wil geen $25 per maand gaan
betalen om PNG's sneller te versturen die er nooit hadden moeten staan.

### 7.4 De kalender, met begin december als harde grens

Verkoopvenster: **27 oktober tot en met 5 december, vijf en een halve week.**

| Week | Datum | Wat eruit moet |
|---|---|---|
| 1 | 28 okt t/m 3 nov | PNG's naar JPEG **(jij)**. Lazy, srcset en thumbnail-URL's in de CMS-blokken **(ik)**. Formulierpad testen **(ik)**. Besteldeadline op elke commerciële pagina **(samen)**. Meting voor en na met PageSpeed **(ik)**. |
| 2 | 4 t/m 10 nov | Eén echte landingspagina voor "relatiegeschenken met logo" **(samen)**. Aanvraagknop op de productpagina die het formulier vooraf invult **(ik)**. Het showroom-aanbod als drempelverlager **(samen)**. Prijsweergave en minimale afname zichtbaar **(samen)**. |
| 3 | 11 t/m 17 nov | Eerste duiding op GA4 en Clarity **(samen)**. Bijstellen op wat we zien, niet op wat we denken. Advertentieteksten verdubbelen **(ik)**. |
| 4 en 5 | 18 nov t/m 5 dec | Budget naar het pad dat aanvragen oplevert. Urgentie opvoeren richting de deadline **(samen)**. Geen nieuwe bouwklussen meer. |
| na 5 dec | | Januari-onboardingpakketten, Cloudflare, en `DESIGN-AUDIT.md` Fase 3. |

De besteldeadline op de site is in week 1 het hardst werkende tekstelement dat je hebt en
hij staat er nu niet. Ik heb van jou de exacte datum nodig, want die hangt aan drukproef en
levertijd. "Begin december" is geen regel die je op een pagina zet.

### 7.5 GA4 koppelen

Er is in deze sessie **geen GA4-connector beschikbaar**, alleen een Google Ads-koppeling.
Ik kan dus nu geen enkel GA4-cijfer ophalen. Twee routes:

**Route A, mijn advies: service account op de GA4 Data API.** Gratis, herbruikbaar, en het
past bij de afspraak dat tellen in code hoort en niet in een prompt. Wat jij moet doen,
ongeveer een kwartier:

1. Google Cloud-project aanmaken of een bestaand pakken, en de **Google Analytics Data API**
   aanzetten.
2. Een service account maken, een JSON-sleutel downloaden.
3. Het e-mailadres van dat service account als **Viewer** toevoegen op de GA4-property.
4. Mij het **property-ID** geven (het nummer, niet de `G-`-code) en de sleutel ergens buiten
   de repo zetten. Dat bestand hoort niet in git.

Dan schrijf ik een script in de repo dat de rapporten uit 7.7 ophaalt, zodat elke volgende
analyse een commando is en geen handwerk.

**Route B:** in een interactieve sessie de Supermetrics-connector autoriseren. Die kan GA4,
maar staat nu op niet-geautoriseerd en is een betaald product. Alleen zinvol als je het al
hebt.

### 7.6 Clarity: de koppeling staat al, de klok tikt wel

Twee dingen die je waarschijnlijk niet verwacht.

**De GA4-koppeling bestaat al.** In de GTM-container geeft de Clarity-tag de GA4
`session_id` en `client_id` mee (`vtp_sessionId` en `vtp_userId` staan op de GA4-variabelen).
De kruisverwijzing tussen een GA4-sessie en een Clarity-opname is dus al gelegd. Daar hoeft
niets meer te gebeuren.

**Je hebt wel gelijk dat koppelingen vooruit werken en niet terug**, en er zit een tweede
klok op: Clarity bewaart opnames ongeveer dertig dagen. De sessies van begin oktober,
precies de periode waarover dit hele document gaat, zijn dus deels al weg of verdwijnen
binnenkort. **Exporteren is daarom urgent, niet optioneel.**

Wat ik van je wil hebben, in `docs/clarity-2026-10/`, met de URL in de bestandsnaam:

1. **Heatmaps, mobiel**, scroll én click, voor `/`, `/alle-producten/` en
   `/eindejaarsgeschenken`. Dit is de belangrijkste export: scrolldiepte op mobiel vertelt
   direct of mensen ooit voorbij de hero komen.
2. **Vijf tot tien opnames van afhakers** met bron google of cpc, mobiel. Niet de langste
   sessies, juist de korte. Als je erbij kan zetten wat je zelf opvalt, is dat meer waard dan
   de opname zelf.
3. **De metrics per URL** voor oktober: sessies, scrolldiepte, rage clicks, dead clicks,
   quickbacks.

Liever dan handmatig, voor de toekomst: Clarity heeft een **Data Export API** met een token
uit Settings. Daarmee haal ik die metrics automatisch op. Beperking die je moet weten: die
API geeft maar een korte recente periode per aanroep en heeft een daglimiet, dus hij bouwt
geschiedenis **vooruit** op en haalt oktober niet terug. Ik moet de precieze grenzen
verifiëren bij de eerste aanroep, dus reken er niet op voordat ik het heb gedraaid. Doe
daarom beide: nu handmatig exporteren voor oktober, en een token voor vanaf november.

### 7.7 Wat we uit GA4 en Clarity willen weten, en waarom

Je zei het goed: op basis van GA4 kunnen we beter duiden wat er aan ontwerp en content moet
gebeuren. Maar dan moeten de vragen vóór het dashboard komen, anders krijg je een dashboard.
Dit is wat ik wil weten en welk besluit eraan hangt:

| Vraag | Waar | Welk besluit het stuurt |
|---|---|---|
| Hoeveel procent van de sessies zien we eigenlijk? | GA4 tegenover Ads-klikken en het cookie-akkoord | Of elk ander percentage hieronder vertrouwd mag worden. Dit eerst, altijd. |
| Betrokkenheidspercentage en betrokkenheidstijd per landingspagina, apparaat apart | GA4 | Of de pagina gelezen wordt of alleen geopend. Lage tijd op mobiel bij hoge op desktop is het snelheidsprobleem. |
| Hoe diep scrollt men op mobiel | Clarity-heatmap | Welk deel van de pagina überhaupt bestaat voor de bezoeker. Alles onder dat punt is nu dode investering. |
| Welke tweede pagina kiest men na de landing | GA4 pad-verkenning | Werkt de catalogus als doorstroom, of haakt men af op de landing zelf. |
| Wat typen mensen in je eigen zoekbalk | GA4 site search | De goedkoopste contentbron die er is: je doelgroep zegt letterlijk wat ze niet vindt. Dit bepaalt welke pagina's we in week 2 maken. |
| Rage clicks en dead clicks | Clarity | Waar mensen op iets klikken dat geen knop is. Bij een site met 992 keer `!important` is dat een reële kans. |
| Nieuwe tegenover terugkerende bezoekers uit Ads | GA4 | Zakelijke geschenkinkoop is bijna nooit één sessie. Komt niemand terug, dan is remarketing het ontbrekende stuk en niet de landingspagina. |
| Uitstappagina vlak voor `/offerte` | GA4 | Of mensen het formulier zien en niet invullen, of het nooit bereiken. Dat zijn twee verschillende problemen met twee verschillende oplossingen. |

### 7.8 Wat hierdoor verandert in de eerdere paragrafen

- **Fase A.1 is beantwoord.** Nul aanvragen. De rest van Fase A blijft staan, maar punt 2
  (formulierpad testen) schuift van "binnen 48 uur" naar "deze week".
- **Fase B.1 vervalt** in de vorm waarin het er stond ("zet webp aan in Shopware"). Dat kan
  niet. In plaats daarvan: PNG naar JPEG op de bronbestanden, plus lazy, srcset en
  thumbnail-URL's in de CMS-blokken. Goedkoper, groter, en het ligt bij ons.
- **Paragraaf 6 blijft gelden**, met één schrapping: "hoeveel aanvragen er werkelijk zijn
  binnengekomen" is nu bekend. De overige beperkingen staan nog allemaal overeind, met name
  dat er nog geen enkel gedragscijfer uit GA4 of Clarity in dit document zit.
- **Nieuw voorbehoud:** de besparing van 7,2 MB in 7.2 is een schatting op 65 kB per foto.
  Pas nadat de eerste vijf bestanden omgezet zijn, weten we de echte factor. Als die veel
  lager uitvalt, komt Cloudflare Polish eerder in beeld dan december.

---

## 8. Correctie op 7.2 en 7.3, gemeten op 27 oktober

**Wat ik in 7.2 schreef is deels onjuist en moet rechtgezet worden.** Ik stelde dat de
foto's naar JPEG kunnen en dat webp daarmee onnodig is. Dat is verkeerd. Ik heb de PNG's
gedownload en per bestand nagekeken of het alfakanaal echt gebruikt wordt (minimale
alfawaarde onder 255), en ze opnieuw gecodeerd om de werkelijke uitkomst te meten in plaats
van te schatten.

**De productfoto's hebben echte transparantie.** Het zijn uitgesneden productopnames uit de
Promidata-feed. Daarom zijn het PNG's. Platslaan naar JPEG zet er een vlak achter.

59 PNG's over de drie advertentiepagina's, gemeten:

| | omvang |
|---|---|
| Nu | 9,02 MB |
| Als JPEG q82, met behoud van transparantie waar die nodig is | 8,15 MB (**10% winst**) |
| Als webp q82, met alfakanaal | **0,86 MB (91% winst)** |

Dus webp is hier niet een optimalisatie maar het enige middel dat werkt, omdat webp alfa
ondersteunt en JPEG niet. Jouw vraag over Cloudflare was dus de juiste vraag en mijn
antwoord erop was te snel.

Vier bestanden hebben geen enkele transparantie en kunnen wel gewoon naar JPEG:
999 kB wordt 109 kB. Die staan omgezet klaar in
`~/Documents/beeld-omzetting-2026-10/`, met `omzetlijst.csv` ernaast waarin per bestand de
bron-URL, de sectie, de alt-tekst en de gemeten winst staan. Allemaal op
`/eindejaarsgeschenken`.

### Waar het gewicht werkelijk zit

Dit is belangrijker dan de formaatvraag, want het is gratis en het ligt bij ons:

| Groep | n | Nu | Waarvan direct (niet lazy) | Als webp |
|---|---|---|---|---|
| Productfoto in slider of grid | 17 | 5.679 kB | 0 kB | 514 kB |
| **Kleurvarianten in de productslider** | 15 | 3.355 kB | **3.355 kB** | 265 kB |
| Klantlogo-wall | 23 | 170 kB | 170 kB | 88 kB |
| Betaal- en verzendicoon | 4 | 29 kB | 29 kB | 13 kB |

**Het hele directe beeldgewicht van de homepage bestaat vrijwel volledig uit
kleurvarianten in de productslider.** Vijftien bestanden, nul met lazy. Tien ervan zijn
kleuren van één Samsonite-koffer: Lavender 365 kB, Sage 358 kB, Fog Blue 320 kB,
Charcoal/Red 316 kB, en zo verder. Niemand ziet die afbeeldingen, want ze horen bij
swatches waar je eerst op moet klikken. Ze komen wel allemaal direct binnen, op een
telefoon, bij een bezoeker die net € 1,34 heeft gekost.

**Dat is prioriteit één en het kost niets.** Het is geen mediaklus en geen formaatkwestie
maar een instelling of een template-aanpassing op de productslider: variant-afbeeldingen
niet meeladen, of ze op lazy zetten. De productfoto's zelf staan al wel op lazy, dus daar
is het werk al goed gedaan.

### Cloudflare Polish is niet gratis

Nagekeken op 27 oktober. Polish zit volgens Cloudflares eigen beschikbaarheidstabel
**niet op het Free-plan**, wel op Pro, Business en Enterprise. Pro is ongeveer $25 per
maand. Twee dingen om te weten voordat je erop rekent:

- Polish **slaat webp over** wanneer de conversie het bestand groter zou maken of de
  kwaliteit zou schaden. Bij een PNG-foto van 300 tot 600 kB is dat niet het geval, dus
  voor jouw situatie zou het wel werken, maar het is geen garantie per bestand.
- Of Polish ook avif levert en op welk plan heb ik niet vastgesteld.

Ik heb ook gezocht naar een gratis route binnen Shopware en die niet gevonden: de Frosh
WebP-plugin is een Shopware 5-plugin en staat op Packagist als verlaten, laatste versie
1.1.8 uit januari 2023. De Shopware 6-opvolger (Frosh ThumbnailProcessor) maakt zelf geen
webp maar levert thumbnails door van een externe dienst. Eén zoekronde, dus geen volledig
beeld: in de Shopware Store staan commerciële webp-plugins, en een eenmalig bedrag van
€50 tot €150 is op jaarbasis goedkoper dan $25 per maand. Dat is het uitzoeken waard
voordat je naar Cloudflare verhuist.

### Wat dit betekent voor de volgorde

1. **Kleurvarianten niet meer eager laden.** Gratis, haalt 3,28 MB van het directe
   beeldgewicht van de homepage. **(jij, Shopware-instelling of template)**
2. **Lazy, srcset en thumbnail-URL's in de CMS-blokken.** Gratis. **(ik)**
3. **De vier alfavrije bestanden vervangen** door de JPEG's die klaarstaan. 890 kB.
   **(jij)**
4. **Dan pas de formaatvraag.** Eerst uitzoeken of er een eenmalig betaalde
   Shopware-webp-plugin is; valt dat af, dan Cloudflare Pro. Pas na stap 1 tot 3, want
   dan weet je ook pas hoeveel het nog waard is. **(samen)**

Stap 1 tot 3 zijn samen ruim 4 MB op de homepage zonder dat er iets aan het ontwerp of aan
het platform verandert, en zonder abonnement.

### Nog een voorbehoud

De 91% winst van webp is gemeten op mijn eigen hercodering met Pillow op kwaliteit 82. Wat
een plugin of Polish er in werkelijkheid van maakt, kan afwijken. En de 9,02 MB gaat over
drie pagina's; voor de rest van de site is het niet gemeten.

---

## 9. Uitgevoerd op 27 oktober

### CMS-blokken: lazy loading

135 van de 190 afbeeldingen in `blokken-def/` staan nu op `loading="lazy"` met
`decoding="async"`. 55 blijven eager: de eerste afbeelding van elk blok, plus alle
hero-afbeeldingen. Twaalf hero-afbeeldingen hebben `fetchpriority="high"` gekregen.

Tussenstap die misging en is hersteld: de eerste ronde zette ook de hero's van de
thema-pagina's op lazy, omdat de eerste afbeelding in die bestanden een klantlogo in de
logostrip is en niet de hero zelf. Dat zou de LCP juist verslechteren op onder meer
`/eindejaarsgeschenken`, de pagina met 238 advertentieklikken. Gecorrigeerd op klasse
in plaats van op volgorde.

**De bestanden zijn gewijzigd maar niet gecommit, en staan nog niet live.** Ze moeten
opnieuw in Shopware geplakt worden.

### Dode privacylink

`contactform-voorzetje.html` wees naar `/privacy` (404). Nu `/algemeen/privacy-beleid/`,
gelijk aan de footer.

### Thumbnail-herschrijving: onderzocht en laten vallen

Ik stelde voor om de 167 `/media/`-verwijzingen om te schrijven naar thumbnails. Gemeten
over de 108 unieke bestanden: 39 hebben een 800x800-thumbnail, en slechts **6 leveren meer
dan 10 kB op, samen 374 kB** van de 4,55 MB. De blokafbeeldingen zijn al redelijk op maat
(gemiddeld 43 kB). Niet de moeite, en het risico dat een ontbrekende thumbnail een
afbeelding breekt is groter dan de winst. Vervalt.

### Twee meetfouten van mezelf, voor de goede orde

- Ik meldde eerder "8 bestanden gaven geen geldig antwoord" op de homepage en later
  "6 kapotte afbeeldingen in de blokken". **Beide waren onjuist**, veroorzaakt door
  dubbele URL-codering in mijn eigen meetscript: paden met `%20` werden nog een keer
  gecodeerd naar `%2520`. Opnieuw gemeten met selectieve codering: **0 van de 108
  blokafbeeldingen is kapot.**
- Het totale gewicht van de blokafbeeldingen is daardoor ook bijgesteld: 4,55 MB over
  108 unieke bestanden.

### Nog niet gedaan: width en height

`width` en `height` op de afbeeldingen zou de CLS verbeteren, maar of dat veilig is hangt
af van wat de CSS met die afbeeldingen doet. Dat wil ik in de browser zien voordat ik het
doorvoer, en de browserkoppeling werkte vandaag niet. Blijft staan.

### GA4

Property **551909322**. Opzet staat in `bin/ga4-setup.md`, het script in `bin/ga4.py` met
`bin/ga4.sh` als wrapper. Bewust op een eigen identiteit (`info@rootedgoods.eu`) in een
eigen configmap (`~/.config/gcloud-rootedgoods`) en een eigen Cloud-project
(`rootedgoods-analytics`), omdat Rooted Goods een eigen entiteit wordt. Deelt dus geen
credentialsbestand met Bambook.

Wacht op Ward: de eenmalige opzet uit `bin/ga4-setup.md`.

### Besluit van Ward: geen besteldatum

De kerstdeadline komt niet op de site. Besluit van Ward, 27 oktober. Daarmee vervalt dat
punt uit 7.4 en uit de weekplanning.

### Ads: nu ook budgetbeperkt

Het account meldt op 27 oktober "Campagne wordt beperkt door het budget" op
NL-Search-AlwaysOn, en een waarschuwing voor NL-Search-Thema. Over 6 t/m 26 oktober was het
verlies nog vrijwel volledig aan positie. Op ongeveer €55 per dag loopt het nu tegen beide
aan. Stand 1 t/m 27 oktober: 702 klikken, 6.130 vertoningen, €932, CPC €1,33.

---

## 10. GA4 is aangesloten, en dit zegt het. 27 oktober

Property 551909322, **6 t/m 27 oktober (22 dagen)**, uitgelezen met `bin/ga4.sh`.

### 10.1 De trechter, voor het eerst gemeten

| Stap | Aantal |
|---|---|
| Advertentieklikken (Google Ads, 1 t/m 27 okt) | **702** |
| Sessies die GA4 überhaupt ziet, alle bronnen samen | **211** |
| Daarvan toegeschreven aan betaald zoekverkeer | **37** |
| Paginaweergaven op `/offerte` | **2** |
| Formulierinzendingen op `/offerte` | **0** |
| Aanvragen | **0** |

**`/offerte` kreeg twee weergaven in 22 dagen.** Niet twee procent, twee stuks. `/contact`
kreeg er acht, dus vier keer zo veel. De aanvraagpagina is in de praktijk onvindbaar.

Dat beantwoordt de vraag uit paragraaf 7.7 definitief: mensen bereiken het formulier niet.
Het is dus niet de copy op `/offerte`, niet de veldenlijst en niet de drempel van het
formulier zelf. Er is geen pad erheen.

### 10.2 We meten ongeveer één op de twintig advertentieklikken

37 sessies uit betaald zoekverkeer tegenover 702 klikken is **5,3%**. Zelfs als je álle
211 GA4-sessies aan advertenties zou toeschrijven, wat niet klopt, blijft het 30%.

Ter vergelijking, dezelfde periode:

| Bron | Sessies | Betrokken sessies |
|---|---|---|
| (direct) | 155 | 117 |
| google / cpc | 37 | 21 |
| google / organic | 17 | 7 |
| (not set) | 2 | 0 |

Direct is vier keer zo groot als betaald, op een site met vrijwel geen merkbekendheid: de
branded campagne haalde de hele maand **5 vertoningen**. Zulk direct verkeer is bijna nooit
echt direct.

**Mijn beste verklaring, en het is een hypothese:** de homepage heeft een LCP van 30,9
seconden op mobiel (gemeten 27 oktober). Bezoekers vertrekken voordat de pagina staat, en
dus ook voordat ze de cookiebanner beantwoorden. Zonder toestemming vuurt de Google-tag
niet. Traagheid kost ons dus niet alleen de bezoeker maar ook de meting van die bezoeker.
Dat verklaart waarom juist betaald verkeer, dat koud binnenkomt, zo veel slechter gemeten
wordt dan direct verkeer, dat uit mensen bestaat die de site al kennen en blijven wachten.

Dit moet nog bevestigd worden met het acceptatiepercentage van de banner. Dat kan ik niet
uit de Data API halen.

### 10.3 `generate_lead` ontbreekt, maar niet omdat de tag stuk is

De events in GA4 over 22 dagen:

| Event | Aantal | Gebruikers |
|---|---|---|
| page_view | 622 | 168 |
| user_engagement | 481 | 148 |
| session_start | 209 | 167 |
| first_visit | 161 | 161 |
| scroll | 115 | 74 |
| form_start | 45 | 21 |
| view_search_results | 32 | 15 |
| form_submit | 14 | 5 |

`generate_lead` en `contact` komen niet voor. Ik schreef in 7.1 dat dat zou betekenen dat
de meetketen stuk is. **Dat was te stellig.** De veertien `form_submit`-events (dat is
GA4's eigen enhanced measurement, niet onze GTM-tag) staan op `/search` (5), `/` (4) en
losse productpagina's. **Geen enkele op `/offerte`.** Er is dus niets gebeurd dat
`generate_lead` had moeten laten vuren.

De juiste conclusie: de keten is **onbewezen**, niet aantoonbaar stuk. Eén van de drie
triggers is wel zeker dood (die op `/request/send`, zie 7.6), maar de trigger op
formulier-id is simpelweg nooit aan de beurt geweest. Dat testen blijft nodig, maar het is
geen verklaring voor nul aanvragen.

### 10.4 Wat mensen in de zoekbalk typen

32 zoekopdrachten. De termen:

> paraplu, kerstbal, kersthanger, mepal lunchpot, sleutelhangers, sokken, TapOut, bidon,
> fles, gieter, kaas, king pepermunt, koffie, koffiebeker, kracht, laptop, luchtverfrisser,
> lunchpot, rolmaat, schaaf, stressbal, tablet, trui, waterfles

Allemaal **producten**. Geen enkele keer een thema, een gelegenheid of "relatiegeschenk met
logo". Mensen komen binnen met een artikel in hun hoofd en zoeken daarop. De site leidt met
thema's (eindejaar, onboarding, merchandise) en met een catalogus van 179 tegels.

Dat is een concrete aanwijzing voor wat er in week 2 moet gebeuren, en het is de goedkoopste
die we hebben: het komt van de bezoekers zelf. Let ook op de merknamen (Mepal, TapOut) en op
`kerstbal` en `kersthanger`, die we niet voeren.

### 10.5 Wat dit verandert aan het plan

1. **Het aanvraagpad is de hoofdoorzaak, niet de landingspagina-copy.** Twee weergaven op
   `/offerte` bij 702 klikken. Fase C punt 3 (aanvraagknop op de productpagina die het
   formulier vooraf invult) schuift naar de eerste plaats van de hele lijst. Mensen zijn wél
   op productpagina's, daar begonnen zelfs 21 mensen aan een formulier.
2. **Snelheid is niet alleen een conversieprobleem maar ook een meetprobleem.** Dat maakt
   Fase B harder: zolang we 5% meten kunnen we niets aantonen en kan Smart Bidding nooit
   werken.
3. **Zoektermen uit de eigen zoekbalk sturen de content**, niet onze aanname over thema's.
4. De `form_start`-events staan verspreid over tientallen productpagina's. Uitzoeken wat dat
   formulier is (mandje, aantal, zoekbalk) is een kwartier werk en zegt direct iets over wat
   mensen daar proberen te doen.

### 10.6 Hoe het is aangesloten

Via impersonatie, want Google blokkeert sinds kort dat gcloud's eigen client-ID de scope
`analytics.readonly` aanvraagt. Service account `ga4-lezer@rootedgoods-analytics.iam.gserviceaccount.com`,
zonder sleutel, met `info@rootedgoods.eu` als Token Creator. Volledig gescheiden van
Bambook: eigen organisatie, eigen project, eigen configmap. Zie `bin/ga4-setup.md`.
