import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Calendar, Pill } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import { PlantEpidemic } from '../types/api';

export function EpidemicDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  
  const epidemic = location.state?.epidemic as PlantEpidemic;

  if (!epidemic) {
    return (
      <div className="text-center py-12">
        <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          資訊不存在
        </p>
        <button
          onClick={() => navigate('/', { state: { showEpidemics: true } })}
          className="text-blue-500 hover:text-blue-600 mt-4 inline-flex items-center"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          {t('actions.back')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/', { state: { showEpidemics: true } })}
        className="inline-flex items-center text-blue-500 hover:text-blue-600 text-sm sm:text-base"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        {t('actions.back')}
      </button>

      <div className={`${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } rounded-xl shadow-xl p-6 sm:p-8 border-t-4 border-amber-500`}>
        <h1 className={`text-2xl sm:text-3xl font-bold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {epidemic.Subject}
        </h1>

        <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-500" />
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
              {epidemic.City}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
              {new Date(epidemic.PubDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('epidemic.affected_plant')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {epidemic.PlantName.split(/[,、]/).map((plant, index) => {
              const trimmed = plant.trim();
              return trimmed ? (
                <span key={index} className="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-4 py-1.5 text-sm">
                  {trimmed}
                </span>
              ) : null;
            })}
          </div>
        </div>

        <div className={`prose max-w-none mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <p className="whitespace-pre-line leading-relaxed">{epidemic.Body}</p>
        </div>

        {epidemic.Prescription && (
          <div className={`mt-6 p-6 rounded-xl ${
            isDarkMode ? 'bg-gray-700/50' : 'bg-amber-50'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <Pill className="w-5 h-5 text-blue-500" />
              <h3 className={`text-lg font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {t('epidemic.treatment')}
              </h3>
            </div>
            <p className={`whitespace-pre-line leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {epidemic.Prescription.split(/(https?:\/\/[^\s)]+)/g).map((part, i) => {
                if (part.match(/(https?:\/\/[^\s)]+)/)) {
                  return (
                    <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 underline break-all">
                      {part}
                    </a>
                  );
                }
                return part;
              })}
            </p>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-right text-gray-500">
          {t('epidemic.issued_by')}{epidemic.Issue}
        </div>
      </div>
    </div>
  );
}
