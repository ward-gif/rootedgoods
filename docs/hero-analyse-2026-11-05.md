# De kersthero, kritisch bekeken, 5 november 2026

Onafhankelijke analyse van de hero op https://rootedgoods.eu/Test-page-concepts12, na
Wards oordeel: "Slider is op zich goed. De rest is vrij matig. Focus op de teksten. Ik
denk dat we sowieso gecentreerd moeten en dat dingen weg moeten of qua hiërarchie
slimmer." Dit document toetst dat oordeel, ook het stuk over centreren, en levert
nieuwe copy. Geen code, geen wijzigingen aan bestaande bestanden.

## 0. Wat ik heb gezien, en wat niet

Dit bepaalt hoeveel het onderstaande waard is, dus eerst.

**De testpagina laadt de band niet.** Gemeten op 5 november om 11.40 uur, in de browser
die ik aanstuur, na één herlaad: de pagina laadt `rootedgoods.min.css@main` van
jsDelivr, en in die stylesheet komt `.rg-page-hero--band` nul keer voor. `<html>` draagt
geen `rg-band-pagina`, de slider is nog de gewone tiny-slider (`.tns-slider` aanwezig,
9 tegels), de kop "Inspiratie" en de knop "Bekijk alle producten" staan er nog, het
feitenblok heeft bullets, de deadline is zwart en Richard staat met perzikkleurige tekst
over de klantlogo's heen. Dat klopt met de repo: `git diff --stat` toont 612 regels
CSS en 263 regels JS die nog niet gecommit zijn, en `git show HEAD:rootedgoods.css`
bevat sectie 53 niet.

Tegelijk draait de lokale CSS-server op poort 8000. Ward heeft dus zeer waarschijnlijk
via Resource Override de échte versie gezien, en ik de kale. Ik kan niet vaststellen
welke van de twee hij beoordeelde toen hij "vrij matig" zei. Als het de kale was, dan
ging een deel van zijn oordeel over een pagina zonder haar CSS, en is "de slider is goed"
een oordeel over de Shopware-slider en niet over de band. Vraag dat na voordat er
opnieuw gebouwd wordt.

**Alleen smal gezien.** Het venster zit vast op 520 px breed en de site weigert een
iframe. De desktoplay-out (twee tekstkolommen vanaf 992 px) heb ik uit de CSS gelezen,
niet gezien. Niemand heeft hem gezien; dat staat ook in het plan van 5 november en in
`docs/metingen/2026-11-05-band-test/notities.md`. Alles wat ik over desktop zeg is
afgeleid.

**Wat ik wel heb.** Het blok (`blokken-def/thema-eindejaarsgeschenken-band.html`),
CSS-sectie 53 en de band-JS, de meetnotities van 4 en 5 november, de vijf referenties
(frames uit beide video's met ffmpeg, de drie jpg's en de extra CleanShot-png van
Listed Wines), de merkskill, `docs/kerstpagina-herzien.md`, het heroplan van 5 november
en `docs/DESIGN-AUDIT.md`.

## 1. Wat er nu staat

In leesvolgorde, met de letterlijke woorden. Posities gemeten op 520 px breed, maar
dan wél uit de band-test van 5 november (met sectie 53 geïnjecteerd), want dat is de
bedoelde weergave.

| # | Element | Woorden | Hoogte op 520 px |
|---|---|---|---|
| 1 | H1 | Kerstpakketten & eindejaar | 85 px |
| 2 | Subregel | Bedank medewerkers, klanten en relaties met een geschenk dat oprecht en doordacht voelt. | 2 regels |
| 3 | Feitenblok | **€ 25 tot € 70** per persoon · **Vanaf 10** stuks · Met **jouw logo** erop | 3 regels, 0,88 rem |
| 4 | Deadline | Bestel vóór 27 november, dan ligt het er de week voor kerst. | 1 regel, 0,88 rem, cognac |
| 5 | Knop 1 | Vraag een offerte aan | pil |
| 6 | Knop 2 | Bekijk alle kerstpakketten | tekstlink met pijl |
| 7 | Richard | Hi, ik ben Richard / Vertel wat je zoekt, ik denk mee | 44 px avatar |
| 8 | Logo's | Erasmus MC, Ifes, Huisartsen G.C. Zuiderzorg, Wezijnwille | 22 px hoog |
| 9 | Band | 9 tegels uit de slider, doorlopend schuivend, naam in cognac kapitaal, prijs eronder | 306 px, begint op y=663 |
| 10 | Scrollverwijzing | Waarom deze pakketten anders zijn | tekstlink |

