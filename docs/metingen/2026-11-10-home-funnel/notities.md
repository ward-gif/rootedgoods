# Home-funnel, metingen van 10 november 2026

Ruwe uitvoer bij `docs/home-funnel-advies-2026-11-10.md`. Geen conclusies hier, wel
precies wat er gedaan is en wat niet kon, zodat een getal later nog na te rekenen is.

## Wat er NIET kon: GA4 en Search Console

`bin/ga4.sh` en `bin/gsc.sh` breken allebei af met
`Reauthentication is needed. Please run gcloud auth application-default login`.
De Application Default Credentials in `~/.config/gcloud-rootedgoods/` (laatst
geschreven 3 november) zijn verlopen en vernieuwen kan alleen interactief, in een
browser. Dat heb ik niet gedaan en kan ik niet doen. Herstellen (Ward, één keer):

```bash
export CLOUDSDK_CONFIG=~/.config/gcloud-rootedgoods
gcloud auth application-default login \
  --impersonate-service-account=ga4-lezer@rootedgoods-analytics.iam.gserviceaccount.com
bin/ga4.sh --van 2026-10-29 --tot 2026-11-09
```

Gevolg: alles wat alleen GA4 weet ontbreekt in deze map: de tweede pagina na de home
(`pageReferrer` = home), landingssessies op `/` per kanaal en apparaat,
`form_start`/`generate_lead` met de home als verwijzer, en de huidige kanaalverdeling.
De GA4-gegevens zelf gaan niet verloren; ze zijn later over dezelfde periode op te
vragen. In het advies staat per getal welke bron het wél heeft.

## Wat er wel is gedaan

1. **Live HTML van de home**, iPhone-UA en desktop-UA, met cache-buster `?rgkoud=`
   (scratchpad, niet bewaard: 496 kB per stuk). Beide identiek op de script-nonces na,
   dus de sectievolgorde is op mobiel en desktop dezelfde DOM; verschillen zitten alleen
   in CSS. Sectievolgorde en inhoud staan in het advies, deel 1.
2. **Live meting in headless Chromium** (`meet-home.mjs`, chrome-headless-shell 1234
   uit de Playwright-cache, Node 24). Vers profiel per draai, dus de Shopware-cookiebalk
   staat open zoals bij een eerste bezoek. Tracking geblokkeerd (`googletagmanager`,
   `google-analytics`, `clarity.ms`, `apollo.io`, `doubleclick`, `facebook`, `cal.com`,
   `leadinfo`, `googleadservices`), zodat deze vijf paginaladingen niet in GA4 of
   Clarity terechtkomen. Viewports 375 × 667, 390 × 844, 430 × 932 (mobiel, dpr 2,
   iPhone-UA), 1280 × 800 en 1440 × 900 (desktop, dpr 1). Uitvoer: `live.json`,
   `live-<b>x<h>.png` (eerste scherm met cookiebalk) en `live-<b>-lang.png` (0 tot
   1800 px). Alle y-waarden zijn CSS-px vanaf de bovenkant van de pagina.
3. **Clarity-API, laatste 3 dagen** (7 t/m 9 november), dimensies URL × Device, ruw
   bewaard als `clarity-3dagen-url-device-2026-11-10.json` via `clarity-ruw.py` (één
   aanroep van de tien per dag). `clarity-url-device-3dagen.txt` is de afgekapte
   uitvoer van `bin/clarity.sh` van dezelfde aanroep; gebruik de JSON.
4. **Clarity-exports van oktober** opnieuw gelezen uit `docs/metingen/clarity-2026-10/`,
   nu per element: de tikken-CSV van de betaalde mobiele home (`/?gad`, 171
   weergaven) en van de directe home (`is precies https://rootedgoods.eu/`, 31
   weergaven), plus de scroll-CSV en het dashboard van de betaalde home. Let op: dit is
   gemeten mét de oude cookiemodal (tot 28 oktober), zie
   `docs/plan-cookiebalk-2026-11-06.md`.
