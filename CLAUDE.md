# Rooted Goods — webshop

rootedgoods.eu. Shopware 6.5 via Promidata, gesloten custom thema. We hebben geen
toegang tot de themabestanden en geen rechten om plugins te installeren. Alles wat we
zelf kunnen, doen we met eigen CSS en JS die extern laden, en met HTML-blokken die Ward
met de hand in het Shopware-CMS plakt.

De showroom is een ander project, met een eigen repo en een eigen workspace. Loopt er
iets over, dan hoort het hier of daar, nooit in allebei.

## Harde regels

1. **De live site laadt de `.min`-varianten.** In de thema-head staan
   `rootedgoods.min.css` en `rootedgoods.min.js` op jsDelivr. Die bestanden staan niet
   in de repo; jsDelivr maakt ze zelf en **cachet ze apart van de onverkorte versies.**
   Purge je alleen `rootedgoods.css`, dan verandert er niets op de site. Dat is jarenlang
   zo gegaan. Gebruik `bin/publiceer.sh`, die purget alle vier en controleert het.
2. **Een purge op `@main` is geen garantie, en soms doet hij niets.** Gemeten op
   30 oktober 2026: `purge.jsdelivr.net` gaf `HTTP 200`, de `age`-header stond op `0`,
   en `rootedgoods.min.css` serveerde nog de oude inhoud. Drie purges later nog steeds.
   Later die dag ververste ook de onverkorte `@main` niet meer: `HTTP 200` op de purge,
   maar `age` liep gewoon door naar 481 en de inhoud bleef oud. Dezelfde commit via een
   SHA-URL stond op `age: 0` met de nieuwe inhoud.

   **Wij kunnen een wijziging dus niet afdwingen.** `bin/publiceer.sh` toetst daarom op
   inhoud en niet op de `age`-header, en zegt het eerlijk als het niet gelukt is. Loopt
   het vast: de edge zakt vanzelf binnen twaalf uur (`s-maxage=43200`), of je controleert
   met een SHA-URL of de commit wél goed op jsDelivr staat.

   `docs/kaart-assets.md` waarschuwde hier al voor bij de kaart-SVG's, en de thema-head
   laadt precies dat `@main`. De structurele oplossing is van Promidata: een SHA in de
   thema-head. Zie punt A3 in `docs/promidata-vragen.md`.
3. **Purgen raakt de edge, niet de bezoeker.** De bestanden komen binnen met
   `max-age=604800`: zeven dagen in de browser, en die controleert in die week niet of er
   iets nieuws is. Wie de site deze week bezocht, ziet je wijziging pas na die week of na
   een harde ververs. Zeg dat erbij als iemand vraagt waarom hij het nog niet ziet. De
   oplossing is een versie-query in de thema-URL, punt A3 in `docs/promidata-vragen.md`,
   nog niet aangevraagd.
4. **Brace-check vóór elke push.** Eén ontbrekende `}` in `rootedgoods.css` sloopt stil
   alles eronder. `bin/publiceer.sh` breekt af bij een diepte die niet 0 is.
5. **Verwijs naar assets met een vaste commit-SHA, niet met `@main`.** Zie
   `docs/kaart-assets.md`. Bij `@main` komt een purge er niet altijd door en serveert de
   CDN per bestand nog het oude, waardoor kaarten onderling niet meer kloppen. Dat is twee
   keer misgegaan.
6. **Elke wijziging via Promidata kost geld.** Verzamel ze in
   `docs/promidata-vragen.md` en stuur ze in één mail, met de reden en het gemeten effect
   erbij. Navigatie is €250 tot €500, PDP boven de configurator €1000.
7. **Meet in code, niet met het oog.** Ruwe uitvoer gaat naar `docs/metingen/`, ook als
   hij lelijk is. Een export die je niet bewaart is een meting die nooit heeft
   plaatsgevonden. Zie de LEESMIJ daar.

## Publiceren

```bash
bin/publiceer.sh "wat je veranderd hebt"   # brace-check, commit, push, purge, controle
bin/publiceer.sh --alleen-purge            # zonder commit
```