Hero zonder band: 505 px hoog op 520 px breed. De band begint op y=663 in een venster
van 953 px, dus er is ongeveer 290 px band zichtbaar boven de vouw. Tien elementen voor
de vouw, waarvan vijf klikbaar (twee knoppen, Richard, negen tegels, de scrollverwijzing).

Op desktop (uit de CSS): kop en subregel links in een kolom van 1,15 fr, feiten, deadline
en de twee knoppen rechts in 0,85 fr en onderaan uitgelijnd, daaronder over de volle
breedte Richard links en de logo's rechts, daaronder de band van rand tot rand.

**Wat de band toont.** Negen van de elf pakketten, in deze volgorde: Borrelplank 32,
Gezellig & warm 47, Fles/Tony's & Bambook 31, Ontspan pakket 67, Borrelplank/Wijn & Spel
58, Paraplu/Lunchpot/Fles 69, Borrelplank & Spel 48, Borrelplank & Wijn 40,
Koffiebeker/lunchbox/Bambook 34. Vier van de negen zijn een borrelplank. De twee
uiteinden van de prijsbelofte, Bak pakket (25) en Offline pakket (70), ontbreken. Het
plan van 5 november zegt dit ook al; het is nog niet rechtgezet.

## 2. Wat er mis is, en waarom

Vooraf het eerlijke deel: de inhoud is beter dan de vorige versies. De drie feiten en de
deadline staan boven de vouw, en dat was de kern van punt 13 (62% van 292 mobiele
bezoekers haakte af vóór 25% diepte, en de antwoorden stonden op 54%). Dat is binnen.
Het probleem van deze hero is niet dat er iets ontbreekt. Het is dat **het beste wat
erin staat het kleinst is gezet, en het zwakste het grootst.**

### De hiërarchie staat op zijn kop

Zet de elementen op een rij naar wat ze voor een inkoper betekenen die `kerstgeschenk
met logo` intypte:

| Element | Beantwoordt | Grootte nu |
|---|---|---|
| Feitenblok | wat kost het, vanaf hoeveel, met logo | 0,88 rem, grijs, drie bullets |
| Deadline | haal ik kerst nog | 0,88 rem |
| Band | wat kan ik krijgen | groot, maar onder de vouw op een telefoon van 390 px |
| H1 | niets; het is een categorienaam | 41,6 px |
| Subregel | niets; het is sfeer | lead-formaat |

De vier vragen uit `kerstpagina-herzien.md` worden alle vier beantwoord, en alle vier in
de kleinste letter van de hero. De twee grootste tekstelementen beantwoorden er geen.
Dat is wat "matig" is: niet de vormgeving, maar dat het oog eerst twee regels krijgt die
niets zeggen en daarna moet zoeken naar wat ertoe doet.

### Per element

**1. H1 "Kerstpakketten & eindejaar": anders.** Dit is een categorielabel, geen kop. Het
zegt wat de pagina is, niet waarom je hier goed zit. De bezoeker typte "met logo" en
dat woord staat niet in de kop. "Eindejaar" als los zelfstandig naamwoord gebruikt
niemand; het staat er voor de zoekmachine. En het is dezelfde bouw als de homepage-kop
("Relatiegeschenken gemaakt in Europa") maar dan zonder de belofte. Kosten als hij
blijft: de grootste letter op de pagina draagt geen enkele van de vier antwoorden, en
het scherpste argument van het merk ("EU made", zie `market/positioning.md`) komt in de
eerste schermvulling nergens voor.

**2. Subregel: weg, of vervangen.** "Bedank medewerkers, klanten en relaties met een
geschenk dat oprecht en doordacht voelt." Dit is precies de zin uit de
specificiteitstest in `design/niet-meer.md`: hij past op elke concurrent. "Oprecht en
doordacht" is het adjectievenpaar dat een taalmodel schrijft als het "warm" moet
klinken. De merkskill citeert hem in `audience/icp.md` als samenvatting van wat de
klant wil, en dat is wat hij is: een interne samenvatting, geen zin voor een inkoper.
Kosten als hij blijft: twee regels leadtekst tussen de kop en de feiten, dus 60 px op
mobiel die de band verder onder de vouw duwen, en de eerste zin die de bezoeker leest
is de zin die iedereen schrijft.

