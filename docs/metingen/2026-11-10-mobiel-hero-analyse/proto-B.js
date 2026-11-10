/* Prototype B: A plus logo's onder de band, na de link "Alle kerstpakketten". */
(function () {
  if (!window.matchMedia || !window.matchMedia('(max-width: 991px)').matches) return;
  var hero = document.querySelector('.rg-page-hero--band');
  var meer = document.querySelector('.rg-band__meer');
  var logos = hero && hero.querySelector('.rg-page-hero__logos');
  if (!meer || !logos) return;
  meer.insertAdjacentElement('afterend', logos);
  logos.classList.add('rg-page-hero__logos--onder');
})();
