(function(window, document, undefined) {

  document.addEventListener('DOMContentLoaded', handle4DomReady, false);

  function handle4DomReady(e) {

    /*--------------------------------*\
      DOM elements and Variables
    \*--------------------------------*/

    let canvas = document.querySelector('#canvas'),
      context = canvas.getContext('2d'),
      resetButton = document.querySelector('#resetButton'),
      image = new Image(),
      imageData,
      mousedown = {},
      rubberbandRectangle = {},
      dragging = false;


    /*--------------------------------*\
      Functions
    \*--------------------------------*/

    function windowToCanvas(canvas, x, y) {
      let canvasRectangle = canvas.getBoundingClientRect();

      return {
        x: x - canvasRectangle.left,
        y: y - canvasRectangle.top
      };
    }

    function captureRubberbandPixels() {
      imageData = context.getImageData(
        rubberbandRectangle.left,
        rubberbandRectangle.top,
        rubberbandRectangle.width,
        rubberbandRectangle.height);
    }

    function restoreRubberbandPixels() {
      let deviceWidthOverCSSPixels = imageData.width / rubberbandRectangle.width,
        deviceHeightOverCSSPixels = imageData.height / rubberbandRectangle.height;

      context.putImageData(imageData,
        rubberbandRectangle.left * deviceWidthOverCSSPixels,
        rubberbandRectangle.top * deviceHeightOverCSSPixels);
    }

    function drawRubberbandRectangle() {
      context.strokeRect(
        rubberbandRectangle.left + context.lineWidth,
        rubberbandRectangle.top + context.lineWidth,
        rubberbandRectangle.width - 2*context.lineWidth,
        rubberbandRectangle.height - 2*context.lineWidth);
    }

    function setRubberbandRectangle(loc) {
      rubberbandRectangle.left = Math.min(loc.x, mousedown.x);
      rubberbandRectangle.top = Math.min(loc.y, mousedown.y);
      rubberbandRectangle.width = Math.abs(loc.x - mousedown.x);
      rubberbandRectangle.height = Math.abs(loc.y - mousedown.y);
    }

    function updateRubberbandRectangle() {
      captureRubberbandPixels();
      drawRubberbandRectangle();
    }


    /*--------------------------------*\
      Event listeners
    \*--------------------------------*/

    canvas.addEventListener('mousedown', handle4RubberStart, false);
    canvas.addEventListener('mousemove', handle4RubberStretch, false);
    canvas.addEventListener('mouseup', handle4RubberEnd, false);

    image.addEventListener('load', handle4ImageLoaded, false);
    resetButton.addEventListener('click', handle4Reset, false);
    

    /*--------------------------------*\
      Event handlers
    \*--------------------------------*/

    function handle4RubberStart(e) {
      let loc = windowToCanvas(canvas, e.clientX, e.clientY);
      e.preventDefault();

      rubberbandRectangle.left = mousedown.x = loc.x;
      rubberbandRectangle.top = mousedown.y = loc.y;

      dragging = true;
    }

    function handle4RubberStretch(e) {
      let loc;

      if (dragging) {
        loc = windowToCanvas(canvas, e.clientX, e.clientY);
        e.preventDefault();

        if (rubberbandRectangle.width > 2*context.lineWidth &&
          rubberbandRectangle.height > 2*context.lineWidth) {

          if (imageData !== undefined) {
            restoreRubberbandPixels();
          }
        }

        setRubberbandRectangle(loc);

        if (rubberbandRectangle.width > 2*context.lineWidth &&
          rubberbandRectangle.height > 2*context.lineWidth) {

          updateRubberbandRectangle();
        }
      }
    }

    function handle4RubberEnd(e) {

      // Draw and scale image to the on screen canvas.
      context.drawImage(canvas,
        rubberbandRectangle.left + 2*context.lineWidth,
        rubberbandRectangle.top + 2*context.lineWidth,
        rubberbandRectangle.width - 4*context.lineWidth,
        rubberbandRectangle.height - 4*context.lineWidth,
        0, 0, canvas.width, canvas.height);

      dragging = false;
      imageData = undefined;
    }

    function handle4ImageLoaded(e) {
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    }

    function handle4Reset(e) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    }


    /*--------------------------------*\
      Initialization
    \*--------------------------------*/

    context.strokeStyle = 'yellow';
    context.lineWidth = 2.0;

    image.src = '../assets/imgs/arch.png';
  }

})(window, document);