**3. Feitenblok: blijft, maar promoveren.** Dit is het beste element en het is gezet als
voetnoot. Twee kleinere dingen: de drie items staan niet in dezelfde grammaticale vorm
(een prijsbereik, een aantal, en dan een eigenschap: "Met jouw logo erop"); de
merkgids vraagt gelijke vorm in een rij. En "Met jouw logo erop" is geen feit van dezelfde
soort als de andere twee; het hoort in de kop, niet in de feitenrij. Kosten als het zo
blijft: de inkoper die scant ziet een grote kop, een grijze alinea en een grijs lijstje,
en het lijstje is wat hij zocht.

**4. Deadline: blijft, maar hij is niet bevestigd.** "27 november" volgt uit vijftien
werkdagen, en die vijftien zijn een aanname die nergens gemeten of nagevraagd is
(`docs/metingen/2026-11-04-hero-feiten/notities.md`). Het is tegelijk het sterkste
argument dat een seizoenspagina heeft, en vandaag nog 22 dagen weg. Klopt tien
werkdagen, dan is het 4 december; klopt twintig, dan is het 20 november en staat er
over vijftien dagen een leugen boven de pagina. Dit ene getal bepaalt of de hero
scherp kan zijn of vaag moet blijven. Zie deel 6.

**5. Knop "Vraag een offerte aan": blijft.** Het is de gemeten conversie en de juiste
eerste knop. De woordkeuze is goed.

**6. Knop "Bekijk alle kerstpakketten": weg uit de hero.** Drie redenen. De band
eronder tóónt de pakketten al; een knop die wegstuurt naar een categoriepagina terwijl
het antwoord 200 px lager schuift, is een knop tegen jezelf. De herziene opdracht van
29 oktober zegt letterlijk "Eén hoofdknop. Twee gelijkwaardige knoppen laat mensen
stilstaan", en de versie van 4 november had er daarom één; op 5 november is de tweede
teruggekomen zonder dat ergens staat waarom. En het is de derde van vijf klikbare
dingen in de eerste schermvulling. Waar hij wel hoort: als rustige link ónder de band,
"Alle kerstpakketten" met pijl, op de plek waar nu de scrollverwijzing staat.

**7. Richard in de hero: weg.** Hij staat op dezelfde pagina ook in de eind-CTA, en
`design/niet-meer.md` punt 7 zegt: niet twee keer op één pagina. In de hero concurreert
hij met de offerteknop als derde uitnodiging om contact op te nemen, en hij kost 57 px
hoogte op mobiel plus een rij in de voet op desktop. Op de kale versie die ik zag staat
zijn tekst in perzik op crème en loopt hij over de logo's heen; met sectie 53 is dat
gerepareerd, maar het blijft een element dat voor een donker paneel ontworpen is en
hier geen taak heeft. Kosten als hij blijft: een extra regel tussen de knop en de band,
en een gezicht dat de aandacht trekt op het moment dat die naar de producten moet.

**8. Klantlogo's: anders, en eerst een vraag beantwoorden.** De analyse van 29 oktober
noemde ze "echt sociaal bewijs, meteen zichtbaar" en wilde ze houden. Ik ben
terughoudender. Vier logo's van 22 px hoog zonder onderschrift lezen als decoratie, niet
als bewijs; de referenties (Hypesonic, The Grid Waves) zetten een logorij áltijd met een
label erboven ("Trusted by", "Brands that worked with us") en áltijd onder de band, niet
erboven. En `OPEN-VRAGEN.md` zegt dat niet vaststaat welke klanten als referentie
genoemd mogen worden. Zolang dat open is, is dit een risico dat in de hero staat.
Voorstel: onder de band, met één regel erboven ("Eerder voor" of "Onder andere voor"),
en pas als de toestemming vastligt. Kosten als ze blijven waar ze staan: 40 px op
mobiel tussen knop en band, en nul bewijskracht zonder label.

