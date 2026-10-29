# Openstaande vragen en verzoeken aan Promidata

> Verzamellijst, bedoeld om in één mail te versturen in plaats van druppelsgewijs.
> Elke wijziging kost geld, dus alles hier draagt zijn reden en zijn gemeten effect.
> Aangemaakt 28 oktober 2026. Status: **nog niet verstuurd.**

## Hoe we dit aanpakken

CSS en JavaScript laden we extern via jsDelivr (`rootedgoods.css` en
`rootedgoods.js` uit de GitHub-repo), dus die staan niet in Shopware en kunnen we zelf
aanpassen. Alles hieronder zit wél in Shopware of op de server, en kan dus alleen via
Promidata.

Afweging per punt: wat kost het, wat levert het, en moet het permanent zijn.

---

## A. Server en uitlevering

### A1. Brotli-compressie aanzetten

**Wat:** op de webserver staat alleen gzip. Ook als een browser om brotli vraagt, komt
er gzip terug. Gemeten op `all.css` en `all.js` met `Accept-Encoding: br,gzip`.

**Wat het oplevert:** brotli scheelt doorgaans 15 tot 20% op tekstbestanden. Over de
lijn gaat nu per eerste bezoek 190,6 kB CSS en 182,4 kB JS, dus grofweg 55 tot 75 kB
minder per bezoeker. Geen code-wijziging, alleen een serverinstelling (`mod_brotli`).

**Waarom het telt:** 85% van ons advertentieverkeer komt op mobiel binnen.

**Prioriteit:** hoog. Dit is de goedkoopste snelheidswinst die er is.

### A2. Eventueel: onze CSS permanent in het thema

**Wat:** `rootedgoods.min.css` is 32,7 kB over de lijn (brotli) en blokkeert het
renderen, op een externe oorsprong. Als die in het thema zou zitten, scheelt dat één
verbinding.

**Eerlijke afweging:** de winst is beperkt. Er staat al een `preconnect` naar
jsDelivr, en jsDelivr is met 118 ms sneller dan onze eigen server (283 ms). Het
thema-CSS is bovendien 190,6 kB, oftewel 82% van het blokkerende gewicht; onze eigen
CSS is 14%.

**Wat ooit zin kan hebben:** alleen het stabiele deel permanent laten zetten, namelijk
de kleur- en typografietokens en de basisstijlen.

**Voorlopig niet doen.** De basisstijlen gaan nog getweakt worden, dus juist die moeten
we zelf kunnen aanpassen zonder er per keer voor te betalen. Pas heroverwegen als de
restyling klaar is en de stijlen een tijd stil liggen.

**Prioriteit:** geparkeerd.

---

## B. De productkaart en de catalogus

### B1. Galerijslides uit de productkaart halen

**Wat:** elke productkaart in een overzicht laadt zijn hele fotogalerij als slides,
terwijl alleen de eerste zichtbaar is. Op de catalogus staan 24 kaarten met tot 35
afbeeldingen per kaart, en 150 afbeeldingen met `loading="eager"` in de HTML.

**Wat het oplevert:** in oktober was dat 4.655 kB van de 5.259 kB aan kaartbeeld,
oftewel 89%. De catalogus heeft nu een LCP van 7,89 seconden bij echte bezoekers.

**Vraag:** is er een thema-instelling voor, of moet het een template-aanpassing worden?
Kan alleen de eerste slide `eager` en de rest `lazy`, of kan de galerij in de kaart
helemaal uit?

**Waarom wij het niet zelf kunnen:** de browser zet die afbeeldingen in de wachtrij
voordat ons JavaScript kan draaien.

**Prioriteit:** hoog.

### B2. Minimale afname zichtbaar op de productkaart

**Wat:** de tegel toont alleen de productnaam, een vanaf-prijs en een knop "Details".
De minimale afname staat niet in de HTML van de tegel, dus wij kunnen hem er niet met
JavaScript bij zetten.

**Vraag:** kan de minimale afname (of de eerste staffeldrempel) als veld beschikbaar
komen in de productkaart?

**Prioriteit:** middel. Hangt samen met B3.

### B3. Eén regel naast de prijstabel over kleinere aantallen

**Wat:** op ruim de helft van de productpagina's begint de prijstabel pas bij 12 tot
2000 stuks, meestal 50. Onze advertenties zeggen "geen minimale afname". Dat spreekt
elkaar tegen.

