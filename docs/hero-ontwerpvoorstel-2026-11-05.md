# Kersthero, ontwerpvoorstel na Wards mobiele ronde, 5 november 2026

Voorstel, geen bouw, op één klein ding na (zie "Wat al gebouwd is"). Alle getallen zijn
gemeten in de replica van de testpagina (repo-CSS en -JS, blok uit `blokken-def/`),
ruwe uitvoer in `docs/metingen/2026-11-05-hero-desktop-mobiel/ontwerp/`. Waar ik iets
bereken in plaats van meet, staat het erbij.

## Uitgangspunt: wat er nu staat (ronde 2)

| | 390 × 844 | 1280 × 800 | 1931 × 1112 |
|---|---|---|---|
| hero | 102 tot 482 | 140 tot 591 | 161 tot 658 |
| band begint | **482** | 591 | 658 |
| onderkant tegels (laagste / hoogst versprongen) | 726 | 826 / 933 | 966 / 1000 |
| prijsregel boven de vouw | ja | **nee** (26 tot 133 px eronder) | ja |

Tegelhoogte is op desktop 300 px (breedte 232 + 68 px naam, prijs en padding), op
mobiel 236 px (168 + 68). De versprong voegt op desktop 0 tot 34 px toe. Dat zijn de
constanten waarmee hieronder gerekend is.

## De vijf vragen

### 1. De kerstnoot: kort, één regel. Gebouwd.

Drie regels van 0,85 rem onder een knop leest niemand; Ward noemt het terecht een
blinde vlek. Weg is ook een optie, maar dan staat er in de eerste schermvulling niets
meer over het seizoen behalve het woord "Kerstpakketten", en de vraag "haal ik het
nog" is in november de echte aarzeling. Dus één regel, met de vraag en de daad:

> Nog op tijd voor kerst? Vraag het vandaag.

