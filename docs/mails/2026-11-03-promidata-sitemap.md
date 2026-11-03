# Mail aan Promidata, 3 november 2026

Verzendklaar. Los van `docs/promidata-vragen.md`: dit is een bug, de rest zijn
verzoeken.

## Herschreven na een onafhankelijke controle

Een eerdere versie beweerde dat Promidata's cijfer van "ongeveer 268 KB" bewees dat
hun controle maar één gzip-lid had gelezen. **Dat was fout.** Nagerekend:

| | Bytes | kB (decimaal) | URLs |
|---|---:|---:|---:|
| Hele 1-nov-bestand | 340.621 | 340,6 | 1.943 |
| Alleen het eerste lid | 12.201 | 12,2 | 80 |
| Eén volledig lid bij 1.497 URLs | 267.566 | **267,6** | 1.497 |

Hun 268 kB komt met geen van de eerste twee overeen en wel met de derde. Hun meting
was dus waarschijnlijk gewoon juist voor dát moment: op 23 september stond er één lid
in het bestand. **Het gebrek is wisselvallig**, en dat is de juiste lezing.

Ook geschrapt: de bewering dat Googles verwerker "het eerste lid leest en daarom een
compressiefout meldt". Dat is een uitspraak over interne werking die we niet kennen.

De oorzaak is nu wél hard, nagelezen in de Shopware-bron op tag v6.5.8.16,
`src/Core/Content/Sitemap/Service/SitemapHandle.php`:

- regel 170: `gzopen($filePath, 'ab')`, **append-modus**
- regel 108: een vast pad in `sys_get_temp_dir()`
- regel 92: `@unlink($tmpFile)` staat alleen in `finish()`

Breekt een run af vóór `finish()`, dan blijft het afgebroken lid in `/tmp` staan en
plakt de volgende run er een nieuw lid achter.

---

**Platte tekst, zonder opmaak.** Markdown-tabellen en backticks plakken niet in een
mailprogramma, dus alles hieronder is kopieerbaar zoals het staat.

---

Onderwerp: Sitemap, aanvulling op 23 september: het gz-bestand krijgt er na elke mislukte generatierun een gzip-lid bij

Hallo,

Ik kom terug op jullie reactie van 23 september over de sitemap. Die staat sinds
16 september ingediend en meldt vandaag, zes weken later, nog steeds 0 ontdekte
pagina's.

Jullie controle van toen klopte waarschijnlijk gewoon. Dat is ook precies het
probleem: het gebrek is wisselvallig. Jullie troffen een goed moment.

Drie keer hetzelfde bestand opgehaald van dezelfde URL:

- het bestand van 1 november 13:32 UTC: 21.999 bytes, 4 gzip-leden, ongeldig
- na een regeneratie op 3 november 09:22 UTC: 19.122 bytes, 3 gzip-leden, ongeldig
- na een regeneratie op 3 november 09:24 UTC: 17.108 bytes, 1 lid, geldig

Bij meer dan één lid staan er meerdere losse XML-documenten achter elkaar, elk met een
eigen XML-declaratie en een eigen urlset, en alleen het laatste met een afsluitende
urlset. xmllint weigert dat op kolom 12.201. Jullie cijfer van 1.497 URLs en ongeveer
268 kB past precies bij één volledig lid, dus op 23 september stond het bestand goed.

Waar het vandaan komt. In src/Core/Content/Sitemap/Service/SitemapHandle.php (tag
v6.5.8.16) opent openGzip() het tijdelijke bestand met gzopen($filePath, 'ab'), dus in
append-modus, op een vast pad in sys_get_temp_dir(). De @unlink($tmpFile) staat alleen
in finish(). Breekt een run af voor finish(), dan blijft het afgebroken lid in /tmp
staan en plakt de volgende run er een nieuw lid achter.

Dat de runs afbreken zien we ook aan de voorkant: met Refresh strategy tijdelijk op
Live gaf het verzoek dat de generatie aftrapte HTTP 500. De afbreekpunten liggen
telkens op batchgrenzen (82 URLs is de homepage plus alle categorieen, 180 is dat plus
een productbatch van 100), dus het gaat mis in de product-provider.

Drie dingen die alleen jullie kunnen zien:

1. ls -la /tmp/*sitemap* op de app-server. Achtergebleven tmp-bestanden zijn het
   directe bewijs. Let op meerdere PHP-nodes met elk een eigen /tmp.
2. De foutlog rond 3 november 09:22:45 UTC en 09:24:06 UTC.
3. De status en fouten van de scheduled task sitemap_generate. Met strategy op
   Scheduled en een interval van 3.600 seconden was het bestand 44 uur oud.

Op dit moment staat er toevallig een geldig bestand, dus we dienen hem opnieuw in.
Komt de fout na de volgende mislukte run terug, dan is de keten rond.

Verder staat ons ticket over de snelheid van de site nog open, daar hebben we nog geen
reactie op gehad. /alle-producten/ laadt mobiel 8.365 kB, waarvan 7.680 kB beeld.
Graag ook daar een reactie.

Met vriendelijke groet,
Ward
