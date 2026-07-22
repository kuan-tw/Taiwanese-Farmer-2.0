import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, AlertTriangle, Calendar, Sprout, Filter, SlidersHorizontal } from 'lucide-react';
import { AgriProduct, Market } from '../types/api';
import { EpidemicList } from '../components/EpidemicList';
import { convertToTaiwanDate } from '../utils/date';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';

interface ProductData {
  [key: string]: AgriProduct[];
}

interface MarketCategory {
  type: string;
  name: string;
  url: string;
}

interface TranslationData {
  [cropCode: string]: string;
}

const marketCategories: MarketCategory[] = [
  { type: 'Veg', name: '蔬菜市場', url: 'https://data.moa.gov.tw/api/v1/CropMarketType/?CropMarketType=Veg' },
  { type: 'Fruit', name: '水果市場', url: 'https://data.moa.gov.tw/api/v1/CropMarketType/?CropMarketType=Fruit' },
  { type: 'Flower', name: '花卉市場', url: 'https://data.moa.gov.tw/api/v1/CropMarketType/?CropMarketType=Flower' },
  { type: 'ComVegFruit', name: '綜合蔬果市場', url: 'https://data.moa.gov.tw/api/v1/CropMarketType/?CropMarketType=ComVegFruit' },
  { type: 'ComFlower', name: '綜合花卉市場', url: 'https://data.moa.gov.tw/api/v1/CropMarketType/?CropMarketType=ComFlower' },
];

export function ProductList() {
  const location = useLocation();
  const [productData, setProductData] = useState<ProductData>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEpidemics, setShowEpidemics] = useState(location.state?.showEpidemics || false);
  const [showFilters, setShowFilters] = useState(false);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<string>('');
  const [selectedMarketType, setSelectedMarketType] = useState<string>('');
  const [translations, setTranslations] = useState<{[lang: string]: TranslationData}>({});
  const [visibleCount, setVisibleCount] = useState(30);
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    const loadTranslations = async () => {
      const langs = ['en', 'ja', 'ko', 'id', 'ms', 'th', 'vi'];
      const translationData: {[lang: string]: {[cropCode: string]: string}} = {};
      
      try {
        await Promise.all(langs.map(async (lang) => {
          try {
            const response = await fetch(`${import.meta.env.BASE_URL}translation/translated_${lang}.json`);
            if (response.ok) {
              const data = await response.json();
              translationData[lang] = data;
            }
          } catch (error) {
            console.warn(`Failed to load ${lang} translations:`, error);
          }
        }));
        
        setTranslations(translationData);
      } catch (error) {
        console.error('Error loading translations:', error);
      }
    };

    loadTranslations();
  }, []);

  const getTranslatedCropName = (cropCode: string, originalName: string) => {
    if (language === 'zh') return originalName;
    
    // For English, try to get from translations first
    if (language === 'en' && translations[language] && translations[language][cropCode]) {
      return translations[language][cropCode];
    }
    
    // For other languages, get from translations
    if (translations[language] && translations[language][cropCode]) {
      return translations[language][cropCode];
    }
    
    return originalName;
  };

  const fetchMarkets = async (type: string) => {
    try {
      const category = marketCategories.find(cat => cat.type === type);
      if (!category) return;

      const response = await fetch(category.url);
      const data = await response.json();
      if (data.Data) {
        setMarkets(data.Data);
      }
    } catch (error) {
      console.error('Error fetching markets:', error);
    }
  };

  useEffect(() => {
    if (selectedMarketType) {
      fetchMarkets(selectedMarketType);
    }
  }, [selectedMarketType]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setVisibleCount(30);
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 2);

        const dates = Array.from({ length: 3 }, (_, i) => {
          const date = new Date(startDate);
          date.setDate(date.getDate() + i);
          return convertToTaiwanDate(date);
        });

        let url = `https://data.moa.gov.tw/api/v1/AgriProductsTransType/?Start_time=${dates[0]}&End_time=${dates[dates.length - 1]}`;
        if (selectedMarket) {
          url += `&MarketCode=${selectedMarket}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        
        const organizedData: ProductData = {};
        
        if (data.Data) {
          data.Data.forEach((product: AgriProduct) => {
            if (!organizedData[product.CropCode]) {
              organizedData[product.CropCode] = [];
            }
            organizedData[product.CropCode].push(product);
          });
        }

        setProductData(organizedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMarket]);

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('.');
    return `${year.padStart(3, '0')}/${month}/${day}`;
  };

  const displayedProducts = Object.entries(productData)
    .filter(([_, products]) => {
      const product = products[0];
      const translatedName = getTranslatedCropName(product.CropCode, product.CropName);
      return searchTerm
        ? product.CropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.MarketName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.CropCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          translatedName.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
    });

  const visibleProducts = displayedProducts.slice(0, visibleCount);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder={t('search.product')}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setVisibleCount(30);
              }}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors w-full sm:w-auto ${
              showFilters
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            {t('actions.advanced')}
          </button>
          <button
            onClick={() => setShowEpidemics(!showEpidemics)}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors w-full sm:w-auto ${
              showEpidemics
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
            {t('epidemic.info')}
          </button>
        </div>

        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('market.type')}
              </label>
              <div className="relative">
                <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <select
                  value={selectedMarketType}
                  onChange={(e) => {
                    setSelectedMarketType(e.target.value);
                    setSelectedMarket('');
                  }}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">{t('market.all_types')}</option>
                  {marketCategories.map(category => (
                    <option key={category.type} value={category.type}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex-1">
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('market.market')}
              </label>
              <div className="relative">
                <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <select
                  value={selectedMarket}
                  onChange={(e) => setSelectedMarket(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">{t('market.all_markets')}</option>
                  {markets.map(market => (
                    <option key={market.MarketCode} value={market.MarketCode}>
                      {market.MarketName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {showEpidemics ? (
        <div className="overflow-x-hidden">
          <EpidemicList />
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
              {t('date.latest')}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {visibleProducts.map(([cropCode, products]) => {
              const product = products[0];
              const translatedName = getTranslatedCropName(cropCode, product.CropName);
              
              return (
                <Link
                  key={cropCode}
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
                          ${product.Upper_Price.toFixed(2)}
                        </p>
                      </div>
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {t('price.mid')}
                        </p>
                        <p className={`text-lg font-semibold text-blue-500`}>
                          ${product.Middle_Price.toFixed(2)}
                        </p>
                      </div>
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {t('price.low')}
                        </p>
                        <p className={`text-lg font-semibold text-red-500`}>
                          ${product.Lower_Price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {t('price.average')}
                        </p>
                        <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          ${product.Avg_Price.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {t('price.volume')}
                        </p>
                        <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {product.Trans_Quantity.toLocaleString()} kg
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-mono px-3 py-1.5 rounded-full ${
                        isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        #{product.CropCode}
                      </span>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatDate(product.TransDate)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          {visibleProducts.length < displayedProducts.length && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + 30)}
                className="rounded-lg bg-blue-500 px-5 py-3 text-white transition-colors hover:bg-blue-600"
              >
                顯示更多
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}