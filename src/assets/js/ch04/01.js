(function(window, document, undefined) {

  document.addEventListener('DOMContentLoaded', handle4DomReady, false);

  function handle4DomReady(e) {
    let canvas = document.querySelector('#canvas'),
      context = canvas.getContext('2d'),
      image = new Image();

    image.src = '../assets/imgs/countrypath.jpg';
    image.addEventListener('load', function(e) {
      context.drawImage(image, 0, 0);
    }, false);
  }

})(window, document);