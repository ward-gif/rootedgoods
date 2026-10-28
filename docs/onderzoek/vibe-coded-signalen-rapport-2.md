# Herkenningslijst deel 2: de signalen die rapport 1 nog miste

Aanvulling op het eerste rapport, zonder herhaling. Belangrijkste nieuwe bronnen: Impeccable van Paul Bakaus (catalogus van 66 patronen, waarvan 61 deterministisch detecteerbaar via CLI of browser-extensie), StyleMole/VibeMole, en Anthropic's eigen blog over waarom Claude-output er standaard hetzelfde uitziet. Zelfde format als deel 1: per signaal wat het is, waarom het als tell geldt, waar je het opspoort, en de betere richting.

Eén kernobservatie vooraf, uit Impeccable: "Every wave of AI-generated UIs converges on a recognizable aesthetic. The patterns just change." De 2022-golf was paars, glas en glow (rapport 1). De 2026-golf is crème, serif en "tasteful". Die tweede golf is voor Rooted Goods de gevaarlijke, want je merkpalet zit er vlakbij. Daarover meer in laag 4.

## LAAG 1: DE EYEBROW/KICKER, VOLLEDIG UITGEDIEPT

### 1.1 Waar het patroon vandaan komt
De eyebrow (ook: kicker of overline) is geleend uit de krantenwereld: een klein categorielabel boven de kop ("BUITENLAND", "ANALYSE") dat de lezer vertelt in welke rubriek hij zit. Stripe en Apple maakten er marketingdesign van, en omdat vrijwel elke SaaS-template het overnam, zit het diep in de trainingsdata. Impeccable formuleert het scherp: het label "borrows editorial authority it has not earned". Het patroon doet alsof je pagina een redactie heeft die content in rubrieken indeelt, terwijl er maar één afzender is.

### 1.2 Waarom AI het boven ELKE kop zet
Het model heeft geen paginabudget. Een mens denkt "één label bovenaan is genoeg oriëntatie"; het model genereert elke sectie los en past het geleerde sjabloon (label, kop, subkop) telkens opnieuw toe. VibeMole noemt dit letterlijk: "The common vibe coded pattern is a small eyebrow badge above every section heading. After a while, the visitor stops reading them." Herhaling is dus de tell, niet het element zelf.

### 1.3 De varianten, allemaal herkenbaar
- De pill/badge-chip: capsulevorm met randje of achtergrondtint, vaak met puntje of ✨ ervoor. Impeccable flagt dit als aparte regel: "Hero eyebrow / pill chip" is "the default AI SaaS hero".
- Het all-caps microlabel met letterspacing (tracked uppercase). De klassieke kicker.
- Het gekleurde label in de accentkleur, zonder verdere functie van die kleur op de pagina.
- Genummerde mini-labels naast of boven koppen ("01 Ontdekken, 02 Ontwerpen, 03 Leveren"). Impeccable: "Tiny numbered section labels imitate editorial structure without adding it."

Let op die laatste: je "Route van Rooted"-sectie (genummerde stops) en de /over-ons-blokken (1 De zoektocht, 2 De keuze, 3 Het team, met coördinaten als kopregel) gebruiken precies deze vorm. Bij jou dragen de nummers wél betekenis (een route heeft volgorde, coördinaten horen bij plekken), dus het kan blijven staan. Maar het verschil moet zichtbaar zijn: de nummers moeten onderdeel zijn van het verhaal (op de routelijn, in de kaartlogica), niet een los typografisch labeltje boven elke kop. Zodra dezelfde genummerde vorm ook op secties verschijnt die geen volgorde hebben, kantelt het naar de tell.

### 1.4 Waar je het opspoort
Zoek in je templates/CSS op: `letter-spacing` + `text-transform: uppercase` op elementen direct boven een H1/H2, `rounded-full` chips boven koppen, en herhaalde label-kop-subkop-drielagen. Tel hoeveel secties het patroon hebben. Eén is een keuze, vijf is een sjabloon. Check ook de HTML-semantiek: een bekende fout (David Luhr documenteerde dit bij Stripe) is dat de eyebrow als heading gecodeerd staat en de grote regel eronder als h1/h2, waardoor de document-outline voor screenreaders op zijn kop staat. De eyebrow hoort een `<p>` of `<span>` te zijn, de grote regel de echte heading.

