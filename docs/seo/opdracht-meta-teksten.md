# Meta-teksten voor de categoriepagina's

## Wat dit is

Elke categoriepagina hoort twee stukjes tekst te hebben: een **titel** en een
**omschrijving** van een regel of twee. Dat is wat iemand in Google ziet staan als onze
pagina in de zoekresultaten verschijnt. Bij ons zijn die bijna overal leeg.

Jij schrijft ze. Je hoeft er niets van SEO te weten; alle regels zitten in de prompt
die je straks plakt.

---

## Klus 1: twaalf staan al klaar

Half uurtje, geen schrijfwerk.

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

Dit doe je in Claude, gewoon in de browser. Tien tegelijk.

**Per ronde van tien:**

1. Ga naar claude.ai en begin een **nieuw gesprek**
2. Sleep het bestand **`categorie-feiten.md`** in het tekstvak
3. Plak de hele prompt hieronder
4. Zet er tien paden onder uit de lijst achterin dit bestand
5. Verstuur
6. Claude geeft tien regels terug. Zet die onder elkaar in een bestand of spreadsheet,
   met drie kolommen: pad, titel, omschrijving

**Begin elke ronde in een nieuw gesprek.** Doe je ze allemaal in één gesprek, dan gaan
de teksten op elkaar lijken en moet je overnieuw.

**Na de eerste twintig: stuur het bestand naar Ward.** Hij laat er een controle
overheen lopen en zegt of het goed gaat. Dan weet je het na twintig in plaats van na
drieënzestig.

**Als alles klaar is** stuur je het bestand naar Ward. Hij zegt dan of het in één keer
geïmporteerd kan worden of dat het met de hand in Shopware moet.

---

## De prompt

Plak dit hele blok, van "Je schrijft" tot en met "De tien categorieën:".

> Je schrijft meta-titels en meta-descriptions voor de categoriepagina's van
> rootedgoods.eu, een B2B-webshop in relatiegeschenken die met het logo van de klant
> gepersonaliseerd worden. Ik heb de feiten per categorie als bestand bijgevoegd:
> aantal producten, prijsbereik, merknamen, en wat er alleen in die categorie staat.
> Gebruik die, verzin niets bij.
>
> **Toon:** warm, eerlijk, concreet, nuchter-Nederlands. Korte zinnen, af en toe een
> langere. Wij zijn de gids, de klant is de held. Noem een product of een merk, niet
> "hoogwaardige producten".
>
> **Hard:**
> - Titel 35 tot 60 tekens, eindigt op " | Rooted Goods", géén punt erachter.
> - Description 120 tot 155 tekens, eindigt wél op een punt.
> - Je en jij, nooit "u". Nederlands. Geen em-dashes, geen uitroeptekens.
>
> **Niet beweren:** "gemaakt in Europa" (het is "geassembleerd in Europa"), 100%
> duurzaam, CO2-neutraal, een minimale afname (die is er niet), een concrete levertijd,
> "binnen 24 uur" (het is "binnen één werkdag").
>
> **Niet gebruiken:** cruciaal, naadloos, optimaliseren, faciliteren, robuust,
> hoogwaardig, premium kwaliteit, unieke selectie, ruim assortiment, uitgebreide
> collectie, "op zoek naar", "het juiste adres", "de beste", "scherpe prijzen",
> "snelle levering", "ontdek onze", "in het hart van".
>
> **Varieer, dit is de belangrijkste regel.** Bij zestig teksten valt niet een lelijke
> zin op, maar dat ze allemaal dezelfde vorm hebben. In een eerdere ronde begon negen
> van de eenendertig met "Van een". Niet meer dan twee van de tien mogen met hetzelfde
> woord beginnen, en niet elke tekst dezelfde bouw. Soms één zin, soms twee.
>
> Geef tabgescheiden regels, zonder kopregel:
> `pad<TAB>titel<TAB>description`
>
> De tien categorieën:

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
