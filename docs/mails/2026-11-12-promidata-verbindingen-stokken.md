# Mail aan Promidata, 12 november 2026: verbindingen stokken

Concept van Ward aan Promidata. **Nog niet verstuurd.** Ontvanger eerder gebruikt: webshop@promidata.com.
De cijfers staan in `docs/metingen/2026-11-12-pdp-traag/` (punt A6 in `docs/promidata-vragen.md`).
Bijlagen: `controle.sh`, `controle-uitvoer.txt`, `ttfb-opgesplitst.txt`, `reeks-uitvoer.txt` uit die map.

Bewust alleen vragen die geen werk of geld kosten (logs, een instelling, een antwoord). De betaalde
wijzigingen uit de verzamellijst (A3, A5, B-punten) blijven daar staan voor een latere mail.

---

**Onderwerp:** Verbindingen met rootedgoods.eu blijven soms hangen, ook bij statische bestanden (graag vandaag een blik in de logs)

Hoi,

Dit is een andere kwestie dan de cache van vorige week, en ik wil hem graag snel bij jullie neerleggen. Vandaag wilde ik een productpagina naar een klant sturen en die laadde onbruikbaar traag. Ik heb het uitgezocht, en het zit niet in Shopware dat de pagina bouwt maar in de verbinding met de server.

Wat ik zie, vanaf één Mac, 12 november 2026 rond 11:50 tot 12:30, elke aanvraag maximaal 45 seconden de tijd:

| Doel | Aanvragen | Mediaan totaaltijd | Boven 2 s | Langste |
|---|---:|---:|---:|---:|
| Google (controle) | 12 | 0,16 s | 0 | 0,2 s |
| cdn.jsdelivr.net (controle) | 12 | 0,16 s | 0 | 0,2 s |
| rootedgoods.eu, een productpagina | 15 | 2,12 s | 8 | 45 s, afgebroken |
| rootedgoods.eu, /alle-producten/ | 12 | 0,38 s | 3 | 25,4 s |
| rootedgoods.eu, all.css uit het thema | 12 | 0,34 s | 2 | 45 s, afgebroken |

Het gaat dus niet alleen om pagina's. all.css is een statisch bestand van de webserver zelf, en dat had na 45 seconden 32 KB van de ruim 190 KB binnen. Soms duurt de TLS-handshake 1 tot 2 seconden (normaal 0,1 s), soms komt na een snelle eerste byte de rest pas na 8 seconden, soms stokt het helemaal. Dezelfde pagina laadde in een browser in 0,6 seconden of in bijna een minuut: van 12 achter elkaar haalden er 2 het laad-event niet binnen 90 seconden, 2 deden er 40 en 48 seconden over, 1 deed er 8 over en 6 waren klaar binnen 2,1 seconden.

Dat Google en jsDelivr in dezelfde minuten steeds binnen 0,2 seconden antwoordden, maakt mijn eigen verbinding een onwaarschijnlijke oorzaak. Bewijzen kan ik het niet, want ik meet maar vanaf één plek. Ik zie het zelf, maar ook bezoekers hebben dit soms. Dat laatste heb ik niet gemeten, dus het zou helpen als jullie het in de logs kunnen terugzien.

Mijn vragen:

1. Kunnen jullie vandaag in de serverlogs kijken naar 12 november, 11:50 tot 12:30? Ik zoek: het maximum aantal gelijktijdige verbindingen dat wordt gehaald, een wachtrij voor TLS, een bandbreedtegrens, of een bezoeker of bot die de server bezet houdt.
2. Draaien er op dat moment andere webshops of zware taken (import, indexering) op dezelfde server?
3. Hoeveel gelijktijdige verbindingen kan de server aan, en wat gebeurt er daarboven?

Twee dingen die hier waarschijnlijk mee samenhangen en die ik nog open heb staan:

- **De cache.** Mijn drie vragen van 4 november zijn niet beantwoord: welke cache staat er vóór Shopware, hoe lang bewaart die een pagina, en kan er een cache-warmer draaien na elke import? Na jullie update is een koud eerste bezoek aan een menucategorie van 3,19 s naar 1,09 s mediaan gegaan (11 categorieën, 6 november), warm is het 0,2 s. Als de server de verbindingen slecht aankan, telt elke pagina die niet uit de cache komt dubbel.
- **Brotli.** Er staat alleen gzip aan, ook als de browser om brotli vraagt. Op all.css en all.js scheelt dat naar schatting 55 tot 75 kB per eerste bezoek. Het lost dit stokken niet op, maar bij een trage verbinding is minder te halen ook minder wachten. Dit is een serverinstelling (mod_brotli) en geen codewerk.

Het liefst heb ik vandaag een eerste reactie, ook als het alleen is "we kijken ernaar". Er komt advertentieverkeer binnen en ik stuur links naar klanten, dus elke keer dat dit gebeurt is het een bezoeker die we kwijt zijn.

De ruwe uitvoer en het meetscript zitten als bijlage bij deze mail, zodat jullie het zelf kunnen herhalen.

Groet,
Ward
