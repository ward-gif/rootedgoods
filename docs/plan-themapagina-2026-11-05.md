# Plan themapagina en ontwerprichting, 5 november 2026

> **Scope voor de eerstvolgende ronde, vastgesteld 5 november einde dag.**
> Alleen de hero en de kickersweep. Ward: *"Kaart hoeft niet voor nu, eerst maar even
> de hero fiksen en alles wat we sowieso opnieuw moeten plakken."*
>
> | Wel nu | Niet nu |
> |---|---|
> | De hero herschrijven en herbouwen | De Europakaart op de themapagina |
> | De kicker uit alle 22 blokken | Een themabeeld (besloten: geen, zie hieronder) |
> | De dode kicker-CSS opruimen | Het uitnodigingsblok "laat ons je verrassen" |
> | De hairline uit secties 51, 52 en 53 | De grote CSS-opruiming (besluit 6) |
>
> **Laatste besluiten:** Richard gaat uit de hero. De kickersweep is akkoord.
> **Geen themabeeld**: Ward vreest dat het cheap en stockish wordt, en geen van de vier
> referenties heeft een sfeerfoto in de hero; de productband ís het beeld. Wat de hero
> draagt is daarmee copy en typografie, en verder niets.

Dit vervangt `docs/thema-hero-plan-2026-11-05.md` als werkdocument. Het verwerkt de
onafhankelijke analyse in `docs/hero-analyse-2026-11-05.md` en de besluiten die Ward
op 5 november nam. Het is geschreven om uitgevoerd te worden door een ander model;
alles wat nodig is om te beginnen staat erin.

**Stand: niets hiervan is gebouwd.** Wat er wel staat is een werkende productband
(CSS-sectie 53 en een JS-sectie), lokaal, niet gepubliceerd.

## De besluiten van 5 november

| | Besluit | Gevolg |
|---|---|---|
| 1 | Eén tokenlaag. Ward: "doe wat het beste is voor de toekomst" | **`--rg-s2/s3/s4` wordt de spacingschaal** (stappen van 8 px, 7 aanroepen). `--rg-space-md/lg/xl` (6 aanroepen) verdwijnt. |
| 2 | Typografisch systeem met echt contrast | **Ja.** Begint bij de hero's. |
| 3 | Redactionele layout, niet alles centreren | **Ja, en het moet erg clean.** |
| 4 | Kicker-sjabloon doorbreken | **Scherper dan voorgesteld: nergens meer een kicker.** Ward: "dat is een ai tell". |
| 5 | De cognac hairline als signatuur | **Nee.** Ward: "ook een ai tell". |
| 6 | De CSS nalopen op dubbelheid | **Ja.** Toegevoegd door Ward. |

### Wat besluit 4 en 5 samen betekenen

Dit is het belangrijkste gevolg van vandaag en het staat nergens anders opgeschreven.

De merkgids zegt zelf waar het risico zit: *"Jouw palet plus een serif zit ín het
tasteful-default-register. Je kunt de look niet laten dragen door palet en font alleen,
want die twee zeggen inmiddels 'AI-gegenereerd warm merk'. Wat het merk eigen maakt zit
in beeld, copy en de signature-elementen."*

Met besluit 4 en 5 zijn de signature-elementen weg. **Dan moeten beeld en copy het in
hun eentje dragen.** Elke ronde die alleen aan layout sleutelt, komt daarom weer uit op
iets dat netjes is en niet eigen. Dat is precies wat er op 4 en 5 november gebeurde.

Daaruit volgt de volgorde van dit plan: eerst de copy, dan het beeld, dan pas layout.

## De specificiteitstest

Uit `~/.claude/skills/rootedgoods/design/niet-meer.md`, en vanaf nu de toets voor elke
zin die we schrijven:

> "Duurzame relatiegeschenken die indruk maken" past op elke concurrent.
> "Notitieboeken uit Nederland, messen uit Frankrijk, geen container uit Shenzhen" past
> alleen op jou.

De huidige subregel, *"Bedank medewerkers en relaties met iets dat oprecht en doordacht
voelt"*, zakt voor die test. Hij past op elke aanbieder van kerstpakketten in Nederland.

