/* =====================================================================
 * rootedgoods.js — custom frontend JS voor Rooted Goods (rootedgoods.eu)
 * Geladen via Promidata theme naast hun eigen scripts.
 * Last updated: 2026-07-02
 *
 * STRUCTUUR:
 *   SECTIE 1 — GLOBAL          : search overlay, sticky header, flyout CTA, offerte link
 *   SECTIE 2 — HOMEPAGE        : logo slider, productslider tegel-click, hero-v2 hoogte-fit
 *   SECTIE 3 — PDP             : productnaam verplaatsen, accordion default, staffel-tabel, zoom button
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
 * DOMContentLoaded: werkt zonder afbeeldingen geladen, draait eerder. */
document.addEventListener('DOMContentLoaded', function () {
  var searchInput = document.querySelector('.header-search-input');
  var overlay = document.getElementById('searchOverlay');
  if (!searchInput || !overlay) return;

  searchInput.addEventListener('focus', function () {
    overlay.classList.add('active');
  });

  // 150ms timeout: klik op zoekknop heeft tijd om te firen voordat overlay weg is.
  searchInput.addEventListener('blur', function () {
    setTimeout(function () { overlay.classList.remove('active'); }, 150);
  });

  overlay.addEventListener('click', function () {
    overlay.classList.remove('active');
    searchInput.blur();
  });
});


/* ---- 1.2 Sticky header
 * Verbergt header bij scroll naar beneden, toont bij scroll naar boven.
 * passive: true voorkomt dat scroll-performance gehinderd wordt. */
