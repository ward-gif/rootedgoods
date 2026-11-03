# Blokkentest op /test, 2 november 2026

Ward bouwde `https://rootedgoods.eu/test` als landingspagina met alle kandidaat-CMS-blokken
erop, zodat de markup technisch doorgelicht kon worden voordat er CSS voor geschreven wordt.

`rootedgoods.eu-test.html` is de ruwe HTML, opgehaald met curl op 2 november 2026,
`HTTP 200`, 315.973 bytes. Alle getallen hieronder komen daaruit.

**De pagina is `is-ctl-landingpage is-act-index`.** Dus dit is een LP en alles hieronder geldt
voor een LP.

## Wat er op een landingspagina werkt

| Blok | Uitkomst |
|---|---|
| `cms-block-product-three-column` | **Werkt.** 3× `cms-element-product-box` in `col-md-4`, met echte productdata |
| `cms-block-product-slider` | Werkt. 6 kaarten, `productboxMinWidth: "300px"`, eigen `js-slider-next`/`prev` |
| `cms-block-gallery-buybox` | **Werkt, en levert de staffeltabel.** Zie hieronder |
| `cms-block-cioform` | Werkt. Een formulier van de cioform-plugin, post naar `/custom-form/send` |

## Wat er niet werkt

| Blok | Uitkomst |
|---|---|
| `cms-block-cross-selling` | Rendert een **lege** `col-12`. Geen productcontext op een LP |
| Product listing | **Komt niet voor.** 0 treffers op `cms-element-product-listing`, `cms-block-product-listing` en `product-listing-wrapper`. Bevestigt dat de listing categoriecontext nodig heeft |

## De vondst die we niet verwachtten: de staffeltabel

`cms-element-buy-box` rendert op een landingspagina de volledige staffel, met de kop
"Hoeveelheid / Prijs per eenheid":

| Tot | Prijs per eenheid |
|---:|---:|
| 4 | € 18,13 |
| 9 | € 18,13 |
| 49 | € 16,73 |
| 99 | € 16,03 |
| 499 | € 15,33 |
| 999 | € 14,63 |

Dat is letterlijk het antwoord op punt 12 van het verbeterplan, prijs per stuk en vanaf
hoeveel, en het staat er zonder dat wij iets hoeven te bouwen.

**Wat er niet in staat:** geen aantalveld, geen bestelknop. Geen treffers op `btn-buy`,
`input type="number"`, `js-quantity` of `name="lineItems`. Het is dus een prijstabel en geen
koopblok. Voor onze toepassing is dat precies goed.

## De drie dingen die de kaarten te hoog maken

**1. `col-md-4` betekent één kaart per rij op mobiel.** Bootstrap's `md` breekt op 768 px, dus
onder die breedte is elke kaart volle breedte. Op te lossen in onze eigen CSS, de klassen
staan vast.

**2. `productboxMinWidth` staat op 300 px.** Bij 350 px contentbreedte past daar één kaart
naast elkaar. Dat is een veld in de CMS-editor, geen code.

**3. De volledige productbeschrijving staat in de kaart.** Gemeten per kaart:**

| Kaart | Tekens |
|---|---:|
| Rebottled Tumbler | 713 |
| Bambook Classic Hardcover A4 | 604 |
| Bambook Classic Original A4 | 622 |
| Bambook Classic Original A5 | 628 |
| Onboardingspakket | **1.611** |

Bij circa 40 tekens per regel op mobiel is 713 tekens ongeveer achttien regels, dus ruim
450 px beschrijving per kaart. Dit is de grootste enkele oorzaak van de hoogte, en het is
met één CSS-regel te beperken.

## Beeld: de productelementen doen het goed, onze blokken niet

| | Aantal |
|---|---:|
| `<img>` op de pagina | 57 |
| met `srcset` | **50** |
| `/shared/thumbnail/`-URL's | 84 |
| `loading="lazy"` | 9 |

De productelementen leveren `srcset` met 400w en 800w plus een `sizes`-attribuut, en wijzen
naar `/shared/thumbnail/` in plaats van naar het onbewerkte origineel.

**Dat corrigeert een aanname.** `q4-aanvragen-plan.md` meldt "0 met `srcset`" en 167 beelden
die naar `/media/` wijzen. Dat geldt voor **onze handgeplakte blokken**, niet voor de
Shopware-productelementen. Het beeldgewicht is dus geen themaprobleem maar een probleem van
de media die wij zelf in de HTML zetten.

Wat wél blijft staan: 9 van de 57 op lazy. De productkaarten komen eager binnen.

## Fouten in het formulier

De cioform-plugin, `action="https://rootedgoods.eu/custom-form/send"`. Vier velden, alle vier
vrije tekst: Bericht (textarea, verplicht), Voor- en achternaam, E-mailadres, Telefoon.

| | Wat er staat |
|---|---|
| Titel | `Formular Titel`, de Duitse standaardwaarde van de plugin. Staat zichtbaar op de pagina |
| Naamveld | `name=" firstName"` met een **spatie vóór** firstName, en `value=" "` dus voorgevuld met een spatie |
| Telefoonveld | `value="\n"`, voorgevuld met een regeleinde |
| Hulpteksten | Vier velden met dezelfde `id="emailHelp"`. Ongeldige HTML en verkeerde koppeling voor schermlezers |
| Toestemming | **Geen vinkje en geen privacylink.** Ons eigen `contactform-voorzetje.html` draagt die wel |

**Nog niet te zien:** of de plugin ook keuzevelden kan (select, radio, checkbox, datum). De
test bevat alleen tekstvelden. Dat bepaalt of het Gemnote-formulier met chips en bandbreedtes
haalbaar is, en het is de enige openstaande vraag uit deze test. Te zien in de
formulierbeheerder van de plugin.

