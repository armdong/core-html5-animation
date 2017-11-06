(function(window, document, undefined) {

  document.addEventListener('DOMContentLoaded', handle4DomReady, false);

  function handle4DomReady(e) {

    /*--------------------------------*\
      DOM elements and Variables
    \*--------------------------------*/

    let canvas = document.querySelector('#canvas'),
      context = canvas.getContext('2d'),
      fadeButton = document.querySelector('#fadeButton'),
      originalImageData,
      image = new Image(),
      interval = null;


    /*--------------------------------*\
      Functions
    \*--------------------------------*/

    function increaseTransparency(imageData, steps) {
      let alpha, currentAlpha, step, length = imageData.data.length;

      for (let i = 3; i < length; i += 4) { // For every alpha componet
        alpha =  originalImageData.data[i];

        if (alpha > 0 && imageData.data[i] > 0) { // Not totally transparent yet
          currentAlpha = imageData.data[i];
          step = Math.ceil(alpha / steps);

          if (currentAlpha - step > 0) {  // Not too close to the end
            imageData.data[i] -= step;    // Increase transparent
          } else {
            imageData.data[i] = 0;        // End: totally transparent
          }
        }
      }
    }

    function fadeOut(context, imageData, x, y, steps, millisecondsPerStep) {
      let frame = 0,
        length = imageData.data.length;

      interval = setInterval(function() {         // Once every millisecondsPerStep ms
        frame++;

        if (frame > steps) {        // Animation is over
          clearInterval(interval);  // End animation
          animationComplete();      // put picture back in 1s
        } else {
          increaseTransparency(imageData, steps);
          context.putImageData(imageData, x, y);
        }
      }, millisecondsPerStep);
    }

    function animationComplete() {
      setTimeout(function() {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
      }, 1000);
    }



    /*--------------------------------*\
      Event listeners
    \*--------------------------------*/

    fadeButton.addEventListener('click', handle4FadeOut, false);
    image.addEventListener('load', handle4ImageLoaded, false);



    /*--------------------------------*\
      Event handlers
    \*--------------------------------*/

    function handle4FadeOut(e) {
      fadeOut(context, 
        context.getImageData(0, 0, canvas.width, canvas.height), 
        0, 0, 20, 1000 / 60);
    }

    function handle4ImageLoaded(e) {
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      originalImageData = context.getImageData(0, 0, canvas.width, canvas.height);
    }



    /*--------------------------------*\
      Initialization
    \*--------------------------------*/

    image.src = '../assets/imgs/log-crossing.png';

  }

})(window, document);