# Mail aan Promidata, 3 november 2026

Los verstuurd, niet als onderdeel van `docs/promidata-vragen.md`. Dit is een bug,
de rest zijn verzoeken.

**Nog invullen:** het ticketnummer bij `[TICKET]`.

De volledige meting staat in `docs/promidata-vragen.md` onder C4, voor als ze
doorvragen. Bewust niet in de mail; dan wordt het een rapport in plaats van een
melding.

---

**Onderwerp:** Bug: sitemap bevat meerdere gzip-leden, generatie geeft HTTP 500

Hallo,

Google leest onze sitemap sinds 16 september niet. Search Console meldt "Fout bij
compressie" en 0 ontdekte pagina's.

De oorzaak zit in het bestand. Het `.xml.gz` bevat **meerdere achter elkaar geplakte
gzip-leden**, elk met een eigen `<?xml ?>` en `<urlset>`, en alleen het laatste met
een `</urlset>`. Een gewone XML-parser weigert het: *"XML or text declaration not at
start of entity: line 1, column 12201"*. Dat is dus geen Google-kwestie.

Het ontstaat bij het genereren. Met Refresh strategy op Live geeft het verzoek dat de
generatie aftrapt **HTTP 500**, en blijft de half geschreven uitvoer in het bestand
staan. Vanochtend stonden er twee byte-identieke fragmenten van 82 URLs in, gevolgd
door het complete document van 1.523. Het is wisselvallig: de volgende run kwam wel
in één keer door, dus op dit moment is de sitemap toevallig geldig.

**In jullie log staan stacktraces op 3 november 09:22:45 en 09:24:06 UTC.** Dat is
het enige wat wij niet kunnen zien.

Zelf nakijken, ongeveer één op de twee keer raak:

```bash
curl -s "<sitemap-gz-url>" | gunzip | grep -o '<?xml' | wc -l
```

Eén is goed. Meer dan één is de fout.

**Vraag:** waarom werpt de generatie die uitzondering, en kan de gedeeltelijke uitvoer
opgeruimd worden als het misgaat?

Verder staat **[TICKET]** over de snelheid van de site nog open, daar hebben we nog
geen reactie op gehad. Dat speelt nog: `/alle-producten/` laadt mobiel 8.365 kB,
waarvan 7.680 kB beeld. Graag ook daar een reactie.

Met vriendelijke groet,
Ward
