(function(window, document, undefined) {

  document.addEventListener('DOMContentLoaded', handle4DomReady, false);

  function handle4DomReady(e) {

    /*--------------------------------*\
      DOM elements and Variables
    \*--------------------------------*/

    let canvas = document.querySelector('#canvas'),
      context = canvas.getContext('2d'),
      offscreenCanvas = document.createElement('canvas'),
      offscreenContext = offscreenCanvas.getContext('2d'),
      fadeButton = document.querySelector('#fadeButton'),
      imageData,
      imageDataOffscreen,
      image = new Image(),
      interval = null;


    /*--------------------------------*\
      Functions
    \*--------------------------------*/

    function increaseTransparency(imageData, steps) {
      let alpha, currentAlpha, step, length = imageData.data.length;

      for (let i = 3; i < length; i += 4) { // For every alpha componet
        alpha =  imageDataOffscreen.data[i];

        if (alpha > 0) {
          currentAlpha = imageData.data[i];
          step = Math.ceil(alpha / steps);

          if (currentAlpha + step <= alpha) { // Not at original alpha setting yet
            imageData.data[i] += step;        // Increase transparent
          } else {
            imageData.data[i] = alpha;        // End: original transparent
          }
        }
      }
    }

    function fadeIn(context, imageData, steps, millisecondsPerStep) {
      let frame = 0,
        length = imageData.data.length;

      for (let i = 3; i < length; i += 4) { // For every alpha component
        imageData.data[i] = 0;
      }

      interval = setInterval(function() {  // Every millisecondsPerStep
        frame++;

        if (frame > steps) {
          clearInterval(interval);
        } else {
          increaseTransparency(imageData, steps);
          context.putImageData(imageData, 0, 0);
        }
      }, millisecondsPerStep);
    }



    /*--------------------------------*\
      Event listeners
    \*--------------------------------*/

    fadeButton.addEventListener('click', handle4FadeIn, false);
    image.addEventListener('load', handle4ImageLoaded, false);



    /*--------------------------------*\
      Event handlers
    \*--------------------------------*/

    function handle4FadeIn(e) {
      imageDataOffscreen = offscreenContext.getImageData(0, 0, canvas.width, canvas.height);
      fadeIn(context, 
        offscreenContext.getImageData(0, 0, canvas.width, canvas.height), 
        50, 1000 / 60);
    }

    function handle4ImageLoaded(e) {
      offscreenCanvas.width = canvas.width;
      offscreenCanvas.height = canvas.height;
      offscreenContext.drawImage(image, 0, 0);
    }



    /*--------------------------------*\
      Initialization
    \*--------------------------------*/

    image.src = '../assets/imgs/log-crossing.png';

  }

})(window, document);