const fs = require('fs');
let pl = fs.readFileSync('src/pages/ProductList.tsx', 'utf8');

pl = pl.replace(/import \{ Link, useLocation \} from 'react-router-dom';/, "import { Link, useLocation } from 'react-router-dom';\nimport { ProductCard } from '../components/ProductCard';");

const oldCardRegex = /<Link[\s\S]*?key=\{cropCode\}[\s\S]*?to=\{`\/product\/\$\{cropCode\}\$\{selectedMarket \? `\?market=\$\{selectedMarket\}` : ''\}`\}[\s\S]*?<\/Link>/g;

pl = pl.replace(oldCardRegex, 
  `<ProductCard key={cropCode} cropCode={cropCode} product={product} translatedName={translatedName} selectedMarket={selectedMarket} />`
);

fs.writeFileSync('src/pages/ProductList.tsx', pl);
