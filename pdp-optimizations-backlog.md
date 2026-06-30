# Optimization Backlog — PDP & PLP

Verzameldoc voor toekomstige verbeteringen aan de Product Detail Page (PDP) en Product Listing Page (PLP) van rootedgoods.eu vanuit CRO / UX / UI perspectief. Niet alles hoeft direct — dit is een prioriteitsbacklog die we door de tijd heen aanvullen en afvinken.

---

# PDP — Product Detail Page

---

## Hoge impact — vertrouwen & duidelijkheid

### Sociaal bewijs above the fold
Sterren-rating, aantal reviews, "X bedrijven gingen je voor" — alles zit nu verstopt achter de Beoordelingen-tab. Voor B2B is een logo-strip ("Vertrouwd door [bekende klanten]") of een testimonial vlakbij de CTA goud waard. Baymard Institute markeert dit consistent als top-3 CRO factor.

### USPs bij de buy-area
Topbar is generiek. Direct onder de prijs of CTA mis ik product-specifieke triggers: Made in Holland, Eco-gecertificeerd, levering 5-8 werkdagen, sample beschikbaar. Nu staat dat alles verspreid in description en specs.

### Levertijd-indicator bij CTA
"Verzending uiterlijk 8 werkdagen" zit pas onderaan in productietijd. Bij de "In het winkelmandje" knop hoort: "Bestel vandaag → drukproef binnen 1 dag → levering rond [datum]".

### CTA-hiërarchie heroverwegen voor B2B
"In het winkelmandje" als primary suggereert een impuls-aankoop, maar dit is een gepersonaliseerd product met drukproef en MOQ van 5/10. Voor orders boven X stuks zou "Offerte aanvragen" eigenlijk equal-weight of zelfs primary moeten zijn.

---

## Medium impact — friction & informatie

### Druk-preview / mockup
Voor promo-products is "hoe ziet mijn logo erop" de belangrijkste vraag. Nu zie je pas iets na upload. Een live-mockup of placeholder-preview ("zo komt jouw logo te staan") zou conversie hard helpen.

### Sample-button heroverwegen
Verwijderd voor visuele cleanliness, maar voor B2B is "eerst monster zien" een belangrijke trust-stap. Subtieler terugplaatsen (bv. als tekstlink onder de CTAs: "Liever eerst een sample? € 22,04") is een optie.

### Kleurnaam zichtbaar bij selectie
Drie kleur-thumbnails zonder label. Hover-tooltip of inline tekst "Geselecteerd: Forest Green" voorkomt twijfel.

### Quantity input ergonomie
Alleen typeveld, geen +/- buttons, geen visuele feedback dat 100 stuks 18,26% korting oplevert. Sterker koppelen aan de tier-tabel (selectie sync, korting-totaal).

### "Van € X" verduidelijken
Begint bij 1000 stuks maar staat zonder context. Toevoegen: "vanaf 1000 stuks (incl. opdruk vanaf €X bij 100)" of een micro-label onder de prijs.

### Voorraad / leverbaarheid
Voor production-on-order minder relevant, maar wel: "Op voorraad voor productie" of "X dagen tot eerste drukproef".

### Bruto/Netto toggle
Toggle "Prijzen incl/excl BTW" is gangbare B2B-feature. Gebruiker mag zelf kiezen welk getal hij ziet.

---

## Lager impact — UI polish & details

### Sticky buy-box bij scroll
Bij lange PDP scroll je de hele buy-section weg. Een sticky mini-bar met titel + prijs + "Toevoegen" bij scroll-down (vooral mobiel) helpt.

### Wishlist hernoemen
Wishlist voor B2B is feitelijk een offerte-shortlist. Naam veranderen naar "Toevoegen aan offerte-shortlist" of "Aan jouw lijst toevoegen".

### Description-tab structureren
Nu een paragraph van 6 regels. Bullet points met top 5 features zou veel beter scannen.

### Productietijd-blok herorganiseren
Vier regels met ", " als separator is moeilijk te lezen. Mini-tabel druktechniek → levertijd zou veel duidelijker zijn.

### Cross-sell / related products
Geen "Klanten kochten ook" of "Andere notitieboeken in deze stijl". Gemiste kans voor categorie-binding én AOV.

### Inline FAQ of "Stel een vraag"
B2B-leads hebben vaak vragen over druktechniek/MOQ. Een ingeklapte FAQ of "Vraag stellen" link bij de configurator vangt hesitation.

### Trust-elementen na de CTA
Onder "In het winkelmandje" een rij iconen: "Bestel op rekening", "Drukproef ter goedkeuring", "DHL/DPD verzending". Bevestigt waarom de gebruiker veilig kan klikken.

