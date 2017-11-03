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
      sunglassButton = document.querySelector('#sunglassButton'),
      image = new Image(),
      sunglassOn = false,
      sunglassFilter = new Worker('../assets/js/ch04/sunglassFilter.js'),
      LENS_RADIUS = canvas.width / 5;


    /*--------------------------------*\
      Functions
    \*--------------------------------*/

    function drawLenses(leftLenLocation, rightLenLocation) {
      context.save();

      context.beginPath();
      context.arc(leftLenLocation.x, leftLenLocation.y, LENS_RADIUS, 0, Math.PI * 2, false);
      context.stroke();

      context.moveTo(rightLenLocation.x, rightLenLocation.y);
      context.arc(rightLenLocation.x, rightLenLocation.y, LENS_RADIUS, 0, Math.PI * 2, false);
      context.stroke();

      context.clip();
      context.drawImage(offscreenCanvas, 0, 0, canvas.width, canvas.height);

      context.restore();
    }

    function drawWire(center) {
      context.beginPath();
      context.moveTo(center.x - LENS_RADIUS / 4, center.y - LENS_RADIUS / 2);
      context.quadraticCurveTo(center.x, center.y - LENS_RADIUS + 20,
        center.x + LENS_RADIUS / 4, center.y - LENS_RADIUS / 2);
      context.stroke();
    }

    function drawConnectors(center) {
      context.beginPath();
      context.fillStyle = 'silver';
      context.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      context.lineWidth = 2;

      context.arc(center.x - LENS_RADIUS / 4, center.y - LENS_RADIUS / 2, 4, 0, Math.PI * 2, false);
      context.fill();
      context.stroke();
      
      context.beginPath();
      context.arc(center.x + LENS_RADIUS / 4, center.y - LENS_RADIUS / 2, 4, 0, Math.PI * 2, false);
      context.fill();
      context.stroke();
    }

    function putSunglassesOn() {
      let imageData = context.getImageData(0, 0, canvas.width, canvas.height),
        center = { x: canvas.width / 2, y: canvas.height / 2 },
        leftLenLocation = { x: center.x - LENS_RADIUS - 10, y: center.y },
        rightLenLocation = { x: center.x + LENS_RADIUS + 10, y: center.y };

      sunglassFilter.postMessage(imageData);

      sunglassFilter.onmessage = function(event) {
        offscreenContext.putImageData(event.data, 0, 0);
        drawLenses(leftLenLocation, rightLenLocation);
        drawWire(center);
        drawConnectors(center);
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

    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;

    image.src = '../assets/imgs/curved-road.png';
  }

})(window, document);