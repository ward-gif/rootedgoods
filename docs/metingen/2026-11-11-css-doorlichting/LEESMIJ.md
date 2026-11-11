# !important in rootedgoods.css, doorgelicht op 11 november 2026

Basis: `rootedgoods.css` van commit ed4514f (12.648 regels), 11 paginatypes op de live site met onze lokale CSS
ervoor geschoven (`meet.mjs`), mobiel 390, tablet 820, desktop 1440, plus mobiel/tablet met het menu open op 4 pagina's.
Headless Chromium, geen echt toestel, geen cookie-akkoord, geen ingelogde of gevulde winkelmand.

## Stappen
1. `tel-important.py`: telt per sectie (1.645 `!important` in 5.729 declaraties).
2. `meet.mjs` + `pagina.js`: per `!important`-longhand het `!important` weghalen via CSSOM en kijken of de berekende
   stijl van een passend element verandert. Elke regel krijgt via `markeer.mjs` zijn regelnummer mee.
3. `samenvatting.py`: oordeel per longhand over alle runs. `nodig` = ergens verschil, `gelijk` = gemeten, nergens
   verschil, `niet-gemeten` = nooit een passend element (hover, JS-staten, winkelmand, andere breedte).
4. `meet.mjs` met `MODE=valideer` + `validatie.js`: alle 239 regels waarvan elke longhand `gelijk` is, tegelijk
   ontdaan van `!important`, en de berekende stijl van ALLE elementen (ook ::before/::after) voor en na vergeleken.
   Controle dat de validatie iets ziet: 3 bekende `nodig`-regels geven 5 verschillende elementen.

## Uitkomst
- 3.926 longhands met `!important`: 387 nodig (9,9%), 1.613 gelijk (41,1%), 1.926 niet gemeten (49,1%).
- 675 regels: 151 nodig, 239 alles gelijk, 284 alles niet gemeten, 1 gemengd.
- Validatie van de 239 regels: 41 metingen (33 pagina x breedte + 8 met menu open), 0 elementen met verschil.
- Weggehaald: 518 `!important` in 239 regels, 1.645 -> 1.128 (19,7% van de declaraties).

## Beperkingen
- `gelijk` betekent: geen effect gemeten in deze staten, niet: bewezen overbodig. Hover, focus, winkelmand,
  checkout, formulier-fouten, PDP met configurator en alles achter JS-klikken zijn niet geraakt.
- 284 regels (o.a. secties 40, 40b, 49.x, 51) matchten nergens: of dode code, of een pagina die niet in de steekproef zat.
- Er is niet in Safari of op een echt toestel gemeten.
