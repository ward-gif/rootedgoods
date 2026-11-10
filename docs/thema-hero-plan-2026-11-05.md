# Thema-hero met bewegende productband, 5 november 2026

Opdracht van Ward, na twee ronden die niet werkten: de hero mag niet letterlijk de
homepage-hero zijn, de kicker eruit, tekst en logo's links, geen omlijning om de
tegels maar een lichte schaduw, acht producten in plaats van vier, en een bewegende
band zoals de referenties. Plus de vraag of de site full width moet.

**Dit document is de inschatting en het plan. Er is nog niets gebouwd.** Het is
geschreven om door een ander model uitgewerkt te worden; alles wat nodig is om te
beginnen staat erin, inclusief de gemeten feiten en de valkuilen.

## De referenties, en wat ze precies doen

| Ref | Wat het doet |
|---|---|
| `Rooted Website Pin (1).jpg` (Hypesonic) | Gecentreerde tekst, daaronder een rij staande kaarten die **aan beide kanten** van het scherm afloopt. Daaronder een logorij. |
| `CleanShot 2026-11-05 at 10.45.13.mp4` (Switchblade) | Kleine witte producttegels met een minilabel, geplaatst op een **dalende en weer stijgende boog**, die horizontaal langsschuiven. De kaart in het midden is gemarkeerd en het model in het midden draagt dat product. |
| `Magnet Startup Job Finder.jpg` | Donkere hero, alleen typografie, daaronder gestaffelde hoge kaarten die onderaan het scherm uitlopen. |
| `Framer Landing Pages voor Startups.jpg` | Gecentreerde serif-kop, daaronder een rij kaarten van wisselende hoogte die zijwaarts uitloopt. |

**Wat alle vier delen:** geen beeld in de hero, en een kaartenband direct eronder die
van het scherm afloopt. Dat laatste is wat naar beneden trekt.

## Wat we niet kunnen, en dat is belangrijk

**Het model in het midden van Switchblade kan niet.** Dat werkt omdat er van elk
product een foto bestaat waarop iemand het draagt. Wij hebben alleen packshots. Dat
deel van de referentie valt af; de bewegende boog zelf niet.

**Gemeten materiaal, 5 november, alle elf kerstpakketten:**

| | Aantal |
|---|---|
| Beeldverhoudingen | lopen van **1.00 tot 1.90** (vijf vierkant, zes liggend in drie maten) |
| Uitgeknipte PNG met transparante achtergrond | **5 van de 11** |
| Op dekwit | 6 van de 11 |
| Varianten op dezelfde borrelplank | **4 van de 11** |

Dat is de reden dat het automatische raster "schots en scheef" werd. Voor een band
van acht moeten we dus kiezen én bijsnijden tot één verhouding, anders komt hetzelfde
probleem terug. De vijf vierkante zijn: Bak pakket, Borrelplank (plus drie varianten),
Ontspan pakket, Offline pakket, Koffiebeker/lunchbox/Bambook.

**Met acht tegels komen er dus minstens drie liggende bij.** Oplossing: alle tegels
krijgen één vaste verhouding en het beeld staat erin met `object-fit: contain` en
lucht eromheen. Dan valt het verschil weg. Dat is niet ideaal maar het is eerlijk met
dit materiaal.

## Welke animatie: de rechte band of de boog?

| | Rechte band (Hypesonic) | Boog (Switchblade) |
|---|---|---|
| Werkt op 390px | ja, wordt een scroll-snap rij | nee, een boog van kaarten is daar onleesbaar |
| Complexiteit | transform op één rij, ~40 regels | absolute plaatsing per kaart, herberekenen bij resize |
| Breekt bij | weinig | andere viewport, zoom, lange labels |
| Onderscheidend | matig, dit is een bekend patroon | sterk |

**Advies: de rechte band als basis, met een ondiepe verticale versprong per kaart.**
Dus geen echte boog met herberekening, maar vaste offsets per positie (bijvoorbeeld
0, −18, 8, −26 px, herhalend). Dat geeft het grootste deel van het Switchblade-karakter
zonder de breekbaarheid, en het werkt op elke breedte. Lukt dat goed, dan is de echte
boog een latere stap.

**Dit is een afweging, geen zekerheid.** Als Ward de boog echt wil, is die te bouwen,
maar dan alleen vanaf 992px en met een rechte rij eronder voor mobiel. Dat is twee
varianten onderhouden.

## Full width: ja, maar niet overal

**Technisch is het makkelijker dan gedacht.** Gemeten op de testpagina:

- er is **geen enkel `.boxed`-element** op deze pagina, dus de `max-width: 1400px`
  uit de thema-CSS speelt hier niet mee;
