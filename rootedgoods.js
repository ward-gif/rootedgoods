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

// LOGO SLIDER - continue scroll animatie vervangt Shopware carousel
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
  wrapper.style.cssText = 'overflow:hidden; width:100%; padding: 2rem 0; background-color:#fbf7f5;';
  wrapper.appendChild(track);

  // Voeg keyframe animatie toe aan head
  var style = document.createElement('style');
  style.textContent = '@keyframes logoScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }';
  document.head.appendChild(style);

  // Verberg origineel carousel en voeg nieuwe slider in
  carousel.style.display = 'none';
  carousel.parentNode.insertBefore(wrapper, carousel);
});
