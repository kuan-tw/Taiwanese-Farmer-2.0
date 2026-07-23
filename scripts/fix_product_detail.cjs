const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetailPage.tsx', 'utf8');

code = code.replace(
  "setSearchParams({ market: newMarketCode });",
  "setSearchParams({ market: newMarketCode }, { replace: true });"
);

fs.writeFileSync('src/pages/ProductDetailPage.tsx', code);