**9. De band: blijft, en is het minst eigen stuk van de hero.** Technisch is hij goed
gebouwd (alleen transform, pauze bij hover en focus, reduced-motion uit, klonen
aria-hidden, allemaal gemeten). Mijn kritiek is een andere. Een doorlopend schuivende
rij witte tegels met packshots is de beeldtaal van BrandLyft, Hypesonic en Switchblade:
startup- en bureaupagina's. De merkgids zegt in `niet-meer.md` punt 19 dat dat niet ons
register is. Wat de band van Rooted Goods maakt is alleen de inhoud, en die inhoud is
op dit moment vier keer een borrelplank van de negen tegels, zonder de goedkoopste en
de duurste. Beweging maakt herhaling zichtbaarder, niet minder. Ik vermoed dat Ward
"de slider is goed" zegt omdat het het enige is dat beweegt; de eerlijke test is of de
band de inkoper sneller bij de antwoorden brengt, en dat doet hij niet, dat doen de
feiten. Houden dus, maar niet als het ding waar de hero om draait.

Twee kleine dingen aan de tegels: "Van € 32,00" is zoals Shopware het zet, maar "€ 32
per persoon" is wat de hero belooft; die twee formuleringen staan nu 200 px uit elkaar.
En de productnaam staat in cognac, de kleur die de merkgids reserveert voor "hier kun je
klikken". De tegels zijn klikbaar, dus het mag, maar negen cognac labels naast één
cognac knop verwateren het signaal van die knop.

**10. Scrollverwijzing "Waarom deze pakketten anders zijn": weg.** Het label belooft het
vergelijkblok ("Geen kringloop-cadeau, geen sticker-logo"), maar de link scrolt naar de
eerstvolgende CMS-sectie, en dat is "Een bedankje dat het hele jaar samenvat" met de
sfeerfoto van 320 bij 240. Dat is precies het blok dat de analyse van 29 oktober als de
klif aanwees (91 van de 292 mobiele bezoekers haken af tussen 20% en 25% diepte, en
die foto staat op y=1739, middenin). De hero stuurt mensen dus met een belofte de klif
in. Het plan van 5 november zei zelf al dat "de volgende sectie net boven de vouw" de
sterkste uitnodiging is; een benoemde link is pas zinvol als het label klopt met wat
eronder staat. Kosten als hij blijft: een derde link in cognac, een belofte die niet
wordt ingelost, en een extra regel voordat de pagina verdergaat.

### Wat er niet in de hero staat en wel zou moeten

Het merk heeft één argument dat op niemand anders past: makers in Europa die je kunt
aanwijzen, bellen en bij naam noemen. In de eerste schermvulling van de kerstpagina
staat daar niets van. Niet in de kop, niet in de subregel, niet op de tegels. De
bezoeker ziet een pakket met Tony's en een Bambook en heeft geen idee waarom dit
anders is dan Greengiving of Monday Merch. Dat is het gat dat de copy moet dichten,
niet "oprecht en doordacht".

### Twee dingen die naast de hero liggen maar in dezelfde plakronde moeten

- De FAQ op dezelfde pagina zegt nog "Er is geen vaste minimale afname" terwijl de hero
  "Vanaf 10 stuks" zegt. Dat is punt 14 van het plan en het staat nu op één pagina
  onder elkaar.
- Het "Inspiratie"-kopje en de knop "Bekijk alle producten" worden door sectie 53
  verborgen zolang die gepubliceerd is. Haal ze liever in de editor weg; een element dat
  alleen door CSS onzichtbaar is, komt terug zodra de CSS een keer achterloopt, en dat
  is vandaag precies wat er gebeurt.

## 3. Gecentreerd of links?

**Oordeel: gecentreerd voor de hero boven de band, op desktop. Op mobiel links. En het
is niet de hefboom die Ward denkt dat het is.**

Het argument vóór. Alle vijf referenties centreren de kop, en dat is geen smaak maar
compositie: de band eronder is symmetrisch en loopt aan beide kanten van het scherm af.
Een kop die links staat boven een band die in het midden hangt, geeft twee zwaartepunten.
De huidige desktopopzet maakt dat erger: kop links, feiten en knoppen rechts onderaan,
dan een voetregel met Richard links en logo's rechts, dan een band die het midden
zoekt. Drie horizontale zones met drie verschillende uitlijningen boven een bewegend
element. Dat is ontworpen om het sjabloon "eyebrow, kop, sub, twee knoppen, gecentreerd"
te breken, en het is bedacht zonder dat iemand het gezien heeft. Een hero zonder beeld
heeft bovendien geen reden voor een linker- en een rechterkolom; de kolomverdeling van
de homepage bestaat omdat er een mozaïek naast staat.

