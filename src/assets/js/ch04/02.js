(function(window, document, undefined) {

  document.addEventListener('DOMContentLoaded', handle4DomReady, false);

  function handle4DomReady(e) {
    let canvas = document.querySelector('#canvas'),
      context = canvas.getContext('2d'),
      scaleCheckbox = document.querySelector('#scaleCheckbox'),
      image = new Image();

    // Functions
    function drawImage() {
      context.save();
      context.clearRect(0, 0, canvas.width, canvas.height);

      if (scaleCheckbox.checked) {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
      } else {
        context.drawImage(image, 0, 0);
      }

      context.restore();
    }
    
    // Event handlers
    scaleCheckbox.addEventListener('change', drawImage, false);

    // Initialization
    image.src = '../assets/imgs/waterfall.png';
    image.addEventListener('load', drawImage, false);
  }

})(window, document);