5. **Google Ads**, account 9393286984 via de MCP-koppeling op de Bambook-MCC, periode
   29 oktober t/m 9 november: klikken en kosten per landingspagina en apparaat, en per
   campagne. Bewaard als `ads-landingspaginas-2026-10-29-tot-2026-11-09.json`.
6. **Linkcontrole**: de 19 bestemmingen waar de home en het themaoverzicht naar
   verwijzen gaven allemaal `HTTP 200` zonder omleiding (curl, iPhone-UA, 10 november).
7. **CDN-controle**: `rootedgoods.min.css@main` (228.755 bytes, 10 november na de
   publicaties van die dag) bevat `rg-page-hero--band` 79 keer, `rg-page-hero__cijfers`
   5 keer en de verbergregel voor `rg-hero-v2__kicker`. De band-CSS staat dus live; de
   kickers in de live home-HTML zijn er nog maar worden door de CSS verborgen.

## Kerngetallen uit `live.json`

| | 375 × 667 | 390 × 844 | 430 × 932 | 1280 × 800 | 1440 × 900 |
|---|---:|---:|---:|---:|---:|
| header tot | 95,6 | 95,6 | 95,6 | 140,4 | 140,4 |
| cookiebalk hoogte | 245,2 | 245,2 | 169,1 | 67,1 | 67,1 |
| vrij boven de balk | 422 | 599 | 763 | 733 | 833 |
| hero (`.rg-hero-v2`) | 138 tot 903 | 138 tot 873 | 138 tot 859 | 176 tot 716 | 176 tot 758 |
| H1, regels | 4 | 3 | 2 | 3 | 2 |
| H1 onderkant | 316 | 275 | 233 | 401 | 394 |
| knop "Vraag een offerte aan" | 372 tot 428 | 331 tot 386 | 289 tot 344 | 537 tot 592 | 530 tot 586 |
| mozaïektegels | 506 tot 760 | 464 tot 729 | 423 tot 715 | 200 tot 692 | 221 tot 713 |
| Richard | 814 tot 871 | 784 tot 841 | 770 tot 827 | 631 tot 688 | 624 tot 681 |
| sectie "Cadeaus per moment" begint | 1015 | 987 | 979 | 828 | 876 |
| kop "Cadeaus per moment" | 1133 | 1105 | 1097 | 946 | 994 |
| Europa-statement | 1959 | 1956 | 2015 | 1504 | 1600 |
| productslider "Ontdek Europese producten" | 2833 | 2840 | 2925 | 2324 | 2459 |
| Waarom Rooted Goods | 3375 | 3387 | 3451 | 2946 | 3042 |
| Zo werkt het | 4319 | 4310 | 4382 | 3543 | 3620 |
| Services | 5213 | 5215 | 5248 | 4119 | 4198 |
| Eind-CTA | 6244 | 6250 | 6364 | 4939 | 5020 |
| paginahoogte | 7830 | 7730 | 7808 | 6197 | 6298 |
| klikbaar boven de vouw / boven de balk | 14 / 4 | 15 / 8 | 15 / 10 | 23 / 19 | 23 / 19 |

De vier die op 375 × 667 boven de cookiebalk klikbaar zijn: menu, logo, zoeken,
winkelmandje. De offerteknop eindigt op 428 en de balk begint op 422.

De logo-carrousel (Shopware-element `cms-element-custom-cms-slider`, 23 beelden, 20
van `bambook.08.promidata.shop`) staat in dezelfde CMS-sectie als de hero, onder
Richard, op circa 903 tot 1015 op 375 px; `meet-home.mjs` mat hem als niet zichtbaar
omdat de carrousel zijn beelden pas na de thema-JS toont. Op de lange schermafdruk
staat hij wel.

## Clarity oktober, betaalde mobiele home (`/?gad`), 1 t/m 27 oktober

171 paginaweergaven, 133 tikken, dashboard 231 sessies (0 bots). Mét cookiemodal.

