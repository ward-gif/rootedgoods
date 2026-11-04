# De getallen onder het feitenblok in de hero, 4 november 2026

Het feitenblok in `zandbak/hero.html` zet drie dingen boven de vouw. Twee daarvan
zijn hier nagemeten, de derde niet. Dat onderscheid is de reden dat dit bestand
bestaat.

## Wat er gemeten is

De elf producten in `/thema-s/kerstpakketten-eindejaar/`, opgehaald met een
iPhone-user-agent. Per product de `min="…"` uit de HTML en de prijs uit de
JSON-LD van de productpagina zelf, niet uit het overzicht.

| | Uitkomst |
|---|---|
| Aantal pakketten | **11** |
| Minimale afname | **10 bij alle elf**, geen enkele uitzondering |
| Prijs | **€ 25,00 tot € 70,00** |

Van goedkoop naar duur: Bak pakket 25, Fles/Tony's & Bambook 31, Borrelplank 32,
Koffiebeker/lunchbox/Bambook 34, Borrelplank & Wijn 40, Gezellig & warm 47,
Borrelplank & Spel 48, Borrelplank/Wijn & Spel 58, Ontspan pakket 67,
Paraplu/Lunchpot/Fles 69, Offline pakket 70.

Dit bevestigt wat `docs/seo/categorie-feiten.md` zegt (11 producten, € 25,00 tot
€ 70,00) en wat de herziene opdracht in `kerstpagina-herzien.md` op 29 oktober
aannam over de afname van 10. Het weerlegt de FAQ op de site, die zegt "er is geen
vaste minimale afname". Dat is punt 14 van het verbeterplan.

## Wat er NIET gemeten is, en wat Ward moet bevestigen

**De besteldeadline van 27 november.** De rekensom klopt en is na te rekenen:
vijftien werkdagen terug vanaf vrijdag 18 december, met 25 december als vrije dag,
komt uit op vrijdag 27 november. Voor levering tot dinsdag 22 december is het
dinsdag 1 december. Vandaag is dat nog 23 respectievelijk 27 dagen.

**Maar die vijftien werkdagen is een aanname, geen meting.** Hij komt uit het plan
van 29 oktober en er staat nergens waar hij vandaan komt. Het enige levertijdcijfer
dat ik op de site kon vinden is `"1-3 dagen"` in de structured data van alle elf
productpagina's, en dat is de verzending, niet het personaliseren en produceren.

Klopt vijftien niet, dan verschuift de datum:

| Termijn | Levering 18 dec | Levering 22 dec |
|---|---|---|
| 10 werkdagen | vrijdag 4 december | dinsdag 8 december |
| **15 werkdagen** | **vrijdag 27 november** | dinsdag 1 december |
| 20 werkdagen | vrijdag 20 november | dinsdag 24 november |

Het heroblok staat nog niet live en er zit een waarschuwing in het HTML-commentaar.
Bevestig de termijn voordat je plakt.

## Bestanden

| Bestand | Wat erin staat |
|---|---|
| `pakketten.csv` | De elf pakketten met URL, `min`, prijs en de levertijd uit de structured data. |