## Wat de pagina moet doen, volgens Ward

> "Koop een pakket óf laat ons je verrassen / daag ons uit moet beiden terugkomen.
> Eerst overtuigen met visueel en inspiratie waarna mensen vervolgens hun vraag moeten
> droppen, aangezien bijna niemand direct zal kopen."

Dat beslecht een tegenspraak die sinds 29 oktober in alles zat. De pagina verkoopt
niet direct; hij **overtuigt met beeld en laat daarna een vraag achter**. De
offerteroute is de hoofdroute, de uitdaging is de tweede, en die komt ná de
voorbeelden.

## De paginastructuur

| | Blok | Rol |
|---|---|---|
| 1 | Hero | Kort, specifiek, één knop. Geen kicker. |
| 2 | Productband | De inspiratie. Werkt al. |
| 3 | **De uitnodiging** | "Laat ons je verrassen." Bestaat nog niet; dit is het ontbrekende stuk. |
| 4 | Bewijs | Klantlogo's, vergelijkblok, services. |
| 5 | Eind-CTA | Bestaat. |

Blok 3 is nieuw en is de kern van de opdracht van 29 oktober die nooit gebouwd is.

## De hero, concreet

### Wat eruit gaat
- **De kicker.** Besluit 4.
- **De hairline voor de eyebrow.** Besluit 5, en hij stond al als punt 2 in
  `niet-meer.md` ("Streepje of lijntje vóór de eyebrow. Sjabloon-cliché"). Dat is op
  4 november gebouwd ondanks dat het er stond.
- **De tweede knop.** Het plan van 29 oktober zei "één hoofdknop"; op 5 november
  stonden er weer twee, zonder dat iemand dat besloot. "Bekijk alle kerstpakketten"
  wordt een rustige link onder de band.
- **De subregel in zijn huidige vorm.** Zakt voor de specificiteitstest.

### Wat blijft
- **De klantlogo's.** Ward bevestigt: houden. *Let op: `OPEN-VRAGEN.md` heeft sinds
  14 september de vraag of er toestemming is. Ward houdt ze erin, dus die vraag mag als
  beantwoord gelden; werk `OPEN-VRAGEN.md` bij.*
- **Richard.** Mijn oordeel tegen dat van de analyse in: op een pagina met 300 betaalde
  klikken is een gezicht met "vertel wat je zoekt" de zachtste ingang die er is, en de
  herhaling in de eind-CTA merkt vrijwel niemand. Smaakverschil, geen feit. Als het weg
  moet, zeg het.
- **Het feitenblok**, maar **groter**. Dit is de inhoudelijke kern van de analyse: de
  drie feiten en de levertijd beantwoorden alle vier de vragen die een inkoper heeft en
  staan nu in 0,88 rem grijs, terwijl de kop een categorienaam is. Dat moet omdraaien.

### De kop
Richting, niet definitief. De beste variant uit de analyse haalt de specificiteitstest:

> **Kerstpakketten met jouw logo, van makers die je kunt aanwijzen op de kaart**

Waar die op gokt: 74 tekens is lang, en "op de kaart" belooft een kaart die er niet
onder staat. Er is wél een Europa-kaartsectie op de site (`europa map sectie.html`); die
zou hier kunnen landen. Te beslissen bij het schrijven.

### De levertijd: wat we niet meer kunnen zeggen

Ward: *"Levertijd verschilt per product dus lastig te zeggen."*

**Daarmee vervalt de besteldeadline van 27 november.** Die stond op vijftien werkdagen
terug vanaf 18 december, en die vijftien was al een aanname. Een datum noemen die niet
voor elk pakket klopt is een belofte die we niet waarmaken.

Dat is jammer, want het was het sterkste seizoensargument. **Voorstel: vervang de
belofte door een vraag.**

> Nog op tijd voor kerst? Vraag het vandaag, dan weet je binnen één werkdag wat kan.

Dat is waar (de site belooft al "proefdruk binnen één werkdag"), het geeft urgentie
zonder een datum te verzinnen, en het stuurt naar de offerteroute, wat precies is wat
de pagina moet doen.

