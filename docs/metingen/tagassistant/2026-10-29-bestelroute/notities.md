# Bestelroute van begin tot eind, 29 oktober 2026

Doel: zien wat er werkelijk gebeurt van homepage tot bevestiging, zodat we weten
welke gebeurtenissen er al zijn en waar tags aan gehangen moeten worden.

Dit raakt drie punten uit het plan tegelijk: 8 (werkt het pad), 10 (wat gebeurt er
op en ná de productpagina) en 11 (e-commerce-gebeurtenissen aanzetten).

## Wat we vooraf al weten

Shopware duwt de e-commercegebeurtenissen zelf al in de dataLayer, correct
opgemaakt voor GA4. Gemeten op 29 oktober:

- catalogus: `view_item_list`, 24 items, met `price`, `item_brand`, `item_list_name`
- productpagina: `view_item`, met `item_variant`, `item_category`, `value`, `currency`

**Er luistert geen enkele tag naar.** Die gegevens worden dus weggegooid. De vraag
van deze sessie is wat de rest van de route stuurt: winkelwagen, afrekenen,
bevestiging.

## De route

1. Homepage, cookies accepteren
2. Een categoriepagina
3. Een product openen
4. Configureren en in de winkelwagen
5. Winkelwagen
6. Afrekenen of offerte aanvragen
7. Bevestiging

## Wat opviel

(in te vullen tijdens of na de sessie)

## De export

(hier komt het JSON-bestand uit Tag Assistant)