### 1.5 Slimmer ombouwen (de alternatieven)
1. Weglaten en de woorden in de kop verwerken. Impeccable's eerste advies: "Delete it, or work the words into the heading." Meestal wordt de kop er sterker van.
2. Eén keer gebruiken, functioneel. Als oriëntatie ergens echt helpt (een lange themapagina met meerdere doelgroepen), zet dan één label op het kantelpunt, niet boven alles.
3. Vervangen door een inleidende zin. Een korte regel lopende tekst boven of onder de kop geeft dezelfde context maar leest als redactie in plaats van sjabloon.
4. Breadcrumb of rubriek in de navigatie. Als het label een categorie aanduidt, hoort die informatie in de breadcrumb (die je in Shopware al hebt), niet als decoratie boven de kop.
5. Specifiek bewijs in plaats van een leeg label. VibeMole: een badge "CLI scan available" is nuttig, "Powerful insights" is vulling. Vertaald naar Rooted: "Gemaakt in Portugal" boven een productsectie draagt informatie; "Onze collectie" niet.
6. Visueel ritme in plaats van labels. Sectiewissels kun je markeren met achtergrondtint, beeld, of een andere kolomverdeling. Dan heb je het label niet nodig om te zeggen "hier begint iets nieuws".

## LAAG 2: MICRO- EN COMPONENT-TELLS

### 2.1 Cardocalypse: cards in cards in cards
Wat: een buitencontainer met rounded corners, daarin een panel, daarin feature-cards, daarin icoontegels en badges. Impeccable heeft er een eigen specimen voor ("Cardocalypse: five levels of nesting, each with its own padding and shadow"); VibeMole noemt het "one of the clearest signals". Waarom: het model wikkelt elke inhoudseenheid in een nieuwe wrapper omdat wrappers "af" ogen. Opsporen: tel in DevTools de geneste containers met eigen border-radius en padding rond één stuk content. Meer dan twee lagen is verdacht. Betere richting: per sectie minstens één laag verwijderen; hiërarchie maken met witruimte, typografie en dividers in plaats van dozen.

### 2.2 Hairline border plus brede zachte schaduw
Wat: een 1px-randje én een wijde diffuse shadow op hetzelfde element. Impeccable noemt het "a recurring generated-UI signature": kies een gedefinieerde rand óf een zachte elevatie, niet allebei. Opsporen: zoek elementen met zowel `border` als `shadow-lg`/grote box-shadow.

### 2.3 Icoontegel bóven de kop
Wat: het kleine afgeronde vierkantje met icoon dat los boven de feature-kop zweeft. Rapport 1 had de icon-in-cirkel; dit is de verwante maar specifiekere vorm die Impeccable "the universal AI feature-card template" noemt: "Every generator outputs this exact shape." Betere richting: icoon naast de kop op één regel, of het icoon gewoon in de tekstflow zonder eigen container. Verwant: "Massive Icons", icooncontainers die groter zijn dan de content die ze aankondigen. Als de decoratie groter is dan de boodschap, staan de prioriteiten omgekeerd.

### 2.4 Het hero-metric-blok
Wat: groot getal, klein label, drie ondersteunende stats, gradient-accent ("10M+ actieve gebruikers, 99,9% uptime, 200ms"). Impeccable: "Used everywhere, trusted nowhere." Rapport 1 dekte verzonnen statistieken; dit gaat over de lay-outvorm zelf, die ook met échte cijfers als sjabloon leest. Betere richting: één cijfer dat er echt toe doet, in lopende tekst met context, in plaats van een statistiekenrij.

