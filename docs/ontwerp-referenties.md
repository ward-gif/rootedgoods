# Ontwerpreferenties

Levend document. Stuur een URL met één regel waarom hij je opviel, dan komt hij hier met een
notitie erbij. Beter één plek dan links in een gesprek, want daar waren ze gisteren al bijna
kwijtgeraakt.

**Niet verwarren met** `showroom/plan-ronde-3.md` sectie 3. Daar staan elf gemeten
referentiesites voor scrollchoreografie op de showroom. Zeven ervan leunen op Lenis, dat de
native scroll kaapt; op een catalogus van 8,4 MB met een INP van 500 ms is dat het laatste wat
je erbij wilt. Ander medium, andere eisen.

---

## Gemnote, Create Your Merch

<https://www.gemnote.com/create-your-merch/> — bekeken 2 november 2026

Ward: *"na de logo's komt een overview van wat producten en daaronder een formulier om heel
concreet een aanvraag af te vangen."*

**Wat er echt staat**, van boven naar beneden: hero met een weggeefactie · logoraster waarin
klantlogo's en productfoto's elkaar afwisselen in één schaakbordpatroon · "Upgrade your holiday
merch with free design services" · een raster van losse productbeelden · drie
voordeelkolommen · het formulier.

**Het logoraster is het eerste wat we kunnen lenen.** Zij zetten logo's en productbeeld door
elkaar in één raster, zodat de sociale bewijskracht en het product hetzelfde blok delen. Wij
hebben een losse logocarrousel met twintig beelden van `bambook.08.promidata.shop` en
`alt="Slide 1"` tot `"Slide 17"`. Dat blok doet nu niets en kan dit worden.

**Het productraster is geen catalogus maar één case.** Alle beelden zijn de merchset van één
klant (PHUTURE AI): sokken, hoodie, mok, pet, stickers, notitieboek. Geen prijzen, geen
kaarten, geen randen. Het verkoopt "zo ziet jouw set eruit", niet "koop dit".

> Dat is een belangrijk verschil met wat Ward voorstelde. Productkaarten mét prijs beantwoorden
> de vraag van een inkoper. Een stilleven van één complete set verkoopt het idee. Allebei goed,
> maar het zijn twee verschillende blokken met twee verschillende doelen, en Gemnote gebruikt
> hier bewust het tweede.

**Het formulier is het sterkste onderdeel van de hele pagina, en de reden is dat je er niets
hoeft te typen.** Op naam, zakelijk e-mailadres, telefoon en een datum na is alles een chip:

| Veld | Opties |
|---|---|
| I'm looking for *(meerdere)* | Holiday Gifts · Employee Swag · Event Swag · Client Gifts · Rebrand Swag · Brand Merch · Marketing Campaign · Warehousing · Swag Software · Full service |
| Number of units | 50-200 · 201-400 · 401-800 · 801-1000 · 1000-2000+ |
| Within a total budget of | $5.000-10.000 · $10.000-20.000 · $20.000-50.000 · $50.000-100.000+ |
| My in-hands date is | datumkiezer |
| Shipping primarily in the US? | Ja / Nee |

**Nul vrije tekstvelden.** Dat is precies ons probleem: ons offerteformulier heeft een leeg
tekstvak waarin iemand zelf moet uittypen wat hij wil, op een andere pagina dan waar hij het
product zag. Dit is kwalificatie in plaats van een briefing, en het is in dertig seconden te
doen op een telefoon.

**Wat ik zou overnemen:** de chipvorm, de bandbreedtes voor aantal en budget, en de
leverdatum. Dat laatste vervangt de kerstdeadline die Ward bewust niet op de site wil: je
vraagt hem in plaats van hem te roepen.

---

## Listed Wines

<https://listedwines.com/nl> — bekeken 2 november 2026

Ward: *"een goed voorbeeld van hoe het ongeveer moet."*

De hero is in tweeën: links de kop met een cursieve opsomming en twee knoppen, rechts een
raster van productkaarten dat verspringt, elke kolom met een eigen verticale verschuiving. De
kaarten zijn echte producten met naam, jaartal en producent. Next.js; er zit geen GSAP of
Lenis in, dus de beweging is CSS of een gebundelde motion-laag.

**Wat het goed doet:** je ziet binnen één scherm tegelijk wat het platform is én wat erin zit.
Geen sfeerbeeld dat niets zegt, maar de inhoud zelf als decor.

**Let op bij het overnemen:** er zit een leeftijdsverificatie voor de pagina, dus ik heb hem
alleen achter die modal kunnen beoordelen en niet in beweging gezien. De staggered kolommen
zijn ook het soort effect dat op een telefoon vaak wordt uitgezet, omdat twee kolommen naast
elkaar daar niet passen.

---

## Wat het Shopware-thema hiervan aankan

Nagemeten op de live pagina's, 2 november 2026.

**Wat al werkt.** Op `/eindejaarsgeschenken` staat één Shopware-CMS-blok, `home-productslider`,
met negen producten erin en `productboxMinWidth: 300px`. Producten per pagina selecteren kan
dus al en gebeurt al. Op de homepage staat hetzelfde blok plus de logoslider.

