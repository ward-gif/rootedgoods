# Apollo website-tracker: stand van zaken, 3 november 2026

Opdracht van Ward: de Apollo website-tracker als concept klaarzetten in
`GTM-MJ83DVQK`, met dezelfde toestemmingsinstelling als de bestaande
marketingtags, en niet publiceren.

**Niet aangemaakt.** Twee redenen, hieronder. De analyse is wel af.

## 1. Apollo staat er nog niet

Gecontroleerd op de live container zelf, `gtm.js?id=GTM-MJ83DVQK`, 479 kB:

| Gezocht | Treffers |
|---|---:|
| `apollo` | **0** |
| `trackingFunctions` | **0** |

En in de vastgelegde HTML van `/eindejaarsgeschenken` en `/test` van 2 november:
nul treffers. Apollo draait dus nergens, niet via GTM en niet in de broncode.

## 2. De containerexport in deze map is zeven versies oud

`containers/Google Tag Manager v11.json` is van 30 september. **De live container
staat op versie 18** en heeft 21 tags in plaats van 6. Wat daar sindsdien bij is
gekomen is hier niet vastgelegd.

Wie op die export afgaat, kijkt naar een container die niet meer bestaat. Dat is
precies wat hieronder misging bij de vraag "neem de instelling van de bestaande
marketingtags over".

## 3. Er is geen marketingtag met toestemming om over te nemen

De opdracht noemt de Meta-pixel, LinkedIn en Google Ads als voorbeeld. Gemeten in
de live container:

| Tool | Aanwezig |
|---|---|
| Meta-pixel (`connect.facebook`) | nee |
| LinkedIn | nee |
| Hotjar | nee |
| Google Ads conversie (`__awct`) | **ja** |
| Microsoft Clarity (`__cvt_MQDKZ`) | ja |
| Snitcher (`__html`, namespace Radar) | **ja** |
| Leadinfo | staat op `__paused` |

En hun toestemmingsinstelling:

| Tag | `consent` in de live container |
|---|---|
| Google Ads conversie, id 25 | **geen** |
| Snitcher, id 18 | **geen** |
| Clarity, id 6 | `analytics_storage` |
| GA4 en alle gebeurtenistags | geen |

**De enige echte marketingtag in deze container, Google Ads conversie, heeft geen
toestemmingsinstelling.** De enige tag die er wél een heeft is Clarity, en dat is
een analysetag, geen marketingtag.

De opdracht vraagt twee dingen die elkaar hier uitsluiten: "neem precies dezelfde
instelling over als de bestaande marketingtags" en "zodat de tag alleen vuurt als
de bezoeker marketingcookies accepteert". Letterlijk hetzelfde overnemen betekent
hier **geen** toestemmingsgrens. Dat is het tegenovergestelde van de tweede eis.

Daarom is dit niet door mij ingevuld.

## 4. Snitcher doet al wat Apollo zou gaan doen

Tag 18 is Snitcher, herkenbaar aan de namespace `Radar`, Aangepaste HTML, één
keer per pagina, zonder toestemmingsinstelling. Snitcher en de Apollo
website-tracker zijn hetzelfde soort gereedschap: ze herleiden een anonieme
bezoeker naar een bedrijf.

Leadinfo, een derde van dezelfde soort, staat gepauzeerd.

`toestemming-bijwerken.md` noteerde op 28 oktober al over Snitcher: *"vuurt op
Alle pagina's met toestemming niet ingesteld, dus hij zet `snitcher_device_id`
vóór enige keuze. Dat wil je waarschijnlijk niet."* Dat staat er vandaag nog
steeds zo bij.

Voordat Apollo erbij komt is de vraag niet hoe we hem instellen, maar of er drie
van deze tools naast elkaar moeten staan.

## 5. Een toestemmingsgrens werkt hier vandaag niet zoals je verwacht

In de live container staat **geen consent-default**. En `toestemming-bijwerken.md`
beschrijft een gemeten probleem dat nog open staat:

