# De kersthero op desktop en op 390 px, 5 november 2026

Kritische analyse van de vierde hero-opzet (`blokken-def/thema-eindejaarsgeschenken-band.html`,
CSS-sectie 53), apart voor desktop en voor mobiel. Geschreven vóórdat ik Wards eigen
observaties kreeg, zodat de twee blikken naast elkaar gelegd kunnen worden. Geen code,
geen wijzigingen aan bestaande bestanden.

## 0. Hoe ik gekeken heb, en wat dat waard is

**Desktop: echt gezien.** Wards schermafdruk `hero-desktop-1800px.png` (3840 × 2160
device-px, Arc). Het paginavlak daarin is 3476 device-px breed. Twee onafhankelijke maten
in die afbeelding, de knophoogte (84 device-px tegen 46,1 CSS-px uit de CSS: 0,9 rem
padding boven en onder plus 1,2 × 0,9 rem regel) en de regelafstand van de kop (107
device-px tegen 59,4 CSS-px: 56 px × 1,06), geven allebei 1,8 device-px per CSS-px. Dat is
een retina-scherm op 90% zoom. **De layout-viewport van die schermafdruk is dus circa
1931 × 1112 CSS-px, geen 1800.** Alle desktopmaten hieronder staan in CSS-px op die basis.

**Mobiel: nagebouwd, niet live gezien.** Het venster van de browser-extensie gaat niet
onder 520 px en de site weigert een iframe. Daarom:

1. De testpagina één keer opgehaald met `curl` (HTTP 200, 192.453 bytes, 5 november
   13.30 uur). Het heroblok dat daar al in staat is, genormaliseerd op witruimte,
   byte voor byte gelijk aan `blokken-def/thema-eindejaarsgeschenken-band.html`; Ward
   heeft het dus al geplakt. De slider toont dezelfde 9 pakketten als vanochtend.
2. Een lokale kopie gemaakt waarin de twee jsDelivr-links (`rootedgoods.min.css`,
   `rootedgoods.min.js`) vervangen zijn door de repo-bestanden, met een `<base>` naar
   rootedgoods.eu zodat thema-CSS, fonts en productbeelden gewoon van de site laden.
3. Die kopie één keer geladen in headless Chromium (Playwright-binary uit de cache,
   via het DevTools-protocol) en zonder herladen doorgemeten op 390 × 844, 375 × 667,
   360 × 780, 414 × 896, 520 × 953, 992 × 900, 1280 × 800, 1440 × 900, 1738 × 1001 en
   1931 × 1112. Posities via `getBoundingClientRect`, maten via `getComputedStyle`;
   `document.fonts.check` bevestigt dat Playfair 700 en Montserrat geladen waren.

Totaal verkeer naar rootedgoods.eu: één `curl` plus twee paginaladingen (de tweede
grotendeels uit de cache). Geen lussen.

**Validatie van de replica.** Op 1931 × 1112 zet de replica de kop op y 233 tot 352, de
knop op 468 tot 516 en de band op 619. Uit Wards schermafdruk, omgerekend: kop 240 tot
352, knop 464 tot 511, eerste tegeltoppen op 623. Alles binnen 7 px. De replica is dus
geen schatting van de live pagina maar een nauwkeurige weergave ervan, met één
voorbehoud: ik heb de site-CSS lokaal, niet de `.min` van jsDelivr, en dat is precies
de bedoeling, want de live `.min` is nog oud.

