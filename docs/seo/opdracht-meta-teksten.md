# Meta-teksten voor de categoriepagina's

Alle 75 categoriepagina's hebben een lege meta description. 63 hebben alleen de
categorienaam als titel. Jij vult ze.

## Wat je doet, in deze volgorde

**1. Plak de twaalf die al klaarliggen.** In `docs/meta-teksten-concept.md` staan
afgeronde descriptions voor de hoofdcategorieën. Die zijn nooit in Shopware gezet.
Geen schrijfwerk, alleen plakken.

**2. Vraag Ward of het in bulk kan.** 75 keer twee velden met de hand is een
middag. Shopware kan categorieën im- en exporteren. Vraag dat vóórdat je begint.

**3. Schrijf de 63 die onderaan dit bestand staan.** Tien per keer.

## De regels

| | |
|---|---|
| Titel | 35 tot 60 tekens, eindigt op ` \| Rooted Goods`, **geen punt** |
| Description | 120 tot 155 tekens, **wel** een punt |
| Aanspreekvorm | je en jij, nooit "u" |
| Nooit | em-dashes, uitroeptekens, Engelse wendingen |

## Wat je niet mag beweren

| Wel | Niet |
|---|---|
| geassembleerd in Europa | gemaakt in Europa, 100% duurzaam, CO2-neutraal |
| binnen één werkdag een vrijblijvend voorstel | binnen 24 uur, binnen 2 dagen |
| digitale drukproef vooraf, gratis ontwerp | |
| er is **geen** vaste minimale afname | vanaf 25 stuks |
| levertijd is productafhankelijk | elke concrete levertijd |

## Woorden die er niet in mogen

cruciaal · naadloos · optimaliseren · faciliteren · robuust · hoogwaardig ·
premium kwaliteit · unieke selectie · ruim assortiment · uitgebreide collectie ·
"op zoek naar" · "het juiste adres" · "voor ieder wat wils" · "de beste" ·
"scherpe prijzen" · "snelle levering" · "ontdek onze" · "in het hart van"

## De belangrijkste regel

Bij 63 teksten is de valkuil niet een lelijke zin, maar dat ze allemaal dezelfde
vorm hebben. In het bestaande concept begon **9 van de 31** met "Van een".

Varieer de opening, de zinsbouw en het aantal zinnen. De controle breekt af als
meer dan 20% hetzelfde begint of dezelfde woordgroep gebruikt.

---

## Dit plak je in Claude

> Je schrijft meta-titels en meta-descriptions voor de categoriepagina's van
> rootedgoods.eu, een B2B-webshop in relatiegeschenken die met het logo van de
> klant gepersonaliseerd worden.
>
> Toon: warm, eerlijk, concreet, nuchter-Nederlands. Korte zinnen, af en toe een
> langere. Wij zijn de gids, de klant is de held. Concreet boven abstract: noem
> een product of een merk, niet "hoogwaardige producten".
>
> Regels, hard:
> - Titel 35 tot 60 tekens, eindigt op " | Rooted Goods", geen punt erachter.
> - Description 120 tot 155 tekens, eindigt wel op een punt.
> - Je en jij, nooit "u". Nederlands. Geen em-dashes, geen uitroeptekens.
> - Niet beweren: "gemaakt in Europa" (het is "geassembleerd in Europa"),
>   100% duurzaam, CO2-neutraal, een minimale afname, een concrete levertijd,
>   "binnen 24 uur" (het is "binnen één werkdag").
> - Niet gebruiken: cruciaal, naadloos, optimaliseren, faciliteren, robuust,
>   hoogwaardig, premium kwaliteit, unieke selectie, ruim assortiment,
>   uitgebreide collectie, "op zoek naar", "het juiste adres", "de beste",
>   "scherpe prijzen", "snelle levering", "ontdek onze", "in het hart van".
> - **Varieer.** Niet meer dan twee van de tien mogen met hetzelfde woord
>   beginnen. Niet elke tekst dezelfde bouw. Soms één zin, soms twee.
>
> Ik geef je per categorie de feiten: aantal producten, prijsbereik, merken, en
> wat er alleen in die categorie staat. Gebruik die, verzin niets bij.
>
> Geef je antwoord als tabgescheiden regels, zonder kopregel:
> pad<TAB>titel<TAB>description

Plak daaronder het stuk uit `docs/seo/categorie-feiten.md` voor de tien
categorieën die je doet. Niet alle 75 tegelijk, dan gaan ze op elkaar lijken.

## Controleren

Zet alles onder elkaar in `docs/seo/meta-teksten.tsv`, met bovenaan één kopregel
`pad	titel	description`. Dan:

```bash
bin/meta-check.py docs/seo/meta-teksten.tsv
```

Fouten moeten weg, waarschuwingen mag je negeren als je weet waarom. Draai hem
telkens over het hele bestand, niet over de laatste tien.

## Inleveren

`docs/seo/meta-teksten.tsv`, door de controle heen. Twijfel je over de feiten van
een categorie, zet hem dan apart in plaats van iets aannemelijks te verzinnen.

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
