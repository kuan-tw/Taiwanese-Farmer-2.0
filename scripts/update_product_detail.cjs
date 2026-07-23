const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetailPage.tsx', 'utf8');

code = code.replace(
  "import { useParams, useSearchParams, useNavigate } from 'react-router-dom';",
  "import { useParams, useSearchParams, useNavigate, useLocation } from 'react-router-dom';"
);

code = code.replace(
  "export function ProductDetailPage() {",
  "export function ProductDetailPage() {\n  const location = useLocation();"
);

const oldSpinner = `  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center h-full min-h-[50vh]">
        <LoadingSpinner type="default" />
      </div>
    );
  }`;

const newSpinner = `  if (loading) {
    const marketName = markets.find(m => m.MarketCode === localMarketCode)?.MarketName;
    return (
      <div className="flex-1 flex justify-center items-center h-full min-h-[50vh]">
        <LoadingSpinner 
          type={localMarketCode ? 'heading_to' : 'planting'} 
          marketName={marketName}
          cropName={location.state?.cropName || product?.CropName}
        />
      </div>
    );
  }`;

code = code.replace(oldSpinner, newSpinner);

fs.writeFileSync('src/pages/ProductDetailPage.tsx', code);
