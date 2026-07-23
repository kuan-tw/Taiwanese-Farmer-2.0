const fs = require('fs');

let pc = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

const imports = `import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { AgriProduct } from '../types/api';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import { getCropImage } from '../utils/imageStore';`;

pc = pc.replace(/import React from 'react';\nimport \{ Link \} from 'react-router-dom';\nimport \{ Sprout \} from 'lucide-react';\nimport \{ AgriProduct \} from '\.\.\/types\/api';\nimport \{ useTheme \} from '\.\.\/context\/ThemeContext';\nimport \{ useTranslation \} from '\.\.\/hooks\/useTranslation';/, imports);

const hookCode = `  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    getCropImage(cropCode).then(setImage);
  }, [cropCode]);`;

pc = pc.replace(/  const \{ isDarkMode \} = useTheme\(\);\n  const \{ t \} = useTranslation\(\);/, hookCode);

const imageRender = `<div className={\`relative h-48 sm:rounded-t-lg overflow-hidden hidden sm:block \${
        isDarkMode ? 'bg-gradient-to-br from-green-600 to-green-700' : 'bg-gradient-to-br from-green-400 to-green-500'
      }\`}>
        {image ? (
          <img src={image} alt={translatedName} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Sprout className="w-16 h-16 text-white drop-shadow-lg" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/10 hover:bg-black/20 transition-colors duration-300"></div>
      </div>`;

pc = pc.replace(/<div className=\{\`relative h-48 sm:rounded-t-lg overflow-hidden hidden sm:block \$\{\n        isDarkMode \? 'bg-gradient-to-br from-green-600 to-green-700' : 'bg-gradient-to-br from-green-400 to-green-500'\n      \}\`\}>\n        <div className="absolute inset-0 flex items-center justify-center">\n          <Sprout className="w-16 h-16 text-white drop-shadow-lg" \/>\n        <\/div>\n        <div className="absolute inset-0 bg-black\/10 hover:bg-black\/20 transition-colors duration-300"><\/div>\n      <\/div>/, imageRender);

pc = pc.replace(/<p className=\{\`text-lg \$\{isDarkMode \? 'text-gray-400' : 'text-gray-500'\}\`\}>\n              \{product\.MarketName\}\n            <\/p>/, "");

fs.writeFileSync('src/components/ProductCard.tsx', pc);
