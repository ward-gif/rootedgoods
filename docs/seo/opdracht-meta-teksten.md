# Meta-teksten voor de categoriepagina's

## Wat dit is

Elke categoriepagina hoort twee stukjes tekst te hebben: een **titel** en een
**omschrijving** van een regel of twee. Dat is wat iemand in Google ziet staan als onze
pagina in de zoekresultaten verschijnt. Bij ons zijn die bijna overal leeg.

Jij schrijft ze. Je hoeft er niets van SEO te weten; alle regels zitten in de prompt
die je straks plakt.

---

## Klus 1: twaalf staan al klaar

Half uurtje, geen schrijfwerk. Begin hiermee, dan heb je de route in Shopware meteen
te pakken voordat je gaat schrijven.

In het bestand **`meta-teksten-concept.md`** staan twaalf afgeronde omschrijvingen voor
de grote categorieën. Die zijn geschreven maar nooit in Shopware gezet.

Per categorie:

1. Zoek in dat bestand het kopje met het juiste pad, bijvoorbeeld `/drinkwaren/`
2. Kopieer de regel achter **Meta-description:**
3. Zet hem in het SEO-veld van die categorie in Shopware

Niets aan veranderen, ze zijn af. Het gaat om deze twaalf:

`/alle-producten/` · `/drinkwaren/` · `/kantoor-schrijfwaren/` · `/kleding-textiel/` ·
`/tassen-reizen/` · `/verzorging/` · `/sport-spel/` · `/huis-keuken/` ·
`/elektronica/` · `/giveaways/` · `/eten-drinken/` · `/outdoor/`

---

## Klus 2: 63 categorieën hebben nog niets

Dit doe je in Claude, gewoon in de browser. **Alles in één gesprek**, tien tegelijk.
Niet elke ronde een nieuw gesprek beginnen: in hetzelfde gesprek ziet Claude wat hij al
geschreven heeft en kan hij zichzelf ontwijken. Dat is precies wat we willen.

### De eerste keer

1. Ga naar **claude.ai** en begin een nieuw gesprek
2. Sleep het bestand **`categorie-feiten.md`** in het tekstvak
3. Plak de prompt hieronder, hij is al ingevuld met de eerste tien
4. Verstuur

> Je schrijft meta-titels en meta-descriptions voor de categoriepagina's van
> rootedgoods.eu, een B2B-webshop in relatiegeschenken die met het logo van de klant
> gepersonaliseerd worden. Ik heb de feiten per categorie als bestand bijgevoegd:
> aantal producten, prijsbereik, merknamen, en wat er alleen in die categorie staat.
> Gebruik die, verzin niets bij.
>
> Ik ga je dit in rondes van tien vragen, drieenzestig in totaal. Houd bij welke
> openingswoorden en zinsbouw je al gebruikt hebt en herhaal ze niet.
>
> Toon: warm, eerlijk, concreet, nuchter-Nederlands. Korte zinnen, af en toe een
> langere. Wij zijn de gids, de klant is de held. Noem een product of een merk, niet
> "hoogwaardige producten".
>
> Hard:
> - Titel 35 tot 60 tekens, eindigt op " | Rooted Goods", geen punt erachter.
> - Description 120 tot 155 tekens, eindigt wel op een punt.
> - Je en jij, nooit "u". Nederlands. Geen em-dashes, geen uitroeptekens.
>
> Niet beweren: "gemaakt in Europa" (het is "geassembleerd in Europa"), 100% duurzaam,
> CO2-neutraal, een minimale afname (die is er niet), een concrete levertijd, "binnen
> 24 uur" (het is "binnen een werkdag").
>
> Niet gebruiken: cruciaal, naadloos, optimaliseren, faciliteren, robuust, hoogwaardig,
> premium kwaliteit, unieke selectie, ruim assortiment, uitgebreide collectie, "op zoek
> naar", "het juiste adres", "de beste", "scherpe prijzen", "snelle levering", "ontdek
> onze", "in het hart van".
>
> Varieer, dit is de belangrijkste regel. Bij zestig teksten valt niet een lelijke zin
> op, maar dat ze allemaal dezelfde vorm hebben. In een eerdere ronde begon negen van
> de eenendertig met "Van een". Niet meer dan twee van de tien mogen met hetzelfde
> woord beginnen, en niet elke tekst dezelfde bouw. Soms een zin, soms twee.
>
> Geef tabgescheiden regels, zonder kopregel:
> pad<TAB>titel<TAB>description
>
> De eerste tien:
>
> /thema-s/
> /thema-s/made-in-nl/
> /thema-s/dag-van-de/
> /thema-s/medewerker-merchandise/
> /drinkwaren/drinkflessen/
> /huis-keuken/keukenartikelen/
> /drinkwaren/glazen/
> /outdoor/zakmessen-multi-tools/
> /huis-keuken/planten/
> /huis-keuken/lunchboxen-en-zakjes/

### Elke ronde daarna

In **hetzelfde gesprek** typ je alleen dit, met tien nieuwe paden uit de lijst achterin:

> Volgende tien. Let op de variatie: gebruik geen openingswoord en geen zinsbouw die je
> hierboven al gebruikt hebt.
>
> /pad-een/
> /pad-twee/
> ...

Meer niet. De regels uit de eerste prompt blijven gelden, die hoef je niet te herhalen.

### Wat je met de antwoorden doet

Claude geeft per ronde tien regels terug, met tabs ertussen. Zet die onder elkaar in
een spreadsheet met drie kolommen: **pad**, **titel**, **omschrijving**.