## Onze eigen CSS laadt hier

`rootedgoods@main/rootedgoods.min.css` en `.min.js` staan in de head van deze LP. Alles
hierboven is dus met onze eigen CSS te stylen, zonder Promidata.

Terzijde opgemerkt: de thema-head bevat ook een eigen CSS-veld, afgesloten met
`/* cioFrontendCssStyles End */`, met daarin onder meer `border-radius: 12px` op
`.card.product-box.box-minimal`. Niet aan raken zonder te weten wie dat beheert.

## De belangrijkste vondst: onze JS draait vóór die van het thema

Gemeten in de head van `/test`:

| Script | Positie in de HTML | Attribuut |
|---|---:|---|
| `rootedgoods.min.js` | byte 6.403 | `defer` |
| thema `all.js` | byte 11.268 | `defer` |

**Scripts met `defer` draaien in documentvolgorde.** Onze JS draait dus gegarandeerd vóór die
van het thema, en kan de DOM aanpassen voordat het thema zijn widgets initialiseert.

Concreet voor de productslider: die start op het attribuut `data-product-slider` (1 keer
aanwezig). Halen wij dat attribuut weg voordat het thema laadt, dan initialiseert tiny-slider
niet en blijft de serverzijdige markup staan: een gewone stapel `.product-slider-item`-divs
binnen `.product-slider-container`. Die is met kale CSS tot een raster te maken.

Dat is beter dan een draaiende slider met CSS overrulen, want tiny-slider zet inline
`width` en `transform` en herberekent bij elke resize. Niet initialiseren heeft dat
probleem niet.

**Breder:** dit geldt voor elke thema-widget die op een data-attribuut start. We kunnen
gedrag van het gesloten thema uitzetten zonder themabestanden en zonder Promidata. Tot nu toe
gingen we ervan uit dat we alleen achteraf konden bijsturen.

## Veldtypen van het formulier

Uit de formulierbeheerder van de cioform-plugin, 2 november 2026:

`text` · `multiline_text` · `file` · `select` · `select_salutation` · `select_country` · `date`

**Wel:** keuzelijsten en een datumkiezer. Daarmee werken Gemnote's "aantal stuks", "budget"
en "gewenste leverdatum" gewoon.

**Niet:** `checkbox` en `radio`. Twee gevolgen:

1. **Chips zijn niet native.** Wel na te bouwen: onze JS rendert klikbare chips die een
   verborgen `<select>` vullen. De select blijft het echte formulierveld, dus het versturen
   van de plugin verandert niet, en zonder JS houd je een gewone keuzelijst.
2. **Geen akkoordvinkje.** Dat raakt de privacyvermelding naast de verzendknop, die ons eigen
   `contactform-voorzetje.html` wel draagt en die Google Ads wil zien.

Onbekend: of `select` meerdere keuzes toestaat. Gemnote's "I'm looking for" is meervoudig.

## Nagemeten in de thema-CSS, en drie dingen die eerder fout stonden

`all.css` van het thema, 927 kB, 4.445 regels. Opgehaald 2 november 2026.

**1. De productbeschrijving is al geklemd.** Het thema zet
`.product-description { height: 54px; overflow: hidden; -webkit-line-clamp }`. Die 604 tot
1.611 tekens staan dus wél in de HTML, maar beslaan visueel 54 px.

Mijn eerdere schatting van "ruim 450 px tekst per kaart" was fout. Het weghalen scheelt 54 px
plus 30 px marge. Nog steeds de moeite, maar het was niet de hoofdoorzaak van de kaarthoogte.

**2. `productboxMinWidth: 300px` doet er niet meer toe.** Die waarde wordt gelezen door de
slider-JS. Als wij `data-product-slider` weghalen start die JS niet, en bepaalt ons eigen
raster de kolommen. **Dat veld hoeft dus niet in het CMS aangepast te worden.**

**3. Er bestaat een derde kaartweergave: `box-image`.** Het thema heeft
`.product-box.box-image .product-image-wrapper { height: 332px }` en
`.product-image.is-standard { height: 100%; object-fit: cover }`. De testpagina gebruikt
`box-standard`.

`box-image` is een weergavekeuze op het CMS-element zelf, geen CSS van ons. In Shopware
rendert die variant een kaart met minder tekst eromheen. **Als die keuze in de editor staat,
is dat mogelijk precies de inspiratietegel die we met CSS zitten na te bouwen.** Waard om op
de testpagina om te zetten en te vergelijken.

Verder nuttig om te weten voor onze CSS:

| Selector in het thema | Wat erop staat |
|---|---|
| `.product-slider-container` | alleen `padding-bottom: 1px`, **geen display** |
| `.base-slider` | `position: relative; overflow: hidden` |
| `.product-image-wrapper` | vaste `height: 200px`, `flex-basis: 180px` |
| `.product-action` | `margin-top: 20px` |

Geen display-regel op de container betekent dat ons raster geen `!important` nodig heeft. De
vaste beeldhoogte van 200 px moeten we wel overschrijven: in een kolom van circa 165 px breed
is dat een brievenbus.

## Volgorde van de stylesheets

| | Positie |
|---|---:|
| `promifonto.css` | 4.203 |
| thema `all.css` | 4.413 |
| **`rootedgoods.min.css`** | **6.889** |
| fontawesome `all.min.css` | 187.370 |

Onze CSS staat ná die van het thema, dus bij gelijke specificiteit winnen wij. Dat was niet
vanzelfsprekend en het scheelt een hoop `!important`.
