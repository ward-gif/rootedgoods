# Openstaande vragen en verzoeken aan Promidata

> Verzamellijst, bedoeld om in één mail te versturen in plaats van druppelsgewijs.
> Elke wijziging kost geld, dus alles hier draagt zijn reden en zijn gemeten effect.
> Aangemaakt 28 oktober 2026. Status: **nog niet verstuurd.**

## Hoe we dit aanpakken

CSS en JavaScript laden we extern via jsDelivr (`rootedgoods.css` en
`rootedgoods.js` uit de GitHub-repo), dus die staan niet in Shopware en kunnen we zelf
aanpassen. Alles hieronder zit wél in Shopware of op de server, en kan dus alleen via
Promidata.

Afweging per punt: wat kost het, wat levert het, en moet het permanent zijn.

---

## A. Server en uitlevering

### A1. Brotli-compressie aanzetten

**Wat:** op de webserver staat alleen gzip. Ook als een browser om brotli vraagt, komt
er gzip terug. Gemeten op `all.css` en `all.js` met `Accept-Encoding: br,gzip`.

**Wat het oplevert:** brotli scheelt doorgaans 15 tot 20% op tekstbestanden. Over de
lijn gaat nu per eerste bezoek 190,6 kB CSS en 182,4 kB JS, dus grofweg 55 tot 75 kB
minder per bezoeker. Geen code-wijziging, alleen een serverinstelling (`mod_brotli`).

**Waarom het telt:** 85% van ons advertentieverkeer komt op mobiel binnen.

**Prioriteit:** hoog. Dit is de goedkoopste snelheidswinst die er is.

### A2. Eventueel: onze CSS permanent in het thema

**Wat:** `rootedgoods.min.css` is 32,7 kB over de lijn (brotli) en blokkeert het
renderen, op een externe oorsprong. Als die in het thema zou zitten, scheelt dat één
verbinding.

**Eerlijke afweging:** de winst is beperkt. Er staat al een `preconnect` naar
jsDelivr, en jsDelivr is met 118 ms sneller dan onze eigen server (283 ms). Het
thema-CSS is bovendien 190,6 kB, oftewel 82% van het blokkerende gewicht; onze eigen
CSS is 14%.

**Wat ooit zin kan hebben:** alleen het stabiele deel permanent laten zetten, namelijk
de kleur- en typografietokens en de basisstijlen.

**Voorlopig niet doen.** De basisstijlen gaan nog getweakt worden, dus juist die moeten
we zelf kunnen aanpassen zonder er per keer voor te betalen. Pas heroverwegen als de
restyling klaar is en de stijlen een tijd stil liggen.

**Prioriteit:** geparkeerd.

---

## B. De productkaart en de catalogus

### B1. Galerijslides uit de productkaart halen

**Wat:** elke productkaart in een overzicht laadt zijn hele fotogalerij als slides,
terwijl alleen de eerste zichtbaar is. Op de catalogus staan 24 kaarten met tot 35
afbeeldingen per kaart, en 150 afbeeldingen met `loading="eager"` in de HTML.

**Wat het oplevert:** in oktober was dat 4.655 kB van de 5.259 kB aan kaartbeeld,
oftewel 89%. De catalogus heeft nu een LCP van 7,89 seconden bij echte bezoekers.

**Vraag:** is er een thema-instelling voor, of moet het een template-aanpassing worden?
Kan alleen de eerste slide `eager` en de rest `lazy`, of kan de galerij in de kaart
helemaal uit?

**Waarom wij het niet zelf kunnen:** de browser zet die afbeeldingen in de wachtrij
voordat ons JavaScript kan draaien.

**Prioriteit:** hoog.

### B2. Minimale afname zichtbaar op de productkaart

**Wat:** de tegel toont alleen de productnaam, een vanaf-prijs en een knop "Details".
De minimale afname staat niet in de HTML van de tegel, dus wij kunnen hem er niet met
JavaScript bij zetten.

**Vraag:** kan de minimale afname (of de eerste staffeldrempel) als veld beschikbaar
komen in de productkaart?

**Prioriteit:** middel. Hangt samen met B3.

### B3. Eén regel naast de prijstabel over kleinere aantallen

**Wat:** op ruim de helft van de productpagina's begint de prijstabel pas bij 12 tot
2000 stuks, meestal 50. Onze advertenties zeggen "geen minimale afname". Dat spreekt
elkaar tegen.

**Vraag:** kan er één vaste regel naast of onder de prijstabel, in de trant van
"kleinere aantallen bespreekbaar"? Liever één keer in het template dan dertig
productomschrijvingen herschrijven.

**Prioriteit:** middel.

---

## C. SEO en indexering

### C1. Koppen op de categoriepagina's

**Wat:** opnieuw gemeten op 3 november 2026 over alle categoriepagina's:
**75 van de 75 missen een `<h1>`** en **75 van de 75 hebben een lege
meta-omschrijving**. Dat is de hele categoriestructuur, inclusief `/alle-producten/`
en `/thema-s/kerstpakketten-eindejaar/`. De eerdere telling (78 van 98) ging over een
bredere set pagina's.

De meta-omschrijvingen vullen we zelf; daarvoor loopt een aparte opdracht. **De h1 is
het punt voor Promidata.**

**Vraag:** zit de h1 in een template of is hij per categorie in te stellen? En kunnen
wij de meta-omschrijvingen zelf per categorie invullen?

**Prioriteit:** middel. Organisch levert nu 103 vertoningen in 29 dagen op, dus dit is
een investering voor volgend jaar, geen Q4-fix.

