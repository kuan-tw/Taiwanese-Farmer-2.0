const fs = require('fs');
let file = fs.readFileSync('src/pages/ProductList.tsx', 'utf8');

const loadingRender = `      ) : loading ? (
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className={\`text-lg \${isDarkMode ? 'text-gray-300' : 'text-gray-600'}\`}>
            {selectedMarket 
              ? t('loading.heading_to').replace('{market}', markets.find(m => m.MarketCode === selectedMarket)?.MarketName || '')
              : t('loading.planting')}
          </p>
        </div>
      ) : (`;

file = file.replace(/      \) : loading \? \(\n        <div className="flex justify-center items-center h-64">\n          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"><\/div>\n        <\/div>\n      \) : \(/, loadingRender);

fs.writeFileSync('src/pages/ProductList.tsx', file);
