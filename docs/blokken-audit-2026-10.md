# Audit van de CMS-blokken, 27 oktober 2026

> Alle 32 bestanden in `blokken-def/` gecontroleerd op techniek, kopstructuur, interne
> links en de merkregels uit de `rootedgoods`-skill (`design/niet-meer.md`, `brand/voice.md`,
> `design/tokens.md`). 30 van de 32 hebben minstens één bevinding. Gemeten in code, niet
> met het oog. Dit is een checklist: vink hier af.

## Eerst repareren, want het raakt vertrouwen of geld

1. **`/privacy` is een 404.** Staat in `contactform-voorzetje.html` regel 47, in het
   akkoordvinkje naast het formulier: "Ik ga akkoord met het privacybeleid." De footer
   gebruikt wél de goede URL (`/algemeen/privacy-beleid/`).
   **Nu niet live op `/offerte` of `/contact`** (daar staat het vinkje niet), dus er lekt
   vandaag niets. Maar dit blok is wel bedoeld om geplakt te worden, en dan staat er een
   dode privacylink op het moment van verzenden. Google Ads wil een bereikbaar
   privacybeleid. Vervang door `/algemeen/privacy-beleid/`.

2. **`pagina-landing.html` heeft zeven keer `via.placeholder.com` als afbeelding**, en
   `pagina-feature-blok.html` één keer. Niet live, dus geen grijze vakken op de site
   vandaag. Het punt is iets anders: dit is precies het sjabloon dat we in week 2 willen
   hergebruiken voor de nieuwe landingspagina. Ruim het leeg voordat het geplakt wordt,
   anders gaat er een placeholder mee naar buiten. Dit is ook regel 18 uit
   `design/niet-meer.md`.

## Sitebreed, elk blok

Dit geldt zonder uitzondering voor alle 32 blokken, dus het is één ingreep en geen 32:

| Wat | Omvang |
|---|---|
| `<img>` zonder `loading="lazy"` | **190 van 190** |
| `<img>` zonder `srcset` | **190 van 190** |
| `<img>` die naar `/media/` wijst (onbewerkt origineel) in plaats van een thumbnail | **167 van 190** |
| `<img>` zonder `width` en `height` | ongeveer 90% |

De eerste drie verklaren waarom er op de homepage 180 van de 208 afbeeldingen direct
binnenkomen. De vierde is een CLS-risico en hangt samen met de gemeten CLS van 0,361 op de
PDP-desktop uit `plan-van-aanpak-optimalisatie.md`.

Let op bij het repareren: **lazy hoort niet op het eerste schermbeeld.** De hero blijft
`eager` met `fetchpriority="high"`, anders ruil je LCP in voor gewicht.

## Per blok, de rest

| Blok | Bevinding |
|---|---|
| `over-ons.html` | 11 inline `style`-attributen, 1 uitroepteken, 19/21 img zonder afmetingen |
| `service-detail-verzending.html` | 17 inline styles, 3 eyebrow-verwijzingen |
| `europa map sectie.html` | 17 inline styles. Ook: bestandsnaam met spaties, hoort `europa-map-sectie.html` te zijn |
| `service-detail-full-service.html` | **4** eyebrow-verwijzingen |
| `service-detail-personalisatie.html` | 3 eyebrow-verwijzingen |
| `service-detail-warehousing.html` | 3 eyebrow-verwijzingen |
| `services-overzicht.html` | kopniveau springt van h1 naar h3 |
| `thema-overzicht.html` | kopniveau springt van h1 naar h3 |
| `algemene-voorwaarden.html` | kopniveau springt van h1 naar h4. 18 em-dashes: juridische tekst, laten staan (`brand/voice.md`) |
| `contact-kop.html` | 1 uitroepteken |
| `merken-overzicht.html` | 22 img, alle 22 zonder afmetingen en naar `/media/` |

De vier `service-detail`-blokken met drie tot vier eyebrows zijn hetzelfde patroon dat
`DESIGN-AUDIT.md` in augustus al vond en dat in september deels is opgeruimd. Regel 1 uit
`design/niet-meer.md`: één of twee per pagina, en alleen als hij informatie draagt.

## Wat goed is

Het is geen slecht gebouwd geheel, en dat hoort er ook bij te staan:

- **Geen enkel `alt`-attribuut ontbreekt.** Nul bevindingen op 190 afbeeldingen.
- **Geen `!important` in de blokken.** De 992 uit de design-audit zitten in
  `rootedgoods.css`, niet hier.
- **Geen oud goud `#ab8249`**, geen hardgecodeerde `#ca853f`, geen zwarte schaduwen.
  Het palet is schoon.
- **Geen u-vorm**, geen handmatige pijlen in knoptekst, en twee uitroeptekens op 32 blokken.
- **27 unieke interne links, waarvan er één kapot is.** Dat is een goede verhouding.
- Structured data zit in de blokken waar het hoort (`services-overzicht`,
  `service-detail-warehousing`, `thema-overzicht`).

## Twee dingen die buiten de blokken liggen maar hier opvielen

### Geen enkele eigen pagina staat in de sitemap

De sitemap bevat 1.507 URL's. Gecontroleerd op 27 oktober:

| Pagina | In sitemap |
|---|---|
| `/` | **nee** |
| `/offerte` | **nee** |
| `/eindejaarsgeschenken` (238 advertentieklikken) | **nee** |
| `/contact`, `/over-ons`, `/faq`, `/made-in-nl`, `/merken/`, `/onboarding-welkomstpakket`, `/warehousing-fulfillment`, `/medewerker-merchandise` | **nee** |
| Shopware-categorieën (`/thema-s/...`, `/drinkwaren/...`) | ja |
| Productpagina's | ja, 1.201 stuks |

Dit was openstaand punt 3 in `post-golive-audit.md` ("bevestigen dat die de losse
thema-CMS-pagina's automatisch meeneemt"). Het antwoord is nee, geen enkele.

Daar komt een conflict bovenop: `/thema-s/kerstpakketten-eindejaar/` staat wél in de
sitemap en heeft een **lege h1**, terwijl `/eindejaarsgeschenken` een nette h1 heeft en er
niet in staat. De zwakke pagina is dus vindbaar en de goede niet, voor dezelfde zoekvraag.

De self-canonical uit commit `cfcfe4f` werkt wel, maar wordt door `rootedgoods.js`
client-side gezet. Dat is bewust en staat zo in de code gedocumenteerd als de gratis
tussenoplossing. Het commentaar zegt zelf dat Google een canonical in de ruwe HTML
prefereert. Geen bug, wel een bekende zwakte, en los van de sitemap.

### Bijna de helft van de product-URL's is dezelfde product

1.201 product-URL's voor **636 unieke producten**. 182 producten hebben meer dan één
variant-URL, samen **565 extra URL's** die niets nieuws bevatten. De ergste:

| Product | Aantal URL's |
|---|---|
| Pulltap's kelnersmes | ongeveer 45 |
| Tubyard-lanyard met elastische buis | 20 |
| Tubyard-lanyard telefoonhouder | 20 |
| Clic-clac natuurlijke pepermunt | 19 |

Elke kleur en maat is een eigen indexeerbare pagina met vrijwel dezelfde tekst. Dat verdunt
de autoriteit over tientallen bijna-identieke URL's en het is vermoedelijk een deel van de
verklaring waarom er nauwelijks organisch verkeer is. Dit is een Promidata- of
Shopware-instelling (variant-URL's canonicaliseren naar het hoofdproduct), geen blokklus.

## Beperkingen van deze audit

- Het is een statische controle op de bestanden in `blokken-def/`. Of een blok ook
  daadwerkelijk live staat en of Shopware er iets uit strijpt bij opslaan, is hier niet
  getoetst. `faq.html` documenteert dat strippingrisico al voor zijn eigen blok.
- De kopstructuur is per blok gemeten, niet per pagina. Een pagina bestaat uit meerdere
  blokken, dus de echte kophiërarchie kan afwijken van wat hier per bestand staat.
- Op toon en copy is alleen op harde regels getoetst (em-dash, u-vorm, uitroepteken, pijl,
  oud palet). Of een zin goed is, staat hier niet; daar is `natural-writing` voor.
- Er is niet getoetst op claims tegen `brand/claims.md`. Dat is een eigen ronde en vraagt
  Wards oordeel per bewering.