**Na ronde 2 stuur je de spreadsheet naar Ward.** Er loopt dan een controle overheen en
je hoort of het goed gaat. Zo weet je het na twintig in plaats van na drieënzestig.

**Als alles klaar is** zet je ze zelf in Shopware. Er is geen importfunctie, dus het is
per categorie de titel en de omschrijving in de SEO-velden plakken. Vanuit de
spreadsheet gaat dat het snelst: cel aanklikken, kopiëren, plakken.

Reken op 75 categorieën met twee velden. Doe het in blokken en niet in één ruk.

---

## De 63 categorieën

| Pad | Titel nu | Producten |
|---|---|---:|
| `/thema-s/` | Thema's | 199 |
| `/thema-s/made-in-nl/` | Made in NL | 151 |
| `/thema-s/dag-van-de/` | Dag van de | 94 |
| `/thema-s/medewerker-merchandise/` | Medewerker Merchandise | 59 |
| `/drinkwaren/drinkflessen/` | Drinkflessen | 42 |
| `/huis-keuken/keukenartikelen/` | Keukenartikelen | 38 |
| `/drinkwaren/glazen/` | Glazen | 31 |
| `/outdoor/zakmessen-multi-tools/` | Zakmessen & Multi-tools | 27 |
| `/huis-keuken/planten/` | Planten | 24 |
| `/huis-keuken/lunchboxen-en-zakjes/` | Lunchboxen en zakjes | 23 |
| `/kleding-textiel/handdoeken/` | Handdoeken | 23 |
| `/thema-s/events-conferenties/` | Events & conferenties | 22 |
| `/tassen-reizen/koffers-trolleys/` | Koffers & Trolleys | 17 |
| `/thema-s/brievenbus/` | Brievenbus | 16 |
| `/eten-drinken/borrelpakketten/` | Borrelpakketten | 14 |
| `/thema-s/zomer/` | Zomer | 14 |
| `/drinkwaren/mokken-bekers/` | Mokken & Bekers | 13 |
| `/tassen-reizen/winkeltassen/` | Winkeltassen | 13 |
| `/thema-s/onboarding-welkom/` | Onboarding & welkom | 12 |
| `/huis-keuken/geuren-kaarsen/` | Geuren & kaarsen | 11 |
| `/kleding-textiel/kleding/` | Kleding | 11 |
| `/thema-s/kerstpakketten-eindejaar/` | Kerstpakketten & eindejaar | 11 |
| `/eten-drinken/dranken/` | Dranken | 10 |
| `/kleding-textiel/accessoires/` | Accessoires | 9 |
| `/kantoor-schrijfwaren/notebooks/` | Notebooks | 8 |
| `/outdoor/paraplu-s/` | Paraplu's | 8 |
| `/sport-spel/sportartikelen/` | Sportartikelen | 8 |
| `/kantoor-schrijfwaren/balpennen-inktpennen-en-sets/` | Balpennen, inktpennen en sets | 7 |
| `/kleding-textiel/caps-hoeden/` | Caps & Hoeden | 7 |
| `/tassen-reizen/reis-accessoires/` | Reis accessoires | 7 |
| `/giveaways/sleutelhangers/` | Sleutelhangers | 6 |
| `/tassen-reizen/totebags/` | Totebags | 6 |
| `/drinkwaren/thermo-drinkwaren/` | Thermo drinkwaren | 5 |
| `/eten-drinken/snoepgoed/` | Snoepgoed | 5 |
| `/huis-keuken/wijn-accessories/` | Wijn accessories | 5 |
| `/tassen-reizen/koeltassen/` | Koeltassen | 5 |
| `/giveaways/lanyards/` | Lanyards | 4 |
| `/huis-keuken/woon-accessoires/` | Woon accessoires | 4 |
| `/tassen-reizen/reistassen/` | Reistassen | 4 |
| `/thema-s/winter/` | Winter | 4 |
| `/elektronica/phone-tablet-accessoires/` | Phone & tablet accessoires | 3 |
| `/eten-drinken/gebak/` | Gebak | 3 |
| `/huis-keuken/deken/` | Deken | 3 |
| `/outdoor/auto-accessoires/` | Auto accessoires | 3 |
| `/outdoor/auto-accessoires/overige/` | Overige | 3 |
| `/tassen-reizen/rugzakken/` | Rugzakken | 3 |
| `/tassen-reizen/schoudertassen/` | Schoudertassen | 3 |
| `/kleding-textiel/caps-hoeden/caps/` | Caps | 2 |
| `/outdoor/koelbox/` | Koelbox | 2 |
| `/outdoor/strandstoel/` | strandstoel | 2 |
| `/sport-spel/golfartikelen/` | Golfartikelen | 2 |
| `/sport-spel/spelletjes-speelgoed/` | Spelletjes & speelgoed | 2 |
| `/sport-spel/zomer-strand/` | Zomer & strand | 2 |
| `/tassen-reizen/heuptassen/` | Heuptassen | 2 |
| `/tassen-reizen/laptoptassen/` | Laptoptassen | 2 |
| `/tassen-reizen/sporttassen/` | Sporttassen | 2 |
| `/huis-keuken/drinkflessen/` | Drinkflessen | 1 |
| `/huis-keuken/flesopeners/` | Flesopeners | 1 |
| `/kantoor-schrijfwaren/kantoor-accessoires/` | Kantoor accessoires | 1 |
| `/kleding-textiel/broeken-shorts/` | Broeken & shorts | 1 |
| `/kleding-textiel/caps-hoeden/overige/` | Overige | 1 |
| `/outdoor/outdoor/` | Outdoor | 1 |
| `/tassen-reizen/strandtassen/` | Strandtassen | 1 |
