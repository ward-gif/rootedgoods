/* Stap 8b van de band-IIFE in rootedgoods.js, zoals voorgesteld op
   10 november 2026 (docs/hero-mobiel-verbeterplan-2026-11-10.md). Vervangt het
   huidige blok "8b. De feitenstrook" volledig. In de replica draait dit NA
   load, dus nadat de bestaande stap 8b de strook al onder de slider heeft
   gezet; de uitkomst is dezelfde. In rootedgoods.js bestaan `marker`,
   `slider` en de variabele `meer` (stap 8) al; hier worden ze opgezocht. */
(function () {
  var marker = document.querySelector('.rg-page-hero--band');
  var slider = document.querySelector('.rg-band');
  if (!marker || !slider) return;

  /* 8b. De feitenstrook. Staat verborgen in het heroblok (.rg-page-hero__strook,
     met `hidden`) zodat de copy in HTML blijft. Vanaf 992 px gaat hij in
     zijn geheel onder de band, boven de link van stap 8, zoals sinds
     5 november. Onder 992 px (89,6% van het verkeer) gaan de twee getallen
     naar de hero, als één regel direct onder de kop, en blijft alleen het
     derde feit onder de band: op een telefoon staat de band bij een eerste
     bezoek achter de cookiebalk, en dan is dit de enige plek waar de prijs
     en de afname in beeld zijn (gemeten 10 november, 375 x 667 en 390 x 844).
     De klantlogo's gaan op diezelfde breedtes van de hero naar onder de
     link: 54 px minder hero, en de band begint daardoor boven de balk.
     Eén keer bij het laden, geen herberekening bij draaien van het scherm:
     een telefoon blijft onder 992 px, en een venster dat over die grens
     wordt gesleept is op deze pagina geen gebruikssituatie. */
  var strook = document.querySelector('.rg-page-hero__strook');  /* document, niet marker: in de replica staat hij al onder de slider */
  var smal = !!(window.matchMedia && window.matchMedia('(max-width: 991px)').matches);
  if (strook) {
    var feiten = strook.querySelectorAll('.rg-page-hero__strook-feit');
    var punten = strook.querySelectorAll('.rg-page-hero__strook-punt');
    var titel = marker.querySelector('.rg-page-hero__title');
    if (smal && feiten.length >= 3 && titel) {
      var cijfers = document.createElement('p');
      cijfers.className = 'rg-page-hero__cijfers';
      cijfers.appendChild(feiten[0]);
      cijfers.appendChild(document.createTextNode(' '));
      if (punten[0]) cijfers.appendChild(punten[0]);
      cijfers.appendChild(document.createTextNode(' '));
      cijfers.appendChild(feiten[1]);
      titel.insertAdjacentElement('afterend', cijfers);
      if (punten[1]) punten[1].remove();
      strook.classList.add('rg-page-hero__strook--onder');
    }
    slider.insertAdjacentElement('afterend', strook);
    strook.removeAttribute('hidden');
  }
  if (smal) {
    var logos = marker.querySelector('.rg-page-hero__logos');
    var meer = document.querySelector('.rg-band__meer');
    if (logos && meer) {
      meer.insertAdjacentElement('afterend', logos);
      logos.classList.add('rg-page-hero__logos--onder');
    }
  }
})();