### 2.5 Monotone spacing
Wat: overal exact dezelfde afstand tussen elementen. Geen ritme. Impeccable: "Use tight groupings for related items and generous separations between sections" (het Gestalt-principe van nabijheid). Rapport 1 noemde secties met gelijke padding; dit gaat dieper: ook bínnen componenten hoort gerelateerde info dichter op elkaar dan ongerelateerde. Opsporen: zoek herhaalde identieke gap/margin-waarden door je hele stylesheet; check of een kop dichter bij zijn eigen tekst staat dan bij het blok erboven (Impeccable flagt "heading crowded against the previous block" als aparte regel).

### 2.6 Decoratieve achtergronden zonder functie
Drie vormen die Impeccable apart flagt: het decoratieve gridlijnen-patroon over een vlak (hoort alleen bij een canvas, kaart of meetcontext), repeating-gradient-strepen als oppervlakdecoratie, en de radiale spotlight-gloed achter een sectie op een lichte pagina (de lichte neef van de dark-glow uit rapport 1). Opsporen: zoek `background-image` met linear/radial-gradients en SVG-grids die nergens content ondersteunen.

### 2.7 Extreme border-radius en amateur-SVG
Cards met 24px+ radius worden "the same soft blob"; Impeccable adviseert cards op 12 tot 16px te houden en volledige pill-vorm te reserveren voor tags en knoppen. En: met de hand gecodeerde SVG-illustraties van scènes of mascottes "read as amateur doodles, not whimsy". Dit raakt jouw beeldmerk-traject (cirkel met wortelstelsel): een strak, professioneel getekend merkicoon is prima, maar een door AI in code geschetste illustratie als hero-art valt door de mand. Verwant: "shape-assembled illustration", hero-art in elkaar gezet uit generieke SVG-vormen, leest als clipart-placeholder.

### 2.8 Motion-tells die rapport 1 niet had
- Pulserend statuspuntje ("Systems operational" met kloppend groen dotje): "A decorative pulse makes static status look live." Animeer alleen wat echt verandert.
- Knipperende nepcursor in hero-tekst: laat echte inputvelden de cursor bezitten.
- Auto-scrollende marquee (de oneindig doorschuivende logorij): "demands attention and hides content". Laat mensen op eigen tempo lezen; een statische logorij of gewoon minder logo's werkt beter.
- Bounce/elastic easing: dialogen die met overshoot binnenspringen voelen "dated and tacky". Interface-motion hoort smooth uit te lopen (ease-out-quart/quint/expo).
- Beeld dat schaalt of roteert op hover: "a recurring generated-UI signature. Let imagery sit still."
- En de bug-variant: content die op `opacity: 0` blijft staan omdat de reveal-handler nooit draaide. De halve pagina onzichtbaar, alleen zichtbaar als je JS uitschakelt of de handler faalt. Opsporen: laad de pagina met JS uit en kijk wat er ontbreekt.

### 2.9 Redundant UX-schrijven
Wat: label, sublabel, helper-tekst en hint die alle vier hetzelfde zeggen in nét andere woorden. Impeccable heeft er een specimen voor: "Say it once, say it well." Opsporen: open je formulieren (offerte-aanvraag, contact, Cal.com-embed-intro) en check of veldnaam, placeholder en helptekst elkaar herhalen.

### 2.10 Typografische micro-tells
- Platte type-hiërarchie: kop, subkop en body te dicht bij elkaar in grootte. Impeccable adviseert minstens ratio 1,25 tussen stappen, en liever minder stappen met meer contrast.
- Eén font voor alles: geen contrast tussen display en body. (Jij hebt Fraunces als wordmark; het risico is eerder het omgekeerde: overal serif. Zie laag 4.)
- Oversized hero-kop: een volledige zin op display-formaat die de hele viewport vult. Een woord of twee groot is prima; een lange zin groot is de tell.
- Doorgedrukte letterspacing (crushed tracking) op display-tekst, voorbij het punt waar letters hun vorm houden.
- Wijde letterspacing op bódytekst (boven 0,05em): breekt woordgroepen, hoort alleen bij korte uppercase labels.
- Uitgevulde tekst (justified) zonder afbreking: "rivers of white". Op schermen links uitlijnen.

## LAAG 3: COPY-TELLS, TWEEDE LAAG

