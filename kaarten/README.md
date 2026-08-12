# Kaart-assets (land-outlines)

Line-art outlines van Europa en 15 landen, klaar voor gebruik als
achtergrondlaag/illustratie. Origineel aangeleverd via Shopware-media,
hier genormaliseerd opgeslagen zodat ze via jsDelivr domein-onafhankelijk
laden (dus go-live-proof: geen dev-URL's in de code).

## Gebruik

```html
<img src="https://cdn.jsdelivr.net/gh/ward-gif/rootedgoods@main/kaarten/land-frankrijk.svg" alt="">
```

Na een wijziging aan een kaart: purgen met
`https://purge.jsdelivr.net/gh/ward-gif/rootedgoods@main/kaarten/land-<naam>.svg`

## Normalisatie (wat er is aangepast t.o.v. de originelen)

1. **Lijndikte gelijkgetrokken.** De originelen hadden allemaal
   `stroke-width: .5px`, maar hun viewBox-breedtes liepen van 22 (Slovenie)
   tot 720 (Europa). Op gelijke weergavegrootte was Slovenie daardoor ~32x
   dikker dan Europa. De stroke is nu per bestand herrekend als
   `1.2 * (viewBoxBreedte / 600)`: elke kaart heeft exact dezelfde lijn
   (1,2px) bij een weergavebreedte van 600px, en blijft onderling
   consistent op elke andere breedte.
2. **Kleur** `#C9C2B5` (warm zandgrijs). Dim verder met CSS `opacity` per
   gebruik.
3. **Gevulde lagen verborgen.** De Europa-bestanden hebben naast de
   outline-lagen (`st0`/`st1`) ook een gevulde landmassa-laag (`st2`/`st3`,
   grijs met witte hairline). Die staat nu op `display:none`: anders rendert
   Europa als twee over elkaar liggende outlines (ziet eruit als een dubbele,
   te dikke lijn). De normalisatie is fill-bewust: lagen die `fill: none`
   hadden worden outline, lagen met een echte fill worden verborgen.
4. **Uitsnede strakgetrokken** waar nodig (alleen de Europa-bestanden hadden
   dode marges; de landen vulden hun viewBox al voor ~99%).
5. **Portugal en Spanje** komen van de *no islands*-bronbestanden. De eerdere
   versies omvatten de Azoren resp. de Canarische Eilanden, waardoor het
   vasteland maar 13% resp. 56% van het kader vulde.

## Bronbestanden (Shopware-media)

| Bestand | Bron-URL |
|---|---|
| land-europa.svg | https://bambook.08.promidata.shop/media/50/8f/0c/1786519487/Europe outline map.svg |
| land-europa-zonder-eilanden.svg | https://bambook.08.promidata.shop/media/1e/2c/1b/1786520436/Europe outline map no islands.svg |
| land-nederland.svg | https://bambook.08.promidata.shop/media/5c/3b/53/1786519469/Netherlands.svg |
| land-frankrijk.svg | https://bambook.08.promidata.shop/media/e9/27/e7/1786519473/France.svg |
| land-duitsland.svg | https://bambook.08.promidata.shop/media/39/a7/09/1786519471/Germany.svg |
| land-italie.svg | https://bambook.08.promidata.shop/media/17/f8/fb/1786519471/Italy.svg |
| land-oostenrijk.svg | https://bambook.08.promidata.shop/media/d2/ce/37/1786519473/Austria.svg |
| land-belgie.svg | https://bambook.08.promidata.shop/media/a0/05/dd/1786519473/Belgium.svg |
| land-kroatie.svg | https://bambook.08.promidata.shop/media/54/68/4e/1786519473/Croatia.svg |
| land-groot-brittannie.svg | https://bambook.08.promidata.shop/media/3c/1f/dc/1786519471/Great Britain.svg |
| land-hongarije.svg | https://bambook.08.promidata.shop/media/99/37/ab/1786519471/Hungary.svg |
| land-polen.svg | https://bambook.08.promidata.shop/media/42/c0/f3/1786519469/Poland.svg |
| land-portugal.svg | https://bambook.08.promidata.shop/media/b8/a7/db/1786520428/Portugal no islands.svg |
| land-roemenie.svg | https://bambook.08.promidata.shop/media/ba/7f/a3/1786519469/Romania.svg |
| land-slovenie.svg | https://bambook.08.promidata.shop/media/11/b3/5c/1786519469/Slovenia.svg |
| land-spanje.svg | https://bambook.08.promidata.shop/media/64/d6/92/1786520428/Spain no islands.svg |
| land-turkije.svg | https://bambook.08.promidata.shop/media/22/04/a1/1786519471/Turkey.svg |

## Let op

- `land-europa.svg` is met 768KB (~161KB gzip) veruit het zwaarst; de rest
  is 6-55KB. Bij gebruik boven de vouw meewegen in de performance-check.
- `land-europa.svg` (met eilanden) wordt gebruikt in de proloog van /over-ons;
  `land-europa-zonder-eilanden.svg` is de rustigere variant.
- In `merk/` staan het Rooted-beeldmerk, het woordmerk en de founders-foto
  (van 23,5MB PNG teruggebracht naar ~500KB JPEG).
