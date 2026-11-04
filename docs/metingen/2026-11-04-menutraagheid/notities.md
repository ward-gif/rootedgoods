# Waarom een menuklik traag voelt, 4 november 2026

Vraag van Ward: "kan je eens kijken waarom vooral clicks via menu zo traag laden.
Mensen navigeren niet soepel door de site."

Alles hieronder is gemeten op de live site tussen 08:29 en 08:40 CET, vanaf een
vaste verbinding in Nederland, met een iPhone-user-agent. Ruwe uitvoer staat in
de CSV's naast dit bestand.

## Kort: het menu is niet traag, de bestemming is dat

| Wat | Gemeten |
|---|---|
| Het submenu ophalen bij een tik (`/widgets/menu/offcanvas`) | **0,19 s** mediaan, ~1 kB |
| Een categoriepagina met warme cache | **0,22 s** mediaan |
| Diezelfde pagina met koude cache | **2,4 tot 5,7 s** |
| Beeld dat direct inlaadt op een categoriepagina | **3,75 MB** in 56 afbeeldingen |

Het menu-mechanisme zelf is dus snel. Wat traag is, is de pagina erachter, en
dat komt door twee dingen die op elkaar stapelen: een cache die koud is, en een
productoverzicht dat zwaar is.

## 1. De cache is koud, en dat is het hele "soms traag"

`bin/…/meet-menu.sh` vroeg de elf menu-categorieën drie keer op, achter elkaar.

| Ronde | Mediaan TTFB | Boven 1 seconde |
|---|---:|---:|
| 1 | **3,19 s** | 8 van 11 |
| 2 | 0,20 s | 0 van 11 |
| 3 | 0,21 s | 0 van 11 |

Per pagina, met de `age`-header erbij (`ruw.csv`):

| Menu-item | ronde 1 | ronde 2 | ronde 3 |
|---|---|---|---|
| Tassen & Reizen | 5,68 s (age 2) | 0,20 s (age 25) | 0,20 s (age 31) |
| Huis & Keuken | 4,60 s (age 2) | 0,21 s (age 18) | 0,18 s (age 24) |
| Outdoor | 4,59 s (age 2) | 0,19 s (age 9) | 0,22 s (age 15) |
| Giveaways | 4,32 s (age 1) | 0,20 s (age 13) | 0,21 s (age 19) |
| Kleding & Textiel | 3,39 s (age 3) | 0,20 s (age 32) | 0,24 s (age 38) |
| Kantoor & Schrijfwaren | 3,19 s (age 1) | 0,24 s (age 33) | 0,21 s (age 39) |
| Sport & Spel | 2,93 s (age 1) | 0,19 s (age 22) | 0,19 s (age 28) |
| Thema's | 2,36 s (age 0) | 0,20 s (age 6) | 0,25 s (age 12) |
| Elektronica | 0,70 s (age 0) | 0,19 s (age 16) | 0,27 s (age 22) |
| Drinkwaren | 0,19 s (age 18) | 0,20 s (age 54) | 0,22 s (age 59) |
| Eten & Drinken | 0,22 s (age 512) | 0,23 s (age 524) | 0,19 s (age 530) |

De twee onderste waren al warm toen ik begon; Drinkwaren had ik zelf net
aangeraakt, Eten & Drinken stond er al ruim acht minuten in en is dus door
iemand anders of een crawler opgewarmd. De overige negen waren koud.

**Dat is het bewijs dat deze pagina's doorgaans koud zijn.** Een koude regel
betekent dat niemand die pagina in het hele cachevenster ervóór heeft geopend.

Let op de tegenstrijdigheid in de headers: de pagina's komen binnen met
`cache-control: no-cache` en hebben tóch een `age`. Er zit dus een cache vóór
Shopware die zijn eigen regels volgt. De bewaartijd is van buitenaf niet te
lezen; ik zag een regel oplopen tot **762 seconden zonder terug te springen**,
dus de bewaartijd is minstens dertien minuten. Het echte getal is een
instelling bij de hosting of bij Promidata.

### Koud is niet één getal

Met een cache-omzeiling (`?rgkoud=…`, zie `koud.csv`) kostte dezelfde soort
pagina 1,3 tot 1,8 s in plaats van 2,4 tot 5,7 s. Het verschil is dat de lagen
eronder (database, object-cache) tegen die tijd wél warm waren van mijn eigen
eerdere verzoeken. Dus:

| Hoe koud | TTFB |
|---|---|
| Alles warm | 0,2 s |
| HTML koud, gegevens warm | 1,3 tot 1,8 s |
| Alles koud | 2,4 tot 5,7 s |

De eerste bezoeker van de dag op een categorie zit in de onderste rij.

### Dit raakt niet alleen de pagina's

Onze eigen `rootedgoods.min.css` op jsDelivr deed er bij het eerste verzoek
**3,08 s** over (`blokkerend.csv`), daarna 0,07 s (`jsdelivr.csv`, vijf rondes:
mediaan 0,07 s). Ook die edge was dus koud. En die CSS blokkeert het renderen,
dus die 3 seconden komen bovenop de TTFB. Zelfde ziekte, andere laag.

| Blokkerende stylesheet | Koud | Bytes | Browsercache |
|---|---|---:|---|
| `logotool-images.s3…/promifonto.css` | 0,15 s | 8,8 kB | **geen** `cache-control` |
| theme `all.css` | 0,16 s | 195 kB | 360 dagen |
| `rootedgoods.min.css` (jsDelivr) | **3,08 s** | 32 kB | 7 dagen |
| fontawesome `all.min.css` | 0,18 s | 21,5 kB | 360 dagen |