### 3.1 Aforisme-cadans
Wat: secties die landen op een korte rebuttal of gefabriceerd contrast: "Not a feature. A platform." / "Geen cadeau. Een statement." Impeccable flagt dit als "aphoristic-cadence copy": "Once is fine; the repeated pattern is the tell." Dit is de opvolger van de "niet zomaar X maar Y"-formule uit rapport 1: zelfde mechanisme, andere vorm (twee staccato-fragmenten in plaats van één zin). Opsporen: zoek naar zinsfragmenten van 1 tot 3 woorden die als volledige zin met punt zijn gezet, vooral als afsluiter van secties.

### 3.2 Theater-framing
Wat: iets wegzetten als "theater" of poppenkast ("Wij doen niet aan duurzaamheidstheater"). Impeccable: "a recurring generated-copy tic. Say plainly what the thing does or does not do." Ironisch genoeg juist een risico voor merken die zich tegen greenwashing willen afzetten: het klinkt stoer, maar het is inmiddels een herkenbaar AI-patroon. Zeg concreet wat je wel en niet doet ("wij planten geen bomen als compensatie-truc; elke bestelling financiert x m² mangrove via Veritree" is sterker dan "geen greenwash-theater").

### 3.3 Herhaalde kopvormen
Wat: elke H2 heeft dezelfde zinsvorm. VibeMole somt de verdachte sjablonen op: "Everything you need to…", "Built for…", "Designed for…", "Powerful features for…", "From X to Y in minutes". Nederlandse spiegels: "Alles wat je nodig hebt voor…", "Gemaakt voor…", "Ontworpen voor…", "Van A naar B in minuten". De test die VibeMole geeft is direct bruikbaar: lees alleen je H2's hardop. "If they sound like they could belong to any SaaS product, they need work." Verwant en subtieler: elke kop begint met een gebiedende wijs ("Ontdek", "Bekijk", "Kies", "Start"), of elke kop is een vraag ("Klaar om te beginnen?"). Ook hier is variatie de menselijke vingerafdruk.

### 3.4 Zelfverzekerd maar leeg
Wat: copy die gepolijst klinkt maar specifics vermijdt. VibeMole's regel is de beste test die ik ben tegengekomen: "If your sentence could fit 500 other SaaS products, rewrite it." Voor Rooted: "Duurzame relatiegeschenken die indruk maken" past op elke concurrent. "Notitieboeken uit Nederland, messen uit Frankrijk, geen container uit Shenzhen" past alleen op jou. De onderliggende tells:
- Claims zonder mechanisme: "duurzaam", "hoogwaardig", "eerlijk geproduceerd" zonder dat ergens staat wáárdoor (materiaal, fabriek, certificaat, afstand).
- Geen meningen of keuzes: AI-copy is overal even positief en neemt nergens stelling. Een echte afzender zegt ook wat hij níét doet en waarom ("wij leveren geen logo-opdruk onder 50 stuks, omdat de setup-kosten dan niet uit kunnen"). Trade-offs benoemen is een van de sterkste menselijkheidssignalen.
- Geen zichtbare werkwijze: benefits zonder proces. B2B-inkopers willen weten wat er gebeurt na de aanvraag: offerte binnen hoeveel dagen, proefdruk ja/nee, levertijd, minimale afname. VibeMole noemt dit "no visible product workflow" en het gat dat het slaat in vertrouwen.
- Softball-FAQ: vragen die niemand stelt ("Waarom is duurzaam schenken belangrijk?") in plaats van de echte bezwaren (minimale ordergrootte, levertijd december, logo-opdruk, betaling op factuur, wat als de ontvanger het niet mooi vindt).

