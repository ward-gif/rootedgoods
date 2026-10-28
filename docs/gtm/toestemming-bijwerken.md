# Toestemming bijwerken na accepteren

28 oktober 2026. Staat klaar in werkruimte **"Toestemming bijwerken"** (id 16),
container GTM-MJ83DVQK. **Niets is live tot jij publiceert.**

## Het probleem

| Moment | Toestemming in GTM | Cookies |
|---|---|---|
| Binnenkomst | alle vier `false` | geen `_ga` |
| Na klik op accepteren | **nog steeds alle vier `false`** | Shopware zet alleen zijn eigen cookies |
| Na een herlaadbeurt | alles `true` | `_ga` en `_gcl_au` verschijnen |

Wie accepteert wordt pas vanaf zijn **tweede** paginaweergave gemeten. De
landingspagina waar de advertentie voor betaald heeft telt nooit mee, en wie
accepteert en daarna weggaat is volledig onzichtbaar. Dit is een van de redenen
dat betaald verkeer in GA4 als Direct opduikt.

Shopware duwt wel `cookieConsentGiven` in de dataLayer, maar daar hing niets aan.

## Bijvangst: een variabele die naar een cookie wijst die niet bestaat

De bestaande variabele `Cookie - analytics consent` leest cookie
`google-analytics-enabled`. Die bestaat niet. Shopware zet `dtgsAllowGtmTracking`
en `google-ads-enabled`. De variabele is dus altijd leeg, en de trigger
"Blokkeer - geen analytics consent" die erop leunt wordt door geen enkele tag
gebruikt. Ik heb beide laten staan en nieuwe, kloppende variabelen gemaakt.
Opruimen kan later.

## Wat er in werkruimte 16 klaarstaat

| Soort | Naam | Wat |
|---|---|---|
| Variabele | `Cookie - analytics toestemming` | leest `dtgsAllowGtmTracking` |
| Variabele | `Cookie - ads toestemming` | leest `google-ads-enabled` |
| Trigger | `Toestemming gegeven` | aangepaste gebeurtenis `cookieConsentGiven` |
| Tag | `Toestemming bijwerken na keuze` | Aangepaste HTML, prioriteit 10, geen aanvullende toestemming vereist |
| Tag | `GA4 - page_view na toestemming` | GA4-gebeurtenis `page_view`, G-VT3YF07ZGB, prioriteit 5 |

De HTML-tag **leest de cookies uit** en zet niet zomaar alles op `granted`. Zodra
Configureren weer werkt (E4) klopt een gedeeltelijke keuze daardoor vanzelf.

Prioriteit 10 vóór 5 zorgt dat de toestemming bijgewerkt is voordat de
paginaweergave de deur uit gaat.

## Wat ik wel en niet heb getest

**Wel.** Dat de cookies er al staan als `cookieConsentGiven` afvuurt: gemeten op
3.301 ms, alle drie aanwezig. En dat exact deze consent-update op de live pagina
werkt: toestemming slaat om, `_ga` en `_gcl_au` worden direct gezet, en GA4 gaat
meteen in `G111` sturen in plaats van pas na een herlaadbeurt. Over drie
pagina's evenveel page_views als nu, er gaat dus niets verloren.

**Niet.** Of GTM de tags ook echt afvuurt. Daarvoor moet een versie aangemaakt
worden en dat mag alleen met publicatierechten. Dat is bewust zo gelaten.

## Controleren, twee minuten

1. Open werkruimte "Toestemming bijwerken" in GTM, klik **Voorbeeld**.
2. Ga naar rootedgoods.eu, klik op "Aanvaard alle cookies", **herlaad niet**.
3. In Tag Assistant horen beide nieuwe tags te vuren op `cookieConsentGiven`.
4. In de ontwikkelaarsconsole horen `_ga` en `_gcl_au` er nu te staan.
5. In de netwerktab, bij de aanroep naar `google-analytics.com/g/collect`: de
   `gcs`-parameter hoort `G111` te zijn. `G100` is geweigerd. Nu staat alles op
   `G100` tot de tweede pagina.

Klopt het, dan publiceren. Klopt het niet, laat zien wat Tag Assistant zegt.

## Nog open in dezelfde container

- `Leadinfo-Trackingcode` staat gepauzeerd. Laten staan of weggooien?
- `Snitcher` vuurt op Alle pagina's met toestemming "niet ingesteld", dus hij
  zet `snitcher_device_id` vóór enige keuze. Dat wil je waarschijnlijk niet.
