const fs = require('fs');

// ProductList.tsx
let pl = fs.readFileSync('src/pages/ProductList.tsx', 'utf8');
if (!pl.includes('LoadingSpinner')) {
  pl = pl.replace(/import \{ EpidemicList \} from '\.\.\/components\/EpidemicList';/, "import { EpidemicList } from '../components/EpidemicList';\nimport { LoadingSpinner } from '../components/LoadingSpinner';");
}

const plLoading = `{loading ? (
        <LoadingSpinner 
          type={selectedMarket ? 'heading_to' : 'planting'} 
          marketName={selectedMarket ? markets.find(m => m.MarketCode === selectedMarket)?.MarketName : undefined} 
        />
      ) : (`;

pl = pl.replace(/\{loading \? \(\n        <div className="flex flex-col justify-center items-center h-64 gap-4">\n          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"><\/div>\n          <p className=\{\`text-lg \$\{isDarkMode \? 'text-gray-300' : 'text-gray-600'\}\`\}>\n            \{selectedMarket \n              \? t\('loading\.heading_to'\)\.replace\('\{market\}', markets\.find\(m => m\.MarketCode === selectedMarket\)\?\.MarketName \|\| ''\)\n              : t\('loading\.planting'\)\}\n          <\/p>\n        <\/div>\n      \) : \(/, plLoading);
fs.writeFileSync('src/pages/ProductList.tsx', pl);

// ProductDetailPage.tsx
let pd = fs.readFileSync('src/pages/ProductDetailPage.tsx', 'utf8');
if (!pd.includes('LoadingSpinner')) {
  pd = pd.replace(/import \{ EpidemicList \} from '\.\.\/components\/EpidemicList';/, "import { EpidemicList } from '../components/EpidemicList';\nimport { LoadingSpinner } from '../components/LoadingSpinner';");
}

const pdLoading = `{loading ? (
        <LoadingSpinner type="default" />
      ) : !product ? (`;

pd = pd.replace(/\{loading \? \(\n        <div className="flex justify-center items-center h-64">\n          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"><\/div>\n        <\/div>\n      \) : !product \? \(/, pdLoading);
fs.writeFileSync('src/pages/ProductDetailPage.tsx', pd);

// PriceHistory.tsx
let ph = fs.readFileSync('src/components/PriceHistory.tsx', 'utf8');
if (!ph.includes('LoadingSpinner')) {
  ph = ph.replace(/import \{ useTranslation \} from '\.\.\/hooks\/useTranslation';/, "import { useTranslation } from '../hooks/useTranslation';\nimport { LoadingSpinner } from './LoadingSpinner';");
}

const phLoading = `{loading ? (
        <LoadingSpinner type="default" />
      ) : chartData ? (`;
ph = ph.replace(/\{loading \? \(\n        <div className="flex justify-center items-center h-64">\n          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"><\/div>\n        <\/div>\n      \) : chartData \? \(/, phLoading);
fs.writeFileSync('src/components/PriceHistory.tsx', ph);

// MarketComparison.tsx
let mc = fs.readFileSync('src/components/MarketComparison.tsx', 'utf8');
if (!mc.includes('LoadingSpinner')) {
  mc = mc.replace(/import \{ useTranslation \} from '\.\.\/hooks\/useTranslation';/, "import { useTranslation } from '../hooks/useTranslation';\nimport { LoadingSpinner } from './LoadingSpinner';");
}

const mcLoading = `{loading ? (
        <LoadingSpinner type="default" />
      ) : (`;
mc = mc.replace(/\{loading \? \(\n        <div className="flex justify-center items-center h-64">\n          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"><\/div>\n        <\/div>\n      \) : \(/, mcLoading);
fs.writeFileSync('src/components/MarketComparison.tsx', mc);

// CropComparison.tsx
let cc = fs.readFileSync('src/components/CropComparison.tsx', 'utf8');
if (!cc.includes('LoadingSpinner')) {
  cc = cc.replace(/import \{ useTranslation \} from '\.\.\/hooks\/useTranslation';/, "import { useTranslation } from '../hooks/useTranslation';\nimport { LoadingSpinner } from './LoadingSpinner';");
}

const ccLoading = `{loading ? (
        <LoadingSpinner type="default" className="h-48 sm:h-64" />
      ) : (`;
cc = cc.replace(/\{loading \? \(\n        <div className="flex justify-center items-center h-48 sm:h-64">\n          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-500"><\/div>\n        <\/div>\n      \) : \(/, ccLoading);
fs.writeFileSync('src/components/CropComparison.tsx', cc);

