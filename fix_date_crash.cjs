const fs = require('fs');

let ph = fs.readFileSync('src/components/PriceHistory.tsx', 'utf8');
ph = ph.replace(
  /const lastDate = new Date\(sortedData\[sortedData\.length - 1\]\.TransDate\);/,
  `const lastDate = sortedData.length > 0 ? new Date(sortedData[sortedData.length - 1].TransDate) : new Date();`
);
fs.writeFileSync('src/components/PriceHistory.tsx', ph);

