# Aanzetje: prompt voor Promidata — betere productomschrijvingen

Eerste opzet om op door te itereren, geen kant-en-klaar eindresultaat. Bedoeling:
Promidata's eigen contentpijplijn (die de productomschrijvingen in de feed vult)
een instructie meegeven die tot betere, vindbaardere, maar nog steeds
geloofwaardige tekst leidt — niet naar nóg een generiek AI-sjabloon.

---

## Instructie voor Promidata (concept)

> Genereer voor elk product een omschrijving van 80-150 woorden, opgebouwd
> volgens onderstaande structuur. Gebruik alleen informatie die daadwerkelijk
> in de brondata van het product staat — verzin geen specificaties, cijfers
> of claims die er niet in staan.
>
> **1. Openingszin — feitelijk, geen slogan.**
> Begin met wat het product IS, niet met een wervende dooddoener. "Deze
> rvs thermosbeker houdt dranken tot 6 uur warm" i.p.v. "Geniet tot de
> laatste slok van je favoriete drank." Noem hier, indien beschikbaar in de
> brondata: het merk, en het land/de regio van productie of assemblage.
>
> **2. Wat het is, in eigen woorden — synoniemen voor vindbaarheid.**
> Noem het product minstens één keer met een alternatieve, veelgezochte
> benaming naast de officiële naam (bijv. "thermosbeker" / "isolatiebeker"
> / "reisbeker"; "notitieboek" / "notitieblok" / "schrijfblok"). Natuurlijk
> in de zin verwerkt, niet als losse opsomming van zoekwoorden.
>
> **3. Concrete specificaties, alleen als ze in de brondata staan.**
> Afmetingen, gewicht, materiaal, capaciteit/inhoud, kleuropties. Weglaten
> i.p.v. verzinnen als een veld leeg is.
>
> **4. Eén tot twee voordelen, met reden — geen losse adjectieven.**
> Niet "duurzaam en hoogwaardig" zonder toelichting. Wel: "het roestvrij
> stalen frame vervangt wegwerpbekers" (mechanisme, niet alleen het label).
>
> **5. Bedoeld gebruik/context, kort.**
> Eén zin over wanneer of waarvoor het product past (bijv. "handig op
> kantoor of onderweg"), geen losse bullet-lijst met vijf vinkjes.
>
> **Vermijd expliciet:**
> - Een vaste "Belangrijkste voordelen:"-bulletlijst die bij elk product
>   identiek is opgebouwd — dat leest als sjabloon, niet als tekst over
>   dít product.
> - Superlatieven zonder onderbouwing ("beste", "meest duurzame") tenzij
>   een certificaat of meetbaar gegeven dat dekt.
> - Keyword-stapeling ("Duurzaam Notitieboek A5 Gerecycled Papier
>   Relatiegeschenk Bedrijven Kantoor") — natuurlijke zinnen, geen
>   opeenstapeling van zoektermen.
> - Uitroeptekens en overdreven enthousiasme.
> - Precies dezelfde zinsopbouw/lengte bij elk product binnen een
>   categorie — twee producten naast elkaar moeten leesbaar verschillend
>   zijn, ook als de brondata op elkaar lijkt.

---

## Waarom deze punten (voor intern gebruik, niet voor Promidata)

- **Merk + land van productie vroeg noemen**: sluit aan bij Rooted Goods'
  eigen "geassembleerd in Europa"-verhaal — als de feed dit al aanlevert,
  is het zonde als het nergens in de zichtbare tekst terechtkomt.
- **Synoniemen, niet keywords stapelen**: goed voor vindbaarheid (mensen
  zoeken op "isolatiebeker" én "thermosbeker"), maar natuurlijk verwerkt
  i.p.v. een keyword-soup-tell.
- **Geen vaste bulletlijst-sjabloon**: dit was letterlijk de bevinding uit
  de audit — de Thermos-omschrijving las als sjabloon ("Belangrijkste
  voordelen: - Duurzaam & Milieubewust..."), LOKD (andere leverancier/feed)
  had een volledig eigen, productspecifieke tekst. Doel is dat élk product
  richting de LOKD-kant beweegt, niet dat de sjabloon overal terugkomt.
- **Mechanisme i.p.v. los adjectief**: zelfde principe als de eigen
  FAQ/copy op de site al toepast ("duurzaam" alleen genoemd mét wat het
  concreet betekent) — voor consistentie tussen eigen content en
  feed-content.

## Openstaande vragen om zelf nog te beslissen voor je dit verstuurt

1. Geldt dit voor **alle** producten, of alleen voor leveranciers/feeds die nu
   al de sjabloon-stijl gebruiken (zoals de Thermos-beker)? Overschrijven
   van feeds die al een eigen goede tekst hebben (zoals LOKD) is niet nodig.
2. Wil je zelf een voorbeeld-input/output-paar meesturen (één product met
   ruwe brondata + het gewenste eindresultaat) zodat Promidata's team het
   verschil concreet ziet, in plaats van alleen de regels?
3. Moet dit automatisch per taal (NL/DE/FR als dat ooit relevant wordt), of
   voorlopig alleen NL?

## Aanvulling n.a.v. PDP-steekproef (11 producten, 1 per categorie)

- Bulletlijst-sjabloon ("Belangrijkste voordelen:") kwam **0 van de 11**
  keer voor — lijkt dus een leverancier-/feedspecifiek probleem (de
  Thermos-feed), geen sitebreed patroon. Prompt vooral relevant voor de
  synoniemen/mechanisme-punten hierboven, niet als brede sjabloon-fix.
- Losstaand, technisch (geen tekst-/AI-signaal-probleem, waarschijnlijk een
  feed-veld-issue): titel toont soms "PMS kleur bij benadering" in het
  kleur-slot i.p.v. een echte kleurnaam (bijv. AquaSocks, BottleBag), en
  sommige titels krijgen een lange numerieke SKU-staart aangeplakt
  (bijv. "...A508-262933-970999999"). Los van deze prompt bij Promidata
  aankaarten.