### Eco / Made in Europe badges
Twee unieke selling points die nu in een spec-tabel als "Ja" staan. Een visuele badge naast titel of bij gallery zou een sterke differentiator zijn.

---

## Specifiek voor B2B promo-doelgroep

### Bestel-flow voor herhaal-aankopen
Marketing-managers herbestellen vaak. "Bestel opnieuw" of "Vorige order kopiëren" workflow.

### Account-manager / contactpersoon zichtbaar
Foto + naam van contactpersoon ("Hulp nodig? Bel/mail [naam]") wint vertrouwen tov anonieme webshop.

### Custom quote-flow voor complexe orders
Voor 1000+ stuks of meerdere producten: een echte quote-builder ipv standaard PDP-flow.

---

## Top 3 om mee te beginnen
Als prioriteit (mijn aanbeveling):
1. **Sociaal-bewijs strip** onder de titel — laagste werk, hoogste impact
2. **Levertijd-indicator** bij de CTA — wegnemen van expliciete onzekerheid
3. **Productspecifieke USPs blok** onder de prijs — Made in Europe, Eco, Bestel op rekening

---

---

# PLP — Product Listing Page

## Hoge impact

### "Nieuw"-badge devalueert
Verschijnt nu op elke tile, dus het signaal is leeg. Promidata-todo: laat de badge alleen verschijnen voor producten met release-datum < 30 dagen, of haal 'm helemaal weg en gebruik 'm alleen ergens prominent (bv. "Nieuw deze maand" filter).

### Geen resultaten-count
Boven de grid mist "X producten". Helpt scope te begrijpen voor klanten met grote orders en verbetert filter-feedback ("3 → 12 resultaten").

### Geen actieve filter chips
Nadat klant een filter selecteert (bv. "Eco: Ja"), is er geen visuele samenvatting van actieve filters bovenaan. Standaard PLP-pattern: pill-row met x'jes om filters te wissen.

### Filter sidebar + filter buttons — kies één
Nu zowel filter-pillen bovenaan ALS sidebar met categorieën. Beslis: filter-pillen mogen blijven (of in sidebar verhuizen) en categorieën in sidebar. Niet beide.

### Geen quick-view of hover-preview
Voor gepersonaliseerde producten waarbij je verschillende varianten/kleuren wil zien — een hover-preview met meer info (extra foto, "Vanaf X stuks") zonder PDP te openen reduceert friction.

## Medium impact

### Vanaf-prijs context
"Van € 4,49" zonder MOQ-info. Voeg toe: "vanaf 25 stuks" of vergelijkbaar — anders verwacht klant dat product € 4,49 per stuk kost vanaf 1.

### Made in Europe / Eco visuele markers
Twee unieke selling points die we niet visualiseren op de tiles. Kleine icoon-rij links onder de prijs ("EU + Eco-leaf icon") zou positioneren zonder ruimte te kosten.

### Variant thumbnails
Mooi dat ze er zijn, maar:
- Geen kleurnaam-tooltip (wel via title attribuut maar pas bij hover)
- Onclick toont variant maar URL wijzigt niet meteen — kan verwarring geven
- Aantal varianten zichtbaar maken ("3 kleuren") helpt scannen

### Pagination zichtbaarheid
Niet zichtbaar in screenshot. Check: bij meer producten dan past, is er load-more / pagination? Infinite scroll is niet ideaal voor B2B (verloren scroll-positie bij terugklik).

### Sticky filter/sort bar
Bij scroll naar beneden verdwijnen filter-pillen en sortering. Sticky bar (alleen filter+sort, niet de hele header) helpt bij lange listings.

### Sort dropdown styling
Bootstrap default select. Zelfde rounded-input-styling als de filter-pillen voor consistentie.

## Lager impact — UI polish

### Image consistentie
Productfotos hebben wisselende aspect-ratios. Een vaste `aspect-ratio` op `.product-image-wrapper` (bv. 1:1 of 4:5) maakt grid uniform.

### Hover-effect voor variant thumbnails
Inline `onmousemove` voor swap-on-hover werkt, maar:
- Geen smooth transition
- Geen visuele indicatie welke variant je nu bekijkt
- Mobile heeft geen hover dus feature niet beschikbaar

### "Bekijk alle producten" wanneer minder dan grid-fill
Als 4-9 producten in een categorie, voelt de pagina leeg. Cross-link naar "andere kantoorartikelen" of "alle producten" in lege grid-cellen.

### B2B specifieke "Toevoegen aan offerte"
In plaats van wishlist-icoon: "+ Aan offerte". Verlaagt drempel voor klanten die niet meteen naar PDP willen maar comparing zijn.

---

*Laatst bijgewerkt: 28 april 2026*