**Wat niet kan, en dit is de kern.** Onze eigen secties (`rg-page-hero`, `rg-compare`,
`rg-endcta`) zijn platte HTML die Ward in de editor plakt. Die kan geen productdata ophalen:
geen prijs, geen voorraad, geen staffel. **Productkaarten in de hero kunnen dus niet uit ons
blok komen.** Ze moeten uit een Shopware-element komen.

Daarmee valt de letterlijke Listed Wines-hero af, tenzij we de hero opsplitsen: onze HTML voor
de kop, en daaronder meteen het Shopware-blok. Dat is geen compromis maar waarschijnlijk beter,
want het scheelt het handmatig bijhouden van prijzen in geplakte HTML.

**Beantwoord door Ward op 2 november 2026:**

1. `/eindejaarsgeschenken` is een **landingspagina**, geen categorie. Daarmee vervalt het
   product-listing-element, want dat leest de categoriecontext en werkt op een LP niet.
2. De slider staat op een **dynamische productgroep**, niet op handmatige selectie. Dat
   verklaart de negen producten en het betekent dat we de volgorde niet zelf bepalen; wil je
   drie bepaalde producten bovenaan, dan moet dat via de sortering van de stream of via losse
   product boxes.
3. Ward maakt een testpagina met alle kandidaatblokken erop. Zie hieronder.

**De route die hierdoor open blijft:** Shopware heeft naast de slider een los
**Product box**-element, één product per blok. Drie of vier naast elkaar in één rij is een
echt raster met echte productdata, ook op een landingspagina. Dat zou het rasterpunt alsnog
mogelijk maken, en het is het eerste wat de testpagina moet uitwijzen.

## De architectuur, besloten 2 november 2026

**De LP blijft de bestemming van de advertenties, met de categorie erachter.** Dat is wat er
nu staat en het blijft zo.

Elk thema bestaat op **twee URL's**, en dat is geen fout maar een rolverdeling:

| | `/brievenbus` (LP) | `/thema-s/brievenbus/` (categorie) |
|---|---|---|
| Controller | `is-ctl-landingpage` | `is-ctl-navigation` |
| Onze eigen secties | ja: `rg-page-hero`, `rg-compare`, `rg-endcta` | **geen** |
| h1 | "Brievenbuscadeaus" | **geen** |
| Producten | 18, in een slider | 18, listing met filters |
| Canonical | via JS, `rootedgoods.js` sectie 1.5d | serverzijdig |

Ik had eerst voorgesteld om alles naar de categorie te sturen. Dat was fout. De categorie
heeft geen h1 en geen enkele inhoud buiten het raster; advertentieverkeer daarheen sturen is
mensen op een kaal overzicht zetten. En een LP geeft de lay-outvrijheid die een advertentieklik
nodig heeft. De LP linkt ook gewoon door: **vier links naar de categorie**, waarvan drie met
het label "Bekijk alle producten" (2×) en "Ontdek de producten", de eerste op 28% van de
pagina.

**Wat er wél niet klopt, is het productblok op die LP.** Een slider die mobiel twee producten
per scherm toont. De carrouselpijl kreeg op de kerstpagina **90 van de 317 taps**, 28,4%, en
is daarmee na de cookiebanner het meest aangeraakte element van de pagina. De knop eronder
kreeg 25 taps, de offerteknop in de hero 4. Mensen zijn aan het werk om producten te zien.

Dat is de ingreep: niet verhuizen, maar op de LP meer producten tegelijk tonen en de doorklik
naar de categorie zichtbaar maken vóór het scrollen.

**Naamgeving.** Zodra de LP zelf producten toont, wordt "Bekijk alle producten" een
tegenstrijdig label, want ze staan er al. Beter is een aantal: "Alle 18 kerstgeschenken".
Dat zegt tegelijk dat er meer is en hoeveel.

**Geparkeerd tot januari: de dubbeling zelf.** Twee URL's met dezelfde achttien producten en
een categorie zonder h1 is een echt SEO-probleem. Maar SEO levert dit kwartaal 103 vertoningen
en 20 klikken in 29 dagen op, dus er valt nu weinig te verliezen en vier weken voor het einde
van het seizoen is het verkeerde moment. In januari is de vraag: één pagina per thema, en
welke van de twee wint.

### De testpagina, uitgevoerd en doorgelicht

Ward zette `https://rootedgoods.eu/test` neer als landingspagina met alle kandidaatblokken
erop. Doorgelicht op 2 november 2026; de ruwe HTML en alle getallen staan in
`docs/metingen/2026-11-02-blokkentest/`.

**De hoofdvraag is ja.** `cms-block-product-three-column` werkt op een landingspagina: drie
`cms-element-product-box` in `col-md-4`, met echte productdata, prijs en link. Het raster uit
punt 15 kan dus zonder Promidata.

