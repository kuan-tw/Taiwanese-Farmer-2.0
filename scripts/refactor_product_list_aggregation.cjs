const fs = require('fs');

let pl = fs.readFileSync('src/pages/ProductList.tsx', 'utf8');

const targetStr = `{visibleProducts.map(([cropCode, products]) => {
              const product = products[0];
              const translatedName = getTranslatedCropName(cropCode, product.CropName);
              
              return (
                <ProductCard key={cropCode} cropCode={cropCode} product={product} translatedName={translatedName} selectedMarket={selectedMarket} />
              );
            })}`;

const newStr = `{visibleProducts.map(([cropCode, products]) => {
              // Get the latest date
              const latestDate = products.reduce((max, p) => p.TransDate > max ? p.TransDate : max, products[0].TransDate);
              const latestProducts = products.filter(p => p.TransDate === latestDate);

              const totalQuantity = latestProducts.reduce((sum, p) => sum + (p.Trans_Quantity || 0), 0);
              const fallbackAverage = latestProducts.reduce((sum, p) => sum + (p.Avg_Price || 0), 0) / latestProducts.length;
              const avgPrice = totalQuantity > 0 
                ? latestProducts.reduce((sum, p) => sum + (p.Avg_Price || 0) * (p.Trans_Quantity || 0), 0) / totalQuantity
                : fallbackAverage;
              
              const upperPrice = Math.max(...latestProducts.map(p => p.Upper_Price || 0));
              const lowerPrice = Math.min(...latestProducts.map(p => p.Lower_Price || 0));
              const middlePrice = latestProducts.reduce((sum, p) => sum + (p.Middle_Price || 0), 0) / latestProducts.length;

              const product = {
                ...latestProducts[0],
                MarketName: selectedMarket ? latestProducts[0].MarketName : t('market.all_markets'),
                Avg_Price: avgPrice,
                Upper_Price: upperPrice,
                Lower_Price: lowerPrice,
                Middle_Price: middlePrice,
                Trans_Quantity: totalQuantity
              };

              const translatedName = getTranslatedCropName(cropCode, product.CropName);
              
              return (
                <ProductCard key={cropCode} cropCode={cropCode} product={product} translatedName={translatedName} selectedMarket={selectedMarket} />
              );
            })}`;

pl = pl.replace(targetStr, newStr);

fs.writeFileSync('src/pages/ProductList.tsx', pl);

