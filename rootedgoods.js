/* =====================================================================
 * rootedgoods.js — custom frontend JS voor Rooted Goods (rootedgoods.eu)
 * Geladen via Promidata theme naast hun eigen scripts.
 * Last updated: 2026-07-02
 *
 * STRUCTUUR (bijgewerkt -- was verouderd, noemde maar 3 grove items):
 *   SECTIE 1 — GLOBAL     : 1.1 search overlay, 1.2 header-scroll-gedrag
 *                           (mobiel hide/show, desktop sticky topbar/nav), 1.3 flyout CTA,
 *                           1.4 offerteknop (header-actions), 1.4b nav-main
 *                           zonder title-tooltip, 1.4c offcanvas-menu (mobiel:
 *                           tegel-rij/headline-relabel/snelkoppelingen),
 *                           1.4d mobiel-header logo centreren, 1.4e topbar
 *                           USP-slider (mobiel), 1.5 Cal.com-embed lazy-load,
 *                           1.6 over-ons "Route" (SVG/GSAP), 1.6b over-ons
 *                           hero-fit
 *   SECTIE 2 — HOMEPAGE   : 2.0 productslider-optiepatch, 2.0b slider-CTA verplaatsen
 *                           (mobiel), 2.1 logo-slider + oude .rgh hero-fit, 2.2
 *                           productslider tegel-click, 2.4 hero-v2 hoogte-fit
 *   SECTIE 3 — PDP        : 3.1 productnaam verplaatsen, 3.2 accordion-default,
 *                           3.2b configurator-stappen open houden, 3.3 staffel-
 *                           prijstabel, 3.4 gallery-zoom-knop
 *
 * `rgOnthulNaFonts()` (voor sectie 2.4) is een gedeelde helper, ook gebruikt door
 * 1.6b -- zie de comment daar voor waarom de rest van die twee niet is samengevoegd.
 *
 * UITGANGSPUNTEN:
 * - Zo min mogelijk JS op PDP/PLP. Alleen functies die NIET zonder JS kunnen.
 * - Geen van de PDP-functies muteert containers die Promidata via XHR
 *   re-rendert: #total-price-bottom-container, #detailed-price-table-container,
 *   #po-informations-container. Anders worden onze wijzigingen weggegooid bij
 *   prijswijzigingen (kleur kiezen, aantal aanpassen, opdruk toevoegen).
 * - Selectors zijn defensief: niets crasht als element niet bestaat.
 * - Page-detection via body class (is-ctl-product) voor expliciete scoping.
 * ===================================================================== */


/* =====================================================================
 * SECTIE 1 — GLOBAL (alle pagina's)
 * ===================================================================== */

/* ---- 1.1 Search overlay
 * Donkere overlay achter zoekbalk wanneer 'ie focus heeft.
 * DOMContentLoaded: werkt zonder afbeeldingen geladen, draait eerder.
 *
 * Dimt alleen ONDER de header (CSS: overlay start op de headerhoogte vanaf
 * 992px, sectie 6) -- de header zelf (logo, zoekbalk, iconen, categorieën-
 * nav) overlapt de overlay dus nooit meer en blijft altijd licht en
 * klikbaar. Geen DOM-verplaatsing van .header-search meer nodig (die trucs
 * losten precies dít stacking-context-probleem op, dat nu niet meer
 * bestaat omdat er simpelweg geen geometrische overlap meer is). */
document.addEventListener('DOMContentLoaded', function () {
  var searchInput = document.querySelector('.header-search-input');
  var overlay = document.getElementById('searchOverlay');
  if (!searchInput || !overlay) return;

  var sluitTimeoutId = null;

  searchInput.addEventListener('focus', function () {
    if (sluitTimeoutId) { clearTimeout(sluitTimeoutId); sluitTimeoutId = null; }
    overlay.classList.add('active');
  });

  // 150ms timeout: klik op zoekknop heeft tijd om te firen voordat overlay weg is.
  searchInput.addEventListener('blur', function () {
    sluitTimeoutId = setTimeout(function () {
      sluitTimeoutId = null;
      overlay.classList.remove('active');
    }, 150);
  });

  overlay.addEventListener('click', function () {
    overlay.classList.remove('active');
    searchInput.blur();
  });
});


/* ---- 1.2 Header-scroll-gedrag
 * Mobiel/tablet (<992px): .header-main/.nav-main blijven fixed (CSS sectie
 * 3/4, ongewijzigd) -- verbergen bij scroll-naar-beneden, tonen bij
 * scroll-naar-boven, zoals hiervoor.
 * Desktop (>=992px): topbar + header-row zitten in de Shopware-markup
 * allebei in .header-main, dat vanaf hier CSS position:sticky heeft
 * (containing block <body>, lang genoeg om echt te kunnen plakken -- zie
 * de uitgebreide comment in de CSS bij waarom sticky op .header-row zelf
 * NIET werkte). Topbar + .nav-main (los element, geen kind van header-main)
 * schuiven nu SAMEN weg zodra er voorbij een kleine drempel naar BENEDEN
 * gescrold wordt, en komen samen weer terug zodra er ook maar een beetje
 * omhoog gescrold wordt -- header-row zelf blijft te allen tijde zichtbaar
 * (sticky).
 * BELANGRIJK: top (op beide elementen) is een STATISCHE, live gemeten
 * waarde die verder niet meer verandert/animeert. Een eerdere versie liet
 * top zelf heen-en-weer togglen met een CSS-transitie erop -- dat gaf live
 * een kort zichtbaar spleetje bij scroll-omhoog dat pas na een paar
 * seconden weer verdween (layout-thrashing: top is een layout-eigenschap,
 * animeren daarvan op position:sticky dwingt de browser elk frame een
 * herberekening te doen, en dat liep zichtbaar uit de pas). Nu animeert
 * alléén nog transform: translateY (compositor-only, geen layout-
 * herberekening, dus geen desync meer mogelijk) -- header-main en
 * nav-main krijgen daarbij exact dezelfde translateY-waarde wanneer de
 * topbar zichtbaar is, zodat ze gegarandeerd synchroon bewegen.
 * .nav-main verbergt zichzelf (los van de topbar-schuif) via diezelfde
 * transform i.p.v. height/overflow-collapse -- overflow:hidden zou de
 * categorie-dropdown-flyout (die eronder uitklapt) afknippen.
 * passive: true voorkomt dat scroll-performance gehinderd wordt. */
(function () {
  var header = document.querySelector('.header-main');
  var nav = document.querySelector('.nav-main');
  var row = document.querySelector('.header-main .header-row');
  var topBar = document.querySelector('.header-main .top-bar');
  if (!header || !nav || !row) return;

  var lastScroll = 0;
  var threshold = 150;
  var topBarHeight = 0;
  // header-row's live gemeten hoogte gaf ~61px (subpixel-afronding), maar
  // dat 1px verschil met de daadwerkelijk gerenderde 60px was precies het
  // resterende spleetje -- vast op 60px i.p.v. meten lost dat op. Geen
  // aparte meting/variabele meer nodig hiervoor.

  function meetHoogtes() {
    topBarHeight = topBar ? topBar.getBoundingClientRect().height : 0;
    if (window.innerWidth >= 992) {
      // Statisch: header-main plakt altijd met de topbar net buiten beeld;
      // nav-main plakt altijd direct onder header-row (zonder topbar).
      // Wordt hierna nooit meer aangepast -- alleen transform (in
      // desktopGedrag) beweegt nog.
      header.style.top = (-topBarHeight) + 'px';
      nav.style.top = '60px';
    } else {
      // Terug naar mobiel: ook eventuele desktop-transform opruimen, anders
      // wint een leftover inline transform van de mobiele .header-hidden-
      // CSS-regel (inline gaat altijd voor).
      header.style.top = '';
      header.style.transform = '';
      nav.style.top = '';
      nav.style.transform = '';
    }
  }

  function mobielGedrag(current) {
    if (current < threshold) {
      header.classList.remove('header-hidden');
      nav.classList.remove('header-hidden');
      return;
    }
    if (current > lastScroll) {
      header.classList.add('header-hidden');
      nav.classList.add('header-hidden');
    } else {
      header.classList.remove('header-hidden');
      nav.classList.remove('header-hidden');
    }
  }

  function desktopGedrag(current) {
    // Vers meten i.p.v. de gecachte waarden vertrouwen: kan stiekem stale
    // raken (bv. na een webfont-swap). Nu goedkoop -- zet alleen de
    // statische top, geen transitie meer die daardoor kan haperen.
    meetHoogtes();
    // Bewust NA meetHoogtes() pas afbreken op mobiel: die functie moet
    // sowieso draaien om top/transform daar leeg te houden (bv. bij de
    // initiële aanroep hieronder, die niet zelf op breedte checkt). Zonder
    // deze guard zou de transform-logica verderop ook op mobiel draaien en
    // een ongewenste translateY op de fixed mobiele header zetten.
    if (window.innerWidth < 992) return;

    var voorbijDrempel = current > topBarHeight;
    var scrolltNaarBeneden = current > lastScroll;
    var verbergen = voorbijDrempel && scrolltNaarBeneden;

    if (verbergen) {
      // Topbar blijft via de statische top al buiten beeld -- header-main
      // hoeft dus niet verschoven te worden. nav-main schuift zichzelf
      // weg.
      header.style.transform = '';
      nav.style.transform = 'translateY(-100%)';
    } else if (voorbijDrempel) {
      // Alleen hier is de sticky-clamp (top:-topBarHeight) daadwerkelijk
      // actief -- topbar zichtbaar maken door header-main (en nav-main mee,
      // zelfde waarde) een topBarHeight naar beneden te schuiven.
      header.style.transform = 'translateY(' + topBarHeight + 'px)';
      nav.style.transform = 'translateY(' + topBarHeight + 'px)';
    } else {
      // Nog boven de drempel (bv. net geladen, scrollY 0): header/nav staan
      // al in hun natuurlijke, ongestickte positie -- geen transform nodig.
      // Zonder deze tak kreeg de pagina bij load een zichtbaar gat boven de
      // topbar (translateY(topBarHeight) werd dan ten onrechte al gezet).
      header.style.transform = '';
      nav.style.transform = '';
    }
    nav.classList.toggle('nav-hidden', verbergen);
  }

  desktopGedrag(window.scrollY);   // beginstand correct zetten (bv. na een refresh mid-page); meet zelf vers

  window.addEventListener('scroll', function () {
    var current = window.scrollY;
    if (window.innerWidth < 992) mobielGedrag(current);
    else desktopGedrag(current);
    lastScroll = current;
  }, { passive: true });

  window.addEventListener('resize', function () {
    // Bij resize van mobiel naar desktop (of terug) moet de inline top/
    // transform meteen kloppen met het nieuwe breakpoint i.p.v. te wachten
    // op de eerstvolgende scroll. desktopGedrag() meet zelf vers (incl.
    // top) en zet ook meteen de juiste transform; de mobiele tak van
    // meetHoogtes() ruimt bij een resize-naar-mobiel zelf top+transform op.
    if (window.innerWidth >= 992) {
      desktopGedrag(window.scrollY);
    } else {
      meetHoogtes();
    }
  });
})();


/* ---- 1.3 Category flyout — "Bekijk alle producten" CTA toevoegen
 * Berekent dynamisch hoeveel lege spacers nodig zijn om de button in
 * de meest rechter kolom van de grid te plaatsen. */
document.addEventListener('DOMContentLoaded', function () {
  var flyoutContent = document.querySelector('.navigation-flyout-content');
  if (!flyoutContent) return;

  var itemsPerRow = 4;
  var existingCount = flyoutContent.children.length;
  var spacersNeeded = (itemsPerRow - 1 - (existingCount % itemsPerRow) + itemsPerRow) % itemsPerRow;

  for (var i = 0; i < spacersNeeded; i++) {
    var spacer = document.createElement('div');
    spacer.className = 'col-md-3 flyout-spacer';
    flyoutContent.appendChild(spacer);
  }

  var col = document.createElement('div');
  col.className = 'col-md-3 navigation-flyout-category flyout-cta-col';
  col.innerHTML = '<a href="/search?search=" class="btn btn-primary">Bekijk alle producten</a>';
  flyoutContent.appendChild(col);
});


/* ---- 1.4 Offerteknop in de header-actions-rij
 * Stond eerst als tekstlink in de menubalk (.nav-main); nu een compacte
 * .btn.btn-primary vóór het iconen-cluster (wishlist/account/cart) in
 * .header-actions-col, alleen op desktop (>= 992px). Mobiel heeft 'm als
 * primaire CTA in het offcanvas-menu (sectie 1.4c). */
document.addEventListener('DOMContentLoaded', function () {
  var row = document.querySelector('.header-actions-col .row');
  if (!row || window.innerWidth < 992) return;

  var link = document.createElement('a');
  link.href = '/offerte';   // relatief -> werkt op dev én live
  link.className = 'btn btn-primary offerte-link';
  link.title = 'Offerte aanvragen';
  link.textContent = 'Offerte aanvragen';

  var col = document.createElement('div');
  col.className = 'col-auto';
  col.appendChild(link);

  // Vóór het iconen-cluster (eerste col-auto is de wishlist-knop).
  var wishlistCol = row.querySelector('.header-wishlist');
  wishlistCol = wishlistCol ? wishlistCol.closest('.col-auto') : null;
  if (wishlistCol) row.insertBefore(col, wishlistCol);
  else row.appendChild(col);
});


