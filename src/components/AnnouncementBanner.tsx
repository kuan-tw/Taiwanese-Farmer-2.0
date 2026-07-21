import React from 'react';
import { Info, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { Announcement } from '../types/api';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface AnnouncementBannerProps {
  announcement: Announcement;
  onClose?: () => void;
}

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ announcement, onClose }) => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();

  const getIcon = () => {
    switch (announcement.type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBannerStyle = () => {
    const baseStyle = 'rounded-lg shadow-lg backdrop-blur-lg';
    switch (announcement.type) {
      case 'warning':
        return `${baseStyle} ${isDarkMode ? 'bg-amber-900/20' : 'bg-amber-50'}`;
      case 'success':
        return `${baseStyle} ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'}`;
      default:
        return `${baseStyle} ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`;
    }
  };

  return (
    <div className={`${getBannerStyle()} p-4 relative`}>
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {announcement.title}
          </h3>
          <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {announcement.content}
          </p>
          <p className={`mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {language === 'zh' ? '發布時間：' : 'Posted: '}
            {new Date(announcement.created_at).toLocaleString()}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`p-1 rounded-full hover:bg-black/10 ${
              isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};