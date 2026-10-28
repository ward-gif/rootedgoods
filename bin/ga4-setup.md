# GA4 uitlezen, op een eigen Rooted Goods-identiteit

> Opgezet 27 oktober 2026. Rooted Goods wordt een eigen entiteit, dus dit staat
> bewust los van de Bambook-gcloud in `~/.config/gcloud`. De twee delen geen
> credentialsbestand en kunnen elkaar niet overschrijven.

**Property:** `551909322` · **Identiteit:** `info@rootedgoods.eu` ·
**Configmap:** `~/.config/gcloud-rootedgoods`

## Eenmalig

Alles in één terminal, want de eerste regel geldt voor de hele sessie.

```bash
export CLOUDSDK_CONFIG=~/.config/gcloud-rootedgoods

# 1. inloggen als Rooted Goods (opent je browser)
gcloud auth login info@rootedgoods.eu

# 2. eigen project. Vraagt hij om een organisatie, kies dan die van rootedgoods.eu,
#    of "geen organisatie" als dat account er nog geen heeft.
gcloud projects create rootedgoods-analytics --name="Rooted Goods - Analytics"
gcloud config set project rootedgoods-analytics

# 3. de Data API aanzetten in dat project
gcloud services enable analyticsdata.googleapis.com

# 4. credentials voor het script, via impersonatie (zie hieronder waarom)
gcloud auth application-default login \
  --impersonate-service-account=ga4-lezer@rootedgoods-analytics.iam.gserviceaccount.com

gcloud auth application-default set-quota-project rootedgoods-analytics
```

## 5. Het service account leesrechten geven in GA4

GA4 > Beheer > Toegangsbeheer voor property (551909322) > plusknop > Gebruikers toevoegen:

```
ga4-lezer@rootedgoods-analytics.iam.gserviceaccount.com
```

Rol **Viewer**. Het vinkje "e-mail sturen" uitzetten, dat adres ontvangt geen mail.

## Waarom impersonatie en niet gewoon de analytics-scope

Dit was eerst `--scopes=...analytics.readonly`. Dat liep op 27 oktober 2026 vast op een
echte blokkade, niet alleen de waarschuwing: Google staat niet meer toe dat gcloud's eigen
client-ID scopes buiten Cloud aanvraagt.

Met impersonatie vraagt jouw login alleen `cloud-platform` aan, wat wel mag, en leent
daarmee een token namens `ga4-lezer@rootedgoods-analytics.iam.gserviceaccount.com`. Voor
service accounts geldt die scope-beperking niet. Er komt **geen sleutelbestand** aan te
pas, dus de organisatiepolicy die sleutels blokkeert speelt hier geen rol en er staat
niets op schijf dat kan uitlekken.

Het account is aangemaakt op 27 oktober, met `info@rootedgoods.eu` als
`roles/iam.serviceAccountTokenCreator` erop. Zonder die rol kan niemand het account lenen.

Stap 2 kan weigeren als het account geen rechten heeft om projecten te maken. Maak
hem dan via de console aan op `console.cloud.google.com/projectcreate`, ingelogd
als `info@rootedgoods.eu`.

## Daarna, elke keer

```bash
bin/ga4.sh
```

Meer of andere dagen:

```bash
bin/ga4.sh --van 2026-10-06 --tot 2026-10-26
```

Het script drukt bovenaan af met welke identiteit en welk quota-project het leest.
Staat daar een pad in `~/.config/gcloud` in plaats van `~/.config/gcloud-rootedgoods`,
dan draai je per ongeluk op Bambook.

## Als het misgaat

| Melding | Wat het is |
|---|---|
| `geen Rooted Goods-credentials op ...` | Stap 4 is niet gedaan, of in de verkeerde `CLOUDSDK_CONFIG` |
| `Request had insufficient authentication scopes` | Stap 4 gedaan zonder de analytics-scope. Opnieuw, met de volledige regel |
| `geen toegang tot property 551909322` | Dit account heeft geen leesrechten. GA4 > Beheer > Toegangsbeheer voor property |
| `SERVICE_DISABLED` of quota-fout | Stap 3 of de `set-quota-project` uit stap 4 ontbreekt |

## Waarom geen service account

De organisatie `bambook.org` dwingt `iam.managed.disableServiceAccountKeyCreation`
af (gezien 27 oktober 2026), dus sleutels aanmaken kan niet. Dat is ook niet nodig:
met Application Default Credentials leest het script met de GA4-rechten die
`info@rootedgoods.eu` toch al heeft, en er staat geen sleutelbestand op schijf dat
kan uitlekken.

---

## Terugvaloptie: eigen OAuth-client

gcloud waarschuwt dat zijn eigen client-ID binnenkort geen scopes buiten Cloud meer mag
aanvragen, en `analytics.readonly` is er daar een van. Zolang het nog werkt hoef je niets
te doen. Zodra het geblokkeerd wordt, maak je een eigen client.

**Let op het project en het account.** Doe dit ingelogd als `info@rootedgoods.eu` en met
`rootedgoods-analytics` in de projectkiezer. Maak je de client in een project van
bambook.org, dan is het consent screen intern voor die organisatie en is
`info@rootedgoods.eu` daar een externe gebruiker, die alsnog geblokkeerd wordt.

1. Console → APIs & Services → Credentials, project `rootedgoods-analytics`
2. Create credentials → OAuth client ID → Application type: **Desktop app**
3. Het vinkje "Use this client for an AI-powered agent" laat je **uit**
4. JSON downloaden, dan:

```bash
export CLOUDSDK_CONFIG=~/.config/gcloud-rootedgoods
gcloud auth application-default login \
  --client-id-file=~/Downloads/client_secret_xxx.json \
  --scopes=https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/analytics.readonly
gcloud auth application-default set-quota-project rootedgoods-analytics
```

Rootedgoods.eu is een eigen Google-organisatie (`123914025859`), dus het consent screen
mag op **Internal**. Dan hoeft er niets geverifieerd te worden.

---

## PageSpeed in hetzelfde project

`pagespeedonline.googleapis.com` staat aan in `rootedgoods-analytics` (27 oktober). Alles
van Rooted zit zo in één project dat in zijn geheel over te dragen is. Bambook houdt zijn
eigen sleutel voor zijn eigen metingen.

Eenmalig een sleutel maken:

1. Console → APIs & Services → Credentials, project `rootedgoods-analytics`
2. Create credentials → **API key**
3. Beperk hem daarna tot de **PageSpeed Insights API** (Edit API key → API restrictions)
4. Opslaan buiten de repo:

```bash
mkdir -p ~/.config/gcloud-rootedgoods
pbpaste > ~/.config/gcloud-rootedgoods/psi-api-key   # sleutel eerst kopiëren
chmod 600 ~/.config/gcloud-rootedgoods/psi-api-key
```

Daarna:

```bash
bin/psi.sh --label "voor lazy"              # mobiel, vier pagina's
bin/psi.sh --desktop --label "voor lazy"
```

Elke meting komt als JSON in `docs/metingen/`, zodat voor en na naast elkaar te leggen
zijn in plaats van uit het hoofd vergeleken. Plak die sleutel niet in een chat en niet in
de repo.
