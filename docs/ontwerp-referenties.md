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

### De testpagina

Als landingspagina maken, niet als categorie, anders gelden de verkeerde beperkingen. Eén van
elk:

| | Waarom |
|---|---|
| **Product box**, en als het kan drie naast elkaar | de belangrijkste test: kan er een raster op een LP |
| **Product slider** met handmatige selectie | bestaat die optie naast de dynamische groep |
| **Product listing** | puur om te zien óf hij er is en wat hij op een LP doet |
| **Formulier-element** | bepaalt of het Gemnote-formulier haalbaar is |
| De beeld- en tekstblokken die in beeld zijn | om de markup te kennen voordat we erop stylen |

Herkenbare naam, bijvoorbeeld `/blokkentest`. **Op noindex zetten**, of in elk geval uit de
navigatie en de sitemap houden; hij staat anders gewoon live.

Wat eruit komt: de klassenstructuur van elk element zodat er CSS voor te schrijven is zonder
gokken, of product boxes in meerdere kolommen passen, welke markup het formulier geeft, en of
het thema de productbeelden met `srcset` uitlevert. Dat laatste raakt meteen het beeldgewicht
uit de plakronde.

---

## Mijn voorstel, op volgorde van opbrengst

Mobiel is 67% van al het verkeer en 87% van het advertentieverkeer. De kerstpagina is 7.429 px
hoog en bezoekers zien er gemiddeld een derde van. Dat stuurt alles hieronder.

**1. Hero inkorten tot één scherm.** Kop, één regel die prijs per stuk, minimale afname en
levertijd beantwoordt, één knop. Dat is punt 13 en het kan in onze eigen HTML, zonder
Shopware. Grootste effect, laagste kosten.

**2. De productslider direct daaronder.** Dat is slepen in de CMS-editor, kost niets. Nu staat
hij ver onder de vouw op een pagina die niemand uitleest.

**3. De productkaart laten zeggen wat een inkoper vraagt.** Per stuk, excl. btw, vanaf hoeveel.
Dat is punt 12 en het kan via onze eigen CSS en JS. Let op de valkuil die daar al genoteerd
staat: de listing ververst via AJAX, dus er is een MutationObserver nodig.

**4. Op mobiel een raster in plaats van de carrousel.** De carrouselpijl kreeg 90 van de 317
taps, oftewel 28,4%, en toont twee producten per scherm. Zes producten in twee kolommen plus
een knop is minder werk voor de bezoeker. Dat is punt 15.

**5. Het Gemnote-formulier als afsluiting.** Chips, bandbreedtes, een leverdatum, geen vrij
tekstveld. Dit is het goedkoopste punt met de meeste kans, want het is een formulier en geen
lay-out.

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