- de zijruimte komt van een **inline `padding: 20px 20px 20px 20px`** op
  `.cms-block-container`, en die wordt per blok in de Shopware-editor gezet.

Ward kan die padding dus zelf op 0 zetten, per blok, zonder een regel code. Er bestaat
al een CSS-route als achtervang: onze eigen CSS overschrijft `[style]` met
`!important` op meerdere plaatsen (sectie 16 en 51).

**Is het een goed idee?** Selectief wel. Laat de **banden** (productband,
categorietegels) van rand tot rand lopen, want daar komt het effect van de
referenties vandaan. Houd **lopende tekst** op een leesmaat; een alinea over de volle
breedte van 1800px leest niet.

**De caveat die erbij hoort:** 89,6% van het verkeer is mobiel (gemeten 29 oktober
t/m 2 november). Full width verandert daar niets. Dit is een verbetering voor
ongeveer één op de tien bezoekers. De moeite waard voor de merkindruk, maar het hoort
niet vóór dingen die iedereen raakt.

## De scrollverwijzing: wat is handig

Ward vroeg wat verstandig is, een hint of een pijl.

**Niet een los stuiterend pijltje.** Dat is precies het generieke element waar hij
vanaf wil, en het zegt niets.

Drie dingen die samen beter werken, op volgorde van opbrengst:

1. **De beweging zelf is de hint.** Een band die schuift trekt het oog en zegt
   "hier is meer". Dat is gratis en het is wat Hypesonic doet.
2. **Laat de volgende sectie net boven de vouw uitkomen.** Een half zichtbare rij of
   kop is de sterkste uitnodiging die er is, en kost geen pixel extra.
3. **Een benoemde link onder de band**, bijvoorbeeld "Alle 11 pakketten" met een
   pijl naar beneden die naar de sectie eronder scrollt. Een link met een woord erbij
   is bruikbaar; een kaal pijltje niet.

## Wat er precies gebouwd moet worden

### Hero
- Kicker **weg**.
- Tekst, feiten, deadline, knoppen en klantlogo's **links uitgelijnd** blijven.
- Geen beeld in de tekstkolom.
- Titel groot, links; de regel eronder op een leesmaat van ongeveer 46 tekens.

### De band
- **Acht pakketten**, één vaste tegelverhouding, beeld `contain` met lucht.
- **Geen omlijning**, wel een lichte schaduw (`--rg-sh-soft` bestaat al).
- Per tegel: productnaam klein in cognac, prijs eronder. Zoals nu.
- **Loopt aan beide kanten van het scherm af.**
- **Schuift continu**, pauzeert bij hover en bij focus.
- Ondiepe verticale versprong per positie.

### Harde eisen
- `prefers-reduced-motion: reduce` zet de beweging **uit**, geen uitzondering.
- Pauzeren bij hover geldt alleen op apparaten met een muis; op mobiel bestaat hover
  niet en daar moet de band gewoon doorlopen of met de vinger te schuiven zijn.
- Alleen `transform` animeren, nooit `left` of `margin`. De pagina heeft al een INP
  van rond de 500 ms op mobiel; een animatie die layout forceert maakt dat erger.
- De band moet werken zonder JavaScript-bibliotheek. Er is **geen GSAP en geen Lenis**
  op de site (gemeten), en die er nu bij halen is ongewenst gewicht.
- Scoped op een eigen class, zodat de homepage niets merkt. Dat is twee keer eerder
  misgegaan met `:is(.home-productslider, .cms-listing-row)`-regels die met
  `!important` meeliftten op pagina's waar ze niet hoorden.

## Valkuilen uit de vorige twee rondes

1. **Sectie 16 van onze eigen CSS vecht terug.** Die zet met `!important` een reeks
   eigenschappen op `:is(.home-productslider, .cms-listing-row) …`. Die selector matcht
   op elke pagina met een productslider. Gelijke specificiteit, dus de laatste regel in
   het bestand wint. Zet nieuwe secties achteraan en verplaats ze niet.
2. **De `.min`-bestanden op jsDelivr lopen achter.** `bin/publiceer.sh` meldde
   "de edge is vers" terwijl `rootedgoods.min.css` nog de oude inhoud gaf, met
   `age: 0`. Controleer altijd zelf op inhoud, niet op de header. Zie regel 1 en 2 van
   CLAUDE.md.
3. **Het blok en de CSS moeten samen.** Een nieuwe wrapper in de HTML zonder de
   bijbehorende CSS gepubliceerd levert een hero op die door elkaar staat, want
   `copy-bottom` wordt op mobiel `display:contents` en dan bepaalt `order` alles.

## Besluiten, genomen 5 november

