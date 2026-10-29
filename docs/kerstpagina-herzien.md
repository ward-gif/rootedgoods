# Punt 13: de kerstpagina, wat er precies moet veranderen

29 oktober 2026. Alles hieronder gemeten, niets gegokt.

## Waarom deze pagina en waarom nu

`/eindejaarsgeschenken` krijgt **300 klikken en € 425,17** over 6 t/m 27 oktober, uit
twee advertentiegroepen: Kerstpakket met logo (227 klikken, € 325,45) en Duurzaam
kerstpakket (73 klikken, € 99,72). Dat is de op één na duurste landingspagina van het
account.

Over zes weken is deze pagina een jaar lang waardeloos. Elk ander punt in het plan kan
in januari ook nog.

## Het probleem, in één tabel

De pagina is **6.794 px hoog op mobiel, acht schermen**. Clarity, oktober, 292
mobiele weergaven:

| Hoe ver gescrold | Bezoekers | Aandeel |
|---|---:|---:|
| 10% | 255 | 87% |
| 20% | 202 | 69% |
| **25%** | **111** | **38%** |
| 30% | 82 | 28% |
| 50% | 50 | 17% |
| 65% | 25 | 9% |

Tussen 20% en 25% vallen 91 van de 292 mensen weg. Dat is de grootste klif op de
pagina, rond y=1400 tot 1700, net voorbij het inspiratieblok.

**En nu de kern.** De drie dingen die een inkoper moet weten staan hier:

| Vraag | Waar het antwoord staat | Wie dat ziet |
|---|---|---|
| Wat kost het? | productprijzen in Inspiratie, y≈1000 | 69% |
| Vanaf hoeveel stuks? | FAQ, y=3694, **54% diep** | 17% |
| Hoe lang duurt het? | FAQ, y=3694, **54% diep** | 17% |

Vijf van de zes bezoekers krijgen nooit antwoord op de twee vragen die bepalen of ze
een aanvraag doen.

**Voorbehoud:** deze scrollcijfers zijn van vóór 28 oktober, toen de cookiemodal nog
40,7% van de taps op deze pagina opslokte. Een deel van die klif kan de modal zijn
geweest. Hermeten na twee weken, maar de structuur klopt hoe dan ook niet: antwoorden
op 54% diepte bereiken nooit de meerderheid.

## Wat er moet gebeuren

### 1. Een feitenblok direct onder de h1, boven y=1000

Drie regels, geen proza. Zoiets:

> **Vanaf € 12,50 per pakket** · **vanaf 25 stuks** · **levertijd 10 werkdagen**
> Proefdruk binnen één werkdag, prijs op maat binnen één werkdag.
> [Vraag een offerte aan]

De getallen moeten van jou komen; ik heb ze niet. Wat telt is dat ze er staan vóór het
inspiratieblok, niet erna.

### 2. De CTA mee naar boven

De enige knop boven de vouw is nu "Bekijk alle producten", en die stuurt mensen de
catalogus in waar ze opnieuw moeten zoeken. Op een seizoenspagina met 300 betaalde
klikken hoort de offerteknop daar te staan.

### 3. De twee FAQ-antwoorden naar boven halen

"Wat is de minimale afname?" en "Wat is de levertijd?" hoeven niet in de FAQ te
blijven, maar het antwoord moet bovenin staan. De FAQ mag het herhalen.

### 4. Inkorten, of de klif verplaatsen

Acht schermen is veel voor een seizoenspagina. Als inkorten niet kan, zorg dan dat
alles wat een beslissing ondersteunt vóór de 25%-grens staat, dus boven y=1700.

## Hoe we weten of het werkte

Hermeten in Clarity over dezelfde pagina, mobiel, na twee weken:

- het aandeel dat 25% haalt moet omhoog van 38%
- het aandeel dat 50% haalt moet omhoog van 17%
- en in GA4: `sectie_<naam>` en de nieuwe trechter laten zien of mensen na deze pagina
  een product openen