### C2. Variant-URL's canonicaliseren

**Wat:** de sitemap bevat 1.201 product-URL's voor 636 unieke producten. 565 daarvan
zijn kleur- en maatvarianten met vrijwel dezelfde tekst. Pulltap's kelnersmes heeft er
ongeveer 45.

**Vraag:** kunnen variant-URL's een canonical naar het hoofdproduct krijgen?

**Prioriteit:** laag voor dit kwartaal, maar het verdunt de autoriteit structureel.

### C3. Eigen pagina's in de sitemap

**Wat:** van onze elf eigen pagina's staat alleen de homepage in de sitemap. Niet
`/offerte`, niet `/eindejaarsgeschenken`, niet `/over-ons`.

**Vraag:** kunnen de CMS-landingspagina's automatisch mee in de XML-sitemap?

**Prioriteit:** laag voor dit kwartaal.

### C4. De XML-sitemap is kapot, en is sinds 16 september nooit gelezen

> **Verstuurd op 3 november 2026** als losse bugmelding, zie
> `docs/mails/2026-11-03-promidata-sitemap.md`. De sitemap is dezelfde dag opnieuw
> ingediend in Search Console. Blijft hier staan tot Promidata antwoordt.

**Dit is het zwaarste punt van de hele lijst.** Search Console meldt bij de sitemap
"Fout bij compressie" en **0 ontdekte pagina's**, met als verzenddatum 16 september
2026 en laatst gelezen 1 november 2026. Google heeft in die ruim zes weken dus geen
enkele URL uit de sitemap opgehaald.

**Wat er mis is.** Het bestand
`.../003cda8a1ed34df1860b226ae97dcc39-sitemap-rootedgoods-eu-1.xml.gz` is geen gzip
met één inhoud, maar **vier achter elkaar geplakte gzip-leden**:

| Lid | Gecomprimeerd | Uitgepakt | `<urlset>` open | `</urlset>` dicht | `<url>` |
|---:|---:|---:|---:|---:|---:|
| 1 | 990 B | 12.201 B | 1 | **0** | 80 |
| 2 | 1.751 B | 29.818 B | 1 | **0** | 180 |
| 3 | 1.751 B | 29.818 B | 1 | **0** | 180 |
| 4 | 17.507 B | 268.784 B | 1 | 1 | 1.503 |

Elk lid begint opnieuw met `<?xml version="1.0"?><urlset ...>`. Alleen het laatste lid
is een compleet en geldig document; de eerste drie zijn **afgekapte restanten van
eerdere generaties**, zonder sluittag. Lid 2 en 3 zijn byte voor byte gelijk.

`gunzip` plakt alle vier aan elkaar en levert dan 340.621 bytes met vier
XML-declaraties en vier geopende `<urlset>`-elementen waarvan er één gesloten wordt.
Dat is ongeldige XML. Googles sitemapverwerker leest het eerste lid, vindt geen
`</urlset>`, en meldt een compressiefout.

**Waar het niet aan ligt**, zodat dat niet onderzocht hoeft te worden:

- `/sitemap.xml` geeft `HTTP 200` met `content-type: text/xml`
- het `.gz`-bestand geeft `HTTP 200` met `content-type: application/x-gzip`
- er is **geen** dubbele compressie: met en zonder `Accept-Encoding: gzip` komen
  dezelfde 21.999 bytes binnen, zonder `content-encoding`-header
- `robots.txt` noemt de sitemap en blokkeert hem niet
- een steekproef van 30 URLs uit de sitemap gaf **30 keer 200, geen omleidingen**

### Dit is geen Google-kwestie, en dat is te bewijzen zonder Google

Promidata heeft eerder gemeld dat er aan hun kant niets mis is en dat we Google
support moeten benaderen. Dat is te weerleggen met een gewone XML-parser. Het
bestand is op geen enkele manier geldig te lezen:

| Hoe je het leest | Resultaat |
|---|---|
| `gunzip`, dus alle vier de leden achter elkaar | **ongeldig**: `XML or text declaration not at start of entity: line 1, column 12201` |
| alleen het eerste gzip-lid, zoals een strikte lezer doet | **ongeldig**: `no element found: line 1, column 12201` |
| alleen het laatste lid, los | **geldig**, 1.503 URLs |

De tweede `<?xml ... ?>`-declaratie staat op byte 12.201, precies waar lid 2 begint.
Een XML-document mag er maar één hebben, aan het begin.

Dus: het enige geldige document zit in dit bestand begraven onder drie restanten.
Welke lezer je ook neemt, strikt of soepel, je krijgt nooit een geldige sitemap.
Daar komt Google niet aan te pas.

**Ook nagekeken, en in orde:** `/sitemap.xml` is 494 bytes, geldige XML, en verwijst
naar één sitemap. Een variant zonder `.gz` bestaat niet (404). De fout zit dus
volledig in dat ene `.xml.gz`.

**Vraag:** waarom wordt bij het genereren aan het bestaande bestand toegevoegd in
plaats van het te overschrijven? Verwijder het bestand, genereer de sitemap één keer
opnieuw, en controleer dat er daarna **één** gzip-lid in zit.

**Wat het oplevert.** Dit verklaart waarom de categoriestructuur nauwelijks bestaat
voor Google. Gemeten over 89 dagen (5 augustus tot 1 november): van de 75
categoriepagina's zijn er **12 ooit vertoond**, samen 188 vertoningen en 2 klikken.
Eén enkele subcategorie haalde ooit een vertoning. Waar ze wél getoond worden staan ze
op positie 4,7 tot 7,5, dus ranken is het probleem niet; gevonden worden wel.

