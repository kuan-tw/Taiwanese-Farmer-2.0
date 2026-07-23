const fs = require('fs');

let pd = fs.readFileSync('src/components/ProductDetails.tsx', 'utf8');

const imports = `import React, { useState, useEffect, useRef } from 'react';
import { Scale, BarChart3, TrendingUp, Package, Building2, Sprout, ImagePlus } from 'lucide-react';
import { AgriProduct } from '../types/api';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import { getCropImage, saveCropImage } from '../utils/imageStore';`;

pd = pd.replace(/import React from 'react';\nimport \{ Scale, BarChart3, TrendingUp, Package, Building2, Sprout \} from 'lucide-react';\nimport \{ AgriProduct \} from '\.\.\/types\/api';\nimport \{ useTheme \} from '\.\.\/context\/ThemeContext';\nimport \{ useLanguage \} from '\.\.\/context\/LanguageContext';\nimport \{ useTranslation \} from '\.\.\/hooks\/useTranslation';/, imports);

const hookCode = `  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const { t } = useTranslation();
  
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getCropImage(product.CropCode).then(setImage);
  }, [product.CropCode]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await saveCropImage(product.CropCode, file);
        setImage(base64);
      } catch (err) {
        console.error("Failed to save image", err);
      }
    }
  };`;

pd = pd.replace(/  const \{ isDarkMode \} = useTheme\(\);\n  const \{ language \} = useLanguage\(\);\n  const \{ t \} = useTranslation\(\);/, hookCode);

const imageRender = `<div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className={\`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex items-center justify-center \${
              isDarkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-600'
            }\`}>
              {image ? (
                <img src={image} alt={getCropName()} className="w-full h-full object-cover" />
              ) : (
                <Sprout className="w-8 h-8 sm:w-10 sm:h-10" />
              )}
            </div>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
              <ImagePlus className="w-6 h-6 text-white" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
          </div>`;

pd = pd.replace(/<div className=\{\`p-3 sm:p-4 rounded-xl \$\{\n            isDarkMode \? 'bg-green-900\/50 text-green-400' : 'bg-green-100 text-green-600'\n          \}\`\}>\n            <Sprout className="w-8 h-8 sm:w-10 sm:h-10" \/>\n          <\/div>/, imageRender);

fs.writeFileSync('src/components/ProductDetails.tsx', pd);