### 3.5 E-commerce-copy-sjablonen
- Productbeschrijvingen die allemaal dezelfde bouw volgen: pakkende openingszin, vijf voordelen-bullets met vinkjes, afsluiter met aanzet tot aankoop. Dat is letterlijk het sjabloon dat Nederlandse AI-contentgidsen aanraden om te genereren, en dus ook het sjabloon dat bezoekers leren herkennen. Yellify vat het probleem samen: gegenereerde tekst zonder context "had voor elk vergelijkbaar product kunnen gelden. Geen concrete eigenschappen, geen toepassing, geen onderscheid." Opsporen: leg drie productpagina's naast elkaar. Zelfde zinslengtes, zelfde bulletaantal, zelfde afsluiter? Sjabloon. Betere richting: per product minstens één detail dat alleen over dát product kan gaan (gewicht, papiersoort, de fabriek, een eigenaardigheid).
- Het "Waarom kiezen voor [merk]?"-blok met drie USP's: de e-commerce-versie van het feature-grid. Als het er staat, vul het met controleerbare feiten (KvK, fysieke voorraad in Ede, reactietijd) in plaats van adjectieven.
- Checklist-inflatie: rijen icoon-vinkjes met elk een voordeel. Elke extra vink verdunt de rest. Eén of twee sterke, specifieke claims verslaan zes vage.
- Inconsistente labelgrammatica binnen één set: "Notitieboek uit Nederland" naast "Gerecycled glas" naast "Bezorging regelen wij" voelt machinaal samengesteld. Kies één grammaticale vorm per set labels.
- Punt achter elke losse regel: AI zet een punt achter headlines, knoplabels, badges en kaartlabels. Mensen doen dat alleen in lopende tekst. Scan al je display-copy: staat er een punt achter een regel die geen zin is, weghalen (tenzij het één bewuste stijlbeat is).
- Uitroeptekens: hooguit één per pagina, meestal nul.

## LAAG 4: DE CLAUDE-LOOK EN WAAROM DIT VOOR ROOTED HET SCHERPST LIGT

### 4.1 De "tasteful default" is nu een gedocumenteerd slop-patroon
Impeccable heeft er sinds kort een eigen detectieregel voor: "Cream / beige palette: a warm cream or beige page background has become the default 'tasteful' AI surface, reached for by reflex." Daarnaast flagt het "Italic serif display headline" ("has become the universal AI-startup landing page hero") en de nieuwe font-reflexen: na Inter kwamen Geist, Space Grotesk en "the newest reflex, Instrument Serif". De 2026-specimen van Impeccable's eigen slop-vergelijking ís de crème-serif-look. Kortweg: het anti-slop-advies van 2024 (weg van paars, naar warm en editorial) is massaal opgevolgd en daarmee zelf de nieuwe uniform geworden.

### 4.2 Waarom dit de Claude-signatuur is
Anthropic's eigen merkesthetiek (crème-achtergronden, terracotta rond #C15F3C, sage-groen, warme aardetinten, handgetekende illustraties, serif-koppen) wordt online actief gerepliceerd; er circuleren letterlijk prompts om "de Claude-stijl" na te maken ("terracotta rust-orange, dusty sage green, warm cream, deep charcoal... reminiscent of a quality literary magazine"). Claude Code, gevoed met die esthetiek plus het advies om paars te vermijden, valt bij "maak het warm en premium" reflexmatig in dit register. Anthropic erkent het convergentieprobleem zelf in de blog over hun frontend-design skill: zonder sturing produceert Claude "the 'AI slop' aesthetic", en de fix is expliciete richting geven.

### 4.3 Het Rooted-risico, concreet
Jouw palet (deep forest green, cognac, warm crème) plus Fraunces (een expressieve serif) zit ín het tasteful-default-register. Dat maakt je merk niet fout; het waren keuzes met een reden (Lover/Caregiver, ambacht, Europa). Maar het betekent dat je de look niet kunt laten dragen door palet en font alleen, want die twee zeggen inmiddels "AI-gegenereerd warm merk". Wat het verschil maakt zit een laag dieper:
- Echt beeld wint alles. Foto's van echte producten, echte fabrieken, jullie kantoor, de teamfoto's op /over-ons. De crème-serif-slop bestaat vrijwel altijd bij gratie van géén echt beeld (illustraties, stock, AI-art). Dit is tegelijk je zwakste plek: je beeldstrategie leunt op externe bronnen en de themapagina's staan nog op placeholders. Prioriteit één.
- Fraunces gebruiken zoals AI het niet doet. De AI-reflex is: serif cursief, oversized, als hero-kop. Zet Fraunces dus roman (niet italic) in, op beheerste grootte, en benut de optical-size- en wonk-assen die Fraunces uniek maken. Combineer met een body-font dat níét in het rijtje Inter/Geist/Space Grotesk zit.
- Lay-out-eigenzinnigheid. De routelijn over de paginahoogte is precies het soort structureel idee dat geen generator uitspuugt. Meer daarvan: asymmetrie, een sectie die bewust uit het grid breekt, de coördinaten-koppen. Dat soort keuzes onderscheidt sneller dan kleur.
- Textuur en materiaal in plaats van vlakke crème. Papierkorrel, echte productclose-ups als achtergrond, drukwerk-details. De AI-versie van warm is een vlakke hex-code; de echte versie is materiaal.
- Specifiek bewijs in de copy (laag 3.4). De tasteful default is visueel warm maar inhoudelijk leeg; jouw inhoud (namen van fabrieken, landen, certificaten, de scorecard van 70+ merken) is precies wat de look geloofwaardig maakt.

