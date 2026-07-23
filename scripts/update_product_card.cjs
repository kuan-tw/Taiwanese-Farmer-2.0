const fs = require('fs');
let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

code = code.replace(
  'to={`/product/${cropCode}${selectedMarket ? `?market=${selectedMarket}` : \'\'}`}',
  'to={`/product/${cropCode}${selectedMarket ? `?market=${selectedMarket}` : \'\'}`} state={{ cropName: translatedName }}'
);

fs.writeFileSync('src/components/ProductCard.tsx', code);
