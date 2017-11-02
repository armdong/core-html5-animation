(function(window, document, undefined) {

  document.addEventListener('DOMContentLoaded', handle4DomReady, false);

  function handle4DomReady(e) {

    /*--------------------------------*\
      DOM elements and Variables
    \*--------------------------------*/

    let canvas = document.querySelector('#canvas'),
      context = canvas.getContext('2d'),
      sunglassButton = document.querySelector('#sunglassButton'),
      image = new Image(),
      sunglassOn = false,
      sunglassFilter = new Worker('../assets/js/ch04/16.sunglassFilter.js');


    /*--------------------------------*\
      Functions
    \*--------------------------------*/

    function putSunglassesOn() {
      sunglassFilter.postMessage(
        context.getImageData(0, 0, canvas.width, canvas.height));

      sunglassFilter.onmessage = function(event) {
        context.putImageData(event.data, 0, 0);
      };
    }

    function drawOriginalImage() {
      context.drawImage(image,
        0, 0, image.width, image.height,
        0, 0, canvas.width, canvas.height);
    }


    /*--------------------------------*\
      Event listeners
    \*--------------------------------*/

    sunglassButton.addEventListener('click', handle4SunglassToggle, false);
    image.addEventListener('load', drawOriginalImage, false);


    /*--------------------------------*\
      Event handlers
    \*--------------------------------*/

    function handle4SunglassToggle(e) {
      sunglassOn && drawOriginalImage();
      sunglassOn || putSunglassesOn();
      sunglassButton.value = sunglassOn ? 'Sunglasses' : 'Original image';
      sunglassOn = !sunglassOn;
    }


    /*--------------------------------*\
      Initialization
    \*--------------------------------*/

    image.src = '../assets/imgs/curved-road.png';
  }

})(window, document);