De eerlijke tegenwerping, in twee delen.

Ten eerste: `DESIGN-AUDIT.md` beslissing 3 en `niet-meer.md` punt 3 zeggen "stop met
alles centreren". Maar lees wat daar precies staat: het bezwaar is dat élke sectie
gecentreerd staat in dezelfde kolombreedte, dus herhaling. Eén gecentreerde hero boven
een band van rand tot rand, gevolgd door secties die links staan, is niet dat probleem.
Het wordt het pas als de rest van de pagina ook weer centreert.

Ten tweede, en dit is het deel dat Ward moet horen: gecentreerde Playfair-kop, één
korte regel, één pil, band eronder, dat is **letterlijk de Framer-startup-hero** uit zijn
eigen referentiemap. Het vibe-rapport dat in de merkgids is verwerkt zegt dat het palet
plus serif al in het "tasteful default"-register zit. Centreren maakt de hero niet
minder AI; het maakt hem herkenbaarder als het sjabloon dat iedereen gebruikt. Wat hem
daaruit haalt is niet de uitlijning maar drie andere dingen: dat de feitenregel het
grootste tekstelement na de kop is (dat doet geen enkele referentie), dat de copy
specifiek is op een manier die op geen concurrent past, en dat de band van rand tot
rand loopt. Centreer je en houd je de huidige kop en subregel, dan is het resultaat
netter en generieker tegelijk.

En de randvoorwaarde: centreren werkt alleen als de hero kort is. Vier elementen
(kop, één regel, feitenregel, één knop) centreren goed. Tien elementen gecentreerd
wordt een totempaal. Dus centreren ja, maar pas nadat deel 2 is uitgevoerd, niet in
plaats daarvan.

Over mobiel: 89,6% van het verkeer (29 oktober tot en met 2 november). Op 390 px is een
gecentreerde kop van twee regels met een gecentreerde subregel van drie regels slechter
scanbaar dan links uitgelijnde tekst, omdat elke regel op een andere plek begint. De
referenties zijn allemaal desktopschermen; geen van de vijf laat zien hoe het op een
telefoon staat. Mijn advies is links op mobiel, gecentreerd vanaf 992 px. Dat is wat de
meeste sites van dit type doen en het kost geen tweede hero, alleen een
`text-align` in één mediaquery. Wil Ward per se één uitlijning op alle breedtes, dan is
links de veiligere van de twee, want dat is wat negen op de tien bezoekers ziet.

## 4. Nieuwe copy

Toon uit `brand/voice.md`: warm, eerlijk, concreet, nuchter. Geen uitroeptekens, geen
em-dashes, claims alleen in de formulering uit `brand/claims.md`. Alle getallen zijn de
gemeten getallen van 4 november; de datum is de onbevestigde.

Eén afweging die elke variant raakt: "Gemaakt in Europa" mag van Ward in koppen, maar
de kerstpakketten bevatten merkproducten van derden (Tony's, Bambook, kaas op een
borrelplank). Voor deze pagina gebruik ik daarom liever de makers-formulering dan de
gemaakt-formulering; die is waar voor het hele assortiment en is bovendien de meest
eigen zin die het merk heeft.

### Variant A: het antwoord op de zoekvraag

> **Kerstpakketten met jouw logo, van makers die je kunt aanwijzen op de kaart**
>
> € 25 tot € 70 per persoon · vanaf 10 stuks · vóór 27 november besteld, de week voor
> kerst bezorgd
>
> [Vraag een offerte aan]

Geen aparte subregel: de feitenregel ís de subregel, gezet op leadformaat (ongeveer
1,1 rem, de getallen zwaar, de rest zacht). Onder de band: "Alle kerstpakketten" als
rustige link.

Waarom hij werkt: de kop bevat de zoekterm en het ene argument dat op niemand anders
past, in de ijkzin van de site zelf. Alle vier de vragen staan in de tweede regel, in
dezelfde grammaticale vorm (drie bepalingen). De hero is vier regels hoog.