### 4.4 Claude Code sturen: van default naar merk
- Installeer de frontend-design plugin/skill in Claude Code (via /plugin). Claude web heeft die skill ingebakken, Claude Code kaal niet; dat verklaart waarom losse Claude Code-output er generieker uitziet. Anthropic's eigen materiaal bevestigt dat Claude "highly steerable" is zodra je defaults expliciet verbiedt en alternatieven benoemt.
- Zet een DESIGN.md of designsectie in CLAUDE.md met je tokens: exacte hexwaarden, Fraunces-gebruik (wanneer wel/niet, welke assen), je spacing-schaal, radius-schaal, en een verbodslijst (geen eyebrows behalve X, geen icoontegels boven koppen, geen geneste cards, geen italic-serif-hero, geen punt achter display-regels). Impeccable kan vervolgens gepersonaliseerd detecteren: elke font, kleur, radius of tekstgrootte búiten je DESIGN.md wordt geflagd.
- Draai `npx impeccable detect` op je CSS/JS-repo en de Chrome-extensie op de live site. 61 deterministische regels, gratis, en precies gebouwd voor jouw werkwijze (per bevinding fixen in Claude Code, opnieuw scannen). Dit is de logische motor achter je bestaande section-design-review skill.
- Gebruik als review-prompt de senior-designer-variant van VibeMole (staat integraal in hun gids): laat Claude per issue uitleggen waarom het generiek voelt, een concreet alternatief voorstellen en de copy herschrijven, met voorkeur voor minder componenten en meer productbewijs.

## LAAG 5: GEDRAGS- EN CONSISTENTIE-TELLS

### 5.1 Breuken tussen los gegenereerde secties
Elke sessie of prompt genereert zijn eigen micro-beslissingen. De naden: knopstijlen die per sectie nét verschillen (radius, padding, hover), twee bijna-gelijke tinten van dezelfde kleur, outline- en filled-iconen door elkaar, schaduwen met verschillende richting of blur, een footer die qua toon en dichtheid niet bij de rest past. Opsporen: zet screenshots van alle secties naast elkaar en vergelijk uitsluitend de knoppen, dan de iconen, dan de schaduwen. Dit is voor jou extra relevant omdat je bewust meerdere Claude Code-sessies parallel draait: snelheidswinst, maar ook de belangrijkste bron van dit soort drift. Vang het af met de tokens in DESIGN.md/CLAUDE.md zodat elke sessie dezelfde bron leest.

### 5.2 Demo-perfectie: het happy path werkt, de randen breken
AI bouwt voor de demo. De randgevallen verraden het: lange productnamen die overlopen of afkappen, een lege zoekresultaten- of winkelwagen-state zonder ontwerp, Engelse foutmeldingen op een Nederlandse site (browser-default validatie: "Please fill out this field"), Engelse datums of decimalen in gegenereerde componenten. Opsporen: test bewust het ongelukkige pad. Zoek op "xyzabc", laat een verplicht veld leeg, stop een productnaam van 90 tekens in de slider, bekijk de 404 en de lege categorie. Impeccable flagt de technische neven hiervan: content die uit zijn container loopt, dropdowns die door `overflow: hidden` worden afgekapt, en uncaught script errors bij load (open de console; één rode regel bij binnenkomst is al een signaal).

