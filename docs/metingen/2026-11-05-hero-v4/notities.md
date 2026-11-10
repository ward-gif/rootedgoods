# Hero vierde opzet, meting op de testpagina, 5 november 2026 (avond)

Pagina: https://rootedgoods.eu/Test-page-concepts12 (draagt het oude blok). De nieuwe
hero is via `outerHTML` in de pagina gezet, CSS-secties 53 en 54 en de band-JS zijn als
`<style>`/`eval` geïnjecteerd (zonder commentaar, base64). De rest van de CSS is de live
`rootedgoods.min.css@main`. Eén paginalading.

`localhost:8000` als `<link>` of `fetch` werkt niet vanaf de live pagina (geblokkeerd), dus
Resource Override blijft de weg voor Ward; voor mij was injectie de enige route.

## Gemeten, 520 × 953 px (de enige breedte die het venster toelaat)

| | Derde opzet (5 nov ochtend) | Vierde opzet |
|---|---:|---:|
| hero hoogte | 505 px | **371 px** |
| band begint op y= | 663 | **529** |
| kop | 41,6 px, 85 px hoog | 32,4 px, 103 px hoog (3 regels) |
| feitenregel | 0,88 rem | 16,3 px (1,02 rem), geen bullets |
| elementen boven de band | 10 | 5 |
| link onder de band | scrolt naar intro | `/thema-s/kerstpakketten-eindejaar/`, pijl rechts, onderkant op y=924 |
| zichtbare kickers op de pagina | 2 | 0 (vangnet sectie 54 verbergt de oude compare-eyebrow) |
| horizontale scroll | | nee |
| logo's zichtbaar | | 3 (vierde verborgen door sectie 36, <992px) |

Hero, band en link passen samen in één scherm van 953 px.

## Niet gemeten
- 390 px: `resize_window` naar 390 meldt succes, maar `innerWidth` blijft 520.
- Desktop (≥992 px, gecentreerd): niet gezien. Afgeleid uit de CSS.
- De band zelf is hier niet beoordeeld; de live tiny-slider had al geïnitialiseerd voordat
  de band-JS draaide. Ward is tevreden over de band en die is niet gewijzigd.
