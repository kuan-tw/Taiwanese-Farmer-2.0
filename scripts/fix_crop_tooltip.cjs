const fs = require('fs');
let cc = fs.readFileSync('src/components/CropComparison.tsx', 'utf8');
cc = cc.replace(
`          label: function(context: any) {
            return \`\${context.dataset.label}: $\${context.parsed.y.toFixed(2)}\`;
          }`,
`          label: function(context: any) {
            if (context.parsed.y === null || context.parsed.y === undefined || isNaN(context.parsed.y)) return null;
            return \`\${context.dataset.label}: $\${context.parsed.y.toFixed(2)}\`;
          }`
);
fs.writeFileSync('src/components/CropComparison.tsx', cc);