### 5.3 Formulier-hygiëne
Gegenereerde formulieren missen structureel: `autocomplete`-attributen (name, email, organization, postal-code), juiste `input type` en `inputmode` (email, tel, numeriek voor postcode), en logische tab-volgorde. Onzichtbaar in de demo, direct voelbaar voor een inkoper die zijn gegevens niet auto-ingevuld krijgt. Opsporen: tab door je offerteformulier zonder muis en kijk of je browser velden aanbiedt in te vullen.

### 5.4 Uniforme transitieduur
Alles op `transition: all 0.3s`. Eén duur en één easing voor hover, modals, accordions en pagina-elementen tegelijk. Menselijk motion-design differentieert: micro-feedback snel (100 tot 150ms), ruimtelijke veranderingen langzamer. Opsporen: grep op `transition` en tel hoe vaak dezelfde waarde voorkomt; `transition: all` is op zichzelf al een tell (en een performance-risico).

## LAAG 6: NL/EU- EN SHOPWARE-SPECIFIEK

### 6.1 Taal die lekt
De pijnlijkste meertaligheids-tell: de marketingpagina's zijn Nederlands, maar het systeem lekt Engels. Checkout-microcopy, transactiemails, foutmeldingen, de cookiebanner van een plugin, badge-teksten ("New", "Sale"), validatie. Voor Shopware: loop de snippets na (Settings, Snippets) van je verkoopkanaal, bestel een testproduct en lees élke mail en elk tussenscherm. Eén Engels woord in de checkout doet meer schade dan tien op de homepage, want daar ligt het geld op tafel.

### 6.2 Gegenereerde SEO-content in de shop-architectuur
- Categorieteksten die per categorie hetzelfde stramien volgen (intro-alinea met keyword, drie voordelen, afsluitvraag) en meta-descriptions uit één template met alleen het keyword gewisseld. Opsporen: leg vijf categorie-metas naast elkaar; als alleen het zelfstandig naamwoord verschilt, is het een template.
- Keyword-stuffing in producttitels ("Duurzaam Notitieboek A5 Gerecycled Papier Relatiegeschenk Bedrijven"): geschreven voor de machine, gelezen door een mens.
- Breadcrumb/URL-inconsistenties: je kent je eigen hoofdletter-probleem in de SEO-URL's al; dezelfde klasse fouten (categorie heet anders in menu, breadcrumb en URL) leest als niemand-heeft-dit-nagelopen.
- Hreflang en taalattributen die niet kloppen zodra DE/FR erbij komt: NL-pagina's die als en-US gemarkeerd staan, of vertaalde pagina's die naar de verkeerde tegenhanger verwijzen.

### 6.3 Juridische pagina's als AI-tell
- Een privacyverklaring die naar CCPA of "California residents" verwijst op een Nederlandse B2B-shop: gegenereerd uit een Amerikaans sjabloon, en voor een kritische inkoper (of diens jurist) een direct teken dat de rest ook niet gecontroleerd is.
- Algemene voorwaarden die duidelijk gegenereerd zijn: verwijzingen naar niet-bestaande artikelen, Amerikaanse rechtskeuze, "Company" waar de B.V.-naam hoort te staan.
- Cookiebanner die niet AVG-conform is (alles vooraf aangevinkt, geen weiger-knop op het eerste scherm, of tracking die al vuurt vóór consent). Jij draait GTM plus Clarity via de DTGS-plugin: check dat de tags echt pas na consent laden (Tag Assistant open, cookie weigeren, kijken wat er toch vuurt). Niet alleen een tell maar ook een boete-risico.
- Het imprint/colofon-gat: geen fysiek adres, KvK en BTW op een vindbare plek. Rapport 1 noemde dit als vertrouwenssignaal; hier de omkering: de afwezigheid ervan is inmiddels een van de checks waar detectors en kritische bezoekers als eerste naar kijken ("no human surfaces").

