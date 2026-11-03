# Sitemap-gzip: aantal leden per download, 3 november 2026

Vraag: waarom meldt Search Console "Fout bij compressie" op de rechtstreeks
ingediende sitemap `.xml.gz`, terwijl de leverancier op 23 september niets vond.

## Wat hier staat

- `bestanden/*.xml.gz`: drie downloads van dezelfde URL
  (`/sitemap/salesChannel-003cda8a.../003cda8a...-sitemap-rootedgoods-eu-1.xml.gz`),
  sha256 in `sha256.txt`. Plus `sitemap-index.xml` van `/sitemap.xml`.
- `bestanden/*.xml`: wat `gunzip -c` van elk bestand maakt (alle leden achter elkaar).
- `scripts/`: de drie Python-scripts; draaien met `python3 -I <script> *.gz`.
- `uitvoer-*.txt`: de ruwe uitvoer van die scripts.

## Gemeten

| Download | Bytes | gzip-leden | Inhoud per lid (URL's) | Laatste lid geldig XML |
|---|---|---|---|---|
| 1 nov 13:32 UTC | 21.999 | 4 | 80 (afgebroken), 180 (afgebroken), 180 (afgebroken), 1.503 (volledig, 268.784 B) | ja |
| 3 nov 09:22 UTC | 19.122 | 3 | 82 (afgebroken), 82 (afgebroken), 1.523 (volledig, 272.844 B) | ja |
| 3 nov 09:24 UTC | 17.108 | 1 | 1.523 (volledig, 272.844 B) | ja |

Elk lid heeft een kloppende CRC32 en ISIZE. De afgebroken leden beginnen met
`<?xml ...><urlset ...>` en eindigen op een `</url>`-grens zonder `</urlset>`.
Ze zijn byte voor byte een prefix van het volledige lid. De afbreekpunten liggen
op batchgrenzen van de Shopware-exporter: 80/82 = homepage + alle categorieën
(vlak vóór het eerste product), 180 = daarna precies één productbatch van 100.

`gunzip -c` van het 1-nov-bestand geeft 340.621 bytes met vier `<?xml`-declaraties;
`xmllint` weigert dat op kolom 12.201. Een lezer die alleen het eerste gzip-lid
neemt (zlib met wbits=31) krijgt 12.201 bytes afgebroken XML.

## Oorzaak in de Shopware-bron (v6.5.8.16, gecontroleerd op GitHub)

`src/Core/Content/Sitemap/Service/SitemapHandle.php`: `gzopen($filePath, 'ab')`
op een vast pad in `sys_get_temp_dir()`; `@unlink($tmpFile)` gebeurt alleen in
`finish()`. `SitemapExporter::generate()` roept `finishSitemapHandles()` aan in
het `try`-blok, niet in `finally`. Een run die onderweg faalt laat dus een
afgebroken gzip-lid achter in /tmp; de volgende run plakt er een nieuw lid achter
en uploadt het geheel.

## Beperkingen

- We hebben niet het bestand dat Google op 16 september of op 1 november las;
  alleen het bestand van 1 nov 13:32 UTC, dat er rond "laatst gelezen 1 november" stond.
- Hoe Googles gzip-lezer precies met meerdere leden omgaat is niet gedocumenteerd.
- Het bestand van 23 september (1.497 URL's volgens de leverancier) hebben we niet.
