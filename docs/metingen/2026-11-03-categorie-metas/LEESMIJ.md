# Categorie-meta's en wat Search Console erover zegt, 3 november 2026

| Bestand | Wat het is |
|---|---|
| `categorie-feiten.json` | ruwe uitvoer van `bin/categorie-feiten.py`, alle 75 categoriepagina's |
| `gsc-2026-08-05_2026-11-01.txt` | Search Console over 89 dagen |

## De stand van de meta-teksten

Gemeten op alle 75 categoriepagina's:

| | |
|---|---:|
| Lege meta description | **75 van 75** |
| Geen h1 | 75 van 75 |
| Titel is alleen de categorienaam | 63 |
| Titel met merk en propositie | 12 |

In `docs/meta-teksten-concept.md` staan **twaalf afgeronde descriptions** voor de
hoofdcategorieën. De titels daaruit zijn ooit geplakt, de descriptions niet.

Daarbij is bij het plakken een letter verdwenen: `/eten-drinken/` draagt live de
titel **"ten & drinken als relatiegeschenk | Rooted Goods"**.

## Wat Search Console zegt, en het verandert de opdracht

5 augustus tot 1 november 2026, 89 dagen, `sc-domain:rootedgoods.eu`:

**629 vertoningen, 59 klikken** over de hele site, verdeeld over 103 pagina's.

Daarvan zijn **12 van de 75 categoriepagina's** ooit vertoond:

| Pagina | Vertoningen | Klikken | Positie |
|---|---:|---:|---:|
| `/alle-producten/` | 72 | 1 | 5,4 |
| `/kantoor-schrijfwaren/` | 37 | 0 | **64,8** |
| `/kleding-textiel/` | 17 | 0 | 5,1 |
| `/drinkwaren/` | 15 | 0 | 12,5 |
| `/verzorging/` | 11 | 1 | 25,8 |
| `/tassen-reizen/` | 10 | 0 | 7,5 |
| `/thema-s/made-in-nl/` | 9 | 0 | 5,6 |
| `/elektronica/` | 7 | 0 | 9,9 |
| `/sport-spel/` | 4 | 0 | 5,8 |
| `/huis-keuken/` | 3 | 0 | 4,7 |
| `/drinkwaren/drinkflessen/` | **2** | 0 | 7,5 |
| `/outdoor/` | 1 | 0 | 9,0 |
| **samen** | **188** | **2** | |

**Eén enkele subcategorie is ooit vertoond**, `/drinkwaren/drinkflessen/`, met twee
vertoningen in drie maanden. De overige 62 subcategorieën: nul.

Twee dingen volgen hieruit.

**1. De 63 subcategorieën zijn nu geen werk met opbrengst.** Een meta description
verhoogt de doorklik op vertoningen die je al hebt. Die zijn er niet. Het blijft
een voorwaarde om ooit te ranken, maar het verdient geen middag vóór de rest.

**2. Alle 188 echte vertoningen zitten bij de hoofdcategorieën**, en dat zijn precies
de twaalf waarvoor de tekst al geschreven is en klaarligt in de repo.

**De posities zijn niet het probleem.** Waar ze getoond worden staan ze op 4,7 tot
7,5. Het probleem is dat ze bijna nooit getoond worden. Dat is een kwestie van
indexering en vraag, niet van copy.

**Uitzondering:** `/kantoor-schrijfwaren/` haalt 37 vertoningen op positie **64,8**.
Die wordt getoond voor iets dat hij niet kan winnen; de moeite om uit te zoeken
waarvoor.

## De sitemap is kapot: vier gzip-leden in één bestand

Search Console: **"Fout bij compressie"**, **0 ontdekte pagina's**, verzonden
16 september 2026, laatst gelezen 1 november 2026. Google heeft er in zes weken geen
enkele URL uit gehaald.

Het `.xml.gz`-bestand bevat **vier achter elkaar geplakte gzip-leden**:

| Lid | Gecomprimeerd | Uitgepakt | `<urlset>` open | dicht | `<url>` |
|---:|---:|---:|---:|---:|---:|
| 1 | 990 B | 12.201 B | 1 | **0** | 80 |
| 2 | 1.751 B | 29.818 B | 1 | **0** | 180 |
| 3 | 1.751 B | 29.818 B | 1 | **0** | 180 |
| 4 | 17.507 B | 268.784 B | 1 | 1 | 1.503 |

Elk lid opent opnieuw met `<?xml?><urlset>`. Alleen lid 4 is compleet; de eerste drie
zijn afgekapte restanten van eerdere generaties. Lid 2 en 3 zijn byte voor byte gelijk.

**Correctie op een eerdere notitie van mij.** Ik schreef hier eerst dat de sitemap
180 dubbele URLs bevatte, 1.943 `<url>`-blokken voor 1.503 unieke. Dat was geen apart
mankement maar een gevolg van dit: `gunzip` plakt alle vier de leden aan elkaar, en
dan tel je de restanten mee. De echte sitemap, lid 4, bevat 1.503 URLs zonder
dubbelingen en is geldig.

**Waar het niet aan ligt:**

- `/sitemap.xml` geeft 200 met `content-type: text/xml`
- het `.gz` geeft 200 met `application/x-gzip`
- **geen dubbele compressie**: met en zonder `Accept-Encoding: gzip` komen dezelfde
  21.999 bytes binnen, zonder `content-encoding`-header
- steekproef van 30 sitemap-URLs: 30 keer 200, geen omleidingen
- `robots.txt` noemt de sitemap en blokkeert hem niet

Het mankement zit in het genereren: Shopware voegt toe aan het bestaande bestand in
plaats van het te overschrijven. Dat is Promidata, punt **C4** in
`docs/promidata-vragen.md`.

Nazien in één regel:

```bash
curl -s <sitemap-url> | python3 -c "import sys,zlib;d=sys.stdin.buffer.read();n=0
while d:
    o=zlib.decompressobj(zlib.MAX_WBITS|16); o.decompress(d); n+=1; d=o.unused_data
print(n,'gzip-leden')"
```

Eén lid is goed. Nu zijn het er vier.

**Terzijde in `robots.txt`:** `Disallow: */?` blokkeert ook doorgebladerde
categoriepagina's (`/verzorging/?p=2`). Dat is Shopware-standaard tegen
filtercrawling, maar het betekent dat Google per categorie alleen de eerste 24
producten langs deze weg ziet.