/* ---- 1.4b Nav-main zonder title-tooltip
 * Shopware zet op elk hoofdmenu-item (incl. "Onze categorieën") een
 * title-attribuut -> native browser-tooltip. Overbodig want de tekst staat
 * al zichtbaar in de link zelf; hier gestript. Scope bewust alleen
 * .nav-main-links, niet de account/wishlist/cart-iconknoppen (die HEBBEN
 * geen zichtbare tekst, dus daar is de title wél de enige uitleg) en niet
 * de categorie-flyout-tegels (ander element, niet gevraagd). */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.nav-main .main-navigation-link[title]').forEach(function (el) {
    el.removeAttribute('title');
  });
});


/* ---- 1.4c Offcanvas-menu (mobiel): uitgelichte tegel-rij (Thema's +
 * Trending) + snelkoppelingen. Vervangt de teruggedraaide §2.1b/c/d (zie
 * CSS-sectie 6b voor de aanleiding). De categorieën-inklap-toggle die
 * hier eerder stond is op verzoek weer verwijderd -- categorieën staan nu
 * gewoon altijd open. Defensief herhaald bij elke offcanvas-open (niet
 * alleen 1x bij page-load) omdat Shopware terug-navigatie in een submenu
 * via een nieuwe content-render doet; de dataset-vlaggen maken elke stap
 * idempotent. .d-none-voorouder (Shopware's eigen cache-node voor de
 * root-lijst) wordt bewust overgeslagen. */
document.addEventListener('DOMContentLoaded', function () {
  var QUICKLINKS = [
    { href: '/faq', label: 'Veelgestelde vragen', cta: false },
    { href: '/contact', label: 'Contact', cta: false },
    { href: '/offerte', label: 'Offerte aanvragen', cta: true }
  ];

  function vulSnelkoppelingen(nav) {
    if (nav.dataset.rgQuicklinks) return;
    nav.dataset.rgQuicklinks = '1';
    QUICKLINKS.forEach(function (l) {
      var a = document.createElement('a');
      a.href = l.href;
      a.className = l.cta ? 'rg-offcanvas-cta' : 'rg-offcanvas-quicklink';
      a.textContent = l.label;
      nav.appendChild(a);
    });
  }

  /* Twee uitgelichte tegels naast elkaar bovenaan: de bestaande native
     Thema's-link (hergebruikt, niet gekloond -- click-gedrag blijft
     intact) + een tweede, door ons zelf samengestelde "Trending"-tegel.
     Geen backend-mechanisme voor dit laatste (de offcanvas-lijst heeft
     geen afbeeldingsveld in dit thema) -- vaste link + afbeelding, zelfde
     aanpak als de Thema's-tegel al had. */
  function bouwUitgelichteTegels(list) {
    /* GEEN dataset-vlag op `list` als idempotentie-check: Shopware
       vervangt bij terug-navigeren in een submenu de INHOUD van dit
       element (nieuwe categorie-lijst), maar het element zelf (met z'n
       dataset) blijft bestaan -- de vlag overleefde dus de content-swap
       terwijl de tegels zelf verdwenen waren. Structurele check i.p.v.
       vlag: als de tegel-rij niet meer in de lijst zit, opnieuw bouwen. */
    if (list.querySelector('.rg-offcanvas-featured-row')) return;
    var themaLi = list.querySelector('.navigation-offcanvas-list-item:has(a[href$="/alle-thema-s"])');
    var themaLink = themaLi ? themaLi.querySelector('a[href$="/alle-thema-s"]') : null;
    if (!themaLink) return;

    var naam = themaLink.querySelector('[itemprop="name"]');
    if (naam) {
      naam.textContent = 'Shop op thema';
      // Onzichtbare spacer, zelfde opbouw als de Trending-tegel se eyebrow
      // (span + tekst), zodat de titel-regel op exact dezelfde hoogte
      // landt als bij Trending (die wél een eyebrow erboven heeft).
      var spacer = document.createElement('span');
      spacer.className = 'rg-offcanvas-tile-eyebrow rg-offcanvas-tile-eyebrow--ghost';
      spacer.setAttribute('aria-hidden', 'true');
      spacer.textContent = ' ';
      naam.before(spacer);
    }
    themaLink.classList.add('rg-offcanvas-tile', 'rg-offcanvas-tile--thema');
    // themaLink is een ECHTE native nav-link (Shopware's eigen categorie-
    // link) en erft daardoor ergens een eigen padding-bottom die zelfs
    // onze !important-CSS-regel verslaat (specificiteitsgevecht dat niet
    // via CSS alleen te winnen was) -- inline stijl wint altijd, zelfde
    // patroon als de logo-centrering (sectie 1.4d).
    themaLink.style.setProperty('padding-bottom', '0.85rem', 'important');

    var trending = document.createElement('a');
    trending.href = '/eindejaarsgeschenken';
    trending.className = 'rg-offcanvas-tile rg-offcanvas-tile--trending';
    trending.innerHTML =
      '<span class="rg-offcanvas-tile-eyebrow">Trending</span>' +
      '<span class="rg-offcanvas-tile-title">Kerst &amp; eindejaar</span>';

    var rij = document.createElement('li');
    rij.className = 'navigation-offcanvas-list-item rg-offcanvas-featured-row';
    var grid = document.createElement('div');
    grid.className = 'rg-offcanvas-featured-grid';
    grid.appendChild(themaLink);   // verhuist de bestaande link, geen kloon
    grid.appendChild(trending);
    rij.appendChild(grid);

    list.prepend(rij);
    themaLi.remove();   // lege <li> die overblijft nadat de link verhuisde
  }

  /* Native "categorieën"-headline hergebruikt als label boven de tegel-
     rij (staat er toevallig al precies goed voor, zie CSS-sectie 6c) --
     alleen de tekst hoeft aangepast, geen nieuw element nodig. */
  function herlabelHeadline(panel) {
    var headline = panel.querySelector('.navigation-offcanvas-headline');
    if (headline && !headline.dataset.rgRelabeled) {
      headline.dataset.rgRelabeled = '1';
      headline.textContent = 'Nu populair';
    }
  }

  /* Categorieën met sub-categorieën (herkenbaar aan .js-navigation-
     offcanvas-link + data-href) openden een drill-down-submenu i.p.v. te
     navigeren -- op verzoek Ward voortaan gewoon direct naar de
     hoofdcategorie. Shopware's eigen plugin bindt de klik-onderschepping
     op deze klasse (mogelijk via delegatie op een voorouder, mogelijk
     direct op het element -- niet gegarandeerd welke, dus geen listener
     proberen te verwijderen). We VERVANGEN het element door een kloon:
     cloneNode kopieert geen JS-listeners mee, en zonder de klasse/
     data-href kan ook een delegated handler 'm niet meer matchen. De
     native href (hoofdcategorie-URL) blijft gewoon intact. Structurele
     check (geen dataset-vlag): zelfde reden als bouwUitgelichteTegels --
     Shopware's eigen content-render bij terug-navigeren zet de klasse
     gewoon weer terug, dus elke keer opnieuw controleren i.p.v. 1x. */
  function directeCategorielinks(list) {
    list.querySelectorAll('.navigation-offcanvas-link.js-navigation-offcanvas-link[data-href]').forEach(function (link) {
      var kloon = link.cloneNode(true);
      kloon.classList.remove('js-navigation-offcanvas-link');
      kloon.removeAttribute('data-href');
      link.parentNode.replaceChild(kloon, link);
    });
  }

  function offcanvasKlaar() {
    document.querySelectorAll('.offcanvas.navigation-offcanvas').forEach(function (panel) {
      if (panel.closest('.d-none')) return;
      var nav = panel.querySelector('.navigation-offcanvas-actions');
      var list = panel.querySelector('.navigation-offcanvas-list');
      herlabelHeadline(panel);
      if (nav) vulSnelkoppelingen(nav);
      if (list) { bouwUitgelichteTegels(list); directeCategorielinks(list); }
    });
  }
  offcanvasKlaar();   // dekt het geval dat de offcanvas al (verborgen) in de DOM staat
  document.querySelectorAll('[data-offcanvas-menu="true"]').forEach(function (btn) {
    btn.addEventListener('click', function () { setTimeout(offcanvasKlaar, 0); });
  });
});


/* ---- 1.4d Header <992px: logo centreren
 * Hamburger en zoek-toggle/mandje zitten in dezelfde Bootstrap-kolom
 * (.header-actions-col) -- puur CSS kan ze dus niet los van elkaar aan
 * weerszijden van het logo zetten. Kleinst mogelijke ingreep: alleen de
 * hamburger-kolom (bestaand element, click-handler blijft intact) verhuist
 * vóór het logo, één keer. Geen nieuwe wrapper-divs, geen ander element
 * aangeraakt -- bewust een aparte, kleinere functie dan de vorige,
 * teruggedraaide rij-herbouw (die 4 elementen in nieuwe wrappers zette).
 *
 * Was oorspronkelijk <576px-only; op 576-991px (tablet) bleek de hamburger
 * een HELEMAAL ANDER element te zijn dan op mobiel -- niet in
 * .header-actions-col, maar GENEST in .header-search-col (naast de
 * zoekbalk, in een eigen mini-rijtje, breakpoint-gewisseld via Bootstrap's
 * d-none/d-sm-block/d-lg-none). Zonder dit bleef .header-logo-col op
 * tablet z'n eigen volle-breedte-rij (col-12 tot col-lg-auto) claimen en
 * het logo stond dus los boven de rest i.p.v. ertussenin gecentreerd.
 * Beide mogelijke hamburger-kolommen worden hier verplaatst (de niet-
 * actieve is toch display:none, onschadelijk) i.p.v. per breedte te
 * detecteren welke er nu net zichtbaar is.
 *
 * De flex-layout-eigenschappen (flex-wrap/order/width) worden hier via JS
 * inline gezet i.p.v. puur in CSS: het thema blijkt zelf al een !important
 * flex-wrap:wrap op .row te zetten die zelfs een hoge-specificiteit eigen
 * !important-regel versloeg (bevestigd via live debuggen) -- een inline
 * style wint altijd, dat is de enige betrouwbare manier hier. */
document.addEventListener('DOMContentLoaded', function () {
  if (window.innerWidth >= 992) return;
  var headerRow = document.querySelector('.header-row');
  if (!headerRow || headerRow.dataset.rgHamburgerMoved) return;
  var logoCol = headerRow.querySelector('.header-logo-col');
  var actionsCol = headerRow.querySelector('.header-actions-col');
  var searchCol = headerRow.querySelector('.header-search-col');
  // Mobiel (<576px): hamburger zit in .header-actions-col.
  var mobielHamburgerCol = headerRow.querySelector('.header-actions-col .col.d-sm-none:has(.menu-button)');
  // Tablet (576-991px): hamburger zit GENEST in .header-search-col, naast
  // (niet in) de zoekbalk-collapse.
  var tabletHamburgerCol = headerRow.querySelector('.header-search-col .col-sm-auto.d-none.d-sm-block.d-lg-none');
  if (!logoCol || !actionsCol || !searchCol || (!mobielHamburgerCol && !tabletHamburgerCol)) return;
  headerRow.dataset.rgHamburgerMoved = '1';

  function zet(el, eigenschap, waarde) {
    el.style.setProperty(eigenschap, waarde, 'important');
  }
  // Belangrijk: EERST de tablet-hamburger-kolom uit .header-search-col
  // halen, VOORDAT searchCol hieronder op width:0 wordt gezet -- anders
  // verdwijnt de tablet-hamburger mee de collapse in.
  [mobielHamburgerCol, tabletHamburgerCol].forEach(function (col) {
    if (!col) return;
    col.classList.add('rg-header-hamburger-slot');
    zet(col, 'order', '1');
    zet(col, 'flex', '0 0 auto');
    zet(col, 'width', 'auto');
    headerRow.insertBefore(col, logoCol);
  });

  /* .header-row's eigen padding (2rem/32px links+rechts, bedoeld voor
     desktop) laat op een smal scherm te weinig ruimte over voor het logo
     (natuurlijke breedte ~157px bij de vaste 26px-hoogte) -- hier verkleind
     zodat het logo niet meer over de zoek-/mandje-iconen heen overlapt. */
  zet(headerRow, 'padding-left', '0.75rem');
  zet(headerRow, 'padding-right', '0.75rem');
  zet(headerRow, 'flex-wrap', 'nowrap');
  zet(logoCol, 'order', '2');
  zet(logoCol, 'flex', '1 1 0');
  zet(logoCol, 'min-width', '0');
  zet(logoCol, 'width', 'auto');
  zet(actionsCol, 'order', '3');
  zet(actionsCol, 'flex', '0 0 auto');
  zet(actionsCol, 'width', 'auto');
  zet(searchCol, 'order', '4');
  zet(searchCol, 'flex', '0 0 0');
  zet(searchCol, 'width', '0');
  zet(searchCol, 'padding', '0');
  zet(searchCol, 'overflow', 'hidden');

  /* Zodra de zoekbalk opengeklapt wordt: alle geforceerde inline-waarden
     weer loslaten, zodat het bestaande (ongewijzigde) zoek-collapse-gedrag
     gewoon zijn eigen volle-breedte-rij kan pakken. */
  var zoekCollapseEl = searchCol.querySelector('.collapse');
  if (zoekCollapseEl) {
    zoekCollapseEl.addEventListener('show.bs.collapse', function () {
      headerRow.style.removeProperty('flex-wrap');
      searchCol.style.removeProperty('order');
      searchCol.style.removeProperty('flex');
      searchCol.style.removeProperty('width');
      searchCol.style.removeProperty('padding');
      searchCol.style.removeProperty('overflow');
    });
    zoekCollapseEl.addEventListener('hidden.bs.collapse', function () {
      zet(headerRow, 'flex-wrap', 'nowrap');
      zet(searchCol, 'order', '4');
      zet(searchCol, 'flex', '0 0 0');
      zet(searchCol, 'width', '0');
      zet(searchCol, 'padding', '0');
      zet(searchCol, 'overflow', 'hidden');
    });
  }
});


