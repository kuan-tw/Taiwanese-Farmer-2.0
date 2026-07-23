const fs = require('fs');
let file = fs.readFileSync('src/utils/translation.ts', 'utf8');

file = file.replace(/,,/g, ',');

fs.writeFileSync('src/utils/translation.ts', file);
