(function(window, document, undefined) {

  document.addEventListener('DOMContentLoaded', handle4DomReady, false);

  function handle4DomReady(e) {

    /*--------------------------------*\
      DOM elements and Variables
    \*--------------------------------*/

    let canvas = document.querySelector('#canvas'),
      context = canvas.getContext('2d'),
      embossButton = document.querySelector('#embossButton'),
      image = new Image(),
      embossed = false;


    /*--------------------------------*\
      Functions
    \*--------------------------------*/

    function emboss() {
      let imageData = context.getImageData(0, 0, canvas.width, canvas.height),
        width = imageData.width,
        data = imageData.data,
        len = data.length;

      for (let i = 0; i < len; i++) { // Loop through every pixel
        
        // if we won't overrun the bounds of the array
        if (i <= len - width * 4) {
          
          // if it's not an alpha
          if ((i + 1) % 4 !== 0) {

            // if it's the last pixel in the row, there is
            // no pixel to the right, so copy previous pixel's
            // values.
            if ((i + 4) * (width * 4) == 0) {
              data[i]     = data[i - 4];
              data[i + 1] = data[i - 3];
              data[i + 2] = data[i - 2];
              data[i + 3] = data[i - 1];
              i += 4;
            } else { // not the last pixel in the row
              data[i] = 255 / 2         // Average value
                + 2 * data[i]           // current pixel
                - data[i + 4]           // next pixel
                - data[i + width * 4];  // pixel underneath
            }
          }
        } else { // last row, no pixel underneath, so copy pixel above
          if ((i + 1) % 4 !== 0) {
            data[i] = data[i - width * 4];
          }
        }
      }

      context.putImageData(imageData, 0, 0);
    }

    function drawOriginalImage() {
      context.drawImage(image,
        0, 0, image.width, image.height,
        0, 0, canvas.width, canvas.height);
    }


    /*--------------------------------*\
      Event listeners
    \*--------------------------------*/

    embossButton.addEventListener('click', handle4EmbossToggle, false);
    image.addEventListener('load', drawOriginalImage, false);


    /*--------------------------------*\
      Event handlers
    \*--------------------------------*/

    function handle4EmbossToggle(e) {
      embossed && drawOriginalImage();
      embossed || emboss();
      embossButton.value = embossed ? 'Emboss' : 'Original image';
      embossed = !embossed;
    }


    /*--------------------------------*\
      Initialization
    \*--------------------------------*/

    image.src = '../assets/imgs/curved-road.png';
  }

})(window, document);