# Tweede meting na de performance-update van Promidata, 6 november 2026

Aanvulling op `../2026-11-06-na-promidata-update/`. Gemeten tussen 14:37 en 14:45,
ongeveer 35 minuten na de eerste meting, met dezelfde scripts en user-agent.

## Eerste byte, de elf menucategorieen

| Moment | Eerste bezoek, mediaan | Slechtste |
|---|---:|---:|
| woensdag 4 nov, 08:30 | 3,19 s | 5,68 s |
| vrijdag 6 nov, 14:01 | 1,09 s | 1,41 s |
| vrijdag 6 nov, 14:37 | 0,20 s | 0,24 s |

**De rij van 14:37 is geen koude meting.** Die pagina's had ik om 14:01 zelf opgewarmd; de
`age`-header laat dat zien (2168 tot 2176 s, dus 36 minuten). Gebruik die rij niet als
verbetering. Wel geldig: de koude test met cache-omzeiling hieronder.

## Cache-bewaartijd: minstens 114 minuten

Drie categorieen (Drinkwaren, Tassen & Reizen, Elektronica) hadden om 14:37 een `age` van
6824 tot 6826 s. Dat zijn dezelfde drie die om 14:01 al 4648 tot 4652 s oud waren, en ze zijn
niet ververst. Een pagina blijft dus minstens **114 minuten** uit de cache komen. De
ondergrens van 13 minuten (4 november) is daarmee achterhaald. De werkelijke bewaartijd is
niet bepaald.

## Koud, alleen de HTML (`?rgkoud=...`), tijd tot de eerste byte

| Pagina | 4 nov | 6 nov 14:02 | 6 nov 14:40 |
|---|---:|---:|---:|
| `/` | 1,80 s | 1,23 s | 1,03 s |
| `/drinkwaren/` | 1,69 s | 0,97 s | 0,71 s |
| `/huis-keuken/` | 1,63 s | 0,60 s | 0,74 s |
| `/kleding-textiel/` | 1,26 s | 0,64 s | 0,61 s |
| `/alle-producten/` | 1,69 s | 0,70 s | 0,64 s |
| `/thema-s/kerstpakketten-eindejaar/` | 0,96 s | 0,68 s | 0,46 s |
| `/merken/` | 0,46 s | 0,40 s | 0,67 s |
| `/over-ons` | 0,44 s | 0,36 s | 0,42 s |
| een productpagina | 0,95 s | 0,73 s | 0,46 s |
| `/eindejaarsgeschenken` | | | 0,45 s |

## PageSpeed Insights, mobiel, mediaan van drie runs

Nulmeting 27 oktober tegen 6 november 14:38 (`psi-2026-11-06_1438-mobile-...json`).

| Pagina | Score | LCP | FCP | TBT |
|---|---|---|---|---|
| `/` | 37 -> **63** | 31,6 s -> **11,7 s** | 4,1 s -> 2,6 s | 1,2 s -> 0,2 s |
| `/eindejaarsgeschenken` | 46 -> **60** | 10,4 s -> **10,5 s** | 4,1 s -> 2,4 s | 0,6 s -> 0,3 s |
| `/alle-producten/` | 37 -> **75** | 27,7 s -> **2,6 s** | 4,2 s -> 2,6 s | 1,1 s -> 0,5 s |
| `/offerte` | 60 -> **72** | 9,2 s -> **4,4 s** | 3,9 s -> 2,4 s | 0,2 s -> 0,4 s |

**Voorbehouden, alle drie belangrijk:**

1. **De PageSpeed-score is niet alleen de server.** Tussen 27 oktober en 6 november hebben
   wij zelf aan de voorkant gewerkt: de cookiemodal met blur is op 28 oktober weggehaald,
   er zijn GTM-tags bij gekomen, en op 4 november is nieuwe CSS gepubliceerd. De eerste-byte-
   metingen hierboven meten wel alleen de server (curl, geen cache); gebruik die voor
   uitspraken over Promidata.
2. **De drie runs per pagina zijn identiek** (63, 63, 63; 60, 60, 60; 75, 75, 75). In
   oktober schommelden ze (46, 37, 37). Dat kan een stabielere server zijn, of een
   gecachet PageSpeed-resultaat. Niet uit te sluiten.
3. PageSpeed simuleert een trage telefoon; de absolute getallen zijn niet wat een echte
   bezoeker ziet.

## Waarom de kerstpagina niet verbeterde (aparte run, ruwe uitvoer bewaard)

`psi-kerst-ruw.json`, twee runs: 60 en 55, LCP 10,3 en 10,0 s.

- **Het document zelf is snel**: 20 ms (Lighthouse "root document took 20 ms").
- **Het LCP-element** is `img.rg-page-hero__img--c` ("Bedankkaartje in een geschenkdoos"),
  180 x 260 px op mobiel, in onze eigen oude hero. Het is niet lazy en wel vindbaar in de
  HTML, maar heeft **geen `fetchpriority=high`**. Dat zit in `blokken-def/
  thema-eindejaarsgeschenken.html`, dus bij ons. Het nieuwe band-blok heeft geen hero-beeld.
- **Beeldlevering**: 1.098 KiB te winnen. De slider-miniaturen zijn 800 x 800 PNG van circa
  378 KB en worden getoond op 98 x 98 px (en 252 KB voor 144 x 95). Dat is het
  `sizes`-attribuut (D2) en het ontbrekende webp (D1) op de Promidata-lijst.
- Totaal gewicht van de pagina: 2.451 KiB.

## Niet gemeten

- Een echte telefoon of echte gebruikersdata (CrUX/Clarity).
- Andere tijdstippen van de dag dan 14:00 tot 15:00 op een vrijdag.
- Afrekenen, `/offerte` indienen, zoeken.
- Of de LCP in PageSpeed (10 s, gesimuleerd) overeenkomt met wat bezoekers zien; de
  LCP-fasen in dezelfde run optellen tot ruim 2 s, wat suggereert dat de gesimuleerde
  vertraging veel van die 10 s verklaart.