**Vraag:** kan er één vaste regel naast of onder de prijstabel, in de trant van
"kleinere aantallen bespreekbaar"? Liever één keer in het template dan dertig
productomschrijvingen herschrijven.

**Prioriteit:** middel.

---

## C. SEO en indexering

### C1. Koppen op de categoriepagina's

**Wat:** 78 van de 98 contentpagina's missen een `<h1>` en 68 missen een
meta-omschrijving. Dat is vrijwel de hele categoriestructuur, inclusief
`/alle-producten/` en `/thema-s/kerstpakketten-eindejaar/`.

**Vraag:** zit de h1 in een template of is hij per categorie in te stellen? En kunnen
wij de meta-omschrijvingen zelf per categorie invullen?

**Prioriteit:** middel. Organisch levert nu 103 vertoningen in 29 dagen op, dus dit is
een investering voor volgend jaar, geen Q4-fix.

### C2. Variant-URL's canonicaliseren

**Wat:** de sitemap bevat 1.201 product-URL's voor 636 unieke producten. 565 daarvan
zijn kleur- en maatvarianten met vrijwel dezelfde tekst. Pulltap's kelnersmes heeft er
ongeveer 45.

**Vraag:** kunnen variant-URL's een canonical naar het hoofdproduct krijgen?

**Prioriteit:** laag voor dit kwartaal, maar het verdunt de autoriteit structureel.

### C3. Eigen pagina's in de sitemap

**Wat:** van onze elf eigen pagina's staat alleen de homepage in de sitemap. Niet
`/offerte`, niet `/eindejaarsgeschenken`, niet `/over-ons`.

**Vraag:** kunnen de CMS-landingspagina's automatisch mee in de XML-sitemap?

**Prioriteit:** laag voor dit kwartaal.

---

## D. Webp

### D1. Kan Shopware 6.5 zelf webp genereren?

**Wat:** geen enkele afbeelding op de site is webp of avif. De 59 gemeten PNG's wegen
samen 9,02 MB en zouden als webp rond de 0,86 MB wegen (eigen hercodering op kwaliteit
82, dus een schatting).

**Vraag, in deze volgorde:**
1. Kan de thumbnail-service van 6.5 dit al, via een instelling in de backend of in
   `shopware.yaml`? De changelog van 6.4.8 noemt webp-ondersteuning in de
   ThumbnailService.
2. Zo niet, welke plugin raden jullie aan, en wat kost installatie plus licentie?

**Waarom in die volgorde:** als het al kan, besparen we de installatiekosten.

**Prioriteit:** pas na B1. Die is gratis en groter.

---

## E. Kleine dingen

### E1. JavaScript-fout op de catalogus

Op `/alle-producten/` treden twee fouten op: `json parse error: unexpected eof` en
`unexpected token '<', <!doctype ... is not valid json`. Een AJAX-aanroep krijgt HTML
terug waar JSON verwacht wordt. Lage frequentie (2 sessies in oktober), maar het is een
echte fout.

### E2. Layoutverschuiving op de desktopcatalogus

`/alle-producten/` heeft op desktop een CLS van 0,343, ruim boven de slechte-drempel.
Het meest aangeklikte element daar is een lege `DIV.cms-section-sidebar-sidebar-content`
met 9 klikken op iets dat geen link is. Vermoedelijk schuift de categorielijst na het
laden weg onder de cursor.

### E3. Redirect op de kerstpagina

`/thema-s/kerstpakketten/` geeft een 301 naar `/thema-s/kerstpakketten-eindejaar/`. Een
knop op onze landingspagina wijst naar de eerste. Kan die rechtstreeks?

### E4. "Weigeren" en "Configureren" op de cookiebalk doen niets

**Gemeten op 28 oktober met Playwright, mobiel en desktop, op de live homepage.**
Klikken op "Aanvaard alle cookies" werkt: de balk verdwijnt en `cookie-preference`,
`dtgsAllowGtmTracking`, `google-ads-enabled` en `wishlist-enabled` worden gezet.
Klikken op "Weigeren" doet niets: de balk blijft staan en er wordt geen
`cookie-preference` gezet. Klikken op "Configureren" opent geen modal.

