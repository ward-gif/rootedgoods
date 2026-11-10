# GA4-doorlichting, 10 november 2026

Property 551909322, gelezen als `ga4-lezer@rootedgoods-analytics.iam.gserviceaccount.com`
na herautorisatie op 10 november. Periode 6 oktober t/m 10 november 2026 (36 dagen),
tenzij anders vermeld. Alleen sessies waarin toestemming is gegeven: een ondergrens,
geen telling. Ruwe uitvoer: `ga4-standaard-2026-11-10.txt` (bin/ga4.sh),
`ga4-home.txt` en `ga4-home.json` (ga4-home.py, 18 vragen gemeten, 1 niet).

## Is de meetketen heel?
- Er staan sessies op alle 36 dagen (2 tot 26 per dag). Geen gat, geen dag zonder events.
- Eén hostname (`rootedgoods.eu`), dus geen staging of testverkeer in de property.
- Ads komt binnen als `google / cpc`: 234 sessies, dus auto-tagging werkt.
- Consentverlies: in het Ads-venster 29 okt t/m 9 nov telt GA4 170 Paid Search-sessies
  tegenover 519 Ads-klikken (Fable, uit de Ads-API). Dat is 32,8%. Elke GA4-uitkomst hieronder
  geldt dus voor ongeveer een derde van de betaalde klikken.
- `generate_lead` is het enige gemarkeerde key event naast `purchase`. Alle events met
  `keyEvents > 0`: `generate_lead` 3, `purchase` 1.

## Wat nog steeds niet klopt
- **Leads:** 3 `generate_lead` in 36 dagen, door 2 gebruikers, alle drie op
  `/poconfigurator/request` en `/poconfigurator/request/cart`. Alle key events van het kanaal
  Paid Search: 0, bij 234 sessies (mobiel 216). Direct desktop heeft er 4 (3 leads, 1 `purchase`).
  Dat is te weinig om iets over een kanaal te zeggen; het betekent alleen dat er geen
  betaalde lead zichtbaar is.
- **`/contact`:** 12 weergaven door 7 gebruikers, 0 `form_start`, 0 `form_submit`, 0 `contact`.
  Op 3 november stond dit ook op nul (`docs/gtm/OPEN.md`).
- **`/offerte`:** 8 weergaven door 6 gebruikers, geen formulier-events op die pagina.
  De leads ontstaan via de configurator-flow (`/poconfigurator/request`), niet op `/offerte` zelf.
- **`form_start` en `form_submit` meten deels de zoekbalk.** Van 81 `form_start` staan er 13 op
  `/` en `/search` (twee pagina's waar alleen de zoekbalk een formulier is); `form_submit` heeft
  10 van 20 op die twee pagina's. Voor het product-aanvraagformulier zijn ze dus niet bruikbaar zonder
  het `form_id`. Gebruik `generate_lead` als leadmaat.
- **Itemlijsten per lijstnaam** (`itemListName`) kon niet gemeten worden: de API weigert de
  combinatie met de beschikbare metrics. Of de hero, de slider en de themategels apart meten is
  daarmee niet vast te stellen. `select_item` staat op `/` maar 2 keer (2 gebruikers).

## Wat de home doet (voor het homeadvies)
| Maat | Waarde | Basis |
|---|---:|---|
| Sessies met de home als landing | 102 van 469 (21,7%) | alle kanalen, 36 dagen |
| waarvan Paid Search mobiel | 53 | engagement 94,3% (50 van 53) |
| Weergaven van `/` | 238 (mobiel 170, desktop 63, tablet 5) | `page_view`, pagePath `/` |
| Weergaven met de home als verwijzer naar een andere pagina | 122 (51,3% van 238) | `pageReferrer` is exact de home |
| daarvan thema-pagina's (incl. `/alle-thema-s` en `/thema-s/`) | 31 (25,4%) | zelfde 122 |
| daarvan `/alle-producten/` | 33 (27,0%) | zelfde 122 |
| daarvan `/search` | 8 (6,6%) | zelfde 122 |
| `scroll` (90%-diepte) op de home | 12 events (mobiel 5, desktop 7) | tegenover 238 weergaven; te grof, Clarity blijft de bron voor scrolldiepte |

Let op de noemer: 122 is het aantal paginaweergaven met de home als directe verwijzer, niet het
aantal sessies dat doorklikte. Een bezoeker die twee pagina's na de home bekijkt telt één keer.
De 25,4% thema-pagina's ligt dicht bij de ongeveer 23% die Clarity (oktober, betaalde mobiele home)
gaf, op een andere meetbasis; samen zijn ze consistent maar niet hetzelfde getal.

## Wat dit voor het homeadvies betekent
1. De nulmeting is bruikbaar voor de doorstroom vanaf de home (pageReferrer) en voor `generate_lead`.
   Niet bruikbaar zijn `form_start`, `form_submit` en alles op `/contact` zonder dat eerst
   te repareren.
2. De doorstroom-maat uit het advies (tweede pagina per groep via pageReferrer) kan nu wel:
   thema-pagina's 25,4% van de 122 vervolgweergaven. Dat is de baseline voor de acceptatie
   "minstens 40%".
3. Bij 3 leads in 36 dagen is een uitspraak over leads pas na maanden mogelijk. De proxy blijft
   de doorstroom naar de thema-pagina's, zoals Fable al voorstelde.

## Niet vastgesteld
- Of de configurator-flow (`/poconfigurator/request`) het enige pad is waarlangs een lead
  ontstaat, of dat `/offerte` en `/contact` iets versturen dat niet meetelt.
- Hoeveel van de 238 weergaven van `/` een terugkeer van een andere pagina zijn.
- Search Console: `bin/gsc.sh` draait weer zonder fout (11 okt t/m 8 nov, `sc-domain:rootedgoods.eu`),
  uitvoer in `gsc-standaard-2026-11-10.txt`. Het is niet doorgelicht voor het homeadvies; de zoekvragen zijn
  merkgebonden en klein (de bovenste is 'rooted goods', 13 vertoningen, 6 klikken).
