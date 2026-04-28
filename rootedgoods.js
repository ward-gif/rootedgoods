// rootedgoods.js — laatste update: cache-bust voor logo slider bg fix (28-04-2026)
// SEARCH OVERLAY - donkere overlay achter zoekbalk bij focus
// Overlay verdwijnt bij klik erop of als zoekbalk focus verliest
// DOMContentLoaded i.p.v. load — werkt zonder afbeeldingen, draait eerder
document.addEventListener('DOMContentLoaded', function() {
  var searchInput = document.querySelector('.header-search-input');
  var overlay = document.getElementById('searchOverlay');

  if (searchInput && overlay) {

    // Overlay tonen als zoekbalk focus krijgt
    searchInput.addEventListener('focus', function() {
      overlay.classList.add('active');
    });

    // Overlay verbergen als zoekbalk focus verliest
    // setTimeout van 150ms zodat klikken op zoekknop nog werkt
    searchInput.addEventListener('blur', function() {
      setTimeout(function() {
        overlay.classList.remove('active');
      }, 150);
    });

    // Overlay verbergen bij klik op de overlay zelf
    overlay.addEventListener('click', function() {
      overlay.classList.remove('active');
      searchInput.blur();
    });
  }
});

// STICKY HEADER - verbergt bij scroll naar beneden, verschijnt bij scroll naar boven
// Threshold: header verdwijnt pas na 150px scroll
(function() {
  var lastScroll = 0;
  var threshold = 150;
  var header = document.querySelector('.header-main');
  var nav = document.querySelector('.nav-main');

  // passive: true — browser weet dat we preventDefault() niet gebruiken,
  // blokkeert scroll-performance niet (vooral merkbaar op mobiel)
  window.addEventListener('scroll', function() {
    var current = window.scrollY;

    if (current < threshold) {
      header.classList.remove('header-hidden');
      nav.classList.remove('header-hidden');
      return;
    }

    if (current > lastScroll) {
      // Scroll naar beneden — verberg header
      header.classList.add('header-hidden');
      nav.classList.add('header-hidden');
    } else {
      // Scroll naar boven — toon header
      header.classList.remove('header-hidden');
      nav.classList.remove('header-hidden');
    }

    lastScroll = current;
  }, { passive: true });
})();

// CATEGORY FLYOUT - voegt "Bekijk alle producten" button toe als laatste cel
// rechts in de rij. Berekent dynamisch hoeveel lege spacers nodig zijn om
// de button in de meest rechter kolom te plaatsen.
document.addEventListener('DOMContentLoaded', function() {
  var flyoutContent = document.querySelector('.navigation-flyout-content');

  if (flyoutContent) {
    var itemsPerRow = 4;
    var existingCount = flyoutContent.children.length;
    // Aantal lege cellen nodig om button op rechterkolom (index itemsPerRow-1) te krijgen
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
  }
});

// LOGO SLIDER - continue scroll animatie vervangt Shopware carousel
// Blijft op 'load' — heeft img.src nodig van de originele carousel,
// die moet eerst volledig geladen zijn voor betrouwbare src-copy
window.addEventListener('load', function() {
  var carousel = document.querySelector('.logo-slider .cms-element-custom-cms-slider');
  if (!carousel) return;

  // Verzamel unieke logo afbeeldingen uit eerste carousel-item
  var images = [];
  var seen = [];
  var firstItem = carousel.querySelector('.carousel-item');
  if (!firstItem) return;

  firstItem.querySelectorAll('.card-img img').forEach(function(img) {
    if (!seen.includes(img.src)) {
      seen.push(img.src);
      images.push({ src: img.src, alt: img.alt });
    }
  });

  // Bouw continue scroll track — dupliceer voor naadloze loop
  var track = document.createElement('div');
  track.style.cssText = 'display:flex; align-items:center; width:max-content; animation:logoScroll 25s linear infinite;';

  [images, images].forEach(function(set) {
    set.forEach(function(img) {
      var div = document.createElement('div');
      div.style.cssText = 'padding: 0 3rem; flex-shrink:0;';
      div.innerHTML = '<img src="' + img.src + '" alt="' + img.alt + '" style="height:50px; opacity:0.6; filter:grayscale(100%); transition:all 0.3s;">';
      div.querySelector('img').addEventListener('mouseover', function() {
        this.style.opacity = '1';
        this.style.filter = 'grayscale(0%)';
      });
      div.querySelector('img').addEventListener('mouseout', function() {
        this.style.opacity = '0.6';
        this.style.filter = 'grayscale(100%)';
      });
      track.appendChild(div);
    });
  });

  // Wrapper met overflow hidden voor clean edges
  var wrapper = document.createElement('div');
  // Wrapper transparent: parent (.cms-section / .cms-block) bg schijnt door.
  // Achtergrondkleur staat via Shopware admin op de section ingesteld.
  wrapper.style.cssText = 'overflow:hidden; width:100%; padding: 2rem 0;';
  wrapper.appendChild(track);

  // Voeg keyframe animatie toe aan head
  var style = document.createElement('style');
  style.textContent = '@keyframes logoScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }';
  document.head.appendChild(style);

  // Verberg origineel carousel en voeg nieuwe slider in
  carousel.style.display = 'none';
  carousel.parentNode.insertBefore(wrapper, carousel);
});

// OFFERTE LINK IN NAV-MAIN - tekstuele CTA naast navigatielinks
// In bruine accent-kleur met pipe separator ervoor. Alleen desktop.
document.addEventListener('DOMContentLoaded', function() {
  var nav = document.querySelector('.nav-main .main-navigation-menu');
  if (nav && window.innerWidth >= 992) {
    var link = document.createElement('a');
    link.href = '/offerte';
    link.className = 'nav-link main-navigation-link offerte-link';
    link.title = 'Offerte op maat';
    link.innerHTML = '<div class="main-navigation-link-text"><span class="offerte-separator">|</span><span>Offerte op maat</span></div>';
    nav.appendChild(link);
  }
});
// PRODUCT SLIDER - hele tegel klikbaar, alleen bij echte klik (niet bij swipe)
// DOMContentLoaded — product-tegels staan in DOM zonder images
document.addEventListener('DOMContentLoaded', function() {
  var sliderItems = document.querySelectorAll('.home-productslider .product-slider-item');
  sliderItems.forEach(function(item) {
    var link = item.querySelector('.product-image-link');
    if (link) {
      var href = link.getAttribute('href');
      item.style.cursor = 'pointer';

      var startX = 0;
      var startY = 0;

      item.addEventListener('mousedown', function(e) {
        startX = e.clientX;
        startY = e.clientY;
      });

      item.addEventListener('click', function(e) {
        var deltaX = Math.abs(e.clientX - startX);
        var deltaY = Math.abs(e.clientY - startY);
        if (deltaX > 5 || deltaY > 5) return;
        if (e.target.closest('.product-wishlist')) return;
        if (e.target.closest('.variant-thumbnail')) return;
        window.location.href = href;
      });
    }
  });
});