(function () {
  var lastScroll = 0;
  var threshold = 150;
  var header = document.querySelector('.header-main');
  var nav = document.querySelector('.nav-main');
  if (!header || !nav) return;

  window.addEventListener('scroll', function () {
    var current = window.scrollY;

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

    lastScroll = current;
  }, { passive: true });
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


/* ---- 1.4 Offerte link in nav-main
 * Tekstuele CTA naast de hoofdnavigatie, alleen op desktop (>= 992px). */
document.addEventListener('DOMContentLoaded', function () {
  var nav = document.querySelector('.nav-main .main-navigation-menu');
  if (!nav || window.innerWidth < 992) return;

  var link = document.createElement('a');
  link.href = '/offerte';   // relatief -> werkt op dev én live
  link.className = 'nav-link main-navigation-link offerte-link';
  link.title = 'Offerte aanvragen';
  link.innerHTML = '<div class="main-navigation-link-text"><span class="offerte-separator">|</span><span>Offerte aanvragen</span></div>';
  nav.appendChild(link);
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
    if (!el || el.dataset.rgLoopPatched) return;
    var raw = el.getAttribute('data-product-slider-options');
    if (!raw) return;
    var opts;
    try { opts = JSON.parse(raw); } catch (e) { return; }
    opts.slider = opts.slider || {};
    opts.slider.loop = false;       // geen clones meer
    opts.slider.rewind = false;     // niet terugspringen naar begin
    opts.slider.mouseDrag = true;   // block-instelling had 'm uit

    /* 4 tegels op laptop én desktop. De plugin bepaalt het aantal via
       items = floor(sliderbreedte / (productboxMinWidth + gutter)). Met de
       standaard 300+30=330px paste er op laptop (~1200-1270px slider) maar 3.
       Verlaagd naar 250+30=280px: laptop floor(~1230/280)=4, en desktop
       (geboxed op max ~1360px, nooit breder) floor(1360/280)=4 -> nooit 5.
       Schaalt daaronder netjes terug naar 3/2/1. */
    opts.productboxMinWidth = '250px';

    el.setAttribute('data-product-slider-options', JSON.stringify(opts));
    el.dataset.rgLoopPatched = '1';
  }

  function scan() {
    document
      .querySelectorAll('.home-productslider [data-product-slider-options]')
      .forEach(patchOptions);
  }

  // 1. Direct proberen (als het element al geparsed is).
  scan();

  // 2. En opvangen zodra het verschijnt, vóór de plugin het leest.
  if (window.MutationObserver) {
    var obs = new MutationObserver(scan);
    obs.observe(document.documentElement, { childList: true, subtree: true });
    // Na load is de plugin geïnit; observer mag stoppen.
    window.addEventListener('load', function () { obs.disconnect(); });
  }
})();


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
  var track = document.createElement('div');
  track.style.cssText = 'display:flex; align-items:center; width:max-content; animation:logoScroll 50s linear infinite;';

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
  var wrapper = document.createElement('div');
  wrapper.style.cssText = 'overflow:hidden; width:100%; padding: clamp(2rem,4vh,3.5rem) 0 clamp(1rem,2vh,1.25rem); opacity:0; transition:opacity .35s ease;';
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
      if (window.innerWidth < 993) { hero.style.minHeight = ''; return; }
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


/* ---- 2.1b Topbar USP-marquee (mobiel)
 * Bouwt uit de 4 .top-bar-container USP's één scroll-track met een dubbele
 * set (naadloze -50%-loop, zie .rg-usp-marquee in de CSS). Op mobiel (<992px)
 * verbergt de CSS de statische containers en toont/animate de track; op
 * desktop blijft de track verborgen en gebruiken we de statische rij.
 * Idempotent + defensief: niets crasht als de topbar/USP's ontbreken. */
document.addEventListener('DOMContentLoaded', function () {
  var ext = document.querySelector('.top-bar-nav .top-bar-nav-extension');
  if (!ext || document.querySelector('.rg-usp-marquee')) return;

  // USP-inhoud uit container--1..4 (container--5 = utility-links, overslaan).
  var usps = [];
  ext.querySelectorAll('.top-bar-container').forEach(function (c) {
    if (c.classList.contains('container--5')) return;
    var html = c.innerHTML.trim();
    if (html) usps.push(html);
  });
  if (!usps.length) return;

  var track = document.createElement('div');
  track.className = 'rg-usp-marquee';
  track.setAttribute('aria-hidden', 'true');   // duplicaat van de statische rij -> uit de a11y-boom
  // 2 kopieën: bij -50% valt kopie 2 exact op de startpositie van kopie 1.
  usps.concat(usps).forEach(function (h) {
    var span = document.createElement('span');
    span.className = 'rg-usp-marquee__item';
    span.innerHTML = h;
    track.appendChild(span);
  });
  ext.parentNode.appendChild(track);   // in .top-bar-nav, naast de extension
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
      if (!row.dataset.rowClickBound) {
        row.dataset.rowClickBound = 'true';
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
  window.addEventListener('load', function () {
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
})();


/* ============================================================
   1.6 OVER ONS — "De Route van Rooted" (route + scroll-regie)
   ------------------------------------------------------------
   Doet niets buiten /over-ons: alles hangt aan .rg-route. GSAP +
   ScrollTrigger + Lenis worden pas geladen als die sectie bestaat.

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
  var teller = root.querySelector('.rg-route__meter-num');
  if (!track || !svg || !base || !draw) return;

  /* ---------- kleine deterministische generator (vaste seed) ---------- */
  function rng(seed) {
    return function () {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
  }

  /* ---------- de route opbouwen ---------- */
  var markers = [];      /* y-posities van de stops, voor de km-teller */
  var routeStart = { x: 0, y: 0 }, routeEind = 0;

  function bouwRoute() {
    /* origin = de SVG-box (schermbreed), niet de track: alleen zo is er naast
       de contentkolom ruimte om tekst te ontwijken */
    var tr = svg.getBoundingClientRect();
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
    var startY = Math.min(eersteY - 140, Math.max(introOnder + 60, window.innerHeight * 0.72));
    /* centreren op de contentkolom, niet op de schermbrede SVG: dat is wat
       het oog als midden leest */
    var trackC = track.getBoundingClientRect();
    var startX = trackC.left + trackC.width / 2 - tr.left;
    spine.push({ x: startX, y: Math.max(0, startY), marker: false });

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

    markers = vol.filter(function (p) { return p.marker; }).map(function (p) { return p.y; });

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
    var ruisBreed = maakRuis(8814, yVan, yTot, 260, 620, 0.30);   /* grote zwenken */
    var ruisMid   = maakRuis(2277, yVan, yTot, 110, 260, 0.22);   /* tussenbochten */
    var ruisFijn  = maakRuis(9051, yVan, yTot,  38,  95, 0.18);   /* lichte oneffenheid */

    function offset(yy) {
      /* aan het begin naar 0: de route start exact in het midden */
      var inloop = Math.min(1, Math.max(0, (yy - yVan) / 300));
      inloop = inloop * inloop * (3 - 2 * inloop);
      return (ruisBreed(yy) * 230 + ruisMid(yy) * 78 + ruisFijn(yy) * 16) * inloop;
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

    /* de hint hoort pal boven het startpunt van de route te staan */
    var hintEl = root.querySelector('.rg-route__hint');
    if (hintEl) {
      var trackR = track.getBoundingClientRect();
      hintEl.style.position = 'absolute';
      hintEl.style.left = (routeStart.x + tr.left - trackR.left) + 'px';
      /* routeStart is in sectiecoordinaten, de hint staat in de track:
         het hoogteverschil tussen beide moet eraf */
      hintEl.style.top = (routeStart.y + (tr.top - trackR.top) - hintEl.offsetHeight - 18) + 'px';
      hintEl.style.transform = 'translateX(-50%)';
      hintEl.style.margin = '0';
    }

    svg.setAttribute('viewBox', '0 0 ' + breedte + ' ' + hoogte);
    svg.setAttribute('width', breedte);
    svg.setAttribute('height', hoogte);

    var d2 = padVan(pts);
    base.setAttribute('d', d2);
    draw.setAttribute('d', d2);

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

    /* Mask: achter tekstblokken zakt de lijn naar 30%. De vorm verandert niet,
       alleen de zichtbaarheid. */
    var defs = svg.querySelector('defs') || svg.insertBefore(
      document.createElementNS('http://www.w3.org/2000/svg', 'defs'), svg.firstChild);
    defs.innerHTML = '';
    var NS = 'http://www.w3.org/2000/svg';
    var mask = document.createElementNS(NS, 'mask');
    mask.setAttribute('id', 'rg-route-mask');
    mask.setAttribute('maskUnits', 'userSpaceOnUse');
    var vlak = document.createElementNS(NS, 'rect');
    vlak.setAttribute('width', breedte); vlak.setAttribute('height', hoogte);
    vlak.setAttribute('fill', '#fff');
    mask.appendChild(vlak);
    [].slice.call(root.querySelectorAll(
      '.rg-route__body, .rg-route__panel, .rg-route__team-copy, .rg-route__roots'
    )).forEach(function (el) {
      var b = el.getBoundingClientRect();
      var re = document.createElementNS(NS, 'rect');
      re.setAttribute('x', b.left - tr.left - 6);
      re.setAttribute('y', b.top - tr.top - 6);
      re.setAttribute('width', b.width + 12);
      re.setAttribute('height', b.height + 12);
      re.setAttribute('fill', '#4d4d4d');   /* ~30% */
      mask.appendChild(re);
    });
    defs.appendChild(mask);
    base.setAttribute('mask', 'url(#rg-route-mask)');
    draw.setAttribute('mask', 'url(#rg-route-mask)');

    /* meetlat: padlengte mag hooguit 1,2x de verticale afstand zijn */
    var vert = pts[pts.length - 1].y - pts[0].y;
    var padL = draw.getTotalLength();
    console.log('[rg-route] padlengte ' + Math.round(padL) + 'px / verticaal ' +
                Math.round(vert) + 'px = ' + (padL / vert).toFixed(2) + 'x' +
                (padL / vert > 1.2 ? '  TE HOOG' : ''));
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
  window.addEventListener('resize', function () { bouwRoute(); });

  /* ---------- animatie ---------- */
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('requestAnimationFrame' in window)) return;

  var CDN = 'https://cdn.jsdelivr.net/';
  [CDN + 'npm/gsap@3.13.0/dist/gsap.min.js',
   CDN + 'npm/gsap@3.13.0/dist/ScrollTrigger.min.js',
   CDN + 'npm/lenis@1.1.18/dist/lenis.min.js']
    .reduce(function (p, src) {
      return p.then(function () {
        return new Promise(function (ok, fout) {
          var sc = document.createElement('script');
          sc.src = src; sc.async = false; sc.onload = ok; sc.onerror = fout;
          document.head.appendChild(sc);
        });
      });
    }, Promise.resolve()).then(start).catch(function () {});

  function start() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    if (!gsap || !ST) return;
    gsap.registerPlugin(ST);

    if (window.Lenis) {
      var lenis = new window.Lenis({ duration: 1.05, smoothWheel: true });
      lenis.on('scroll', ST.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    /* km-ijkpunten: de reis begint bij Porto (marker 0) */
    var KM = [0, 1150, 1500, 2100];

    var L = draw.getTotalLength();
    gsap.set(draw, { strokeDasharray: L, strokeDashoffset: L });

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
      onUpdate: function (self) {
        var p = self.progress;
        gsap.set(draw, { strokeDashoffset: L * (1 - p) });
        zetMerkteken(p);
        zetKm(p);
      },
      onRefresh: function () {
        L = draw.getTotalLength();
        gsap.set(draw, { strokeDasharray: L });
      }
    });

    function zetMerkteken(p) {
      if (!mark) return;
      var afstand = L * Math.min(1, p + 12 / Math.max(1, L));
      var punt = draw.getPointAtLength(afstand);
      /* de lijn-SVG is schermbreed, het merkteken staat in de track: het
         verschil tussen beide linkerranden moet erbij, anders zit hij ernaast */
      var verschil = svg.getBoundingClientRect().left - root.getBoundingClientRect().left;
      gsap.set(mark, {
        x: punt.x + verschil, y: punt.y, xPercent: -50, yPercent: -50,
        /* rotatie vanaf het startpunt, zodat het merkteken bovenaan
           kaarsrecht staat en pas gaat rollen als de reis begint */
        rotation: Math.max(0, afstand - 12) * 0.9
      });
    }
    if (mark) gsap.set(mark, { top: 0, left: 0 });
    zetMerkteken(0);

    /* km volgt de y-positie van het merkteken t.o.v. de markers */
    function zetKm(p) {
      if (!teller || !markers.length) return;
      var y = draw.getPointAtLength(L * p).y, km = 0;
      if (y >= markers[markers.length - 1]) km = KM[KM.length - 1];
      else for (var i = 0; i < markers.length - 1; i++) {
        if (y >= markers[i] && y < markers[i + 1]) {
          var t = (y - markers[i]) / Math.max(1, markers[i + 1] - markers[i]);
          km = KM[i] + (KM[i + 1] - KM[i]) * t;
          break;
        }
      }
      teller.textContent = Math.round(km).toLocaleString('nl-NL');
    }

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
           '.rg-route__team-copy > p, .rg-route__contact, .rg-route__logo',
           { y: 40, scale: .97, duur: .8, stagger: .07 });

    onthul('.rg-route__shot, .rg-route__collage-shot, .rg-route__collage-main',
           { y: 34, scale: .86, duur: .9, stagger: .06 });

    /* sfeerbeelden bewegen mee, elk met een eigen snelheid */
    gsap.utils.toArray('.rg-route__shot, .rg-route__collage-shot').forEach(function (shot, i) {
      gsap.to(shot, { yPercent: -16 - (i % 3) * 9, ease: 'none',
        scrollTrigger: { trigger: shot, start: 'top bottom', end: 'bottom top', scrub: 0.5 } });
    });
    var hoofdfoto = root.querySelector('.rg-route__collage-main');
    if (hoofdfoto) gsap.to(hoofdfoto, { yPercent: -7, ease: 'none',
      scrollTrigger: { trigger: hoofdfoto, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });

    var hint = root.querySelector('.rg-route__hint');
    if (hint) gsap.to(hint, { opacity: 0, y: -10, ease: 'none',
      scrollTrigger: { trigger: hint, start: 'top 28%', end: 'top 2%', scrub: true } });

    ST.addEventListener('refresh', function () { bouwRoute(); });
    ST.refresh();

    /* Beelden veranderen de paginahoogte. Zonder deze herberekening staan de
       triggers op de (kortere) beginlayout en zijn ze al afgevuurd voordat je
       scrolt: dan is bij het landen al tekst en beeld zichtbaar. */
    function herbereken() {
      bouwRoute();
      /* het pad is nieuw: lengte opnieuw meten en merkteken terugzetten op de
         huidige voortgang, anders blijft het op zijn oude plek hangen */
      L = draw.getTotalLength();
      gsap.set(draw, { strokeDasharray: L });
      ST.refresh();
      var t = ST.getAll().find(function (x) { return x.vars && x.vars.scrub; });
      var p = t ? t.progress : 0;
      gsap.set(draw, { strokeDashoffset: L * (1 - p) });
      zetMerkteken(p);
      zetKm(p);
    }
    if (document.readyState === 'complete') herbereken();
    else window.addEventListener('load', herbereken);
    var beelden = root.querySelectorAll('img');
    var klaar = 0;
    beelden.forEach(function (im) {
      if (im.complete) { klaar++; return; }
      im.addEventListener('load', function () { if (++klaar === beelden.length) herbereken(); }, { once: true });
      im.addEventListener('error', function () { if (++klaar === beelden.length) herbereken(); }, { once: true });
    });
  }
})();
