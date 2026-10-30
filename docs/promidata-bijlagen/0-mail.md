Onderwerp: Trage paginaovergang rootedgoods.eu: wachttijd zit in het ophalen van de HTML (metingen bijgevoegd)

Hoi,

Eén update met alles wat ik heb getest, zodat jullie niet steeds losse berichten krijgen.

Wat ik uitgesloten heb
Snitcher Radar staat uit. GTM kost in de traces circa 90 ms scripttijd. In de traces staat de hoofdthread tijdens het wachten vrijwel stil, dus het is geen script of stylesheet dat de pagina vasthoudt.

Wat ik wel zie: de browser wacht op de HTML
Ik heb vier uur lang elke 10 minuten de tijd tot de eerste byte (TTFB) gemeten met curl, vanaf één Mac, 2026-10-12 10:06 tot 14:50, n=29 per pagina:

| Pagina | min | mediaan | p90 | max |
|---|---|---|---|---|
| /huis-keuken/ | 0,95 s | 3,95 s | 6,74 s | 18,27 s |
| / | 0,79 s | 2,07 s | 4,22 s | 10,69 s |
| productpagina (Pulltap) | 0,65 s | 0,91 s | 1,32 s | 4,78 s |
| /checkout/cart | 0,28 s | 0,35 s | 0,39 s | 0,45 s |
| /robots.txt | 0,19 s | 0,22 s | 0,24 s | 0,25 s |

Alle 145 antwoorden waren HTTP 200. De categoriepagina en de homepage zijn dus structureel de langzaamste, en de spreiding is groot: dezelfde pagina doet 0,95 s of 18 s. Het eerste uur (10:00 tot 11:00) was /huis-keuken/ nog snel (mediaan 1,13 s, n=6), daarna 3,4 tot 4,8 s per uur (n=5 of 6 per uur).

Dat komt overeen met wat ik in Chrome zie. Twee Performance-traces met echte kliks (zie bijlage 4): de wachttijd tot de HTML binnen is 1,17 s, 3,95 s, 12,04 s en 5,64 s bij verschillende kliks, en een andere klik 0,82 s. Na ontvangst staat de eerste paint er binnen 0,17 tot 0,25 s.

Een opvallend detail
In de responses staat een Age-header. Die loopt mee met de TTFB: bij de 10,7 s op / stond Age op 11, bij snelle antwoorden op 0 of 1. Bij / was de mediaan TTFB 1,01 s met Age 0 of 1 (n=13) en 3,45 s met Age boven 1 (n=16). Ik weet niet welke laag die header zet. Zit er een reverse proxy of cache voor Shopware, en zo ja, houdt die verzoeken vast?

Vragen
1. Staat er een HTTP-cache of full-page cache voor de categoriepagina's en de homepage? Zo ja, wat zegt die over deze verzoeken (hit, miss, wachtrij)?
2. Kunnen jullie voor 2026-10-12 tussen 10:00 en 15:00 de serverlogs bekijken voor / en /huis-keuken/: responstijd per verzoek, en wat de database of PHP in die tijd deed?
3. Welke query of plugin kost tijd bij het opbouwen van een categoriepagina? Ik denk aan de plugin voor variantthumbnails met swatches, maar dat kan ik van buiten niet aantonen. Kan die tijdelijk uit op de testomgeving of voor een korte meting?
4. Is er die dag iets anders op de server gebeurd (import vanuit Promidata, indexering, back-up, cronjobs)?

Secundair, nog niet geverifieerd
Uit Lighthouse en een HAR: all.css is circa 927 KB waarvan een groot deel ongebruikt, productafbeeldingen van 800x800 en variantthumbnails als 400x400 PNG, en een 404 op een lettertypebestand. Die dingen kosten laadtijd na de HTML, maar verklaren de seconden vóór de HTML niet. Laten we eerst de wachttijd oplossen.

Een vraag over Snitcher, geen aantijging: ik wil weten of er verzoeken naar Snitcher uitgingen vóór toestemming in de cookiebanner. Kunnen jullie dat voor de periode dat het script aanstond nagaan?

Beperkingen van mijn meting: alles komt van één Mac op één verbinding, curl meet alleen het HTML-document, de traces zijn n=2 sessies met een handvol kliks, en ik heb niet gecontroleerd of browserextensies in de traces meelazen (dat verandert niets aan de wachttijd op de HTML). Wil je de metingen zelf herhalen? 2-meet.sh is het script.

Bijlagen
1-meetlog.csv: alle 145 metingen
2-meet.sh: het meetscript
3-meetlog-samenvatting.txt: de tabel hierboven plus uitsplitsing per uur en per Age
4-traces-samenvatting.txt: de kliktijden uit de traces

Groet,
Ward
