const fs = require('fs');
let header = fs.readFileSync('src/components/Header.tsx', 'utf8');
header = header.replace(
  /<Link to="\/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">/,
  '<Link to="/" state={{ reset: Date.now() }} className="flex items-center gap-3 hover:opacity-80 transition-opacity">'
);
fs.writeFileSync('src/components/Header.tsx', header);
