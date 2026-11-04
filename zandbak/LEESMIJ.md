# De zandbak

> **ACHTERHAALD sinds 4 november 2026. Werk hier niet meer in.**
>
> Ward dupliceert de themapagina in Shopware; daar werken we voortaan op, op de
> echte site met echte data. Dat haalt de hele klasse problemen weg waar deze
> zandbak op stukliep: een momentopname van 2 november die veroudert, ontbrekende
> `/media`-beelden, en `/widgets`-verzoeken die een 404-pagina in de DOM plakten.
>
> **Wat eruit gered is en nu elders staat:**
>
> | Wat | Waar het nu staat |
> |---|---|
> | De 332 CSS-regels (sectie 51) | `rootedgoods.css`, de levende versie |
> | De 73 JS-regels (raster) | `rootedgoods.js`, de levende versie |
> | De nieuwe hero | `blokken-def/thema-eindejaarsgeschenken-raster.html` |
> | De metingen | `docs/metingen/2026-11-04-hero-feiten/` |
>
> `zandbak/rootedgoods.css` en `-.js` zijn nu gelijk aan de wortel en hebben geen
> functie meer. De map blijft staan tot het raster live is, voor het geval we de
> momentopname nog ergens voor nodig hebben.
>
> **Wat hieronder staat blijft wel de moeite waard om te lezen**, vooral "De val
> waar dit werk twee keer in liep": die twee bugs waren echt en zaten in onze
> eigen CSS, niet in de zandbak. Op een duplicaat waren ze precies zo opgetreden.


Hier staat het onafgemaakte hero- en rasterwerk voor de themapagina's, punt 13 en 15
van het verbeterplan. Vastgelegd op 3 november 2026, omdat het tot dan alleen in een
tijdelijke sessiemap stond en bij de eerstvolgende opschoning weg zou zijn geweest.

## Lees dit eerst

**`zandbak/rootedgoods.css` en `zandbak/rootedgoods.js` zijn werkkopieën, niet de
levende bestanden.** De live site laadt `rootedgoods.min.css` en `.min.js` uit de
**wortel** van deze repo via jsDelivr. Niets hier wordt ooit door de site geladen.

Bewerk je per ongeluk de verkeerde, dan merk je dat niet. Het verschil opvragen:

```bash
diff rootedgoods.css zandbak/rootedgoods.css   # vanuit de wortel
diff rootedgoods.js  zandbak/rootedgoods.js
```

Stand op 4 november 2026: **332 gewijzigde CSS-regels en 73 JS-regels.**
(Was 209 CSS-regels bij het vastleggen op 3 november.)

## Wat erin zit

| Bestand | Wat het is |
|---|---|
| `bron-kerst.html` | De echte `/thema-s/kerstpakketten-eindejaar/` zoals hij live stond, vastgelegd 2 november. Niet bewerken. |
| `bouw.py` | Bouwt `index.html` uit die bron: vervangt de twee jsDelivr-URL's door de lokale kopieën en zet `hero.html` op de plek van de oude hero. |
| `hero.html` | De nieuwe hero. `rg-page-hero--raster` is de marker: zonder die class doet alle raster-CSS en -JS niets. |
| `server.py` | Serveert deze map op 8010 met `no-cache`. Alles wat hier niet staat (`/media/…`, `/widgets/…`) gaat met een 302 door naar de live site. |
| `index.html` | Gegenereerd door `bouw.py`, staat in `.gitignore`. |

## Draaien

```bash
python3 zandbak/bouw.py
python3 zandbak/server.py        # http://localhost:8010/
```

Onderin staat een groene balk "ZANDBAK, lokaal, niet de live site", zodat je het nooit
voor de echte site aanziet.

**Waarom de server doorverwijst naar de live site.** Zonder dat kreeg je twee stille
vervalsingen. Het thema haalt bij het laden `/widgets/checkout/info` op en plakt het
antwoord in de winkelmandjeknop; lokaal was dat de 404-pagina van Python, en die
kwam met `<h1>Error response</h1>` als Playfair-kop van 41 px boven de hero te
staan. En alle `/media/…`-afbeeldingen ontbraken, dus de klantlogo's waren kapotte
alt-teksten en elke hoogtemeting van de hero kwam te laag uit. Sinds 4 november
gaat alles wat hier niet op schijf staat met een 302 naar `rootedgoods.eu`.

Dit is poort **8010**, dezelfde als `_preview.html` uit de CLAUDE.md. Ze kunnen niet
tegelijk. Controleren met `lsof -ti tcp:8010`.