/* ---- 1.4e Topbar USP-slider (mobiel/tablet <992px)
 * Verticale slide-up-cycler i.p.v. de eerder teruggedraaide horizontale
 * marquee (zie CSS-sectie 5 voor de aanleiding). Simpeler en robuuster:
 * vaste regelhoogte, geen breedte-/naad-berekening -- alleen een
 * transform:translateY die twee elementen tegelijk verplaatst. Bouwt de
 * viewport 1x uit de bestaande 4 USP-containers (leest de content, geen
 * herhaalde DOM-queries per cyclus) en zet daarna gewoon een interval. */
document.addEventListener('DOMContentLoaded', function () {
  var ext = document.querySelector('.top-bar-nav .top-bar-nav-extension');
  if (!ext || document.querySelector('.rg-usp-slider')) return;

  var usps = [];
  ext.querySelectorAll('.top-bar-container').forEach(function (c) {
    if (c.classList.contains('container--5')) return;
    var html = c.innerHTML.trim();
    if (html) usps.push(html);
  });
  if (usps.length < 2) return;

  var viewport = document.createElement('div');
  viewport.className = 'rg-usp-slider';
  viewport.setAttribute('aria-live', 'off');   // decoratief, geen a11y-aankondigingen per wissel

  var huidig = document.createElement('div');
  huidig.className = 'rg-usp-slider-item';
  huidig.innerHTML = usps[0];
  viewport.appendChild(huidig);
  ext.parentNode.insertBefore(viewport, ext.nextSibling);

  var index = 0;
  setInterval(function () {
    index = (index + 1) % usps.length;

    var nieuw = document.createElement('div');
    nieuw.className = 'rg-usp-slider-item rg-usp-slider-item--incoming';
    nieuw.innerHTML = usps[index];
    viewport.appendChild(nieuw);

    // Force reflow zodat de --incoming startpositie echt gerenderd is
    // vóórdat de animate-klasse (met transition) erbij komt -- anders
    // ziet de browser het als 1 stap en is er niks te animeren.
    void nieuw.offsetHeight;

    huidig.classList.add('rg-usp-slider-item--animate', 'rg-usp-slider-item--outgoing');
    nieuw.classList.add('rg-usp-slider-item--animate');
    nieuw.classList.remove('rg-usp-slider-item--incoming');

    var oud = huidig;
    huidig = nieuw;
    setTimeout(function () { oud.remove(); }, 550);
  }, 3500);
});


/* ---- 1.5 Cal.com kennismakingsgesprek — standaard element-click pop-up
 * Cal's standaard embed: elementen met data-cal-link openen de pop-up en cal
 * onderdrukt de navigatie zelf (het eerdere dubbele venster kwam puur door
 * target="_blank", die is weg). Enige toevoeging: embed.js LUI laden
 * (hover/focus/idle) i.p.v. op elke paint, en alleen op pagina's met zo'n knop
 * -> geen CWV-impact. De href blijft als fallback (opent de cal.com-pagina als
 * embed.js nog niet geladen is bij de klik). */
(function () {
  if (!document.querySelector('[data-cal-link]')) return;
  var started = false;
  function start() {
    if (started) return; started = true;
    (function (C, A, L) { var p = function (a, ar) { a.q.push(ar); }; var d = C.document; C.Cal = C.Cal || function () { var cal = C.Cal; var ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { var api = function () { p(api, arguments); }; var namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
    Cal("init", "kennismakingsgesprek", { origin: "https://app.cal.com" });
    Cal.config = Cal.config || {};
    Cal.config.forwardQueryParams = true;
    Cal.ns.kennismakingsgesprek("ui", { theme: "light", cssVarsPerTheme: { light: { "cal-brand": "#ad6331" } }, hideEventTypeDetails: false, layout: "month_view" });
  }
  document.querySelectorAll('[data-cal-link]').forEach(function (el) {
    el.addEventListener('pointerenter', start, { once: true });
    el.addEventListener('focus', start, { once: true });
    // Triggers hebben geen href (geen navigatie) -> Enter/Space toegankelijk maken.
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
    });
  });
  if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 4000 });
  else window.addEventListener('load', function () { setTimeout(start, 1500); });
})();

/* ---- 1.5b Offerteformulier — verzendknop-label overschrijven
 * Het knop-label ("Versturen") komt uit het sitewide formulier-onderdeel
 * (Shopware form-builder) en wordt gedeeld met o.a. het contactformulier
 * -- aanpassen in de form-instellingen zou dus overal veranderen. EERST
 * gescoped op .block-cioform-container, maar dat bleek een generieke
 * wrapper-class voor ELK custom-formulier (ook het contactformulier kreeg
 * zo per ongeluk hetzelfde label) -- nu op het pad zelf, dat is wél uniek
 * voor deze pagina. Echte tekst-node (geen CSS-content-trucje) -> blijft
 * correct voor screenreaders. */
(function () {
  if (window.location.pathname.replace(/\/+$/, '') !== '/offerte') return;
  var btn = document.querySelector('.block-cioform-container form > button[type="submit"]');
  if (!btn) return;
  btn.textContent = 'Vraag offerte aan';
})();


/* =====================================================================
 * SECTIE 2 — HOMEPAGE
 * Selectors zijn unieke homepage-classes (.home-productslider, .logo-slider).
 * Op andere pagina's faalt querySelector veilig.
 * ===================================================================== */

/* ---- 2.0 Productslider — opties herschrijven vóór plugin-init
 * Promidata's TinySlider draait standaard met loop:true → er worden
 * kloon-tegels toegevoegd, waardoor er links van de eerste kaart altijd
 * een halve tegel "gluurt". Bambook lost dit op door simpelweg NIET te
 * loopen (geen clones, prev-knop disabled bij start, schone linkerrand,
 * echte bleed naar de schermrand).
 *
 * Ook hier gepatcht:
 * - mouseDrag:true — de block-instelling had 'm op false staan (admin-
 *   config), dus slepen deed nooit iets, los van onze CSS.
 *
 * Aantal tegels: de block-opties hebben GEEN items/responsive (geverifieerd
 * via console-dump: alleen productboxMinWidth:"300px" + gutter:30). De plugin
 * rekent items = floor(sliderbreedte / (productboxMinWidth + gutter)). Een
 * kale items:4 of responsive-config wordt dus genegeerd. De echte hendel is
 * productboxMinWidth, die we hieronder verlagen naar 250px zodat er ook op
 * laptop 4 passen (zie de uitleg bij de patch).
 *
 * Wij herschrijven de slider-opties VOORDAT de plugin ze leest. Een
 * MutationObserver vangt het element zodra het tijdens het parsen in de
 * DOM verschijnt — ruim vóór de plugin-init op DOMContentLoaded. Idempotent
 * + defensief (niets crasht als de structuur afwijkt).
 *
 * LET OP: dit moet vóór plugin-init draaien, dus GEEN DOMContentLoaded-wrap. */
(function () {
  function patchOptions(el) {
    if (!el || el.dataset.rgLoopPatched) return false;
    var raw = el.getAttribute('data-product-slider-options');
    if (!raw) return false;
    var opts;
    try { opts = JSON.parse(raw); } catch (e) { return false; }
    opts.slider = opts.slider || {};
    opts.slider.loop = false;       // geen clones meer
    opts.slider.rewind = false;     // niet terugspringen naar begin
    opts.slider.mouseDrag = true;   // block-instelling had 'm uit

    /* 4 tegels op laptop én desktop. De plugin bepaalt het aantal via
       items = floor(sliderbreedte / (productboxMinWidth + gutter)). Met de
       standaard 300+30=330px paste er op laptop (~1200-1270px slider) maar 3.
       Verlaagd naar 250+30=280px: laptop floor(~1230/280)=4, en desktop
       (geboxed op max ~1360px, nooit breder) floor(1360/280)=4 -> nooit 5.
       Schaalt daaronder netjes terug naar 3/2/1. Op telefoonbreedte gaf dat
       exact 1 volle-breedte tegel -- geen enkele hint dat het een slider is.
       Kleinere waarde specifiek onder 576px: 2 tegels zichtbaar (met de nu
       ook zichtbare pijl duidelijk genoeg dat er meer te zien is). */
    opts.productboxMinWidth = window.innerWidth < 576 ? '130px' : '250px';
    // Iets minder ruimte tussen de tegels op mobiel (was overal 30px, oogde
    // op smalle schermen extra breed t.o.v. de al platter gemaakte tegels).
    if (window.innerWidth < 576) opts.slider.gutter = 16;

    el.setAttribute('data-product-slider-options', JSON.stringify(opts));
    el.dataset.rgLoopPatched = '1';
    return true;
  }

  var SELECTOR = '.home-productslider [data-product-slider-options]';

  function scanNode(root, hits) {
    if (root.nodeType !== 1) return;
    if (root.matches && root.matches(SELECTOR) && patchOptions(root)) hits.push(root);
    if (root.querySelectorAll) {
      root.querySelectorAll(SELECTOR).forEach(function (el) {
        if (patchOptions(el)) hits.push(el);
      });
    }
  }

  // 1. Direct proberen (als het element al geparsed is).
  var hits = [];
  document.querySelectorAll(SELECTOR).forEach(function (el) {
    if (patchOptions(el)) hits.push(el);
  });

  /* 2. En opvangen zodra het verschijnt, vóór de plugin het leest.
     PERF: dit draaide voorheen op ELKE pagina (niet alleen de homepage,
     waar het element daadwerkelijk voorkomt) en deed bij ELKE DOM-mutatie
     tijdens het parsen een volledige document-brede querySelectorAll --
     tientallen/honderden keren tijdens een normale pageload, precies het
     patroon dat de pre-golive-audit als zwaarste INP-post aanmerkte. Nu:
     alleen de daadwerkelijk toegevoegde nodes per mutatie checken, en de
     observer meteen stoppen zodra het element gevonden is (bestaat max 1x
     per pagina) i.p.v. te wachten tot window.load. */
  if (!hits.length && window.MutationObserver) {
    var obs = new MutationObserver(function (mutations) {
      var found = [];
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (node) { scanNode(node, found); });
      });
      if (found.length) obs.disconnect();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('load', function () { obs.disconnect(); });
  }
})();


/* ---- 2.0b Product-slider "bekijk alle"-link naar onder de tegels (mobiel)
 * De titel + "Bekijk alle producten"-link (.rg-cat-head) zitten samen in
 * één tekstblok VOOR de slider -- puur CSS kan de link niet apart naar ná
 * een latere sibling verplaatsen zonder ook de titel mee te nemen. Alleen
 * de link zelf verhuist (titel blijft staan), en wordt een volwaardige
 * knop i.p.v. de kale tekstlink-met-pijl (die viel op mobiel te veel weg
 * onder de tegels). Alleen <576px: op tablet/desktop blijft 'm gewoon
 * bovenaan naast de titel staan. */
document.addEventListener('DOMContentLoaded', function () {
  if (window.innerWidth >= 576) return;
  document.querySelectorAll('.cms-block-product-slider').forEach(function (slider) {
    var textBlock = slider.previousElementSibling;
    if (!textBlock || !textBlock.classList.contains('cms-block-text')) return;
    var link = textBlock.querySelector('.rg-cat-head__link');
    if (!link || link.dataset.rgMoved) return;
    link.dataset.rgMoved = '1';
    link.classList.remove('rg-cat-head__link');
    link.classList.add('btn', 'btn-primary', 'rg-slider-cta-moved');
    slider.parentNode.insertBefore(link, slider.nextSibling);
  });
});


/* ---- 2.1 Logo slider — Shopware carousel vervangen door continue scroll
 * DOMContentLoaded i.p.v. window.load: img.src is de resolved attribuutwaarde
 * en staat er al zodra het element geparsed is — de afbeelding hoeft niet
 * gedownload te zijn. window.load wacht op ALLE resources op de pagina
 * (incl. hero-beelden), waardoor de onbewerkte Shopware-carousel eerst even
 * zichtbaar flitst voor de swap. Dit haalt die flits weg. */
