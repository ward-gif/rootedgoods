# Post-golive audit — dingen die pas op het echte domein te checken zijn

> Aanmaken 20 aug 2026. Dit is de tegenhanger van `pre-golive-audit.md`: alles
> hierin kan pas écht geverifieerd worden zodra rootedgoods.eu live staat met
> de definitieve content, plugins en domein — niet ervoor. Pak dit erbij in de
> eerste dagen/weken ná livegang.

## 🔌 Promidata Structured Data-plugin
1. **Verzendland/-tijd + retourbeleid in het `Product`-schema.** Het testvoorbeeld
   (Promidata's eigen testomgeving) toonde `addressCountry: "DE"` en
   `deliveryTime: "1-3 dagen"` — vermoedelijk gewoon hun eigen demo-Shopware-
   instellingen, geen plugin-hardcoding. Check op de live productpagina of dit
   automatisch goed meekomt vanuit Rooted Goods' eigen verzendzones/levertijden
   in Shopware (met name: personalisatie/drukproef maakt "1-3 dagen" onrealistisch
   voor bijna alle producten). `hasMerchantReturnPolicy` even bevestigen dat het
   ingestelde beleid (nu: geen retour) ook echt klopt.
2. **Ontbrekende velden checken of alsnog instelbaar zijn**: `sku` (Shopware-
   artikelnummer), `priceValidUntil`, `itemCondition` (zou altijd `NewCondition`
   moeten zijn), en of `image` een array met meerdere productfoto's kan worden
   i.p.v. 1 URL.
3. **Bevestigen dat de plugin geen `Organization`/`WebSite`/`BreadcrumbList`
   meestuurt** (in het testvoorbeeld zat dat er niet in) — zodra bevestigd,
   pas de losstaande zelfbouw-schema's (zie hieronder) toe zonder overlap-risico.
4. **Rich Results Test** op een echte PDP + categoriepagina (search.google.com/test/rich-results)
   om te bevestigen dat Google alles ook daadwerkelijk als geldig/eligible
   herkent, niet alleen dat de JSON-LD technisch valide is.

## 🧩 Eigen JSON-LD (zodra gebouwd, zie het losse implementatieplan)
1. **Organization + WebSite** (in `rootedgoods.html`, sitebreed): controleren
   dat het script-tag de Shopware CMS-sanitizer overleeft bij opslaan — `faq.html`
   documenteert dit risico al expliciet voor zijn eigen `FAQPage`-blok. Zo niet:
   verplaatsen naar het thema zelf (`<head>`-template) i.p.v. een CMS-blok.
2. Zelfde stripping-check herhalen voor elk nieuw blok (Service × 4, FAQPage-
   subsets × 11) na het herplakken door Ward.
3. Zodra er social-profielen zijn (LinkedIn/Instagram): `sameAs` toevoegen aan
   Organization (nu bewust leeg, nog geen profielen).

## 🔍 Zoekmachines & indexering
1. **robots.txt**: bevestigen dat de dev/staging-omgeving geen `noindex`/
   disallow-regel heeft die per ongeluk is meeverhuisd naar rootedgoods.eu.
   Klassieke launch-fout — geeft geen foutmelding, de site is dan alleen
   onvindbaar.
2. **Google Search Console + Bing Webmaster Tools**: eigendom verifiëren voor
   rootedgoods.eu, XML-sitemap indienen.
3. **XML-sitemap**: bevestigen dat die de losse thema-CMS-pagina's automatisch
   meeneemt (stond al open in de pre-golive-audit, nu pas echt te checken).
4. **Canonical URLs**: steekproef dat elke pagina een correcte zelf-canonical
   heeft (geen dubbele met/zonder trailing slash-varianten die als losse
   pagina's geïndexeerd raken).

## 📊 Performance — nu met échte cijfers
De pre-golive-audit was expliciet een schatting "met nog placeholders in
beeld". Zodra de definitieve content + afbeeldingen erin staan:
1. Lighthouse/PageSpeed Insights op een paar representatieve pagina's (home,
   een thema-pagina, een PDP) — de placeholder-gebaseerde schattingen
   vervangen door echte CLS/LCP/INP-cijfers.
2. CWV field-data (Chrome UX Report) begint pas te vullen na voldoende
   verkeer — na 3-4 weken live pas zinvol te bekijken in Search Console.
3. De al bekende CLS-bronnen uit de pre-golive-audit (ontbrekende
   `width`/`height`, hero-hoogte-JS die ná paint `minHeight` zet) opnieuw
   meten of ze na de image-opschoning nog steeds het grootste knelpunt zijn.

## 🔐 Techniek & caching
1. **jsDelivr-cachegedrag** (bevestigd vandaag, cf. `promidata-todos.md` punt 2):
   `rootedgoods.css`/`.js` cachen 12u op de jsDelivr-edge (`s-maxage`) én **7
   dagen in de browser zelf** (`max-age=604800`). Een edge-purge lost dus NIET
   op dat bezoekers met een recent bezoek een week lang de oude versie blijven
   zien — alleen een harde refresh (Cmd/Ctrl+Shift+R) forceert een herfetch.
   Dit is een permanent aandachtspunt, geen eenmalige check. Overwegen: een
   versie-query (`rootedgoods.css?v=2`) in de theme-include zetten zodat elke
   push vanzelf een nieuwe URL krijgt i.p.v. te leunen op cache-headers.
2. **SSL-certificaat** geldig op rootedgoods.eu (niet alleen op het huidige
   `bambook.08.promidata.shop`-domein).
3. **Mixed content**: steekproef dat geen enkele asset nog hardcoded naar
   `http://` of naar het oude dev-domein verwijst.
4. Redirects van het oude dev-domein: **niet nodig** — al bevestigd (19 aug,
   navraag bij Promidata) dat er nog geen geïndexeerde versie van
   rootedgoods.eu bestaat, dus geen SEO-waarde te behouden bij de switch.

## 🧪 Functioneel op het echte domein
1. Contactformulier, offerteformulier en Cal.com-boekingsknop end-to-end
   testen (niet alleen visueel, ook daadwerkelijk versturen/boeken).
2. Steekproef van interne links die deze sessie zijn gefixt (thema-overzicht-
   tegels, "bekijk alle producten"-knoppen) opnieuw controleren op het nieuwe
   domein — URL-structuur zou hetzelfde moeten blijven, maar niet aangenomen.
3. 404-monitoring instellen (Search Console "Pagina's"-rapport of losse tool)
   voor de eerste weken, voor het geval een CMS-blok toch een verkeerde link
   bevat die nu nog niet is opgevallen.

## ♿ Toegankelijkheid
- Cognac-eyebrow-contrast (`#CA853F` op `#F7F5F2` ≈ 2.8:1, onder WCAG AA) stond
  al in de pre-golive-audit als openstaand punt — nog niet opgepakt, hier
  herhaald zodat het niet tussen wal en schip valt.
