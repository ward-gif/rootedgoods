# Meta-teksten live nagemeten, 5 november 2026

Marco heeft meta-teksten in Shopware gezet. Dit is de controle op de **live** site,
niet op een bestand.

## Wat er staat

Alle 75 categoriepagina's uit `docs/metingen/2026-11-03-categorie-metas/categorie-feiten.json`
opgehaald en de `<title>` en `<meta name="description">` uit de head gelezen.

| | Aantal |
|---|---:|
| Categoriepagina's totaal | 75 |
| Met een description | **32** |
| Zonder | 43 |
| Nieuw sinds 3 november (toen stond alles leeg) | **32** |

Dat zijn de twaalf kant-en-klare uit klus 1 plus twintig die Marco zelf geschreven
heeft. Hij meldde "de eerste 20"; dat klopt met zijn eigen schrijfwerk.

## Uitkomst van `bin/meta-check.py`

Drie fouten en één waarschuwing over 32 rijen.

### 1. Titel mist het achtervoegsel
`/huis-keuken/lunchboxen-en-zakjes/` → `Lunchboxen en snackpotten met logo | Rooted`

43 tekens, en hij breekt af na "Rooted". Moet `… | Rooted Goods` zijn, dat is 48 tekens
en past ruim. Dit is de enige fout in Marco's eigen twintig.

### 2. Description twee tekens te lang
`/tassen-reizen/`, 157 tekens waar 155 het maximum is:

> Van een Samsonite-koffer tot een gerecycled leren kaarthouder: reisaccessoires met
> jouw logo erop, geassembleerd door Europese makers. Vraag een offerte aan.

Dit is een klus 1-tekst, dus uit `docs/meta-teksten-concept.md`.

### 3. Negen van de 32 beginnen met "Van een" (grens is 6)

**Alle negen komen uit klus 1**, de twaalf kant-en-klare teksten:
`/drinkwaren/`, `/eten-drinken/`, `/huis-keuken/`, `/kantoor-schrijfwaren/`,
`/kleding-textiel/`, `/outdoor/`, `/sport-spel/`, `/tassen-reizen/`, `/verzorging/`.

**Dit is niet Marco's fout.** De opdracht zei letterlijk: "Niets aan veranderen, ze
zijn af." Hij heeft precies gedaan wat er stond.

Sterker: dit stond al in de docstring van `bin/meta-check.py`, geschreven vóór de
opdracht: *"Het bestaande concept in docs/meta-teksten-concept.md liet dat zien: negen
van de eenendertig begonnen letterlijk met 'Van een'."* We wisten het en hebben ze toch
laten plakken.

### Waarschuwing
`/thema-s/dag-van-de/` noemt de categorie niet. Die categorie heet zelf "Dag van de"
(afgekapte naam), dus dat is een bestaand probleem van de categorie, niet van de tekst.

## Wat er nog ligt

43 categoriepagina's zonder description. Dat is klus 2, waarvan Marco twintig van de
63 gedaan heeft.

## Bestanden

| | |
|---|---|
| `live.json` | per pagina de oude en nieuwe titel en description, met lengtes |
| `live.tsv` | de 32 ingevulde rijen, in het formaat dat `bin/meta-check.py` leest |
| `controle.txt` | de uitvoer van de omzetting |

Nameten gaat zo:

```bash
./.venv/bin/python bin/meta-check.py docs/metingen/2026-11-05-metas-live/live.tsv
```
