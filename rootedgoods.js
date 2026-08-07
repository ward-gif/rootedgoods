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
