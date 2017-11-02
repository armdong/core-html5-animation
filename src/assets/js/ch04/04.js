(function(window, document, undefined) {

  document.addEventListener('DOMContentLoaded', handle4DomReady, false);

  function handle4DomReady(e) {

    /*--------------------------------*\
      DOM elements and Variables
    \*--------------------------------*/
    let canvas = document.querySelector('#canvas'),
      context = canvas.getContext('2d'),
      image = new Image(),

      scaleOutput = document.querySelector('#scaleOutput'),
      scaleSlider = document.querySelector('#scaleSlider'),
      scale = 1.0,
      MINIMUM_SCALE = 1.0,
      MAXIMUM_SCALE = 3.0; 


    /*--------------------------------*\
      Functions
    \*--------------------------------*/

    function drawImage() {
      let w = canvas.width,
        h = canvas.height,
        sw = w * scale,
        sh = h * scale;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, -sw/2 + w/2, -sh/2 + h/2, sw, sh);
    }

    function drawScaleText(value) {
      let text = parseFloat(value).toFixed(2);
      let percent = parseFloat(value - MINIMUM_SCALE) / parseFloat(MAXIMUM_SCALE - MINIMUM_SCALE);

      scaleOutput.innerText = text;
      percent = percent < 0.35 ? 0.35 : percent;
      scaleOutput.style.fontSize = percent * MAXIMUM_SCALE/2.5 + 'em';
    }

    function handle4SliderChange(e) {
      scale = e.target.value;

      if (scale < MINIMUM_SCALE) {
        scale = MINIMUM_SCALE;
      } else if (scale > MAXIMUM_SCALE) {
        scale = MAXIMUM_SCALE;
      }

      drawScaleText(scale);
      drawImage();
    }

    function handle4ImageLoaded(e) {
      drawImage();
      drawScaleText(scaleSlider.value);
    }


    /*--------------------------------*\
      Event handlers
    \*--------------------------------*/

    scaleSlider.addEventListener('change', handle4SliderChange, false);


    /*--------------------------------*\
      Initialization
    \*--------------------------------*/

    context.fillStyle       = 'cornflowerblue';
    context.strokeStyle     = 'yellow';
    context.shadowColor     = 'rgba(50, 50, 50, 1.0)';
    context.shadowOffsetX   = 5;
    context.shadowOffsetY   = 5;
    context.shadowBlur      = 10;

    image.src = '../assets/imgs/waterfall.png';
    image.addEventListener('load', handle4ImageLoaded, false);
  }

})(window, document);