# Meting na de performance-update van Promidata, 6 november 2026

Promidata meldde op 6 november dat er performance-updates zijn doorgevoerd en vroeg om
te controleren of de webshop weer sneller laadt. Dit is dezelfde meting als op 4 november
(`docs/metingen/2026-11-04-menutraagheid/`), met dezelfde scripts, dezelfde elf
menucategorieen en dezelfde iPhone-user-agent. `curl` heeft geen browsercache, dus dit
komt overeen met een incognitovenster.

Gemeten op vrijdag 6 november tussen 14:01 en 14:03, vanaf een kantoorverbinding in
Nederland. Voor-meting: woensdag 4 november, 08:29 tot 08:40. **Niet hetzelfde tijdstip
en niet dezelfde belasting op de server;** een deel van het verschil kan daar vandaan
komen. Er zit 0,4 s pauze tussen de verzoeken (4 november niet), om geen firewall te
raken.

## Uitkomst

Elf categoriepagina's, drie rondes achter elkaar, time-to-first-byte:

| Ronde | 4 nov mediaan | 4 nov slechtste | 6 nov mediaan | 6 nov slechtste |
|---|---:|---:|---:|---:|
| 1 (koude eerste bezoeken) | **3,19 s** | 5,68 s | **1,09 s** | 1,41 s |
| 2 | 0,20 s | 0,24 s | 0,19 s | 0,22 s |
| 3 | 0,21 s | 0,27 s | 0,21 s | 0,23 s |

Boven 1 seconde: 8 van 11 in ronde 1 (was), 6 van 11 (nu). Het menu-verzoek zelf
(`/widgets/menu/offcanvas`): 0,19 s (was) en 0,21 s (nu), dus ongewijzigd en nooit het
probleem geweest.

Koud met cache-omzeiling (`?rgkoud=...`, alleen de HTML koud):

| Pagina | 4 nov | 6 nov |
|---|---:|---:|
| `/` | 1,80 s | 1,23 s |
| `/drinkwaren/` | 1,69 s | 0,97 s |
| `/huis-keuken/` | 1,63 s | 0,60 s |
| `/kleding-textiel/` | 1,26 s | 0,64 s |
| `/alle-producten/` | 1,69 s | 0,70 s |
| `/thema-s/kerstpakketten-eindejaar/` | 0,96 s | 0,68 s |
| `/merken/` | 0,46 s | 0,40 s |
| `/over-ons` | 0,44 s | 0,36 s |
| een productpagina | 0,95 s | 0,73 s |

## Wat dit zegt en niet zegt

- **Beter, niet opgelost.** Een koud eerste bezoek is gemiddeld 1,1 s in plaats van 3,2 s,
  maar een warm bezoek is 0,2 s. Dat verschil van een factor vijf is er nog.
- **De homepage blijft het zwaarst koud** (1,23 s), terwijl die het meeste verkeer krijgt.
- **Drie categorieen waren al warm** (Drinkwaren, Tassen & Reizen, Elektronica): `age`
  4648 tot 4652 seconden, alle drie binnen vier seconden van elkaar. Dat is geen
  bezoeker maar een gelijktijdige actie, circa 77 minuten voor mijn meting. Een
  cache-warmer of een test van Promidata zelf is een voor de hand liggende verklaring;
  dat is een hypothese en niet gemeten. Als het een warmer is, werkt hij voor die drie
  en niet voor de andere acht.
- **Oorzaak niet toe te schrijven.** Ik weet niet wat Promidata veranderd heeft. Het
  verschil is gemeten, de oorzaak niet.

## Niet gemeten

- Een echte browser: geen LCP, INP, laadtijd van het beeld. De 3,75 MB direct beeld op een
  categoriepagina (4 november) is niet opnieuw gemeten; dat hoorde bij punt B1 en D2 en
  niet bij deze update.
- Andere tijdstippen. Eén meting op een vrijdagmiddag zegt niets over de ochtendspits.
- De sitemap, `/offerte`, het afrekenen en het bestelproces.
