# Punt 13: de kerstpagina, wat er precies moet veranderen

29 oktober 2026. Alles hieronder gemeten, niets gegokt.

## Waarom deze pagina en waarom nu

`/eindejaarsgeschenken` krijgt **300 klikken en € 425,17** over 6 t/m 27 oktober, uit
twee advertentiegroepen: Kerstpakket met logo (227 klikken, € 325,45) en Duurzaam
kerstpakket (73 klikken, € 99,72). Dat is de op één na duurste landingspagina van het
account.

Over zes weken is deze pagina een jaar lang waardeloos. Elk ander punt in het plan kan
in januari ook nog.

## Het probleem, in één tabel

De pagina is **6.794 px hoog op mobiel, acht schermen**. Clarity, oktober, 292
mobiele weergaven:

| Hoe ver gescrold | Bezoekers | Aandeel |
|---|---:|---:|
| 10% | 255 | 87% |
| 20% | 202 | 69% |
| **25%** | **111** | **38%** |
| 30% | 82 | 28% |
| 50% | 50 | 17% |
| 65% | 25 | 9% |

Tussen 20% en 25% vallen 91 van de 292 mensen weg. Dat is de grootste klif op de
pagina, rond y=1400 tot 1700, net voorbij het inspiratieblok.

**En nu de kern.** De drie dingen die een inkoper moet weten staan hier:

| Vraag | Waar het antwoord staat | Wie dat ziet |
|---|---|---|
| Wat kost het? | productprijzen in Inspiratie, y≈1000 | 69% |
| Vanaf hoeveel stuks? | FAQ, y=3694, **54% diep** | 17% |
| Hoe lang duurt het? | FAQ, y=3694, **54% diep** | 17% |

Vijf van de zes bezoekers krijgen nooit antwoord op de twee vragen die bepalen of ze
een aanvraag doen.

**Voorbehoud:** deze scrollcijfers zijn van vóór 28 oktober, toen de cookiemodal nog
40,7% van de taps op deze pagina opslokte. Een deel van die klif kan de modal zijn
geweest. Hermeten na twee weken, maar de structuur klopt hoe dan ook niet: antwoorden
op 54% diepte bereiken nooit de meerderheid.

## Wat er moet gebeuren

### 1. Een feitenblok direct onder de h1, boven y=1000

Drie regels, geen proza. Zoiets:

> **Vanaf € 12,50 per pakket** · **vanaf 25 stuks** · **levertijd 10 werkdagen**
> Proefdruk binnen één werkdag, prijs op maat binnen één werkdag.
> [Vraag een offerte aan]

De getallen moeten van jou komen; ik heb ze niet. Wat telt is dat ze er staan vóór het
inspiratieblok, niet erna.

### 2. De CTA mee naar boven

De enige knop boven de vouw is nu "Bekijk alle producten", en die stuurt mensen de
catalogus in waar ze opnieuw moeten zoeken. Op een seizoenspagina met 300 betaalde
klikken hoort de offerteknop daar te staan.

### 3. De twee FAQ-antwoorden naar boven halen

"Wat is de minimale afname?" en "Wat is de levertijd?" hoeven niet in de FAQ te
blijven, maar het antwoord moet bovenin staan. De FAQ mag het herhalen.

### 4. Het beeld doet niet genoeg voor de ruimte die het pakt

Gemeten op mobiel, 390 px breed: **17 zichtbare afbeeldingen, samen 2.260 px, oftewel
33% van de pagina.** Een derde van de hoogte is beeld.

Wat er staat en wat het doet:

| Waar | Formaat | Wat het is |
|---|---|---|
| y=178 | 129×123 en 167×260 | collage bovenaan, klein |
| y=1100 | 9× 133×90 | de pakketten uit Inspiratie |
| **y=1739** | **320×240** | **sfeerfoto "Collega's die elkaar oprecht bedanken"** |

Twee dingen vallen op.

**De sfeerfoto staat precies in de klif.** Die 240 px zit op y=1739, midden in de band
waar 91 van de 292 bezoekers afhaken. Het is het grootste beeld op de pagina en het
zegt niets over prijs, aantal of levertijd. Op mobiel is dat 240 px die een inkoper
moet passeren om bij informatie te komen.

**De pakketten zijn te klein om iets te zien.** Negen afbeeldingen van 133×90 px op een
scherm van 390 px breed. Een inkoper kan daarop niet zien wat er in een pakket zit, en
dat is precies wat hij wil weten. Ze dragen hun ruimte dus ook niet, maar om de
omgekeerde reden: te klein in plaats van te groot.

**Voorstel:** sfeerbeeld weg op mobiel, of naar onderen. De pakketten juist groter, met
de prijs en het vanaf-aantal eronder. Dan vertelt het beeld wat het pakket is én wat het
kost, in plaats van alleen sfeer.

### 4. Inkorten, of de klif verplaatsen

