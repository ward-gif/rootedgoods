# Mail aan Promidata, 3 november 2026

Verzendklaar. Los van `docs/promidata-vragen.md`: dit is een bug, de rest zijn
verzoeken.

**Opgezet om hetzelfde antwoord te voorkomen.** Hun eerdere reactie controleerde het
transport (200, geen omleidingen, content-type, "gzip pakt foutloos uit") en de
bereikbaarheid (firewall, Googlebot in de logs). Dat klopt allemaal en is nooit de
vraag geweest. Daarom begint deze mail met dat toe te geven.

Het scharnierpunt staat in hun eigen getal: zij meldden ~268 KB, en dat is precies de
grootte van het **laatste** van vier gzip-leden, en precies wat de gzip-trailer
teruggeeft. Het hele bestand pakt uit naar 340.621 bytes.

| | Bytes | `<url>` |
|---|---:|---:|
| Hele bestand uitgepakt | 340.621 | 1.943 |
| Alleen het laatste lid | 268.784 | 1.503 |
| Promidata meldde | ~268 KB | ~1.497 |

---

**Onderwerp:** Sitemap, aanvulling op jullie reactie van 23 september: het bestand bevat vier gzip-leden

Hallo,

Ik kom terug op jullie reactie van **23 september** over de sitemap. Die stond sinds
16 september ingediend, en vandaag, zes weken later, meldt Search Console nog steeds
**0 ontdekte pagina's**.

Alles wat jullie toen nakeken klopt, en ik denk dat we daardoor langs elkaar heen
praatten: HTTP 200, geen omleidingen, de juiste content-types, het gzip pakt foutloos
uit, de firewall blokkeert niets en Googlebot komt binnen. Dat is allemaal in orde en
dat betwisten we niet.

Wat niet is nagekeken, is of de **uitgepakte inhoud één XML-document** is. Dat is het
niet.

Het verschil zit in jullie eigen cijfer. Jullie meldden toen een ongecomprimeerde
grootte van ongeveer 268 KB. Het bestand pakt uit naar **340.621 bytes**. Die 268.784 bytes zijn de
grootte van het **laatste** van vier achter elkaar geplakte gzip-leden, en dat is ook
precies wat de gzip-trailer teruggeeft. Een controle die 268 KB oplevert, heeft dus één
lid gelezen en niet het hele bestand.

Uitgepakt staan er vier losse documenten achter elkaar, elk met een eigen
`<?xml ?>` en `<urlset>`, en alleen het laatste met een `</urlset>`. Een XML-parser
stopt op de tweede declaratie: *"XML or text declaration not at start of entity: line
1, column 12201"*.

Dat verklaart ook jullie eigen test met `sitemap2.xml` destijds. Een platte kopie van
de uitgepakte inhoud is geldig, dus die haalde Google probleemloos op. De inhoud is
niet het probleem, de verpakking wel.

**Waar het ontstaat.** Met Refresh strategy tijdelijk op Live geeft het verzoek dat de
generatie aftrapt **HTTP 500**, en blijft de half geschreven uitvoer in het bestand
staan. Vanochtend stonden er twee byte-identieke fragmenten van 82 URLs in, gevolgd
door het complete document van 1.523. Het is wisselvallig: de volgende run kwam wel in
één keer door, dus op dit moment is de sitemap toevallig geldig. Stacktraces zouden in
het log moeten staan op **3 november 09:22:45 en 09:24:06 UTC**.

Waarom werpt de generatie die uitzondering, en kan de gedeeltelijke uitvoer opgeruimd
worden als het misgaat?

Verder staat ons ticket over de snelheid van de site nog open, daar hebben we nog geen
reactie op gehad. Dat speelt nog steeds: `/alle-producten/` laadt mobiel 8.365 kB,
waarvan 7.680 kB beeld. Graag ook daar een reactie.

Met vriendelijke groet,
Ward