Waar hij op gokt: de kop is lang (74 tekens, drie regels op mobiel, twee op desktop).
En "aanwijzen op de kaart" is beeldspraak die een koude advertentiebezoeker misschien
niet meteen plaatst; hij werkt op de homepage omdat daar een Europakaart onder staat.
Als die twijfel zwaar weegt: "Kerstpakketten met jouw logo, van makers in Europa", 50
tekens, minder eigen, maar sluitend.

### Variant B: feit en wending, het kop-idioom van de site

> **Een kerstpakket dat blijft**
> **Niet eentje voor de kringloop**
>
> Met jouw logo erop, van makers in Europa. € 25 tot € 70 per persoon, vanaf 10 stuks.
> Bestel vóór 27 november, dan ligt het er de week voor kerst.
>
> [Vraag een offerte aan]

De tweede regel in faux oblique cognac-licht, zoals "Wij weten waar" en "Wij regelen
alles". Dat is het ene accentwoord-idioom op deze pagina; de eind-CTA heeft er ook een,
dus de intro-kop eronder moet er dan zonder.

Waarom hij werkt: dit is het scherpste bezwaar van een inkoper die ooit een slecht
kerstpakket kocht, en het staat nu op 60% diepte in het vergelijkblok. In de kop pakt het
de lezer op het pijnpunt in plaats van op de categorie. De toon is de toon van de
over-ons-pagina: een feit, dan een wending, zonder punt.

Waar hij op gokt: de kop bevat niet de zoekterm "met logo" en niet het woord
"kerstpakketten" in de eerste regel. Voor de relevantie van de advertentie met de
landingspagina kan dat tellen; ik heb geen meting die zegt hoeveel, en wil het niet
raden. En een negatief geformuleerde tweede regel in de hero is een stijlkeuze die Ward
moet willen; het vergelijkblok doet het al, en twee keer op één pagina wordt een tic.

### Variant C: de deadline als kop, met opzet de gok

> **Vóór 27 november besteld, de week voor kerst op de mat**
>
> Kerstpakketten met jouw logo, van makers in Europa. € 25 tot € 70 per persoon, vanaf
> 10 stuks.
>
> [Vraag een offerte aan]

Waarom hij werkt: het is 5 november en de bezoeker komt uit een advertentie; de enige
vraag die nu écht urgent is, is "haal ik het nog". Geen concurrent zet een datum in zijn
kop. Het is het meest "eye catching" van de drie, omdat het het enige is dat een
belofte doet waar je op afgerekend kunt worden.