Wat we al uitsloten: de knoppen bestaan in de DOM, er ligt niets overheen
(`elementFromPoint` geeft de knop zelf), ze staan in beeld, er zijn geen
JavaScript-fouten, en zowel `CookiePermission` als `CookieConfiguration` is in de
PluginManager geregistreerd met één actieve instantie. Het ligt niet aan onze eigen
CSS: het gedrag is identiek met en zonder `rootedgoods.css`.

**Waarom dit urgent is:** zolang weigeren niet werkt, kan een bezoeker alleen
accepteren of de balk negeren. Dat is precies de situatie die de AVG niet toestaat,
en het is ook de reden dat de balk voor een deel van de bezoekers blijft staan.

**Prioriteit:** hoog. Dit is core-gedrag van Shopware, niet iets wat wij stuk kunnen
maken met CSS.

---

### A3. Een versienummer in de CSS- en JS-URL in het thema

**Dit is de reden dat een wijziging soms dagen duurt voordat iedereen hem ziet.**
De bestanden komen binnen met `Cache-Control: public, max-age=604800, s-maxage=43200`.
Die `s-maxage` van twaalf uur geldt voor de jsDelivr-edge, en die kunnen we purgen.
Maar `max-age=604800` is **zeven dagen in de browser van de bezoeker**, en die
controleert in die week niet eens of er iets nieuws is. Een purge helpt daar niets
tegen. Alleen een harde ververs of een incognitovenster forceert een nieuwe ophaling.

Dat verklaart waarom een wijziging bij de een meteen zichtbaar is en bij de ander
niet. Het raakt alles wat we dit najaar aanpassen: de cookieknoppen en de
lettertypefix van 28 oktober bereiken terugkerende bezoekers pas over maximaal
een week.

**Vraag:** kan er een versie-query achter de twee URL's in het thema, dus
`rootedgoods.css?v=2` en `rootedgoods.js?v=2`, die wij bij een release ophogen?
Dan krijgt elke wijziging vanzelf een nieuwe URL die nooit uit de cache komt, en
zijn purges en harde ververs niet meer nodig.

**Prioriteit:** hoog. Dit is de enige van de lijst die alle andere wijzigingen
sneller laat landen.

### B4. Productslider, productboxMinWidth van 300 naar 400

In `data-product-slider-options` op `.base-slider.product-slider` staat
`"productboxMinWidth": "300"`. Op een scherm van 1900 px passen er dan ongeveer
zes tegels, te veel, en er is geen ruimte voor een peek aan de rand. Met 400 passen
er vier tot vijf met een natuurlijke peek.

Het alternatief is de tegelbreedte via onze eigen CSS overschrijven, en dat botst
met de interne transform-berekening van TinySlider: gekloonde tegels werden links
zichtbaar.

Raakt alleen de productslider op de homepage, niet de catalogus of de
zoekresultaten.

**Prioriteit:** laag. Staat al sinds april open.

---

### E6. `add_to_cart` stuurt een hoeveelheid en een waarde van nul

**Gemeten op 29 oktober**, met een Tag Assistant-sessie over de hele
bestelroute. Export staat in
`docs/metingen/tagassistant/2026-10-29-bestelroute/`.

Bij het toevoegen aan de winkelwagen komt dit binnen:

```
add_to_cart   quantity: 0   value: 0   price: 26.53
```

Eén stap later klopt het wel:

```
view_cart     quantity: 100  price: 24.32   (de staffelprijs)
begin_checkout  value: 2431.50
```

De prijs per stuk staat er dus wel in, maar het aantal en de totaalwaarde zijn
nul. Bij een winkel die op staffels werkt is dat geen detail: het aantal bepaalt
de prijs.

**Waarom het nu uitmaakt:** we gaan de e-commercegebeurtenissen aan GA4 koppelen.
Zetten we `add_to_cart` aan zoals hij nu is, dan meldt GA4 elke toevoeging als
nul euro, en dan is de trechter onbruikbaar. De andere gebeurtenissen kunnen wel
meteen aan.

**Vraag:** kan `add_to_cart` het werkelijke aantal en de bijbehorende
staffelprijs meesturen, net als `view_cart` dat al doet?

**Prioriteit:** hoog, maar pas nodig als de e-commercetags live gaan.

---

## Nog uit te zoeken voordat we het vraagt

- **Betalen op rekening** (punt 21 uit het verbeterplan): eerst zelf in de backend
  kijken welke betaalmethoden er per klantgroep beschikbaar zijn. Pas vragen als het
  echt niet kan.
