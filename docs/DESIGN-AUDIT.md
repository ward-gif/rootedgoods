# Rooted Goods — Design Audit

Art-director-review van drie proeftuin-pagina's. Doel: de site laten ophouden
aanvoelen als AI-in-een-middag en laten aanvoelen als maandenlang bureauwerk.
Alleen design; copy en Shopware-functionaliteit blijven met rust.

**Proeftuin (dekt de meeste patronen):**
1. **Homepage** — samengesteld uit `hero-sectie-v2` → `europa map sectie` → `thema-tegels-home` → (feature-rows in CMS) → `eind-cta`
2. **Servicepagina** — `service-detail-full-service.html` (meest tekstrijk, 187 regels)
3. **Themapagina** — `thema-eindejaarsgeschenken.html` (commercieel, met productslider)

Gerenderd lokaal via Playwright + een preview-harnas op `localhost:8000`
(fonts + `rootedgoods.css` + `rootedgoods.js`, afbeeldingen vervangen door
placeholders zodat aspect-ratio-vakken de echte maatvoering tonen).

> Status: **Fase 1 + 2 afgerond, Fase 3 voorgelegd.** Nog geen code gewijzigd.

---

## FASE 1 — AUDIT (inventarisatie)

### 1.1 Design tokens: bestaan wél, worden nauwelijks gebruikt

Er is één blok merk-tokens, maar het staat **laat** in het bestand
(`rootedgoods.css` regel ~5409) en wordt structureel omzeild door hardcoded waarden.

| Token | Definitie | Werkelijk gebruik |
|---|---|---|
| `--rg-green #2d4528` | regel 5409 | **3× via `var()`** vs **108× hardcoded `#2d4528`** |
| `--rg-cognac #ad6331` | 5411 | idem patroon (51× hardcoded) |
| `--rg-cognac-light #CA853F` | 5413 | 39× hardcoded |
| `--rg-cream / line / soft` | 5414–5415 | hardcoded verspreid |
| Spacing `--rg-s1..s5` (.5/1/1.5/2/3rem) | 5417 | **lineaire** schaal, weinig gebruikt |
| Spacing `--rg-space-sm/md/lg/xl` (clamps) | 4032–4035 | **tweede, parallel** spacingsysteem |
| `--rg-text-display` clamp | 4029 | één type-token, rest hardcoded per selector |

**Conclusie tokens:** het *vocabulaire* klopt met de merkbrief, maar er is geen
*single source of truth*. Kleur, type en spacing worden per selector opnieuw
uitgeschreven. Twee losse spacingsystemen naast elkaar. Wijzigen = zoek-en-vervang
door 7.000 regels i.p.v. één token aanpassen.

### 1.2 Radius: geen schaal, zeven bijna-gelijke waarden

`8px, 10px, 12px, 14px, 16px, 18px, 20px, 50px, 50%, 999px` — allemaal in gebruik.
De verschillen tussen 8/10/12/14/16/18 zijn optisch nauwelijks betekenisvol maar
zorgen dat niets "hetzelfde familielid" is. Er is geen regel die zegt *welke*
radius *welk soort element* krijgt.

### 1.3 Shadow: 64 declaraties, ~18 verschillende varianten

Groen-getinte drop-shadows in tientallen net-iets-andere waarden
(`0 24px 55px -35px`, `0 24px 42px -22px`, `0 26px 44px -24px`, `0 30px 60px -30px`…),
plus een paar neutrale `rgba(0,0,0,…)` die niet uit het merk komen. Geen
shadow-schaal; elke kaart heeft "een beetje schaduw" zonder dat de zwaarte iets
betekent (dichtbij vs. ver, rustend vs. zwevend).

### 1.4 Specificiteit: 992× `!important`

Gevolg van het overschrijven van Shopware/Bootstrap-defaults. Werkt, maar maakt
het systeem broos: elke nieuwe regel moet de wapenwedloop mee. Relevant voor
Fase 4 (tokens en componenten moeten de `!important`-laag respecteren of vervangen).

### 1.5 Componenten & spreiding (wat raakt een systeemwijziging?)

Deze drie pagina's delen bijna alles met de rest van de site. Site-brede reuse:

| Component | # HTML-bestanden |
|---|---|
| FAQ-accordeon (`rg-sd__faq`) | **12** |
| Richard-contactblok (`rg-cta__contact`) | **9** |
| Pagina-hero (`rg-page-hero`) | **9** |
| Gecentreerde blok-titel (`rg-block-title`) | **9** |
| Feature-row 50/50 (`rg-feature-row`) | **8** |
| Eind-CTA (`rg-endcta`) | **8** |
| Compare NIET/WÉL (`rg-compare`) | **5** |
| Groen paneel (`rg-sd__panel`) | **4** |
| Service-hero (`rg-sd__hero`) | **4** |
| Donkere tegel-grid (thema/services cross-sell) | **8** |

**Implicatie:** tokens + deze ~10 componenten aanpassen = vrijwel de hele site
mee-upgraden. Ideaal voor een systeem-aanpak; ook het risico dat we bij Fase 4
per stap moeten checken wat elders omvalt.

