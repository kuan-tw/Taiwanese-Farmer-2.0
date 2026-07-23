const fs = require('fs');
let file = fs.readFileSync('src/utils/translation.ts', 'utf8');

file = file.replace(/random: '.*?'\n(\s+)export:/g, (match, p1) => {
  return match.replace(/random: '.*?'/, (m) => m + ',');
});

fs.writeFileSync('src/utils/translation.ts', file);
