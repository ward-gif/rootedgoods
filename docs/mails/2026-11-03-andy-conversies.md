**Kanaal:** mail of Slack aan Andy, antwoord op zijn lijst van vijf mogelijke conversies

**Basis onder de cijfers:** GA4-property 551909322, 4 oktober t/m 2 november 2026 (30 dagen),
gelezen als `ga4-lezer@rootedgoods-analytics.iam.gserviceaccount.com`. Checkout-paden over
drie maanden, 4 augustus t/m 2 november. Ruwe uitvoer staat in de sessielog van 3 november.

---

Hoi Andy,

Klopt wat je zegt, en de lijst is compleet. Per stuk waar het staat en wat ik adviseer. Twee van de vijf staan er al in,
één wacht op volume en één moeten we nog bouwen.

**1. Offerte en productaanvraag: ja, hetzelfde event, maar wel te scheiden.**
Beide vuren `generate_lead`. Het onderscheid zit in de parameter `form_id`:

| Waar | `form_id` | Sinds 4 augustus |
|---|---|---:|
| Het algemene formulier op /offerte | `offerte-aanvraag` | 2 |
| Vanuit een PDP, via /poconfigurator/request | `product-aanvraag` | 1 |
| Vóór 30 september, toen de parameter er nog niet was | `(not set)` | 2 |

Die parameter staat in GA4 al als eigen dimensie geregistreerd, onder de naam "Fomulier"
(met een typefout die ik eruit haal). Je kunt er dus zelf op uitsplitsen: zet in een rapport
de dimensie Formulier naast de gebeurtenis `generate_lead` en je hebt de twee apart.

In Google Ads komen ze samen binnen, als één conversieactie "Offerteaanvraag (website)".
Twee losse conversieacties kan, maar dan heb je twee tags en twee keer zo weinig signaal per
stuk. Bij vijf aanvragen in drie maanden lijkt me dat onverstandig. Zie punt 5.

**2. Contactformulier: zit er al in, heeft nog nooit gevuurd.**
Sinds 30 september heeft dat zijn eigen event `contact`. In GA4 staat die over de laatste
30 dagen op nul, en er is in die periode ook geen enkele form_start op /contact, bij 12
paginaweergaven van 7 bezoekers. Dus geen kapotte tag, maar niemand die hem invult.
Secundair is wat mij betreft goed.

**3. E-commerce: staat al live, sinds 29 oktober.**
Acht tags op de gebeurtenissen die Shopware zelf in de dataLayer zet: `view_item_list`,
`select_item`, `view_item`, `add_to_cart`, `view_cart`, `begin_checkout`, `confirm_order` en
`purchase`. In de vijf dagen sinds publicatie kwamen de bovenste drie binnen: 71
`view_item_list`, 61 `view_item`, 35 `select_item`. In de 25 dagen daarvoor nul van alle drie,
dus dat is aantoonbaar die publicatie en niet iets anders.

De onderste stappen hebben nog niets gehad om op te vuren. Nul `add_to_cart` in die vijf
dagen, en /checkout/cart is in drie maanden één keer bekeken. `purchase` staat dus klaar en
wacht op de eerste echte bestelling; beide testbestellingen zijn bij de betaalstap afgebroken.
Primair met waarde zodra er een doorkomt.

Eén bekend gebrek: `add_to_cart` stuurt waarde 0, terwijl de stukprijs wel in de dataLayer
staat. Dat is E6 op de Promidata-lijst. Gemeten met en zonder ons eigen JS en identiek, dus
het ligt niet aan onze kant.

**4. De belafspraak: eens, dit is de interessantste van de vijf.**
Het is cal.com, geen Calendly, als pop-up op dertien blokken: alle themapagina's, /contact,
/offerte, /over-ons en de servicepagina's. Die embed laadt uit ons eigen JS, dus de geslaagde
boeking kan ik zelf in de dataLayer zetten zonder dat er iets bij Promidata langs hoeft.
Een paar regels werk. Voorstel: event `belafspraak_gepland`, in Ads primair naast de
offerteaanvraag, want als signaal is het even goed of beter.

Cal.com kan het daarnaast ook per webhook doorgeven. Dat vangt ook de afspraken die iemand
uit een mail of een signature boekt, en die zie je nu nergens terug. Zwaarder om te bouwen,
dus niet nu.

**5. De voorwaarde onder alles: er is nog bijna geen signaal.**
Over die 30 dagen zag GA4 349 sessies en één `generate_lead`. Van de 16 form_submits staan er
9 op /search en de homepage, dus vrijwel zeker de zoekbalk. Blijven er 7 over die een echt
formulier waren. Meten doen we ze
allemaal, maar slim bieden heeft rond de dertig conversies in dertig dagen nodig en daar
zitten we ver onder. Tot die tijd: offerteaanvraag en belafspraak primair, contact secundair,
purchase klaargezet.

Heb je toch meer volume nodig om op te sturen, dan is `form_start` de kandidaat: 65 keer door
28 bezoekers in dezelfde 30 dagen. Als secundair signaal, niet als conversie.

Houd bij al die getallen in gedachten dat GA4 een ondergrens is. Wie de cookiemelding weigert
of een adblocker heeft telt niet mee.

Groet,
Ward

---

## Korte versie, zoals Ward hem stuurt

Andy had de meeste zelf al opgepakt; alleen cal.com stond nog open. Dit is wat er werkelijk
de deur uit ging, als antwoord op zijn "de eerste twee zijn idd in gads, je haalt ze uit
elkaar door...".

Zeker, ik heb de meeste opgepakt. Alleen Calendly moet nog even, die komt er ook zsm bij :)

De eerste twee zijn in Ads inderdaad één conversieactie. Je haalt ze uit elkaar in GA4: beide
vuren `generate_lead`, en het onderscheid zit in de parameter `form_id`. Die staat er al als
dimensie in, onder de naam "Fomulier" (met typefout, die haal ik eruit). Zet die naast de
gebeurtenis `generate_lead` en je ziet drie waarden:

- `offerte-aanvraag` = het algemene formulier op /offerte
- `product-aanvraag` = aanvraag vanuit een productpagina
- `(not set)` = van vóór 30 september, toen die parameter er nog niet in zat

Stand sinds 4 augustus: 2 offerte-aanvraag, 1 product-aanvraag, 2 not set.

In Ads zelf kan het niet, daar komen ze samen binnen. Twee losse conversieacties zou kunnen,
maar dan heb je twee tags en per stuk half zoveel signaal. Bij vijf aanvragen in drie maanden
lijkt me dat onverstandig.
