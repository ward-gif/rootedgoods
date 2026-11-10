# Antwoord aan Promidata na de performance-update, 6 november 2026

Concept van Ward aan Promidata. Nog niet verstuurd. De cijfers staan in
`docs/metingen/2026-11-06-na-promidata-update/` en `.../2026-11-06-na-promidata-update-2/`.

---

**Onderwerp:** Re: performance-updates, nagemeten

Hoi,

Bedankt voor de update. Ik heb het vandaag twee keer nagemeten, om 14:01 en om 14:40, met dezelfde methode als op 4 november (curl zonder cache, iPhone-user-agent). Het is merkbaar sneller.

Eerste bezoek aan de elf categoriepagina's uit het hoofdmenu, tijd tot de eerste byte:

Mediaan: 3,19 s → 1,09 s
Slechtste: 5,68 s → 1,41 s
Tweede en derde bezoek: 0,20 s, ongewijzigd

Met de cache omzeild is het ook beter. /huis-keuken/ ging van 1,63 naar 0,60 s en /alle-producten/ van 1,69 naar 0,70 s. De meting van 14:40 gaf hetzelfde.

PageSpeed op mobiel, ten opzichte van 27 oktober:

Homepage: score 37 → 63, LCP 31,6 s → 11,7 s
/alle-producten/: score 37 → 75, LCP 27,7 s → 2,6 s
/offerte: score 60 → 72, LCP 9,2 s → 4,4 s
/eindejaarsgeschenken: score 46 → 60, LCP 10,4 s → 10,5 s

Hier zit ook werk van ons in (we hebben in die weken onder meer een cookiemodal weggehaald), dus voor de server zelf telt de tijd tot de eerste byte.

Twee dingen zie ik nog.

Het eerste bezoek is ongeveer vijf keer trager dan het tweede, 0,4 tot 1,0 s tegen 0,2 s, en de homepage is koud het traagst met 1,0 tot 1,2 s. Wat me opviel: drie categorieën (Drinkwaren, Tassen & Reizen, Elektronica) stonden al in de cache, alle drie precies even oud, en kwamen er na 114 minuten nog steeds uit. Draait er een cache-warmer? Zo ja, kan die ook de rest van de categorieën en de homepage vullen? En welke cache staat er eigenlijk voor Shopware, en hoe lang bewaart die een pagina?

Dan het beeld. De kerstpagina zit nog op ruim 10 s LCP, terwijl het document zelf in 20 ms binnen is. Dat ligt dus niet aan de server. PageSpeed zegt dat er ruim 1 MB te winnen is: de miniaturen in de slider zijn 800 × 800 PNG van zo'n 380 KB en worden op 98 × 98 px getoond. Webp of avif, plus een sizes-attribuut dat bij de getoonde maat past, lost dat grotendeels op. Ik stuur daar apart nog een korte lijst over.

Eén kanttekening: dit is één vrijdagmiddag en geen echte telefoon. Hebben jullie nog iets anders veranderd, dan hoor ik het graag, dan meet ik dat gericht na.

Groet,
Ward
