const fs = require('fs');
let pl = fs.readFileSync('src/pages/ProductList.tsx', 'utf8');

pl = pl.replace(/import \{ Link, useLocation \} from 'react-router-dom';/, "import { useLocation } from 'react-router-dom';");
pl = pl.replace(/import \{ Search, AlertTriangle, Calendar, Sprout, Filter, SlidersHorizontal \} from 'lucide-react';/, "import { Search, AlertTriangle, Calendar, Filter, SlidersHorizontal } from 'lucide-react';");

fs.writeFileSync('src/pages/ProductList.tsx', pl);