Acht schermen is veel voor een seizoenspagina. Als inkorten niet kan, zorg dan dat
alles wat een beslissing ondersteunt vóór de 25%-grens staat, dus boven y=1700.

## Hoe we weten of het werkte

Hermeten in Clarity over dezelfde pagina, mobiel, na twee weken:

- het aandeel dat 25% haalt moet omhoog van 38%
- het aandeel dat 50% haalt moet omhoog van 17%
- en in GA4: `sectie_<naam>` en de nieuwe trechter laten zien of mensen na deze pagina
  een product openen


---

# Stap 1: wat er nu staat en wat de pagina moet doen

## De functie van de pagina

`/eindejaarsgeschenken` is de landingspagina voor twee advertentiegroepen:
Kerstpakket met logo (227 klikken) en Duurzaam kerstpakket (73 klikken). De
zoekwoorden eronder zijn `kerstgeschenk met logo`, `kerstgeschenken met logo`,
`kerstcadeau met logo`, `kerstgeschenk duurzaam`.

Iemand die dat intypt wil vier dingen weten: **wat kan ik krijgen, wat kost het,
vanaf hoeveel stuks, en haal ik kerst nog.** Dat is de hele vraag.

## Wat de pagina nu doet, blok voor blok

| Blok | Wat het zegt |
|---|---|
| Hero | h1, één zin sfeer, twee knoppen, vier klantlogo's, drie foto's |
| Productslider | negen pakketten, 133×90 px |
| Intro | "Een bedankje dat het hele jaar samenvat" |
| Feature-rij | Waardering, Verbondenheid, Smaak, plus een sfeerfoto van 320×240 |
| Vergelijk | "Wat het níet is" tegenover "Wat het wél is", twee punten elk |
| FAQ | vijf vragen |
| Services | drie kaarten |
| Eind-CTA | "Van idee tot ingepakt" |

Acht blokken, acht schermen. De pagina verkoopt een **gevoel**: waardering,
verbondenheid, smaak, geen kringloop-cadeau. Dat is goed geschreven en het past bij
het merk.

Maar van de vier vragen die de zoeker heeft, beantwoordt de pagina er **nul**.

## De ernstigste vondst: de antwoorden bestaan niet

Ik schreef eerder dat de minimale afname en de levertijd "alleen in de FAQ staan, op
54% diepte". Dat was te mild. Dit staat er werkelijk:

> **Is er een minimale afname of bestelhoeveelheid?**
> "Dat verschilt per product. Er is geen vaste minimale afname."

> **Hoe lang duurt de levertijd?**
> "Levertijden zijn altijd productafhankelijk."

> **Hoe ver van tevoren moet ik bestellen voor kerst?**
> "Levertijden zijn altijd productafhankelijk. Hoe eerder, hoe meer keuze en rust."

Dat zijn geen antwoorden maar herhalingen van de vraag. De 17% die tot daar scrolt,
komt er net zo onwetend uit als hij erin ging.

En "er is geen vaste minimale afname" is bovendien **in tegenspraak met de
productpagina's**: de pepermunt vraagt er 1.000, BioSocks 250, de Thermos 100. Dat is
punt 14 uit het plan, en het staat hier letterlijk op de landingspagina waar het geld
heen gaat.

## Wat er verder ontbreekt

**Geen enkel bedrag.** Nergens staat "vanaf € X per pakket". Een inkoper met een
budget van € 20 per persoon kan op deze pagina niet vaststellen of hij hier goed zit.

**Geen deadline.** Het is 29 oktober. Er is een datum waarop bestellen voor kerst niet
meer lukt, en die staat nergens. Dat is het sterkste argument dat een seizoenspagina
heeft, en het wordt niet gebruikt.

**De tweede knop werkt tegen je.** "Bekijk alle producten" stuurt mensen naar de
catalogus, waar de sortering opent met het goedkoopste wat er is. Punt 5 in het plan.

**De proefdruk staat alleen in de balk bovenaan.** "Proefdruk binnen één werkdag" is
een sterk en concreet argument, en het staat alleen in de sitebrede balk, niet in de
pagina zelf.

## Wat wél goed is en moet blijven

- **De vier klantlogo's in de hero.** Echt sociaal bewijs, meteen zichtbaar.
- **Het vergelijkblok.** "Geen kringloop-cadeau, geen sticker-logo" is scherp en
  onderscheidend. Dat is precies het bezwaar van een inkoper die eerder een slecht
  kerstpakket heeft gekocht.
- **De toon.** Warm en concreet, past bij het merk.

Het probleem is niet de inhoud maar de volgorde: het gevoel staat vooraan en de feiten
ontbreken. Voor een advertentiebezoeker die nog niets van je weet, is dat andersom.

## Stap 2: wat hieruit mee moet in het nieuwe ontwerp