**Prioriteit: hoog.** Dit is een kapot bestand, geen wens. Het staat los van C1, C2 en
C3, en die drie hebben weinig zin zolang dit niet klopt.

**Controle achteraf**, in één regel:

```bash
curl -s <sitemap-url> | python3 -c "import sys,zlib;d=sys.stdin.buffer.read();n=0
while d:
    o=zlib.decompressobj(zlib.MAX_WBITS|16); o.decompress(d); n+=1; d=o.unused_data
print(n,'gzip-leden')"
```

Eén lid is goed. Meer dan één is dezelfde fout.

### De proef is gedaan, 3 november 2026: het ligt aan de generator

Ward heeft de Refresh strategy in Shopware van `Scheduled` op `Live` gezet en de
sitemap opgevraagd. Drie dingen gebeurden.

**1. De browser kreeg een foutpagina.** `/sitemap.xml` toonde de
storefront-foutmelding "Er is helaas een fout opgetreden". Het genereren klapt er
dus uit. Latere verzoeken geven gewoon weer de geldige index; het is het verzoek
dat de generatie aftrapt dat faalt.

**2. Het bestand is wél opnieuw geschreven**, en kleiner geworden:

| | 1 november | 3 november, na Live |
|---|---:|---:|
| Bestandsgrootte | 21.999 B | **19.122 B** |
| gzip-leden | 4 | **3** |

Kleiner en met mínder leden betekent **overschrijven, niet toevoegen**. Mijn eerdere
vermoeden dat er aan het bestand werd geplakt klopt dus niet.

**3. En dat is erger, want dan schrijft één enkele run al kapotte uitvoer:**

| Lid | Uitgepakt | `<urlset>` open | dicht | `<url>` |
|---:|---:|---:|---:|---:|
| 1 | 12.535 B | 1 | **0** | 82 |
| 2 | 12.535 B | 1 | **0** | 82 |
| 3 | 272.844 B | 1 | 1 | 1.523 |

**Lid 1 en 2 zijn byte voor byte gelijk.** Twee identieke, afgekapte fragmenten van
82 URLs, gevolgd door het complete document van 1.523 URLs.

**Wat dat samen vertelt.** Het genereren begint, schrijft 82 URLs, loopt vast
(dat is de foutpagina), begint opnieuw, schrijft weer precies dezelfde 82 URLs,
loopt weer vast, en pas de derde poging komt door en schrijft het hele document.
De brokstukken van de eerste twee pogingen blijven in het bestand staan.

Dit is dus **één fout, niet twee**: de generatie werpt een uitzondering en ruimt de
gedeeltelijke uitvoer niet op.

**Reproduceerbaar in twee minuten, volledig aan jullie kant:** zet Refresh strategy
op Live, vraag `/sitemap.xml` op, en tel de leden met de regel hieronder. De
foutmelding die daarbij in de logs komt te staan is het beginpunt.

**Tweede waarneming, mogelijk dezelfde oorzaak:** met Refresh strategy op `Scheduled`
en een interval van 3.600 seconden was het bestand **44 uur oud** (laatst gewijzigd
1 november 13:32, gemeten 3 november 09:16). De geplande taak lijkt dus niet te
draaien, of hij loopt op dezelfde fout vast.

**De proef die de discussie beslecht.** Verwijder het bestand, genereer één keer
opnieuw, en draai de regel hierboven.

- Komt er **1 gzip-lid** uit, dan was het een blijven staan van afgebroken runs en is
  het daarmee opgelost.
- Komt er **weer meer dan één** uit, dan wordt er bij het genereren toegevoegd in
  plaats van overschreven, en zit de fout in de code.

In beide gevallen weten we het binnen een minuut, zonder dat iemand Google hoeft te
bellen.

**Pas daarna opnieuw indienen in Search Console**, en dan met de index
`https://rootedgoods.eu/sitemap.xml`, niet met het `.gz` rechtstreeks. De index is
een vast adres, hij staat al in `robots.txt`, en hij blijft kloppen als Shopware de
sitemap ooit over meerdere bestanden verdeelt. Nu staat het `.gz` zelf ingediend.

---

### C5. Een CMS-pagina kan niet op noindex

**Wat:** een categoriepagina krijgt van het thema netjes
`<meta name="robots" content="index,follow">` mee. Een CMS-pagina krijgt
`<meta name="robots" content="">`, dus een lege waarde. Gemeten op 4 november 2026:

| Pagina | Soort | robots-meta |
|---|---|---|
| `/` | categorie | `index,follow` |
| `/thema-s/kerstpakketten-eindejaar/` | categorie | `index,follow` |
| `/eindejaarsgeschenken` | CMS | **leeg** |
| `/over-ons` | CMS | **leeg** |
| `/test` | CMS | **leeg** |

Een lege waarde is geen instructie, dus zo'n pagina mag gewoon geindexeerd worden.
In de beheeromgeving is voor dit paginatype geen veld te vinden om dat te sturen.

**Waarom we dit nodig hebben:** we willen een wijziging aan een landingspagina
eerst op een kopie kunnen zien, op de echte site met echte gegevens, zonder dat
die kopie in Google belandt. Dat is nu niet mogelijk. Hetzelfde geldt voor elke
pagina die we tijdelijk offline-achtig willen houden.

**De vraag:** kunnen jullie een robots-veld op CMS-pagina's beschikbaar maken, of
anders een vaste map (bijvoorbeeld alles onder `/intern/`) die het thema altijd op
`noindex` zet?

