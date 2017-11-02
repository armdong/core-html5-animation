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

    function drawScaled() {
      let w = canvas.width,
        h = canvas.height,
        sw = w * scale,
        sh = h * scale;
      
      // Clear the canvas, and draw the image scaled to canvas size
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Draw the watermark on top of the image
      drawWatermark();

      // Finally, draw the canvas scaled according to the current
      // scale, back into itself. Note that the source and
      // destination canvases are the same canvas.
      context.drawImage(canvas, 0, 0, canvas.width, canvas.height, w/2 - sw/2, h/2 - sh/2, sw, sh);
    }

    function drawScaleText(value) {
      let text = parseFloat(value).toFixed(2);
      let percent = parseFloat(value - MINIMUM_SCALE) / parseFloat(MAXIMUM_SCALE - MINIMUM_SCALE);

      scaleOutput.innerText = text;
      percent = percent < 0.35 ? 0.35 : percent;
      scaleOutput.style.fontSize = percent * MAXIMUM_SCALE/2.5 + 'em';
    }

    function drawWatermark() {
      let lineOne = 'Copyright',
        lineTwo = 'ARM Inc.',
        textMetrics = null,
        FONT_HEIGHT = 128;

      context.save();
      
      context.font = `${FONT_HEIGHT}px Arial`;
      context.globalAlpha = 0.6;
      context.translate(canvas.width/2, canvas.height/2 - FONT_HEIGHT/2);

      textMetrics = context.measureText(lineOne);
      context.fillText(lineOne, -textMetrics.width/2, 0);
      context.strokeText(lineOne, -textMetrics.width/2, 0);

      textMetrics = context.measureText(lineTwo);
      context.fillText(lineTwo, -textMetrics.width/2, FONT_HEIGHT);
      context.strokeText(lineTwo, -textMetrics.width/2, FONT_HEIGHT);

      context.restore();
    }

    function handle4SliderChange(e) {
      scale = e.target.value;

      if (scale < MINIMUM_SCALE) {
        scale = MINIMUM_SCALE;
      } else if (scale > MAXIMUM_SCALE) {
        scale = MAXIMUM_SCALE;
      }

      drawScaled();
      drawScaleText(scale);
    }

    function handle4ImageLoaded(e) {
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      drawWatermark();
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

    image.src = '../assets/imgs/lonelybeach.png';
    image.addEventListener('load', handle4ImageLoaded, false);
  }

})(window, document);