Het script controleert achteraf: de onverkorte bestanden op de CDN moeten byte voor byte
gelijk zijn aan lokaal, en de `.min`-varianten moeten een lage `age` hebben. Is er iets
niet vers, dan eindigt het met een foutmelding en moet je het opnieuw draaien. De purge
is asynchroon en komt niet altijd in één keer door.

## Lokaal werken

**De CSS-server.** Dubbelklik `serve.command`, of draai het in Terminal. Dat serveert de
repo op `http://localhost:8000` met `no-cache`-headers. Daarna laat je de Resource
Override-extensie in de browser `rootedgoods.min.css` van de live site vervangen door
`http://localhost:8000/rootedgoods.css`. Zo zie je je verse CSS op de echte site zonder
te pushen. Het venster open laten staan; sluiten stopt de server.

**Losse preview.** `_preview.html` op poort 8010, voor een blok los van de site. Staat in
`.gitignore` en blijft lokaal. Alleen renderen als Ward erom vraagt.

Controleren of er iets draait:

```bash
lsof -ti tcp:8000   # de CSS-server
lsof -ti tcp:8010   # de preview
```

## De blokken

Twee mappen, met een duidelijke rolverdeling:

| Map | Wat | Bewerken? |
|---|---|---|
| `blokken-def/` | De 32 blokken, met hun commentaar. De bron. | **Ja, hier werk je.** |
| `plakklaar/` | Dezelfde blokken zonder commentaar. | **Nooit.** Wordt overschreven. |

**Een blok naar de site brengen.** Shopware is de webshop achter rootedgoods.eu. Het thema
is dicht, dus HTML kun je niet deployen; Ward plakt een blok met de hand in de
HTML-editor van het Shopware-CMS. Dat gaat zo:

```bash
bin/plakklaar.sh          # na elke wijziging in blokken-def/
```

Open daarna `plakklaar/<naam>.html`, cmd-A, cmd-C, en plak in Shopware. Een push verandert
niets aan de site; pas het plakken doet dat.

Liever direct op het klembord, zonder het bestand te openen:

```bash
bin/plak.sh over-ons          # op het klembord
bin/plak.sh over-ons --toon   # ook naar het scherm
bin/plak.sh --lijst
```

Allebei gebruiken `bin/ontdoe-commentaar.py`, één implementatie. `bin/publiceer.sh` breekt
af als `plakklaar/` achterloopt bij `blokken-def/`, zodat er nooit een verouderd blok
klaarstaat.

**Waarom het zo staat.** Er waren twee handgeschreven mappen: concept in `blokken/`, en
comment-vrij naar `blokken-def/`. Dat werkt zolang beide kanten bijgewerkt worden, en dat
gebeurde niet. Op 30 oktober 2026 verschilden 30 van de 31 gedeelde bestanden, en bij 21
daarvan was de inhoud echt uit elkaar gelopen; het commentaar beschreef toen een oudere
versie van het blok, wat erger is dan geen commentaar.

Het verschil met toen: `plakklaar/` wordt **gegenereerd**, nooit getypt. Een gegenereerde
kopie kan niet uit de pas lopen, en de poort in `publiceer.sh` merkt het als hij veroudert.

`blokken/` is op 30 oktober samengevoegd en verwijderd. Alle 153 commentaren zijn
overgezet, elk verankerd op de regel die erop volgde; kon dat niet omdat het blok sindsdien
veranderd was, dan staat het in een kopblok met die waarschuwing erbij. Gecontroleerd over
alle 32 blokken: **geen enkele regel met inhoud is veranderd**; 25 blokken zijn byte voor
byte gelijk aan wat er gecommit stond, bij 7 verschilt alleen een lege regel tussen twee
tags. De geschiedenis zit in git.

## Merk

**De bron is de `rootedgoods` skill**, in `~/.claude/skills/rootedgoods/`. Die staat als
tweede map in deze workspace, zodat een huisstijlwijziging hier en in de showroom
tegelijk zichtbaar is. Kleuren, tokens, claims en toon staan daar, niet in dit bestand en
niet in de CSS.

