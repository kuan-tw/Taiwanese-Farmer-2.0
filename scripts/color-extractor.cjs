const fs = require('fs');
const PNG = require('pngjs').PNG;

fs.createReadStream('public/images/twfarmer.png')
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function() {
    const colorCounts = {};
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let idx = (this.width * y + x) << 2;
        let r = this.data[idx];
        let g = this.data[idx+1];
        let b = this.data[idx+2];
        let a = this.data[idx+3];
        if (a > 50) { // ignore transparent pixels
          let color = `${r},${g},${b}`;
          colorCounts[color] = (colorCounts[color] || 0) + 1;
        }
      }
    }
    const sortedColors = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
    for (let i = 0; i < Math.min(10, sortedColors.length); i++) {
        console.log(sortedColors[i]);
    }
  });