1. Een feitenblok direct onder de h1: **vanaf-prijs, vanaf-aantal, levertijd.**
2. **Een besteldeadline voor kerst**, met datum, zichtbaar bovenin.
3. De offerteknop als eerste knop, niet de catalogusknop.
4. **Echte antwoorden in de FAQ**, met getallen. En de tegenspraak over minimale
   afname oplossen.
5. De sfeerfoto van 320×240 weg bij y=1739, want die staat in de klif.
6. De pakketten groter, met prijs en vanaf-aantal eronder.
7. "Proefdruk binnen één werkdag" in de pagina zelf.
8. Het vergelijkblok behouden, maar hoger.
9. Alles wat een beslissing ondersteunt boven y=1700, want daar haakt 62% af.

**Nog te leveren door Ward:** de vanaf-prijs, het vanaf-aantal, de levertijd en de
kerstdeadline. Die getallen staan nergens op de site en ik kan ze niet verzinnen.

---

# Herziene opdracht, 29 oktober

Ward: de themapagina's tonen producten als **inspiratie**, en sturen erop dat bezoekers
delen wat zíj willen weggeven. De elf pakketten zijn afneembaar, maar mooier is het als
een bezoeker ons uitdaagt met een eigen idee, mits dat een goed verhaal heeft,
origineel is en in de EU gemaakt wordt.

Dat verandert wat de pagina moet doen. Niet: deze elf pakketten verkopen. Wel: laten
zien wat voor soort dingen we maken, en een gesprek beginnen.

## De spanning die we moeten oplossen

Iemand die `kerstgeschenk met logo` intypt zit in koopmodus, niet in meedenkmodus.
Vraag je hem meteen om mee te ontwerpen, dan vraag je meer dan waarvoor hij kwam.

Maar stel je eerst gerust dat hij op de goede plek is, dan landt de uitnodiging wel.
Daarom deze volgorde:

### 1. Oriëntatie, drie regels

Geen verkooppraatje, alleen het signaal "je zit goed".

> **Kerstpakketten van € 25 tot € 70 per persoon · vanaf 10 stuks · met jouw logo erop**
> Bestel vóór 27 november, dan ligt het er de week voor kerst. Daarna in overleg.

Alle elf pakketten zitten in die band en hebben **dezelfde minimale afname van 10**.
Dat is geen schatting, het is nagemeten op 29 oktober. De huidige FAQ zegt "er is geen
vaste minimale afname", en dat klopt hier dus niet.

De deadline is berekend: vijftien werkdagen terug vanaf vrijdag 18 december komt uit
op **vrijdag 27 november**. Lever je tot 22 december, dan is het 1 december.

### 2. Inspiratie, niet een schap

De elf pakketten groot genoeg om te zien wat erin zit, met prijs en vanaf-aantal
eronder. Niet gepresenteerd als "koop dit", maar als "dit is het soort dingen dat we
maken".

Nu zijn ze 133×90 px op een scherm van 390 breed. Daar kun je niet op zien wat een
pakket is, en dat is nou juist de hele functie van een inspiratieblok.

### 3. De uitnodiging

Dit is de kern van de nieuwe opdracht. Na de voorbeelden, niet ervoor:

> **Of daag ons uit.**
> Heb je zelf een idee? Vertel wat je wil weggeven, dan zoeken we uit of het kan.
> We maken het als het een goed verhaal heeft, origineel is en in Europa gemaakt kan
> worden.

Die drie eisen zijn geen drempel maar een kader: ze zeggen wat voor opdracht je leuk
vindt, en ze maken meteen duidelijk waar je voor staat.

**Eén hoofdknop.** Twee gelijkwaardige knoppen, "koop dit pakket" naast "vertel je
idee", laat mensen stilstaan. De uitnodiging wordt de hoofdknop, de pakketten houden
elk hun eigen rustige link.

### 4. Daarna pas het bewijs

Klantlogo's, het vergelijkblok, proefdruk binnen één werkdag, services. Dat is
geruststelling en het hoort ná de vraag, niet ervoor.

## Wat dit raakt in de rest van het plan

**Punt 18, de showroom.** Dit is precies waar dat voor bedoeld is. "Vertel wat je wil
weggeven" en dan binnen een werkdag een eigen voorstel terugsturen, dat is de showroom.
De kerstpagina wordt daarmee de eerste echte ingang ervan.

**Punt 14, de tegenstrijdigheid over minimale afname.** Voor deze pagina is die
opgelost: elf pakketten, allemaal vanaf 10. De tegenspraak zit in de FAQ-tekst, en die
kan gewoon weg.

**Punt 26, elke conversie zijn eigen gebeurtenis.** Als de uitnodiging een eigen
formulier of route krijgt, moet die een eigen gebeurtenis hebben. Anders weet je niet
of mensen kopen of uitdagen.

## Nog open

- De levertijd per pakket. De deadline van vijftien werkdagen hebben we nu, maar wat
  een inkoper op de productpagina ziet is nog niets.
- Of de inspiratie alleen uit de elf kerstpakketten komt of breder uit de catalogus.