Waar hij op gokt: alles. De datum is niet bevestigd. De kop sterft op 28 november en
heeft een opvolger nodig ("Nog op tijd voor kerst? Vraag het ons, we zeggen eerlijk wat
kan"). De zoekterm staat niet in de H1. Ik zet hem erbij omdat hij laat zien wat de
bovengrens is als Ward de levertijd bevestigt, niet omdat ik hem zou kiezen zonder die
bevestiging.

### Mijn keuze

Variant A als basis, met de kop van A en, zodra de levertijd bevestigd is, de deadline
als tweede regel in cognac zoals nu. Variant B als de kop voor het vergelijkblok lager
op de pagina, waar hij al half staat. Variant C alleen als Ward de datum bevestigt én
iemand belooft hem op 28 november te vervangen.

### Microcopy

| Waar | Nu | Voorstel | Waarom |
|---|---|---|---|
| Tegels, prijs | Van € 32,00 | € 32 per persoon | dezelfde eenheid als de hero |
| Onder de band | Waarom deze pakketten anders zijn | Alle kerstpakketten | zegt wat de link doet, wijst naar de categoriepagina |
| Logorij (als hij blijft) | geen label | Eerder voor | zonder label is het decoratie |
| Knop | Vraag een offerte aan | Vraag een offerte aan | goed zo |

Niet gebruiken: "Alle 11 kerstpakketten". Het getal klopt vandaag en verandert per
seizoen, en een getal dat niet meer klopt is erger dan geen getal.

## 5. De hiërarchie

Van zwaar naar licht, met wat er met elk element gebeurt.

| Gewicht | Element | Wat ermee gebeurt |
|---|---|---|
| 1 | Kop | Blijft het grootste. Krijgt de zoekterm en het makers-argument. |
| 2 | Feitenregel met deadline | Promoveert van 0,88 rem grijs naar leadformaat, de getallen in inkt en vet. Dit is de tweede regel van de hero, niet de vierde. |
| 3 | Band | Blijft. Krijgt de elf (of acht volgens het plan) met Bak en Offline erin en de borrelplanken teruggebracht tot één. |
| 4 | Eén knop | "Vraag een offerte aan", boven de band. |
| 5 | Eén rustige link onder de band | "Alle kerstpakketten" met pijl. |
| 6 | Logorij | Onder de band, met label, pas als de toestemming vastligt. Anders weg. |
| weg | Subregel | De feitenregel neemt de plek over. |
| weg | Tweede knop in de hero | Wordt de link onder de band. |
| weg | Richard in de hero | Blijft in de eind-CTA. |
| weg | Scrollverwijzing | De volgende sectie half boven de vouw is de hint. |

Dat zijn vijf elementen boven de band in plaats van acht, en twee eronder in plaats van
één. Op 520 px breed scheelt dat naar schatting 180 tot 220 px hoogte (subregel 60,
Richard 57, logo's 22 plus marges, tweede knop ongeveer 40); de band begint dan rond
y=450 in plaats van y=663, dus bijna helemaal boven de vouw van 953 px. Dat is een
schatting uit de gemeten hoogtes van de losse elementen, niet een meting van de nieuwe
hero; die bestaat nog niet.

**Over de knop onder de band.** BrandLyft zet de knop ónder de band, Hypesonic en The Grid
Waves erboven. Ik kies boven, om één reden: op een telefoon begint de band nu op y=663
in een venster van 953, en op 390 px breed lager. Een knop ónder de band staat op een
telefoon onder de vouw, en negen op de tien bezoekers zitten op een telefoon. Op
desktop zou "eerst kijken, dan klikken" goed kunnen werken; het is een legitieme
variant, maar dan voor één op de tien bezoekers, en ten koste van de knop naast de kop
voor de andere negen. Niet doen, of alleen als Ward een desktopvariant wil onderhouden.

**Over de volgorde na de band.** Dit hoort hier omdat de hero er de mensen heen stuurt.
Nu komt na de band het intro-blok met de sfeerfoto, dan het vergelijkblok, dan de FAQ.
De analyse van 29 oktober vroeg de sfeerfoto weg (punt 5) en het vergelijkblok hoger
(punt 8); allebei nog open. Zolang dat zo is, landt iedereen die onder de hero verder
scrolt eerst in het blok met de minste informatie. De hero kan niet goed worden als de
sectie eronder de klif blijft.

## 6. Wat er mist om dit echt goed te maken

Ward vraagt of hij meer kan leveren. Eerlijk antwoord, in volgorde van wat het meest
uitmaakt.

### Wat de bovengrens bepaalt

**1. De levertijd.** Eén getal: hoeveel werkdagen van akkoord op de drukproef tot
bezorging, voor deze elf pakketten, in december. Daar hangt de deadline aan, en de
deadline is het enige element van de hero dat niemand anders heeft. Zonder dat getal
kan de kop niet scherper dan Variant A en moet de datum met een slag om de arm blijven
staan. Dit is een telefoontje naar de makers of één blik in de orderhistorie van vorig
jaar, en het is het goedkoopste wat Ward kan leveren.

**2. Eén echte foto.** Niet het model van Switchblade; één pakket, uitgepakt, op een
bureau of een keukentafel, echt licht. Nu is elk beeld een packshot op wit, en het plan
van 5 november zegt zelf dat dat "de harde bovengrens" is: elke band blijft een rij
witte vlakken. Eén sfeerbeeld maakt een andere hero mogelijk (beeld rechts, tekst links,
geen band nodig boven de vouw) of één afwijkende tegel in de band die het ritme breekt.
Zolang die foto er niet is, is de band het beste wat met dit materiaal kan, en is "eye
catching" iets dat alleen de copy nog kan leveren.

**3. De keuze tussen "koop een pakket" en "daag ons uit".** De herziene opdracht van
29 oktober maakte de uitnodiging ("Vertel wat je wil weggeven") de hoofdknop en de
pakketten bijzaak. De hero van 5 november maakt de offerte de hoofdknop en de pakketten
het middelpunt. Die twee opdrachten spreken elkaar tegen en dat is nergens besloten.
Het bepaalt de kop: "Kerstpakketten met jouw logo" verkoopt pakketten; "Vertel wat je
wil weggeven" verkoopt een gesprek. Ik heb hierboven voor pakketten gekozen, omdat
iemand die `kerstgeschenk met logo` intypt in koopmodus zit, en omdat de uitnodiging
(stap 3 van de herziene opdracht) nog niet bestaat. Maar het is Wards besluit, niet
het mijne.

### Wat helpt, en goedkoop is

**4. Eén schermafbeelding van desktop.** De testpagina op 1440 px breed, met Resource
Override aan, als jpg in `docs/metingen/`. Twee rondes zijn blind ontworpen voor negen
op de tien schermbreedtes die Ward zelf gebruikt. Dit kost hem dertig seconden.

**5. Antwoord op de logovraag.** Mogen Erasmus MC, Ifes, Zuiderzorg en Wezijnwille
genoemd worden? Ja of nee bepaalt of de logorij bestaat.

**6. De sliderselectie in de editor.** Bak pakket en Offline pakket erin, drie van de
vier borrelplanken eruit. Staat al in het plan, is nog niet gedaan, en het is het verschil
tussen een band die de prijsbelofte waarmaakt en een band die vier keer hetzelfde laat
zien.

**7. De vijf besluiten uit `DESIGN-AUDIT.md` fase 3.** Vooral besluit 2 (typografisch
contrast) en 4 (kicker en card-soup). Ze wachten sinds 10 augustus. Zolang ze open staan,
wordt elke hero een reeks microkeuzes zonder maat: hoe groot mag de feitenregel, hoeveel
sprong tussen kop en lead, wanneer wel en niet een accentwoord. Dat is waarom drie
rondes drie verschillende hero's opleverden.

### Wat niet helpt

**Meer referenties van dit type.** Er liggen er nu vijf en ze zeggen allemaal hetzelfde:
gecentreerde kop, korte regel, één knop, band eronder, logo's. Een zesde voegt niets toe.
De Switchblade-video was bruikbaar omdat hij een mechanisme toonde; de rest toont een
sfeer, en sfeer is niet het probleem. Wat wél een nuttige referentie zou zijn: een
concurrentpagina waarvan Ward vindt dat de **copy** klopt, niet de lay-out. Dat is er
nog nooit een geweest, en `market/competitors.md` zegt zelf dat niets daarin op de
eigen site van de partij gecontroleerd is.

**Een extra skill of designsysteem.** De merkgids heeft alles wat deze hero nodig heeft:
toon, ijkzinnen, claims, wat niet meer mag. Wat ontbreekt is geen regel maar een besluit
(punt 3 en 7 hierboven) en een getal (punt 1). Daar helpt geen skill bij.

**Een vierde bouwronde zonder de punten 1 tot en met 3.** Dat levert een vierde hero op
die technisch klopt en opnieuw "matig" is, om dezelfde reden als de vorige drie: de
inhoud is bedacht rond wat er toevallig beschikbaar was, en niet rond wat de inkoper
komt doen.

## Beperkingen van deze analyse

- Alleen gezien op 520 px breed. Desktop is afgeleid uit de CSS, niet bekeken.
- Gezien zonder sectie 53: de versie die ik zag is de HTML met de oude CSS. De
  bedoelde weergave ken ik uit de meetnotities van 5 november en de code.
- Ik weet niet welke van de twee versies Ward beoordeelde.
- Geen nieuwe metingen: alle getallen komen uit `kerstpagina-herzien.md` (Clarity,
  oktober, 292 mobiele weergaven), `2026-11-04-hero-feiten` (prijzen en afname) en
  `2026-11-05-band-test` (posities op 520 px). De hoogtewinst in deel 5 is een
  schatting uit die posities.
- De copyvarianten zijn niet getest op iemand uit de doelgroep. Er is geen
  klantonderzoek (`audience/icp.md`), dus "werkt voor déze bezoeker" is beredeneerd
  vanuit de zoekwoorden en de scrollcijfers, niet gemeten.
- Het effect van een H1 zonder zoekterm op de advertentierelevantie heb ik niet kunnen
  meten en wil ik niet schatten.
