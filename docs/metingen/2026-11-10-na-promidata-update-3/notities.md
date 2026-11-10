# Derde meting na de performance-update van Promidata, dinsdag 10 november 2026

Gemeten 09:16 tot 09:17, met `meet.sh`, dezelfde iPhone-user-agent en curl-methode als
4 en 6 november. Alleen tijd tot de eerste byte van de HTML; geen PageSpeed, geen echte
telefoon. 11 menucategorieen eerst, daarna dezelfde 11 direct opnieuw, daarna 10 pagina's
twee keer met cache-omzeiling (`?rgkoud=`). In totaal 62 verzoeken.

## Eerste bezoek zonder cache-omzeiling (n = 11)

Zes van de elf kwamen al uit de cache (age 1616 tot 4655 s, dus 27 tot 78 minuten oud;
iemand of iets anders had ze al geladen). Die zijn geen koud bezoek. De overige vijf
(age 0 of 1) zijn dat wel:

| | n | mediaan | slechtste |
|---|---:|---:|---:|
| Koud (age 0 of 1) | 5 van 11 | 1,12 s | 1,34 s |
| Al in cache | 6 van 11 | 0,20 s | |
| Alle elf door elkaar | 11 | 0,54 s | 1,62 s |
| Tweede bezoek direct erna | 11 | 0,22 s | 0,48 s |

De 1,62 s is Drinkwaren met age 2284: een cachehit die toch 1,6 s duurde. Een uitschieter,
niet herhaald (tweede bezoek 0,20 s).

## Koud met cache-omzeiling (n = 20, tien pagina's twee keer)

Mediaan 0,60 s, slechtste 0,98 s. Per pagina in `koud.csv`.

## Vergelijking koud, tijd tot eerste byte

| Moment | n | Eerste bezoek, mediaan | Slechtste |
|---|---:|---:|---:|
| woensdag 4 nov, 08:30 | 11 | 3,19 s | 5,68 s |
| vrijdag 6 nov, 14:01 | 11 | 1,09 s | 1,41 s |
| dinsdag 10 nov, 09:16 | 5 koud van 11 | 1,12 s | 1,34 s |

Cache-omzeiling, HTML alleen: home 1,80 s (4 nov) -> 1,23 s (6 nov) -> 0,96 en 0,67 s (10 nov);
drinkwaren 1,69 -> 0,97 -> 0,98 en 0,62 s.

## Conclusie

Vergeleken met 6 november is er niets merkbaar veranderd: koud 1,1 s, warm 0,2 s. De
verbetering van 4 naar 6 november is gebleven. Het gat tussen koud en warm (ongeveer 1 s,
op de categoriepagina's soms 5x) is er nog. Dat is wat Noah "het eerste bezoek is trager"
noemde en waar Promidata aan werkt.

## Niet gemeten

- Beeldgewicht en PageSpeed (de slider-miniaturen). Noah's ticket is net aangemaakt; er is
  nog geen reden voor een nieuwe PSI-run, en ons eigen front-end is sinds 6 november niet
  gepubliceerd, dus een nieuwe run zou geen verandering kunnen tonen.
- Een echte telefoon, echte gebruikersdata, andere tijdstippen dan dinsdagochtend.
- n = 5 koude eerste bezoeken is klein; de mediaan 1,12 s heeft grote marge.
