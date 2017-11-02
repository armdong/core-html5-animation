(function(window, document, undefined) {

  document.addEventListener('DOMContentLoaded', handle4DomReady, false);

  function handle4DomReady(e) {

    /*--------------------------------*\
      DOM elements and Variables
    \*--------------------------------*/

    let canvas = document.querySelector('#canvas'),
      context = canvas.getContext('2d'),
      colorToggleCheckbox = document.querySelector('#colorToggleCheckbox'),
      image = new Image();


    /*--------------------------------*\
      Functions
    \*--------------------------------*/

    function drawInBlackAndWhite() {
      let imageData = context.getImageData(0, 0, canvas.width, canvas.height),
        data = imageData.data,
        len = data.length,
        average = 0;
      
      // 黑白滤镜算法：
      // average = (red + green + blue) / 3
      // red    = average
      // green  = average
      // blue   = average
      for (let i = 0; i < len - 4; i += 4) {
        average = (data[i] + data[i + 1] + data[i + 2]) / 3;

        data[i]     = average;
        data[i + 1] = average;
        data[i + 2] = average;
      }

      context.putImageData(imageData, 0, 0);
    }

    function drawInColor() {
      context.drawImage(image,
        0, 0, image.width, image.height,
        0, 0, canvas.width, canvas.height);
    }


    /*--------------------------------*\
      Event listeners
    \*--------------------------------*/

    colorToggleCheckbox.addEventListener('click', handle4ColorToggle, false);
    image.addEventListener('load', drawInColor, false);


    /*--------------------------------*\
      Event handlers
    \*--------------------------------*/

    function handle4ColorToggle(e) {
      colorToggleCheckbox.checked && drawInColor();
      colorToggleCheckbox.checked || drawInBlackAndWhite();
    }


    /*--------------------------------*\
      Initialization
    \*--------------------------------*/

    image.src = '../assets/imgs/curved-road.png';
  }

})(window, document);