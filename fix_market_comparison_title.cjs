const fs = require('fs');
let mc = fs.readFileSync('src/components/MarketComparison.tsx', 'utf8');

mc = mc.replace(
  /\{t\('market\.for'\)\} \{productName\}/,
  "{['zh', 'ja', 'ko'].includes(language) ? `${productName} ${t('market.for')}` : `${t('market.for')} ${productName}`}"
);

fs.writeFileSync('src/components/MarketComparison.tsx', mc);
