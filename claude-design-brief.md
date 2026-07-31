# Rooted Goods — design brief voor Claude Design

Plak dit blok aan het begin van een claude.ai/design-sessie zodat de
design-agent in de Rooted Goods-huisstijl ontwerpt. Kort houden mag; de
kern is: kleuren, typografie, en de idiomen onderaan.

---

**Merk:** Rooted Goods — premium B2B relatiegeschenken van Europese makers,
gepersonaliseerd met het logo van de klant. Wij regelen drukproef, verpakking
en bezorging. Positionering: premium maar warm en menselijk, ambachtelijk,
eerlijk. Toon: Nederlands, rustig, concreet, met kleine persoonlijke details.
Eerlijke claim: "Geassembleerd in Europa" (NIET "100% gemaakt in Europa").

## Kleuren

Primair — bosgroen (koppen, donkere panelen):
- `#2D4528` diep bosgroen (hoofdkleur)
- `#4A5A44` gedempt groen (body/subtekst)

Actie — terracotta (ALLEEN voor CTA's + hovers, nooit decoratief):
- `#AD6331` terracotta (primaire knoppen)
- `#955529` terracotta donker (hover-state)

Accent — cognac/oker (eyebrows, iconen, accenten; NOOIT voor knoppen):
- `#CA853F` licht cognac
- `#E9C9A9` warme perzik (labels op donkere tegels)

Achtergronden & lijnen:
- `#F7F5F2` warm crème (hoofdcanvas)
- `#FFFFFF` wit (kaarten, tegels)
- `#EAE3D7` zand (randen, scheidingslijnen)
- `#5D6D55` zacht groen (handgeschreven notities)

## Typografie

- Koppen: **Playfair Display** (serif), kleur `#2D4528`. Weight 600 voor
  normale koppen, 800 voor grote display-titels (hero, eind-CTA).
- Body: **Montserrat** (sans), kleur `#4A5A44` of donker.
- Eyebrow/kicker: Montserrat, weight 700, UPPERCASE, letter-spacing ~0.22em,
  kleur `#CA853F`. Staat altijd boven een kop.
- Accent-woord in een kop: italic serif in `#CA853F` (bv. "Wij regelen
  *alles*." — het laatste stukje cursief + oker).
- Handgeschreven notitie: **Caveat**, kleur `#5D6D55`, licht geroteerd.

## Component-idiomen (zo voelt de site)

- **Knoppen = pillen**: border-radius 50px, padding ~0.9rem 2rem, weight 700.
  Primair = terracotta vlak met witte tekst + automatische pijl "→", hover
  wordt donkerder en tilt 2px op. Secundair = transparant met dunne groene
  rand (`rgba(45,69,40,.28)`), groene tekst, terracotta op hover.
- **Sectie-opbouw**: eyebrow → Playfair-kop → korte subline → CTA. Veel
  witruimte, rustig ritme.
- **Beeld-tegels**: afgeronde hoeken (12–18px), `object-fit: cover`, donkere
  bottom-up gradient voor leesbaarheid, tekstlabel links-onderin over het
  beeld, subtiele lift + lichte zoom op hover. GEEN filmkorrel/grain.
- **Donkergroene panelen** (`#2D4528`, radius 20–24px) als statement/CTA-
  blokken, met witte tekst en oker/perzik accenten.
- **Trust-strip**: rij korte USP's met een cognac vinkje voor de eerste,
  gescheiden door een middot "·" (bv. "Geassembleerd in Europa · digitale
  drukproef · bezorging geregeld").
- **Persoonlijk contactblok**: ronde foto + "Hi, ik ben Richard" (oker,
  klein) + "Ik help je van idee tot bezorging →".
- **Menselijke details**: handgeschreven kanttekeningen (Caveat) mogen, mits
  ze verankerd zijn aan een element (niet los zweven).

## Do / Don't

- DO: terracotta uitsluitend voor CTA's; oker voor accenten; groen voor tekst.
- DO: genereuze witruimte, grote serif-koppen, warme foto's.
- DON'T: grain/filmkorrel over foto's. DON'T: terracotta als decoratie.
  DON'T: handmatig een pijl in knoptekst zetten (die komt automatisch).
