# Dode links en dode klikken, 30 oktober 2026

Aanleiding: twee Clarity-sessie-inzichten die allebei op een **dead click** wezen.
Alles hieronder is nagemeten, niet gegokt.

## 1. De lege `/search?search=`-link is van onszelf, en hij staat verborgen

**Herzien op 30 oktober 2026. De eerste versie van dit punt klopte niet, en de
conclusie draait om.**

Er bestaat inderdaad een link met `href="/search?search="` en de tekst
*Bekijk alle producten*. Maar:

1. **Wij maken hem zelf.** `rootedgoods.js`, sectie 1.3, regel 221 tot 242, zet na
   `DOMContentLoaded` een extra kolom in de categorie-flyout en vult die met
   `<a href="/search?search=" class="btn btn-primary">Bekijk alle producten</a>`.
   Het is geen instelling in Shopware en geen onderdeel van het thema.
2. **Wij verbergen hem zelf weer.** `rootedgoods.css` rond regel 1425:

   ```css
   /* CTA-knop in de categorie-flyout verbergen. */
   .flyout-cta-col,
   .flyout-cta-col a.btn { display: none !important; }
   ```

Gemeten op de live site, desktop 1440 en mobiel 390: de ouder
`.col-md-3.navigation-flyout-category.flyout-cta-col` heeft `display: none` en het
element meet 0 bij 0 pixels. **Geen bezoeker kan erop klikken.**

**Dus:** dit is dode code, geen dode link. Er valt in Shopware niets te repareren.
De opruiming is het verwijderen van sectie 1.3 uit `rootedgoods.js` plus de twee
regels in de CSS die hem verbergen. Dat kan mee met de volgende plakronde.

**En dus ook:** de dode klik die Clarity meldde (*"klikte op Bekijk alle producten,
dead click, sessie eindigde"*) is hiermee **niet** verklaard. Alle zichtbare knoppen
met die tekst zijn nagelopen en werken:

| Link | Status |
|---|---|
| `/alle-producten/` (hero) | 200 |
| `/thema-s/dag-van-de/` | 200 |
| `/thema-s/made-in-nl/` | 200 |
| `/thema-s/medewerker-merchandise/` | 200 |
| `/thema-s/events-conferenties/` | 200 |
| `/thema-s/brievenbus/` | 200 |
| `/thema-s/kerstpakketten-eindejaar/` | 200 |
| `/thema-s/onboarding/` | 301 naar `/thema-s/onboarding-welkom/` |

De oorzaak blijft dus open. De waarschijnlijkste verklaring die overblijft is traagheid:
de catalogus weegt mobiel 8,4 MB, en een klik waarna acht seconden niets gebeurt telt
in Clarity als een dode klik. Bewezen is dat niet.

## 2. Een klantlogo op de homepage linkt naar een bestandsnaam

```html
<a href="Franciscus Ziekenhuis">
  <img src="https://bambook.08.promidata.shop/media/.../Franciscus.png"
       alt="Slide 4" style="height: 100px;">
</a>
```

Drie dingen mis in één element:

- De `href` is een relatieve URL met een spatie erin. Hij lost op naar
  `rootedgoods.eu/Franciscus Ziekenhuis` en geeft niets terug.
- De afbeelding komt van **`bambook.08.promidata.shop`**, het beheerdomein van een
  andere winkel, niet van rootedgoods.eu.
- De alt-tekst is "Slide 4".

Dit is het enige element op de hele site met een spatie in de href.

## 3. Twintig afbeeldingen op de homepage komen van het Bambook-domein

De klantlogo-carrousel laadt **20 afbeeldingen vanaf `bambook.08.promidata.shop`**,
samen 145 kB. Ze laden allemaal, dus het is geen gewichtsprobleem, maar het is wel een
afhankelijkheid van een domein dat niet van ons is. Gaat dat domein ooit dicht of achter
een login, dan verdwijnen alle klantlogo's van de homepage.

Zeventien ervan hebben `alt="Slide 1"` tot en met `alt="Slide 17"`. Een deel van de
bestanden heet bovendien "Laag 1.png" tot "Laag 7.png".

**Een vraag die ik niet kan beantwoorden:** tussen die logo's staan Heineken, Deloitte,
ABN AMRO en EY. Als dat klanten van Bambook zijn en niet van Rooted Goods, dan is dat
sociale bewijskracht die er niet hoort te staan. De merkregel is duidelijk: geen
verzonnen klanten. De beelden komen van het Bambook-domein, maar dat bewijst niets, want
Promidata host beide winkels.

## 4. Negenenzestig productlinks gaan via een omleiding

Van 292 gecontroleerde productlinks op de catalogus- en themapagina's:

| | Aantal |
|---|---:|
| direct goed | 223 |
| omleiding, `-MAIN` wordt eraf gehaald | 19 |
| omleiding, afgekapte slug wordt aangevuld | 16 |
| omleiding naar een andere variant of naam | 34 |
| kapot | 0 |

Voorbeelden van die laatste groep:

```
/Borrelpakket-met-sap/A1352-ZH003   ->  /Borrelpakket-middel-met-sap/A1352-ZH003SM
/Thermosfles-1-liter/A1352-ROOT003  ->  /Thermosfles-1-liter/A1352-ROOT003BE
/Bodywarmer-320g/A1352-TEX05        ->  /Bodywarmer-320g/A1352-TEX05.1
```

Niets hiervan is kapot, maar elke omleiding is een extra heen-en-weer naar de server
voordat de bezoeker zijn pagina ziet. Op een catalogus die al 8,4 MB weegt telt dat mee.
Het hangt samen met C2 op de Promidata-lijst, over het canonicaliseren van
variant-URL's.

## 5. De "Eten & Drinken"-klik uit het andere Clarity-inzicht

Daar is geen kapotte link. De categorielink heeft een correcte `href`
(`/eten-drinken/`), maar het element meet 0×0 op het moment van meten: het zit in de
zijbalk die op mobiel is ingeklapt. De tik landde dus waarschijnlijk naast de link.

Dat sluit aan op **E2** van de Promidata-lijst: het meest aangeklikte element op de
catalogus is een lege `DIV.cms-section-sidebar-sidebar-content`, met negen klikken op
iets dat geen link is.

## Wat ik zou doen, op volgorde

1. **De navigatieknop repareren.** Staat op elke pagina en stuurt mensen naar een lege
   pagina. Jij kunt dit waarschijnlijk zelf in Shopware.
2. **De Franciscus-link en de alt-teksten.** Klein, en het zit in een CMS-blok.
3. **De logo's van het Bambook-domein naar onze eigen media verhuizen**, en meteen
   nalopen of alle getoonde klanten ook echt van Rooted Goods zijn.
4. De omleidingen meenemen in C2 bij Promidata.
