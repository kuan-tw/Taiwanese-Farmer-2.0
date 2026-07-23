const fs = require('fs');
let pd = fs.readFileSync('src/pages/ProductDetailPage.tsx', 'utf8');
pd = pd.replace("import { LoadingSpinner } from '../components/LoadingSpinner';import React", "import { LoadingSpinner } from '../components/LoadingSpinner';\nimport React");
fs.writeFileSync('src/pages/ProductDetailPage.tsx', pd);
