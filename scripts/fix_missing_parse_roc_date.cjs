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

pd = pd.replace(/export function ProductDetailPage\(\) \{/, parseRocDateFunc + '\nexport function ProductDetailPage() {');

fs.writeFileSync('src/pages/ProductDetailPage.tsx', pd);
