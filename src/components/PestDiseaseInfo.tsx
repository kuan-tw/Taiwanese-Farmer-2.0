import React, { useState } from 'react';
import { Bug, Shield, Stethoscope, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { PestDiseaseDiagnosis } from '../types/api';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';

interface PestDiseaseInfoProps {
  diagnoses: PestDiseaseDiagnosis[];
}

export const PestDiseaseInfo: React.FC<PestDiseaseInfoProps> = ({ diagnoses }) => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!diagnoses || diagnoses.length === 0) return null;

  const diagnosis = diagnoses[selectedIndex];

  return (
    <div className={`${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    } rounded-lg shadow-lg p-4 sm:p-6 transition-colors duration-200 mx-2 sm:mx-0`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Bug className={`w-5 sm:w-6 h-5 sm:h-6 ${isDarkMode ? 'text-red-400' : 'text-red-500'} flex-shrink-0`} />
          <h3 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} break-words`}>
            {diagnosis.ProductName}
          </h3>
        </div>
        
        {diagnoses.length > 1 && (
          <div className="flex items-center gap-3 sm:ml-auto">
            <button
              onClick={() => setSelectedIndex(prev => Math.max(0, prev - 1))}
              disabled={selectedIndex === 0}
              className={`p-1.5 rounded-md transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {selectedIndex + 1} / {diagnoses.length}
            </span>
            <button
              onClick={() => setSelectedIndex(prev => Math.min(diagnoses.length - 1, prev + 1))}
              disabled={selectedIndex === diagnoses.length - 1}
              className={`p-1.5 rounded-md transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      
      {diagnosis.Type && (
        <p className={`text-xs sm:text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {diagnosis.Type}
        </p>
      )}

      <div className="space-y-4 sm:space-y-6">
        <div className={`p-3 sm:p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className={`w-4 sm:w-5 h-4 sm:h-5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'} flex-shrink-0`} />
            <h4 className={`text-sm sm:text-base font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('epidemic.symptoms')}
            </h4>
          </div>
          <p className={`text-xs sm:text-sm whitespace-pre-line break-words ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {diagnosis.Question}
          </p>
        </div>

        <div className={`p-3 sm:p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Stethoscope className={`w-4 sm:w-5 h-4 sm:h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'} flex-shrink-0`} />
            <h4 className={`text-sm sm:text-base font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('epidemic.diagnosis')}
            </h4>
          </div>
          <p className={`text-xs sm:text-sm whitespace-pre-line break-words ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {diagnosis.Answer}
          </p>
        </div>

        <div className={`p-3 sm:p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Shield className={`w-4 sm:w-5 h-4 sm:h-5 ${isDarkMode ? 'text-green-400' : 'text-green-500'} flex-shrink-0`} />
            <h4 className={`text-sm sm:text-base font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('epidemic.prevention')}
            </h4>
          </div>
          <p className={`text-xs sm:text-sm whitespace-pre-line break-words ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {diagnosis.Provision}
          </p>
        </div>
      </div>
    </div>
  );
};