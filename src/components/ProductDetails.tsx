import React from 'react';
import { Scale, BarChart3, TrendingUp, Package, Building2, Sprout } from 'lucide-react';
import { AgriProduct } from '../types/api';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';

interface ProductDetailsProps {
  product: AgriProduct;
  englishName?: string;
  translatedNames?: Record<string, string>;
  markets?: AgriProduct[];
  onMarketSelect?: (marketCode: string) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ 
  product, 
  englishName, 
  translatedNames,
  markets = [],
  onMarketSelect
}) => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const priceVariation = ((product.Upper_Price - product.Lower_Price) / product.Avg_Price * 100).toFixed(2);
  
  const getCropName = () => {
    if (language === 'zh') return product.CropName;
    
    // Try translated names first
    if (translatedNames && translatedNames[language]) {
      return translatedNames[language];
    }
    
    // For English, try englishName as fallback
    if (language === 'en' && englishName) {
      return englishName;
    }
    
    // Default to original name
    return product.CropName;
  };


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'zh' ? 'zh-TW' : 'en-US', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatVolume = (volume: number) => {
    return new Intl.NumberFormat(language === 'zh' ? 'zh-TW' : 'en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(volume);
  };
  
  return (
    <div className={`${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    } rounded-lg shadow-lg p-4 sm:p-6 transition-colors duration-200 mx-2 sm:mx-0`}>
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-4">
          <div className={`p-3 sm:p-4 rounded-xl ${
            isDarkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-600'
          }`}>
            <Sprout className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
              <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} break-words`}>
                {getCropName()}
              </h2>
              <span className={`text-xs sm:text-sm font-mono px-2 sm:px-3 py-1 rounded-full ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
                #{product.CropCode}
              </span>
            </div>
          </div>
        </div>
        
        <div className={`flex items-center gap-3 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <Building2 className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          {markets.length > 1 ? (
            <select
              value={product.MarketCode}
              onChange={(e) => {
                console.log('Dropdown changed to', e.target.value);
                onMarketSelect?.(e.target.value);
              }}
              className={`block w-full min-w-[120px] pl-3 pr-10 py-2 text-sm sm:text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-md shadow-sm ${
                isDarkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-900 border-gray-300'
              }`}
            >
              {markets.map((m) => (
                <option key={m.MarketCode} value={m.MarketCode}>
                  {m.MarketName}
                </option>
              ))}
            </select>
          ) : (
            <span className={`text-base font-medium px-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              {product.MarketName}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50/50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Package className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('price.volume')}
            </p>
          </div>
          <p className={`text-lg sm:text-xl font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {formatVolume(product.Trans_Quantity)} <span className="text-sm font-normal text-gray-500">kg</span>
          </p>
        </div>

        <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50/50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Scale className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('price.range')}
            </p>
          </div>
          <p className={`text-lg sm:text-xl font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {formatPrice(product.Lower_Price)} - {formatPrice(product.Upper_Price)}
          </p>
        </div>

        <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50/50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('price.variation')}
            </p>
          </div>
          <p className={`text-lg sm:text-xl font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {priceVariation}%
          </p>
        </div>
        
        <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50/50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('price.average')}
            </p>
          </div>
          <p className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} break-words`}>
            {formatPrice(product.Avg_Price)}
          </p>
        </div>
      </div>
    </div>
  );
};