**De designtokens staan op drie plekken** en kunnen dus uit elkaar lopen: `:root` in
`rootedgoods.css` (leidend), `design/tokens.css` in de skill (kopie), en
`src/styles/showroom.css` in de showroom (uit de skill). Controleer dat met:

```bash
python3 "../merk/merk-gelijk.py"
```

Stand 30 oktober 2026, na het opruimen: 19 gedeelde tokens site tegen skill, allemaal
gelijk; 8 gedeeld skill tegen showroom, allemaal gelijk. Wat hier wel staat en in de
skill niet: `--rg-space-md/lg/xl` en `--rg-text-display`, lay-out van deze site en geen
huisstijl.

**Begin geen derde spacingschaal.** Er waren er drie. `--rg-e1..e6` werd door de
merkgids voorgeschreven voor nieuw werk en werd nul keer aangeroepen; geschrapt op
30 oktober 2026, net als `--rg-space-xs`, `-sm`, `--rg-s1` en `--rg-s5`. Wat overblijft
is wat echt gebruikt wordt:

| Schaal | Aanroepen | Waarvoor |
|---|---|---|
| `--rg-space-md/lg/xl` | 5 | verticale ritmiek: eyebrow → kop → subkop → knop |
| `--rg-s2/s3/s4` | 7 | stappen van 8 px |

Welke van de twee de maat wordt is een open besluit. Gebruik tot die tijd wat er in de
buurt al staat in plaats van iets nieuws te beginnen.

**Drie tokens staan er bewust nog zonder gebruiker:** `--rg-hair` (de cognac hairline,
het signatuurelement), `--rg-line` en `--rg-sh-rest`. Die staan alle drie ook in de
merkgids, en "hairline boven schaduw" is daar een principe. Dat ze nu nergens worden
aangeroepen betekent dat het principe nog niet toegepast is, niet dat het ballast is.
Niet schrappen zonder dat de merkgids meebeweegt.

**De showroom bewaakt zijn kant zelf:** sinds 30 oktober breekt de showroom-build af als
zijn tokens afwijken van de merkgids, met beide waarden in de melding. Aan deze kant is
het nog handwerk, want `rootedgoods.css` laadt via jsDelivr uit de repo en kan niet bij
een skill op jouw schijf. Verander je hier een kleur, trek dan de skill bij; de showroom
klaagt vanzelf zodra dat niet gebeurd is.

Afgeleid merkmateriaal dat van geen van beide projecten is (de GPT-export, het
merkgids-plan) staat in `../merk/`.

Copy-regels die hier steeds terugkomen: geen em-dashes, `&` in Playfair-koppen via
`<span class="rg-amp">`, alle interne URL's lowercase, Playfair cursief is faux oblique
(nooit de ital-as laden). Kopieerbare patronen staan in `docs/html-snippets.html`.

## Waar wat staat

| Map | Wat erin staat |
|---|---|
| `rootedgoods.css`, `rootedgoods.js` | De levende bestanden. Blijven in de wortel, want de live site laadt ze daarvandaan. |
| `blokken-def/` | Alle 32 CMS-blokken, met commentaar. De bron. |
| `plakklaar/` | Gegenereerd, zonder commentaar. Openen en plakken. Nooit bewerken. |
| `svg/`, `beeld/` | Assets die via jsDelivr laden. Verwijs met een SHA. |
| `bin/` | `publiceer.sh`, `plakklaar.sh`, `plak.sh` en het meetgereedschap (`psi`, `ga4`, `gsc`, `clarity`). Python draait uit `.venv`. |
| `docs/` | Plannen, diagnoses, audits, mails. `html-snippets.html` is de naslag met kopieerbare patronen. |
| `docs/metingen/` | Ruwe meetgegevens, `<jjjj-mm-dd>-<onderwerp>`. |
| `docs/gtm/` | De tracking-opzet en de containerexports. |
| `docs/promidata-vragen.md` | De verzamellijst richting Promidata. Nog niet verstuurd. |
| `docs/archief/` | Documenten die hun werk gedaan hebben. |
