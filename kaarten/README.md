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
2. **Kleur** naar huisstijl-groen `#2d4528` (was `#c9c2b5`). Dim met CSS
   `opacity` per gebruik. Voor donkere secties kan er later een lichte
   variant gegenereerd worden.
3. **Uitsnede strakgetrokken** (viewBox = inhoud + 2% marge), dus geen dode
   marges meer. Bij **Portugal** en **Spanje** is bijgesneden op het
   *vasteland*: hun originele viewBox omvatte de Azoren resp. de Canarische
   Eilanden, waardoor het vasteland maar 13% resp. 56% van het kader vulde.
   De eilandgroepen zitten nog wel in het bestand, maar vallen buiten de
   viewBox.

## Bronbestanden (Shopware-media)

| Bestand | Bron-URL |
|---|---|
| land-europa.svg | https://bambook.08.promidata.shop/media/50/8f/0c/1786519487/Europe outline map.svg |
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
| land-portugal.svg | https://bambook.08.promidata.shop/media/4d/0a/aa/1786519469/Portugal.svg |
| land-roemenie.svg | https://bambook.08.promidata.shop/media/ba/7f/a3/1786519469/Romania.svg |
| land-slovenie.svg | https://bambook.08.promidata.shop/media/11/b3/5c/1786519469/Slovenia.svg |
| land-spanje.svg | https://bambook.08.promidata.shop/media/a1/1f/c6/1786519471/Spain.svg |
| land-turkije.svg | https://bambook.08.promidata.shop/media/22/04/a1/1786519471/Turkey.svg |

## Let op

- `land-europa.svg` is met 768KB (~161KB gzip) veruit het zwaarst; de rest
  is 6-55KB. Bij gebruik boven de vouw meewegen in de performance-check.
- De oudere `europa-outline.svg` in de repo-root is de vorige (grovere)
  Europa-outline; `kaarten/land-europa.svg` is de nieuwe, detailrijkere.