| | Besluit |
|---|---|
| 1 | **De rechte band met verticale versprong.** Niet de echte boog; die zou twee varianten betekenen. |
| 2 | **De producten komen uit de Shopware-productslider**, niet uit handgeschreven HTML. Zie hieronder waarom. |
| 3 | **Full width aan**: de blok-padding gaat in de CMS-editor op 0 voor de band. |
| 4 | **27 november blijft staan** als besteldeadline, voorlopig, op basis van vijftien werkdagen. Die termijn is nog steeds niet gemeten; staat als voorbehoud in het blok. |

### Waarom uit de slider en niet custom

Gemeten op 5 november: de slider toont **9 van de 11** pakketten, in een volgorde die
niet alfabetisch is en niet op prijs. Dat is dus al een **handmatige selectie in de
CMS**. Ward kiest daar nu al welke producten er staan en in welke volgorde.

Daarmee valt het belangrijkste argument voor custom weg. Wat de slider extra biedt:

- **Prijzen en links blijven kloppen.** Een hardgecodeerde "€ 25 per persoon" in de
  hero die niet meer overeenkomt met de productpagina is een vertrouwensprobleem en
  bij prijsvermelding ook een juridisch risico. Het assortiment en de prijzen van deze
  elf pakketten worden per seizoen gezet.
- **Geen onderhoud per seizoen.** Volgend jaar andere pakketten betekent een andere
  selectie in de editor, geen nieuwe HTML.
- **Het mechanisme is bewezen.** Onze JS staat in de thema-head op byte 6.403 en die
  van het thema op 11.268, allebei met `defer`, dus wij draaien eerst en kunnen
  `data-product-slider` weghalen voordat tiny-slider zich eraan vastklampt. Dat is
  vandaag op de testpagina werkend gemeten.

Wat we inleveren: een eigen bijschrift per tegel. De markup geeft productnaam en
prijs, en dat is precies wat de tegels nodig hebben, dus dat weegt niet op.

### Eén ding dat Ward in de editor moet rechtzetten

De twee pakketten die **niet** in de slider staan zijn **Bak pakket (€ 25)** en
**Offline pakket (€ 70)**. Dat zijn precies de twee uiteinden van de prijsbelofte in
de hero. Zoals het nu staat zegt de hero "€ 25 tot € 70 per persoon" terwijl de
tegels van **€ 31 tot € 69** lopen.

**Zet die twee in de selectie.** Dan klopt de belofte met wat je ziet, en heb je
meteen twee onderwerpen erbij die geen borrelplank zijn.

Voorstel voor acht, met de vier borrelplank-varianten teruggebracht tot één en de
onderwerpen afgewisseld:

| | Pakket | Prijs |
|---|---|---|
| 1 | Bak pakket | € 25 |
| 2 | Fles, Tony's & Bambook | € 31 |
| 3 | Borrelplank | € 32 |
| 4 | Koffiebeker, lunchbox en Bambook | € 34 |
| 5 | Gezellig & warm | € 47 |
| 6 | Ontspan pakket | € 67 |
| 7 | Paraplu, Lunchpot en Fles | € 69 |
| 8 | Offline pakket | € 70 |

Acht verschillende onderwerpen, oplopend in prijs, en de volle bandbreedte gedekt.

## Over "hoe wijken we af van wat een AI standaard maakt"

Eerlijk antwoord op Wards vraag of er skills of refs bij moeten.

**Meer sfeerreferenties helpen weinig.** Er liggen er nu vier en ze zeggen alle vier
hetzelfde. Wat vandaag wél het verschil maakte, is dat Ward naar een **concreet
mechanisme** wees (de schuivende boog) in plaats van naar een gevoel. Dat soort
referentie is bruikbaar, want er valt uit af te leiden wat er gebouwd moet worden.

**Wat zwaarder weegt dan nog een ref:**

1. **De vijf ontwerpbesluiten in `docs/DESIGN-AUDIT.md` fase 3**, die sinds
   10 augustus op akkoord wachten. Besluit 2 (typografisch contrast), 3 (ongelijke
   kolommen, stop met centreren) en 4 (doorbreek de card-soup) zijn precies wat er in
   beide mislukte ronden misging. Zolang die niet vastliggen, worden het microkeuzes
   zonder richting.
2. **Beeld.** Er is geen enkele sfeerfoto van de kerstpakketten. Alles is packshot.
   Zolang dat zo is, blijft elke band een rij witte vlakken met een product erin.
   Dat is de harde bovengrens van hoe goed dit kan worden.
3. **Zicht op desktop.** Het browservenster dat ik aanstuur zit vast op 520 px en de
   site weigert een iframe (`x-frame-options: deny`). Daardoor is desktop twee ronden
   lang blind ontworpen en ontdekte Ward de fouten. Dat is de goedkoopste van de drie
   om op te lossen.
