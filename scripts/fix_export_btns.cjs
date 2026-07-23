const fs = require('fs');

function hideExportBtn(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/<button\s+onClick=\{handleExportChart\}/g, '{!isMobile && <button\n          onClick={handleExportChart}');
  content = content.replace(/{t\('actions.export'\)}\s*<\/button>/g, "{t('actions.export')}\n        </button>}");
  fs.writeFileSync(filePath, content);
}

hideExportBtn('src/components/PriceHistory.tsx');
hideExportBtn('src/components/MarketComparison.tsx');
hideExportBtn('src/components/CropComparison.tsx');
