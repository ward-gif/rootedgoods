# Kanaalverdeling, en wat de toestemmingsreparatie deed

Gemeten 3 november 2026 met `bin/ga4.sh`, property 551909322.

Ward vroeg naar de verdeling tussen Google Ads en direct verkeer. Het maandcijfer
geeft daar een fout antwoord op, en het waarom is op zichzelf de belangrijkste
uitkomst.

## Voor en na

De toestemmingsreparatie uit werkruimte 16 van GTM is rond 28 oktober gepubliceerd
(zit in containerversie 18). Daarvoor bleef toestemming na het accepteren op `false`
tot een herlaadbeurt, waardoor de landingspagina van een advertentieklik nooit
meetelde. Zie `docs/gtm/toestemming-bijwerken.md`.

**1 t/m 26 oktober, 26 dagen, vóór:**

| Kanaal | Sessies | Aandeel | Betrokkenheid |
|---|---:|---:|---:|
| Direct | 163 | **73%** | 73,6% |
| Paid Search | 37 | **17%** | 56,8% |
| Organic Search | 21 | 9% | 38,1% |
| Unassigned | 1 | | |
| **Totaal** | **222** | | |

**28 oktober t/m 2 november, 6 dagen, erna:**

| Kanaal | Sessies | Aandeel | Betrokkenheid |
|---|---:|---:|---:|
| Paid Search | 94 | **78%** | 96,8% |
| Direct | 21 | **18%** | 76,2% |
| Organic Search | 3 | 2% | 66,7% |
| Cross-network | 1 | | |
| Unassigned | 1 | | |
| **Totaal** | **120** | | |

Per dag:

| | Vóór | Erna | Factor |
|---|---:|---:|---:|
| Betaalde sessies | 1,4 | **15,7** | **11×** |
| Directe sessies | 6,3 | 3,5 | 0,6× |

## Wat dat betekent

**De verhouding is omgeklapt**, van 73% direct naar 78% betaald. Dat is vrijwel zeker
geen verkeersverandering maar een meetverandering, en wel om drie redenen:

1. Een advertentiebudget gaat niet maal elf in een week.
2. **Direct daalt in absolute zin** terwijl betaald stijgt. Bij meer budget zou direct
   gelijk blijven. Dat direct halveert terwijl betaald vertienvoudigt is het patroon
   van verkeer dat opnieuw wordt toegewezen, niet van nieuw verkeer.
3. De betrokkenheid van betaald springt van 56,8% naar 96,8%. Meer budget verandert dat
   niet; het volledig meten van een sessie vanaf de landingspagina wel.

**Wat we niet kunnen uitsluiten:** een deel van de stijging kan echte Q4-opschaling van
het advertentiebudget zijn. Om dat te scheiden hebben we het aantal Ads-klikken per dag
nodig, en het Rooted Goods-advertentieaccount zit niet bij de accounts die via de
Google Ads-koppeling bereikbaar zijn (alleen Bambook NL, DE en MCC).

## Het antwoord op de vraag

**Gebruik niet het maandcijfer.** Oktober als geheel zegt 59% direct en 33% betaald, en
dat is een artefact van de kapotte toewijzing in de eerste 26 dagen.

**De huidige verdeling is ongeveer 78% betaald, 18% direct, 2% organisch.** Dat is de
stand sinds de reparatie werkt.

Dat sluit ook aan bij wat Search Console zegt: 20 organische klikken in heel oktober.
Vrijwel al het verkeer dat binnenkomt, is gekocht.

## Wat hier nog onder zit

`docs/diagnose-2026-10.md` stelde vast dat GA4 **41 van 841 betaalde paginaweergaven**
zag, ongeveer 5%, tegenover 740 advertentieklikken in oktober. Die kloof is nu een stuk
kleiner maar niet weg: er blijven bezoekers die toestemming weigeren of een adblocker
gebruiken. Hoe groot die rest is, is pas te zeggen met de Ads-klikken van dezelfde
dagen ernaast.
