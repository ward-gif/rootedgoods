# Advertentiebestemmingen naar de categorie, tijdelijk

3 november 2026. Ward wil de eind-URL's in Ads van de landingspagina's naar de
themacategorieën verleggen, tot de herziening van de LP's klaar is. Dit is de lijst
voor Andy, plus wat je moet weten voordat je hem stuurt.

**Dit draait het besluit van 2 november om** dat in `docs/ontwerp-referenties.md` staat
("de LP blijft advertentiebestemming, de categorie erachter"). Bewust en tijdelijk.

## De negen, allemaal gecontroleerd op 3 november

`curl` met een browser-user-agent, alle negen `HTTP 200`, geen omleiding.

| Thema | Nieuwe eind-URL | Producten | Huidige `<title>` | LP die vervalt |
|---|---|---:|---|---|
| Made in NL | `/thema-s/made-in-nl/` | 151 | `Made in NL` | `/made-in-nl` |
| Dag van de ... | `/thema-s/dag-van-de/` | 94 | **`Dag van de`** | `/dag-van-de-leraar` |
| Medewerker merchandise | `/thema-s/medewerker-merchandise/` | 59 | `Medewerker Merchandise` | ja |
| Events en conferenties | `/thema-s/events-conferenties/` | 22 | `Events & conferenties` | ja |
| Brievenbus | `/thema-s/brievenbus/` | 16 | `Brievenbus` | ja |
| Zomer | `/thema-s/zomer/` | 14 | `Zomer` | **geen LP** |
| Onboarding en welkom | `/thema-s/onboarding-welkom/` | 12 | `Onboarding & welkom` | ja |
| Kerstpakketten en eindejaar | `/thema-s/kerstpakketten-eindejaar/` | **11** | `Kerstpakketten & eindejaar` | `/eindejaarsgeschenken` |
| Winter | `/thema-s/winter/` | **4** | `Winter` | **geen LP** |

Winter en zomer hebben geen landingspagina, dus daar valt niets te verleggen; de
categorie is daar nu al de enige bestemming.

## Wat de meting zegt, en het steunt dit besluit

Oktober, betaald zoekverkeer op mobiel, uit GA4:

| Landingspagina | Sessies | Betrokkenheid | Tijd per sessie |
|---|---:|---:|---:|
| `/alle-producten/` | 35 | 91,4% | 91 s |
| `/eindejaarsgeschenken` | 57 | 82,5% | 22 s |

Vier keer zo lang op een productoverzicht als op de landingspagina. Kleine aantallen en
mogelijk andere zoekwoorden erachter, dus geen bewijs, maar het wijst dezelfde kant op
als het voorstel.

## Drie dingen om te weten voordat dit live gaat

**1. De kerstcategorie is de dunste van de negen, en het is de pagina met het geld.**
`/eindejaarsgeschenken` kreeg 383 klikken en € 536,73 over 1 tot en met 29 oktober, de
duurste landingspagina van het account. De categorie erachter heeft elf producten,
terwijl de LP uit de hele catalogus samenstelt. In de drukste weken van het jaar is dat
een stap terug, geen verbetering. Overweeg deze ene op de LP te laten tot januari, of de
categorie eerst te vullen.

**2. Geen van de negen heeft een h1, en de titels zijn kale labels.** `Winter`, `Zomer`,
`Dag van de`. Dat is C1 op de Promidata-lijst (75 van 75 categoriepagina's zonder h1) en
de metateksten liggen bij Marco, ronde 2. Voor Ads betekent het een zwakkere pagina op
precies de punten die de kwaliteitsscore raken.

**3. `/thema-s/dag-van-de/` heet letterlijk "Dag van de".** De naam is afgekapt. Bezoeker
komt op een pagina met 94 producten en een kop die halverwege ophoudt. Dit zou ik
repareren voordat er advertentieverkeer op komt, niet erna.

## Missen we een thema

Van de negen die bestaan: nee, de lijst is compleet. Van wat er *niet* is, en wat het
assortiment wel kan dragen:

| Thema | Waarom | Wat er al ligt |
|---|---|---|
| **Jubileum, afscheid en pensioen** | Klassiek B2B-geschenkmoment, het hele jaar door, geen seizoenspiek nodig | `/huis-keuken/geuren-kaarsen/`, `/eten-drinken/`, `/drinkwaren/glazen/` |
| **Beurs en giveaways** | `/giveaways/` bestaat als productcategorie, met sleutelhangers en lanyards, maar heeft geen thema. Dit is het volumespel naast events | `/giveaways/`, 2 subcategorieën |
| **Thuiswerken en hybride** | Assortiment ligt er volledig | `/kantoor-schrijfwaren/`, `/tassen-reizen/laptoptassen/` |
| **Made in Europe** | Het merkverhaal is Europese makers, maar het thema heet "Made in NL". Breder thema past beter bij de claim | `/thema-s/made-in-nl/`, 151 producten |

Sinterklaas is het enige met een datum erop (5 december, dus nu), maar dat past minder bij
de premium-B2B-positionering dan de vier hierboven. Eigen afweging.
