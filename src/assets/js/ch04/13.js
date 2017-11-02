(function(window, document, undefined) {

  document.addEventListener('DOMContentLoaded', handle4DomReady, false);

  function handle4DomReady(e) {

    /*--------------------------------*\
      DOM elements and Variables
    \*--------------------------------*/

    let canvas = document.querySelector('#canvas'),
      context = canvas.getContext('2d'),
      negativeButton = document.querySelector('#negativeButton'),
      image = new Image();


    /*--------------------------------*\
      Event listeners
    \*--------------------------------*/

    negativeButton.addEventListener('click', handle4NegativeFilter, false);
    image.addEventListener('load', handle4ImageLoaded, false);


    /*--------------------------------*\
      Event handlers
    \*--------------------------------*/

    function handle4NegativeFilter(e) {
      let imageData = context.getImageData(0, 0, canvas.width, canvas.height),
        data = imageData.data;
      
      // 负片滤镜算法：
      // red    = 255 - red
      // green  = 255 - green
      // blue   = 255 - blue
      for (let i = 0; i <= data.length - 4; i += 4) {
        data[i]     = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
      }

      context.putImageData(imageData, 0, 0);
    }

    function handle4ImageLoaded(e) {
      context.drawImage(image, 
        0, 0, image.width, image.height,
        0, 0, canvas.width, canvas.height);
    }


    /*--------------------------------*\
      Initialization
    \*--------------------------------*/

    image.src = '../assets/imgs/curved-road.png';
  }

})(window, document);