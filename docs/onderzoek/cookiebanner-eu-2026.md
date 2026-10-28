# De ideale cookiebanner voor Europese e-commerce (2026): compliance én maximale geldige consent

## TL;DR
- **Het "beste" bestaat juridisch niet als design-truc, maar wél als principe**: een tweelaagse banner met "Alles accepteren" en "Alles weigeren" even prominent op laag 1, geen vooraf aangevinkte vakjes, geen cookies vóór toestemming, en een permanente intrek-link. Dit is het minimum dat de EDPB Cookie Banner Taskforce, CNIL, de Duitse DSK en de Nederlandse AP eisen — afwijken levert boetes op (CNIL: €150M SHEIN en €325M Google in september 2025; AP: Kruidvat/AS Watson en Coolblue in 2024).
- **Wat je meetbaar mag optimaliseren is beperkt maar reëel**: heldere, waarde-gerichte copy, plaatsing (center-modal presteert hoger dan een bottom-bar), snelle laadtijd en goede leesbaarheid verhogen opt-in binnen de wet. Verwacht bij een compliant banner een consent rate van circa 40–55% voor e-commerce; "trucs" die hoger scoren zijn dark patterns en maken álle consent ongeldig.
- **Voor advertentie-data is Google Consent Mode v2 (Advanced) plus server-side tracking de sleutel**: het herstelt een aanzienlijk deel van de verloren conversies via modellering, zonder de wet te schenden. Combineer met een Google-gecertificeerde CMP (Cookiebot/Usercentrics, CookieYes, Cookie-Script, Consentmanager, iubenda) op Magento 2 / Shopware.

## Key Findings

### 1. De juridische ondergrens is nu scherp en wordt gehandhaafd
Cookies vallen onder de ePrivacy-richtlijn (in NL: Telecommunicatiewet/art. 11.7a, in FR: art. 82 Loi Informatique et Libertés, in DE: §25 TDDDG). Het "one-stop-shop"-mechanisme van de AVG geldt níet voor cookies — elke nationale toezichthouder kan rechtstreeks handhaven, ook tegen buitenlandse webshops die zich op hun burgers richten. De AVG geldt wél voor de daaropvolgende gegevensverwerking.

De EDPB Cookie Banner Taskforce (rapport 17 januari 2023) legde het "gemeenschappelijk minimum" vast van alle EU-toezichthouders. Kernpunten: een weigerknop op laag 1 (de "overgrote meerderheid" van autoriteiten ziet het ontbreken als overtreding), geen vooraf aangevinkte vakjes, geen misleidende link-designs, geen misleidende knopkleuren/contrast, en een permanent zichtbaar icoon of link om toestemming in te trekken.

### 2. Regelgevers over de vijf markten zijn grotendeels uitgelijnd
- **Nederland (AP)**: publiceerde begin 2024 negen vuistregels; monitort continu 10.000 Nederlandse websites (half miljoen euro extra budget per jaar, 2024–2026) en wil jaarlijks 500 organisaties waarschuwen. De eerste ~50 brieven gingen in april 2025 uit; in 2025 werden 200+ organisaties gewaarschuwd, waarvan circa driekwart de banner aanpaste — tegen de rest zijn handhavingsstappen gestart.
- **Frankrijk (CNIL)**: strengst; weigeren even makkelijk als accepteren, gelijke knoppen, geen dark patterns, hertoestemming aanbevolen na 6 maanden, cookies max 13 maanden.
- **Duitsland (DSK)**: Orientierungshilfe (nu "OH Digitale Dienste", versie nov. 2024/1.1); scrollen of doorsurfen is géén toestemming; knoppen mogen niet misleidend zijn ("Zustimmen" i.p.v. "Okay").
- **België (GBA)**: volgt EDPB; checklist okt. 2023; voorwaardelijke sancties tegen Mediahuis en RTL België (2024).
- **Oostenrijk (DSB)**: FAQ mei 2023; accepteert onder strikte voorwaarden "pay-or-consent".

### 3. Consent-percentages: benchmarks en de eerlijke waarheid
Een wettig ontworpen banner kost consent. De etracker Consent Benchmark 2025 (analyse van 500 Duitse websites) laat zien dat een compliant design gemiddeld **14 procentpunt minder consent** oplevert dan illegaal nudgen, en dat bij compliant design in **60% van de bezoeken** de toestemmingsplichtige cookies/verwerkingen worden geweigerd. Bij optisch gelijkwaardige knoppen mét weigeren op de eerste laag lag de gemiddelde consent rate in dat Duitse sample zelfs op slechts ~17% (sterk sectorafhankelijk). CMP-leveranciers rapporteren per bannertype hogere ranges: bottom-bar 55–65%, center-modal met accept/manage/reject 70–85%, full-screen overlay 75–90% (maar hoger bounce-risico). E-commerce zit doorgaans op 45–55%. Deze uiteenlopende cijfers tonen vooral: meet je eigen situatie — een "goede" rate hangt af van sector, markt en verkeersbron.

