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
      imageDataCopy = context.createImageData(canvas.width, canvas.height),
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

    function copyCanvasPixels() {
      let len = imageData.data.length;

      // Copy red, green and blue components of the first pixel
      for (let i = 0; i < 3; i++) {
        imageDataCopy.data[i] = imageData.data[i];
      }

      // Starting with the alpha component of the first pixel,
      // copy imageData, and make the copy more transparent
      for (let i = 3; i < len - 4; i += 4) {
        imageDataCopy.data[i]     = imageData.data[i] / 2; // Alpha: more transparent
        imageDataCopy.data[i + 1] = imageData.data[i + 1]; // Red
        imageDataCopy.data[i + 2] = imageData.data[i + 2]; // Green
        imageDataCopy.data[i + 3] = imageData.data[i + 3]; // Blue
      }
    }

    function captureRubberbandPixels() {
      imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      copyCanvasPixels();
    }

    function restoreRubberbandPixels() {
      let deviceWidthOverCSSPixels = imageData.width / canvas.width,
        deviceHeightOverCSSPixels = imageData.height / canvas.height;

      // Restore the Canvas to what it looked like when the mouse went down
      context.putImageData(imageData, 0, 0);
      
      // Put the more transparent image data into the rubberband rectangle
      context.putImageData(imageDataCopy, 0, 0,
        rubberbandRectangle.left + context.lineWidth,
        rubberbandRectangle.top + context.lineWidth,
        (rubberbandRectangle.width - 2*context.lineWidth) * deviceWidthOverCSSPixels,
        (rubberbandRectangle.height - 2*context.lineWidth) * deviceHeightOverCSSPixels);
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
      rubberbandRectangle.width = 0;
      rubberbandRectangle.height = 0;

      dragging = true;
      captureRubberbandPixels();
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

          drawRubberbandRectangle();
        }
      }
    }

    function handle4RubberEnd(e) {
      context.putImageData(imageData, 0, 0);

      // Draw the canvas back into itself, scaling along the way
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

    context.strokeStyle = 'navy';
    context.lineWidth = 1.0;

    image.src = '../assets/imgs/arch.png';
  }

})(window, document);