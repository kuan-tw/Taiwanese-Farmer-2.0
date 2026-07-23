const fs = require('fs');

let pc = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

pc = pc.replace(/\.toFixed\(2\)/g, '.toFixed(1)');

fs.writeFileSync('src/components/ProductCard.tsx', pc);

