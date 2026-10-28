# Search Console uitlezen

> Opgezet 27 oktober 2026. Draait op hetzelfde serviceaccount als GA4, dus zonder sleutel
> en zonder een tweede inlog. Zie `bin/ga4-setup.md` voor die basis.

**Serviceaccount:** `ga4-lezer@rootedgoods-analytics.iam.gserviceaccount.com`
**API:** `searchconsole.googleapis.com`, aan in project `rootedgoods-analytics`

## Eenmalig: toegang geven in Search Console

Dit is het enige handwerk. Het kan niet via de API, want Search Console-rechten worden
alleen in de interface uitgedeeld.

1. Ga naar [search.google.com/search-console](https://search.google.com/search-console),
   ingelogd als `info@rootedgoods.eu`
2. Kies de property **rootedgoods.eu**
3. **Instellingen** (tandwiel linksonder) → **Gebruikers en machtigingen**
4. **Gebruiker toevoegen**, en plak dit adres:

   ```
   ga4-lezer@rootedgoods-analytics.iam.gserviceaccount.com
   ```

5. Rechten: **Volledig** of **Beperkt**, allebei goed. Beperkt is genoeg om te lezen.

## Als rootedgoods.eu er niet tussen staat

Dan is de site nooit geverifieerd in Search Console, en dat is op zichzelf een bevinding:
Google heeft dan nooit zoekdata met je gedeeld en je hebt al die maanden blind gestaan op
organisch. Verifiëren kan op vier manieren; de makkelijkste hier is een DNS-record bij ZXCS,
of het bestaande Google-tag op de site (Search Console herkent `G-VT3YF07ZGB`).

Dit stond al als openstaand punt in `docs/post-golive-audit.md`: "Google Search Console en
Bing Webmaster Tools: eigendom verifiëren voor rootedgoods.eu, XML-sitemap indienen."

## Daarna

```bash
bin/gsc.sh                                  # laatste 30 dagen
bin/gsc.sh --van 2026-08-01 --tot 2026-10-25
```

Vier rapporten: zoekvragen waarop je gevonden wordt, welke pagina's vertoningen halen,
per apparaat en per land. Plus het totaal met de gemiddelde positie.

**Wat ik er als eerste uit wil weten:**

1. **Welke pagina's vertoningen halen.** Ontbreken `/eindejaarsgeschenken`, `/offerte` en de
   andere eigen pagina's ook hier, dan is de sitemapbevinding uit de diagnose bevestigd en
   weten we dat ze simpelweg niet bestaan voor Google.
2. **De organische zoekvragen naast de betaalde.** Als mensen je organisch op andere termen
   vinden dan waar je op biedt, zit daar gratis vraag die je nu niet bedient.
3. **De gemiddelde positie.** Staat die rond de 40, dan is organisch dit kwartaal geen
   kanaal en moeten we er ook geen tijd in steken.

## Voorbehouden

- Search Console loopt ongeveer **twee dagen achter**; de laatste dagen zijn altijd
  incompleet. Het script zegt dat bij elke draai.
- Zoekvragen met weinig volume worden door Google weggelaten om privacyredenen, net als bij
  het zoektermenrapport in Ads. Het totaal klopt, de lijst is een ondergrens.
- Posities zijn gemiddelden over alle vertoningen, dus een positie van 15 kan betekenen
  "altijd 15" of "soms 3, meestal 30".
