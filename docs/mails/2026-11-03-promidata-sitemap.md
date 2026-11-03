# Mail aan Promidata, 3 november 2026

Verzendklaar. Los van `docs/promidata-vragen.md`: dit is een bug, de rest zijn
verzoeken.

Bewust één onderwerp, geen reproductiestappen en geen controlecommando. De volledige
meting staat onder C4 in de vragenlijst, voor als ze doorvragen.

---

**Onderwerp:** Bug: sitemap bevat meerdere gzip-leden, generatie geeft HTTP 500

Hallo,

Google leest onze sitemap sinds 16 september niet. Search Console meldt "Fout bij
compressie" en 0 ontdekte pagina's.

Het `.xml.gz` blijkt meerdere achter elkaar geplakte gzip-leden te bevatten, elk met
een eigen `<?xml ?>` en `<urlset>`, en alleen het laatste met een `</urlset>`. Een
XML-parser struikelt over de tweede declaratie: "XML or text declaration not at start
of entity: line 1, column 12201".

Met Refresh strategy tijdelijk op Live zagen we waar het ontstaat: het verzoek dat de
generatie aftrapt geeft HTTP 500, en de half geschreven uitvoer blijft in het bestand
staan. Vanochtend stonden er twee byte-identieke fragmenten van 82 URLs in, gevolgd
door het complete document van 1.523. Het is wisselvallig; de volgende run kwam wel in
één keer door, dus op dit moment is de sitemap toevallig geldig.

Stacktraces zouden in het log moeten staan op 3 november 09:22:45 en 09:24:06 UTC.

Waarom werpt de generatie die uitzondering, en kan de gedeeltelijke uitvoer opgeruimd
worden als het misgaat?

Verder staat ons ticket over de snelheid van de site nog open, daar hebben we nog geen
reactie op gehad. Dat speelt nog steeds: `/alle-producten/` laadt mobiel 8.365 kB,
waarvan 7.680 kB beeld. Graag ook daar een reactie.

Met vriendelijke groet,
Ward
