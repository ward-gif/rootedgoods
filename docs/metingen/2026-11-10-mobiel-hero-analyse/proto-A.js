/* Prototype A, 10 november 2026: wat de band-JS (stap 8b) op mobiel zou
   moeten doen in plaats van de hele strook onder de band zetten. Draait in
   de replica na load; de band-JS heeft de strook dan al verplaatst. In het
   echt hoort dit in stap 8b zelf, vóór het verplaatsen. Werkt op het blok
   zoals het nu geplakt is (drie feit-spans, twee punt-spans). */
(function () {
  if (!window.matchMedia || !window.matchMedia('(max-width: 991px)').matches) return;
  var hero = document.querySelector('.rg-page-hero--band');
  var strook = document.querySelector('.rg-page-hero__strook');
  var title = hero && hero.querySelector('.rg-page-hero__title');
  if (!hero || !strook || !title) return;
  var feiten = strook.querySelectorAll('.rg-page-hero__strook-feit');
  var punten = strook.querySelectorAll('.rg-page-hero__strook-punt');
  if (feiten.length < 3) return;
  var p = document.createElement('p');
  p.className = 'rg-page-hero__feiten';
  p.appendChild(feiten[0]);
  p.appendChild(document.createTextNode(' '));
  if (punten[0]) p.appendChild(punten[0]);
  p.appendChild(document.createTextNode(' '));
  p.appendChild(feiten[1]);
  title.insertAdjacentElement('afterend', p);
  if (punten[1]) punten[1].remove();
  strook.classList.add('rg-page-hero__strook--onder');
})();
