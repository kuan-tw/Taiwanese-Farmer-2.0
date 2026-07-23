const fs = require('fs');

let ph = fs.readFileSync('src/components/PriceHistory.tsx', 'utf8');

// Replace item.Trans_Quantity.toLocaleString()
ph = ph.replace(/\{item\.Trans_Quantity\.toLocaleString\(\)\}/g, '{Number(item.Trans_Quantity || 0).toLocaleString()}');

// Replace item.Avg_Price.toFixed(2)
ph = ph.replace(/\$\{item\.Avg_Price\.toFixed\(2\)\}/g, '${Number(item.Avg_Price || 0).toFixed(2)}');

// Replace item.Lower_Price.toFixed(2)
ph = ph.replace(/\$\{item\.Lower_Price\.toFixed\(2\)\}/g, '${Number(item.Lower_Price || 0).toFixed(2)}');

// Replace item.Upper_Price.toFixed(2)
ph = ph.replace(/\$\{item\.Upper_Price\.toFixed\(2\)\}/g, '${Number(item.Upper_Price || 0).toFixed(2)}');

// Replace price.toFixed(2) in predictions
ph = ph.replace(/\$\{price\.toFixed\(2\)\}/g, '${Number(price || 0).toFixed(2)}');

fs.writeFileSync('src/components/PriceHistory.tsx', ph);

