# Welke conversies worden er werkelijk gemeten

3 november 2026, naar aanleiding van Andy's lijst van vijf mogelijke conversies.

**Basis:** GA4-property 551909322, gelezen als
`ga4-lezer@rootedgoods-analytics.iam.gserviceaccount.com`. Twee vensters, omdat
containerversie 18 op 29 oktober live ging: 4 t/m 28 oktober (25 dagen, vóór) en
29 oktober t/m 2 november (5 dagen, erna). De `generate_lead`-telling en de
checkout-paden over drie maanden, 4 augustus t/m 2 november.

## De vijf

| Conversie | Tag | Heeft gevuurd |
|---|---|---|
| Offerte via `/offerte` | `generate_lead`, `form_id=offerte-aanvraag` | **ja**: 23 september 2x, 28 augustus 1x |
| Offerte vanuit een PDP | `generate_lead`, `form_id=product-aanvraag` | **ja**: 27 oktober 1x, op `/poconfigurator/request` |
| E-commerce | 8 tags sinds v18 | **ja**, de bovenste drie stappen |
| Contactformulier | event `contact` sinds v11 | **nee**, nul keer |
| Belafspraak (cal.com) | **geen tag** | n.v.t. |

Vijf `generate_lead`-gebeurtenissen in drie maanden, dat is alles. Geen van de vijf
valt op 28 oktober, de dag van Wards testconversie, dus het zijn echte bezoekers.

## E-commerce: de publicatie is in de cijfers te zien

| Gebeurtenis | 4 t/m 28 okt (25 dgn) | 29 okt t/m 2 nov (5 dgn) |
|---|---:|---:|
| `view_item_list` | 0 | 71 |
| `view_item` | 0 | 61 |
| `select_item` | 0 | 35 |
| `add_to_cart` | 0 | 0 |
| `view_cart` | 0 | 0 |
| `begin_checkout` | 0 | 0 |
| `purchase` | 0 | 0 |

167 gebeurtenissen in vijf dagen tegen nul in de 25 dagen ervoor. Dat is
containerversie 18 en niets anders.

De onderste vier staan op nul omdat niemand een mandje vult: `/checkout/cart` is over
drie maanden één keer bekeken. Dat is geen meetprobleem.

## Contact: geen kapotte tag, geen invullers

Nul `contact`-gebeurtenissen, en ook nul `form_start` op `/contact`, bij 12
paginaweergaven van 7 bezoekers in 30 dagen. Vóór v11 vuurde het contactformulier
`generate_lead`; de laatste keer was 28 augustus.

## Formulieren in het algemeen

| | 4 t/m 28 okt | 29 okt t/m 2 nov |
|---|---:|---:|
| `form_start` | 51 (23 bezoekers) | 14 (6 bezoekers) |
| `form_submit` | 15 (6 bezoekers) | 1 (1 bezoeker) |

Van de 16 `form_submit` staan er 9 op `/search` en de homepage, dus vrijwel zeker de
zoekbalk; 4 op een productpagina. Van de 65 `form_start` staan er **45 op een
productpagina**, verdeeld over 41 verschillende pagina's. Dat is de configurator: vijfenveertig
keer begint iemand een aanvraag op een PDP, en er komt één `generate_lead` uit.

## Wat hier níet in staat en wel een gat is

`qualify_lead` (offerte verstuurd) en `close_convert_lead` (offerte akkoord, met
waarde) staan in GA4 als belangrijke gebeurtenis en zijn **nooit gevuurd**. Dat is de
enige conversie met geld eraan, en hij staat niet op Andy's lijst. Route: enhanced
conversions for leads plus offline import uit het CRM. Nodig om te beginnen: welk
systeem de aanvragen en offertes bijhoudt. Zie punt 3 van `docs/gtm/OPEN.md`.

## Waar dit naast kan zitten

GA4 is een ondergrens: wie de cookiemelding weigert of een adblocker heeft telt niet
mee. Bij vijf leads in drie maanden is elk percentage hier zinloos; dit zijn tellingen,
geen verhoudingen.

Het venster na v18 is vijf dagen. Dat `add_to_cart` op nul staat betekent dat er in die
vijf dagen niets is toegevoegd, niet dat die tag werkt. Bewezen is alleen wat gevuurd
heeft.

## Nagekeken: wordt alles wat vuurt ook bijgehouden

Gelezen via de Data API, want de Admin API staat niet aan in Cloud-project
1015827327137 (`403, has not been used in project before or it is disabled`).

**Het onderscheid tussen de twee offertevormen is er al.** `form_id` staat als eigen
dimensie geregistreerd, `customEvent:form_id`, weergavenaam **"Fomulier"** met een
typefout. Uitgesplitst over 4 augustus t/m 2 november:

| `form_id` | `generate_lead` |
|---|---:|
| `offerte-aanvraag` | 2 |
| `product-aanvraag` | 1 |
| `(not set)` | 2 |

Die twee `(not set)` zijn van 28 augustus, vóór v11 de parameter toevoegde.

**Eén belangrijke gebeurtenis, en dat is `generate_lead`.** Gemeten als
`eventCount` naast `keyEvents` per gebeurtenis over zes maanden, 4 mei t/m 2 november.
Alleen `generate_lead` heeft `keyEvents` boven nul: 3 van de 5, want de twee van
28 augustus zijn van vóór de markering.

| Gebeurtenis | Aantal | Belangrijk |
|---|---:|---|
| `generate_lead` | 5 | **ja**, 3 |
| `form_start` | 181 | nee |
| `form_submit` | 37 | nee |
| `view_item_list` / `view_item` / `select_item` | 71 / 61 / 35 | nee |
| `contact` | 0 | **nee**, en hij is nog nooit gevuurd |

Gevolg: komt er ooit een contactformulier binnen, dan wordt hij wel vastgelegd als
gebeurtenis maar niet als conversie geteld, en hij is dan ook niet naar Ads te
importeren. Dat is één vinkje, maar GA4 laat een gebeurtenis pas markeren als hij
minstens één keer gevuurd heeft, dus dat kan nu nog niet.

`purchase` hoeft niets: dat is in GA4 van zichzelf een belangrijke gebeurtenis zodra
hij voor het eerst vuurt.

**Er loopt Leadinfo mee dat niet uit onze container komt.** Over zes maanden:
`leadinfo_interaction` 23, `leadinfo_closed_by_click` 18, `leadinfo_opened_by_click` 4,
`leadinfo_reply_clicked_ik_heb_een_vraag` 1. De Leadinfo-tag in containerversie 11 staat
op **gepauzeerd**, dus die code zit ergens anders, vermoedelijk in het thema. Niet
nagekeken, en het staat los van Andy's vraag.

## Wat ik niet kon lezen

**De bewaartermijn van de gegevens.** GA4 zet nieuwe properties standaard op twee
maanden en 14 maanden moet je zelf aanzetten; dat raakt alles wat je op een eigen
dimensie of in een verkenning bekijkt. De Admin API staat uit, dus ik kan de instelling
niet opvragen. Aanwijzing dat het al goed staat: de `form_id`-uitsplitsing levert nog
rijen op van 28 augustus, 67 dagen terug, en dat is een eigen dimensie. Zeker weten doe
je het onder Beheer, Gegevensinstellingen, Gegevensretentie.

**Welke gebeurtenissen Ads werkelijk importeert.** Dat staat in Ads en niet in GA4.
Volgens `docs/mails/2026-10-28-andy-meting-bijgewerkt.md` is "Offerteaanvraag (website)"
primair en de GA4-import secundair.
