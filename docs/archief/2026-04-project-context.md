# Rooted Goods — Project Context

## Platform
- Shopware 6.5.8.16 via Promidata (promidata.shop)
- Gesloten custom thema — geen directe toegang tot themabestanden
- CSS en JS worden geïnjecteerd via de HTML/Twig editor (moori plugin) op de homepage
- Doel: CSS en JS uiteindelijk globaal laten laden via Promidata of GitHub Pages

## Beperkingen Promidata
- Geen plugin installatie rechten
- CSS aanleveren kan, Promidata implementeert het
- Navigatie aanpassen: Menu 1/2 = €250, Menu 3 = €500
- PDP aanpassen boven configurator: €1000
- GTM plugin: €250 eenmalig — gepland
- Globale CSS/JS implementatie: in afwachting van antwoord Eva (webshop@promidata.com)

## Merk & Design
- Naam: Rooted Goods (rootedgoods.eu)
- Propositie: B2B platform voor premium EU-made promotionele producten en relatiegeschenken
- Doelgroep: B2B inkopers en marketing managers
- Primair doel website: offerte aanvragen en merkbekendheid

## Kleuren
- Achtergrond body: #fbf7f5
- Achtergrond zoekbalk / topbar: #ede9e2
- Accent (goud): #ab8249
- Secundaire achtergrond secties: #f7f5f0

## Typografie
- Body: Montserrat (Google Fonts, gratis)
- Headings: Libre Baskerville (Google Fonts, gratis)
- Geladen via: https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Montserrat:wght@400;500;600&display=swap

## Bestandsstructuur
- `rooted-goods.css` — alle custom CSS
- `rooted-goods.js` — alle custom JS
- `CONTEXT.md` — dit bestand

## Wat er al werkt
- Sticky header + nav met hide-on-scroll gedrag
- Zoekbalk met overlay on focus
- Zoekresultaten container styling
- Category flyout: donkere overlay op afbeeldingen, witte vette tekst
- Category flyout smaller (90%) en gecentreerd
- FA icoon layer-group (#ab8249) voor "Onze categorieën"
- Home link verborgen
- Nav links gecentreerd
- Topbar met USP's en navigatielinks (Over ons, Cases, Contact)
- "Bekijk alle producten" button in flyout
- Navigatielinks (Over ons, Cases, Contact) via JS injectie in nav

## To-do
- CTA button "Bespreek de mogelijkheden" — header of sticky zijknop, actie nog te bepalen
- Labels/iconen op categorieën in flyout
- Taalwisselaar activeren zodra EN/DE/FR talen zijn ingericht
- Dropdowns testen voor Thema's en Merken via subcategorieën
- Contentpagina's bouwen (12 MVP pagina's)
- Afbeeldingen categorieën flyout vervangen door donkere achtergrondafbeeldingen
- GTM plugin laten installeren door Promidata

## Huidige HTML in Twig editor
```html


```