Ruwe uitvoer (JSON per viewport en PNG's) staat in
`/private/tmp/claude-501/-Users-wardhaarsma-Documents-Rooted-goods-rootedgoods-website/302525f1-e8a1-40ff-8804-7ec203a6d5e7/scratchpad/metingen/`.
Niet in `docs/metingen/`, omdat deze opdracht maar één nieuw bestand toestond; zie
deel 5.

**Niet gezien:** een echte telefoon, aanraking, Safari's adresbalk, de `.min`-bestanden,
`prefers-reduced-motion`.

## 1. Wat er staat: desktop (1931 × 1112, 90% zoom)

Gemeten in de replica, bevestigd door de schermafdruk.

| # | Element | Maat | Positie (y, CSS-px vanaf de bovenkant van het venster) |
|---|---|---|---|
| | Topbalk plus header plus navigatie (sticky) | 96 + 45 = 141 px hoog | 0 tot 141 |
| | Lege crème tussen header en kop | **92 px** | 141 tot 233 |
| 1 | H1 "Kerstpakketten met jouw / logo, van Europese makers" | Playfair 700, **56 px**, regelafstand 59,4 px, tracking -1,18 px, bosgroen `#2d4528`, `max-width` 24ch = 867 px, 2 regels van 613 en 654 px breed | 233 tot 352 |
| 2 | Feitenregel, 2 items op één rij | Montserrat **20,8 px**, regelafstand 31,2, zachtgroen `#5d6d55`, `strong` 700 in inkt `#2c2a26`; items 491 en 151 px breed met 24 px ertussen, rij 666 px | 368 tot 399 |
| 3 | Kerstvraag, 1 regel | **18,4 px**, regelafstand 28,5, zelfde kleurpaar, 560 px breed | 414 tot 442 |
| 4 | Knop "Vraag een offerte aan" | **253 × 48 px**, tekst 14,4 px Montserrat 700 wit, padding 14,4 × 32 px, cognac `#ad6331`, pil, pijl uit de CSS | 468 tot 516 |
| 5 | Vier klantlogo's | elk **35 px** hoog, 85 / 63 / 75 / 87 px breed, grijs gemaakt, opacity 0,65, rij 418 px, geen label | 552 tot 587 |
| | Hero totaal | 442 px hoog, padding 56 boven, 32 onder, gecentreerd, tekst max 1024 px | 177 tot 619 |
| 6 | Band | 370 px hoog (8 px boven, 28 onder voor de schaduw); tegels **232 × 300 px**, gap 20 px, versprong 26 / 8 / 34 / 0 px; circa 7,7 tegels in beeld; 252 px per 5,2 s = **48 px/s**, één lus van 9 tegels in 46,8 s; pauze bij hover | 619 tot 989 |
| | Tegeltekst | naam **11,2 px** Montserrat 600 kapitaal, tracking 0,9 px, cognac; prijs "Van € 32,00" 14,7 px 600 inkt | |
| 7 | Link "Alle kerstpakketten" | 15,2 px 600 cognac, onderstreept, **links op x = 213** terwijl de hero rond x = 965 centreert | 993 tot 1030 |
| | Volgende sectie ("Een bedankje dat het hele jaar samenvat") | | vanaf 1068, kop op 1132 |

**Vormverhouding van de gecentreerde stapel**, van boven naar beneden: 867 (kop) → 666
(feiten) → 560 (vraag) → 253 (knop) → 418 (logo's). Een omgekeerde driehoek die onder de
knop weer uitwaaiert.

**Typografische trap:** 56 → 20,8 → 18,4 → 14,4 (knop) → 14,7 (prijs) → 11,2 (tegelnaam).
Kop tegen feiten 2,7 : 1; feiten tegen vraag 1,13 : 1; kop tegen tegelnaam 5 : 1.

**Wat er op kleinere desktops gebeurt** (replica, zelfde CSS):

| Viewport | Band begint op | Band zichtbaar boven de vouw | Link onder de band |
|---|---:|---:|---|
| 1280 × 800 (gangbare laptop) | 604 | **196 van 370 px**; de tegels van 300 px worden halverwege het beeld afgesneden | onder de vouw (978) |
| 1440 × 900 | 612 | 288 px; namen en prijzen net wel of net niet | onder de vouw (986) |
| 1738 × 1001 (Wards scherm op 100%) | 619 | 370 px, compleet | net onder de vouw (993) |
| 1931 × 1112 (Wards schermafdruk, 90%) | 619 | 370 px, compleet | in beeld |

Ward kijkt dus naar het gunstigste geval. Op een laptop van 1280 of 1440 breed is de band
een rij halve tegels onder een hero van 428 tot 436 px plus 141 px header. Daar komt
bij een eerste bezoek de cookiebalk van Shopware nog overheen: 66 px onderaan.

## 2. Wat er staat: mobiel (390 × 844, links uitgelijnd)

De maten zijn op 375 en 360 px identiek op de kolombreedte na (335 en 320 px); geen
enkele regel breekt daar anders.

| # | Element | Maat | Positie (y) |
|---|---|---|---|
| | Topbalk plus vaste header | 30 + 66 = 97 px | 0 tot 97 |
| | Lege crème tussen header en kop | **57 px** (41 px sectie-ruimte plus 16 px padding) | 97 tot 154 |
| 1 | H1, **3 regels**: "Kerstpakketten" / "met jouw logo, van" / "Europese makers" | **32 px** (de ondergrens van de clamp; de formule 1,05 rem + 3 vw geeft 28,5 en wordt afgekapt tot ongeveer 507 px breed), regelafstand 33,9, regels circa 214 / 259 / 244 px breed in een kolom van 350 | 154 tot 256 (102 px) |
| 2 | Feitenregel, **3 regels**: "Voorbeelden tussen € 25 en € 70 per" / "persoon" / "Vanaf 10 stuks" | **16,3 px**, regelafstand 24,5 | 268 tot 344 (76 px) |
| 3 | Kerstvraag, 2 regels: "Nog op tijd voor kerst? Je weet het" / "binnen één werkdag." | **16,2 px**, regelafstand 25,1 | 356 tot 406 (50 px) |
| 4 | Knop | 253 × 48 px, tekst 14,4 px, 72% van de kolom | 423 tot 471 |
| 5 | Drie logo's (het vierde verbergt sectie 36 onder 992 px) | **22 px** hoog, 54 / 40 / 47 px breed, rij 180 px | 491 tot 513 |
| | Hero totaal | **393 px**, padding 16 boven, 17,6 onder, 20 opzij | 138 tot 531 |
| 6 | Band | 306 px; tegels **168 × 236 px**, gap 12, inzet 20; **2,2 tegels in beeld**; 180 px per 5,2 s = **35 px/s**; geen pauze bij aanraken, alleen tijdens slepen | 531 tot 837 |
| 7 | Link "Alle kerstpakketten" | 15,2 px cognac, links | 841 tot 878 |
| | Volgende sectie | | vanaf 916, kop op 968 |

**Leesbaarheid van de logo's, gemeten in de pixels van de replica:** het woordmerk
"Zuiderzorg" is op 22 px logohoogte **7 px hoog** en de onderregel eronder **1,5 px**.
De handtekening van Erasmus MC beslaat de volle 22 px en is als handschrift niet te
lezen. Op desktop (35 px) is het woordmerk circa 11 px en de onderregel 2,4 px.

**Typografische trap op mobiel:** 32 → 16,3 → 16,2 → 14,4 → 14,7 → 11,2. Kop tegen
feiten 1,96 : 1; feiten tegen vraag **1,01 : 1**. Er zijn feitelijk twee niveaus: de kop en
de rest.

**Verdeling van het eerste scherm (390 × 844):** header 11%, hero 47%, band 36%, link
en rest 6%. Op 375 × 667 (iPhone SE, en ongeveer wat een iPhone 12 tot 15 in Safari met
adres- en knoppenbalk overhoudt): header 15%, hero 59%, band **136 van 306 px**, dat is
20% van het scherm en de bovenste helft van de productbeelden; naam en prijs vallen
eraf.

**De cookiebalk.** De Shopware-cookiebalk van de site is op mobiel **244 px hoog** (drie
gestapelde knoppen) en staat onderaan vast tot de bezoeker kiest. Gemeten in de
replica:

| Viewport | Zichtbaar boven de balk | Wat de bezoeker dan ziet |
|---|---:|---|
| 390 × 844 | 600 px | kop, feiten, vraag, knop, logo's en **69 px** tegeltoppen van de band |
| 375 × 667 | 423 px | kop, feiten, vraag. **De knop (423 tot 471) staat achter de balk**, de band is onzichtbaar |

Voor een iPhone 12 tot 15 in Safari (viewport circa 390 × 660, niet gemeten, uit de
publieke toestelmaten) valt de balk op circa y = 416 en ligt de knop er dus ook achter.
Dit is wat de helft van de 300 betaalde klikken (227 uit "Kerstpakket met logo",
6 t/m 27 oktober, `docs/kerstpagina-herzien.md`) als eerste ziet: een kop, twee
regels feiten, een vraag, en een cookiebalk.

## 3. Oordeel

Eerst wat goed is, want dat is niet weinig. Vijf elementen in plaats van tien, en op
520 px is de hero van 505 naar 311 px gegaan (band-test 5 november tegen deze meting).
De kop bevat de zoekterm en het onderscheid. Er is geen kicker, geen lijntje, geen
tweede knop, geen Richard. De band loopt technisch goed en van rand tot rand. Op een
groot scherm op 90% zoom is dit een rustige, geloofwaardige pagina. Dat is ook het
probleem: **het is ontworpen op het ene scherm waar het werkt.**

### 3.1 Hiërarchie: drie keer hetzelfde patroon op dezelfde maat

Feitenregel en kerstvraag zijn allebei "vet in inkt, dan zacht groen", allebei
Montserrat, op mobiel 16,3 en 16,2 px, op desktop 20,8 en 18,4 px. Het oog ziet dus na de
kop drie regels in hetzelfde kostuum: *Voorbeelden tussen…*, *Vanaf 10…*, *Nog op tijd
voor kerst?…* Dat leest als één lijstje van drie, en in een lijstje van drie wint
niemand. De feitenregel, die in het plan "het tweede element op leesmaat" moest worden,
is op mobiel 16,3 px: een halve punt groter dan de bodytekst van de site (16 tot 17 px).
Het beloofde contrast is er niet gekomen.

De kerstvraag is bovendien geen feit maar knopcopy: hij beantwoordt de aarzeling vlak
voor het klikken ("haal ik het nog"). Boven de knop concurreert hij met de feiten;
onder de knop zou hij het werk doen waar de merkgids de reassurance-regel voor heeft
("Persoonlijk antwoord binnen één werkdag", small, 0,85 rem).

### 3.2 Het luidste woord na de kop is een disclaimer

Op desktop staat "Voorbeelden tussen € 25 en € 70" in 20,8 px vet, en het eerste en
zwaarste woord van die regel is **Voorbeelden**. Dat woord staat er om `claims.md` te
respecteren (geen bedrijfsbrede vanaf-prijs) en dat is terecht, maar typografisch heeft
de slag om de arm nu de grootste letter na de kop. Een inkoper leest "voorbeelden"
en denkt: dus niet echt. Het voorbehoud moet blijven; het hoort alleen niet voorop en
niet vet.

Op mobiel komt daar een lelijke afbreking bij: "…€ 70 per" op regel één en "persoon"
alleen op regel twee, gevolgd door "Vanaf 10 stuks" op regel drie. Drie regels voor
twee feiten, met een weeskind in het midden. Dat gebeurt op 390, 375 en 360 identiek.

### 3.3 De kop: juist, en vlak

"Kerstpakketten met jouw logo, van Europese makers" haalt de specificiteitstest net:
Greengiving en Monday Merch kunnen "van Europese makers" niet schrijven. Hij bevat de
zoekterm. Maar het is een beschrijving, geen zin met spanning: categorie plus twee
bepalingen, zonder werkwoord en zonder de wending die de merkgids als kop-idioom noemt
("feit, dan wending"). De vorige analyse noemde deze variant zelf "minder eigen" en
"sluitend"; sluitend is hij. Het karakter moet dan ergens anders vandaan komen, en op
dit moment komt het nergens vandaan: de feitenregel is een lijstje, de vraag is
afgekapt ("Je weet het binnen één werkdag" mist het verzoek én de eerlijkheidsbeat die
de vorige versie had: "wat kan en wat niet").

De regelafbrekingen volgen de betekenis niet. Desktop: "Kerstpakketten met jouw /
logo, van Europese makers", het sleutelbegrip *jouw logo* breekt over twee regels.
Mobiel: "Kerstpakketten / met jouw logo, van / Europese makers", regel twee eindigt
op een los voorzetsel. `text-wrap: balance` kiest gelijke regellengtes, niet
betekeniseenheden; daar moet de copy zelf voor zorgen.

### 3.4 De knop is de standaardknop, niet de heroknop

De knop meet 253 × 48 px met tekst van 14,4 px (0,9 rem uit sectie 8, met `!important`).
De merkgids (`design/componenten.md`) kent voor hero's een grotere maat: 1,02 rem tekst,
padding 1,05 × 2,4 rem, dat is ongeveer 300 × 56 px. Onder een kop van 56 px en een
feitenregel van 20,8 px is 14,4 px knoptekst de kleinste letter van de hero, op de
tegelnamen na. Op mobiel, waar de kop 32 px is, klopt de verhouding wel.

Op de plek van de knop is op mobiel niets mis: links, 72% van de kolom, goed
bereikbaar. Het probleem is wat erboven staat (§3.6).

### 3.5 Cognac verliest zijn betekenis

"Cognac betekent hier kun je klikken" (`brand/visual.md`). Op het desktop-eerste scherm
staan nu in cognac: de knop, circa acht tegelnamen van 11,2 px en de link onder de band.
Tien cognac-elementen rond één knop. De tegels zijn klikbaar, dus het mag, maar de
secundaire link is volgens de merkgids juist bosgroen met cognac op hover, en dat is
hier omgedraaid. Daarbij: cognac op crème haalt **4,19 : 1** (berekend in code, WCAG
2.x), onder de 4,5 die tekst van 15,2 px nodig heeft. Cognac op het wit van de tegels
haalt 4,56, nipt voldoende voor 11,2 px kapitalen.

### 3.6 Hero tegen band: de band is het beeld, en op een telefoon is hij een reepje

Het plan van 5 november zegt het zelf: geen themabeeld, "de productband ís het beeld".
Op het scherm van negen op de tien bezoekers staat dat beeld op y = 531, onder 393 px
hero en 138 px header en lege ruimte. Op een viewport van 667 (SE, en Safari op grotere
iPhones) is daar 136 px van over, de bovenhelft van twee producten zonder naam of prijs.
Met de cookiebalk ervoor is er bij het eerste bezoek niets van over, en op 375 × 667
staat zelfs de knop achter de balk.

De 393 px hero bestaat uit 102 px kop, 76 px feiten, 50 px vraag, 48 px knop, 22 px
logo's en 95 px marges en padding, plus 41 px sectie-ruimte boven de hero die niet van
de hero zelf is. Van die 393 doen de kop, de feiten en de knop het werk: 226 px. De rest,
167 px, is kerstvraag, logo's en lucht. Dat is ongeveer het verschil tussen een band
die wel en niet boven de vouw begint.

Op desktop is hetzelfde aan de hand in mildere vorm: 92 px lege crème tussen header en
kop, een hero van 442 px, en op een laptop van 1280 × 800 een band die halverwege het
productbeeld wordt afgesneden.

### 3.7 De logo's bewijzen niets op deze maat

Op 22 px is het woordmerk Zuiderzorg 7 px hoog en de onderregel 1,5 px. De
Erasmus-handtekening is onleesbaar. Zonder label ("Eerder voor") en met opacity 0,65
is het een grijs strookje tussen de knop en de band dat 42 px kost (22 plus 20 marge)
en op mobiel geen enkele naam overbrengt. Op desktop zijn ze leesbaar, maar daar is de
rij (418 px) breder dan de knop (253 px) en trekt hij het oog onder de knop door. Ward
wil ze houden; dan horen ze op een plek waar ze leesbaar zijn, en dat is niet 22 px
boven een bewegende band.

### 3.8 De band zelf

Technisch in orde: alleen `transform`, pauze bij hover en focus, klonen `aria-hidden`.
Drie dingen:

- **De versprong (26 / 8 / 34 / 0 px) werkt op desktop met acht tegels in beeld en niet
  op mobiel met 2,2.** Met twee tegels zie je geen ritme, je ziet één tegel die 18 px
  lager hangt dan zijn buurman.
- **"Van € 32,00" tegen "€ 25 tot € 70 per persoon"** zijn twee eenheden voor hetzelfde
  getal, 200 px uit elkaar. "Van" is de Shopware-prefix en de band-JS herschrijft de
  tegels toch al.
- **Vier van de negen tegels zijn een borrelplank** en de twee uiteinden van de
  prijsbelofte (Bak pakket € 25, Offline pakket € 70) ontbreken. Dat stond al in het
  plan en in de vorige analyse en is op de live testpagina van 13.30 uur nog zo.

### 3.9 Wat er wel klopt

Bosgroen op crème 9,68 : 1, zachtgroen 5,10, inkt 13,16, wit op cognac 4,56: alle
hoofdtekst haalt AA (berekend in code). De `.min`-waarschuwing uit `CLAUDE.md` is
nageleefd: niets van dit alles staat al op jsDelivr. De hero is zonder beeld niet
leeg; dat was de gok van besluit "geen themabeeld" en op desktop is hij gewonnen. Links
op mobiel, gecentreerd op desktop is de juiste keuze en is correct uitgevoerd.

## 4. Advies, in volgorde van opbrengst

Alle hoogtewinsten zijn **schattingen uit de gemeten hoogtes van de losse elementen**,
geen metingen van een nieuwe hero. Die bestaat nog niet.

### 1. Mobiel: haal de band boven de vouw (opbrengst circa 130 tot 140 px)

| Ingreep | Winst op 390 px | Basis |
|---|---:|---|
| Kerstvraag van boven de knop naar één regel van 0,85 rem eronder | circa 39 px | 50 px vraag + 11 px marge weg, circa 22 px reassurance-regel erbij |
| Logo's op mobiel verbergen (of onder de band met label, zie punt 5) | 42 px | 22 px rij + 20 px marge |
| Sectie-ruimte boven de hero van 41 naar 8 px | 33 px | gemeten 97 → 138 |
| Feitenregel herschrijven zodat hij in twee regels past | circa 24 px | nu 3 regels van 24,5 |
| **Samen** | **circa 138 px** | band van y = 531 naar circa 393 |

Op 375 × 667 wordt de band dan circa 274 px zichtbaar in plaats van 136: één volle rij
tegels met naam en prijs. Op een Safari-viewport van circa 660 met cookiebalk (balk
vanaf circa 416) komt de knop op circa 385 en staat hij weer boven de balk. Beide
getallen zijn afgeleid, niet gemeten.

### 2. De typografische trap: drie niveaus in plaats van twee

Doel op mobiel: kop 32 / feiten 20 tot 21 / alles daaronder 14 tot 15. Doel op desktop:
56 / 24 / 15. Dus de feitenregel op mobiel naar circa 1,3 rem (de desktopwaarde die er nu
al staat), de getallen in inkt en vet zoals nu, en de kerstvraag naar small. Dan is de
feitenregel wat het plan beloofde: het tweede element, en herkenbaar anders dan de regel
eronder.

### 3. Copy, uitgeschreven

**Feitenregel.** Het voorbehoud blijft, maar achteraan en zacht, zodat de getallen
voorop staan en de regel in twee regels past op 350 px:

> **€ 25 tot € 70 per persoon**, **vanaf 10 stuks**, voor de pakketten hieronder.

"Voor de pakketten hieronder" doet hetzelfde werk als "Voorbeelden": het bindt prijs en
afname aan wat je ziet, niet aan het bedrijf, dus `claims.md` en de FAQ ("geen vaste
minimale afname") spreken elkaar niet tegen. Het is geen eindige lijst ("deze elf"),
want de band wisselt. Afbreking op 390 px, geschat: "€ 25 tot € 70 per persoon, vanaf
10 stuks," / "voor de pakketten hieronder."

**Reassurance onder de knop**, small, zachtgroen, één regel op desktop en twee op
mobiel:

> Nog op tijd voor kerst? Vraag het vandaag, binnen één werkdag weet je wat kan.

Hiermee komt het verzoek terug ("vraag het vandaag"), de siteformulering blijft ("binnen
één werkdag", 33 treffers in 22 blokken), en de regel staat waar hij hoort: naast de
daad die hij aanmoedigt. "En wat niet" mag erbij als Ward de eerlijkheidsbeat wil
("weet je wat kan en wat niet"); het kost op mobiel een derde regel.

**Kop.** Twee opties.

*Optie A, houden en de afbreking repareren.* Zelfde zin, met harde spaties zodat de
betekeniseenheden heel blijven: `jouw&nbsp;logo` en `Europese&nbsp;makers`. Verwachte
afbreking (geschat uit de regelbreedtes): desktop "Kerstpakketten met jouw logo, / van
Europese makers" (regel één circa 812 px, past in de 867 px), mobiel "Kerstpakketten met
/ jouw logo, van / Europese makers" of de huidige. Geen nieuwe woorden, geen risico voor
de advertentierelevantie.

*Optie B, de wending erin.* Het kop-idioom van de site, zonder accentwoord (besluit:
geen tic):

> **Kerstpakketten met jouw logo**
> **Van makers die je kunt bellen**

Tweede regel is de ijkzin van over-ons ("werkplaatsen die je kunt bellen, bezoeken en
bij naam kunt noemen") en past op geen enkele concurrent. Twee regels op desktop, vier
op mobiel (29 + 29 tekens), dus alleen te combineren met punt 1. De zoekterm staat in
regel één. Waar hij op gokt: "bellen" kan een inkoper lezen als "ik moet zelf bellen".
Als dat zwaar weegt, dan:

> **Kerstpakketten met jouw logo**
> **Van makers die we bij naam kennen**

Dat was het voorstel in het blokcommentaar van vanochtend, voordat het ingekort werd.

### 4. Desktop: de knop en de lucht

- De heroknopmaat uit de merkgids (1,02 rem, padding 1,05 × 2,4 rem): van 253 × 48 naar
  circa 300 × 56 px. Dan is de knop niet meer de kleinste letter van de hero.
- De 92 px lege crème tussen header en kop terug naar circa 48 px (hero-padding van
  56 naar 32 en de sectie-ruimte eraf). Met de kleinere kerstvraag levert dat op 1440 ×
  900 ongeveer 70 px extra band, en op 1280 × 800 komen namen en prijzen van de bovenste
  tegels net in beeld. Schatting.

### 5. Logo's: leesbaar of weg

Op mobiel verbergen (sectie 36 doet al het vierde, dit is dezelfde regel voor alle
vier). Op desktop onder de band, één regel ervoor: "Eerder voor", in small. Dan is het
sociaal bewijs met een onderschrift en staat het niet tussen knop en band. Pas als de
toestemmingsvraag uit `OPEN-VRAGEN.md` beantwoord is; tot die tijd is het ook een
risico.

### 6. Cognac terug naar actie

- Link "Alle kerstpakketten" in bosgroen met cognac op hover, zoals de secundaire link
  overal op de site; dat lost ook het contrast op (bosgroen 9,68 tegen cognac 4,19).
- Op desktop de link centreren onder de gecentreerde hero, of hem op de tekstlijn van de
  eerste tegel zetten. Nu is hij het enige element op x = 213 in een compositie rond
  x = 965.
- Tegelnamen in zachtgroen of inkt; de tegel is klikbaar door zijn vorm en schaduw, niet
  door de kleur van 11,2 px kapitalen.

### 7. De band: drie kleine dingen

- Versprong onder 992 px uit (alle tegels op één lijn), op desktop houden.
- "Van € 32,00" in de band-JS herschrijven naar "€ 32 per persoon", zodat band en
  feitenregel dezelfde eenheid spreken.
- Bak pakket en Offline pakket in de slider zetten en twee van de vier borrelplanken
  eruit (in de editor, Ward). Dit is het enige punt dat geen code kost en wel het verschil
  maakt tussen een band die "25 tot 70" laat zien en een band die vier keer kaas toont.

### 8. De cookiebalk, voor Promidata

244 px op mobiel met drie gestapelde knoppen is een derde van het scherm. Eén rij van
twee knoppen of een compactere tekst scheelt naar schatting 100 px, en dat is bij elk
eerste bezoek. Dit is een Shopware-instelling of een thema-aanpassing en hoort dus op de
lijst in `docs/promidata-vragen.md`, met deze meting erbij.

### Volgorde

1 en 3 eerst (mobiel en copy, één plakronde). Dan 2 en 4 (CSS, geen plakken). Dan 6 en
7 (CSS en JS, geen plakken, behalve de sliderselectie in de editor). 5 pas na de
toestemmingsvraag. 8 gaat de mail in.

## 5. Beperkingen

- **Mobiel is een replica, geen telefoon.** De lokale kopie laadt thema-CSS, fonts en
  beelden van de live site en de repo-CSS en -JS van schijf, en komt op 1931 px binnen
  7 px overeen met Wards schermafdruk. Maar: geen aanraking, geen Safari-adresbalk, geen
  echt toestel. De Safari-viewport van "circa 660 px" is een aanname uit publieke
  toestelmaten, geen meting.
- **Wards schermafdruk is op 90% zoom**; dat is afgeleid uit twee maten (knophoogte en
  regelafstand) die allebei 1,8 device-px per CSS-px geven. Als Arc toch op 100% stond,
  dan is de viewport 1738 px breed en kloppen de desktopmaten nog steeds, want de replica
  op 1738 geeft dezelfde posities op de breedte na.
- **De `.min`-bestanden zijn niet beoordeeld.** Die maakt jsDelivr, en op 5 november om
  13.30 uur dienen ze nog de oude CSS: de live testpagina toont het nieuwe blok met de oude
  stijl. Wat hier staat is de bedoelde weergave.
- **Alle hoogtewinsten in deel 4 zijn schattingen** uit gemeten elementhoogtes. De
  regelafbrekingen van de nieuwe copy zijn geschat uit de huidige regelbreedtes, niet
  gerenderd.
- **Contrast is berekend met de WCAG 2.x-formule** op de tokenkleuren, niet gemeten op
  gerenderde pixels met antialiasing.
- **De ruwe meetgegevens staan in de scratchpad**, niet in `docs/metingen/`, omdat deze
  opdracht maar één nieuw bestand toestond. Regel 7 van `CLAUDE.md` wil ze wel in de
  repo: kopieer `metingen/` uit de scratchpad naar
  `docs/metingen/2026-11-05-hero-desktop-mobiel/` voordat de scratchpad verdwijnt.
- **Geen doelgroeptest, geen klanttaal, geen meting van de advertentierelevantie** van
  een gewijzigde kop. Dat was in de vorige analyse zo en is niet veranderd.
- **De vorige analyseronde (`docs/hero-analyse-2026-11-05.md`) heb ik gelezen** en een
  deel van haar punten komt hier terug (tweede knop, Richard, prijs-eenheid,
  sliderselectie). Waar ik het anders zie staat het erbij: de logo's horen niet in de
  hero op mobiel, en de kop is sluitend maar vlak.

*Aanvulling na oplevering: de ruwe metingen staan inmiddels wél in
`docs/metingen/2026-11-05-hero-desktop-mobiel/`, met een `notities.md`. De verwijzing
naar de scratchpad hierboven is daarmee achterhaald.*

## 6. Wards punten getoetst

Ward schreef zes observaties bij de desktopversie, zonder de delen 1 tot en met 5 te
kennen. Hieronder per punt: eens, oneens, of klopt maar anders oplossen, met de meting
erbij. Voor punt 4 en 6 heb ik extra gemeten: kopvarianten in de replica
(`titelvarianten.json`, `gewichtvarianten.json` en de `variant-*.png` in de meetmap) en
het echte formulier op `/offerte` (één curl).

Eén bevestiging vooraf die niet van Ward komt maar van de coördinator: de cookiebalk uit
§2 staat niet op zichzelf. In `docs/metingen/nulmeting-cookiebanner-2026-10-28.md`
landden op `/eindejaarsgeschenken` **129 van de 317 taps (40,7%)** op de cookiecontainer
(Clarity, 1 t/m 27 oktober, mobiel). De 244 px van nu en die 40,7% van toen verklaren
elkaar.

### Punt 1. "Tekst lijkt zwart?"

**Eens dat het zo oogt, oneens dat het erg is, en de oplossing zit in punt 4.**

Gemeten: `getComputedStyle` geeft op elke viewport `rgb(45, 69, 40)` en gewicht **700**,
niet 800. Sectie 36 zet 800, maar 41.1 overschrijft dat met `!important` naar 700; het
is dus niet de 800 die het zwart maakt. Wat het wel doet: Playfair 700 op 56 px heeft
dikke stammen, en een donker groen (contrast 9,68 : 1 op crème) leest op die massa als
neutraal donker. Dat is geen fout; de kop hoort het donkerste element van het scherm te
zijn, en lichter maken (groen zacht, 6,80 : 1) kost hiërarchie.

Wat de kleur wél zichtbaar maakt is minder gewicht, niet een andere kleur. In de
variantmeting met basisgewicht 400 (`variant-w400_accent_Europese_makers-1931.png`)
leest dezelfde `#2d4528` meteen als groen, omdat de dunne stammen de crème eromheen laten
meedoen. Dat is precies wat Ward bij punt 4 voorstelt. Niets aan de kleur doen.

### Punt 2. "Alle kerstpakketten als secundaire knop naast de offerteknop"

**Oneens.** Vier redenen, in volgorde van gewicht.

1. **Op mobiel stapelen knoppen.** Een tweede knop onder de eerste kost 48 px plus 12 px
   afstand, dus circa 60 px. De band begint dan rond y = 591 in plaats van 531; op een
   viewport van 667 blijft er 76 px van over in plaats van 136. Dat is het omgekeerde van
   wat deel 4, punt 1 probeert te bereiken. Op desktop naast elkaar kost het geen hoogte,
   maar negen op de tien bezoekers zitten niet op desktop.
2. **De knop stuurt weg vóór het beeld.** Het plan van 5 november zegt: eerst overtuigen
   met beeld, dan de vraag uitlokken. De band ís de inspiratie en staat 100 px onder de
   knop. Een "Alle kerstpakketten" bóven de band zegt: het echte aanbod staat ergens
   anders. Onder de band, als je de negen hebt gezien, is het een logische volgende stap.
3. **Het is al besloten.** Op 29 oktober "één hoofdknop", op 5 november opnieuw. De
   tweede knop kwam er op 5 november tussendoor terug zonder besluit en is bewust
   verwijderd. Twee gelijkwaardige knoppen laten mensen stilstaan; dat argument is niet
   veranderd.
4. **De merkgids kent geen tweede knop.** De secundaire actie is een kale tekstlink met
   pijl in bosgroen (`design/componenten.md`), juist zodat alleen de cognac pil als knop
   leest.

Wat ik wél wil veranderen aan die link, en dat is iets anders dan Ward voorstelt: hij
staat op desktop op x = 213 onder een hero die rond x = 965 centreert (gemeten op 1931),
en hij is cognac op crème (4,19 : 1, onder AA). Dus: onder de band laten, bosgroen met
cognac op hover, en vanaf 992 px centreren. Als Ward hem per se naast de knop wil, dan
alleen vanaf 992 px, als tekstlink en niet als pil, en dan vervalt de link onder de band,
anders staat hij twee keer.

### Punt 3. "Feitenregel en kerstvraag als pills of een ander UI-element"

**Zelfde diagnose, andere oplossing. Pills niet.**

Eerst wat ervoor pleit: chips bestaan in de merkgids ("pil, zandrand, crème of wit vlak,
Montserrat 600 small, alleen met echte feiten", `design/componenten.md`), en Ward heeft
gelijk dat de drie regels nu te veel op elkaar lijken: 16,3 / 16,3 / 16,2 px op mobiel,
20,8 / 20,8 / 18,4 op desktop, allemaal vet-dan-zacht. Een andere **vorm** helpt meer dan
alleen een andere maat; daar ben ik het mee eens.

Waarom pills de verkeerde vorm zijn:

- **Een pill maakt de feiten kleiner.** Chips zijn small (0,85 rem). De diagnose in §3.1
  is dat de feiten te klein en te weinig onderscheiden zijn; pills lossen de gelijkenis op
  door de feiten te degraderen, ik wil ze juist promoveren. Het beloofde "tweede element
  op leesmaat" wordt dan een badge.
- **Pills onder een gecentreerde serifkop zijn het Framer-sjabloon.** `niet-meer.md`
  punt 19 noemt de SaaS-startuptaal; de referentiemap van Ward bevat precies die hero. De
  merkgids zegt dat palet en serif al in het "tasteful default"-register zitten; een rij
  badges maakt dat erger, niet beter.
- **De kerstvraag past niet in een pill.** Het is een zin met een vraag en een belofte.
  Pills lossen dus hooguit de feitenregel op en laten de vraag staan waar hij nu staat.
- **Op mobiel levert het niets op.** Twee pills van circa 220 en 130 px passen niet naast
  elkaar in 350 px; ze stapelen en kosten dezelfde twee regels als nu.

Mijn voorstel blijft drie vormen in plaats van drie maten: de serifkop; één feitenregel
in Montserrat op 1,3 rem (20,8 px, ook op mobiel) met de getallen in 700 inkt en de rest
in 400 zachtgroen, zonder lijst, zonder vlak; en de kerstvraag als small
reassurance-regel onder de knop. Dan is elk van de drie herkenbaar iets anders, en het
kost geen enkel nieuw UI-element.

### Punt 4. "Titel groter, en diktes afwisselen voor accent"

**Eens, met twee precieze maten en één waarschuwing over de bestaande `em`-regel.**

Gemeten in de replica (`titelvarianten.json`, `gewichtvarianten.json`):

| Variant | 390 px | 1280 px | 1931 px |
|---|---|---|---|
| Nu (sectie 53) | 32 px, 3 regels, kop 102 px, band op 531 | 55,2 px, 2 regels | 56 px, 2 regels, kop 119 px, band op 619 |
| Basismaat van 41.1 (`clamp(2.6rem, 1.2rem + 3.6vw, 4.4rem)`) | 41,6 px, 3 regels, kop 132 px, band op **561** | 65,3 px, 2 regels | 70,4 px, 2 regels, kop 149 px, band op 649 |
| 36 / 64 px (`clamp(2.25rem, 1.1rem + 3.4vw, 4rem)`) | 36 px, 3 regels, kop 115 px, band op **544** | 61,1 px, 2 regels | 64 px, 2 regels, kop 136 px, band op 636 |

Dus: groter kost op desktop geen regel, tot en met 70,4 px blijft het twee regels, ook op
1280. Het argument in het CSS-commentaar van sectie 53 ("bij 15ch wordt dit vijf regels")
ging over de 15ch-begrenzing van sectie 36, niet over de maat; met 24ch past de basismaat
gewoon. Op mobiel kost de basismaat 30 px hoogte, 36 px kost er 13. **Mijn maat: 36 px
mobiel, 64 px desktop.** Mobiel niet verder, want elke pixel boven de band is daar duur
(§3.6); de 13 px worden ruimschoots terugverdiend door deel 4, punt 1.

Over het gewicht. Wards referentie (de Claude-advertentie) doet het met een lichte serif
en één woord in vet, dezelfde kleur. Dat is iets anders dan de bestaande accentregel van
41.1 (`.rg-page-hero__title em`: cursief door `skewX`, gewicht 600, cognac-licht). Twee
gemeten bezwaren tegen die bestaande regel in deze kop:

- **De `em` is `display: inline-block`** (nodig voor de skew). Daardoor ontstaat een
  afbreekpunt tussen het accent en de komma erna. Gemeten op 1280 en 1931: regel twee
  begint met ", van Europese makers" (`variant-nu_em_accent_41_1-1931.png`). Met een
  `<strong>` (gewoon inline) blijft de komma aan "logo" hangen.
- **Cognac-licht op crème haalt 2,78 : 1**, onder de 3 : 1 die zelfs grote tekst nodig
  heeft. Een gewichtsaccent in bosgroen houdt 9,68 : 1.

Gewichtscontrast binnen het groen dus, zoals de advertentie, niet kleur plus cursief.
Playfair is met de rechte gewichten 400 tot 900 zelf gehost, dus het kan zonder nieuw
font. Gemeten: basisgewicht 400 of 500 met de woordgroep in 700 verandert niets aan het
aantal regels of de afbreking (de lichtere letter is smaller, maar de regels blijven
gelijk). Op 32 tot 36 px op een telefoon worden de haarlijnen van Playfair 400 ongeveer
1 px (`variant-w400_accent_Europese_makers-390.png`): leesbaar op een retina-scherm, maar
dun. **Voorstel: 500 als basis, 700 voor het accent.** Wil Ward het echte
advertentiegevoel, dan 400 alleen vanaf 992 px.

**Welk woord.** Niet "jouw logo": dat is de zoekterm, de bezoeker heeft hem net zelf
ingetypt en de advertentie heeft hem al beloofd. Het nieuwe in de zin, het deel dat op
geen concurrent past, is **"Europese makers"**. Het staat bovendien aan het eind, dus er
is geen komma die kan losraken, en met `Europese&nbsp;makers` blijft het één eenheid.
Gemeten afbreking met die harde spaties: desktop "Kerstpakketten met jouw logo, / van
**Europese makers**", mobiel "Kerstpakketten / met jouw logo, / van **Europese makers**".
Dat zijn de betekeniseenheden die §3.3 miste, in één moeite.

### Punt 5. "Knop op de hero moet ook wat groter"

**Eens.** De maat die ik voorstel is de heroknop die de merkgids al beschrijft en die deze
knop niet krijgt: tekst 1,02 rem (16,3 px) en padding 1,05 × 2,4 rem. Berekend uit de
CSS: hoogte 16,3 × 1,2 + 2 × 16,8 = **circa 53 px**, breedte circa 253 + 13 + 13%
tekstgroei = **circa 300 px**, tegen 253 × 48 nu. Alleen vanaf 992 px. Op mobiel is 48 px
hoog en 72% van de kolom al goed; groter wordt daar een volle-breedte-blok en kost weer
hoogte. En de knop oogt vanzelf groter zodra de logo's eronder (418 px breed op desktop)
weg zijn; nu is de rij eronder breder dan de knop zelf.

### Punt 6. "De offerteknop moet laagdrempeliger"

**Eens met de diagnose, oneens met twee van de drie oplossingen, en het klikformulier
bestaat niet.**

De feiten eerst. `/offerte` (opgehaald 5 november) heeft één formulier: een tekstvak
"Waar kunnen we je mee helpen?", daarna naam, e-mail en bedrijf (verplicht) en telefoon
(optioneel). Vijf velden, drie verplicht. De kop boven dat formulier is "Vraag je offerte
aan", de subregel eronder is al "Vertel ons wat je zoekt, dan stellen we binnen één
werkdag een vrijblijvend voorstel samen." De gemeten conversie is `generate_lead` met
`form_id = offerte-aanvraag` op precies dit formulier (`docs/gtm/OPEN.md`); `/contact`
vuurt hooguit `contact`, secundair. Een formulier "waarbij je vrijwel alleen hoeft te
klikken" bestaat niet; `docs/kerstpagina-herzien.md` noemt het "de uitnodiging", zegt dat
hij nog gebouwd moet worden, en dat hij een eigen `form_id` nodig heeft om in GA4 koop en
uitdaging uit elkaar te houden. Waar hij komt (eigen pagina, extra veld op `/offerte`,
los formulier in het blok) is een open vraag aan Ward sinds 29 oktober.

Daarmee is de weging:

- **"Offerte klinkt officieel en zwaar": klopt**, zeker voor iemand die nog niets gekozen
  heeft en net 2,2 tegels heeft gezien. De FAQ zegt zelf dat het bedrijf samenstelt "in
  plaats van je een catalogus in te sturen"; de uitnodiging is de eigen modus van het
  merk. Het woord mag dus anders.
- **"Vertel ons wat je zoekt met een zoekicoon": label ja, icoon nee.** Het label staat
  al in de knoppentabel van `brand/voice.md` en is op twee servicepagina's de primaire
  knop. Maar een vergrootglas in de knop zegt "zoek in de shop", en 60 px erboven staat
  de echte zoekbalk met hetzelfde icoon. De pijl is het idioom en vertelt het juiste:
  verder, niet zoeken. Let ook op de bestemming: op de servicepagina's wijst dit label
  naar `/contact`, en dat is de secundaire conversie. Hier moet hij naar `/offerte`.
- **"Laat je verrassen, wij sturen je 3 voorstellen op maat": nu niet.** Het belooft een
  getal en een product dat nergens is afgesproken; de eind-CTA belooft "een vrijblijvend
  voorstel", enkelvoud. `claims.md`: geen verzonnen cijfers. En de knop landt dan op een
  formulier dat "offerte" heet en om bedrijfsnaam vraagt: een knop die iets belooft wat
  de bestemming niet waarmaakt is erger dan een saaie knop, dat zegt de vraag zelf al.
  Zodra de uitnodiging bestaat met eigen `form_id`, en iemand zich aan drie voorstellen
  binnen één werkdag committeert, is dit de knop van blok 3 uit het plan ("De
  uitnodiging"), niet van de hero.

**De eerlijkste tussenstap:** het label verlichten, de bestemming `/offerte` houden (de
conversie blijft dan meetbaar en de subregel daar zegt al wat het label belooft), en de
lichtheid in de reassurance-regel eronder leggen. Drie labels die ik nu zou durven
plaatsen:

| Label | Naar | Reassurance eronder (small) | Waarom |
|---|---|---|---|
| **Vertel ons wat je zoekt** | `/offerte` | Binnen één werkdag een vrijblijvend voorstel. | Staat in `voice.md`, is letterlijk de subregel én het eerste veld van `/offerte`. Geen nieuwe belofte. 22 tekens. |
| **Vraag een voorstel aan** | `/offerte` | Vrijblijvend, binnen één werkdag, inclusief drukproef. | "Voorstel" is het woord dat de eind-CTA en `/offerte` al gebruiken; lichter dan "offerte", zelfde route. 22 tekens. |
| **Laat ons een voorstel maken** | `/offerte` | Jij zegt voor wie en hoeveel, wij doen het zoekwerk. | Het dichtst bij Wards bedoeling zonder getal. De reassurance is waar (FAQ: "in plaats van je een catalogus in te sturen") en in de gids-niet-held-toon. 27 tekens. |

Mijn keuze: de eerste. Eén kleine vervolgstap hoort erbij: de H1 van `offerte-kop.html`
van "Vraag je offerte aan" naar "Vertel ons wat je zoekt", zodat knop en bestemming
hetzelfde zeggen. Dat blok is van ons, dus dat kost geen Promidata.

Wards zin "Wij doen het zoekwerk, jij strijkt met de eer" is goed en claimvrij; hij hoort
alleen niet in een knop. Als reassurance onder de derde variant, of als de subregel van
het uitnodigingsblok zodra dat er is.

### Waar we uit elkaar lopen, samengevat

| Punt | Ward | Ik | Beslist door |
|---|---|---|---|
| 1 kleur | lijkt zwart | gewicht 700 op 56 px; oplossen via gewicht, niet kleur | meting gewicht en contrast |
| 2 tweede knop | naast de offerteknop | onder de band, bosgroen, gecentreerd; niet ernaast | 60 px op mobiel, plan "één knop" |
| 3 feiten | pills | drie vormen, geen vlak; feiten groter, vraag onder de knop | chips zijn small; Framer-patroon |
| 4 kop | groter, gewichtsaccent | eens: 36 / 64 px, basis 500, "Europese makers" in 700; niet de `em`-regel | kommabreuk bij `inline-block`, 2,78 : 1 |
| 5 knop | groter | eens: circa 300 × 53 px vanaf 992 px; mobiel laten | merkgids-heroknop |
| 6 laagdrempelig | zoekicoon of "3 voorstellen" | label verlichten naar `/offerte`; klikformulier bestaat niet | `/offerte` opgehaald, `generate_lead` |

Niets hiervan is gebouwd. Eerst kiest Ward.