## Wat er werkt

1. **Het raster overrulet de productslider van het thema zonder bij het thema te hoeven.**
   `rootedgoods.min.js` staat op byte 6.403 in de head en het thema-`all.js` op 11.268,
   allebei `defer`, dus onze JS draait eerst en kan `data-product-slider` weghalen
   voordat tiny-slider zich eraan vastklampt.
2. **De hero draagt nu de feiten.** Prijsbandbreedte, minimale afname en de
   besteldeadline staan boven de vouw, met één knop. Dat is punt 1 van
   `docs/kerstpagina-herzien.md`. De twee getallen zijn nagemeten, zie
   `docs/metingen/2026-11-04-hero-feiten/`.
3. **De eerste rij tegels past op elke telefoonmaat.** Gemeten in de browser op
   4 november, met echte afbeeldingen:

   | Scherm | Hero | Eerste rij | Past | Tweede rij zichtbaar |
   |---|---:|---:|---|---:|
   | 390×844 | 348 px | tot 758 px | ja | 76 px |
   | 360×780 | 348 px | tot 743 px | ja | 27 px |
   | 430×932 | 348 px | tot 793 px | ja | 129 px |

## De val waar dit werk twee keer in liep

**De tegenstander was niet het thema maar onze eigen CSS.** Sectie 16 (de
homepage-slider) zet met `!important` een hele reeks eigenschappen op
`:is(.home-productslider, .cms-listing-row) …`, en die selector matcht hier gewoon
mee. Twee keer leverde dat stil het verkeerde resultaat op:

| Wat sectie 16 zet | Wat er misging |
|---|---|
| `height:0; padding-bottom:85%` op de image-wrapper | Sectie 51 gebruikte `aspect-ratio`. Twee verhoudingssystemen, en de verkeerde won: beeldvlak van 169×143 in plaats van vierkant. |
| `padding: 0 15px` op elk slider-item | Hield een tegel van 190 px op een beeld van 160 px. |

Opgelost door **mee te doen met de machinerie die er al staat** in plaats van hem te
bevechten: dezelfde `height:0 + padding-bottom`-truc, alleen met 100% voor vierkant
en 56,25% voor de brede tegel. Sectie 51 staat achteraan in het bestand, dus bij
gelijke specificiteit wint hij. **Verplaats sectie 51 niet naar voren.**

Les voor de volgende keer: als een regel in sectie 51 niet doet wat je verwacht,
zoek eerst in ons eigen bestand naar `!important` op `.home-productslider` voordat
je naar het thema kijkt.

## Twee besluiten, met de meting erbij

**De scrollhint komt er niet.** Dat stond nog open. Hij is overbodig geworden: op
390×844 is de eerste rij tegels helemaal zichtbaar en steekt de tweede rij er 76 px
bovenuit. Een half zichtbare rij productfoto's is een sterkere uitnodiging om te
scrollen dan een pijltje, en hij kost geen hoogte.

**De sfeerregel staat alleen op desktop.** Onder 992px is `.rg-page-hero__sub`
verborgen en komen de feiten ervoor in de plaats. Dat is de ruil uit
`kerstpagina-herzien.md`: het gevoel stond vooraan en de feiten ontbraken, en voor
een advertentiebezoeker hoort dat andersom.

## Wat nog open staat

**Desktop: kop en tegels lopen niet gelijk.** Op 1280 px begint de kop "Inspiratie"
op x=80 en de eerste tegel op x=135. Oorzaak gemeten: het CMS-blok van de slider
heeft 120 px zijpadding waar het tekstblok er 80 heeft. Dit bestond al vóór dit werk
en is niet door het raster veroorzaakt. Niet opgelost omdat het goed doen een rondje
langs alle breekpunten vraagt, en 89,6% van het verkeer mobiel is (gemeten 29 okt
t/m 2 nov). Mobiel loopt wel gelijk, allebei op x=15.

**Op desktop valt de eerste rij onder de vouw.** 1280×900: de hero is 512 px, de
tegels beginnen op 807 en de brede tegel loopt tot 1160. Je ziet 93 px van de rij
eronder. Op mobiel is dat opgelost, op desktop niet bekeken.

**De besteldeadline is nog niet bevestigd.** Zie het commentaar in `hero.html` en
`docs/metingen/2026-11-04-hero-feiten/notities.md`. De datum volgt uit een termijn
van vijftien werkdagen die nergens gemeten is.
