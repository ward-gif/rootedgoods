# Tracking Rooted Goods: nog open

Stand 30 september 2026, na GTM-versie 11 ("Tag changes voor tracking offerte en product aanvraag").

## Klaar
- Offerteformulier, productaanvraag en contactformulier vuren elk hun eigen tag. Getest in
  Tag Assistant ("Tag Assistant Verbonden 2026-09-30 v2.json").
  - offerte en product: `generate_lead`, `form_id` = `offerte-aanvraag` / `product-aanvraag`
  - contact: event `contact`

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
