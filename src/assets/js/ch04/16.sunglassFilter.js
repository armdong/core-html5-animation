onmessage = function(e) {
  let imageData = e.data,
    data = imageData.data,
    width = imageData.width,
    len = data.length;

  for (let i = 0; i < len; i++) {
    if ((i + 1) % 4 !== 0) {
      if ((i + 4) % (width * 4) == 0) {
        data[i]     = data[i - 4];
        data[i + 1] = data[i - 3];
        data[i + 2] = data[i - 2];
        data[i + 3] = data[i - 1];
        i += 4;
      } else {
        data[i] = 2 * data[i] - data[i + 4] - data[i + 4] / 2;
      }
    }
  }

  postMessage(imageData);
};