42 tekens, gemeten één regel op 390 px (en op 375 en 360). De zoekwerk-regel ("jij
zegt voor wie en hoeveel, wij doen het zoekwerk") is eruit; die hoort bij het
formulier op `/offerte` of bij het uitnodigingsblok, niet onder een knop. Winst op
390 px: 41 px (noot van 61 naar 20).

### 2. De feitenregel: uit de hero, als strook onder de band

Ward heeft gelijk dat de zin saai is en in de tekstblob verdwijnt, en de oorzaak is
niet de vormgeving maar de slag om de arm: "zoals hieronder" staat erin omdat
`claims.md` geen bedrijfsbrede vanaf-prijs toestaat, en dat voorbehoud maakt van een
feit een bijzin. **Onder de band is de positie het voorbehoud.** Een regel direct onder
negen tegels met prijzen gaat vanzelf over die tegels; het woord "zoals hieronder" kan
dan weg en de regel wordt wat hij moest zijn:

> **€ 25 tot € 70** per persoon · **vanaf 10** stuks

Links op mobiel op de tekstlijn van de band, boven de link "Alle kerstpakketten";
gecentreerd op desktop, boven diezelfde link. Montserrat, de getallen in inkt 700, de
rest zachtgroen, zelfde grammaticale vorm, geen vlak, geen pill, geen lijn. Dat is
precies wat Flowblox onder de waaier doet, maar met twee feiten in plaats van drie
USP's, want een rij van drie vinkjes-met-voordeel staat in `niet-meer.md` en de
trust-strip staat al in de eind-CTA van deze pagina.

Het tegenargument, en waarom het hier niet opgaat: de prijs is de eerste vraag van een
inkoper en hoort boven de vouw. Klopt, maar de prijs stáát boven de vouw, op elke
tegel ("€ 40 per persoon"), en sinds deze ronde ook op een SE: met de feitenregel eruit
en de noot op één regel eindigen de tegels op 390 px op **622** (was 726) en begint de
band op **378** (was 482). Op 375 × 667 zijn de tegels dan compleet in beeld, prijs
erbij, zonder cookiebalk. De strook zelf landt op 390 px op y = 654, op 844 hoog in
beeld, op 667 net eronder. Het bereik en de afname zijn samenvattingen; de band is het
antwoord.

Gemeten (variant C in de meetmap):

| | 390 × 844 | 375 × 667 | 1280 × 800 | 1931 × 1112 |
|---|---|---|---|---|
| band begint, nu → voorstel | 482 → **378** | 482 → **378** | 591 → **518** | 658 → **581** |
| onderkant tegels, nu → voorstel | 726 → **622** | 726 → 622 | 826/860 → 826/860 wordt 758/792 | 966/1000 → 889/923 |
| feitenstrook op | 654 | 654 (net onder de vouw) | 892 | 955 |
| link "Alle kerstpakketten" | 684 | 709 | 921 | 984 |

Op 375 breekt de strook nog in twee ("…vanaf 10 / stuks"); met harde spaties is dat
één regel, dat is een detail van de bouw.

Wat er dan nog in de hero staat: kop, knop, één regel noot, logo's. Vier elementen,
op 390 px 276 px hoog in plaats van 380.

### 3. Serif plus sans in de kop: nee, met een meting

Flowblox werkt omdat regel één een lichte display-serif is en regel twee een
geometrische sans op dezelfde maat, en omdat beide regels kort zijn. Bij ons is regel
twee "van Europese makers" in Montserrat 700: gemeten op 390 px wordt de kop dan
**vier regels** ("van Europese / makers"), 32 px hoger, want Montserrat 700 is circa
een vijfde breder dan Playfair 500. Op desktop past het wel (twee regels op 1280 en
1931), maar het is dan een kop die op negen van de tien schermen slechter staat dan
op het ene waar hij voor bedacht is.

Inhoudelijk: de site heeft al een serif-sans-contrast, Playfair voor koppen en
Montserrat voor alles daaronder. Dat contrast zit nu in de hero tussen de kop en de
knop plus noot, en na punt 2 ook tussen de kop en de feitenstrook. Twee fonts ín één
kop is het Framer-sjabloon van dit jaar (Flowblox is er letterlijk een) en trekt het
merk naar het SaaS-register dat `niet-meer.md` punt 19 noemt. Het 500/700-contrast in
Playfair dat er nu staat doet hetzelfde werk, in het eigen register. Niet doen.

### 4. De cirkelpijl in de knop: niet als eilandje, en liever niet

Technisch klein: het is de `::after` van sectie 8, nu een gemaskerde pijl in
`currentColor`; een crème cirkel van 1,7 em met een cognac pijl erin is één
achtergrondregel, geen markup. Het vraagstuk is niet de bouw maar waar: alleen op de
heroknop wordt het een los eilandje tussen elf andere pillen op de site met de kale
pijl; sitewide is het een huisstijlbesluit dat in `design/componenten.md` moet landen
en op elke pagina zichtbaar wordt zonder te plakken. De cirkel voegt geen informatie
toe en is de knopvorm van Flowblox, Framer en Google-reviews-pagina's tegelijk; het is
decoratie in het register dat we proberen te verlaten. Mijn advies: niet. Wil Ward
het toch, dan sitewide in sectie 8 en als merkbesluit, niet in sectie 55.

### 5. De landen-outlines als motief: ja, en hier beginnen

Dit is het enige van de vijf dat van hen alleen is. De hairline was een vorm zonder
betekenis; een landsilhouet is de claim zelf ("van makers die je kunt aanwijzen"). Wat
er al is: `svg/europa-contour.svg` in de repo, 114 paden, viewBox 851,6 × 538,4,
bosgroen op 16% dekking, 101 kB en **30 kB gecomprimeerd**; `svg/land-europa.svg` is
220 kB (84 kB gecomprimeerd) en te zwaar voor een achtergrond; de losse landen (Nederland
6,5 kB, Frankrijk 28 kB) zijn licht. De kaart op `/over-ons` is een Shopware-media-SVG
met pins, dat is een illustratie, geen motief.

**Voorstel voor één plek: de kersthero op desktop, rechts van de tekst.** De hero is
gecentreerd en op 1931 px staat aan weerszijden van de kolom 450 px lege crème. Daar
de Europa-contour, circa 760 px breed, bosgroen op 6 tot 7% (de SVG staat op 16%, dat
is voor een motief te aanwezig), afgesneden door de rechterrand van het scherm zoals
Gainlove Afrika afsnijdt, en zo gepositioneerd dat hij niet onder de tekst komt. Niet
gecentreerd achter de kop: dan concurreert hij met de letters. Onder 992 px niet
tonen: de kolom is daar vol en een lijntekening onder drie regels Playfair maakt het
drukker, niet eigener. Kosten: 0 px hoogte, 30 kB eenmalig, via jsDelivr met een
SHA zoals `docs/kaart-assets.md` voorschrijft. Alleen de bandpagina, achter de
marker.

Als dat zit, is de tweede plek de eind-CTA: het donkergroene paneel met de contour in
8 tot 10% wit, als textuur naast de boslicht-korrel. Dat paneel staat op vrijwel elke
pagina, dus daarmee is het motief in één CSS-regel sitewide, zonder plakken. Maar
eerst één plek, zoals gevraagd.

Wat ik niet zou doen: de stippenkaart van Gainlove en Google-reviews (halftone). Dat
is een patroon, geen land; de contour is herkenbaar als Europa, de stippen niet.

## De prijs boven de vouw op laptops, nagerekend

Wards eis: de prijs zichtbaar boven de vouw. De rekensom van de coördinator klopt in
richting maar de constante is anders: niet 342 maar 300 px tegelhoogte plus 0 tot
34 px versprong, en de prijsregel zit 14 tot 32 px boven de onderkant van de tegel.
Criterium hieronder: onderkant van de hoogste tegel op of boven de vouw.

**Terugdraaien naar ronde 1 lost het niet op**, bevestigd: band op 555 geeft tegels tot
863 (met versprong 897) op een vouw van 800.

**Wat dit voorstel (punt 1 en 2) al doet** op 1280 × 800: band van 591 naar 518, tegels
tot 826 (laagste) en 860 (hoogst versprongen). Nog 26 tot 60 px te laag. Op 1440 × 900:
band circa 523, tegels tot 831 en 865, dus daar is het met dit voorstel alleen al
opgelost. Op 1931 × 1112 ruim.

De knoppen die er echt zijn, met de opbrengst op 1280 × 800 bovenop dit voorstel:

| Knop | Wat | Opbrengst | Onderkant hoogste tegel | Kosten |
|---|---|---|---|---|
| a | Versprong uit onder 1600 px (op mobiel staat hij al uit) | 34 px | 826 | Het ritme van de versprong is op 1280 met 5,3 tegels in beeld nog zichtbaar; op 1931 blijft hij. Kleine inconsistentie tussen laptop en groot scherm. |
| b | Hero-lucht van ronde 2 op 992 tot 1599 px deels terug: padding-top 40 naar 24, padding-bottom 32 naar 24, logo's 44 naar 40 | 28 px | 798 met a | Dit is de laag waar Ward "A of B" over zou kiezen; met de feitenregel eruit is de hero daar al 73 px korter, dus deze 28 zijn minder voelbaar dan vanmiddag. |
| c | Tegelbreedte op 992 tot 1599 px van 232 naar 216 px (tegel van 300 naar 284) | 16 px | 782 met a en b | Packshot 7% kleiner; met 216 px beeldvlak blijft een borrelplank leesbaar. Geen 4:3: de beeldverhoudingen van het materiaal lopen van 1,0 tot 1,9 en het vierkant is juist gekozen om dat verschil weg te werken; een 4:3-vlak snijdt de vierkante packshots (fles, kaars) 25% kleiner en levert bovendien minder op dan a plus b. |
| d | Accepteren: pas vanaf 1440 | 0 | 860 | Op 1280 zijn de beelden zichtbaar, de prijs niet. Met de cookiebalk (66 px, vouw effectief 734) is de prijs op 1280 bij een eerste bezoek sowieso niet in beeld, ook niet met a, b en c. |

**Mijn voorstel: a plus b plus c, alleen in de laag voor 992 tot 1599 px.** Berekend
komt de hoogste tegel dan op 782 bij een vouw van 800, met de prijsregel vanaf circa
750. Dat is berekend uit gemeten constanten, niet gemeten; na de bouw meet ik het na.
Vanaf 1600 px verandert er niets. Op 390 px verandert er niets door a, b en c; daar
doet punt 2 het werk: tegels tot 622 in plaats van 726.

Wat ik Ward erbij wil zeggen: boven de vouw is op een laptop van 1280 × 800 een smal
venster, 800 px min 141 header min 66 cookiebalk bij het eerste bezoek. Een hero van
vier elementen plus een rij tegels met prijs past daar met a, b en c net in, en elke
latere toevoeging aan de hero duwt de prijs er weer onder.

## Twee dingen die ik zag en die niet op zijn lijst staan

- In Wards schermafdruk van zijn telefoon hangt rechts een donkere tooltip "Gezelli…"
  over de logo's. De tegellinks dragen `title="Gezellig &amp; warm"` (drie keer per
  tegel in de Shopware-markup); een browser toont dat bij hover of lange druk, en
  omdat de band onder de muis of vinger doorschuift, kan het op elk moment verschijnen.
  De band-JS kan die `title`-attributen weghalen voordat hij kloont; de naam staat al
  zichtbaar op de tegel. Klein, en ik ben er zeker van, maar ik heb het nog niet gedaan
  omdat het JS is en niet in de vraag zat.