### 4. Google Consent Mode v2 en Meta: data-herstel binnen de wet
Sinds maart 2024 is Consent Mode v2 de facto verplicht voor adverteerders met EER-verkeer die Google Ads/GA4 gebruiken (voortkomend uit de DMA). Advanced mode herstelt aanzienlijk meer conversies dan Basic mode via cookieless pings en modellering. Meta biedt een vergelijkbare Consent Mode (Pixel + Conversions API).

## Details

### Design
De EDPB en alle vijf toezichthouders eisen dat "accepteren" en "weigeren" gelijkwaardig zijn qua grootte, kleur, contrast en typografie — niet per se 100% identiek, maar wel "vergelijkbaar in grootte, kleur, contrast en lettertype" (Duitse DSK). Te vermijden dark patterns (uit CNIL-formele aanmaning dec. 2024 en EDPB-richtlijnen 03/2022 over deceptive design):
- Accept-knop groot/gekleurd, weigeren als kleine grijze tekstlink → verboden.
- Vooraf aangevinkte vakjes (recital 32 AVG: "Silence, pre-ticked boxes or inactivity should not therefore constitute consent").
- Meerdere "accepteren"-knoppen tegenover één verstopte "weigeren".
- Verwarrende bewoording ("Ik weiger niet-essentiële doeleinden").
- Weigeren achter extra kliks of extra bevestiging.

Branding mag: gebruik je eigen huisstijlkleur voor beide knoppen of geef beide dezelfde neutrale stijl. De AP zegt letterlijk dat duidelijke woorden "accepteren", "akkoord" of "weigeren" zijn — niet "alleen noodzakelijke cookies", "optimale ervaring" of een klein kruisje.

### Positie
Regelgevers schrijven geen specifieke positie voor; ze eisen alleen dat de keuze compleet, zichtbaar en gelijkwaardig is op de eerste laag, óók op mobiel (de weigerknop mag niet pas na scrollen zichtbaar zijn). Uit performance-oogpunt scoort een center-modal met dimmed overlay hoger dan een bottom-bar, omdat die een expliciete keuze afdwingt; de bottom-bar is minder opdringerig maar wordt vaker genegeerd. Full-screen overlays scoren het hoogst op consent maar verhogen bounce en riskeren als "cookiewall" te worden gezien. Let op: een echte cookiewall (geen toegang zonder acceptatie) is volgens de AP verboden omdat toestemming dan niet vrij is — dit standpunt sinds 2019, al oordeelde de Franse Conseil d'État dat een absoluut verbod te ver ging.

### Layout & content: de AP-negenpuntslijst
De AP's vuistregels voor een correcte banner (vastgesteld door de Autoriteit Persoonsgegevens):
1. Informeer over het doel van de cookies.
2. Zet vinkjes niet automatisch aan ("Toestemming geven moet een actieve handeling zijn").
3. Gebruik duidelijke tekst (stuur niet naar acceptatie).
4. Zet de verschillende keuzes op één laag ("Het geven van toestemming moet even makkelijk zijn als het weigeren. Daarom moeten beide opties op de eerste laag van de cookiebanner worden aangeboden").
5. Verberg bepaalde keuzes niet (weigerknop goed zichtbaar).
6. Laat iemand niet extra klikken om te weigeren.
7. Gebruik geen onopvallende link in de tekst voor weigeren.
8. Wees helder over het intrekken van toestemming (informeer hoe en waar).
9. Verwar toestemming niet met gerechtvaardigd belang (gebruik geen verwarrende schuifjes voor beide).

De AP actualiseerde in juli 2025 haar eisen voor wat op laag 1 en laag 2 moet staan; op laag 1 hoort onder meer hoe gebruikers hun toestemming kunnen intrekken.

Aanbevolen structuur:
- **Laag 1**: korte uitleg (waarde-uitwisseling), drie gelijkwaardige knoppen "Alles accepteren" / "Alles weigeren" / "Instellingen", link naar cookie-/privacybeleid.
- **Laag 2 (voorkeuren)**: granulaire categorieën met toggles standaard uit (functioneel/noodzakelijk aan en niet uitschakelbaar, analytisch, marketing/advertentie, personalisatie). Plain-language labels ("Site-analyse", "Advertenties") in plaats van jargon. Vooraf aangevinkte vakjes op laag 2 zijn expliciet ongeldig (EDPB-taskforce).

