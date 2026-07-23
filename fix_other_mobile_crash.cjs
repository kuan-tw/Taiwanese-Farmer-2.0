const fs = require('fs');

let mc = fs.readFileSync('src/components/MarketComparison.tsx', 'utf8');
mc = mc.replace(/\{market\.Trans_Quantity\.toLocaleString\(\)\}/g, '{Number(market.Trans_Quantity || 0).toLocaleString()}');
mc = mc.replace(/\$\{market\.Avg_Price\.toFixed\(2\)\}/g, '${Number(market.Avg_Price || 0).toFixed(2)}');
fs.writeFileSync('src/components/MarketComparison.tsx', mc);

let cc = fs.readFileSync('src/components/CropComparison.tsx', 'utf8');
cc = cc.replace(/\{item\.Trans_Quantity\.toLocaleString\(\)\}/g, '{Number(item.Trans_Quantity || 0).toLocaleString()}');
cc = cc.replace(/\$\{item\.Avg_Price\.toFixed\(2\)\}/g, '${Number(item.Avg_Price || 0).toFixed(2)}');
fs.writeFileSync('src/components/CropComparison.tsx', cc);

