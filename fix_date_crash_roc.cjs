const fs = require('fs');

let ph = fs.readFileSync('src/components/PriceHistory.tsx', 'utf8');

const parseRocDateFunc = `
const parseROCDate = (rocDateStr) => {
  if (!rocDateStr) return new Date();
  const parts = rocDateStr.split('.');
  if (parts.length === 3) {
    const year = parseInt(parts[0]) + 1911;
    const month = parseInt(parts[1]) - 1;
    const day = parseInt(parts[2]);
    return new Date(year, month, day);
  }
  // Try fallback replacing dots with dashes
  const d = new Date(rocDateStr.replace(/\\./g, '-'));
  if (isNaN(d.getTime())) return new Date();
  return d;
};
`;

// Insert it before the component
ph = ph.replace(/interface PriceHistoryProps/, parseRocDateFunc + '\ninterface PriceHistoryProps');

// Replace sort logic
ph = ph.replace(
  /new Date\(a\.TransDate\)\.getTime\(\) - new Date\(b\.TransDate\)\.getTime\(\)/,
  'parseROCDate(a.TransDate).getTime() - parseROCDate(b.TransDate).getTime()'
);

// Replace lastDate logic
ph = ph.replace(
  /const lastDate = sortedData\.length > 0 \? new Date\(sortedData\[sortedData\.length - 1\]\.TransDate\) : new Date\(\);/,
  'const lastDate = sortedData.length > 0 ? parseROCDate(sortedData[sortedData.length - 1].TransDate) : new Date();'
);

// Replace format futureDates
ph = ph.replace(
  /return date\.toISOString\(\)\.split\('T'\)\[0\];/,
  `
    const y = date.getFullYear() - 1911;
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return \`\${y}.\${m}.\${d}\`;
`
);

fs.writeFileSync('src/components/PriceHistory.tsx', ph);