**Wat we nu doen, en waarom dat niet goed genoeg is:** onze eigen JS zet de
robots-meta op `noindex` voor een handmatige lijst met paden (sectie 0 van
`rootedgoods.js`). Google leest dat wel, maar pas bij het renderen, en dat is later
dan het ophalen van de HTML. Het werkt in de praktijk en het is geen vervanging
voor een tag die de server meestuurt.

**Hangt samen met C3:** CMS-pagina's staan ook niet in de sitemap. Gemeten op
4 november: 1.523 URL's in de sitemap, en `/eindejaarsgeschenken`, `/over-ons`,
`/offerte` en `/contact` zitten er geen van alle bij. Dat beperkt nu toevallig de
schade, want een werkpagina wordt zo niet via de sitemap gevonden. Lost C3 op,
dan wordt C5 urgenter.

**Prioriteit:** midden. Geen omzet, wel een blokkade voor elke veilige proef.

---

## D. Webp

### D1. Kan Shopware 6.5 zelf webp genereren?

**Wat:** geen enkele afbeelding op de site is webp of avif. De 59 gemeten PNG's wegen
samen 9,02 MB en zouden als webp rond de 0,86 MB wegen (eigen hercodering op kwaliteit
82, dus een schatting).

**Vraag, in deze volgorde:**
1. Kan de thumbnail-service van 6.5 dit al, via een instelling in de backend of in
   `shopware.yaml`? De changelog van 6.4.8 noemt webp-ondersteuning in de
   ThumbnailService.
2. Zo niet, welke plugin raden jullie aan, en wat kost installatie plus licentie?

**Waarom in die volgorde:** als het al kan, besparen we de installatiekosten.

**Prioriteit:** pas na B1. Die is gratis en groter.

---

## E. Kleine dingen

### E1. JavaScript-fout op de catalogus

Op `/alle-producten/` treden twee fouten op: `json parse error: unexpected eof` en
`unexpected token '<', <!doctype ... is not valid json`. Een AJAX-aanroep krijgt HTML
terug waar JSON verwacht wordt. Lage frequentie (2 sessies in oktober), maar het is een
echte fout.

### E2. Vervallen, dit doen we zelf

**Vervallen op 30 oktober 2026.** Stond hier als "layoutverschuiving op de
desktopcatalogus", met een CLS van 0,343 uit Clarity. Vier eigen metingen komen uit op
0,0028 tot 0,0362, ruim onder de 0,1 die "goed" heet. Die verschuiving is er dus niet en
er valt niets over te vragen.

Wat er wel is, hoort ook niet in deze mail: onder 768 px verbergt
`theme/css/all.css` het hele blok `.cms-block-category-navigation`, waardoor de dertien
categorielinks mobiel op nul bij nul pixels renderen. Onze eigen CSS laadt na het
themabestand (regel 771 tegen 679), dus we kunnen die regel zelf overschrijven zonder
Promidata. Staat als punt 28 in het plan.

### E3. Redirect op de kerstpagina

`/thema-s/kerstpakketten/` geeft een 301 naar `/thema-s/kerstpakketten-eindejaar/`. Een
knop op onze landingspagina wijst naar de eerste. Kan die rechtstreeks?

### E4. Vervallen: de weigerknop werkt wel

**Vervallen op 3 november 2026.** Ward heeft het nagedaan in een privévenster, zonder
Resource Override en zonder onze eigen CSS: klikken op "Weigeren" laat de balk gewoon
verdwijnen. Niet versturen.

Waarom de meting van 28 oktober dan iets anders zei, weten we niet. Twee mogelijkheden,
geen van beide bevestigd: het is sindsdien aan hun kant opgelost, of de meting zelf
deugde niet. Die liep met Playwright, en een synthetische klik kan afgaan voordat de
afhandelaar eraan hangt. Dat laatste is een valkuil om te onthouden: **een klik die
niets doet in Playwright is niet hetzelfde als een knop die stuk is.**

Nog niet nagekeken: of "Configureren" inmiddels wél een scherm opent. Dat was de tweede
helft van deze melding.

De meting van 28 oktober staat hieronder, voor als het terugkomt.

<details>
<summary>De oorspronkelijke melding, 28 oktober 2026</summary>

#### "Weigeren" en "Configureren" op de cookiebalk doen niets

**Gemeten op 28 oktober met Playwright, mobiel en desktop, op de live homepage.**
Klikken op "Aanvaard alle cookies" werkt: de balk verdwijnt en `cookie-preference`,
`dtgsAllowGtmTracking`, `google-ads-enabled` en `wishlist-enabled` worden gezet.
Klikken op "Weigeren" doet niets: de balk blijft staan en er wordt geen
`cookie-preference` gezet. Klikken op "Configureren" opent geen modal.

Wat we al uitsloten: de knoppen bestaan in de DOM, er ligt niets overheen
(`elementFromPoint` geeft de knop zelf), ze staan in beeld, er zijn geen
JavaScript-fouten, en zowel `CookiePermission` als `CookieConfiguration` is in de
PluginManager geregistreerd met één actieve instantie. Het ligt niet aan onze eigen
CSS: het gedrag is identiek met en zonder `rootedgoods.css`.

**Waarom dit urgent is:** zolang weigeren niet werkt, kan een bezoeker alleen
accepteren of de balk negeren. Dat is precies de situatie die de AVG niet toestaat,
en het is ook de reden dat de balk voor een deel van de bezoekers blijft staan.