### 1.6 Shopware-default vs. van ons

- **Shopware/Bootstrap-laag:** alle `--bs-*` overrides (gutters, tabellen, cards),
  container/grid-neutralisatie (secties 30–33), slider-nav (sectie 30 §4–5),
  PDP-tabs (sectie 20). Dit is "temmen wat het thema oplegt".
- **Van ons:** alle `.rg-*` componenten (secties 34–40+). Dit is de eigenlijke
  huisstijl-laag en waar we in Fase 4 werken.
- De grens is netjes: onze componenten zijn ge-namespaced met `rg-`. Goed nieuws
  voor gericht ingrijpen zonder het thema te breken.

---

## FASE 2 — DIAGNOSE (wat leest als AI, en waarom)

Eerst eerlijk: **dit is bovengemiddeld.** De kleur/type-taal is on-brand, er zit
een staffel-mozaïek-hero in, een asymmetrisch thema-grid, een Europa-kaart met
gloeiende punten, een NIET/WÉL-compare-blok en een genummerde stepper. Dat zijn
échte ideeën. Het probleem is niet smaak — het is **herhaling en symmetrie**: de
site gebruikt een handvol veilige patronen en herhaalt ze op elke sectie en elke
pagina, waardoor het ritme van een template ontstaat.

### 2.1 De "eyebrow → Playfair-kop → subline → 2 knoppen"-sjabloon op élke sectie

- Full-service: **5 kickers** op één pagina (`SERVICES · …`, `VAN IDEE TOT BEZORGING`,
  `ONDERDEEL VAN JE TRAJECT`, `WAAROM BEDRIJVEN KIEZEN…`, `GOED OM TE WETEN`).
- Homepage: `GEWORTELD IN EUROPA`, `ZET EUROPA WEER OP DE KAART`, `NU POPULAIR`,
  `RELATIEGESCHENKEN ZONDER GEDOE` — elke sectie exact hetzelfde opener-recept.
- **Waarom AI:** het pill-badge/kicker-boven-de-H1-patroon is dé tell. Eén keer is
  merkidioom; op elke sectie wordt het een sjabloon dat hiërarchie juist platslaat
  (alles roept even hard "nieuwe sectie!").

### 2.2 Alles gecentreerd, symmetrisch, in één max-width

- Sectie-koppen staan bijna allemaal **gecentreerd** in dezelfde kolombreedte.
- Content-secties zijn **50/50 feature-rows** die links/rechts alterneren — op
  home, service én thema hetzelfde 6-6-grid.
- Niets loopt over de rand, over een ander element, of in een afwijkende breedte.
- **Waarom AI:** geen redactionele spanning. Een bureau varieert kolombreedtes
  (5/7, 4/8), laat beeld bleeden, zet een kop links en laat 'm ademen. Hier is
  elke sectie netjes gecentreerd binnen dezelfde doos.

### 2.3 Card-soup: 3 identieke donkere kaarten als sectie

- Service "Ook los af te nemen" = **3 donkere kaarten**, gecentreerde titel + 2 regels.
- Thema "Services & ontzorging" = **exact dezelfde 3 kaarten** (cross-sell), verbatim.
- Plus: 4 techniek-tegels (personalisatie), 5 thema-tegels (home), stepper-van-5.
- **Waarom AI:** "grid van N gelijke kaartjes" is het standaard-antwoord op elke
  informatiebehoefte. Ze zijn hier wél merkkleurig (donkergroen), maar structureel
  is het de generieke oplossing, en hij komt op meerdere pagina's terug.

### 2.4 Uniforme radius & shadow, ongeacht functie

- Hero-mozaïektegels, thema-tegels, donkere kaarten, groen paneel, FAQ-items:
  allemaal vergelijkbare afronding en een vergelijkbare groene zweefschaduw.
- **Waarom AI:** een rustende FAQ-rij, een klikbare beeldtegel en een statement-
  paneel horen niet dezelfde diepte te hebben. Gelijke radius+shadow overal = het
  "framework-preset"-gevoel. Diepte betekent nu niets.

### 2.5 Herhaalde bouwstenen binnen één scroll

- Trust-strip ("Geassembleerd in Europa · digitale drukproef · bezorging geregeld")
  **twee keer** op de homepage (hero + eind-CTA).
- Richard-blok "Hi, ik ben Richard" op **9 pagina's** en soms 2× per pagina.
- Italic-cognac accentwoord in **3 van de 4** homepage-koppen ("wortels in Europa",
  "Wij weten waar", "Wij regelen alles").
- **Waarom AI:** een goed idioom wordt door herhaling een tic. Selectiever inzetten
  maakt elk exemplaar weer bijzonder.

### 2.6 Neutrals & tinten — hier zit het góed (klein voorbehoud)

De neutrals zijn overwegend getint (zand `#EAE3D7`, crème `#F7F5F2`, warm grijs
`#8C857A`) — géén kille framework-grijzen. Enkele `#000000` en `rgba(0,0,0,…)`
schaduwen zijn de uitzondering en moeten groen-getint worden. Dit is een sterkte
om op voort te bouwen, geen probleem.

