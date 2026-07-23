import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { AgriProduct } from '../types/api';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';

interface ProductCardProps {
  cropCode: string;
  product: AgriProduct;
  translatedName: string;
  selectedMarket: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ cropCode, product, translatedName, selectedMarket }) => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  return (
    <Link
      to={`/product/${cropCode}${selectedMarket ? `?market=${selectedMarket}` : ''}`}
      className={`block cursor-pointer ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } rounded-lg shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      <div className={`relative h-48 sm:rounded-t-lg overflow-hidden hidden sm:block ${
        isDarkMode ? 'bg-gradient-to-br from-green-600 to-green-700' : 'bg-gradient-to-br from-green-400 to-green-500'
      }`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sprout className="w-16 h-16 text-white drop-shadow-lg" />
        </div>
        <div className="absolute inset-0 bg-black/10 hover:bg-black/20 transition-colors duration-300"></div>
      </div>

      <div className="p-4 sm:p-8">
        <div className="flex items-center gap-6 mb-6">
          <div>
            <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {translatedName}
            </h3>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {product.MarketName}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('price.high')}
            </p>
            <p className={`text-lg font-semibold text-green-500`}>
              ${Number(product.Upper_Price || 0).toFixed(2)}
            </p>
          </div>
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('price.mid')}
            </p>
            <p className={`text-lg font-semibold text-blue-500`}>
              ${Number(product.Middle_Price || 0).toFixed(2)}
            </p>
          </div>
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('price.low')}
            </p>
            <p className={`text-lg font-semibold text-red-500`}>
              ${Number(product.Lower_Price || 0).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
          <div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('price.average')}
            </p>
            <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              ${Number(product.Avg_Price || 0).toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('price.volume')}
            </p>
            <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {Number(product.Trans_Quantity || 0).toLocaleString()} kg
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
