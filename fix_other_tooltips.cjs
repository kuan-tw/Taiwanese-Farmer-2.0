const fs = require('fs');

let mc = fs.readFileSync('src/components/MarketComparison.tsx', 'utf8');
mc = mc.replace(
`            const value = context.parsed.y;
            if (context.datasetIndex === 1) {
              return \`\${label}: \${value.toLocaleString()} kg\`;
            }
            return \`\${label}: $\${value.toFixed(2)}\`;`,
`            const value = context.parsed.y;
            if (value === null || value === undefined || isNaN(value)) return null;
            if (context.datasetIndex === 1) {
              return \`\${label}: \${value.toLocaleString()} kg\`;
            }
            return \`\${label}: $\${value.toFixed(2)}\`;`
);
fs.writeFileSync('src/components/MarketComparison.tsx', mc);

let cc = fs.readFileSync('src/components/CropComparison.tsx', 'utf8');
cc = cc.replace(
`            const value = context.parsed.y;
            return \`\${label}: $\${value.toFixed(2)}\`;`,
`            const value = context.parsed.y;
            if (value === null || value === undefined || isNaN(value)) return null;
            return \`\${label}: $\${value.toFixed(2)}\`;`
);
fs.writeFileSync('src/components/CropComparison.tsx', cc);