Taal: bied de banner aan in de taal van de markt (NL/DE/FR); geo-targeting via de CMP.

### Behavior/UX
- **Timing**: laad de banner direct en asynchroon; een banner die pas na ~2 seconden verschijnt wordt gemist doordat bezoekers al scrollen/klikken.
- **Blokkeren**: plaats geen niet-essentiële cookies/pixels vóór toestemming (dit was de directe reden voor de SHEIN-, Kruidvat- en Coolblue-boetes). Blokkeer scripts tot consent.
- **Mobiel vs. desktop**: consent-rates zijn vergelijkbaar (~50%); het verschil zit in de ruimte — zorg dat de weigerknop op mobiel zonder scrollen zichtbaar is (specifiek CNIL-aandachtspunt).
- **Intrekken**: permanente footer-link of hover-icoon ("Cookievoorkeuren") die de banner heropent; intrekken moet net zo makkelijk zijn als geven (art. 7(3) AVG).
- **Hertoestemming**: CNIL beveelt vernieuwing na 6 maanden aan; de consent-registratiecookie mag tot 13 maanden. Bij weigering hoef je niet opnieuw te vragen (maar log het). Bij nieuwe doeleinden/derde partijen: direct opnieuw vragen.

### Data & benchmarks
De grootste marketingrisico's zijn niet dataverlies op zich, maar consent bias: de consent rate varieert sterk per kanaal (bezoekers via DuckDuckGo weigeren veel vaker; via Facebook/Google accepteren vaker), wat conversiemeting systematisch vertekent (etracker meet variatie van gemiddeld ±36% rond het website-gemiddelde). A/B-testen mag — maar alleen op legale variabelen (copy, knoplabels, positie, achtergrondkleur, aantal categorieën op laag 1). DHL verhoogde opt-ins met 40% door een links-uitgelijnde layout met volledige tekst — via leesbaarheid, niet manipulatie. Nooit testen: weigeren met meer kliks, weghalen van de weigerknop op laag 1, of vooraf aangevinkte vakjes — die maken de test juridisch waardeloos (Art. 7 AVG). Draai tests minimaal 2 weken met server-side randomisatie.

### Legal & enforcement (2024–2026)
- **CNIL (1 sep. 2025)**: €325M Google (€200M Google LLC + €125M Google Ireland Ltd) en €150M op INFINITE STYLES SERVICES CO. LIMITED, de Ierse SHEIN-dochter, "for failing to comply with the rules applicable to cookies placed on the devices of users visiting the 'shein.com' website". Bij SHEIN werden advertentiecookies geplaatst bij binnenkomst, bleven trackers draaien ná "Alles weigeren", en waren de banners incompleet; ~12 miljoen Franse bezoekers per maand woog mee.
- **AP (2024, herzien 12 juni 2025)**: boete AS Watson (Kruidvat-moeder, Health & Beauty Continental Europe B.V.) verlaagd van €600.000 naar €50.000 wegens tracking cookies zonder toestemming en vooraf aangevinkte vakjes; Coolblue €40.000 voor cookies zonder expliciete toestemming/vooraf aangevinkte vakjes. Bij Kruidvat woog mee dat via drogisterijproducten gevoelige gegevens werden verzameld.
- **België**: Mediahuis (besluit 6 sep. 2024) — geen "weiger alles"-knop op laag 1, misleidende knopkleuren, intrekken bijna onmogelijk.
- Sinds 28 juni 2025 valt de cookiebanner ook onder de Europese Toegankelijkheidswet (EAA).

### Consent Mode v2: Basic vs. Advanced
- **Basic**: tags laden pas na acceptatie; geweigerde bezoekers zijn onzichtbaar voor Google.
- **Advanced**: tags laden direct in cookieless "denied"-staat en sturen anonieme pings, waarmee Google verloren conversies modelleert. Google claimt dat conversiemodellering "up to 70%" van de door consent-keuzes verloren paden tussen advertentie-interactie en conversie kan herstellen; client-audits geven doorgaans 15–40% herstel van meetbare conversies (Advanced levert ~30–50% méér attributie dan Basic). Modellering vereist wel voldoende volume (richtlijn: ≥700 ad clicks over 7 dagen per land/domein). Voor EER-adverteerders met serieus Google Ads-budget is Advanced de verdedigbare keuze; Basic laat gemodelleerde conversies liggen. Stapel Enhanced Conversions en server-side tagging erbovenop. Test alle vier de signalen (ad_storage, analytics_storage, ad_user_data, ad_personalization).

