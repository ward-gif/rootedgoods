# GTM API opzetten voor Rooted Goods

Opgesteld 28 oktober 2026.

Doel: de container `GTM-MJ83DVQK` vanaf de opdrachtregel kunnen lezen en
wijzigen, zonder sleutelbestand, net als bij GA4 en Search Console.

## Wat er nu is

- Cloud-project `rootedgoods-analytics` (nummer 1015827327137), eigen organisatie
- Service account `ga4-lezer@rootedgoods-analytics.iam.gserviceaccount.com`,
  benaderd via impersonatie, ADC in `~/.config/gcloud-rootedgoods`
- Dat token heeft alleen de scope `cloud-platform`. De GTM API antwoordt daarop
  met `403 Request had insufficient authentication scopes`.
- `ga4-lezer` mag geen API's beheren: `Permission denied to list services`

## Waarom de Cloud Console niet genoeg is

De Tag Manager API moet aanstaan in het Cloud-project, maar **wie wat in een
container mag, bepaal je in GTM zelf**, onder Beheer, Gebruikersbeheer. Een
service account krijgt daar een eigen regel, met zijn e-mailadres als gebruiker.
Zonder die regel geeft de API een 403, ook met de juiste scopes.

## Keuze: een nieuw service account

Niet `ga4-lezer` hergebruiken. Die heet lezer, wordt gebruikt voor GA4 en Search
Console, en moet dat blijven. Een container kunnen wijzigen is iets anders dan
cijfers lezen, en dat hoort niet in hetzelfde account.

Voorstel: `gtm-beheer@rootedgoods-analytics.iam.gserviceaccount.com`, met een
eigen configuratiemap `~/.config/gcloud-rootedgoods-gtm`, zodat de twee elkaar
niet in de weg zitten.

## Stappen

### 1. In de Cloud Console, project rootedgoods-analytics

- API's en services, Bibliotheek, zoek **Tag Manager API**, Inschakelen
- IAM en beheer, Serviceaccounts, Serviceaccount maken
  naam `gtm-beheer`, geen projectrollen nodig
- Klik het nieuwe account aan, tabblad **Machtigingen**, Toegang verlenen:
  jouw eigen account `info@rootedgoods.eu` de rol
  **Service Account Token Creator**. Dat is wat impersonatie mogelijk maakt,
  zonder sleutelbestand.

### 2. In Tag Manager, container GTM-MJ83DVQK

Beheer, Gebruikersbeheer, Gebruikers toevoegen.
E-mailadres: `gtm-beheer@rootedgoods-analytics.iam.gserviceaccount.com`

Rechten: **Bewerken** op containerniveau is genoeg om voorstellen klaar te
zetten. **Publiceren** alleen geven als je wilt dat een wijziging ook live
gezet kan worden vanaf de opdrachtregel. Mijn advies: eerst alleen Bewerken.
Dan zet ik een werkruimte klaar en druk jij in de interface op publiceren,
nadat je het hebt bekeken.

### 3. Op de laptop, eenmalig

```sh
CLOUDSDK_CONFIG=~/.config/gcloud-rootedgoods-gtm \
gcloud auth application-default login \
  --impersonate-service-account=gtm-beheer@rootedgoods-analytics.iam.gserviceaccount.com \
  --scopes=https://www.googleapis.com/auth/tagmanager.readonly,\
https://www.googleapis.com/auth/tagmanager.edit.containers,\
https://www.googleapis.com/auth/tagmanager.edit.containerversions,\
https://www.googleapis.com/auth/tagmanager.manage.accounts,\
https://www.googleapis.com/auth/cloud-platform
```

Voeg `https://www.googleapis.com/auth/tagmanager.publish` pas toe als stap 2 ook
publiceerrechten kreeg.

### 4. Controleren

```sh
CLOUDSDK_CONFIG=~/.config/gcloud-rootedgoods-gtm \
curl -s -H "Authorization: Bearer $(gcloud auth application-default print-access-token)" \
  https://tagmanager.googleapis.com/tagmanager/v2/accounts
```

Goed als er een account met de container terugkomt. Bij `403 insufficient
authentication scopes` ging stap 3 mis, bij een lege lijst of een andere 403
ging stap 2 mis.

## Let op

Je eigen gcloud-login voor `info@rootedgoods.eu` in
`~/.config/gcloud-rootedgoods` is verlopen. Opnieuw aanmelden met:

```sh
CLOUDSDK_CONFIG=~/.config/gcloud-rootedgoods gcloud auth login
```

De ADC daarnaast werkt nog wel, dus de GA4-scripts draaien gewoon.