## LAAG 7: SENTIMENT-SYNTHESE

### 7.1 Hoe mensen het beschrijven
De rode draad in alle bronnen is niet "lelijk" maar "bekend op de verkeerde manier". VibeMole verwoordt het gevoel van de bezoeker als: "I have seen this exact app before", en de conclusie die daarop volgt: als de pagina default-AI-output is, is het product erachter waarschijnlijk ook "generic, rushed, or unfinished". De schade zit dus niet in esthetiek maar in de aanname over het bedrijf. Tweede rode draad: het stapel-effect. "One default is harmless. Ten defaults together create the vibe coded look." Dat spiegelt Krebs' 4+-patronen-drempel uit rapport 1, maar dan als perceptie-mechanisme: bezoekers turven niet bewust, ze voelen de optelsom.

### 7.2 Het tegengeluid, en wat goede vibe-coded sites anders doen
Vrijwel elke serieuze bron zegt óók: de tools zijn het probleem niet. VibeMole: "The best signal is not 'this uses shadcn' or 'this uses Lucide'. Good tools are not the issue. The issue is when everything still looks like the default output from those tools." En: "Vibe coding is not the problem. The problem is shipping the first design your AI tool gives you." Sites die met AI gebouwd zijn en er níét zo uitzien, delen drie eigenschappen: ze tonen echt productbewijs in plaats van abstracte graphics, ze maken één ding visueel dominant in plaats van alles even zwaar, en hun copy haalt de "past-op-500-andere-bedrijven"-test niet meer. Plus de wetenschap dat de tells verschuiven: wie nu van paars naar crème-serif vlucht, loopt de volgende uniform in. Het enige duurzame antwoord is merk-eigen beslissingen vastleggen (DESIGN.md) en output daartegen toetsen, in plaats van een "veilige" esthetiek kopiëren.

### 7.3 Prioriteit voor rootedgoods.eu, alles uit dit rapport gewogen
1. Echt beeld op de placeholder-posities (themapagina's, /over-ons). Grootste enkele hefboom, omdat het tegelijk de crème-serif-associatie doorbreekt en B2B-bewijs levert.
2. Eyebrow-sanering volgens 1.5: overal weg behalve waar het informatie draagt; nummers alleen waar volgorde echt bestaat.
3. Copy door de leeg-maar-zelfverzekerd-test (3.4) en de H2-hardop-test (3.3); productteksten uit het vinkjes-sjabloon (3.5).
4. Consistentie-pass over parallel gebouwde secties (5.1) plus DESIGN.md als gedeelde bron voor al je Claude Code-sessies (4.4).
5. Taal- en juridische lekken dichten (6.1, 6.3): snippets, testbestelling, consent-check, voorwaarden.
6. Daarna doorlopend: `npx impeccable detect` in je workflow naast je eigen section-design-review skill.

## Bronnen
- Impeccable (Paul Bakaus), impeccable.style/slop: catalogus van 66 patronen, 61 deterministisch detecteerbaar (CLI `npx impeccable detect`, Chrome-extensie, gepersonaliseerde DESIGN.md-detectie)
- VibeMole/StyleMole, "How to Avoid Building Apps That Look Vibe Coded" (juli 2026): eyebrow-badge-spam, cardocalypse, herhaalde kopvormen, workflow-zichtbaarheid, review-prompt
- Anthropic, "Improving frontend design through Skills" (claude.com/blog): erkenning van de default-esthetiek en stuurbaarheid van Claude
- David Luhr, "All about accessible headings": eyebrow-semantiek en het Stripe-voorbeeld
- UX Movement, "Increasing Headline Clicks with Eyebrow Text": wanneer een eyebrow wél werkt
- Socialectric, "Eyebrow Text in Web Design": overgebruik en navigatiewaarde
- Yellify, "AI content webshop" (juni 2026) en aanverwante NL-gidsen: specificiteitsprobleem van gegenereerde productteksten
- Circulerende "Claude-stijl"-prompts (o.a. Substack/Creators AI): terracotta/sage/cream-replicatie als bewijs dat de esthetiek een herkenbaar sjabloon is geworden