document.addEventListener('DOMContentLoaded', function () {
  var carousel = document.querySelector('.logo-slider .cms-element-custom-cms-slider');
  if (!carousel) return;

  var items = carousel.querySelectorAll('.carousel-item');
  if (!items.length) return;

  // Verzamel unieke logo afbeeldingen — over ALLE slides, niet alleen de
  // eerste (elk .carousel-item is hier één los logo, dus scoped op de
  // eerste items alleen liet alle andere merken weg -> band toonde alsmaar
  // hetzelfde ene logo herhaald).
  var images = [];
  var seen = [];
  items.forEach(function (item) {
    item.querySelectorAll('.card-img img').forEach(function (img) {
      if (!seen.includes(img.src)) {
        seen.push(img.src);
        images.push({ src: img.src, alt: img.alt });
      }
    });
  });

  // Bouw scroll-track. Set is verdubbeld voor naadloze loop.
  // 100s (was 50s): vaste animatie-DUUR over een variabele track-BREEDTE
  // (hangt af van het aantal logo's) betekent dat meer logo's dezelfde
  // afstand in dezelfde tijd afleggen -> oogt sneller. Simpelweg de duur
  // verdubbelen halveert de waargenomen snelheid, ongeacht hoeveel logo's
  // er nu of later in staan.
  var track = document.createElement('div');
  track.style.cssText = 'display:flex; align-items:center; width:max-content; animation:logoScroll 100s linear infinite;';

  // 4 kopieën: de -50%-loop verschuift 2 kopieën -> die vullen altijd de
  // viewport-breedte, dus geen leeg gat + logo's die "ineens" verschijnen.
  [images, images, images, images].forEach(function (set) {
    set.forEach(function (img) {
      var div = document.createElement('div');
      div.style.cssText = 'padding: 0 3rem; flex-shrink:0;';
      div.innerHTML = '<img src="' + img.src + '" alt="' + img.alt + '" style="height:32px; opacity:0.6; filter:grayscale(100%); transition:all 0.3s;">';
      div.querySelector('img').addEventListener('mouseover', function () {
        this.style.opacity = '1';
        this.style.filter = 'grayscale(0%)';
      });
      div.querySelector('img').addEventListener('mouseout', function () {
        this.style.opacity = '0.6';
        this.style.filter = 'grayscale(100%)';
      });
      track.appendChild(div);
    });
  });

  // Wrapper transparant — section bg (#F7F5F2) komt door de CSS op .home.productslider.
  // opacity 0 + transition: subtiele fade i.p.v. een abrupte DOM-swap wanneer
  // de native carousel wordt vervangen door deze continue-scroll-band.
  // Klasse (i.p.v. alleen inline styles) zodat de edge-fade-pseudo-elementen
  // (CSS sectie 12) 'm kunnen targeten. De wrapper zelf is nu ingekaderd op
  // de sitebrede content-breedte (via --rg-logo-fade-inset, CSS sectie 12)
  // i.p.v. full-bleed -- eerste versie liet de track edge-to-edge scrollen
  // met alleen een fade-overlay erboven, waardoor logo's tussen de
  // viewport-rand en de content-grens gewoon haarscherp zichtbaar bleven.
  // Nu clipt overflow:hidden de track al op de smallere breedte, dus de
  // slider oogt optisch net zo breed als de rest van de pagina-inhoud.
  var wrapper = document.createElement('div');
  wrapper.className = 'rg-logo-fade';
  wrapper.style.cssText = 'overflow:hidden; width:calc(100% - 2 * var(--rg-logo-fade-inset)); margin:0 auto; position:relative; padding: clamp(2rem,4vh,3.5rem) 0 clamp(1rem,2vh,1.25rem); opacity:0; transition:opacity .35s ease;';
  wrapper.appendChild(track);

  // Keyframe animatie inject
  var style = document.createElement('style');
  style.textContent = '@keyframes logoScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }';
  document.head.appendChild(style);

  carousel.style.display = 'none';
  carousel.parentNode.insertBefore(wrapper, carousel);

  // Dubbele rAF: zorgt dat de browser opacity:0 eerst schildert vóórdat de
  // transitie naar 1 start (anders wordt de transitie soms overgeslagen
  // omdat beide wijzigingen in dezelfde frame vallen).
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { wrapper.style.opacity = '1'; });
  });

  // Hero-hoogte dynamisch: de logo-slider komt net boven de onderkant van het
  // scherm uit (kleine ruimte eronder), hero-content blijft gecentreerd voor
  // balans. Alleen desktop; herberekent bij resize.
  var hero = document.querySelector('.rgh');
  if (hero) {
    var fitHero = function () {
      if (window.innerWidth < 992) { hero.style.minHeight = ''; return; }
      hero.style.minHeight = '0px';                                   // reset -> meet natuurlijke stand
      var sliderBottom = wrapper.getBoundingClientRect().bottom;      // waar de slider nu eindigt (bij load = vanaf viewport-top)
      var delta = (window.innerHeight - 24) - sliderBottom;           // 24px ruimte onder de slider
      var heroH = hero.getBoundingClientRect().height;
      hero.style.minHeight = Math.max(heroH + delta, 420) + 'px';     // hero groeit/krimpt zodat slider net boven de vouw zit
    };
    fitHero();
    window.addEventListener('resize', fitHero);
    setTimeout(fitHero, 400);                                         // extra pass nadat de layout volledig gesetteld is
  }
});


/* ---- 2.2 Productslider — hele tegel klikbaar
 * Onderscheidt klik vs swipe via mousedown/click delta zodat sliden niet
 * per ongeluk navigatie triggert. */
document.addEventListener('DOMContentLoaded', function () {
  var sliderItems = document.querySelectorAll('.home-productslider .product-slider-item');
  sliderItems.forEach(function (item) {
    var link = item.querySelector('.product-image-link');
    if (!link) return;

    var href = link.getAttribute('href');
    item.style.cursor = 'pointer';
    var startX = 0;
    var startY = 0;

    item.addEventListener('mousedown', function (e) {
      startX = e.clientX;
      startY = e.clientY;
    });

    item.addEventListener('click', function (e) {
      var deltaX = Math.abs(e.clientX - startX);
      var deltaY = Math.abs(e.clientY - startY);
      if (deltaX > 5 || deltaY > 5) return;            // swipe, niet doorklikken
      if (e.target.closest('.product-wishlist')) return; // wishlist heeft eigen handler
      if (e.target.closest('.variant-thumbnail')) return; // variant-thumb idem
      window.location.href = href;
    });
  });
});


/* ---- 2.3 Productslider navigatie — VERWIJDERD
 * De custom .rg-slider-nav bottom-right knoppen (en de bijbehorende
 * transform-fallback) zijn eruit. De slider is nu boxed en navigatie loopt
 * terug via Shopware's eigen "controls"-instelling op het blok (admin zet
 * die aan) — knoppen zijn eigen (.base-slider-controls) gestyled in
 * rootedgoods.css (sectie 30, stap 5). loop:false (sectie 2.0 hierboven)
 * blijft gewoon staan, want dat voorkomt clone-artefacten ongeacht welke
 * nav actief is. */


/* =====================================================================
 * SECTIE 3 — PDP (product detail page)
 *
 * Scoped via body.is-ctl-product (Promidata/Shopware page-class).
 * Alle functies zijn idempotent (kunnen veilig 2x draaien) en muteren
 * géén containers die Promidata via XHR re-rendert.
 * ===================================================================== */

(function () {
  if (!document.body.classList.contains('is-ctl-product')) return;

  document.addEventListener('DOMContentLoaded', function () {
    moveProductNameToBuyCol();
    openQuantityAccordionByDefault();
    keepConfiguratorStepsOpen();
    enhanceTierPriceTable();
    addGalleryZoomButton();
  });

  /* ---- 3.1 Productnaam verplaatsen naar bovenaan de buy-col (col-lg-5)
   * Promidata rendert de h1 standaard in een eigen row boven gallery+buy.
   * Wij willen 'm naast de gallery, bovenaan de rechter kolom (Sugarcoat-style).
   * Alleen op desktop (>= 992px); op mobile blijft de naam waar 'ie is. */
  function moveProductNameToBuyCol() {
    if (window.innerWidth < 992) return;
    var h1 = document.querySelector('.product-detail-name');
    var buyCol = document.querySelector('.product-detail-buy');
    if (!h1 || !buyCol) return;
    if (buyCol.firstChild === h1) return; // al verplaatst — idempotent
    buyCol.insertBefore(h1, buyCol.firstChild);
  }

  /* ---- 3.2 "Aantal" accordion standaard open
   * Promidata rendert collapsed; wij willen 'm direct zichtbaar zodat
   * klanten het minimum order quantity en de staffel-prijzen direct zien. */
  function openQuantityAccordionByDefault() {
    var qtyTitle = document.querySelector('#qty-title');
    var qtyWrapper = document.querySelector('#qty-wrapper');
    if (!qtyTitle || !qtyWrapper) return;
    qtyTitle.classList.remove('collapsed');
    qtyTitle.setAttribute('aria-expanded', 'true');
    qtyWrapper.classList.add('show');
  }

  /* ---- 3.2b Configurator-stappen open laten bij klik op "Volgende"
   * Standaard sluit Promidata de huidige stap zodra je op .btn-configurator-next
   * klikt, waardoor het overzicht (kleur + aantal) wegvalt. Wij willen ze
   * juist open laten zodat de gebruiker context houdt.
   *
   * Aanpak: capture-phase click handler die Promidata's click-logic blokkeert
   * (stopImmediatePropagation) en zelf alleen de VOLGENDE groep opent — zonder
   * de huidige te sluiten. Handmatig sluiten via titel-klik blijft werken. */
  function keepConfiguratorStepsOpen() {
    if (document.body.dataset.rgConfiguratorStepsGuard) return;
    document.body.dataset.rgConfiguratorStepsGuard = '1';
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.btn-configurator-next');
      if (!btn) return;

      // Blokkeer Promidata's sluit-handler én default link-gedrag.
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();

      var currentGroup = btn.closest('.product-detail-configurator-group');
      if (!currentGroup) return;

      // Zoek de eerstvolgende configurator-group sibling.
      var nextGroup = currentGroup.nextElementSibling;
      while (nextGroup && !nextGroup.classList.contains('product-detail-configurator-group')) {
        nextGroup = nextGroup.nextElementSibling;
      }
      if (!nextGroup) return;

      var nextTitle = nextGroup.querySelector('.collapse-title');
      var nextContent = nextGroup.querySelector('.collapse-content');
      if (!nextTitle || !nextContent) return;

      nextTitle.classList.remove('collapsed');
      nextTitle.setAttribute('aria-expanded', 'true');
      nextContent.classList.add('show');

      // Scroll de net-geopende stap in beeld zodat gebruiker direct ziet wat'r staat.
      nextTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, true);
  }

  /* ---- 3.3 Staffel-prijzen tabel (.product-block-prices-grid)
   * Twee enhancements:
   *   a) Hele rij klikbaar — niet alleen het quantity-getal (.qty-click)
   *      Belt window.changeOrderQuantity(qty) (door Promidata gedefinieerd).
   *   b) Besparing-cell wrappen in <span class="product-block-prices-savings">
   *      zodat we 'm als sage-groene pill kunnen stylen via CSS.
   *
   * Deze tabel wordt door Promidata NIET re-rendered op prijswijziging
   * (alleen de .highlight-row class wordt toegevoegd/verwijderd), dus
   * onze span-wrapper en handlers blijven intact. */
  function enhanceTierPriceTable() {
    var rows = document.querySelectorAll('.product-block-prices-row[data-qty]');
    rows.forEach(function (row) {
      // (a) Hele rij klikbaar
      if (!row.dataset.rgRowClickBound) {
        row.dataset.rgRowClickBound = '1';
        row.addEventListener('click', function (e) {
          // Skip als gebruiker direct op de qty-click span klikt
          // (heeft eigen Promidata handler die changeOrderQuantity aanroept)
          if (e.target.closest('.qty-click')) return;
          var qty = row.dataset.qty;
          if (qty && typeof window.changeOrderQuantity === 'function') {
            window.changeOrderQuantity(qty);
          }
        });
      }

      // (b) Besparing-tekst wrappen in pill-span
      var savingsCell = row.querySelector('th.text-end, td.text-end');
      if (savingsCell && !savingsCell.querySelector('.product-block-prices-savings')) {
        var text = savingsCell.textContent.trim();
        if (text.length > 0) {
          savingsCell.innerHTML = '<span class="product-block-prices-savings">' + text + '</span>';
        }
      }
    });
  }

  /* ---- 3.4 Gallery zoom-trigger button
   * Promidata's data-zoom-modal flow opent een zoom-modal bij klik op
   * de hoofdafbeelding. Wij voegen een zichtbare hint toe in de hoek
   * (loep-icoon) zodat dit gedrag duidelijk is. Button is alleen zichtbaar
   * op hover (CSS) en triggert image.click() op de actieve slide. */
  function addGalleryZoomButton() {
    var galleryCol = document.querySelector('.product-detail-media .gallery-slider-col');
    if (!galleryCol) return;
    if (galleryCol.querySelector('.gallery-zoom-trigger')) return; // skip duplicate

    var zoomBtn = document.createElement('button');
    zoomBtn.type = 'button';
    zoomBtn.className = 'gallery-zoom-trigger';
    zoomBtn.setAttribute('aria-label', 'Vergroot afbeelding');
    zoomBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>';

    zoomBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var activeImage = galleryCol.querySelector('.tns-slide-active .gallery-slider-image, .gallery-slider-image');
      if (activeImage) activeImage.click();
    });

    galleryCol.appendChild(zoomBtn);
  }
})();


