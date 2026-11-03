# Tracking Rooted Goods: nog open

Stand 30 september 2026, na GTM-versie 11 ("Tag changes voor tracking offerte en product aanvraag").

## Klaar
- Offerteformulier, productaanvraag en contactformulier vuren elk hun eigen tag. Getest in
  Tag Assistant ("Tag Assistant Verbonden 2026-09-30 v2.json").
  - offerte en product: `generate_lead`, `form_id` = `offerte-aanvraag` / `product-aanvraag`
  - contact: event `contact`

> **Let op, de lijst hieronder is van 30 september en punt 2 is achterhaald.**
> E-commerce naar GA4 staat live sinds containerversie 18 van 29 oktober; zie
> `ecommerce-naar-ga4.md`. Punt 5 (consent te laat) is gerepareerd op 28 oktober; zie
> `docs/metingen/2026-11-03-kanaalverdeling/LEESMIJ.md` voor het gemeten effect. Lees de
> bijgewerkte stand onderaan dit bestand.

## Nog doen
1. **Validatie controleren** aanzetten op de triggers "Verzending offerte aanvraag formulier"
   en "Verzending contact formulier" (staat uit in v11).
2. **E-commerce naar GA4.** Er is geen tag die dataLayer-e-commerce doorstuurt, dus `purchase`
   komt nooit aan (0 in GA4, laatste 28 dagen op 30 sep). Oplossing:
   - trigger: aangepaste gebeurtenis, regex
     `^(view_item_list|select_item|view_item|add_to_cart|begin_checkout|add_payment_info|purchase)$`
   - tag: GA4-gebeurtenis, `G-VT3YF07ZGB`, naam `{{Event}}`, e-commercegegevens uit datalaag
   - testen met een testbestelling: komt `purchase` met `transaction_id` en `value` binnen?
   - nog niet bevestigd dat Shopware `add_to_cart`, `begin_checkout` en `purchase` pusht;
     alleen `view_item`, `view_item_list`, `select_item` gezien.
3. **Offertes en orders terug naar Google Ads.** `qualify_lead` (offerte verstuurd) en
   `close_convert_lead` (offerte akkoord, met waarde) staan als belangrijke gebeurtenis in GA4
   maar zijn nooit gevuurd. Route: enhanced conversions for leads (gehasht e-mailadres bij
   verzending) plus offline import vanuit het CRM. Nodig: welk systeem aanvragen en offertes
   bijhoudt, en het aantal aanvragen per maand.
4. **Google Ads (Andy):** `generate_lead` primair, `contact` hooguit secundair, straks
   `purchase` primair met waarde.
5. **Consent:** Tag Assistant meldt `wasSetLate: true`; de consent-default komt te laat.
   Losstaand van bovenstaande, nakijken.

## Bijgewerkt 3 november 2026, na Andy's lijst van vijf conversies

Gemeten in GA4-property 551909322 over 4 oktober t/m 2 november (30 dagen), checkout over
drie maanden. Antwoordmail: `docs/mails/2026-11-03-andy-conversies.md`.

| Conversie | Stand |
|---|---|
| Offerte via `/offerte` | tag staat, `generate_lead` + `form_id=offerte-aanvraag` |
| Offerte vanuit een PDP | zelfde event, `form_id=product-aanvraag` |
| Contactformulier | tag staat sinds v11, **nog nooit gevuurd**: 0 events, 0 form_starts op `/contact` bij 12 paginaweergaven |
| E-commerce `purchase` | tag staat sinds v18 (29 oktober), **nog nooit gevuurd**: nul `add_to_cart` sinds publicatie, `/checkout/cart` één keer bekeken in drie maanden |
| Belafspraak (cal.com) | **niet gemeten**, en dit is de enige die we volledig zelf kunnen maken |

**Wat de cijfers over de meetketen zeggen.** Eén `generate_lead` in 30 dagen, bij 349
sessies. 16 form_submits, waarvan 9 op `/search` en de homepage, dus vrijwel zeker de
zoekbalk; 7 op een echt formulier. 65 form_starts door 28 bezoekers. Er is nergens
genoeg signaal voor slim bieden (richtlijn: dertig conversies in dertig dagen).

**De belafspraak is het eerstvolgende werk, en het is van ons.** De cal.com-embed wordt
geladen in `rootedgoods.js` sectie 1.5, namespace `kennismakingsgesprek`. Een
`Cal.ns.kennismakingsgesprek("on", { action: "bookingSuccessful" })` die
`belafspraak_gepland` in de dataLayer zet is een paar regels, zonder Promidata. Daarnaast
kan cal.com het per webhook doorgeven; dat vangt ook boekingen uit een mail of signature,
maar is zwaarder.

**De e-commercetrechter werkt, hij heeft alleen geen verkeer.** Over 29 oktober t/m
2 november, de vijf dagen sinds v18: `view_item_list` 71, `view_item` 61, `select_item` 35.
Over 4 t/m 28 oktober: alle drie nul. Dat verschil is de publicatie. De stappen daaronder
(`add_to_cart`, `view_cart`, `begin_checkout`, `confirm_order`, `purchase`) staan op nul
omdat er niemand een mandje vult, niet omdat de tags stuk zijn.