*Open: `OPEN-VRAGEN.md` meldt dat de FAQ-bron "24 uur" zegt waar de rest van de site
"één werkdag" zegt. Kies er één voordat dit geplakt wordt.*

### Gecentreerd of links

Besluit 3 zegt "niet alles centreren". Dat gaat over herhaling, niet over één hero.
Voorstel, en dat is ook wat de analyse concludeert:

- **Desktop gecentreerd**, maar alleen als de hero terug is naar vier of vijf elementen.
  Gecentreerd werkt voor een kort statement; het werkt niet voor kop, subregel, drie
  feiten, deadline, twee knoppen, Richard en vier logo's.
- **Mobiel links.** Dat is 89,6% van het verkeer (gemeten 29 oktober t/m 2 november).

Centreren dwingt dus tot schrappen, en dat is waarschijnlijk de reden dat Ward het
voorstelde.

## Het beeld

Ward: *"Ik kan een groot beeld per thema aanleveren. Even zien hoe het er nu uit ziet,
misschien is clean wel gewoon beter."*

**Volgorde: eerst clean bouwen, dan het beeld ernaast leggen.** Niet andersom, want dan
weet je niet wat het beeld toevoegt.

Wat er al is: `/media/d3/b3/de/1787736741/Cheers JPEG.jpg`, twee handen die proosten,
warm en donker, duidelijk eindejaar. **Maar het is 800 × 621 px.** Over een hero van
1800 px is dat 2,25 keer opschalen en dat is zichtbaar. Voor een nieuw themabeeld geldt:
minstens 2400 px breed, liggend, met rustige ruimte links of rechts waar tekst kan staan.

De witte producttegels op een donker sfeerbeeld is een goede combinatie, want de
packshots hebben een witte achtergrond en springen er dan uit in plaats van weg te
vallen.

## Besluit 6: de CSS nalopen

Gemeten op 5 november:

| | Nu | Opmerking |
|---|---:|---|
| `!important` | **1.607** | De audit telde er 992 in augustus |
| Losse hexkleuren buiten `:root` | 30 | |
| Losse `font-size`-declaraties | 314 | tegenover **1** type-token |
| Spacingschalen | 2 | 6 tegen 7 aanroepen |
| Tokens in `:root` | 23 | met 327 aanroepen, dus die kant werkt |

**De 1.607 keer `!important` is het duurste probleem en het staat in geen enkel plan.**
Op 4 en 5 november verloor nieuwe CSS drie keer van onze eigen oudere CSS: bij de
beeldverhouding (sectie 16 zet `height:0` en `padding-bottom:85%`), bij de goot van de
slider (`padding: 0 15px`), en bij de kleur van productnaam en prijs (sectie 10). Elke
nieuwe sectie moet terugvechten met nog meer `!important`, dus het probleem groeit per
ronde.

Volgorde van opruimen:
1. De slidersecties (16 en 10), want daar lopen we steeds tegenaan.
2. De twee spacingschalen terugbrengen tot `--rg-s2/s3/s4`.
3. Een typeschaal invoeren en de hero's erop zetten.
4. De 30 losse hexkleuren meenemen waar we toch zijn.

Niet in één keer. Per stap controleren wat er omvalt op pagina's buiten scope.

## De kickersweep

"Nergens meer een kicker" is groter dan het klinkt. Gemeten: **36 kickers in 22 van de
32 blokken**, en 21 CSS-selectors die ze opmaken.

| Waar | Aantal |
|---|---:|
| `service-detail-full-service.html` | 4 |
| `service-detail-personalisatie/-verzending/-warehousing` | 3 elk |
| `over-ons`, `thema-dag-van-de-leraar`, `thema-overzicht` | 2 elk |
| twaalf andere blokken | 1 elk |

**Elk gewijzigd blok moet Ward met de hand opnieuw in Shopware plakken.** Dat is de
echte kosten van dit besluit, niet het CSS-werk. Voorstel: doe de themapagina nu mee,
en de overige blokken in één aparte plakronde zodat het niet per blok hoeft.

