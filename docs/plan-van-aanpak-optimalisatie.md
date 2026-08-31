# Plan van aanpak — optimalisatie & borging na go-live

> Aangemaakt 28 aug 2026. Dit is het uitvoeringsplan dat `pre-golive-audit.md`
> (6 aug, met placeholders) en `post-golive-audit.md` (20 aug, "pak dit erbij
> zodra live") samenvoegt tot één gefaseerde, afhankelijkheids-bewuste
> volgorde. Die twee bestanden blijven staan als ruwe bevindingen/bewijsvoering;
> dít document is de levende to-do-lijst — vink hier af, niet daar.
>
> **Buiten scope van dit plan:** `DESIGN-AUDIT.md` (visuele/merk-herziening,
> Fase 3 daarvan wacht nog op jouw akkoord). Dat is een apart, doelbewust
> losstaand traject — geen performance/SEO-impact, dus geen afhankelijkheid
> met onderstaande fasering.

## Uitgangspunten

- **Mobiel én desktop zijn geen aparte fases maar een vaste dubbele toets** bij
  elke stap hieronder — CWV-drempels en het risico op layout-breuk verschillen
  genoeg tussen beide dat "het werkt op desktop" nooit als voldoende bewijs
  telt.
- **Meten voor en na elke fase** (Lighthouse/PageSpeed, of voor SEO: GSC), zodat
  we objectief kunnen zien of een wijziging het beoogde effect had — niet
  aannemen dat een fix werkt omdat de code er logisch uitziet.
- **Bekend terugkerend risico dit hele project: browser-/CDN-cache.** Elke
  "geverifieerd"-status hieronder is altijd geverifieerd via de SHA-pinned
  fetch-techniek (cache-onafhankelijk) — dat zegt nog niets over wanneer *jij*
  of een bezoeker de wijziging daadwerkelijk te zien krijgt. Fase 1 pakt de
  structurele oorzaak hiervan aan, juist omdat die alle latere fases vertraagt
  als hij blijft liggen.
- Bij elk punt staat wie 'm oppakt: **(ik)** = ik kan dit direct in code/config
  doen, **(Ward)** = vereist iets buiten mijn bereik (Shopware-backend,
  Promidata-contact, account-toegang), **(samen)** = ik lever voor, jij
  beslist/plakt.

---

## Fase 0 — Nulmeting (voorwaarde voor alles hierna)

Zonder dit werken we blind: de pre-golive-cijfers waren expliciet schattingen
"met nog placeholders in beeld". Nu de site live staat met echte content is
dit de eerste keer dat een meting betekenis heeft.

1. ✅ **(ik) Lighthouse/PageSpeed Insights — 10 metingen gedraaid** (eigen
   API-key, 28 aug). Vervangt de schattingen uit de pre-golive-audit door
   echte cijfers:

   | Pagina | Type | Perf | A11y | BP | SEO | LCP | CLS |
   |---|---|---|---|---|---|---|---|
   | Home | mobiel | 60 | 76 | 96 | 92 | **35.5s** | 0.000 |
   | Home | desktop | 59 | 78 | 96 | 92 | 4.1s | 0.014 |
   | Thema (onboarding) | mobiel | 61 | 76 | 96 | 92 | **10.0s** | 0.000 |
   | Thema (onboarding) | desktop | 81 | 78 | 96 | 92 | 0.9s | 0.003 |
   | PDP (Victorinox) | mobiel | 66 | 84 | 96 | 100 | 7.1s | 0.091 |
   | PDP (Victorinox) | desktop | 64 | 76 | 96 | 100 | 1.4s | **0.361** |
   | PLP (Zakmessen) | mobiel | 72 | 82 | 96 | 85 | 4.4s | 0.041 |
   | PLP (Zakmessen) | desktop | 96 | 83 | 96 | 85 | 1.2s | 0.004 |
   | Checkout (leeg mandje) | mobiel | 56 | 85 | 100 | 58 | 9.1s | 0.000 |
   | Checkout (leeg mandje) | desktop | 93 | 87 | 100 | 58 | 1.2s | 0.002 |

   **Headline: 35,5 seconden LCP op de mobiele homepage.** Root cause
   opgezocht in de ruwe data — geen server-probleem (response-time overal
   15-50ms): de homepage laadt **11,5 MB in 214 requests, waarvan 10,6 MB
   (189 requests) alleen al afbeeldingen**. Losse voorbeelden: een
   feature-row-foto van 689 KB, één van 593 KB, meerdere productslider-
   thumbnails van 200-365 KB elk — dat zijn factor 3-10x groter dan nodig
   voor het formaat waarop ze getoond worden. Thema-pagina (3,3 MB
   afbeeldingen) en PLP (1,6 MB) hebben dezelfde soort probleem, in mindere
   mate. PDP en checkout zijn qua afbeeldingsgewicht juist prima (0,3 MB /
   0,1 MB) — dus dit is geen sitebreed CSS/JS-probleem alleen, specifiek
   **onbewerkte, te grote brongfoto's op een paar contentrijke pagina's**.
   Zie de nieuwe prioriteit #1 in Fase 2 hieronder.
   Ook opvallend: **checkout scoort SEO=58** (logisch — die pagina's staan
   terecht op `Disallow` in robots.txt, dus dit cijfer is geen zorg) en
   **PDP desktop CLS=0,361** (boven de 0,25-grens, "slecht") — root cause
   gevonden en opgelost in Fase 2 (zie daar): geen swatch-slider, maar een
   font-laad-verspringing in de desktop-only topbar-iconen.
2. ✅ **(ik) Robots.txt-check — gezond.** `Allow: /` breed, geen per-ongeluk
   meeverhuisde blanket-disallow. Wel `Disallow` op account/checkout/
   widgets/navigation/bundles/poconfigurator/livestock (allemaal terecht,
   geen content-pagina's) en een `Crawl-delay: 5` (klein, geen actie nodig).
   Sitemap correct gerefereerd.
3. **(ik, met jouw GSC-toegang)** Status in Search Console: is rootedgoods.eu
   geverifieerd, is de sitemap ingediend, zijn er al dekking-/indexerings-
   waarschuwingen, staat er al Core Web Vitals-fielddata (waarschijnlijk nog
   te vroeg, maar checken kost niets). *(Nog te doen — vereist jouw GSC-login.)*
4. ✅ **(ik) XML-sitemap gecheckt — bevestigt een echt gat.** De sitemap bevat
   alleen categorieën, producten en een paar vaste juridische pagina's. **Alle
   Landing Pages ontbreken volledig**: `/contact`, `/over-ons`, `/faq`,
   `/offerte`, `/services/` (uitzondering: deze laatste zit er zelf niet in
   maar heeft wél een eigen canonical, zie punt 5) en alle "mooie" thema-URL's
   (`/onboarding-welkomstpakket`, `/eindejaarsgeschenken`, enz.) — dit zijn in
   Shopware **Landing Pages**, een ander content-type dan Category, en
   Shopware's sitemap-generator neemt dat type niet mee. Zie Fase 3 hieronder
   voor de vervolgstappen.
5. ✅ **(ik) Canonical-steekproef — inconsistent.** `/services/` heeft een
   correcte zelf-canonical. `/contact`, `/over-ons` en `/eindejaarsgeschenken`
   hebben **geen enkele canonical-tag**. Zelfde patroon als punt 4: lijkt
   samen te hangen met het Landing Page-type, niet uniform kapot of uniform
   goed.
6. **(ik)** Mixed-content/oud-domein-steekproef: nog ergens een hardcoded
   verwijzing naar `http://` of naar `bambook.08.promidata.shop`? (De
   font-URL's van vandaag waren zo'n geval — goed mogelijk dat er nog meer
   zijn, bv. in CMS-rich-text-afbeeldingen.) *(Nog te doen.)*

### 🔴 Nieuwe bevinding: Search Console kan de sitemap niet ophalen

Sitemaps-rapport toont "Kan niet ophalen", ook na opnieuw indienen. Zelf
getest: bestand + onderliggende `.xml.gz` zijn gewoon bereikbaar (200,
geldige gzip, geldige XML, ook met Googlebot-user-agent). URL-inspectie's
eigen "Live testen" op dezelfde sitemap-URL **slaagt wél** (crawlen +
indexeren toegestaan, pagina succesvol opgehaald) — dat verschil (losse
test slaagt, sitemap-rapport blijft falen) wijst richting de **al bekende
agressieve bot-/abuse-detectie op de Promidata-omgeving** (blokkeerde
eerder al eens een IP na een korte uitbarsting van requests, bevestigd
door Promidata-support in een eerdere sessie) — een sitemap-crawl haalt
kort na elkaar meerdere bestanden op (index + onderliggend bestand),
precies zo'n uitbarsting-patroon.
**(Ward → Promidata)** Vraag uitgezet (samen met het WebP-verzoek
hieronder): staan Googlebot's geverifieerde IP-reeksen op een witte lijst?
Potentieel breder dan alleen de sitemap als bevestigd.

### 🔴 Nieuwe bevinding: Landing Pages missen titel/description/canonical/sitemap

Steekproef op 4 Landing Pages (`/onboarding-welkomstpakket`, `/contact`,
`/over-ons`, `/eindejaarsgeschenken`) bevestigt een systemisch (niet
incidenteel) patroon voor dit Shopware-content-type:
- `<title>` is kaal (bv. simpelweg "Onboarding", geen merknaam-suffix, geen
  keyword-rijke tekst) en meta-description is leeg.
- Geen `<link rel="canonical">`.
- Niet opgenomen in de XML-sitemap (zie punt 4).

**Er bestaat daarnaast een losse, automatisch aangemaakte Category-pagina per
thema** (bv. `/thema-s/onboarding-welkom/`, wél in de sitemap, wél met eigen
canonical) — dit is **geen bug maar een bestaande, legitieme catalogus-
structuur** ("Onze categorieën"-menu linkt er zelf naartoe): de Category-
pagina is de kale product-filterlijst, de Landing Page is de door ons
geschreven verhalende versie met dezelfde thematiek. Geverifieerd dat het
**geen dubbele content is** (983 vs. 2174 woorden, andere H1/structuur) en
dat **geen van beide naar de ander linkt** — dat laatste is wél een gemiste
kans (zwakkere topical-relevance-signalen, gebruiker die op de kale
categorie-pagina landt vindt niet de rijkere verhaal-pagina en andersom).

**Voorstel, verwerkt in Fase 3:**
1. Titel + meta-description ook voor Landing Pages invullen (**Ward**, hangt
   af van of Shopware dat veld voor dit content-type sowieso toont — checken).
2. Canonical-tag-gat navragen bij Promidata: is dit een Shopware-kernbeperking
   voor Landing Pages, of een instelling die aan staat/uit moet (**Ward** stelt
   de vraag, **ik** lever de technische omschrijving).
3. Sitemap-gat: als Promidata bevestigt dat Landing Pages structureel nooit in
   de auto-sitemap komen, overwegen een **losse, handmatig onderhouden sitemap
   voor Landing Pages** toe te voegen (Shopware ondersteunt meerdere sitemap-
   bestanden via de sitemap-index) — **(ik)** kan dat technisch opzetten zodra
   punt 2 duidelijkheid geeft.
4. Kruislink toevoegen tussen elke Landing Page en z'n Category-tegenhanger
   (bv. "Bekijk alle producten in dit thema" onderaan de Landing Page, linkend
   naar `/thema-s/xxx/`) — **(ik)**, lage moeite, versterkt zowel SEO als UX.

**Resultaat van deze fase:** een concreet, cijfermatig prioriteitenlijstje in
plaats van de kwalitatieve inschatting uit de pre-golive-audit — fase 2 en 3
hieronder worden ná deze meting eventueel herschikt als de cijfers iets anders
laten zien dan verwacht.

---

## Fase 1 — Stille risico's eerst (kleine moeite, grote schade als het fout staat)

Dit zijn dingen die *geen foutmelding geven* als ze mis zijn — ze kosten
gewoon stil omzet of vindbaarheid. Vandaar vóór de "normale" optimalisatie-
fases, ongeacht wat de Fase 0-cijfers laten zien.

1. **(Ward, ik lever de tekst)** Cache-structurele fix opnieuw bij Promidata
   aankaarten (staat al open sinds 21 aug, nooit bevestigd afgehandeld) —
   `promidata-todos.md` beschrijft de oplossing al concreet: een
   versie-query in de theme-`<link>/<script>` (`rootedgoods.css?v=3`,
   ophogen per release) i.p.v. leunen op `@main` + purges. Dit is geen
   incidentele bug maar de reden dat **elke** toekomstige CSS/JS-wijziging in
   dit hele plan trager zichtbaar wordt dan nodig — vandaar vroeg in de
   volgorde, niet omdat het zelf een CWV/SEO-punt is.
2. **(Ward)** Contactformulier, offerteformulier en Cal.com-boekingsknop
   end-to-end testen — daadwerkelijk versturen/boeken, niet alleen visueel.
   Een kapot leadformulier na go-live is het duurste soort bug: geen
   foutmelding, gewoon gemiste aanvragen.
3. **(Ward, CMS)** Verouderde links in het "Services & ontzorging"-blok op de
   homepage herplakken (`/fulfillment-warehousing` → `/warehousing-
   fulfillment`, `/verzending-meerdere-locaties` → `/verzending-naar-
   meerdere-locaties`) — de juiste versie staat al klaar in
   `home-services-blok.html`, alleen het live CMS-blok is nog de oude.
4. **(ik)** Steekproef van de interne links die deze sessie zijn gefixt
   (offerte-CTA die naar /contact linkte, thema-overzicht-tegels) nog eens
   bevestigen op het huidige live domein.

---

## Fase 2 — Core Web Vitals & performance

Fase 0 heeft de prioriteit al bepaald — dit is geen open vraag meer.

0. 🟡 **(Ward, media-workflow — CMS-foto's al aangepakt) Afbeeldingsgewicht,
   nu nog de productthumbnails.** 35,5s mobiele LCP op de homepage kwam
   voor het overgrote deel door 10,6 MB aan afbeeldingen (189 requests).
   **Update 28 aug:** Ward heeft de handmatig geüploade CMS-foto's al
   gecomprimeerd — homepage 11,5→9,6 MB, thema-pagina 4,4→3,3 MB. Resterende
   hefboom zit nu in de **productthumbnails uit Promidata's feed**
   (`/shared/thumbnail/..._800x800.png`): gemeten dat één zo'n thumbnail
   374 KB was als PNG, 53 KB als JPEG op exact dezelfde resolutie (-86%) —
   PNG comprimeert foto-detail simpelweg slecht. **Vraag al uitgezet bij
   Promidata**: thumbnail-generatie omzetten naar WebP (lossy, ~kwaliteit
   80, behoudt transparantie i.t.t. JPEG). AVIF genoemd als optionele bonus
   als hun pipeline dat makkelijk aankan, niet als vervanging van het
   WebP-verzoek (AVIF kost aanzienlijk meer encodeer-tijd, zwaardere ask
   voor een pipeline die mogelijk meerdere winkels bedient).
   - ✅ **`loading="lazy"` steekproef — gecheckt (31 aug).** Uitkomst is
     concreter dan verwacht: de 133 productslider-thumbnails op de homepage
     (samen 6,56 MB — 79% van de totale beeld-lading) staan HELEMAAL NIET in
     de server-gerenderde HTML. Promidata's eigen slider-plugin injecteert ze
     zelf via JS (vermoedelijk uit een `data-`-template), dus er is geen
     `<img loading="...">`-attribuut in de brontekst dat ik kan zetten of
     overschrijven — dit valt buiten CSS/JS-bereik, het zit in hun
     closed-source plugin-code. **Nieuw punt voor de eerstvolgende
     Promidata-vraag**: laadt de slider al zijn slides in één keer (ongeacht
     zichtbaarheid), of is er een instelling/parameter om dat lazy te maken?
   - **Meten na fix (31 aug, PSI mobiel, ná CLS/CTA/schema-fixes van deze
     sessie):**
     - **PDP: CLS 0,361 → 0,087** (van "slecht" naar "goed", ruim onder de
       0,1-grens) — bevestigt de topbar-icoon-fix rechtstreeks.
     - **Home: LCP nog steeds 29,6s** (nauwelijks beter dan de 35,5s
       baseline) — de `fetchpriority=high`-fix op de hero-tegels hielp dus
       niet merkbaar, want de hero is niet de bottleneck. Het zijn wel
       degelijk de 133 productslider-thumbnails (6,56 MB, hierboven) die de
       LCP-race domineren; dat blijft dus volledig hangen op Promidata's kant
       (WebP-verzoek + de nieuwe lazy-load-vraag hierboven).
1. ✅ **CLS beeld-afmetingen** — gecheckt, blijkt al opgelost door eerder
   CSS-werk deze sessie: `.rg-page-hero__img` (vaste `height` via `clamp()`
   op de grid-ouder `.rg-page-hero__media`), `.rg-feature-row__img`
   (`aspect-ratio: 4/3`) en de product-slider-beelden (`height:0` +
   `padding-bottom`-truc op `.product-image-wrapper`) reserveren allemaal al
   ruimte vóór het laden. Geen actie nodig.
   **PDP desktop CLS=0,361 — opgelost (28 aug).** Root cause via PSI's
   `layout-shifts`-audit (niet de gok op de swatch-slider): 98% van de score
   (0,354) kwam van "Web font loaded" op `fa-solid-900.woff2`. Live HTML-check
   wees uit dat de topbar (desktop-only, `d-none d-lg-block`) nog 4×
   `<i class="fa-solid fa-check">` gebruikt i.p.v. de SVG-vinkjes die
   elders al zijn doorgevoerd — de glyph-breedte verspringt zodra het
   icon-font async binnenkomt, wat de hele topbar (en dus alles eronder,
   inclusief de PDP-mediakolom die de audit als "verschoven element"
   rapporteerde) een fractie optilt. Verklaart ook meteen waarom mobiel
   (topbar daar sowieso verborgen) een prima CLS had. Fix: vaste
   `width:1em;height:1em` box op `.top-bar-nav .fa-solid/.fas`
   (rootedgoods.css, sectie 5) — icoon kan niet meer van grootte
   veranderen ongeacht wanneer het font laadt. **Nog open, apart punt:** de
   topbar-USP's zelf in het CMS staan alsnog op FA i.p.v. SVG (comment in de
   CSS suggereerde dat dat al was omgezet) — geen actie nu, puur informatief
   voor als Ward dat blok ooit opnieuw plakt.
2. ✅ **Hero-hoogte-JS — al opgelost, code alleen nog niet opgeruimd.** De
   audit-vondst sloeg op de OUDE hero (`.rgh`, `rootedgoods.js` §2.1,
   ~regel 832-848: `fitHero()` + een blinde `setTimeout(fitHero, 400)`
   "extra pas" ná paint — precies het post-paint-springgedrag dat CLS
   veroorzaakt). Gecheckt tegen alle gecachete live pagina's: **geen enkele
   gebruikt nog `.rgh`** — de homepage draait al op `.rg-hero-v2` (§2.4,
   ~regel 1073), een latere herschrijving die dit probleem al structureel
   oplost: `DOMContentLoaded`-getimed (niet `window.load`), herberekent
   via `ResizeObserver` op de daadwerkelijke logo-slider (reactief i.p.v.
   een tijd-gok), plus een scroll-guard tegen de "kapotte hero na
   heen-en-weer scrollen"-bug. Geen actie hier nodig. **Toegevoegd aan
   item 6 (dode code) hieronder**: de oude `.rgh`-hero (JS §2.1 + het bijbehorende
   `blokken/hero-sectie.html`/`blokken-def/hero-sectie.html`) is een concrete
   kandidaat om te verwijderen zodra de dode-code-sweep loopt.
3. ✅ **LCP hero-beeld — afgerond (28 aug).** `blokken/hero-sectie-v2.html`
   (de live homepage-hero) had al `width="400" height="400"` +
   `loading="eager"` op alle 4 mozaïek-tegels; toegevoegd:
   `fetchpriority="high"` op diezelfde 4 (zowel `blokken/` als de
   comment-vrije `blokken-def/`-versie — nog wel opnieuw te plakken door
   Ward). Playfair-`h1` swap-check: al goed, `font-display: optional`
   staat al op alle 6 gewichten (bewuste eerdere keuze, zie CSS-comment
   sectie 0) — bij een trage font-load blijft de fallback-serif de hele
   paginalevensduur staan i.p.v. later te wisselen, dus geen tekst-shift
   mogelijk. Geen verdere actie.
4. ✅ **INP — afgerond (28 aug), maar andere observer dan verwacht.** De
   productslider-observer (`document.documentElement`, sectie 2.0) bleek al
   eerder gefixt: scant nu alleen toegevoegde nodes en disconnect bij vondst
   / op `window.load` (comment in de code documenteert dit zelf al als "de
   pre-golive-audit's zwaarste INP-post"). De ECHTE nog-openstaande zware
   observer zat elders: de winkelmand/checkout-prijsdetail-toggle (§"WINKELMAND/
   CHECKOUT", ~regel 1975) draaide op `document.body` (subtree:true), deed
   op ELKE mutatie een document-brede `querySelectorAll`, en disconnect'te
   nooit (moet ook echt voor de volledige paginalevensduur blijven leven,
   voor latere AJAX-hoeveelheidswijzigingen). Nu hetzelfde scoped-node-scan-
   patroon toegepast: alleen de daadwerkelijk toegevoegde nodes per mutatie
   checken i.p.v. een herhaalde document-brede query.
5. **(Ward, hosting/CDN-vraag)** CSS/JS-gewicht: 228 KB onverkleind + geen
   `.min`-pad via jsDelivr. Zelf minifiëren voor push, of Promidata vragen om
   een gebuild/geminificeerd pad te serveren.
6. **(ik)** Dode-code- en consistentie-check op `rootedgoods.css`/`.js` —
   nog niet eerder gedaan, en na maandenlang incrementeel bouwen (11.000+
   regels CSS) realistisch dat er selectors bijzitten die nergens meer op
   matchen (bv. na een CMS-blok-herbouw of een teruggedraaide poging, zoals
   het mobiele hamburgermenu-herontwerp dat eerder deze sessie is
   teruggedraaid). Concreet:
   - Selectors zoeken die geen enkel element op de live site raken (grep
     klasse-namen uit de CSS tegen de daadwerkelijke HTML/CMS-blokken).
   - **Concrete al-gevonden kandidaat (28 aug, via Fase 2 item 2)**: de oude
     `.rgh`-hero — CSS-sectie rond regel 6282 (`.rgh{...}`, `.rgh__*`) +
     `rootedgoods.js` §2.1 (~regel 745-849, logo-slider-opbouw + `fitHero`)
     + `blokken/hero-sectie.html`/`blokken-def/hero-sectie.html`. Bevestigd
     dat geen enkele gecachete live pagina nog `.rgh` gebruikt (homepage
     draait op `.rg-hero-v2`) — vermoedelijk een eerdere iteratie die is
     vervangen zonder de oude versie op te ruimen. Nog niet verwijderd:
     bewaard voor de gecombineerde sweep hieronder i.p.v. een losse
     tussentijdse deletie.
   - Duplicaten/near-duplicaten consolideren waar dat *zonder visueel risico*
     kan (bv. twee bijna-identieke `box-shadow`-waarden die overduidelijk
     dezelfde bedoeling hadden) — puur opschonen, geen herontwerp.
   - **Grens met `DESIGN-AUDIT.md`**: die audit signaleerde al hetzelfde
     soort ruis (108× hardcoded `#2d4528` vs. 3× via token, 992×
     `!important`, 18 bijna-gelijke shadow-varianten) maar behandelt het als
     *visueel systeem-vraagstuk* (Fase 4 daar, wacht nog op jouw akkoord).
     Hier gaat het alleen om **veilig, mechanisch opschonen** (dode selectors
     weg, evidente duplicaten samenvoegen) — geen tokens/kleuren/spacing
     herontwerpen. Puur zoek-en-verwijder werk vooraf, verkleint bovendien
     hoeveel er ooit ook door Fase 4 van het design-traject moet.
   - Ongebruikte JS-functies/event-listeners identificeren (bv. resten van
     eerder teruggedraaide experimenten die nooit zijn opgeruimd).
7. **(ik)** Lighthouse-hermeting na 1-6 om te bevestigen dat de cijfers ook
   echt verbeterd zijn (niet aannemen).

---

## Fase 3 — SEO-fundament

Deels parallel aan Fase 2 te doen, met één harde afhankelijkheid: de
Promidata Structured Data-plugin komt **waarschijnlijk volgende week live**.
Om dubbel werk (en risico op tegenstrijdige JSON-LD) te voorkomen, splitsen we
in "kan al" en "wacht op plugin-bevestiging".

**Kan al, geen plugin-overlap mogelijk:**
1. ✅ **`FAQPage`-schema — al gebouwd én live.** Gecontroleerd: `blokken/
   faq.html` bevat de volledige, correcte JSON-LD (1-op-1 matchend met de
   zichtbare vragen); live-check op `/faq` bevestigt 'm staand en de
   Shopware-sanitizer overleefd (het risico dat het bestand zelf al
   documenteerde). Geen actie nodig.
2. ✅ **`Person`-schema — gebouwd (28 aug), nog te plakken door Ward.**
   Toegevoegd als `employee`-array op de bestaande Organization-JSON-LD in
   `blokken/rootedgoods.html` (+ `blokken-def/`-versie): Richard, Ward,
   Marco, allen `jobTitle: "Oprichter"` (enige rol die de site zelf noemt,
   via de Founders.jpg-alt op /over-ons) — geen achternamen, die staan
   nergens publiek. **Let op:** dit bestand is (zoals de eigen comment
   erin al uitlegt) GEEN sitebreed blok — moet apart herplakt worden op elke
   pagina/layout die 'm gebruikt (faq/contact/offerte hadden 'm al, home/
   over-ons/alle-producten/alle-thema-s nog niet).
3. ✅ **`Service`-schema — al gebouwd én live op alle 4.** Gecontroleerd:
   personalisatie, verzending, warehousing en full-service hebben elk al
   een correcte `Service`-JSON-LD (met `provider`, `areaServed: "Europe"`,
   beschrijving) — live bevestigd op alle 4 URL's. Geen actie nodig.
4. ✅ **Overzichtspagina's `<h1>` — gefixt (28 aug).** Bevestigd: `/services/`,
   `/merken/` én `/alle-thema-s` hadden alle drie `h1=0` (top-kop was
   `<h2 class="rg-theme-heading">`, geen enkele h1 ernaast op de pagina).
   Tag gewijzigd naar `<h1>` in `blokken/services-overzicht.html`,
   `merken-overzicht.html`, `thema-overzicht.html` (+ `blokken-def/`-versies).
   CSS-specificiteitsregel (rootedgoods.css, sectie met `.rg-theme-heading`)
   uitgebreid met `h1.rg-theme-heading` naast de bestaande `h2`-variant,
   anders verliest de font-size-clamp het van de sitewide `h1{font-size:4rem}`-
   regel. **Nog te plakken door Ward** op alle 3 pagina's.
5. **(Ward, CMS)** `<title>` + meta-description per pagina invullen/
   controleren op uniciteit — grootste hefboom uit de pre-golive-audit,
   ligt bij jou in Shopware. **(ik)** lever een geprioriteerde lijst welke
   pagina's het eerst (hoogste verkeer/omzetpotentie) als dat helpt.
   **Concreet bevestigd tijdens Fase 0** dat dit voor Landing Pages
   (`/contact`, `/over-ons`, alle thema-URL's) nog helemaal leeg staat — zie
   de bevinding in Fase 0 voor de volle omvang.
6. **(Ward → Promidata, ik levert de vraag)** Canonical-tag-gat op Landing
   Pages navragen: Shopware-kernbeperking voor dit content-type, of een
   instelling? Bepaalt of dit een code-fix, een Shopware-instelling, of iets
   is dat we structureel niet kunnen oplossen (en dan bewust accepteren).
7. **(ik, na punt 6)** Sitemap-gat voor Landing Pages: als bevestigd dat dit
   nooit automatisch meekomt, een losse handmatige sitemap toevoegen aan de
   sitemap-index.
8. **(ik)** Kruislink Landing Page ↔ bijbehorende Category-pagina (bv.
   "Bekijk alle producten in dit thema" op de Landing Page, linkend naar
   `/thema-s/xxx/`) — lage moeite, versterkt SEO-relevantie én UX-navigatie
   tussen de twee parallelle structuren.

**Wacht op plugin-bevestiging (volgende week):**
9. Zodra de plugin live is: **(ik)** checken wélke schema's hij dekt
   (`Organization`/`WebSite`/`BreadcrumbList`/`Product` zijn de verwachte,
   maar dat was in Promidata's eigen testomgeving nog niet 100% zeker) via
   view-source + de Rich Results Test.
10. **(ik)** Alleen de schema's zelf bouwen die de plugin *niet* dekt of
    onvolledig invult (bv. verzendtijd/retourbeleid-velden die nu in de
    testomgeving Duitse demo-waarden tonen — checken of dat bij Rooted Goods
    goed vanuit de eigen Shopware-instellingen komt).
11. **(samen)** Breadcrumbs heroverwegen: nu verborgen via CSS op thema/
    service/merken. Beslissing hangt af van of de plugin al `BreadcrumbList`
    meestuurt zonder zichtbare UI (dan hoeft er niets aan het oog te
    veranderen) — pas na punt 9 een echte keuze te maken.
12. **(ik)** Interne links steviger: spokes (thema/service-pagina's) linken nu
    niet consequent terug naar hun hub-pagina.

---

## Fase 4 — GEO (AI-antwoorden/citeerbaarheid)

Bouwt letterlijk voort op Fase 3's `FAQPage`-schema en entiteits-koppeling —
vandaar erna, niet parallel.

1. **(ik)** `Organization` + `sameAs` zodra er social-profielen zijn om naar
   te linken (nu bewust leeg).
2. **(samen)** Antwoord-eerst samenvattingen in bestaande content — dit is
   copywriting, geen code; ik kan per pagina een concreet voorstel-zinnetje
   aanleveren, jij/wij beslissen samen of het past bij de tone-of-voice.

---

## Fase 5 — Toegankelijkheid

Kan grotendeels parallel aan de andere fases (lage impact op andere code),
maar apart benoemd zodat het niet ondersneeuwt — precies wat er twee keer
(pre- én post-golive-audit) is blijven liggen.

1. **(ik)** Cognac-eyebrow-contrast: `#CA853F` op crème `#F7F5F2` ≈ 2.8:1,
   onder WCAG AA (4.5:1 voor tekst). Donkerder oker of groter/vetter maken.
   Concreet, klein, twee keer genoteerd en nog steeds niet opgepakt.
2. **(ik, nieuw n.a.v. vandaag)** Zoom/reflow-toets op de belangrijkste
   flows (checkout, PDP, PLP) op 200% en 400% browser-zoom — de officiële
   WCAG 1.4.4/1.4.10-toets, niet hetzelfde als een viewport verkleinen.
   Vandaag ontdekten we dat een grotere systeem-tekstgrootte een prijs naar
   2 regels liet breken; een structurele zoom-toets vangt dat soort dingen
   voortaan vóórdat een gebruiker het meldt.

---

## Fase 6 — Doorlopende borging (geen eindpunt)

Dit is geen fase die je "afvinkt" maar een ritme dat blijft lopen na de
eerste vijf fases.

1. **(ik/Ward)** 404-monitoring via GSC's paginarapport — steekproefsgewijs
   elke paar weken, sneller als er een grote CMS-wijziging is geweest.
2. **CWV-fielddata (Chrome UX Report)** pas na 3-4 weken voldoende verkeer
   zinvol te bekijken in Search Console — noteer dit als "check rond eind
   september", niet nu al proberen te interpreteren.
3. **(ik)** Rich Results Test-steekproef zodra de JSON-LD (Fase 3) live
   staat, om te bevestigen dat Google het ook echt als geldig herkent, niet
   alleen technisch valide.
4. **(samen)** Bij elke nieuwe feature/pagina voortaan dezelfde dubbele
   mobiel+desktop-toets als in dit plan, i.p.v. dat achteraf als aparte
   "mobile feedback"-ronde te doen — borgen i.p.v. herhaaldelijk repareren.

---

## Openstaand van eerdere sessies, nog niet in een fase ondergebracht

- `promidata-todos.md` punt 1: `productboxMinWidth` op de homepage-
  productslider (Promidata's eigen advies: 300 → 400 op desktop). Onze eigen
  JS-patch (`rootedgoods.js`) overschrijft dit al responsief (130/250px) —
  checken of dat advies daarmee al is opgelost of nog los relevant is voor
  het ongepatchte gedrag op zeer brede schermen (>1900px).

## Volgorde-samenvatting

```
Fase 0 (meten)  →  Fase 1 (stille risico's)  →  Fase 2 (CWV) ⟷ Fase 3 (SEO)
                                                        ↓
                                                   Fase 4 (GEO)
Fase 5 (toegankelijkheid): parallel, niet blokkerend
Fase 6 (borging): doorlopend vanaf hier
```
