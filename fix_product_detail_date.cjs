const fs = require('fs');

let pd = fs.readFileSync('src/pages/ProductDetailPage.tsx', 'utf8');

const parseRocDateFunc = `
const parseROCDate = (rocDateStr: string) => {
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

pd = pd.replace(/const convertToTaiwanDate/, parseRocDateFunc + '\nconst convertToTaiwanDate');

pd = pd.replace(
  /new Date\(d\.TransDate\) > new Date\(unique\.get\(d\.MarketCode\)\.TransDate\)/g,
  'parseROCDate(d.TransDate) > parseROCDate(unique.get(d.MarketCode).TransDate)'
);

pd = pd.replace(
  /new Date\(d\.TransDate\) > new Date\(latestEntry\.TransDate\)/g,
  'parseROCDate(d.TransDate) > parseROCDate(latestEntry.TransDate)'
);

fs.writeFileSync('src/pages/ProductDetailPage.tsx', pd);