### 2.7 Lichtpunten (behouden en uitbouwen)

- **Staffel-mozaïek-hero** (home + thema): het meest eigen element; asymmetrisch,
  productgericht. Hier zit de kiem van een echt eigen layout.
- **NIET/WÉL-compare-blok** (thema, 5 pagina's): redactioneel, overtuigend,
  niet-generiek.
- **Europa-kaart met gloeipunten**: vertelt het "Europese makers"-verhaal visueel.
- **Genummerde stepper** (full-service): duidelijke, functionele opbouw.

---

## FASE 3 — RICHTING (voorstel — nog niet uitvoeren, wacht op akkoord)

Vijf beslissingen, gerangschikt op impact. Elke is een *systeem*, geen losse fix.
Principe uit de brief: **weghalen > toevoegen.** Hairlines i.p.v. shadows, contrast
i.p.v. decoratie. Geen nieuwe animaties/gradients/dependencies.

### Beslissing 1 — Eén tokenlaag bovenaan; drift eruit
**Wat verandert:** verplaats en verrijk het tokenblok naar de top van de CSS.
Kleur, type-schaal, een **niet-lineaire** spacingschaal, een **radius-schaal van 3**
(functioneel 10px / expressief 20px / pill 999px) en een **shadow-schaal van 3**
(rust / licht / diep, allemaal groen-getint; `rgba(0,0,0)` eruit). Bestaande
hardcoded waarden gaan stap voor stap door de tokens. Eén bron van waarheid.
**Zichtbaar op:** alle drie (fundament, subtiel maar overal).
**Raakt buiten scope via tokens:** de hele site — kleuren/schaduwen/radii trekken
overal recht. *Hier checken we na de stap wat omvalt.*

### Beslissing 2 — Typografisch systeem met écht contrast
**Wat verandert:** een modulaire type-schaal met grote, strak getrackte Playfair-
display (optisch gecorrigeerd: negatieve letter-spacing op grote maten, strakkere
line-height), en een rustige Montserrat-body met **eigen line-height per formaat**.
Meer sprong tussen display en body dan nu. Geen nieuwe fonts.
**Zichtbaar op:** alle drie — elke kop wint aan zeggingskracht, vooral de hero's.
**Raakt buiten scope via tokens:** alle 9 pagina's met `rg-page-hero`/`rg-block-title`.

### Beslissing 3 — Spacing als ritme + redactionele layout
**Wat verandert:** grote sprongen tússen secties, strak bínnen componenten (de
niet-lineaire schaal uit Beslissing 1). Doorbreek de symmetrie: **ongelijke
kolommen** (5/7 i.p.v. 6/6) op de feature-rows en hero's, **wisselende
sectiebreedtes** (een smalle "measure" voor lopende tekst, een brede/bleed sectie
voor beeld), en stop met álles centreren — sommige koppen links, latend ademen.
**Zichtbaar op:** sterkst op home + service (de rijen en koppen).
**Raakt buiten scope via tokens:** feature-row (8×) en block-title (9×) verschuiven mee.

### Beslissing 4 — Doorbreek de kicker-sjabloon en de card-soup
**Wat verandert:** de kicker-op-élke-sectie terugbrengen tot waar 'ie iets toevoegt
(1–2 per pagina); andere secties openen met alleen een grote kop of een links-
uitgelijnde lead-in. Vervang de 3-donkere-kaarten-cross-sell door een redactioneler
patroon: een **asymmetrische 2+1** of een **lijst met hairline-scheidingen** i.p.v.
drie identieke dozen. Copy en links blijven exact gelijk; alleen structuur/opmaak.
**Zichtbaar op:** service + thema (de cross-sell en de sectie-openers).
**Raakt buiten scope via tokens/component:** de donkere tegel-grid (8×) en `rg-sd__panel` (4×).

### Beslissing 5 — Eén signature: het wortel-/hairline-motief
**Wat verandert:** één ownable element dat uit "Rooted" voortkomt — een fijne
cognac **hairline** die als sectiescheiding en accent terugkomt (bv. een dunne lijn
die zich vertakt naar een sectie-marker), i.p.v. secties te scheiden met alleen
witruimte en dozen met schaduw. Dit vervángt decoratie (schaduwranden, dubbele
borders), niet erbovenop. Geeft samenhang die geen template heeft.
**Zichtbaar op:** alle drie, als rustige rode draad.
**Raakt buiten scope via tokens:** overal waar secties elkaar nu opvolgen.

---

### Volgorde bij akkoord (Fase 4, losse commits)
1. Tokens (type, kleur, spacing, radius, borders, shadow)
2. Basiscomponenten op deze 3 pagina's (hero's, feature-row, block-title, tegels,
   groen paneel, FAQ, Richard-blok, eind-CTA)
3. De pagina's zelf: **home → service → thema**

Na stap 1 en 2: controleren of pagina's buiten scope niet breken en melden wat
opvalt (repareren later). Per stap een samenvatting + gewijzigde bestanden.
