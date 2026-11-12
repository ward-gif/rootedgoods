# Productpagina traag, 12 november 2026

Aanleiding: Ward wilde de pagina Citizen Green Vanguard (A33-12080355, met
configuratie in de hash) naar een klant sturen, maar hij laadde "ongelofelijk traag".

## Uitkomst

1. **Het zit onder onze laag.** Verbindingen met rootedgoods.eu stokken willekeurig
   (TLS 1 tot 2 s, body 8 s, soms 45 s zonder afronding), ook bij een statisch
   CSS-bestand. Google en jsDelivr deden dat in dezelfde minuten niet.
   `ttfb-opgesplitst.txt`, `controle-uitvoer.txt`, `reeks-uitvoer.txt`.
   Staat als punt A6 in `docs/promidata-vragen.md`.
2. **Een eigen fout: de titel springt.** `moveProductNameToBuyCol()` (rootedgoods.js
   sectie 3.1) plaatst de titel bij DOMContentLoaded in de kopers-kolom, nadat onze CSS
   de oorspronkelijke kopregel verborgen heeft. Het kopersblok springt 92 px omlaag,
   CLS 0,23 op desktop. Bewezen met drie varianten: zonder onze JS 0 van 3 sprongen,
   met onze JS 3 van 3, zonder alleen die functie 0 van 3 (`blokkeer-cls.txt`,
   `titel-cls.txt`).
3. **Kandidaat-oplossing, niet gepubliceerd:** de titel via CSS-raster vanaf de eerste
   weergave rechtsboven, zonder JS. CLS-mediaan 0,229 naar 0,110 over 5+5 runs
   (`reeks-uitvoer.txt`). Patches: `kandidaat-titel-grid-css.patch` en
   `kandidaat-titel-grid-js.patch`.

## Wat niet kon of niet gemeten is

- De resterende CLS van ~0,11 komt van de configuratorgroepen die het thema opnieuw
  opbouwt (XHR `/detail/properties/add`). Dat kunnen we niet verhelpen.
- Het raster is alleen gemeten op 4 producten (1 hoofdproduct, 3 andere) op 1440 en
  1200 px, het hoofdproduct ook op 992 px. Niet op mobiel (de wijziging staat achter
  `min-width: 992px`), niet met het menu open, niet op productpagina's zonder
  configurator of met een afwijkende opbouw.
- De `!important` op breedte, max-breedte en flex van de twee kolommen is nodig omdat
  een regel uit het thema anders wint. Welke regel dat is, is niet uitgezocht.
- Alle metingen zijn vanuit één netwerk (Wards), en alleen headless Chromium. Of
  andere bezoekers de stokkende verbindingen ook zien is niet vastgesteld.
- Vroeg in de reeks haalden 2 van 12 laadbeurten het laad-event niet binnen 90 s. Die
  zijn niet meegeteld in de CLS-mediaan (dus n=5 per kant).
- PageSpeed (mobiel, score 57, FCP 5,3 s, LCP 9,7 s) meet met gesimuleerde 4G en CPU-
  vertraging; de serverrespons was daar 20 ms, dus die cijfers zeggen niets over de
  stokkende verbindingen. Opgesplitst in `psi-volledig-*.json`.

## Bestanden

| Bestand | Wat |
|---|---|
| `laden.mjs` | Volledige paginalaadbeurt in headless Chromium: waterval, LCP, CLS met bronnen, lange taken. Opties: `URL`, `PROFIEL`, `W`, `DREL=4g`, `BLOCK`, `EXTRA`, `JSFILE`, `CSSFILE`. |
| `controle.sh` | Zelfde TLS/TTFB-meting op een willekeurige URL, om het eigen netwerk uit te sluiten. |
| `reeks.sh` | Wisselt huidige situatie en grid-kandidaat af. |
| `probe-*.js` | Kleine scripts die in de pagina draaien. |
| `*.json`, `*.png` | Ruwe uitvoer per run. Bestanden met dezelfde naam zijn overschreven door herhaalde runs. |
