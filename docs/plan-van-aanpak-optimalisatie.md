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

1. **(ik)** Lighthouse/PageSpeed Insights op 5 representatieve pagina's —
   home, een thema-pagina, een PDP, een PLP/categoriepagina, checkout — **elk
   los gemeten voor mobiel én desktop** (10 metingen totaal). Vervangt de
   schattingen uit de pre-golive-audit door echte CLS/LCP/INP/TBT-cijfers.
2. **(ik)** Robots.txt-check op rootedgoods.eu: bevestigen dat er geen
   `noindex`/disallow is meeverhuisd vanaf de dev-omgeving. **Hoogste
   prioriteit van dit hele plan** — dit is de klassieke "geen foutmelding,
   gewoon onvindbaar"-launch-fout, en elke dag die verstrijkt zonder dat we
   het checken is potentieel gemiste indexering.
3. **(ik, met jouw GSC-toegang)** Status in Search Console: is rootedgoods.eu
   geverifieerd, is de sitemap ingediend, zijn er al dekking-/indexerings-
   waarschuwingen, staat er al Core Web Vitals-fielddata (waarschijnlijk nog
   te vroeg, maar checken kost niets).
4. **(ik)** XML-sitemap: bevat die de losse thema-CMS-pagina's automatisch?
   (Open vraag uit beide audits, nog nooit echt gecheckt.)
5. **(ik)** Canonical-steekproef: een paar pagina's checken op correcte
   zelf-canonical (geen dubbele indexering via met/zonder trailing slash).
6. **(ik)** Mixed-content/oud-domein-steekproef: nog ergens een hardcoded
   verwijzing naar `http://` of naar `bambook.08.promidata.shop`? (De
   font-URL's van vandaag waren zo'n geval — goed mogelijk dat er nog meer
   zijn, bv. in CMS-rich-text-afbeeldingen.)

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

Gebruikt de Fase 0-cijfers om te bepalen welke van onderstaande het zwaarst
weegt; de bekende kandidaten uit de audit zijn:

1. **(ik)** CLS: `width`/`height` (of `aspect-ratio`) op alle content-`<img>`
   die dat nog missen — audit noemde specifiek de hero-collage
   (`.rg-page-hero__img`), `.rg-feature-row__img` en product-slider-beelden.
2. **(ik)** Hero-hoogte-JS herzien (`rootedgoods.js` ~510-521): zet nu ná de
   eerste paint `minHeight` via `getBoundingClientRect`/`ResizeObserver` →
   veroorzaakt een layout-shift ná paint. Grootste concrete CLS-bron die al
   geïdentificeerd is.
3. **(ik)** LCP: `fetchpriority="high"` + expliciete dimensies op het
   hero-beeld; Playfair-`h1` swap-gedrag herchecken op tekst-shift.
4. **(ik)** INP: de zware `MutationObserver` (subtree:true op
   `document.documentElement`) vervangen door een scherper gescoped
   variant.
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
1. **(ik)** `FAQPage`-schema bouwen vanuit `faq-bron.md` (bron staat al
   compleet klaar, 232 regels, per pagina getagd).
2. **(ik)** `Person`-schema (Richard/Ward/Marco) als `employee` van
   Organization.
3. **(ik)** `Service`-schema voor de vier servicepagina's (personalisatie,
   verzending, warehousing, full-service).
4. **(ik)** Overzichtspagina's missen een `<h1>` (services-overzicht
   bevestigd h1=0; merken/thema-overzicht vermoedelijk ook) — losse,
   snelle fix.
5. **(Ward, CMS)** `<title>` + meta-description per pagina invullen/
   controleren op uniciteit — grootste hefboom uit de pre-golive-audit,
   ligt bij jou in Shopware. **(ik)** lever een geprioriteerde lijst welke
   pagina's het eerst (hoogste verkeer/omzetpotentie) als dat helpt.

**Wacht op plugin-bevestiging (volgende week):**
6. Zodra de plugin live is: **(ik)** checken wélke schema's hij dekt
   (`Organization`/`WebSite`/`BreadcrumbList`/`Product` zijn de verwachte,
   maar dat was in Promidata's eigen testomgeving nog niet 100% zeker) via
   view-source + de Rich Results Test.
7. **(ik)** Alleen de schema's zelf bouwen die de plugin *niet* dekt of
   onvolledig invult (bv. verzendtijd/retourbeleid-velden die nu in de
   testomgeving Duitse demo-waarden tonen — checken of dat bij Rooted Goods
   goed vanuit de eigen Shopware-instellingen komt).
8. **(samen)** Breadcrumbs heroverwegen: nu verborgen via CSS op thema/
   service/merken. Beslissing hangt af van of de plugin al `BreadcrumbList`
   meestuurt zonder zichtbare UI (dan hoeft er niets aan het oog te
   veranderen) — pas na punt 6 een echte keuze te maken.
9. **(ik)** Interne links steviger: spokes (thema/service-pagina's) linken nu
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