/* Gedeeld door sectie 2.4 (hero-v2) en 1.6b (over-ons hero): onthul pas als
   webfonts geladen zijn (of na een 1.5s-vangnet-timeout), zodat de content
   niet nog een keer verspringt door een late font-swap. De twee secties
   verschillen verder te veel (ander gemeten element, ander aantal correctie-
   stappen, synchroon vs. DOMContentLoaded, wel/niet een resize-event
   terugsturen naar bouwRoute()) om verder samen te voegen tot 1 functie --
   dit stukje was wél letterlijk identiek op 2 plekken. */
function rgOnthulNaFonts(toon) {
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(toon);
    setTimeout(toon, 1500);
  } else {
    toon();
  }
}

/* ---- 2.4 Hero v2 — hoogte passend maken zodat de logo-slider net boven de
 * vouw eindigt (24px marge). Eigen scope; doet niets zonder .rg-hero-v2 op de
 * pagina (bijt de oude fitHero voor .rgh dus niet).
 *
 * Gebruikt ResizeObserver op .logo-slider i.p.v. een eenmalige setTimeout-gok:
 * één vaste meting (bv. 400ms na load) kan de slider treffen VOORDAT die
 * script 2.1 'm heeft opgebouwd (of voordat webfonts/afbeeldingen de layout
 * laten settelen), waardoor fit() een verkeerde hoogte bakt -> een te grote
 * lege ruimte boven de slider die niet meer herstelt. ResizeObserver
 * herberekent automatisch zodra de slider daadwerkelijk van grootte
 * verandert, ongeacht wanneer dat gebeurt. */
(function () {
  var hero = document.querySelector('.rg-hero-v2');
  if (!hero) return;
  function fit() {
    if (window.innerWidth < 992) { hero.style.minHeight = ''; return; }
    // Alleen (her)berekenen boven aan de pagina: getBoundingClientRect() is
    // viewport-relatief, dus de formule hieronder gaat er impliciet van uit
    // dat hero+slider nog bovenaan staan. Op mobiel verbergt/toont de
    // adresbalk zich tijdens scrollen -> dat vuurt een 'resize' terwijl de
    // pagina NIET bovenaan staat, en dan bakt fit() een compleet verkeerde
    // (soms enorme) hoogte die blijft hangen tot de volgende geldige meting.
    // Dit was de "kapotte hero na heen-en-weer scrollen"-bug. Buiten deze
    // guard laten we de laatst bekende (goede) hoogte gewoon staan.
    if ((window.scrollY || document.documentElement.scrollTop) > 4) return;
    var slider = document.querySelector('.logo-slider');
    if (!slider) return;
    hero.style.minHeight = '0px';                                   // reset -> meet natuurlijke stand
    var delta = (window.innerHeight - 24) - slider.getBoundingClientRect().bottom;
    var h = hero.getBoundingClientRect().height;
    // Veiligheidsmarge: als fit() ooit draait op een tussentijdse/onvolledige
    // meting (bv. slider nog mid-render), voorkomt deze cap dat een absurde
    // uitkomst (honderden/duizenden px te veel) blijft hangen tot de volgende
    // resize. Bovengrens ruim boven een normale hero (1.4x viewport-hoogte).
    var minH = 440;
    var maxH = window.innerHeight * 1.4;
    hero.style.minHeight = Math.min(Math.max(h + delta, minH), maxH) + 'px';
  }
  // DOMContentLoaded i.p.v. window.load: die laatste wacht op ALLE
  // resources op de pagina (incl. hero- en productafbeeldingen verderop),
  // waardoor de hero eerst zichtbaar op zijn ongefitte hoogte staat en pas
  // ver daarna springt naar de juiste maat. De logo-slider (sectie 2.1)
  // bouwt zijn track al synchroon op DOMContentLoaded met een vaste
  // beeldhoogte (32px inline), dus die is dan al betrouwbaar meetbaar -- de
  // ResizeObserver blijft als vangnet staan voor eventuele latere afwijking.
  document.addEventListener('DOMContentLoaded', function () {
    fit();
    var slider = document.querySelector('.logo-slider');
    if (slider && window.ResizeObserver) {
      new ResizeObserver(fit).observe(slider);
    } else {
      setTimeout(fit, 400); // fallback zonder ResizeObserver-support
    }
  });
  window.addEventListener('resize', fit);
  // Bij terugnavigeren (browser Back) herstelt Chrome/Safari/Firefox de
  // pagina soms uit het bfcache: 'load' vuurt dan NIET opnieuw, dus fit()
  // draaide nooit voor de huidige weergave -> hero houdt de (mogelijk
  // verouderde) hoogte van vóór het wegnavigeren aan, wat als een grote
  // lege ruimte oogt. 'pageshow' met persisted=true vangt dat geval af.
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) fit();
  });

  /* .rg-hero-v2__copy-wrap (CSS) blijft onzichtbaar tot webfonts geladen
     zijn: Playfair (titel) en Montserrat (kicker/sub/cta) renderen anders
     eerst in de fallback-serif/sans -- andere lettermetriek, dus een andere
     content-hoogte dan waar fit() hierboven al op gemeten heeft. Zonder dit
     kan de copy-kolom na de font-swap alsnog verspringen (of, subtieler, de
     slider net niet meer exact boven de vouw laten eindigen). Zelfde patroon
     als .is-hero-klaar bij de Over-ons-hero (sectie 1.6b): één laatste
     fit()-pas vlak vóór het onthullen, met een vangnet-timeout zodat er
     nooit permanent niets te zien is. */
  var onthuld = false;
  function toonHero() {
    if (onthuld) return;
    onthuld = true;
    fit();
    hero.classList.add('is-hero-klaar');
  }
  rgOnthulNaFonts(toonHero);
})();


/* ============================================================
   1.6 OVER ONS — "De Route van Rooted" (route + scroll-regie)
   ------------------------------------------------------------
   Doet niets buiten /over-ons: alles hangt aan .rg-route. GSAP +
   ScrollTrigger worden pas geladen als die sectie bestaat. Was ook Lenis
   (smooth scroll), verwijderd wegens performance: dat kaapt het scrollen
   van de VOLLE pagina en zet dat om in een JS-gestuurde animatielus die elk
   frame opnieuw rendert, i.p.v. het vrijwel gratis, hardware-versnelde
   native scrollen. Op een pagina met meer eromheen (theme-nav, overige
   CMS-blokken) telde dat continu mee. ScrollTrigger werkt prima op native
   scroll, dat is zijn standaardwerking.

   DE ROUTELIJN is EEN doorlopend pad over de volle hoogte van de
   track, at runtime opgebouwd uit de werkelijke posities van de
   stopmarkers (en opnieuw bij resize). Opbouw:

     spine  = startpunt + markerposities + tussenpunten per traject
     sample = vaste verticale stap van 6-14px langs die spine
     offset = drie gestapelde golven in x (traag/midden/fijn)
     fade   = offset naar 0 binnen 40px van een marker

   Twee harde regels maken lussen onmogelijk:
     1. y is STRIKT oplopend (elk punt minimaal +1px t.o.v. het vorige)
     2. alle variatie zit uitsluitend in x; y wordt nooit door ruis geraakt
   De bezier-controlepunten liggen bovendien altijd tussen de y van hun
   eindpunten, dus ook de curve zelf blijft monotoon in y. Een pad dat
   monotoon in y is kan zichzelf per definitie niet snijden.

   Bij prefers-reduced-motion wordt er niets geladen: de lijn wordt dan
   wel getekend, maar meteen volledig zichtbaar.
   ============================================================ */
