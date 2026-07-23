const fs = require('fs');

let ph = fs.readFileSync('src/components/PriceHistory.tsx', 'utf8');

ph = ph.replace(
  /const y = sortedData\.map\(item => item\.Avg_Price\);/,
  'const y = sortedData.map(item => Number(item.Avg_Price || 0));'
);

fs.writeFileSync('src/components/PriceHistory.tsx', ph);
