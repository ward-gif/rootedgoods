// SEARCH OVERLAY - donkere overlay achter zoekbalk bij focus
// Overlay verdwijnt bij klik erop of als zoekbalk focus verliest
window.addEventListener('load', function() {
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
  });
})();

// CATEGORY FLYOUT - voegt "Bekijk alle producten" button toe
// als aparte rij onder de categorie items
window.addEventListener('load', function() {
  var flyoutContent = document.querySelector('.navigation-flyout-content');

  if (flyoutContent) {
    // Maak een volledige rij aan onder de categorieën
    var col = document.createElement('div');
    col.className = 'col-12 d-flex align-items-center justify-content-start';
    col.style.paddingTop = '1rem';
    col.style.paddingBottom = '0.5rem';

    // Voeg de button in met link naar alle producten
    col.innerHTML = '<a href="/search?search=" class="btn btn-primary" style="height: 75px; padding: 0 1.5rem; font-size: 0.875rem; font-weight: 500; color: #fff; border-radius: 40px; display: inline-flex; align-items: center; line-height: 1;">Bekijk alle producten</a>';

    // Voeg de kolom toe aan het einde van de flyout grid
    flyoutContent.appendChild(col);
  }
});