### CMP's voor Magento 2 / Shopware
Kies een Google-gecertificeerde CMP met IAB TCF-ondersteuning, automatische script-blokkering vóór consent, consent-logging, geo-targeting, GPC-ondersteuning en Consent Mode v2. Opties met Magento/Shopware-integratie: Usercentrics/Cookiebot (Google Gold Tier partner), CookieYes, Cookie-Script, iubenda, Consentmanager, OneTrust, TrustArc, Sirdata. Voor Magento zijn er ook dedicated extensies (Amasty, Plumrocket — laatste ook Hyvä-compatibel). Voordeel van geïntegreerd tag- én consent-management (zoals etracker): minder configuratiefouten en veiligere blokkering dan een losse scan-en-blokkeer-aanpak.

## Recommendations

**Fase 1 — Compliance-basis (nu, hoogste prioriteit)**
1. Blokkeer alle niet-essentiële cookies/pixels tot consent. Dit is technisch meetbaar en de #1 handhavingsklacht (SHEIN/Kruidvat/Coolblue).
2. Zet "Alles accepteren" en "Alles weigeren" gelijkwaardig op laag 1; verwijder vooraf aangevinkte vakjes.
3. Voeg een permanente "Cookievoorkeuren"-link toe in de footer voor eenvoudig intrekken.
4. Implementeer een Google-gecertificeerde CMP met Consent Mode v2 (Advanced) op je Magento 2 / Shopware-shop.

**Fase 2 — Optimalisatie binnen de wet**
5. Herschrijf de copy naar waarde-uitwisseling in gewone taal ("We gebruiken cookies om de site te laten werken, prestaties te meten en je ervaring te personaliseren"), in de lokale taal per markt.
6. Test center-modal vs. bottom-bar, knoplabels en categorie-indeling via A/B-tests (min. 2 weken, server-side randomisatie).
7. Zet granulaire categorieën met plain-language labels op laag 2, toggles standaard uit.

**Fase 3 — Data-strategie**
8. Stapel Enhanced Conversions + server-side tagging bovenop Consent Mode v2 Advanced; configureer Meta Pixel/CAPI consent-gated (geen enkele fire vóór opt-in in EER).
9. Overweeg cookieless/consent-vrije analytics (bijv. etracker, Matomo) parallel, om consent bias te beperken.

**Drempels die je aanpak veranderen**: consent rate onder 30% → banner-UX/copy herzien; boven ~60% bij compliant design → controleren op onbedoelde nudging (kan bij audit als dark pattern gelden); ontvang je een AP-brief → binnen 90 dagen herstellen; nieuwe derde partij/nieuw doeleinde → direct opnieuw toestemming vragen; Google Ads-volume onder ~700 clicks/7 dagen per markt → modellering triggert niet, focus dan op Enhanced Conversions.

## Caveats
- Benchmarkcijfers per bannertype (bottom-bar 55–65% etc.) komen grotendeels van CMP-leveranciers en zijn indicatief, niet uit peer-reviewed onderzoek; de etracker-cijfers zijn Duits en tonen juist veel lagere compliant-rates (~17% in dat sample). Behandel alle cijfers als richtsnoer en meet je eigen situatie.
- Er blijft juridische nuance: enkele toezichthouders (minderheid in EDPB-rapport) zien een ontbrekende expliciete weigerknop niet als harde overtreding, en Nederlandse juristen betwisten of "weigeren op dezelfde laag" strikt uit de wet volgt. De handhavingspraktijk wijst echter duidelijk richting laag-1-weigerknop — volg die.
- De "70% herstel"-claim voor Consent Mode is een Google-cijfer voor conversiepaden, geen gegarandeerd resultaat; werkelijke uplift is meestal lager en volumeafhankelijk.
- "Pay-or-consent" (betalen i.p.v. cookies) wordt door Oostenrijk/Duitsland onder voorwaarden geaccepteerd, maar de EDPB-opinie 08/2024 verscherpte de criteria; vermijd dit model zonder specifiek juridisch advies.
- De ePrivacy-verordening (die de richtlijn moet vervangen) is nog niet aangenomen; regels kunnen veranderen.
- Dit is geen juridisch advies; laat de definitieve implementatie toetsen door een privacyjurist.