const fs = require('fs');
let pc = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

pc = pc.replace(/\\\`\?market=\\\$\\{selectedMarket\\}\\\`/g, "`?market=${selectedMarket}`");

fs.writeFileSync('src/components/ProductCard.tsx', pc);
