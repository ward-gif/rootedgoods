# Lead-meting nagelopen, 11 november 2026

## Aanleiding
Plan-punt 1/26: 3 `generate_lead` in 36 dagen in GA4, 0 formulier-events op `/offerte` en `/contact`. Is de meting stuk of is
er weinig verkeer?

## Wat is gemeten
1. **GA4 Data API** (`ga4-leads.py`, uitvoer `ga4-leads.txt`), 6 okt t/m 11 nov. Alleen sessies met toestemming.
   `generate_lead` 3 (2 gebruikers, alle `form_id=product-aanvraag`, op `/poconfigurator/request`), `contact` 0,
   `belafspraak_gepland` 0, `purchase` 1, `add_to_cart` 2. Betaald verkeer laatste 14 dagen: 189 sessies, 0 key events.
2. **Waarom Wards eigen tests niet in GA4 stonden.** Het gegevensfilter "Internal Traffic" (`traffic_type = internal`) staat op
   Actief en sluit het netwerk van Ward uit. Een actief filter kan niet terug naar "Testen". Zie `ga4-realtime-test*.txt` (0 rijen).
3. **Netwerktest in een wegwerpbrowser** (`netwerk-meting.mjs`, `formulier-test.mjs`). Alle eindpunten die gegevens opnemen
   (GA4, Ads, DoubleClick, Clarity, Apollo) zijn geblokkeerd; de pagina probeert wel te sturen en dat is zichtbaar. GTM laadt wel.
   Cookies aanvaard, daarna per pagina een testformulier verstuurd ("TEST, graag negeren").

## Uitkomst (`formulier-test-uitvoer.txt`)
| Pagina | POST `/custom-form/send` | GA4-event | Ads-conversie |
|---|---:|---|---|
| `/offerte` | 200 | `form_start`, `generate_lead` (`form_id=offerte-aanvraag`, ook naar `measurement/conversion`), `form_submit` | ja (`googleadservices` conversion, `1p-conversion`) |
| `/contact` | 200 | `form_start`, `contact` (`form_id=contact`), `form_submit` | nee, volgens ontwerp |

Alle pogingen met `gcs=G111`, dus met toestemming. Na het verzenden landt de bezoeker op `/custom-form/send` (bedankpagina).

## Wat dit wel en niet zegt
- De tags vuren op beide formulieren en de events dragen de juiste `form_id`. De lage aantallen komen dus door weinig gebruik,
  niet door een stuk formulier-tag.
- Niet gemeten: of GA4 en Ads de events ook accepteren (de aanroepen waren geblokkeerd om nepconversies te voorkomen), en
  een test op een telefoon. `belafspraak_gepland` staat in de code maar er is nog geen GTM-tag die er naar luistert.
- Er zijn twee testmails verstuurd naar de inbox van Rooted Goods (offerte en contact, afzender `test@example.com`).