Samen ongeveer 257 kB CSS die het eerste beeld tegenhoudt. De S3-stylesheet
heeft geen `cache-control`, dus die wordt mogelijk elke navigatie opnieuw
gevalideerd; dat is niet nagemeten.

## 2. De menubestemmingen zijn precies de pagina's die we níét opgeruimd hebben

Beeldgewicht per paginasoort, alle unieke `<img src>` opgehaald en geteld
(`beeld-*.csv`):

| Pagina | Direct inladen | Lazy | Totaal |
|---|---:|---:|---:|
| Homepage | **72 stuks, 7,77 MB** | 28 / 4,63 MB | 12,40 MB |
| `/huis-keuken/` (menubestemming) | **56 stuks, 3,75 MB** | 24 / 1,68 MB | 5,43 MB |
| `/thema-s/kerstpakketten-eindejaar/` | **3 stuks, 0,02 MB** | 11 / 5,78 MB | 5,80 MB |

Dat onderste getal is wat de plakronde van 30 oktober heeft opgeleverd: op de
themapagina's komt vrijwel niets meer vooraf binnen. Maar **de plakronde raakte
alleen onze eigen CMS-blokken**, en dat zijn de advertentielandingspagina's.
De categoriepagina's achter het menu zijn Shopware's eigen productoverzicht;
daar kunnen we met een HTML-blok niet bij.

Dus: wie op een advertentie binnenkomt landt op een opgeruimde pagina, en klikt
dan in het menu naar een pagina met 3,75 MB direct beeld. Van 0,02 naar 3,75 MB
in één klik. Dat is de sprong die als "niet soepel" voelt.

Alle 77 foto's op de categoriepagina zijn JPEG, nul webp of avif. Dat is punt 24
bij Promidata en staat nog open.

## Wat het níét is

- **Het offcanvas-menu.** 0,19 s en ongeveer 1 kB per niveau, elf keer gemeten.
- **Onze eigen JS.** Sectie 1.4c bouwt tegels en snelkoppelingen in het
  offcanvas-paneel, puur DOM-werk, geen netwerkverzoek. Wel een kanttekening,
  niet gemeten: de `MutationObserver` roept `offcanvasKlaar()` bij elke mutatie
  in het paneel, en die doet een `querySelectorAll` over het hele paneel. Tijdens
  een AJAX-wissel zijn dat meerdere mutaties achter elkaar. Op een paneel van
  deze omvang verwacht ik dat niet te merken, maar het is niet nagerekend.
- **Blokkerende scripts.** Nul op de categoriepagina; beide externe scripts
  hebben `defer`.

## Wat ik niet kon lezen

- **Het verkeer per pagina uit GA4.** De Rooted Goods-identiteit is verlopen
  ("Reauthentication is needed"), en opnieuw inloggen vraagt een browser. Daarmee
  kan ik niet hard maken hoeveel bezoekers die elf categoriepagina's per dag
  krijgen, en dus niet hoe vaak een bezoeker precies op een koude pagina landt.
  Het koud-zijn zelf is wel gemeten (negen van de elf), het hoe-vaak niet.
  Opnieuw inloggen: `CLOUDSDK_CONFIG=~/.config/gcloud-rootedgoods gcloud auth
  application-default login --scopes=…`, zie `bin/ga4-setup.md`.
- **De bewaartijd van de cache.** Alleen een ondergrens van dertien minuten.
  Een `ttl-monitor.sh` staat erbij, maar die stopte na één ronde omdat `sleep`
  in een achtergrondtaak werd afgekapt; `ttl.csv` bevat daarom één meetmoment.
- **De echte beleving op een telefoon over 4G.** Alles hier is TTFB en bytes
  vanaf een vaste verbinding. Wat een bezoeker ziet (LCP, INP) vraagt
  `bin/psi.sh`, en dat is hier niet gedraaid.
- **Of de S3-stylesheet elke navigatie opnieuw ophaalt.** Hij heeft geen
  `cache-control`, wat dat waarschijnlijk maakt, maar het is niet getoetst.

## Bestanden

| Bestand | Wat erin staat |
|---|---|
| `meet-menu.sh` | Het meetscript: per menu-item het widgetverzoek en de pagina, drie rondes. |
| `navids.txt` | De elf AJAX-menu-items met hun `navigationId` en bestemming. |
| `ruw.csv` | 66 metingen, de kern van punt 1. |
| `koud.csv` | Negen paginasoorten met cache-omzeiling. |
| `blokkerend.csv` | De vier renderblokkerende stylesheets. |
| `jsdelivr.csv` | Onze CSS en JS op jsDelivr, vijf rondes. |
| `beeld-home.csv`, `beeld-huis-keuken.csv`, `beeld-thema.csv` | Elke afbeelding met lazy-vlag en bytes. |
| `ttl-monitor.sh`, `ttl.csv` | De age-monitor die na één ronde stopte. |

## Een waarschuwing voor wie dit nameet

De categoriepagina's geven **403** als je de header `X-Requested-With:
XMLHttpRequest` meestuurt (Shopware varieert op `Accept`). Mijn eerste ronde
deed dat en leverde 30 keer een foutpagina van 0,25 s op, wat eruitziet als een
snelle site. Het widgetverzoek wíl die header juist hebben. `meet-menu.sh` zet
daarom per soort andere headers; laat dat zo.
