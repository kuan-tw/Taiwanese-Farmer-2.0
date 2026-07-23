const fs = require('fs');

let ph = fs.readFileSync('src/components/PriceHistory.tsx', 'utf8');
ph = ph.replace(
`            const value = context.parsed.y;
            if (context.datasetIndex === 3) {
              return \`\${label}: \${value.toLocaleString()} kg\`;
            }
            return \`\${label}: $\${value.toFixed(2)}\`;`,
`            const value = context.parsed.y;
            if (value === null || value === undefined || isNaN(value)) return null;
            if (context.datasetIndex === 3) {
              return \`\${label}: \${value.toLocaleString()} kg\`;
            }
            return \`\${label}: $\${value.toFixed(2)}\`;`
);
fs.writeFileSync('src/components/PriceHistory.tsx', ph);
