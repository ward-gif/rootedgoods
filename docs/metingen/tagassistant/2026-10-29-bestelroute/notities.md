# Bestelroute van begin tot eind, 29 oktober 2026

Export: `tag_assistant_rootedgoods_eu_2026_10_29.json`, 9,7 MB, zes pagina's,
99 berichten in de GTM-container.

Raakt punt 8 (werkt het pad), 10 (wat gebeurt er op en ná de productpagina) en
11 (e-commerce-gebeurtenissen aanzetten) uit het verbeterplan.

## De route die gelopen is

1. homepage
2. `/alle-producten/`
3. productpagina Victorinox Spartan zakmes
4. configureren, 100 stuks, variant transparant blauw
5. winkelwagen
6. `/checkout/register`
7. `/checkout/confirm`
8. betaling afgebroken

## Wat de dataLayer stuurt

**De hele trechter zit erin, correct opgemaakt voor GA4:**

| Pagina | Gebeurtenis | Inhoud |
|---|---|---|
| catalogus | `view_item_list` | 24 items, met prijs, merk, categorie |
| catalogus | `select_item` | alleen `item_id` en `item_name` |
| productpagina | `view_item` | met variant, categorie, `value`, `currency` |
| productpagina | `add_to_cart` | **`quantity: 0` en `value: 0`, zie hieronder** |
| winkelwagen | `view_cart` | 100 stuks, staffelprijs € 24,32 |
| register | `begin_checkout` | `value: 2431.50` |
| confirm | `confirm_order` | `value: 2431.50` |

**Er luistert geen enkele tag naar.** In de hele sessie vuurden er vier tags, en
alle vier alleen bij het laden van de pagina: de GA4-tag, Microsoft Clarity,
Snitcher en Leadinfo. Op geen van de zeven e-commercegebeurtenissen vuurde iets.

GA4 kreeg dus zes paginaweergaven en verder niets. Een order van € 2.431,50 die
tot de betaalstap kwam, is in de cijfers niet van een willekeurig bezoek te
onderscheiden.

## Bug: add_to_cart stuurt nul

Op de productpagina komt `add_to_cart` binnen met `quantity: 0` en `value: 0`,
terwijl de prijs per stuk er wél in staat (€ 26,53). Eén stap later klopt
`view_cart` wel: 100 stuks tegen € 24,32, de staffelprijs.

Zouden we `add_to_cart` nu aanzetten, dan meldt GA4 elke toevoeging als nul euro.
Dat moet eerst gerepareerd worden. Staat als E6 op de Promidata-lijst.

## Geen purchase

De betaling is afgebroken, zie
`?error-code=CHECKOUT__CUSTOMER_CANCELED_EXTERNAL_PAYMENT` op de laatste pagina.
Dat is geen fout van de site maar een keuze tijdens de test. Gevolg: we hebben
`confirm_order` wel gezien en `purchase` niet. Of die laatste correct afgaat,
weten we dus nog steeds niet. Dat is het enige stuk van punt 8 dat open blijft.

## Voorbehoud: deze sessie liep op een oude container

De export noemt `Preview Environment 2 2026-08-28 013407`. De drie tags die we op
28 oktober toevoegden, ontbreken in de inventaris van deze sessie:
`Toestemming bijwerken na keuze`, `GA4 - page_view na toestemming` en
`Ads - Offerteaanvraag (website)`. Leadinfo vuurde hier nog, terwijl die in de
live container gepauzeerd staat.

Wat dit wel en niet raakt: de dataLayer-vondsten hierboven staan los van de
container, want die gebeurtenissen komt Shopware zelf brengen. Het gedrag van de
toestemming in deze sessie is wél dat van de oude opzet en zegt niets over de
huidige.

**Voor een volgende sessie:** start de voorbeeldmodus vanuit de werkruimte zelf,
niet vanuit een oud tabblad of een opgeslagen omgevingslink.

## Wat hierna moet gebeuren

1. `add_to_cart` laten repareren bij Promidata (E6).
2. Tags hangen aan `view_item_list`, `select_item`, `view_item`, `view_cart`,
   `begin_checkout` en `purchase`. De dataLayer is er al, dus dit is alleen
   koppelen.
3. Nog één sessie waarin de betaling wél wordt afgerond, om `purchase` te zien.