| Moment | Toestemming in GTM |
|---|---|
| Binnenkomst | alles `false` |
| Na klik op accepteren | **nog steeds alles `false`** |
| Na een herlaadbeurt | alles `true` |

Zet je Apollo op "vereist `ad_storage`", dan vuurt hij **niet op de
landingspagina**, ook niet bij iemand die accepteert. Pas vanaf de tweede
paginaweergave. Voor een tool die juist het eerste bezoek wil herkennen is dat
grotendeels zinloos.

De reparatie daarvoor staat klaar in werkruimte 16 ("Toestemming bijwerken") en
is nog niet gepubliceerd. **Die hoort vóór Apollo, niet erna.**

## 6. Waarom hij niet is aangemaakt

Naast het inhoudelijke punt hierboven: ik kan er technisch niet bij.

- `api-opzetten.md` beschrijft de GTM-API-toegang als **plan**, niet als iets dat
  draait. Stap 1 en 2 daarvan (API inschakelen, service account toevoegen in
  Gebruikersbeheer) zijn voor zover bekend niet uitgevoerd.
- Het ophalen van een toegangstoken wordt in deze omgeving geblokkeerd.
- Er is geen GTM-koppeling beschikbaar.

Wat overblijft is de GTM-interface in de browser bedienen. Dat kan, en dan kan ik
stap 5 (voorbeeldmodus, twee pagina's, met en zonder toestemming) ook echt doen.
Dat is sowieso het enige dat die test kan uitvoeren; via de API kan het niet.

## Wat ik zou adviseren

1. Eerst werkruimte 16 publiceren, zodat toestemming klopt vanaf de eerste pagina.
2. Beslissen of Apollo náást Snitcher moet, of in plaats daarvan.
3. Dan pas Apollo erbij, en dan **wél** achter `ad_storage`, want dan werkt die
   grens ook echt.
4. Los daarvan: Snitcher en straks Apollo horen met naam in de privacyverklaring,
   want ze herleiden bezoekers naar organisaties. Dat staat er nu niet, en dat is
   een aparte kwestie van de toestemmingsinstelling in GTM.

## De tag zelf, klaar om in te voeren

Zodra bovenstaande beslist is:

| Veld | Waarde |
|---|---|
| Naam | `Apollo - Website visitors` |
| Type | Aangepaste HTML |
| Tagvuuropties | Eén keer per pagina |
| Trigger | Alle pagina's |
| Toestemming | Aanvullende toestemming vereist: `ad_storage` |

```html
<script>function initApollo(){var n=Math.random().toString(36).substring(7),o=document.createElement("script");o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n,o.async=!0,o.defer=!0,o.onload=function(){window.trackingFunctions.onLoad({appId:"67b4e32b5720930019c20ae8"})},document.head.appendChild(o)}initApollo();</script>
```

---

# Vervolg: in de interface geprobeerd, 3 november 2026

Ward koos: Apollo **in plaats van** Snitcher, en gaf akkoord om de GTM-interface
in de browser te bedienen. Ook bevestigd: de toestemmingsreparatie uit
werkruimte 16 is gepubliceerd en zit in versie 18. Nagekeken in de live
container: tag 22 is de consent-update met prioriteit 10, tag 23 de GA4
page_view met prioriteit 5. Een grens op `ad_storage` werkt daarmee vanaf de
eerste paginaweergave.

**Toch niet uitgevoerd: `GTM-MJ83DVQK` is niet bereikbaar vanaf dit account.**

## Wat ik zag

Ingelogd als **`ward@bambook.org`**. Dat is het enige account in de
accountkiezer.

Accountoverzicht met **beide** filters aan, directe én doorgegeven toegang:

| Account | Containers |
|---|---|
| Bambook | GTM-NTXVD3X, GTM-WWP83N2, GTM-K8NBRJR |
| Bambook - MCC, DE, FR, NL, UK | AW- en G-containers |
| Bambook.org - GA4, Keyword Hero - GA4 | G-containers |
| **Rooted Goods** | **één container: `G-VT3YF07ZGB`, type Web** |

`G-VT3YF07ZGB` is de **Google-tag**, niet de GTM-webcontainer. Openen geeft het
Google-tag-configuratiescherm met rechtsboven **"Modus Alleen lezen"**, en geen
navigatie naar Tags, Triggers of Variabelen.

**`GTM-MJ83DVQK` komt in de hele lijst niet voor.** Niet onder directe toegang en
niet onder doorgegeven toegang.

De container bestaat wel en draait live op rootedgoods.eu, want `gtm.js?id=
GTM-MJ83DVQK` levert gewoon versie 18 met 21 tags. Hij hangt dus onder een
Google-account dat `ward@bambook.org` niet kan zien. Waarschijnlijk
`info@rootedgoods.eu`, dat in `api-opzetten.md` als "jouw eigen account" staat.

**Er is niets gewijzigd.** Alleen gekeken, en de tab weer gesloten.

## Wat er nodig is om verder te kunnen

Eén van tweeën:

1. **Toegang geven.** Log in met het account dat de container wél beheert, ga naar
   Beheer, Gebruikersbeheer, en geef `ward@bambook.org` de rechten
   **Bewerken** op containerniveau. Niet Publiceren; dan zet ik een werkruimte
   klaar en druk jij zelf op publiceren.
2. **Van account wisselen in de browser.** Voeg `info@rootedgoods.eu` toe aan
   Chrome. Inloggen doe ik niet zelf, wachtwoorden invoeren hoort niet bij wat ik
   doe.

Optie 1 is de betere, want dezelfde handeling in Gebruikersbeheer is ook stap 2
van `api-opzetten.md`. Doe je het voor `gtm-beheer@rootedgoods-analytics.iam.
gserviceaccount.com` erbij, dan kan dit voortaan ook zonder browser.

## Wat er daarna gebeurt, in één keer

1. Tag `Apollo - Website visitors`, Aangepaste HTML, één keer per pagina, trigger
   Alle pagina's, aanvullende toestemming vereist: `ad_storage`.
2. Snitcher (tag 18, Aangepaste HTML, namespace Radar) pauzeren.
3. Voorbeeldmodus op de homepage en één productpagina: zonder toestemming hoort
   de tag niet te vuren, na accepteren één keer, en hoort `tracker.iife.js` te
   laden.
4. Niet publiceren.

---

# Uitgevoerd, 3 november 2026

Ward gaf `ward@bambook.org` eerst **Lezen** op de container; na het wijzigen naar
**Bewerken** kon het. Er stond ook nog een accountuitnodiging open die eerst
geaccepteerd moest worden. De container hangt onder account **6373744304**,
heet **"rootedgoods.eu live website"**, en is een ander Rooted Goods-account dan
dat van de losse Google-tag (6373756253).

## Wat er nu klaarstaat

**Werkruimte 15**, twee wijzigingen in behandeling, **niet gepubliceerd**:

| Wijziging | Door |
|---|---|
| `Apollo - Website visitors` toegevoegd | ward@bambook.org |
| `Snitcher` verwijderd | info@rootedgoods.eu, eerder vandaag |

De tag:

| Veld | Waarde |
|---|---|
| Naam | `Apollo - Website visitors` |
| Type | Aangepaste HTML |
| HTML | het script uit de opdracht, letterlijk, appId `67b4e32b5720930019c20ae8` |
| Tagactiveringsopties | **Eenmaal per pagina** |
| Trigger | **All Pages** |
| Toestemming | **Aanvullende toestemming vereisen: `ad_storage`** |

De HTML is na invoeren teken voor teken nagekeken; de code-editor had geen
haakjes of aanhalingstekens bijgeplakt.

## De test, en het is geen goed nieuws

Voorbeeldmodus op de homepage en op de productpagina
`/Rebottled-Tumbler-330-ml-drinkglas/A508-269133`.

**Technisch werkt het.** `assets.apollo.io/micro/website-tracker/tracker.iife.js`
komt binnen met **HTTP 200**, en de tag vuurt één keer per pagina.

**Maar de toestemmingsgrens houdt niet.** De volgorde van gebeurtenissen is op
beide pagina's gelijk:

| # | Gebeurtenis | Wat er gebeurt |
|---:|---|---|
| 5 / 27 | **Container geladen** (`gtm.js`) | **Apollo vuurt hier al.** Toestemmingstab: *"Toestemming niet ingesteld. De standaard toestemmingsstatus is nog niet ingesteld"* |
| 6 / 28 | Standaard voor toestemming | pas hier komt `gtag("consent","default",{...})` |
| 7 / 29 | `cookieConsentGiven` | de bezoeker kiest |
| 8 / 30 | Update voor toestemming | pas hier staat de keuze erin |

**De consent-default komt ná het laden van de container.** Op het moment dat
Apollo vuurt bestaat er dus nog helemaal geen toestemmingsstatus, en dan houdt
GTM een tag met "vereist `ad_storage`" niet tegen.

Dit is precies punt 5 uit `OPEN.md`: *"Tag Assistant meldt `wasSetLate: true`; de
consent-default komt te laat."* Dat stond er als losse notitie. Dit is de eerste
keer dat het gemeten gevolg erbij staat: **een toestemmingsgrens op een tag doet
in deze container niets.**

**Wat ik niet heb kunnen testen:** een schone browser zonder eerdere
cookiekeuze. Dat maakt hier niet uit: op het moment dat Apollo vuurt bestaat er
geen toestemmingsstatus, ongeacht wat de bezoeker later kiest.

## Wat dit betekent voor publiceren

Publiceer je werkruimte 15 nu, dan:

1. gaat Snitcher eruit,
2. komt Apollo erin,
3. en vuurt Apollo **vóór elke cookiekeuze**, precies zoals Snitcher dat deed.

Qua toestemming verandert er dus niets aan de situatie; alleen de naam van de
tool. Dat kan een bewuste keuze zijn, maar het is niet wat de opdracht beoogde.

## Wat er eerst zou moeten gebeuren

De consent-default moet vóór `gtm.js` staan. Twee routes:

1. **Een consent-default-tag op de trigger "Consent Initialization - All Pages"**,
   die al in de container bestaat maar hier niet voor gebruikt wordt. Dat is de
   plek die Google daarvoor bedoelt, en het is werk binnen GTM.
2. **In de thema-head**, vóór het GTM-fragment. Dat is een Promidata-wijziging en
   dus geld en doorlooptijd.

Route 1 eerst proberen. Pas daarna doet `ad_storage` op Apollo wat het belooft.

## Niet gepubliceerd

Werkruimte 15 staat klaar. Ward publiceert zelf.

---

# Besluit: zonder toestemmingsgrens, 3 november 2026

Ward: *"Doe voor nu maar gewoon laden met en zonder toestemming."*

De `ad_storage`-eis is eraf. De toestemmingsinstelling staat nu op
**"Geen aanvullende toestemming nodig"**.

Bewust die optie en niet "Niet ingesteld", terwijl die functioneel hetzelfde
doen. "Geen aanvullende toestemming nodig" is een uitgesproken keuze die in het
toestemmingsoverzicht van GTM zichtbaar is; "Niet ingesteld" is een veld dat
niemand heeft aangeraakt. Over een half jaar is het verschil tussen die twee
precies het verschil tussen een besluit en een vergeten instelling. De oude
Leadinfo-tag stond overigens ook op `NOT_NEEDED`.

**Geen hertest gedaan, en dat is bewust.** De meting van vanmiddag liet zien dat
de tag al vuurde bij "Container geladen", vóór enige toestemmingsstatus bestond.
De grens hield dus niets tegen. Hem weghalen kan het gedrag niet veranderen, en
`tracker.iife.js` kwam toen al binnen met HTTP 200.

## De eindstand van de tag

| Veld | Waarde |
|---|---|
| Naam | `Apollo - Website visitors` |
| Type | Aangepaste HTML |
| HTML | het script uit de opdracht, appId `67b4e32b5720930019c20ae8` |
| Tagactiveringsopties | Eenmaal per pagina |
| Trigger | All Pages |
| Toestemming | **Geen aanvullende toestemming nodig** |

Werkruimte 15, twee wijzigingen in behandeling: Apollo toegevoegd, Snitcher
verwijderd. **Niet gepubliceerd.**

## Wat hierdoor open blijft staan

1. **De consent-default komt te laat.** Dat is niet opgelost, alleen omzeild voor
   deze ene tag. Zolang `gtag("consent","default")` ná `gtm.js` komt, doet élke
   toestemmingsgrens in deze container niets. De route is een default-tag op de
   bestaande trigger "Consent Initialization - All Pages". Dit is punt 5 van
   `OPEN.md` en het raakt meer dan Apollo.
2. **De privacyverklaring noemt geen bezoekerherkenning.** Snitcher stond er niet
   in en Apollo dus ook niet. Nu Apollo bewust zonder toestemmingsgrens laadt,
   is dat het enige wat de bezoeker er nog over kan lezen.

## Nagekeken op 3 november: er komt wél iets binnen, er is alleen niets te herkennen

Ward zag in Apollo een vlakke lijn op nul over 90 dagen en "Identified 0/100".
Drie dingen gecontroleerd, en het is geen van de voor de hand liggende oorzaken.

**1. De tag staat in de gepubliceerde container.** Opgehaald met
`curl https://www.googletagmanager.com/gtm.js?id=GTM-MJ83DVQK`, 478.430 bytes. Daarin
staat `tag_id` 52, een custom-HTML-tag die
`assets.apollo.io/micro/website-tracker/tracker.iife.js` laadt en aanroept met
`appId: 67b4e32b5720930019c20ae8`.

**2. Dat appId is het juiste account.** Apollo's eigen trackerconfiguratie geeft
`id: 67b4e32b5720930019c20ae8`, exact hetzelfde. En `rootedgoods.eu` staat erin als
toegestane verwijzer, naast `bambook.org`. Domeinlimiet 3, `credits_exhausted: false`.

**3. Apollo heeft vandaag gegevens ontvangen.** In diezelfde configuratie staat
`last_data_received_at: 2026-11-03T07:53:08Z`, oftewel vanochtend 08:53 Nederlandse
tijd. Het veld `data_received` staat er tegelijk op `false`; die twee spreken elkaar
tegen, en wij kunnen van buitenaf niet zien wat Apollo met dat tweede veld bedoelt.
Vermoedelijk: wel binnengekomen, nog niets dat tot een bedrijf te herleiden was.

### Waarom er niets herkend wordt, en dit is het echte antwoord

Apollo herkent bedrijven door het IP-adres van de bezoeker terug te zoeken. Een
mobiele bezoeker komt binnen op een IP van KPN, Vodafone of Odido, en dat is geen
bedrijf. Zulke ISP-adressen vallen weg.

Apparaatverdeling in GA4:

| Periode | Mobiel | Desktop | Tablet |
|---|---:|---:|---:|
| 4 okt t/m 2 nov | 240 sessies (68,6%) | 99 (28,3%) | 11 (3,1%) |
| 29 okt t/m 2 nov | 86 (89,6%) | 10 (10,4%) | 0 |

In de laatste vijf dagen waren er **zes desktopgebruikers**. Dat is het hele
potentieel waar Apollo iets mee kan, en daarvan wordt in de praktijk maar een deel
herkend.

**Dus: de opzet werkt, maar het verkeer dat we kopen is het soort dat een
IP-herkenner niet kan thuisbrengen.** Dat is geen instelling die we kunnen aanzetten.
Wie hier iets uit wil halen, moet eerst desktopverkeer hebben, en dat is een
advertentiekeuze en geen trackingkwestie.

De vlakke lijn over 90 dagen klopt overigens gewoon: de tag staat nog geen dag live.
