# Band-hero getest op de testpagina, 5 november 2026

Pagina: https://rootedgoods.eu/Test-page-concepts12, Chrome via de extensie, venster
520 x 953 CSS-px (het venster laat zich niet breder zetten; `resize_window` naar 1280
meldde succes maar `innerWidth` bleef 520). Twee verzoeken naar rootedgoods.eu: één
herlaad, één `fetch` van dezelfde pagina om de ongeïnitialiseerde slidermarkup te
krijgen. Methode: CSS-sectie 53 als `<style>` geïnjecteerd, de hero vervangen via
`outerHTML`, de live (door tiny-slider al omgebouwde) sliderblok vervangen door de verse
kopie uit de fetch, daarna de band-JS uitgevoerd.

Desktop (>= 992px) is NIET gezien.

## Ruwe uitkomsten (JSON uit de console)

Na injectie:

    band: true, items: 45 (9 origineel + 36 klonen = 5 sets), n: "9", vw: "520px"
    bandLeft: 0, bandWidth: 520, bandTop: 663 (absoluut), bandHeight: 306
    heroTop: 158, heroHeight: 505
    scrollW (html): 520, clientW: 520, bodyScrollW: 525
    anim: "rg-band-run 46.8s running", transform: matrix(1,0,0,1,-2140.99,0), translate: 0px
    trackW: 8108, tileW: 168, gap: 12px
    boxHeights: 45 x 236
    margins (eerste vijf items): 26px, 8px, 34px, 0px, 26px
    wrapperPB: 148px (vierkant beeldvlak bij 148px binnenbreedte)
    boxShadow: rgba(45,69,40,.38) 0 12px 28px -20px  (= --rg-sh-soft)
    catHead (Inspiratie-blok): display none
    meerLeft: 20, tns: false, data-product-slider: null

De 5 px extra in `bodyScrollW` komen van bestaande `.row`-elementen (header-row 540,
footer-columns 525, cms-block-container-row 537); geen enkel element in de band steekt
uit. `html` heeft `overflow-x: clip`, de pagina scrolt niet zijwaarts.

Eerste meting van de tegeltekst: naam rgb(45,69,40), prijs rgb(45,69,40). Oorzaak:
sectie 10 zet kleur en gewicht met `!important`. Na de correctie (ook `!important` in
sectie 53): naam rgb(173,99,49) 11.2px 600, prijs rgb(44,42,38) 14.72px.

Slepen (muis, 260 px naar links over de band): `--rg-band-drag: -260px`,
`translate: -260px`, `location.href` ongewijzigd (de klik na de veeg is onderdrukt),
`animationPlayState: paused` (muis boven de band).

Scrollverwijzing: klik op "Waarom deze pakketten anders zijn" -> scrollY van 533 naar
952, doel `#rg-band-verder` op top 96 (= scroll-margin-top).

Toetsenbord: Tab vanaf de Richard-link landt op `.product-image-link` van het eerste
origineel (index 9 in de track, geen kloon), tegel op 136..304 px, in beeld. In een
aparte proef met een origineel buiten beeld schoof de focus-logica de band zo dat de
tegel op left 16 kwam (`--rg-band-drag` van -260 naar 575.11).

Klonen: alle 36 `aria-hidden="true"`, 0 focusbare elementen zonder `tabindex="-1"`,
0 verborgen inputs. Geen `.product-wishlist`, `.variant-thumbnail`, `.product-action`,
`.product-badges` of `hr` meer in de band. 45 img-elementen.

Console: geen fouten van de band (alleen een extensiefout `chrome.action.show`).

## Niet gemeten

- Desktop-layout van de hero (twee tekstkolommen) en de band op >= 992px.
- `prefers-reduced-motion: reduce` (geen manier om de systeeminstelling te schakelen).
- Aanraking op een echte telefoon; de sleeptest was met een muis via pointer events.
- Hoogte van de hero op 390 px breed; op 520 px is hij 505 px hoog.
