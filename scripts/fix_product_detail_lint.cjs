const fs = require('fs');
let pd = fs.readFileSync('src/pages/ProductDetailPage.tsx', 'utf8');

pd = pd.replace(/import React, \{ useState, useEffect, useCallback, Suspense, lazy \} from 'react';/, "import React, { useState, useEffect, useCallback } from 'react';");

fs.writeFileSync('src/pages/ProductDetailPage.tsx', pd);
