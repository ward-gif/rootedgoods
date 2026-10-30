# Dode links en dode klikken, 30 oktober 2026

Aanleiding: twee Clarity-sessie-inzichten die allebei op een **dead click** wezen.
Alles hieronder is nagemeten, niet gegokt.

## 1. "Bekijk alle producten" in de hoofdnavigatie gaat nergens heen

**Dit is de belangrijkste, en het verklaart precies wat Clarity meldde.**

In de flyout "Onze categorieën" staat een knop *Bekijk alle producten* met:

```
href="/search?search="
```

Een zoekopdracht zonder zoekterm. Die URL geeft http 200, maar rendert **de homepage
opnieuw, met nul producten**. De bezoeker klikt op "bekijk alle producten" en belandt op
iets dat eruitziet als de pagina waar hij vandaan kwam.

Clarity zag het zo: *"Rond 00:08 klikte de gebruiker op Bekijk alle producten, maar dit
resulteerde in een dead click. Er werden geen verdere interacties geregistreerd, waarna
de sessie kort daarna eindigde."*

De knop staat in de **hoofdnavigatie**, dus op elke pagina van de site.

**Wat het moet zijn:** `/alle-producten/`.

**Waar het zit:** niet in onze blokken. De link staat niet in de server-HTML en wordt
client-side opgebouwd in `div.navigation-flyouts`. Dat is de mega-menu van het thema.
Onze eigen JS (sectie 2.0b) verplaatst op mobiel wel een link met die tekst, maar maakt
de `href` niet; die komt uit de navigatie-instelling.

**Te controleren:** in Shopware onder Catalogus of Inhoud, bij de categorie "Onze
categorieën", staat waarschijnlijk een ingestelde link die leeg is gebleven.

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