(function () {
  var root = document.querySelector('.rg-route');
  if (!root) return;

  var track = root.querySelector('.rg-route__track');
  var svg   = root.querySelector('.rg-route__line');
  var base  = root.querySelector('.rg-route__line-base');
  var draw  = root.querySelector('.rg-route__line-draw');
  var mark  = root.querySelector('.rg-route__mark');
  if (!track || !svg || !base || !draw) return;

  /* ---------- kleine deterministische generator (vaste seed) ---------- */
  function rng(seed) {
    return function () {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
  }

  /* ---------- de route opbouwen ---------- */
  var routeStart = { x: 0, y: 0 }, routeEind = 0;
  /* Vooraf bemonsterde (lengte -> x/y)-tabel, gebruikt tijdens het scrollen
     i.p.v. draw.getPointAtLength() bij elk scroll-frame. Dat laatste bleek
     op deze lange, sterk bemonsterde route (honderden bezier-segmenten)
     merkbaar zwaar: elke scroll-tick een native SVG-geometrieopzoeking op
     een groot pad. De tabel wordt EENMALIG per bouwRoute()-aanroep gevuld
     (bij load/resize/beeld-load/font-ready, dus zelden), en tijdens het
     scrollen is het alleen nog een binaire zoektocht + lineaire interpolatie
     in platte JS -- orden van grootte goedkoper, met verwaarloosbaar
     verschil in nauwkeurigheid (400 samples over de hele route).*/
  var lengteTabel = [];
  /* zie de toelichting bij zetMerkteken/puntOpLengte verderop: het
     linkerrand-verschil tussen de schermbrede lijn-SVG en de sectie, nodig
     om het merkteken te positioneren. Wordt in bouwRoute() bijgewerkt (dus
     ook na een rebuild door resize/beeld-load), niet bij elke scroll-tick. */
  var svgRootVerschil = 0;
  /* de tekstblokken in SVG-coordinaten: hiermee zakt niet alleen de lijn maar
     ook het merkteken naar 30% zodra het achter tekst doorloopt */
  var tekstVlakken = [];

  function bouwRoute() {
    /* origin = de SVG-box (schermbreed), niet de track: alleen zo is er naast
       de contentkolom ruimte om tekst te ontwijken */
    var tr = svg.getBoundingClientRect();
    svgRootVerschil = tr.left - root.getBoundingClientRect().left;
    var breedte = tr.width, hoogte = root.offsetHeight;
    if (!breedte || !hoogte) return;

    var dots = [].slice.call(root.querySelectorAll('.rg-route__dot'))
                 .filter(function (d) { return d.getClientRects().length; });
    if (!dots.length) return;

    /* spine: startpunt boven de eerste stop + alle markermiddelpunten */
    var spine = [];
    var eerste = dots[0].getBoundingClientRect();
    /* De route begint gecentreerd en net boven de vouw: horizontaal in het
       midden van de sectie, verticaal op ~72% van de viewporthoogte (maar
       altijd onder de proloog en boven de eerste stop). */
    var eersteY = eerste.top - tr.top;
    var introEl = root.querySelector('.rg-route__intro');
    var introOnder = introEl ? (introEl.getBoundingClientRect().bottom - tr.top) : 0;
    /* 190px reserve i.p.v. 140: bij de huidige, veel kortere afstand tot
       stop 1 liet 140 (min RECHT) maar 20px over voor de zijwaartse bocht
       naar de dot -- een bijna haakse knik. Met 190px blijft er na de rechte
       aanloop genoeg ruimte om er een vloeiende "lichte kronkel" van te
       maken i.p.v. recht-dan-plotseling-opzij. */
    var startY = Math.min(eersteY - 190, Math.max(introOnder + 60, window.innerHeight * 0.72));
    /* centreren op de contentkolom, niet op de schermbrede SVG: dat is wat
       het oog als midden leest */
    var trackC = track.getBoundingClientRect();
    var startX = trackC.left + trackC.width / 2 - tr.left;
    spine.push({ x: startX, y: Math.max(0, startY), marker: false });
    /* Rechte aanloop: twee punten met dezelfde x geven in de monotone
       interpolatie hellling 0 (zie hell[j]===0 hieronder), dus vertrekt de
       route kaarsrecht naar beneden in plaats van meteen onder een hoek weg
       te schieten. Het merkteken staat daardoor recht onder het pijltje van
       de scroll-hint voordat de reis zijwaarts begint. */
    /* was 120: bij de kortere hero-tot-stop-1-afstand van nu liet dat te
       weinig ruimte over voor de bocht erna. 40px is genoeg om het merkteken
       nog kaarsrecht te laten starten, zonder de rest van de route (die
       richting stop 1 moet buigen) klem te zetten. */
    var RECHT = 40;
    spine.push({ x: startX, y: Math.max(0, startY) + RECHT, marker: false });

    dots.forEach(function (d) {
      var r = d.getBoundingClientRect();
      /* x uit de BEDOELDE kant van de stop, niet uit de gemeten dot-positie:
         de dots worden zelf op de route gelegd, dus meten zou een
         terugkoppeling geven waarbij de route zijn eigen vorige vorm volgt. */
      var stop = d.parentElement;
      var deel = stop.classList.contains('rg-route__stop--right') ? 0.66
               : stop.classList.contains('rg-route__stop--wide')  ? 0.50
               : 0.34;
      var kolom = track.getBoundingClientRect();
      spine.push({
        x: kolom.left - tr.left + kolom.width * deel,
        y: r.top + r.height / 2 - tr.top,
        marker: true
      });
    });

    /* De reis eindigt niet bij stop 4 maar loopt door naar het team: daar
       komt het merkteken aan bij de mensen achter de route. */
    var slot = root.querySelector('.rg-route__collage-main') || root.querySelector('.rg-route__team');
    if (slot) {
      var sr = slot.getBoundingClientRect();
      spine.push({ x: sr.left + sr.width / 2 - tr.left,
                   y: sr.top + sr.height * 0.42 - tr.top, marker: false });
    }

    /* tussenpunten per traject: sturen de zijwaartse sweep, met een vaste seed */
    var r1 = rng(20250812);
    var vol = [spine[0]];
    for (var i = 1; i < spine.length; i++) {
      var a = spine[i - 1], b = spine[i], dy = b.y - a.y;
      if (dy > 320) {
        var n = dy > 700 ? 2 : 1;
        for (var k = 1; k <= n; k++) {
          var t = k / (n + 1);
          var zij = (r1() - 0.5) * Math.min(breedte * 0.17, 190);
          vol.push({ x: a.x + (b.x - a.x) * t + zij, y: a.y + dy * t, marker: false });
        }
      }
      vol.push(b);
    }


    /* GEEN tekstontwijking. Elke vorm van ontwijken dwingt de lijn tot
       bewegingen die niets met de route te maken hebben; op een echte kaart
       loopt een grens ook gewoon door een label heen. In plaats daarvan zakt
       de lijn achter tekstblokken naar 30% via een mask (zie hieronder). */

    /* x als functie van y, monotoon geinterpoleerd (Fritsch-Carlson):
       voorkomt doorschieten, dus geen slingers buiten de spine om */
    var ys = vol.map(function (p) { return p.y; });
    var xs = vol.map(function (p) { return p.x; });
    var hell = [], m = [];
    for (var j = 0; j < ys.length - 1; j++) hell.push((xs[j + 1] - xs[j]) / Math.max(1, ys[j + 1] - ys[j]));
    m.push(hell[0]);
    for (var j2 = 1; j2 < hell.length; j2++) {
      m.push(hell[j2 - 1] * hell[j2] <= 0 ? 0 : (hell[j2 - 1] + hell[j2]) / 2);
    }
    m.push(hell[hell.length - 1]);
    for (var j3 = 0; j3 < hell.length; j3++) {
      if (hell[j3] === 0) { m[j3] = 0; m[j3 + 1] = 0; continue; }
      var a1 = m[j3] / hell[j3], b1 = m[j3 + 1] / hell[j3], sq = a1 * a1 + b1 * b1;
      if (sq > 9) { var tau = 3 / Math.sqrt(sq); m[j3] = tau * a1 * hell[j3]; m[j3 + 1] = tau * b1 * hell[j3]; }
    }
    function xBijY(y) {
      var k2 = 0;
      while (k2 < ys.length - 2 && y > ys[k2 + 1]) k2++;
      var h = Math.max(1, ys[k2 + 1] - ys[k2]), t = (y - ys[k2]) / h, t2 = t * t, t3 = t2 * t;
      return (2 * t3 - 3 * t2 + 1) * xs[k2] + (t3 - 2 * t2 + t) * h * m[k2] +
             (-2 * t3 + 3 * t2) * xs[k2 + 1] + (t3 - t2) * h * m[k2 + 1];
    }

    /* bemonsteren met een vaste verticale stap; y dus altijd oplopend */
    var r2 = rng(777001), yStart = vol[0].y, yEind = vol[vol.length - 1].y;
    var punten = [], y = yStart;
    while (y < yEind) {
      punten.push(y);
      y += 6 + r2() * 8;              /* 6-14px */
    }
    punten.push(yEind);

    /* drie gestapelde golven in x; irrationele verhoudingen zodat er geen
       patroon ontstaat (pure ruis per punt zou rafelig worden) */
    /* ---- Ruis: value-noise met ONREGELMATIGE knooppunten ----
       Gestapelde sinussen zijn periodiek; daardoor kreeg elk traject dezelfde
       boog van nummer naar nummer. Hier liggen de knooppunten op willekeurige
       afstanden (180-620px) met willekeurige amplitudes, en af en toe een
       uitschieter. Zo varieert zowel de grootte van een bocht als de ruimte
       ertussen, precies wat een echte route doet. */
    function maakRuis(seed, vanY, totY, minStap, maxStap, kansGroot) {
      var r = rng(seed), knopen = [{ y: vanY, v: 0 }], y = vanY;
      while (y < totY) {
        y += minStap + r() * (maxStap - minStap);
        var v = (r() * 2 - 1);
        v *= (r() < kansGroot ? 1 : 0.35);      /* meestal klein, soms fors */
        knopen.push({ y: y, v: v });
      }
      knopen.push({ y: totY + 1, v: 0 });
      return function (yy) {
        var lo = 0, hi = knopen.length - 1;
        if (yy <= knopen[0].y) return knopen[0].v;
        if (yy >= knopen[hi].y) return knopen[hi].v;
        while (hi - lo > 1) { var m = (lo + hi) >> 1; if (knopen[m].y < yy) lo = m; else hi = m; }
        var t = (yy - knopen[lo].y) / Math.max(1, knopen[hi].y - knopen[lo].y);
        t = t * t * (3 - 2 * t);                /* smoothstep: geen doorschot */
        return knopen[lo].v + (knopen[hi].v - knopen[lo].v) * t;
      };
    }

    var yVan = vol[0].y, yTot = vol[vol.length - 1].y;
    var ruisBreed = maakRuis(8814, yVan, yTot, 210, 540, 0.38);   /* grote zwenken */
    var ruisMid   = maakRuis(2277, yVan, yTot,  85, 205, 0.30);   /* tussenbochten */
    var ruisFijn  = maakRuis(9051, yVan, yTot,  30,  78, 0.24);   /* lichte oneffenheid */

    function offset(yy) {
      /* aan het begin naar 0: de route start exact in het midden */
      var inloop = Math.min(1, Math.max(0, (yy - yVan - RECHT) / 300));
      inloop = inloop * inloop * (3 - 2 * inloop);
      return (ruisBreed(yy) * 239 + ruisMid(yy) * 94 + ruisFijn(yy) * 14) * inloop;
    }

    var pts = punten.map(function (yy) {
      /* binnen het doek houden nu de uitstappen fors zijn */
      var xx = xBijY(yy) + offset(yy);
      return { x: Math.max(40, Math.min(breedte - 40, xx)), y: yy };
    });

    /* De omweg zit nu in de spine (zie boven), dus geen harde per-punt
       correctie meer: die gaf haakse hoeken. */

    /* controle: y moet strikt oplopen, anders klopt de generator niet */
    for (var c = 1; c < pts.length; c++) {
      if (pts[c].y <= pts[c - 1].y) {
        console.warn('[rg-route] y niet strikt oplopend bij index', c);
        pts[c].y = pts[c - 1].y + 1;
      }
    }

    routeStart = { x: pts[0].x, y: pts[0].y };
    routeEind = pts[pts.length - 1].y;
    /* de scroll-cue (.rg-route__hint) hing hier voorheen via JS boven het
       startpunt van de route -- nu een vast, links uitgelijnd onderdeel van
       het intro-blok (CSS, sectie 46.4), losgekoppeld van de route/het
       merkteken. */

    svg.setAttribute('viewBox', '0 0 ' + breedte + ' ' + hoogte);
    svg.setAttribute('width', breedte);
    svg.setAttribute('height', hoogte);

    var d2 = padVan(pts);
    base.setAttribute('d', d2);
    draw.setAttribute('d', d2);

    /* opzoektabel vullen -- eenmalig hier, niet per scroll-frame (zie de
       toelichting bij de deklaratie van lengteTabel) */
    (function () {
      var totaal = draw.getTotalLength();
      var STAPPEN = 400;
      var tabel = [];
      for (var i = 0; i <= STAPPEN; i++) {
        var len = totaal * i / STAPPEN;
        var p = draw.getPointAtLength(len);
        tabel.push({ len: len, x: p.x, y: p.y });
      }
      lengteTabel = tabel;
    })();

    /* De nummers volgen de route, niet andersom: zoek per dot de x waar het
       pad zijn hoogte kruist en zet hem daar neer. Zo ligt elk nummer exact
       op de lijn en hoeft de route geen omweg te maken. */
    function routeXbijY(yy) {
      var lo = 0, hi = pts.length - 1;
      if (yy <= pts[0].y) return pts[0].x;
      if (yy >= pts[hi].y) return pts[hi].x;
      while (hi - lo > 1) { var mid = (lo + hi) >> 1; if (pts[mid].y < yy) lo = mid; else hi = mid; }
      var t = (yy - pts[lo].y) / Math.max(1, pts[hi].y - pts[lo].y);
      return pts[lo].x + (pts[hi].x - pts[lo].x) * t;
    }
    dots.forEach(function (d) {
      var dr = d.getBoundingClientRect();
      var stop = d.parentElement.getBoundingClientRect();
      var midY = dr.top + dr.height / 2 - tr.top;
      var x = routeXbijY(midY);
      d.style.left = (x + tr.left - stop.left) + 'px';
    });

    /* Mask: achter tekst zakt de lijn naar 30%. De vorm verandert niet,
       alleen de zichtbaarheid. De vlakken komen NIET uit de containerbox:
       die is zo breed als de kolom terwijl de regels korter zijn, waardoor de
       lijn ook naast de tekst al vervaagde. Per tekstelement wordt daarom het
       werkelijke regelbereik gemeten (Range.getClientRects, samengevoegd tot
       een strak kader). Dezelfde vlakken bepalen de zichtbaarheid van het
       merkteken, zodat lijn en reiziger altijd samen vervagen.

       BOUWROUTE DRAAIT OOK OPNIEUW NA ST.refresh() EN NA HET LADEN VAN
       BEELDEN -- op dat moment heeft de onthul-animatie de tekst al een
       tijdelijke transform gegeven (y:40 scale:.97, de verborgen staat vlak
       voor hij in beeld reveal't). getBoundingClientRect/getClientRects
       tellen die transform mee, dus zonder correctie werd het maskervlak
       ~40px verschoven van de echte, onthulde tekstpositie gemeten -- de
       lijn faadde dan naast de tekst i.p.v. erachter (of juist niet als hij
       er wel achter zat). zonderTransform meet daarom altijd de originele,
       niet-getransformeerde layoutpositie. */
    /* Batched i.p.v. per element schrijven-lezen-terugschrijven: dat laatste
       forceert bij ELK element een synchrone reflow ("layout thrashing"),
       tientallen keren per rebuild. Hier eerst ALLE transforms in één klap
       uit (fase 1), dan ALLE metingen (fase 2, geen enkele write ertussen dus
       geen extra reflow), dan ALLE transforms in één klap terug (fase 3). */
    var teMeten = [].slice.call(root.querySelectorAll(
      '.rg-route__panel, .rg-route__logo, .rg-route__root-icon, ' +
      '.rg-route__body h2, .rg-route__body h3, .rg-route__body p, ' +
      '.rg-route__roots h3, .rg-route__roots p, ' +
      '.rg-route__team-title, .rg-route__team-copy > p'
    )).filter(function (el) {
      return !el.closest('.rg-route__panel') || el.classList.contains('rg-route__panel');
    });
    /* .rg-route__root-icon krijgt zelf NOOIT een onthul-transform (alleen
       zijn voorouder .rg-route__roots, als geheel container, staat in die
       lijst) -- zonderTransform op het icoon zelf was dus een no-op en de
       vervormde positie van de voorouder telde nog gewoon mee. Die voorouder
       moet daarom ook meedoen in de neutralisatie, ook al heeft hij zelf
       geen eigen maskervlak nodig. */
    var rootsEl = root.querySelector('.rg-route__roots');
    if (rootsEl && teMeten.indexOf(rootsEl) === -1) teMeten.push(rootsEl);

    var vorigeTransforms = teMeten.map(function (el) { return el.style.transform; });
    teMeten.forEach(function (el) { el.style.transform = 'none'; });   /* fase 1: alle writes */

    var defs = svg.querySelector('defs') || svg.insertBefore(
      document.createElementNS('http://www.w3.org/2000/svg', 'defs'), svg.firstChild);
    defs.innerHTML = '';
    tekstVlakken = [];
    var NS = 'http://www.w3.org/2000/svg';
    var bereik = document.createRange();

    /* fase 2: alle metingen, geen writes ertussen */
    teMeten.forEach(function (el) {
      /* .rg-route__roots staat alleen in de lijst om zijn transform
         (van onthul) te neutraliseren zodat zijn kind .rg-route__root-icon
         correct gemeten wordt -- de container zelf heeft geen eigen
         maskervlak nodig */
      if (el === rootsEl) return;
      /* gevulde-grond-elementen: een volledig rechthoekig vlak, geen
         regelbereik. Het groene paneel (tekst tussen de regels ook bedekt),
         het thuiskomst-logo (de reiziger lost hier letterlijk in op, moet
         dus nooit zichtbaar overlappen) EN de root-iconen bij stop 3 -- die
         zijn zelf ook het beeldmerk, dus zonder dit vlak kon het reizende
         merkteken er ongemaskeerd overheen lopen en leek het even te
         "verdubbelen". */
      if (el.matches('.rg-route__panel, .rg-route__logo, .rg-route__root-icon')) {
        var b = el.getBoundingClientRect();
        tekstVlakken.push({ x1: b.left - tr.left - 10, y1: b.top - tr.top - 10,
                            x2: b.right - tr.left + 10, y2: b.bottom - tr.top + 10 });
        return;
      }
      /* tekstregels: elk element krijgt zijn eigen, strakke regelkaders */
      bereik.selectNodeContents(el);
      var x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
      [].slice.call(bereik.getClientRects()).forEach(function (rr) {
        if (rr.width < 4 || rr.height < 4) return;   /* lege regels overslaan */
        if (rr.left < x1) x1 = rr.left;
        if (rr.top < y1) y1 = rr.top;
        if (rr.right > x2) x2 = rr.right;
        if (rr.bottom > y2) y2 = rr.bottom;
      });
      if (x1 === Infinity) return;
      tekstVlakken.push({ x1: x1 - tr.left - 13, y1: y1 - tr.top - 9,
                          x2: x2 - tr.left + 13, y2: y2 - tr.top + 9 });
    });

    teMeten.forEach(function (el, i) { el.style.transform = vorigeTransforms[i]; });  /* fase 3 */

    var mask = document.createElementNS(NS, 'mask');
    mask.setAttribute('id', 'rg-route-mask');
    mask.setAttribute('maskUnits', 'userSpaceOnUse');
    var vlak = document.createElementNS(NS, 'rect');
    vlak.setAttribute('width', breedte); vlak.setAttribute('height', hoogte);
    vlak.setAttribute('fill', '#fff');
    mask.appendChild(vlak);
    tekstVlakken.forEach(function (v) {
      var re = document.createElementNS(NS, 'rect');
      re.setAttribute('x', v.x1);
      re.setAttribute('y', v.y1);
      re.setAttribute('width', v.x2 - v.x1);
      re.setAttribute('height', v.y2 - v.y1);
      re.setAttribute('fill', '#4d4d4d');   /* ~30% */
      mask.appendChild(re);
    });
    defs.appendChild(mask);
    base.setAttribute('mask', 'url(#rg-route-mask)');
    draw.setAttribute('mask', 'url(#rg-route-mask)');
  }

  /* bezier met controlepunten die altijd TUSSEN de y van hun eindpunten
     liggen -> de curve blijft monotoon in y, dus lusvrij */
  function padVan(pts) {
    var f = function (v) { return Math.round(v * 10) / 10; };
    var d = 'M' + f(pts[0].x) + ',' + f(pts[0].y);
    for (var i = 1; i < pts.length; i++) {
      var p0 = pts[i - 1], p1 = pts[i];
      var vorige = pts[i - 2] || p0, volgende = pts[i + 1] || p1;
      var h = p1.y - p0.y;
      var m0 = (p1.x - vorige.x) / Math.max(1, p1.y - vorige.y);
      var m1 = (volgende.x - p0.x) / Math.max(1, volgende.y - p0.y);
      /* Controlepunten in x klemmen tussen de twee eindpunten: zonder dit
         schiet de curve zijwaarts door en bolt hij alsnog een tekstblok in
         (gemeten: tot 50px voorbij het ontweken punt). Dit maakt de curve
         ook monotoon in x tussen twee punten, precies zoals bedoeld. */
      var lo = Math.min(p0.x, p1.x), hi = Math.max(p0.x, p1.x);
      var c1 = Math.max(lo, Math.min(hi, p0.x + m0 * h / 3));
      var c2 = Math.max(lo, Math.min(hi, p1.x - m1 * h / 3));
      d += 'C' + f(c1) + ',' + f(p0.y + h / 3) +
           ' ' + f(c2) + ',' + f(p1.y - h / 3) +
           ' ' + f(p1.x) + ',' + f(p1.y);
    }
    return d;
  }

  bouwRoute();
  /* gedebouncet: resize-events kunnen tijdens het slepen aan een vensterrand
     tientallen keren per seconde vuren, en bouwRoute() is een dure operatie
     (spine + honderden samples + tekstmeting + opzoektabel). Zonder debounce
     zou elke tick een volledige rebuild triggeren; nu pas 150ms na de
     laatste resize, als het slepen klaar is. */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(bouwRoute, 150);
  });

  /* ---------- animatie ---------- */
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) {
    /* lijn+merkteken staan al goed (bouwRoute() hierboven) -- meteen tonen,
       er komt toch geen scroll-animatie overheen */
    root.classList.add('is-klaar');
    return;
  }
  if (!('requestAnimationFrame' in window)) { root.classList.add('is-klaar'); return; }

  var CDN = 'https://cdn.jsdelivr.net/';
  /* PERF: beide scripts meteen toevoegen (async=false bewaart de
     uitvoervolgorde) i.p.v. via een reduce-keten waarbij ScrollTrigger pas
     ging laden ná gsap's onload -- dat maakte er twee sequentiële
     netwerk-round-trips van i.p.v. één parallelle, met name merkbaar op
     mobiele verbindingen met hogere latency. */
  var gsapScripts = [
    CDN + 'npm/gsap@3.13.0/dist/gsap.min.js',
    CDN + 'npm/gsap@3.13.0/dist/ScrollTrigger.min.js'
  ];
  var gsapGeladen = 0, gsapFout = false;
  gsapScripts.forEach(function (src) {
    var sc = document.createElement('script');
    sc.src = src; sc.async = false;
    sc.onload = function () {
      if (gsapFout) return;
      if (++gsapGeladen === gsapScripts.length) start();
    };
    sc.onerror = function () {
      if (gsapFout) return;
      gsapFout = true;
      /* GSAP kon niet laden -- lijn/merkteken alsnog tonen (statisch, zonder
         scroll-animatie) i.p.v. ze voorgoed onzichtbaar te laten */
      root.classList.add('is-klaar');
    };
    document.head.appendChild(sc);
  });

  function start() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    if (!gsap || !ST) return;
    gsap.registerPlugin(ST);

    var L = draw.getTotalLength();
    gsap.set(draw, { strokeDasharray: L, strokeDashoffset: L });
    var laatsteP = -1;   // zie PERF-comment bij onUpdate

    ST.create({
      /* de sectie als trigger, niet de track: routeStart/routeEind staan in
         sectiecoordinaten sinds de lijn op sectieniveau hangt. Met de track
         als anker begon alles ~390px (de proloog) te laat. */
      trigger: root,
      /* exact van het startpunt van de route tot het laatste marker-punt:
         zo staat er bij het landen niets getekend en komt de lijn precies
         bij stop 4 aan (eerder liep hij achter en verdween hij uit beeld) */
      /* Startpunt staat op ~72vh; op 46% moest je eerst 260px scrollen voordat
         er iets gebeurde, en zolang bleef het merkteken stilstaan en uit beeld
         lopen. Op 68% begint de lijn vrijwel meteen mee te lopen. */
      start: function () { return 'top+=' + routeStart.y + ' 68%'; },
      end: function () { return 'top+=' + routeEind + ' 58%'; },
      scrub: 0.8,
      invalidateOnRefresh: true,
      /* PERF: strokeDashoffset triggert een repaint van de hele path (geen
         compositor-only property zoals transform) -- op mobiel gemeten
         ~20-23ms per frame tijdens scrubben, boven het 16.7ms-budget voor
         60fps. Touch-scroll vuurt veel scroll-events met verwaarloosbare
         delta; een submicroscopische verandering (< 0.05% van de padlengte)
         negeren scheelt een deel van die onnodige repaints zonder dat de
         animatie zichtbaar minder vloeiend wordt. */
      onUpdate: function (self) {
        var p = self.progress;
        if (Math.abs(p - laatsteP) > 0.0005) {
          laatsteP = p;
          gsap.set(draw, { strokeDashoffset: L * (1 - p) });
        }
        zetMerkteken(p);
      },
      onRefresh: function () {
        L = draw.getTotalLength();
        gsap.set(draw, { strokeDasharray: L });
      }
    });

    /* binaire zoektocht + lineaire interpolatie in lengteTabel, i.p.v.
       draw.getPointAtLength() -- zie de toelichting bij lengteTabel */
    function puntOpLengte(len) {
      var tabel = lengteTabel;
      var lo = 0, hi = tabel.length - 1;
      if (!hi) return { x: 0, y: 0 };
      if (len <= tabel[0].len) return tabel[0];
      if (len >= tabel[hi].len) return tabel[hi];
      while (hi - lo > 1) { var m = (lo + hi) >> 1; if (tabel[m].len < len) lo = m; else hi = m; }
      var a = tabel[lo], b = tabel[hi];
      var t = (len - a.len) / Math.max(1, b.len - a.len);
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }

    function zetMerkteken(p) {
      if (!mark) return;
      var afstand = L * Math.min(1, p + 12 / Math.max(1, L));
      var punt = puntOpLengte(afstand);
      gsap.set(mark, {
        x: punt.x + svgRootVerschil, y: punt.y, xPercent: -50, yPercent: -50,
        /* rotatie vanaf het startpunt, zodat het merkteken bovenaan
           kaarsrecht staat en pas gaat rollen als de reis begint */
        rotation: Math.max(0, afstand - 12) * 0.9
      });
      /* achter tekst zakt het merkteken mee naar 30%, net als de lijn: de
         reiziger verdwijnt onder het verhaal door in plaats van eroverheen.
         De check test een enkel punt, maar het merkteken zelf is 38px breed
         -- zonder buffer kon de rand van het icoon nog zichtbaar over tekst
         hangen (of eraf) terwijl het middelpunt net wel/niet in het vlak
         viel. MERK_MARGE compenseert dat met de halve iconmaat plus wat
         speling. */
      var MERK_MARGE = 22;
      var achter = tekstVlakken.some(function (v) {
        return punt.x > v.x1 - MERK_MARGE && punt.x < v.x2 + MERK_MARGE &&
               punt.y > v.y1 - MERK_MARGE && punt.y < v.y2 + MERK_MARGE;
      });
      if (achter !== markVaag) {
        markVaag = achter;
        gsap.to(mark, { opacity: achter ? 0.3 : 1, duration: 0.25, ease: 'power2.out' });
      }
    }
    var markVaag = false;
    if (mark) gsap.set(mark, { top: 0, left: 0 });
    zetMerkteken(0);
    /* pas nu tonen: de dash-array/-offset van de lijn en de positie van het
       merkteken staan beide vast, dus dit toont meteen de juiste staat i.p.v.
       een korte flits van de volledige lijn + een merkteken dat naar zijn
       plek springt */
    root.classList.add('is-klaar');

    /* dots lichten op zodra ze in beeld zijn */
    gsap.utils.toArray('.rg-route__dot').forEach(function (dot) {
      ST.create({
        trigger: dot, start: 'top 78%',
        onEnter: function () { dot.classList.add('is-on'); },
        onLeaveBack: function () { dot.classList.remove('is-on'); }
      });
    });

    /* ---- Tekst en beeld komen in beeld ----
       Met ScrollTrigger.batch i.p.v. from-tweens: die laatste renderen hun
       beginstand meteen en botsen met de herberekening na het laden van de
       beelden (elementen bleven dan onzichtbaar of stonden er al). batch zet
       de beginstand hard en animeert pas bij binnenkomst. */
    function onthul(selector, opties) {
      var els = gsap.utils.toArray(selector).filter(function (e) { return e; });
      if (!els.length) return;
      gsap.set(els, { opacity: 0, y: opties.y, scale: opties.scale });
      ST.batch(els, {
        start: 'top 88%',
        onEnter: function (groep) {
          gsap.to(groep, {
            opacity: 1, y: 0, scale: 1,
            duration: opties.duur, ease: 'power3.out',
            stagger: opties.stagger, overwrite: true
          });
        }
      });
    }

    onthul('.rg-route__place, .rg-route__stop-title, .rg-route__stop p, ' +
           '.rg-route__roots, .rg-route__panel, .rg-route__team-title, ' +
           '.rg-route__team-copy > p, .rg-route__contact, .rg-route__logo, .rg-route__end-link',
           { y: 40, scale: .97, duur: .8, stagger: .07 });

    onthul('.rg-route__shot, .rg-route__collage-shot, .rg-route__collage-main',
           { y: 34, scale: .86, duur: .9, stagger: .08 });

    /* Losse parallax per sfeerbeeld (was 8 individuele scrub-ScrollTriggers,
       elk met eigen per-frame werk) verwijderd wegens performance. De
       onthul()-reveal hierboven laat elk beeld nog steeds mooi in beeld
       schuiven/schalen bij binnenkomst -- dat gebeurt eenmalig, niet
       continu tijdens het hele scrollen. */

    var hint = root.querySelector('.rg-route__hint');
    if (hint) gsap.to(hint, { opacity: 0, y: -10, ease: 'none',
      scrollTrigger: { trigger: hint, start: 'top 28%', end: 'top 2%', scrub: true } });

    ST.addEventListener('refresh', function () { bouwRoute(); });
    ST.refresh();

    /* Beelden veranderen de paginahoogte. Zonder deze herberekening staan de
       triggers op de (kortere) beginlayout en zijn ze al afgevuurd voordat je
       scrolt: dan is bij het landen al tekst en beeld zichtbaar.

       PERF: bouwRoute() (400x getPointAtLength voor de opzoektabel) niet
       hier direct aanroepen -- ST.refresh() hieronder triggert 'm toch al
       via de 'refresh'-listener (regel hierboven), dus een directe aanroep
       erbovenop bouwde de tabel twee keer per herberekening. Met 3
       onafhankelijke triggers (fonts, load, alle beelden) die vaak vlak na
       elkaar afgaan op mobiel liep dit snel op tot een merkbare hapering
       vlak na het laden, precies wanneer iemand meteen begint te scrollen. */
    function herbereken() {
      ST.refresh();
      /* het pad is nieuw: lengte opnieuw meten en merkteken terugzetten op de
         huidige voortgang, anders blijft het op zijn oude plek hangen */
      L = draw.getTotalLength();
      gsap.set(draw, { strokeDasharray: L });
      var t = ST.getAll().find(function (x) { return x.vars && x.vars.scrub; });
      var p = t ? t.progress : 0;
      gsap.set(draw, { strokeDashoffset: L * (1 - p) });
      zetMerkteken(p);
    }
    /* PERF: debounce zodat meerdere triggers die vlak na elkaar afgaan
       (fonts.ready, window load, laatste beeld klaar -- vaak binnen
       dezelfde tick op een snel netwerk) in één herbereken() landen i.p.v.
       elk apart de opzoektabel opnieuw te bouwen. */
    var herberekenGepland = false;
    function herberekenGedebounced() {
      if (herberekenGepland) return;
      herberekenGepland = true;
      requestAnimationFrame(function () { herberekenGepland = false; herbereken(); });
    }
    if (document.readyState === 'complete') herberekenGedebounced();
    else window.addEventListener('load', herberekenGedebounced);
    /* Playfair Display kan nog niet geladen zijn op het moment dat de
       maskervlakken gemeten worden -- de koppen renderen dan tijdelijk in
       de fallback-serif (Georgia), die andere letterbreedtes heeft. Zonder
       deze herberekening bleef het maskervlak op de smallere/bredere
       fallback-maat staan, ook nadat het echte lettertype was ingeladen. */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(herberekenGedebounced);
    var beelden = root.querySelectorAll('img');
    var klaar = 0;
    beelden.forEach(function (im) {
      if (im.complete) { klaar++; return; }
      im.addEventListener('load', function () { if (++klaar === beelden.length) herberekenGedebounced(); }, { once: true });
      im.addEventListener('error', function () { if (++klaar === beelden.length) herberekenGedebounced(); }, { once: true });
    });
  }
})();