**Prioriteit:** hoog. Dit is core-gedrag van Shopware, niet iets wat wij stuk kunnen
maken met CSS.

</details>

---

### A3. Een versienummer in de CSS- en JS-URL in het thema

**Dit is de reden dat een wijziging soms dagen duurt voordat iedereen hem ziet.**
De bestanden komen binnen met `Cache-Control: public, max-age=604800, s-maxage=43200`.
Dat zijn twee problemen boven elkaar.

**Eerst de browser.** `max-age=604800` is zeven dagen bij de bezoeker, en die
controleert in die week niet eens of er iets nieuws is. Een purge helpt daar niets
tegen; alleen een harde ververs of een incognitovenster forceert een nieuwe ophaling.
Dat verklaart waarom een wijziging bij de een meteen zichtbaar is en bij de ander niet.

**En daarboven de CDN, en dat wisten we tot 30 oktober 2026 niet.** De thema-head
laadt `rootedgoods.min.css` en `rootedgoods.min.js` van `cdn.jsdelivr.net/gh/...@main`.
Die geminificeerde bestanden staan niet in onze repo; jsDelivr maakt ze zelf, en
cachet ze los van de onverkorte versies. Gemeten die dag, na een wijziging die we
pushten en purgeden:

| URL | omvang | bevat de geschrapte regel |
|---|---|---|
| `@main/rootedgoods.min.css` | 208.166 bytes | ja, dus verouderd |
| `@<commit-sha>/rootedgoods.min.css` | 207.953 bytes | nee, dus actueel |

De purge gaf `HTTP 200` en de `age`-header stond op `0`, maar de inhoud was de oude.
Na drie purges nog steeds. Een SHA-URL van dezelfde commit gaf wél meteen het
nieuwe bestand.

Later die dag werd het erger: ook de ónverkorte `@main/rootedgoods.css` liet zich
niet meer verversen. De purge gaf `HTTP 200`, maar de `age`-header liep gewoon
door (481 seconden) en de inhoud bleef de oude. Dezelfde commit via de SHA-URL
stond op `age: 0` met de nieuwe inhoud. De commit stond op dat moment bevestigd
op GitHub. De purge-aanroep slaagt dus wel, maar doet niets; vermoedelijk een
limiet op het aantal purges per periode.

**Dat betekent dat wij geen enkele manier hebben om een wijziging af te dwingen.**
Wij kunnen pushen en purgen, maar of de bezoeker het krijgt bepaalt de cache van
jsDelivr.

**Gevolg:** een CSS-wijziging bereikt de bezoeker niet op het moment dat wij hem
publiceren, maar pas als de edge vanzelf vervalt, tot twaalf uur later, en daarna
nog eens tot zeven dagen per terugkerende bezoeker. Het raakt alles wat we dit
najaar aanpassen: de cookieknoppen en de lettertypefix van 28 oktober bereikten
terugkerende bezoekers pas na maximaal een week.

**Vraag:** kan er een versie-query achter de twee URL's in het thema, dus
`rootedgoods.min.css?v=2` en `rootedgoods.min.js?v=2`, die wij bij een release
ophogen? Dan krijgt elke wijziging vanzelf een nieuwe URL die nooit uit een cache
komt, en zijn purges en harde ververs niet meer nodig.

**Beter nog: een vaste commit-SHA in plaats van `@main`**, dus
`cdn.jsdelivr.net/gh/ward-gif/rootedgoods@<sha>/rootedgoods.min.css`. Die URL is
onveranderlijk en daarom per definitie vers; er valt niets te cachen wat verkeerd
kan gaan. Wij leveren de nieuwe SHA aan bij elke release.

Allebei de oplossingen kosten evenveel: bij een versie-query moet `?v=2` naar `?v=3`
bij elke release, bij een SHA moet de SHA mee. In beide gevallen is dat één
themawijziging per release. Omdat de SHA niet van een cache afhangt en de query
wel, heeft de SHA onze voorkeur. Het liefst zouden wij die regel zelf kunnen
bijwerken; kan dat, dan hoeft het jullie na de eerste keer geen tijd meer te kosten.

**Prioriteit:** hoog. Dit is de enige van de lijst die alle andere wijzigingen
sneller laat landen, en sinds de meting van 30 oktober weten we dat het niet alleen
traag is maar dat een wijziging domweg niet aankomt zolang de edge hem niet loslaat.

### A4. De cache is bijna altijd koud, en dat kost 2 tot 5 seconden

**Wat:** een categoriepagina komt binnen in 0,22 s als hij in de cache staat, en in
2,4 tot 5,7 s als dat niet zo is. Gemeten op 4 november 2026, de elf categorieën uit
het hoofdmenu, drie rondes achter elkaar. Ruwe uitvoer in
`docs/metingen/2026-11-04-menutraagheid/ruw.csv`.

| Ronde | Mediaan TTFB | Boven 1 seconde |
|---|---:|---:|
| 1 | **3,19 s** | 8 van 11 |
| 2 | 0,20 s | 0 van 11 |
| 3 | 0,21 s | 0 van 11 |

Negen van de elf waren koud toen wij ze voor het eerst opvroegen. De slechtste was
`/tassen-reizen/` met **5,68 s**. Na onze eigen eerste aanvraag zat elke pagina op
0,2 s en bleef daar.

**Wat we niet kunnen zien, en wat we jullie dus vragen.** De pagina's komen binnen met
`cache-control: no-cache` en hebben tegelijk een `age`-header die oploopt. Er staat dus
een cache vóór Shopware die zijn eigen bewaartijd aanhoudt. Wij zien die bewaartijd
niet; we zagen een regel oplopen tot 762 seconden zonder terug te springen, dus hij is
minstens dertien minuten.

