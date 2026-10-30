# Shopping en Performance Max: geparkeerd, 30 oktober 2026

Ward merkte op dat de branche vooral op productniveau gevonden wil worden, via Shopping en
Performance Max, terwijl wij één Search-campagne draaien die nog niet converteert. Vraag:
leent deze site zich daarvoor, valt er iets te winnen, of verbranden we budget tegen de
grote jongens?

**Besluit: geparkeerd.** Niet omdat het kansloos is, maar omdat de volgorde dan fout is.
Heroverwegen als de meting een maand gedraaid heeft.

## De rekensom die het beslist

Gerekend met € 1,48 per klik (de prijs op Google zelf, na uitsluiting van de zoekpartners)
en 30% brutomarge. Zes echte producten, met hun werkelijke minimumafname uit de `min=`
in de HTML van de productpagina.

| Product | Prijs | Min | Orderwaarde | Marge | Nodige conversie |
|---|---:|---:|---:|---:|---:|
| Bambook Classic A5 | € 18,13 | 1 | € 18 | € 5,44 | **27,2%** |
| Chipolo CARD Tracker | € 34,93 | 1 | € 35 | € 10,48 | **14,1%** |
| Borrelpakket middel | € 25,00 | 5 | € 125 | € 37,50 | 3,95% |
| Pulltap's kelnersmes | € 5,50 | 50 | € 275 | € 82,50 | 1,79% |
| Citizen Green rugzak | € 48,39 | 10 | € 484 | € 145,17 | 1,02% |
| BioSocks Sport | € 4,52 | 250 | € 1.130 | € 339,00 | 0,44% |

Een gangbare webshopconversie is 1 tot 3 procent.

**Het is omgekeerd aan wat je verwacht.** De producten die je per stuk kunt verkopen zijn
onverkoopbaar via Shopping, want 27% conversie bestaat niet. De producten waar de economie
wél klopt, zijn precies de producten waarvan de advertentie liegt: "BioSocks € 4,52" terwijl
de minimumafname 250 stuks is, oftewel € 1.130.

Je adverteert een stuksprijs terwijl je geld in de minimumorder zit.

## De uitweg, als we het ooit doen

Voer in de feed niet het stuk op maar **de minimumorder als product**: "BioSocks Sport,
250 stuks met jouw logo, € 1.130". Dan is de advertentie eerlijk, is de klik gekwalificeerd
(wie € 1.130 ziet en klikt is een inkoper, geen particulier) en is de benodigde conversie
0,44%. Dat is haalbaar, en het is precies wat een volumespeler als 4imprint niet doet.

## Waarom Performance Max nu fout is

PMax leert van conversies en verdeelt het budget over Search, Display, YouTube, Gmail en
Discovery. Er is **één gemeten conversie ooit**, en de meting werkt pas sinds 28 oktober.
Punt D.2 van `q4-aanvragen-plan.md` zegt het al: niet schakelen onder dertig gemeten
conversies in dertig dagen, want daaronder biedt het algoritme op ruis.

Zonder conversiesignaal koopt PMax wat het goedkoopst is, en dat is Display. Daar zit geen
inkoper die kerstgeschenken zoekt. Dat is de manier waarop je het wél verbrandt, en je ziet
het pas na een maand.

## Wat er technisch in de weg staat

Nagekeken op de live site op 30 oktober.

| | Stand |
|---|---|
| Product JSON-LD op de PDP | **goed**: prijs, beschikbaarheid, merk, valide |
| Productfeed | **bestaat niet**, `/export` geeft 404 |
| GTIN | **ontbreekt**. Werkbaar met `identifier_exists: no`, maar het drukt de matchkwaliteit |
| Merk in de data | **"Care Concepts BV"**, de leverancier, niet Rooted Goods |
| Store API | geeft 403, dus hij bestaat; of wij er zelf bij kunnen is onbekend |

## Het enige met een klok erop

**Kan Shopware of Promidata een Merchant Center-feed produceren, en wat kost dat?** Zonder
dat antwoord is de rest theorie. Antwoord en doorlooptijd kosten weken, dus die vraag kan
mee in de eerstvolgende Promidata-mail ook al is het besluit geparkeerd. Staat nog niet in
`promidata-vragen.md`.

## Wanneer heroverwegen, en waarmee

Over vier tot zes weken, als de meting een maand draait en bekend is wat er met de 307
betaalde klikken op `/alle-producten/` gebeurt. Dan één **standaard Shopping-campagne**, geen
PMax, met een handvol producten waarvan de minimumorder boven de € 250 ligt en de feed die
minimumorder als prijs voert. Begrensd budget, toetsbare vraag.

## Het antwoord op "verbranden we dan budget tegen de grote jongens"

Nee, mits je het op eigen terrein speelt. Op "relatiegeschenken" bied je tegen 4imprint
($ 1,3 miljard omzet) en verlies je. Op "250 bamboe sokken met logo, gemaakt in Portugal" is
er geen veiling. Dat is geen budgetspel maar een assortimentsspel.

## Waar dit naast kan zitten

De 30% marge is Wards eigen inschatting en de 25% orderkans is een aanname; allebei uit
`q4-aanvragen-plan.md`, geen van beide gerealiseerd. Opmaak, drukproef, verzending en eigen
uren zitten niet in die 30%, dus elke drempel in de tabel ligt in werkelijkheid hoger. En de
steekproef is zes producten, terwijl de spreiding in minimumafname (1, 5, 10, 50, 250) zo
groot is dat een echte feedbeslissing een telling over de hele catalogus verdient.
