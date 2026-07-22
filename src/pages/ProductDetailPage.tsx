import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Plus } from 'lucide-react';
import { AgriProduct, PestDiseaseDiagnosis } from '../types/api';
import { ProductDetails } from '../components/ProductDetails';
import { PriceHistory } from '../components/PriceHistory';
import { MarketComparison } from '../components/MarketComparison';
import { CropComparison } from '../components/CropComparison';
import { CropSearch } from '../components/CropSearch';
import { PestDiseaseInfo } from '../components/PestDiseaseInfo';
import { convertToTaiwanDate } from '../utils/date';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';

export function ProductDetailPage() {
  const navigate = useNavigate();
  const { cropCode } = useParams<{ cropCode: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [localMarketCode, setLocalMarketCode] = useState<string | null>(searchParams.get('market'));
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [product, setProduct] = useState<AgriProduct | null>(null);
  const [historyData, setHistoryData] = useState<AgriProduct[]>([]);
  const [markets, setMarkets] = useState<AgriProduct[]>([]);
  const [pestDiseaseData, setPestDiseaseData] = useState<PestDiseaseDiagnosis[]>([]);
  const [loading, setLoading] = useState(true);
  const [englishName, setEnglishName] = useState<string>('');
  const [translatedNames, setTranslatedNames] = useState<Record<string, string>>({});
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [showCropInput, setShowCropInput] = useState(false);
  const [comparisonCrops, setComparisonCrops] = useState<{
    cropCode: string;
    cropName: string;
    data: AgriProduct[];
  }[]>([]);
  const [activeTab, setActiveTab] = useState<'details'|'pest'|'history'|'market'|'compare'>('details');

  useEffect(() => {
    const fetchTranslations = async () => {
      if (!cropCode) return;
      
      try {
        const translationData: Record<string, Record<string, string>> = {};
        const languages = ['en', 'ja', 'ko', 'id', 'ms', 'th', 'vi'];
        
        await Promise.all(languages.map(async (lang) => {
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

        const names: Record<string, string> = {};
        languages.forEach(lang => {
          if (translationData[lang] && translationData[lang][cropCode]) {
            names[lang] = translationData[lang][cropCode];
          }
        });

        setTranslatedNames(names);
      } catch (error) {
        console.error('Error fetching translations:', error);
      }
    };

    fetchTranslations();
  }, [cropCode]);

  useEffect(() => {
    const fetchEnglishName = async () => {
      try {
        const response = await fetch('https://data.moa.gov.tw/api/v1/CropType/');
        const data = await response.json();
        if (data.Data && cropCode) {
          const cropInfo = Object.values(data.Data).find((crop: any) => crop.CropCode === cropCode);
          if (cropInfo) {
            setEnglishName((cropInfo as any).CropName);
          }
        }
      } catch (error) {
        console.error('Error fetching English name:', error);
      }
    };

    fetchEnglishName();
  }, [cropCode]);

  const handleRemoveCrop = (cropCode: string) => {
    setComparisonCrops(prev => prev.filter(crop => crop.cropCode !== cropCode));
  };

  const fetchPestDiseaseData = async (productName: string) => {
    try {
      const baseProductName = productName.split('-')[0];
      const response = await fetch(
        `https://data.moa.gov.tw/api/v1/PestDiseaseDiagnosisServiceType/?ProductName=${encodeURIComponent(baseProductName)}`
      );
      const data = await response.json();
      if (data.Data) {
        setPestDiseaseData(data.Data);
      }
    } catch (error) {
      console.error('Error fetching pest disease data:', error);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const start = convertToTaiwanDate(new Date(startDate));
      const end = convertToTaiwanDate(new Date(endDate));

      // Fetch recent data to get all available markets for this crop
      // We look back 30 days to ensure we catch markets that didn't trade exactly today
      const recentStart = new Date(endDate);
      recentStart.setDate(recentStart.getDate() - 30);
      const recentStartStr = convertToTaiwanDate(recentStart);
      
      const allMarketsResponse = await fetch(
        `https://data.moa.gov.tw/api/v1/AgriProductsTransType/?Start_time=${recentStartStr}&End_time=${end}&CropCode=${cropCode}`
      );
      const allMarketsData = await allMarketsResponse.json();
      
      let uniqueMarkets: AgriProduct[] = [];
      if (allMarketsData.Data) {
        const unique = new Map();
        allMarketsData.Data.forEach((d: AgriProduct) => {
          if (!unique.has(d.MarketCode) || new Date(d.TransDate) > new Date(unique.get(d.MarketCode).TransDate)) {
            unique.set(d.MarketCode, d);
          }
        });
        uniqueMarkets = Array.from(unique.values());
      }
      
      setMarkets(uniqueMarkets);

      // Determine actual marketCode to use
      const targetMarketCode = localMarketCode || (uniqueMarkets.length > 0 ? uniqueMarkets[0].MarketCode : null);

      if (targetMarketCode) {
        // Fetch history specific to the market
        const historyUrl = `https://data.moa.gov.tw/api/v1/AgriProductsTransType/?Start_time=${start}&End_time=${end}&CropCode=${cropCode}&MarketCode=${encodeURIComponent(targetMarketCode)}`;
        const historyResponse = await fetch(historyUrl);
        const historyData = await historyResponse.json();
        
        if (historyData.Data && historyData.Data.length > 0) {
          // Find the most recent entry in the fetched history
          let latestEntry = historyData.Data[0];
          historyData.Data.forEach((d: AgriProduct) => {
             if (new Date(d.TransDate) > new Date(latestEntry.TransDate)) {
                latestEntry = d;
             }
          });
          setProduct(latestEntry);
          setHistoryData(historyData.Data);
          
          setComparisonCrops(prev => {
            const updatedCrops = [...prev];
            const index = updatedCrops.findIndex(crop => crop.cropCode === cropCode);
            if (index !== -1) {
              updatedCrops[index] = {
                ...updatedCrops[index],
                data: historyData.Data
              };
            } else {
              updatedCrops.push({
                cropCode: cropCode!,
                cropName: latestEntry?.CropName || '',
                data: historyData.Data
              });
            }
            return updatedCrops;
          });
        } else {
           // If no history data in range, but we found it in 30 day window
           const marketLatest = uniqueMarkets.find(m => m.MarketCode === targetMarketCode);
           if (marketLatest) {
             setProduct(marketLatest);
           }
           setHistoryData([]);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [cropCode, localMarketCode, startDate, endDate]);

  const fetchComparisonCrop = async (newCropCode: string) => {
    try {
      const start = convertToTaiwanDate(new Date(startDate));
      const end = convertToTaiwanDate(new Date(endDate));

      const response = await fetch(
        `https://data.moa.gov.tw/api/v1/AgriProductsTransType/?Start_time=${start}&End_time=${end}&CropCode=${newCropCode}`
      );
      const data = await response.json();

      if (data.Data && data.Data.length > 0) {
        setComparisonCrops(prev => [
          ...prev,
          {
            cropCode: newCropCode,
            cropName: data.Data[0].CropName,
            data: data.Data
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching comparison crop:', error);
    }
  };

  useEffect(() => {
    if (cropCode) {
      fetchData();
    }
  }, [cropCode, fetchData]);

  useEffect(() => {
    if (product?.CropName) {
      fetchPestDiseaseData(product.CropName);
    }
  }, [product?.CropName]);

  const handleDateChange = () => {
    if (cropCode) {
      fetchData();
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-4 lg:px-0">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-2 sm:mb-4 text-sm sm:text-base"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        {t('actions.back')}
      </button>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : !product ? (
        <div className="text-center py-8 sm:py-12 px-4">
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Product not found
          </p>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-500 hover:text-blue-600 mt-4 inline-flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {t('actions.back')}
          </button>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          <div className="sm:hidden mb-4">
             <select 
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as any)}
                className={`w-full p-3 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
             >
                <option value="details">{language === 'zh' ? '產品資訊' : 'Product Info'}</option>
                {pestDiseaseData.length > 0 && <option value="pest">{language === 'zh' ? '病蟲害診斷' : 'Pest & Disease'}</option>}
                <option value="history">{language === 'zh' ? '歷史價格' : 'Price History'}</option>
                {markets.length > 0 && <option value="market">{language === 'zh' ? '市場比較' : 'Market Comparison'}</option>}
                <option value="compare">{t('crop.comparison') || (language === 'zh' ? '作物比較' : 'Crop Comparison')}</option>
             </select>
          </div>

          <div className={`${activeTab === 'details' ? 'block' : 'hidden'} sm:block`}>
            <ProductDetails 
              product={product} 
              englishName={englishName}
              translatedNames={translatedNames}
              markets={markets}
              onMarketSelect={(newMarketCode) => {
                if (newMarketCode !== localMarketCode) {
                  setLocalMarketCode(newMarketCode);
                  setSearchParams({ market: newMarketCode });
                }
              }}
            />
          </div>
          
          {pestDiseaseData.length > 0 && (
            <div className={`${activeTab === 'pest' ? 'block' : 'hidden'} sm:block space-y-4`}>
              <h2 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} px-2 sm:px-0`}>
                {language === 'zh' ? '病蟲害診斷' : 'Pest & Disease Diagnosis'}
              </h2>
              <div className="w-full">
                <PestDiseaseInfo diagnoses={pestDiseaseData} />
              </div>
            </div>
          )}

          <div className={`${activeTab === 'history' ? 'block' : 'hidden'} sm:block space-y-4 sm:space-y-6`}>
            <div className={`${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } p-3 sm:p-4 rounded-lg shadow transition-colors duration-200 mx-2 sm:mx-0`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label htmlFor="startDate" className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {t('date.start')}
                  </label>
                  <div className="relative">
                    <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-400'
                    }`} />
                    <input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className={`pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-sm sm:text-base ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label htmlFor="endDate" className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {t('date.end')}
                  </label>
                  <div className="relative">
                    <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-400'
                    }`} />
                    <input
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className={`pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-sm sm:text-base ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
                <button
                  onClick={handleDateChange}
                  className={`px-4 py-2 rounded-lg transition-colors text-sm sm:text-base w-full sm:w-auto ${
                    isDarkMode
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {t('date.update')}
                </button>
              </div>
            </div>

            {historyData.length > 0 && <PriceHistory historyData={historyData} />}
          </div>
            
          <div className={`${activeTab === 'market' ? 'block' : 'hidden'} sm:block`}>
            {markets.length > 0 && product && (
              <MarketComparison 
                markets={markets} 
                productName={product.CropName} 
              />
            )}
          </div>
            
          <div className={`${activeTab === 'compare' ? 'block' : 'hidden'} sm:block space-y-4`}>
            {comparisonCrops.length > 0 && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-2 sm:px-0">
                  <h3 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {t('crop.comparison')}
                  </h3>
                  {comparisonCrops.length < 4 && (
                    <button
                      onClick={() => setShowCropInput(true)}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm sm:text-base w-full sm:w-auto"
                    >
                      <Plus size={16} />
                      {t('crop.add')}
                    </button>
                  )}
                </div>

                {showCropInput && (
                  <div className="space-y-4 mb-4 px-2 sm:px-0">
                    <CropSearch onSelect={(code) => {
                      fetchComparisonCrop(code);
                      setShowCropInput(false);
                    }} />
                    <div className="flex flex-col sm:flex-row justify-end gap-2">
                      <button
                        onClick={() => setShowCropInput(false)}
                        className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors text-sm sm:text-base w-full sm:w-auto"
                      >
                        {t('actions.cancel')}
                      </button>
                    </div>
                  </div>
                )}

                <CropComparison 
                  crops={comparisonCrops} 
                  onRemoveCrop={handleRemoveCrop}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}