1. **Welke cache staat hier voor, en wat is de bewaartijd?** Als die kort is, is bijna
   elke bezoeker de eerste op zijn pagina en betaalt hij de volle 2 tot 5 seconden.
2. **Kan de bewaartijd omhoog?** Het assortiment en de prijzen veranderen bij ons
   hoogstens dagelijks, niet per minuut. Een bewaartijd van uren in plaats van minuten
   zou niets stuk maken.
3. **Kan er een cache-warmer draaien?** Shopware heeft daar een console-opdracht voor.
   Als die na elke import de categoriepagina's één keer ophaalt, staat alles warm
   voordat de eerste bezoeker komt. Het gaat om een handvol URL's, niet om de hele
   catalogus.

**Waarom het telt:** dit raakt precies de pagina's waar een bezoeker na de
advertentielandingspagina op klikt. Wie via het menu de catalogus in gaat, is bijna
altijd de eerste op die pagina en wacht dus seconden. Ward merkte het zelf op als
"mensen navigeren niet soepel door de site", en dit is de meting daarachter.

**Hangt samen met B1 en D2:** die gaan over het gewicht van de pagina als hij er is,
deze over de tijd voordat er iets komt. Op een categoriepagina stapelen ze: eerst 2 tot
5 seconden wachten op de HTML, dan 3,75 MB beeld dat direct inlaadt.

**Prioriteit:** hoog, en vermoedelijk goedkoop. Punt 2 is een instelling, punt 3 een
opdracht in een cronjob.

> **Stand 6 november, bij A4.** Promidata meldde performance-updates en vroeg om te
> controleren. Nagemeten (`docs/metingen/2026-11-06-na-promidata-update/`): een koud
> eerste bezoek aan een menucategorie was 3,19 s mediaan en is nu 1,09 s; de slechtste
> ging van 5,68 s naar 1,41 s. Warm onveranderd 0,2 s. De drie vragen van A4 (welke
> cache, de bewaartijd, een cache-warmer) zijn niet beantwoord en blijven staan, want
> koud is nog altijd een factor vijf trager dan warm.

### B4. Productslider, productboxMinWidth van 300 naar 400

In `data-product-slider-options` op `.base-slider.product-slider` staat
`"productboxMinWidth": "300"`. Op een scherm van 1900 px passen er dan ongeveer
zes tegels, te veel, en er is geen ruimte voor een peek aan de rand. Met 400 passen
er vier tot vijf met een natuurlijke peek.

Het alternatief is de tegelbreedte via onze eigen CSS overschrijven, en dat botst
met de interne transform-berekening van TinySlider: gekloonde tegels werden links
zichtbaar.

Raakt alleen de productslider op de homepage, niet de catalogus of de
zoekresultaten.

**Prioriteit:** laag. Staat al sinds april open.

---

### E6. `add_to_cart` stuurt een hoeveelheid en een waarde van nul

**Gemeten op 29 oktober**, met een Tag Assistant-sessie over de hele
bestelroute. Export staat in
`docs/metingen/tagassistant/2026-10-29-bestelroute/`.

Bij het toevoegen aan de winkelwagen komt dit binnen:

```
add_to_cart   quantity: 0   value: 0   price: 26.53
```

Eén stap later klopt het wel:

```
view_cart     quantity: 100  price: 24.32   (de staffelprijs)
begin_checkout  value: 2431.50
```

De prijs per stuk staat er dus wel in, maar het aantal en de totaalwaarde zijn
nul. Bij een winkel die op staffels werkt is dat geen detail: het aantal bepaalt
de prijs.

**Waarom het nu uitmaakt:** we gaan de e-commercegebeurtenissen aan GA4 koppelen.
Zetten we `add_to_cart` aan zoals hij nu is, dan meldt GA4 elke toevoeging als
nul euro, en dan is de trechter onbruikbaar. De andere gebeurtenissen kunnen wel
meteen aan.

**Vraag:** kan `add_to_cart` het werkelijke aantal en de bijbehorende
staffelprijs meesturen, net als `view_cart` dat al doet?

**Prioriteit:** hoog, maar pas nodig als de e-commercetags live gaan.

---

### D2. Het `sizes`-attribuut klopt niet, en dat kost megabytes

**Dit is waarschijnlijk de grootste snelheidswinst van de hele lijst, en hij kost
niets aan beeldkwaliteit.**

Gemeten op 29 oktober, mobiel, 390 px breed met pixelverhouding 2:

| Pagina | Totaal | Waarvan beeld |
|---|---:|---:|
| `/eindejaarsgeschenken` | 4.207 kB | **3.478 kB** |
| `/alle-producten/` | 8.365 kB | **7.680 kB** |

De oorzaak is niet het aantal afbeeldingen maar hun formaat. **Zestien van de
zeventien afbeeldingen op de kerstpagina worden 2,4 tot 11,4 keer groter geladen dan
ze getoond worden.** Op een scherm met pixelverhouding 2 is factor 2 precies goed.

Bij de productslider staat dit:

```
sizes="(min-width: 1200px) 280px, (min-width: 992px) 350px,
       (min-width: 768px) 390px, (min-width: 576px) 500px,
       (min-width: 0px) 500px, 100vw"
```

