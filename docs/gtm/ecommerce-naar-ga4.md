# E-commerce naar GA4

Live sinds containerversie 18, 29 oktober 2026.

## Wat er staat

Acht GA4-gebeurtenistags op de gebeurtenissen die Shopware zelf al in de dataLayer
zet: `view_item_list`, `select_item`, `view_item`, `add_to_cart`, `view_cart`,
`begin_checkout`, `confirm_order` en `purchase`.

Er hoefde niets gebouwd te worden aan de dataLayer-kant. Shopware stuurt alles al,
correct opgemaakt. Er luisterde alleen niets.

## De val waar ik in trapte

De tags vuurden meteen, maar stuurden alleen de gebeurtenisnaam. De live aanroep
was letterlijk `en=view_item&_et=13` en verder niets.

Oorzaak: via de API kun je `sendEcommerceData: true` zetten, maar **de keuze van
de gegevensbron is een aparte parameter die `getEcommerceDataFrom` heet**, met
waarde `dataLayer`. Zonder die parameter toont de interface wel "Data Layer" als
standaard, maar stuurt de tag niets mee. Vier andere schrijfwijzen worden door de
API stilzwijgend weggegooid.

**De les die duurder was:** Tag Assistant liet zien dat de dataLayer het hele
e-commerceobject bevatte op het moment dat de tag vuurde. Dat is niet hetzelfde
als dat de tag het verstuurt. Controleer een meting altijd op de verstuurde
aanroep, niet op de dataLayer.

## Hoe je het narekent

Open de site met de netwerktab open, filter op `g/collect`, en kijk naar de
parameters van een aanroep met `en=view_item`:

```
cu  = EUR
epn.value = 26.53
pr1 = nmVictorinox Spartan zakmes~idA508-267111-335999999~pr26.53
      ~vatransparant blauw (± PMS 288C)~caZakmessen & Multi-tools
```

Staat `pr1` er niet, dan gaat er geen product mee.

Gemeten op 29 oktober na publicatie: `view_item_list` met 24 producten,
`view_item` met waarde 26,53, `view_cart` met één product.

## Wat nog niet klopt

`add_to_cart` stuurt `qt0` en waarde 0, terwijl de stukprijs er wel in staat.
Dat is E6 op de Promidata-lijst en ligt niet aan ons: gemeten met en zonder onze
eigen `rootedgoods.js`, identiek. De tag staat er bewust wel in, want het aantal
keren dat iemand iets toevoegt klopt wel, en zonder die stap heeft de trechter
een gat. In de tag staat een notitie die dat uitlegt.

`purchase` is nog nooit gezien. De tag staat klaar en vuurt zodra een bestelling
werkelijk wordt afgerond. Beide testbestellingen zijn bij de betaalstap
afgebroken.