## De merkgids moet mee

CLAUDE.md zegt dat `~/.claude/skills/rootedgoods/` de bron is en dat een
huisstijlwijziging daar landt. Twee dingen zijn nu achterhaald:

1. **"Hairline boven schaduw"** staat als principe in de gids en in de audit als
   besluit 5. Ward heeft dat afgewezen. Haal het eruit of markeer het als vervallen.
2. **`--rg-hair`** heeft dan weer nul gebruikers. Niet schrappen zonder dat de gids
   meebeweegt, zegt CLAUDE.md; nu beweegt de gids mee, dus het token kan weg.

## Vervolgpunten na de desktop- en mobielanalyse (5 november, middag)

Twee richtingen die Ward heeft goedgekeurd maar die aparte trajecten zijn en niet in
de bouwronde van de hero zitten. De onderbouwing staat in
`docs/hero-analyse-desktop-mobiel-2026-11-05.md`, deel 2 en deel 6; de ruwe metingen
in `docs/metingen/2026-11-05-hero-desktop-mobiel/`.

### A. De cookiebalk op mobiel

Gemeten in de replica van de testpagina, 5 november: de Shopware-cookiebalk is op
mobiel **244 px hoog** (drie gestapelde knoppen) en staat onderaan vast tot de bezoeker
kiest. Op 390 × 844 blijft 600 px over, op 375 × 667 blijft **423 px** over en staat de
knop van de hero erachter. Dat sluit aan op de nulmeting van 28 oktober
(`docs/metingen/nulmeting-cookiebanner-2026-10-28.md`, Clarity 1 t/m 27 oktober,
mobiel): op `/eindejaarsgeschenken` landden **129 van de 317 taps (40,7%)** op de
cookiecontainer, en nul op "Weigeren". De balk krijgt dus twee van de vijf eerste
aanrakingen op de duurste landingspagina.

Wat eraan te doen is, is een Shopware-instelling of een thema-aanpassing en hoort
daarom op de lijst in `docs/promidata-vragen.md`: de drie knoppen op één rij of de tekst
korter, naar schatting 100 px minder. Wat wij zelf kunnen (CSS op de balk) is in
oktober al eens gedaan en weer teruggedraaid (sectie 50, de center-modal); eerst
afstemmen voordat daar opnieuw aan gesleuteld wordt.

### B. Het klikformulier ("de uitnodiging")

Ward wil een knop die laagdrempeliger is dan een offerte, richting "laat je verrassen,
wij sturen voorstellen". Die knop heeft een bestemming nodig die er nog niet is:
`/offerte` heeft nu een tekstvak plus naam, e-mail en bedrijf (verplicht) en telefoon
(opgehaald 5 november). De tussenstap in de hero is het label "Vertel ons wat je zoekt"
naar `/offerte`, zodat `generate_lead` blijft werken.

Het echte klikformulier is blok 3 uit de paginastructuur hierboven en vraagt drie
besluiten die sinds 29 oktober openstaan (`docs/kerstpagina-herzien.md`): waar hij komt
(eigen pagina, extra veld op `/offerte`, of los formulier in het blok), een eigen
`form_id` zodat GA4 koop en uitdaging uit elkaar houdt, en wie zich committeert aan wat
de knop belooft (hoeveel voorstellen, binnen hoeveel werkdagen). Zolang dat niet vastligt,
geen getal in een knop.

## Wat er niet gemeten is

- De hoogte van de hero op 390 px. Alles van deze week is op 520 px gezien, want het
  browservenster laat zich niet breder instellen en de site weigert een iframe
  (`x-frame-options: deny`). Met 89,6% mobiel verkeer is dat precies het getal dat
  ontbreekt.
- Desktop vanaf 992 px is twee ronden lang blind ontworpen.
- De nieuwe copy is niet getest op de doelgroep, en er is geen klanttaal beschikbaar
  (Ward, 5 november: "klanttaal hebben we niet echt").
- Of een kop zonder de zoekterm "kerstgeschenk met logo" de advertentierelevantie raakt.