Op een telefoon van 390 px pakt hij de regel `(min-width: 0px) 500px`. De browser
rekent dus met 500 px, verdubbelt dat voor het scherm naar 1000 px, en kiest het
grootste bestand uit de `srcset`. Er zijn maar twee formaten: **400w van 78 kB en 800w
van 227 kB.** Hij neemt de 800.

Terwijl de tegel in werkelijkheid **133 px breed** is.

Op de categoriepagina staat bovendien `sizes="180x180"`, en dat is helemaal geen
geldige waarde. Een `sizes` hoort een CSS-lengte te zijn, bijvoorbeeld `180px`. Bij een
ongeldige waarde valt de browser terug op `100vw` en kiest hij altijd het grootste
bestand.

**Twee vragen:**

1. Kan het `sizes`-attribuut de werkelijk gerenderde breedte noemen? Voor de slider op
   mobiel is dat ongeveer `140px`, niet `500px`. En kan `180x180` op de categoriepagina
   `180px` worden?
2. Kunnen er kleinere miniaturen bijkomen, bijvoorbeeld 200w en 300w? Nu is 400w de
   kleinste, en dat is al drie keer te groot voor een tegel van 133 px.

**Wat het oplevert:** alleen al van 800w naar 400w is een factor 3 op het grootste deel
van het beeldgewicht. Met een 200w-formaat erbij wordt het meer. Op de catalogus praat
je over megabytes, zonder dat er iets aan het ontwerp verandert.