Scroll: 170 voorbij 5%, 147 voorbij 10%, 92 voorbij 15%, 87 voorbij 20%, 66 voorbij
25%, 48 voorbij 30%, 29 voorbij 40%, 18 voorbij 50%, 12 voorbij 70%, 10 voorbij 80%,
5 tot 100%. Gemiddeld 28,6%, actieve tijd 15 s, totale tijd 38 s.

Tikken per element (selector uit de CSV, met de DOM van de hero: `SECTION > DIV.inner >
DIV[2] = mozaïek > DIV[1] = kolom Opinel/Bambook, DIV[2] = kolom Rebottled/Janzen`):

| Gebied | Element | Tikken |
|---|---|---:|
| cookiebalk | Accepteren | 54 |
| hero, mozaïek | Janzen-tegel (link 6, beeld 3, bijschrift 3) | 12 |
| hero, mozaïek | Opinel-tegel (link 5, beeld 4, bijschrift 1) | 10 |
| hero, mozaïek | Bambook-tegel (beeld 5, link 1) | 6 |
| hero, mozaïek | Rebottled-tegel (beeld 4, link 2) | 6 |
| hero, knoppen | "Bekijk alle producten" | 5 |
| hero, knoppen | "Vraag een offerte aan" | 3 |
| thema-tegels | Kerst & eindejaar (grote tegel) | 12 |
| thema-tegels | tegel 4 (Medewerker merchandise) | 3 |
| thema-tegels | tegel 3 (Events & conferenties) | 2 |
| thema-tegels | tegel 2 (Onboarding & welkom) | 1 |
| productslider | pijl volgende (3 + 2) | 5 |
| productslider | knop "Bekijk alle producten" in de slider | 2 |
| productslider | productnaam | 1 |
| header | zoeken 4, menu 1, top-bar 2 | 7 |
| Europa-statement | subregel (geen link) | 1 |
| footer | kolomkop | 1 |
| **som** | (CSV telt 131 van 133; twee tikken staan niet in de lijst) | 131 |

Zonder de cookiebalk: 77 tikken, waarvan 34 op een producttegel in de hero (44%), 18
op een thema-tegel (23%, 12 op Kerst), 8 op de slider, 8 op de hero-knoppen (3 op
offerte), 7 op de header.

Directe mobiele home (`is precies https://rootedgoods.eu/`, 31 weergaven, 43 tikken):
cookie 6, "Bekijk alle producten" 5, slider-pijl 5, menu en offcanvas 13, thema-tegels
5 (Kerst 2, Onboarding 2, Merchandise 1), mozaïek 4, offerte 1, Richard 1.

Dashboard betaalde home: slimme gebeurtenissen "Formulier verzenden" 2, "Contact met
ons opnemen" 1, "Offerte aanvragen" 1, op 231 sessies. Browsers: MobileSafari 65,
ChromeMobile 50, FacebookApp 35, GoogleApp 22, InstagramApp 18 (de in-app-browsers zijn
zoekpartnerverkeer, zie de diagnose). Verwijzers: google.com 173, syndicatedsearch.goog
54.

## Clarity 7 t/m 9 november (API), home

Site: 486 sessies (17 bots), 282 mobiel, 203 PC, 1 tablet. 133 sessies met `gad_` of
`gclid` in de URL (ondergrens voor betaald, alleen de landings-URL telt).

Home (pad `/`, alle query-varianten samengenomen), scrolldiepte gewogen naar sessies
per URL-rij, tijd per sessie:

| Apparaat | Herkomst | Sessies | Scrolldiepte | Actief | Totaal |
|---|---|---:|---:|---:|---:|
| mobiel | betaald (`gad_`/`gclid`) | 50 | 24,0% | 14,7 s | 21,2 s |
| mobiel | niet-betaald | 16 | 24,7% | 0,8 s | 0,9 s |
| PC | betaald | 7 | 65,7% | 180,6 s | 592 s |
| PC | niet-betaald | 29 | 29,4% | 0,7 s | 5,0 s |

