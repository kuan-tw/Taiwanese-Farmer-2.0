import React, { useState, useEffect } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { PlantEpidemic } from '../types/api';
import { EpidemicAlert } from './EpidemicAlert';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';

export const EpidemicList: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [epidemics, setEpidemics] = useState<PlantEpidemic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEpidemics = async () => {
      try {
        setLoading(true);
        const currentYear = new Date().getFullYear();
        const response = await fetch(
          `https://data.moa.gov.tw/api/v1/PlantEpidemicType/?Year=${currentYear}`
        );
        const data = await response.json();
        
        if (data.Data) {
          setEpidemics(data.Data);
        } else {
          setError(t('epidemic.no_info'));
        }
      } catch (error) {
        setError(t('epidemic.no_info'));
      } finally {
        setLoading(false);
      }
    };

    fetchEpidemics();
  }, [language]);

  const filteredEpidemics = epidemics.filter(epidemic =>
    epidemic.PlantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    epidemic.City.toLowerCase().includes(searchTerm.toLowerCase()) ||
    epidemic.Subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-full">
      <div className="relative mb-6">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`} />
        <input
          type="text"
          placeholder={t('search.plant')}
          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredEpidemics.length === 0 ? (
        <div className={`text-center py-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <p>{t('epidemic.no_info')}</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredEpidemics.map((epidemic, index) => (
            <div key={`${epidemic.PubDate}-${index}`} className="w-full">
              <EpidemicAlert epidemic={epidemic} index={index} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};