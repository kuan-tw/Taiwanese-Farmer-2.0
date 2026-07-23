const fs = require('fs');

let mc = fs.readFileSync('src/components/MarketComparison.tsx', 'utf8');

const parseRocDateFunc = `
const parseROCDate = (rocDateStr) => {
  if (!rocDateStr) return new Date(0);
  const parts = rocDateStr.split('.');
  if (parts.length === 3) {
    const year = parseInt(parts[0]) + 1911;
    const month = parseInt(parts[1]) - 1;
    const day = parseInt(parts[2]);
    return new Date(year, month, day);
  }
  const d = new Date(rocDateStr.replace(/\\./g, '-'));
  if (isNaN(d.getTime())) return new Date(0);
  return d;
};
`;

mc = mc.replace(/interface MarketComparisonProps/, parseRocDateFunc + '\ninterface MarketComparisonProps');

mc = mc.replace(
  /new Date\(market\.TransDate\) > new Date\(existingMarket\.TransDate\)/,
  'parseROCDate(market.TransDate) > parseROCDate(existingMarket.TransDate)'
);

fs.writeFileSync('src/components/MarketComparison.tsx', mc);
