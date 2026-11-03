# Mail aan Promidata, 3 november 2026

Los verstuurd, niet als onderdeel van de verzamellijst in `docs/promidata-vragen.md`.
Dit is een bug, de rest zijn verzoeken.

**Nog invullen voor verzending:** het ticketnummer of onderwerp van het lopende
snelheidsticket, bij `[TICKET]`.

---

**Onderwerp:** Bug: XML-sitemap bevat meerdere gzip-leden, generatie geeft HTTP 500

Hallo,

Twee dingen: een bug op rootedgoods.eu die we hebben teruggebracht tot een
reproduceerbare oorzaak, en een herinnering aan een lopend ticket.

## De sitemap wordt al zes weken niet gelezen door Google

Search Console meldt bij de sitemap **"Fout bij compressie"** en **0 ontdekte
pagina's**. Ingediend op 16 september, laatst gelezen 1 november. In die periode is
er dus geen enkele URL uit de sitemap opgehaald.

Eerder is aangegeven dat er aan jullie kant niets mis is en dat we Google zouden
moeten benaderen. Dat klopt niet, en dat is zonder Google aan te tonen.

**Wat er mis is.** Het bestand
`.../003cda8a1ed34df1860b226ae97dcc39-sitemap-rootedgoods-eu-1.xml.gz` bevat niet
één gecomprimeerd document, maar **meerdere achter elkaar geplakte gzip-leden**. Elk
lid begint opnieuw met `<?xml version="1.0"?><urlset ...>`, en alleen het laatste lid
heeft een afsluitende `</urlset>`.

Gemeten op 1 november, vier leden:

| Lid | Uitgepakt | `</urlset>` | `<url>` |
|---:|---:|:---:|---:|
| 1 | 12.201 B | nee | 80 |
| 2 | 29.818 B | nee | 180 |
| 3 | 29.818 B | nee | 180 |
| 4 | 268.784 B | ja | 1.503 |

Een gewone XML-parser weigert dit, hoe je het ook leest:

- alle leden achter elkaar: `XML or text declaration not at start of entity: line 1,
  column 12201`
- alleen het eerste lid: `no element found`
- alleen het laatste lid, los: geldig

De tweede `<?xml ?>`-declaratie staat op byte 12.201, precies waar lid 2 begint. Een
XML-document mag er maar één hebben, vooraan. Google heeft hier geen rol in.

## De oorzaak: de generatie loopt vast en laat brokstukken staan

Vanochtend hebben we de Refresh strategy tijdelijk op **Live** gezet en de sitemap
opgevraagd. Drie waarnemingen:

1. Het verzoek dat de generatie aftrapt geeft **HTTP 500** en de
   storefront-foutpagina. Volgende verzoeken gaan weer goed.
2. Het bestand wordt wél overschreven, niet aangevuld. Het werd kleiner.
3. Direct na een mislukte poging bevatte het **drie** leden: twee **byte voor byte
   identieke** fragmenten van 82 URLs zonder sluittag, gevolgd door het complete
   document van 1.523 URLs.

Dat is het beeld van een generatie die halverwege een uitzondering werpt, opnieuw
begint, en de gedeeltelijk geschreven uitvoer laat staan.

**Het is wisselvallig.** Een volgende run om 09:24:06 UTC kwam wel in één keer door
en leverde één geldig lid met 1.523 URLs op. Op dit moment is de sitemap dus geldig.
Dat neemt niet weg dat hij zes weken stuk was en vanochtend binnen twee minuten
opnieuw stukging.

**In jullie log staan stacktraces** bij deze momenten:

- 3 november 2026, **09:22:45 UTC**
- 3 november 2026, **09:24:06 UTC**

Dat is het enige wat wij niet kunnen zien, en waarschijnlijk precies wat nodig is.

**Zelf reproduceren**, ongeveer één op de twee keer raak:

1. Instellingen → Sitemap → Refresh strategy op `Live`
2. `https://rootedgoods.eu/sitemap.xml` opvragen
3. Tellen hoeveel gzip-leden er in het bestand zitten:

```bash
curl -s "<sitemap-gz-url>" | python3 -c "import sys,zlib;d=sys.stdin.buffer.read();n=0
while d:
    o=zlib.decompressobj(zlib.MAX_WBITS|16); o.decompress(d); n+=1; d=o.unused_data
print(n,'gzip-leden')"
```

Eén lid is goed. Meer dan één is de fout.

**Onze vraag:** waarom werpt de generatie die uitzondering, en kan de gedeeltelijke
uitvoer opgeruimd worden als het misgaat in plaats van in het bestand achterblijven?

**Nog een waarneming die er mogelijk bij hoort.** Met Refresh strategy op `Scheduled`
en een interval van 3.600 seconden was het bestand **44 uur oud** (laatst gewijzigd
1 november 13:32, gemeten 3 november 09:16). De geplande taak lijkt dus niet te
draaien, of hij loopt op dezelfde fout vast.

## Herinnering: het lopende ticket over de snelheid

Daarnaast staat **[TICKET]** over de snelheid van de site nog open. Daar hebben we
nog geen reactie op gehad.

Dat speelt nog steeds. Gemeten op 29 oktober, mobiel op 390 px: `/alle-producten/`
laadt **8.365 kB**, waarvan **7.680 kB beeld**. Zestien van de zeventien afbeeldingen
op de kerstpagina komen 2,4 tot 11,4 keer groter binnen dan ze getoond worden. Met
85% van ons advertentieverkeer op mobiel kost dat ons geld.

Graag een reactie op dat ticket, dan kunnen we daar ook verder.

Met vriendelijke groet,
Ward
