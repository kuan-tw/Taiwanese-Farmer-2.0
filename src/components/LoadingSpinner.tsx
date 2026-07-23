import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface LoadingSpinnerProps {
  type?: 'planting' | 'heading_to' | 'epidemic' | 'default';
  marketName?: string;
  cropName?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ type = 'default', marketName, cropName, className = '' }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const [index, setIndex] = useState(0);

  const isImported = cropName?.includes('進口');
  const translationKey = isImported && type === 'planting' ? 'loading.imported' : `loading.${type}`;
  
  const texts = t(translationKey);
  const textArray = Array.isArray(texts) ? texts : [texts as string];

  useEffect(() => {
    setIndex(Math.floor(Math.random() * textArray.length));
  }, [translationKey, textArray.length]);

  let text = textArray[index] || '';

  if (type === 'heading_to' && marketName && text) {
    text = text.replace(/\{market\}/g, marketName);
  }
  
  if ((type === 'planting' || isImported) && cropName && text) {
    text = text.replace(/\{crop\}/g, cropName);
  }

  // Handle case where {crop} or {market} isn't fully replaced yet
  if (text.includes('{crop}')) {
    const genericCrop = {
      zh: '農作物',
      en: 'produce',
      ja: '農産物',
      ko: '농산물',
      id: 'hasil panen',
      ms: 'hasil pertanian',
      th: 'ผลิตผล',
      vi: 'nông sản'
    }[language || 'en'] || 'produce';
    text = text.replace(/\{crop\}/g, genericCrop);
  }

  if (text.includes('{market}')) {
    text = text.replace(/\{market\}/g, t('market.market'));
  }

  return (
    <div className={`flex flex-col justify-center items-center h-64 gap-4 ${className}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-center px-4`}>
        {text}
      </p>
    </div>
  );
};
