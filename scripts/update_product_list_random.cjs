const fs = require('fs');

let file = fs.readFileSync('src/pages/ProductList.tsx', 'utf8');

const randomButton = `          <button
            onClick={() => {
              const cropCodes = Object.keys(productData);
              if (cropCodes.length > 0) {
                const randomCode = cropCodes[Math.floor(Math.random() * cropCodes.length)];
                navigate(\`/product/\${randomCode}\${selectedMarket ? \`?market=\${selectedMarket}\` : ''}\`);
              }
            }}
            className={\`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors w-full sm:w-auto \${
              isDarkMode
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }\`}
          >
            <Shuffle className="w-5 h-5" />
            {t('actions.random')}
          </button>
        </div>`;

file = file.replace(/<\/button>\n        <\/div>\n\n        \{showFilters && \(/, "</button>\n" + randomButton + "\n\n        {showFilters && (");

// Now update the loading state
const loadingRender = `{loading ? (
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className={\`text-lg \${isDarkMode ? 'text-gray-300' : 'text-gray-600'}\`}>
            {selectedMarket 
              ? t('loading.heading_to').replace('{market}', markets.find(m => m.MarketCode === selectedMarket)?.MarketName || '')
              : t('loading.planting')}
          </p>
        </div>
      ) : (`;

file = file.replace(/\{loading \? \(\n        <div className="flex justify-center items-center h-64">\n          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"><\/div>\n        <\/div>\n      \) : \(/, loadingRender);

fs.writeFileSync('src/pages/ProductList.tsx', file);