- Op 375 × 667 landt de feitenstrook met dit voorstel op 654, net onder de vouw. Dat is
  prima zolang de tegels zelf de prijs tonen; mocht Ward de strook per se boven de vouw
  willen, dan is het enige dat helpt de logo's uit de hero, en dat is besloten.

## Wat al gebouwd is

Alleen punt 1: de noot in het blok is één regel ("Nog op tijd voor kerst? Vraag het
vandaag."), `plakklaar/` opnieuw gegenereerd, `node --check` ok, brace-diepte 0, CSS
ongewijzigd. Niet gepubliceerd, niet geplakt.

Nog niet gebouwd, wacht op Ward: punt 2 (feitenstrook onder de band), punt 5 (contour
in de desktophero), de laptoplaag a, b, c, en de `title`-opschoning.

## Volgorde als Ward akkoord is

1. Punt 2 en de laptoplaag a, b, c in één keer, want ze delen de meting van de vouw.
2. Nameten op 390, 375, 1280, 1440, 1931, zelfde tabel.
3. Punt 5 apart, met een schermafdruk op 1931 om de dekking te kiezen (6, 7 of 8%).
4. `title`-opschoning in de JS tegelijk met 1.

## Beperkingen

- Alles is replica; geen echt toestel, geen Safari-balk. De vouw van 667 voor de SE
  en "circa 660" voor Safari op grotere iPhones zijn aannames uit toestelmaten.
- De opbrengsten van a, b en c zijn berekend uit gemeten constanten (tegelhoogte 300,
  versprong 34, paddings), niet gemeten; de band-variant met kleinere tegels is niet
  gerenderd.
- De contour is niet in de pagina gerenderd; dekking en positie zijn een voorstel,
  geen meting.
