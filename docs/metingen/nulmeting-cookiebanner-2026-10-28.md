# Nulmeting cookiebanner, vóór de wijziging

Vastgelegd 28 oktober 2026, vlak voor het verwijderen van sectie 50 uit
`rootedgoods.css` (de center-modal met blur en scrollslot).

## Waar de aanrakingen heen gingen

Clarity, 1 t/m 27 oktober, mobiel.

| Pagina | Taps totaal | Taps op de cookiecontainer | Aandeel |
|---|---|---|---|
| Home, alleen betaald verkeer (`/?gad`) | 133 | **54** | **40,6%** |
| `/eindejaarsgeschenken` | 317 | **129** | **40,7%** |
| `/alle-producten/` | 811 | 96 | 11,8% |
| **Samen** | **1.261** | **279** | **22,1%** |

Taps op "Weigeren": **nul**, op alle drie de pagina's, in lijsten die doorlopen tot
elementen met één tik.

## Gedrag dat hiermee kan samenhangen

| | Home betaald | Kerstpagina | Catalogus |
|---|---|---|---|
| Paginaweergaven | 171 | 292 | 691 |
| Scrolldiepte gemiddeld | 28,6% | 32,0% | 66,7% |
| Actieve tijd | 15 s | 15 s | 15 s |

Afhaken op de betaalde homepage: 170 over bij 5% diepte, 147 bij 10%, **92 bij 15%**,
66 bij 25%, 18 bij 50%.

Op de kerstpagina valt de grootste stap tussen 20% en 25% diepte: 202 over, dan 111.
Dat is 91 bezoekers in één stap van 371 pixels, oftewel 45% van wie er dan nog was.

## Breder

| | |
|---|---|
| Paginaweergaven uit advertenties (filter `gad_`) | 841, waarvan 1 bot |
| GA4 Paid Search-sessies | 44 |
| GA4 Direct-sessies | 162 |
| Pagina's per sessie, betaald (GA4) | 2,73 |
| Aanvragen in de mailbox, oktober | 1 |
| Daarvan in GA4 terug te vinden | 0 |

## Hoe de nameting moet

Over veertien dagen, met **exact dezelfde filters**:

1. Clarity, filter `gad_`, dashboard: sessies, scrolldiepte, actieve tijd.
2. Clarity, filter `/?gad_`, mobiel: scroll-CSV en tikken-CSV.
3. Clarity, filter `/eindejaarsgeschenken`, mobiel: scroll-CSV en tikken-CSV.
4. GA4: `bin/ga4.sh --van <datum> --tot <datum>` voor pagina's per sessie en kanaalverdeling.

**Waar we op letten:** het aandeel taps op de cookiecontainer moet dalen, en het aandeel
weergaven met minstens één tap daarbuiten moet stijgen. Scrolldiepte zou moeten stijgen
op de twee landingspagina's.

**Wat dit niet is:** 54 taps op 171 weergaven is geen acceptatiepercentage van 32%. Het is
een bovengrens, want bij een INP van 500 ms tikken mensen dubbel. Vergelijk dus de
verhouding, niet het absolute percentage.

**Ruisgrens:** bij deze aantallen is een verschil onder de tien procentpunt geen bewijs.