/* ---- 2.5 PDP — Aantal-stepper (+/- knoppen)
 * Native markup is een kaal <input type="number"> zonder stepper-knoppen --
 * op een telefoon toont dat sowieso geen spinner-pijltjes (puur desktop),
 * dus was het gewoon een tekstveld. Winkelmandje/checkout hebben al een
 * nette +/- pil-stepper (rootedgoods.css secties 49.5/confirm) -- hier
 * dezelfde stijl, door het bestaande input-element (niet klonen) in een
 * kleine wrapper te zetten met twee knoppen ernaast. Klikken past .value
 * aan binnen min/max/step en dispatcht een change-event, zodat Promidata's
 * eigen prijsherberekening (staffeltabel/totaalprijs) gewoon blijft werken. */
document.addEventListener('DOMContentLoaded', function () {
  var input = document.querySelector('#product-order-quantity, .product-detail-quantity-select');
  if (!input || input.closest('.rg-qty-stepper')) return;

  var min = parseInt(input.min, 10) || 1;
  var max = parseInt(input.max, 10) || Infinity;
  var step = parseInt(input.step, 10) || 1;

  var wrap = document.createElement('div');
  wrap.className = 'rg-qty-stepper';

  var minus = document.createElement('button');
  minus.type = 'button';
  minus.className = 'rg-qty-stepper__btn rg-qty-stepper__btn--minus';
  minus.setAttribute('aria-label', 'Verminder aantal');
  minus.textContent = '−';

  var plus = document.createElement('button');
  plus.type = 'button';
  plus.className = 'rg-qty-stepper__btn rg-qty-stepper__btn--plus';
  plus.setAttribute('aria-label', 'Verhoog aantal');
  plus.textContent = '+';

  input.parentNode.insertBefore(wrap, input);
  wrap.appendChild(minus);
  wrap.appendChild(input);
  wrap.appendChild(plus);

  function zetWaarde(delta) {
    var huidig = parseInt(input.value, 10);
    if (isNaN(huidig)) huidig = min;
    var nieuw = Math.min(max, Math.max(min, huidig + delta));
    if (nieuw === huidig) return;
    input.value = nieuw;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
  minus.addEventListener('click', function () { zetWaarde(-step); });
  plus.addEventListener('click', function () { zetWaarde(step); });
});


/* ---- 1.6b Over-ons hero — hoogte passend maken zodat het reismerkteken
 * (.rg-route__mark, dat net onder de scroll-cue verschijnt) met ~40px lucht
 * boven de vouw eindigt, zelfde patroon als de home-hero (sectie 2.4):
 * min-height dynamisch berekend i.p.v. een vaste vh-gok, die geen rekening
 * kan houden met de werkelijke header-hoogte. .rg-route__intro-copy (CSS)
 * centreert de kop/eyebrow/vraag verticaal in de ruimte die dat oplevert.
 *
 * SYNCHROON i.p.v. DOMContentLoaded: dat laatste gaf nog net genoeg vertraging
 * om de eerste (ongefitte) hoogte zichtbaar te laten verspringen naar de
 * gefitte hoogte. bouwRoute() hierboven draait ook al synchroon bij het
 * parsen (geen zichtbare flits), dus fit() volgt hetzelfde patroon: .rg-route
 * bestaat al (dit script staat na de HTML), dus er hoeft niet gewacht te
 * worden op DOMContentLoaded.
 *
 * Marge is 80px, niet 40: het merkteken zelf hangt 27-58px ONDER de
 * scroll-cue (afhankelijk van viewporthoogte, via .rg-route__track's eigen
 * padding-top-clamp) -- richten op enkel de cue liet het merkteken aan de
 * onderkant afgesneden. 80px geeft in alle gevallen nog child ~20-50px
 * lucht ONDER het merkteken zelf.
 *
 * bouwRoute() draait synchroon VOORDAT deze fit() draait, dus tegen
 * .rg-route__track's ONgefitte positie. Een synthetic 'resize'-event ná het
 * aanpassen van min-height hergebruikt de bestaande gedebouncete resize ->
 * bouwRoute()-listener (sectie 1.6) om de lijn opnieuw te bouwen tegen de
 * juiste, definitieve positie -- geen directe toegang tot bouwRoute nodig
 * (zit in die IIFE's eigen scope). Dat gebeurt via een 150ms-debounce, dus
 * NA de eerste paint -- onzichtbaar, want lijn/merkteken staan tot die
 * herbouw sowieso nog op opacity:0 (.rg-route.is-klaar, sectie 1.6). */
(function () {
  var root = document.querySelector('.rg-route');
  var intro = document.querySelector('.rg-route__intro');
  var hint = intro && intro.querySelector('.rg-route__hint');
  if (!root || !intro || !hint) return;
  function fit() {
    if (window.innerWidth < 992) { intro.style.minHeight = ''; return; }
    // Zelfde scroll-guard als sectie 2.4: getBoundingClientRect() is
    // viewport-relatief, dus alleen geldig zolang de hero nog bovenaan staat.
    if ((window.scrollY || document.documentElement.scrollTop) > 4) return;
    var vorige = intro.style.minHeight;
    var minH = 480;
    var maxH = window.innerHeight * 1.4;
    intro.style.minHeight = '0px';                                  // reset -> meet natuurlijke stand
    var poging = Math.min(Math.max(intro.getBoundingClientRect().height, minH), maxH);
    // .rg-route__intro-copy (flex:1) en .rg-route__hint (margin-top:auto)
    // verdelen de vrije ruimte niet voorspelbaar 1-op-1 -- converge daarom
    // met een paar correctiestappen i.p.v. één blinde berekening.
    for (var i = 0; i < 5; i++) {
      intro.style.minHeight = poging + 'px';
      var fout = (window.innerHeight - 80) - hint.getBoundingClientRect().bottom;
      if (Math.abs(fout) < 1) break;
      poging = Math.min(Math.max(poging + fout, minH), maxH);
    }
    var nieuwe = intro.style.minHeight;
    if (nieuwe !== vorige) window.dispatchEvent(new Event('resize'));
  }
  fit();
  if (window.ResizeObserver) {
    new ResizeObserver(fit).observe(hint);
  } else {
    setTimeout(fit, 400); // fallback zonder ResizeObserver-support
  }
  window.addEventListener('resize', fit);
  window.addEventListener('pageshow', function (e) { if (e.persisted) fit(); });

  /* Kop/eyebrow/vraag blijven onzichtbaar (CSS: .rg-route__intro-copy) tot
     webfonts geladen zijn: renderen ze eerst in de fallback-serif/sans, dan
     wijkt de tekst-/regelhoogte af van de uiteindelijke Playfair/Montserrat-
     metriek, en verspringt zowel de tekst zelf als (via ResizeObserver
     hierboven) de fit() -- exact het soort sprong die dit bestand net
     probeert te voorkomen. Eén laatste fit()-pas vlak vóór het onthullen
     vangt die eventuele verschuiving af terwijl alles nog onzichtbaar is.
     Vangnet-timeout: nooit permanent onzichtbaar laten hangen als fonts.
     ready om wat voor reden dan ook niet resolvet.
     .rg-route__hint zit BEWUST niet in deze gate (CSS-comment legt uit
     waarom): die botst met zijn eigen GSAP-scroll-fade (sectie 1.6) als
     GSAP eerder laadt dan fonts.ready hier resolvet. fit()'s eigen
     ResizeObserver + de laatste fit()-pas hieronder houden 'm hoe dan ook al
     goed gepositioneerd. */
  var onthuld = false;
  function toonHero() {
    if (onthuld) return;
    onthuld = true;
    fit();
    root.classList.add('is-hero-klaar');
  }
  rgOnthulNaFonts(toonHero);
})();

/* =====================================================================
   WINKELMAND/CHECKOUT — prijsdetail-tabel inklapbaar
   ---------------------------------------------------------------------
   De regel-tabel (basisproduct + aantal/prijs/totaal) in de offcanvas-
   cart en de checkout-cart-recap stond altijd volledig open -- vrij
   dicht voor een quick-glance winkelmandje, terwijl .line-item-total-
   price-value er al een kort regeltotaal boven toont. Nu standaard dicht
   met een "Toon prijsdetails"-linkje. Draait op beide plekken (zelfde
   .line-item-markup). MutationObserver omdat Shopware de offcanvas-
   inhoud + de checkout-aside bij hoeveelheid-wijzigingen via AJAX
   herrendert -- nieuwe tabellen moeten dan opnieuw hun toggle krijgen.
   ===================================================================== */
(function () {
  function setupToggle(wrap) {
    if (wrap.dataset.rgToggled || !wrap.querySelector('table.custom-configurator-table')) return;
    wrap.dataset.rgToggled = '1';
    wrap.classList.add('rg-price-detail', 'rg-price-detail--collapsed');
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'rg-price-detail-toggle';
    btn.textContent = 'Toon prijsdetails';
    btn.addEventListener('click', function () {
      var collapsed = wrap.classList.toggle('rg-price-detail--collapsed');
      btn.textContent = collapsed ? 'Toon prijsdetails' : 'Verberg prijsdetails';
    });
    wrap.parentNode.insertBefore(btn, wrap);
  }
  /* INP-fix (28 aug): draaide voorheen bij ELKE DOM-mutatie in document.body
     een document-brede querySelectorAll, voor de volledige levensduur van
     ELKE pagina (nooit disconnect -- moet wel blijven leven voor latere
     AJAX-hoeveelheidswijzigingen). Nu: alleen de daadwerkelijk toegevoegde
     nodes per mutatie scannen, zelfde patroon als de productslider-observer
     hierboven (2.0). */
  function scanNode(root) {
    if (root.nodeType !== 1) return;
    if (root.matches && root.matches('.line-item-details-characteristics')) setupToggle(root);
    if (root.querySelectorAll) {
      root.querySelectorAll('.line-item-details-characteristics').forEach(setupToggle);
    }
  }
  document.addEventListener('DOMContentLoaded', function () { scanNode(document.body); });
  if (window.MutationObserver) {
    new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        m.addedNodes.forEach(scanNode);
      });
    }).observe(document.body, { childList: true, subtree: true });
  }
})();