| | Uitkomst |
|---|---|
| Product box, drie naast elkaar | **werkt** |
| Product slider met handmatige selectie | werkt, `productboxMinWidth: "300px"` |
| Gallery-buybox | werkt, **en rendert de volledige staffeltabel** |
| Formulier (cioform) | werkt, maar in de test alleen vrije tekstvelden |
| Cross-selling | lege kolom, geen productcontext op een LP |
| Product listing | bestaat niet op een LP, zoals verwacht |

**De onverwachte winst: `cms-element-buy-box` geeft de staffel.** "Hoeveelheid / Prijs per
eenheid", van "Tot 4: € 18,13" tot "Tot 999: € 14,63". Dat is punt 12 van het verbeterplan,
kant en klaar, zonder aantalveld of bestelknop. Een los blok per product, dus niet geschikt
voor het raster, maar wel voor één uitgelicht product.

**Drie dingen maken de kaarten nu te hoog, alle drie oplosbaar:**

1. `col-md-4` breekt op 768 px, dus één kaart per rij op mobiel. Onze CSS.
2. `productboxMinWidth: 300px` laat één sliderkaart per mobiel scherm zien. CMS-veld.
3. **De volledige productbeschrijving staat in de kaart**, 604 tot 1.611 tekens. Bij circa
   veertig tekens per regel is dat ruim 450 px tekst per kaart. Onze CSS.

**Een aanname gecorrigeerd.** De productelementen leveren wél `srcset` (50 van de 57 beelden)
en wijzen naar `/shared/thumbnail/`. De "0 met srcset" uit `q4-aanvragen-plan.md` gaat over
onze eigen geplakte blokken, niet over het thema.

**Nog open:** of de cioform-plugin keuzevelden kan (select, radio, checkbox, datum). Dat
bepaalt of het Gemnote-formulier met chips en bandbreedtes haalbaar is. Te zien in de
formulierbeheerder, niet in de HTML.

---

## Mijn voorstel, op volgorde van opbrengst

Mobiel is 67% van al het verkeer en 87% van het advertentieverkeer. De kerstpagina is 7.429 px
hoog en bezoekers zien er gemiddeld een derde van. Dat stuurt alles hieronder.

Bijgewerkt op 2 november 2026 na de blokkentest: punt 2 en 4 zijn samengevoegd, want de test
wees uit dat het raster kan en dat het de slider dus kan vervangen in plaats van aanvullen.

**1. Hero inkorten tot één scherm.** Kop, één regel die prijs per stuk, minimale afname en
levertijd beantwoordt, één knop. Dat is punt 13 en het kan in onze eigen HTML, zonder
Shopware. Gerekend uit de CSS op 390 px breed is de hero nu 769 px; het doel is circa 350 px,
zodat er een rij productkaarten in het eerste scherm past.

**2. `cms-block-product-three-column` direct onder de hero**, in plaats van de slider.
Bewezen werkend op een LP. Op mobiel twee kolommen via onze CSS, door `col-md-4` onder
768 px op 50% te zetten. Dat is punt 15, en het maakt de carrouselpijl overbodig die nu
90 van de 317 taps krijgt.

**3. De productbeschrijving in de kaart afkappen.** Nu 604 tot 1.611 tekens per kaart. Twee
regels met `line-clamp` is genoeg; de kaart hoort naar de productpagina te leiden, niet die
pagina te vervangen. Dit is de goedkoopste hoogtewinst van de hele lijst.

**4. De productkaart laten zeggen wat een inkoper vraagt.** Nu staat er "Van € 5,73", zonder
per stuk, zonder excl. btw en zonder minimale afname. Dat is punt 12. **De staffeltabel uit
`cms-element-buy-box` is hier het antwoord**, maar dat is een blok per product, dus bruikbaar
voor één uitgelicht product en niet voor het raster. Voor de kaarten zelf blijft het onze CSS
en JS; let op de valkuil die daar al genoteerd staat, de listing ververst via AJAX dus er is
een MutationObserver nodig.

**5. Het Gemnote-formulier als afsluiting.** Chips, bandbreedtes, een leverdatum, geen vrij
tekstveld. **Hangt aan één onbekende**: of de cioform-plugin keuzevelden kan. Kan dat niet,
dan is het beste haalbare een kortere versie van wat er nu staat, en dan moet eerst het
voorgevulde spatieteken in het naamveld eruit en de titel "Formular Titel".

**Wat ik zou uitstellen: de geanimeerde hero.** Het is het duurste onderdeel, het kan niet
zonder Shopware-werk omdat onze HTML geen productdata heeft, en animatie op een pagina met een
INP van 500 ms is een risico. Het is ook precies het soort toevoeging dat generiek uitgevoerd
juist AI-achtig oogt, en dat is wat we proberen te vermijden. Doe eerst 1 tot en met 5, meet,
en kijk dan of de hero nog beweging nodig heeft.

---

## De fade met "meer bekijken"

Ward stelde voor een deel van het raster in de hero te laten beginnen, daaronder meer te tonen
en dan een fade met een knop. Het patroon werkt, maar weeg het tegen het gedrag: op een pagina
waar mensen een derde zien, is het beter om zes producten volledig te tonen dan twintig half.
Een fade is nuttig als er écht veel onder staat; hier is het eerder een extra handeling voor
iets dat al kort kan zijn.
