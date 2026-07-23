const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetailPage.tsx', 'utf8');

code = code.replace(
  `      {loading ? (
        <LoadingSpinner type="default" />
      ) : !product ? (`,
  `      {loading ? (
        <LoadingSpinner 
          type={localMarketCode ? 'heading_to' : 'planting'} 
          marketName={markets.find(m => m.MarketCode === localMarketCode)?.MarketName}
          cropName={location.state?.cropName || product?.CropName}
        />
      ) : !product ? (`
);

fs.writeFileSync('src/pages/ProductDetailPage.tsx', code);
