# Plakronde, 30 oktober 2026

Eenentwintig van de 32 blokken zijn veranderd sinds **8 september**, de laatste staat die
live geplakt is. Dat is vastgesteld door de comment-vrije versie van toen te vergelijken met
`plakklaar/` nu, niet door het aan te nemen.

Alles hieronder is techniek: lazy loading, `fetchpriority` op hero's en één dode link. **Geen
enkele ontwerpkeuze.** De restyling is een apart traject en hoeft hier niet op te wachten.

## Hoe je plakt

```bash
bin/plakklaar.sh          # eerst, als je sinds vandaag nog iets aan blokken-def deed
```

Dan per blok: open `plakklaar/<naam>.html`, cmd-A, cmd-C, en plak in de HTML-editor van het
Shopware-CMS. Liever direct op het klembord zonder het bestand te openen:

```bash
bin/plak.sh thema-eindejaarsgeschenken
```

**Je hoeft niet alles in één keer.** De volgorde hieronder is op geld gesorteerd, dus wat je
bovenaan doet levert het meeste op. Stop waar je wilt en pak de rest later.

## Niet plakken

| Blok | Waarom niet |
|---|---|
| `pagina-landing.html` | Zeven keer `via.placeholder.com` als afbeelding. Staat niet live, en zo hoort het te blijven tot het blok leeggeruimd is. Zie `blokken-audit-2026-10.md`. |
| `pagina-feature-blok.html` | Eén placeholder, zelfde verhaal. Staat ook niet in de lijst hieronder, want hij is niet veranderd. |

## Groep 1, hier zit het geld

`/eindejaarsgeschenken` kreeg 383 klikken en € 536,73 over 1 tot en met 29 oktober, de
duurste landingspagina van het account. Over zes weken is die pagina een jaar lang waardeloos,
dus als je vandaag één ding doet, doe dit.

| Blok | Wat er verandert |
|---|---|
| `thema-eindejaarsgeschenken.html` | 8 afbeeldingen naar lazy, 1 hero krijgt `fetchpriority="high"` |

## Groep 2, de homepage

208 afbeeldingen, waarvan er nu 180 direct binnenkomen.

| Blok | Wat er verandert |
|---|---|
| `thema-tegels-home.html` | 4 naar lazy |
| `home-services-blok.html` | 2 naar lazy |

## Groep 3, de andere themapagina's

Advertentieverkeer landt ook hier. Alle zes dezelfde ingreep: de hero blijft eager en krijgt
voorrang, de rest wordt lazy.

| Blok | Wat er verandert |
|---|---|
| `thema-dag-van-de-leraar.html` | 8 lazy, 1 fetchpriority |
| `thema-events-en-conferenties.html` | 8 lazy, 1 fetchpriority |
| `thema-brievenbus.html` | 7 lazy, 1 fetchpriority |
| `thema-onboarding.html` | 7 lazy, 1 fetchpriority |
| `thema-made-in-nl.html` | 5 lazy, 1 fetchpriority |
| `thema-medewerker-merchandise.html` | 5 lazy, 1 fetchpriority |
| `thema-overzicht.html` | 7 lazy |

## Groep 4, de zwaarste twee, maar weinig verkeer

Hier zit de grootste technische winst per blok, alleen komt er nauwelijks advertentieverkeer.
Doe ze als groep 1 tot en met 3 staan.

| Blok | Wat er verandert |
|---|---|
| `merken-overzicht.html` | **21 naar lazy**, het meeste van alle blokken |
| `over-ons.html` | **20 naar lazy** |

## Groep 5, de rest

| Blok | Wat er verandert |
|---|---|
| `service-detail-personalisatie.html` | 7 lazy |
| `service-detail-full-service.html` | 6 lazy |
| `service-detail-verzending.html` | 4 lazy |
| `service-detail-warehousing.html` | 3 lazy |
| `services-overzicht.html` | 4 lazy |
| `contact-kop.html` | 4 lazy |
| `team-avatars-snippet.html` | 2 lazy |

## Apart: de dode privacylink

| Blok | Wat er verandert |
|---|---|
| `contactform-voorzetje.html` | `href="/privacy"` (404) wordt `/algemeen/privacy-beleid/` |

Geen beeldwinst, 17 bytes verschil. Maar dit blok draagt het akkoordvinkje naast een
formulier, en een dode privacylink op het moment van verzenden is een vertrouwenskwestie;
Google Ads wil bovendien een bereikbaar privacybeleid. Het blok staat vandaag niet op
`/offerte` of `/contact`, dus er lekt nu niets. Plak het vóórdat het ergens gebruikt wordt.

## Nameting

Als groep 1 tot en met 3 staan:

```bash
bin/psi.sh --runs 3
```

De nulmeting staat in `docs/metingen/`, de PSI-bestanden van 27 oktober. Wat je wilt zien:
minder direct binnenkomend beeld op het eerste scherm, en een LCP die niet verslechtert. De
hero's blijven bewust eager met `fetchpriority="high"`; gaat die alsnog omlaag, dan is er een
hero per ongeluk op lazy gezet en moet dat terug.

## Wat dit niet oplost

Het grootste beeldprobleem is het **formaat**, niet het aantal: er wordt nul webp of avif
geserveerd, alleen 134 jpg en 69 png. Dat is punt 24 en ligt bij Promidata. Deze plakronde
haalt het beeld onder de vouw weg, maar het gewicht per afbeelding blijft hetzelfde tot
Promidata de conversie aanzet.
