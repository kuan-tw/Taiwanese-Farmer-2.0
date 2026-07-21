const fs = require('fs');
const imageFile = fs.readFileSync('public/images/twfarmer.png');
console.log("Image size:", imageFile.length);
// Just printing first few bytes to see if it's a PNG
console.log(imageFile.slice(0, 16).toString('hex'));
