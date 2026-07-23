const fs = require('fs');
let pl = fs.readFileSync('src/pages/ProductList.tsx', 'utf8');

const plLoading = `) : loading ? (
        <LoadingSpinner 
          type={selectedMarket ? 'heading_to' : 'planting'} 
          marketName={selectedMarket ? markets.find(m => m.MarketCode === selectedMarket)?.MarketName : undefined} 
        />
      ) : (`;

pl = pl.replace(/\) : loading \? \(\n        <div className="flex flex-col justify-center items-center h-64 gap-4">\n          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"><\/div>\n          <p className=\{\`text-lg \$\{isDarkMode \? 'text-gray-300' : 'text-gray-600'\}\`\}>\n            \{selectedMarket \n              \? t\('loading\.heading_to'\)\.replace\('\{market\}', markets\.find\(m => m\.MarketCode === selectedMarket\)\?\.MarketName \|\| ''\)\n              : t\('loading\.planting'\)\}\n          <\/p>\n        <\/div>\n      \) : \(/, plLoading);

fs.writeFileSync('src/pages/ProductList.tsx', pl);
