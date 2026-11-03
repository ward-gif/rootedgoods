# De zandbak

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

Stand bij het vastleggen: **209 gewijzigde CSS-regels en 73 JS-regels.**

## Wat erin zit

| Bestand | Wat het is |
|---|---|
| `bron-kerst.html` | De echte `/thema-s/kerstpakketten-eindejaar/` zoals hij live stond, vastgelegd 2 november. Niet bewerken. |
| `bouw.py` | Bouwt `index.html` uit die bron: vervangt de twee jsDelivr-URL's door de lokale kopieën en zet `hero.html` op de plek van de oude hero. |
| `hero.html` | De nieuwe hero. `rg-page-hero--raster` is de marker: zonder die class doet alle raster-CSS en -JS niets. |
| `server.py` | Serveert deze map op 8010 met `no-cache`. |
| `index.html` | Gegenereerd door `bouw.py`, staat in `.gitignore`. |

## Draaien

```bash
python3 zandbak/bouw.py
python3 zandbak/server.py        # http://localhost:8010/
```

Onderin staat een groene balk "ZANDBAK, lokaal, niet de live site", zodat je het nooit
voor de echte site aanziet.

Dit is poort **8010**, dezelfde als `_preview.html` uit de CLAUDE.md. Ze kunnen niet
tegelijk. Controleren met `lsof -ti tcp:8010`.

## Waar het bleef steken

De twee dingen die werkten en de moeite van het bewaren waard zijn:

1. **De lange tegels zijn opgelost, en het was een bug en geen smaak.** Het thema zet
   `.product-box { height: 100% }` met `.product-image-wrapper { flex-grow: 1 }`, en die
   combinatie overrulet `aspect-ratio`. De kaart rekt dan mee met de langste in de rij.
   Opgelost met `align-items: start` op het raster en `flex: 0 0 auto` op de wrapper.
2. **Het raster overrulet de productslider van het thema zonder bij het thema te hoeven.**
   `rootedgoods.min.js` staat op byte 6.403 in de head en het thema-`all.js` op 11.268,
   allebei `defer`, dus onze JS draait eerst en kan `data-product-slider` weghalen
   voordat tiny-slider zich eraan vastklampt.

Wat nog open staat: de hero zelf. De scrollhint en de verhouding tussen hero en eerste
rij tegels op mobiel zijn niet af.