De 29 PC-sessies zonder advertentieparameter met 0,7 s actieve tijd zijn vrijwel zeker
eigen bezoeken (de werkdag van 10 november begon met Resource Override-werk aan deze
site op een Mac); ze tellen niet als bezoekersgedrag.

Paden met 3 of meer sessies in die drie dagen: `/` 102, `/alle-producten/` 91,
`/thema-s/kerstpakketten-eindejaar/` 59, `/eindejaarsgeschenken` 27, `/huis-keuken/` 14,
`/merken/` 14, `/over-ons` 12, `/drinkwaren/` 9, één kerstbal-PDP 9, `/alle-thema-s` 7,
`/search` 6, `/onboarding-welkomstpakket` 4, `/contact` 4, `/outdoor/` 4,
`/kantoor-schrijfwaren/` 4, `/sport-spel/` 3, `/eten-drinken/` 3. De andere
themapagina's (events, merchandise, dag van de leraar, brievenbus, made-in-nl) komen in
drie dagen niet boven de 2.

Let op: Clarity telt paginaweergaven als sessies (diagnose, paragraaf 9). "Sessies"
hierboven zijn dus weergaven van die URL.

## Google Ads, 29 oktober t/m 9 november (12 dagen)

519 klikken, € 910,79. Home als eind-URL: 149 klikken (109 mobiel + 21 desktop + 2
tablet op `https://rootedgoods.eu/`, plus 17 mobiel op `https://rootedgoods.eu` zonder
slash), € 237,94, 28,7% van de klikken, 84,6% mobiel. Kerst (`/eindejaarsgeschenken`
157 plus `/thema-s/kerstpakketten-eindejaar/` 66) 223 klikken, `/alle-producten/` 138,
`/merken/` 9. Conversies in Ads: 1, op `/alle-producten/` desktop.

## Live tekstherhalingen (main van de home, 10 november)

"wat je zoekt" 7 keer, "Vraag een offerte aan" 2, "Offerte aanvragen" 1, "Bekijk alle
producten" 2, "Zelf producten zoeken" 1, "Hi, ik ben Richard" 2, "binnen één werkdag"
2, "drukproef" 2. Links in `<main>`: naar `/offerte` 4, naar `/alle-producten/` 3, naar
`/contact` 2. De header heeft daarbovenop "Offerte aanvragen" (desktop) en de
top-bar-USP "Gratis offerte op maat".

## Bestanden

| Bestand | Wat |
|---|---|
| `meet-home.mjs` | de live meting; `node meet-home.mjs <label>`; `VP="375x667"` beperkt de viewports |
| `live.json`, `live-*.png` | uitvoer van die meting, 10 november |
| `clarity-ruw.py` | bewaart de Clarity-API-uitvoer volledig als JSON |
| `clarity-3dagen-url-device-2026-11-10.json` | ruwe Clarity-uitvoer 7 t/m 9 november |
| `clarity-url-device-3dagen.txt` | dezelfde aanroep, afgekapt door `bin/clarity.sh` |
| `ads-landingspaginas-2026-10-29-tot-2026-11-09.json` | Ads per landingspagina en campagne |

## Voorbehouden bij alles hierboven

- Headless Chromium is geen telefoon: geen Safari-adresbalk (die kost op een iPhone
  nog eens circa 80 tot 100 px van de 844), geen echte aanraking, geen thema-fonts
  anders dan wat de site zelf laadt. De cookiebalkhoogte van 245 px klopt met de
  replica van 5 november.
- De oktober-tikken zijn gemeten onder de modal met scrollslot; op iOS scrolde de
  pagina wel door. Verhoudingen tussen elementen zijn bruikbaar, absolute percentages
  niet.
- De Clarity-API geeft drie dagen; 50 betaalde mobiele homesessies is te weinig voor
  meer dan een richting.
- Ads-conversies worden op klikdatum geteld en zeggen niets over de home als pagina.
