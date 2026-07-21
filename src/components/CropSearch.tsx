import React, { useState, useEffect } from 'react';
import { Search, Sprout } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';

interface CropSearchProps {
  onSelect: (cropCode: string) => void;
}

interface CropInfo {
  CropCode: string;
  CropName: string;
  EnglishName?: string;
  imageUrl?: string;
}

let cachedCrops: CropInfo[] | null = null;

export const CropSearch: React.FC<CropSearchProps> = ({ onSelect }) => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [crops, setCrops] = useState<CropInfo[]>([]);
  const [filteredCrops, setFilteredCrops] = useState<CropInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        if (cachedCrops) {
          setCrops(cachedCrops);
          return;
        }

        setIsLoading(true);
        // Fetch Chinese crop data
        const response = await fetch('/api/proxy/AgriProductsTransType/');
        const data = await response.json();

        // Fetch English crop data
        const englishResponse = await fetch('/api/proxy/CropType/');
        const englishData = await englishResponse.json();

        // Create a map of English names
        const englishNames: { [key: string]: string } = {};
        if (englishData.Data) {
          Object.values(englishData.Data).forEach((crop: any) => {
            englishNames[crop.CropCode] = crop.CropName;
          });
        }

        const uniqueCrops = Array.from(
          new Map(
            data.Data?.map((crop: any) => [
              crop.CropCode,
              {
                ...crop,
                EnglishName: englishNames[crop.CropCode]
              }
            ])
          ).values()
        );

        cachedCrops = uniqueCrops;
        setCrops(uniqueCrops);
      } catch (error) {
        console.error('Error fetching crops:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCrops();
  }, []);

  useEffect(() => {
    const filtered = crops.filter(crop => {
      const searchLower = searchTerm.toLowerCase();
      return (
        crop.CropName.toLowerCase().includes(searchLower) ||
        (crop.EnglishName && crop.EnglishName.toLowerCase().includes(searchLower)) ||
        crop.CropCode.includes(searchTerm)
      );
    });
    setFilteredCrops(filtered.slice(0, 5));
  }, [searchTerm, crops]);

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('search.crop')}
          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
        />
      </div>

      {searchTerm && filteredCrops.length > 0 && (
        <div className={`absolute z-50 w-full mt-1 rounded-lg shadow-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          {filteredCrops.map((crop) => (
            <button
              key={crop.CropCode}
              onClick={() => {
                onSelect(crop.CropCode);
                setSearchTerm('');
              }}
              className={`w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white ${
                isDarkMode ? 'text-white hover:bg-blue-600' : 'text-gray-900'
              } first:rounded-t-lg last:rounded-b-lg`}
            >
              <div className="flex items-center gap-3">
                <div className={`relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center ${
                  isDarkMode ? 'bg-gradient-to-br from-green-600 to-green-700' : 'bg-gradient-to-br from-green-400 to-green-500'
                }`}>
                  <Sprout className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="truncate font-medium">
                    {language === 'zh' ? crop.CropName : (crop.EnglishName || crop.CropName)}
                  </span>
                  <span className="text-sm opacity-60">#{crop.CropCode}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {isLoading && (
        <div className={`absolute z-10 w-full mt-1 rounded-lg shadow-lg ${
          isDarkMode ? 'bg-gray-700' : 'bg-white'
        } p-4 text-center`}>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      )}
    </div>
  );
};