**Bijgewerkt 10 november 2026: wij vangen dit nu zelf af, voor de producttegels.**
De band-JS en een algemene stap onderaan `rootedgoods.js` kiezen vóór het laden zelf
de kleinste kandidaat uit de `srcset` die de getoonde breedte bij maximaal 2x dichtheid
dekt. Gemeten op de live site (docs/metingen/2026-11-10-site-laden/, 12 s na laden,
10 Mbit): beeldgewicht op `/eindejaarsgeschenken` 3.415 kB naar 696 kB (negen tegels,
800w naar 400w), op `/alle-producten/` 2.625 kB naar 1.324 kB, op `/huis-keuken/` 1.493 kB
naar 793 kB, op `/thema-s/` 2.191 kB naar 892 kB. De home is niet gewonnen (de slider daar
laadt zijn foto's vóór onze JS draait). **Dit blijft een omweg:** het werkt pas ná het laden
van onze JS, het kan niet onder de 400w komen, en het raakt de PDP, de zoekresultaten die
via AJAX binnenkomen en de home maar half. De vraag aan Promidata blijft dus staan, met
de twee kleinere formaten als de echte winst.

### Er is een tweede helft, en die twee werken alleen samen

De productbeelden staan in de mediamap **Shared Media**. Daar staan maar twee
miniatuurformaten aan: **400×400 en 800×800.** De formaten 200, 280, 360 en 1920 staan
uit. Dat is precies wat we in de `srcset` terugzien: twee kandidaten, meer niet.

Zouden jullie **200, 280 en 360 willen aanzetten** op die map? Dan kan de browser
eindelijk iets kiezen dat in de buurt van 266 px ligt, in plaats van te moeten kiezen
tussen 400 en 800.

**Let op: los van elkaar doen deze twee niets.**

- Alleen de kleine formaten aanzetten helpt niet, want met `sizes="500px"` rekent de
  browser 500 × 2 = 1000 px en pakt hij alsnog de 800w. Dan genereren jullie duizenden
  miniaturen die nooit gekozen worden.
- Alleen het `sizes`-attribuut rechtzetten helpt wel iets, want dan wordt het 400w in
  plaats van 800w, maar 400 is nog steeds anderhalf keer te groot voor een tegel van
  133 px.

Samen halen ze een tegel van 227 kB terug naar ongeveer 25 kB.

**En een vraag vooraf:** die map heet Shared Media en er staan duizenden producten in
die wij niet verkopen. Het lijkt dus een bibliotheek die jullie over meerdere winkels
delen. Wij kúnnen de instelling aanpassen, de knop werkt, maar we doen het niet omdat
we niet weten wat het bij anderen aanricht en hoe zwaar het hergenereren is. Kunnen
jullie zeggen of dit van ons is om te wijzigen, of dat jullie het beter kunnen doen?

**Hangt samen met B1:** die gaat over het *aantal* afbeeldingen (148 variant-miniaturen
op `eager`), deze over hun *formaat*. Samen zijn ze de verklaring voor een catalogus van
8,4 MB.

**Prioriteit:** hoog.

---

### A5. Twee Playfair-lettertypen voorladen in de head

**Wat we meten:** de kop op de home, de kerstpagina en over-ons wisselt van lettertype nadat
de pagina al getoond is. Playfair staat in onze CSS op `font-display: optional`, maar de
browser wisselt toch, en dan verspringt de kop. Op een eerste bezoek met Slow 4G en CPU 4x trager
(live, 10 november 2026, docs/metingen/2026-11-10-laden-themapagina/):

| | Layout-shift door het lettertype | LCP |
|---|---:|---:|
| Kerstpagina, zoals nu | 0,0557 | 2,49 tot 2,57 s |
| Kerstpagina, met preload van Playfair 500 en 700 | 0,0013 en 0,0023 | 2,78 tot 2,82 s |
| Home, zoals nu | 0,0878 | 3,54 s |
| Home, met preload van 500, 600 en 700 | 0,0197 | 3,80 s |

Zonder Playfair (geblokkeerd) is de shift 0,0091 op de kerstpagina en 0,0000 op de home, dus het
lettertype is de oorzaak. De prijs is een kwart seconde later LCP op een trage verbinding.

**Wat we vragen:** drie regels bovenaan de `<head>`:

```html
<link rel="preload" href="/webfonts/Playfair%20Display%20v40%20Latin/playfair-display-v40-latin-500.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/webfonts/Playfair%20Display%20v40%20Latin/playfair-display-v40-latin-600.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/webfonts/Playfair%20Display%20v40%20Latin/playfair-display-v40-latin-700.woff2" as="font" type="font/woff2" crossorigin>
```

**Waarom dit hier staat en niet bij ons:** een `<link rel="preload">` hoort in de `<head>`.
Via een HTML-blok in de CMS komt hij in de body terecht. Of Shopware hem daar laat staan en of de
browser hem dan nog op tijd oppakt, is niet getest. In de meting hierboven is de link wel zo vroeg
mogelijk in de head gezet, dus dit is het beste geval. Dit hoort in dezelfde wijziging als A3
(versienummer in de CSS- en JS-URL): één keer in de themahead, één factuur.

**Prioriteit:** laag tot midden. Op de kerstpagina blijft de shift met 0,06 onder de 0,1 die als
goed telt. Op de home komt hij met 0,09 op de grens, en daar staan nog andere shifts naast.

### A6. Verbindingen met rootedgoods.eu stokken, ook bij statische bestanden

**Wat:** op 12 november 2026 lag de wachttijd niet bij Shopware dat een pagina bouwt,
maar bij de verbinding met de server. Een deel van de aanvragen krijgt de TLS-handshake
pas na 1 tot 2 seconden (normaal 0,1 s), een deel krijgt na een snelle eerste byte de
rest pas na 8 seconden, en een deel stokt helemaal. Een CSS-bestand uit het thema had na
45 seconden 32 KB van de ruim 190 KB binnen. Dat is geen paginabouw: dat bestand komt
rechtstreeks van de webserver.

Gemeten vanaf Wards netwerk, elke aanvraag 45 seconden de tijd. De controles en de twee
laatste rijen liepen tegelijk; de productpagina is kort daarvoor gemeten:

| Doel | n | Mediaan totaaltijd | Boven 2 s | Langste |
|---|---:|---:|---:|---:|
| Google (controle) | 12 | 0,16 s | 0 | 0,2 s |
| cdn.jsdelivr.net (controle) | 12 | 0,16 s | 0 | 0,2 s |
| rootedgoods.eu, productpagina | 15 | 2,12 s | 8 | 45 s (afgebroken) |
| rootedgoods.eu, `/alle-producten/` | 12 | 0,38 s | 3 | 25,4 s |
| rootedgoods.eu, `all.css` uit het thema | 12 | 0,34 s | 2 | 45 s (afgebroken) |

Twaalf volledige laadbeurten van de productpagina in een browser (headless Chromium,
zelfde URL, achter elkaar): twee haalden in 90 seconden het laad-event niet, twee deden
er 40 en 48 seconden over, één 8 seconden, zes waren klaar binnen 2,1 seconden. De
slechtste ervaring is dus niet traag maar onvoorspelbaar: dezelfde pagina laadt in
0,6 seconden of in bijna een minuut.

Ruwe uitvoer: `docs/metingen/2026-11-12-pdp-traag/` (`ttfb-opgesplitst.txt`,
`controle-uitvoer.txt`, `reeks-uitvoer.txt`). Meetscript `controle.sh` in dezelfde map.

**Wat we vragen:**

1. **Kunnen jullie in de serverlogs kijken naar 12 november, rond 11:50 tot 12:30?** We
   zoeken: Apache die zijn maximum aantal gelijktijdige verbindingen haalt, een
   wachtrij voor TLS, een bandbreedtegrens, of een andere bezoeker/bot die de server
   bezet houdt.
2. **Draaien er op die server meer webshops of zware taken (import, indexering) op
   het moment dat dit gebeurt?** Het patroon is willekeurig, niet gebonden aan een
   pagina.
3. **Hoeveel gelijktijdige verbindingen kan de server aan, en wat gebeurt er bij meer?**

**Waarom het telt:** deze pagina ging naar een klant. Wie een link krijgt en een lege
pagina ziet, beoordeelt niet de pagina maar ons. Dit kunnen we niet zelf oplossen of
omzeilen, want het zit onder de laag waar onze CSS en JS bij kunnen.

**Stand 12 november:** apart als mail voorbereid, zonder de betaalde punten, in
`docs/mails/2026-11-12-promidata-verbindingen-stokken.md`. Nog niet verstuurd.

**Prioriteit:** hoog, en vóór de rest van deze lijst. A4 (cache) gaat over de wachttijd
voor de HTML als de cache koud is; dit gaat over verbindingen die blijven hangen, ook
voor bestanden die nooit uit de cache komen.

**Wat we niet weten:** of het ook bij andere bezoekers gebeurt of alleen op Wards
verbinding. Ward meldt (12 november, na de meting) dat bezoekers dit soms ook hebben;
het is niet gemeten en niet uit data gehaald. Google en jsDelivr deden het in dezelfde minuten niet, wat een lokaal
netwerkprobleem onwaarschijnlijk maakt, maar een tweede meetpunt (bijvoorbeeld de
PageSpeed-servers, die in dezelfde uren 20 ms respons zagen) is nodig om het te
bewijzen.

---

## Nog uit te zoeken voordat we het vraagt

- **Betalen op rekening** (punt 21 uit het verbeterplan): eerst zelf in de backend
  kijken welke betaalmethoden er per klantgroep beschikbaar zijn. Pas vragen als het
  echt niet kan.
