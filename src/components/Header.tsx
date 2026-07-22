import React, { useState } from 'react';
import { Sun, Moon, Languages, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getThemeText = (lang: string) => {
    switch (lang) {
      case 'ja':
        return isDarkMode ? 'ライトモードに切り替え' : 'ダークモードに切り替え';
      case 'ko':
        return isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환';
      case 'id':
        return isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap';
      case 'ms':
        return isDarkMode ? 'Tukar ke Mod Terang' : 'Tukar ke Mod Gelap';
      case 'th':
        return isDarkMode ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด';
      case 'vi':
        return isDarkMode ? 'Chuyển sang Chế độ Sáng' : 'Chuyển sang Chế độ Tối';
      case 'zh':
        return isDarkMode ? '切換至亮色模式' : '切換至暗色模式';
      default:
        return isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }
  };

  const getTitle = (lang: string) => {
    switch (lang) {
      case 'ja':
        return '台湾の農家';
      case 'ko':
        return '대만 농부';
      case 'id':
        return 'Petani Taiwan';
      case 'ms':
        return 'Petani Taiwan';
      case 'th':
        return 'เกษตรกรไต้หวัน';
      case 'vi':
        return 'Nông dân Đài Loan';
      case 'zh':
        return '台灣農夫';
      default:
        return 'Taiwanese Farmer';
    }
  };

  const languages = [
    { code: 'zh', name: '中文' },
    { code: 'en', name: 'English' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'ms', name: 'Bahasa Melayu' },
    { code: 'th', name: 'ภาษาไทย' },
    { code: 'vi', name: 'Tiếng Việt' }
  ];

  return (
    <header className={`${
      isDarkMode ? 'bg-gray-800 text-white' : 'bg-gradient-to-r from-[#00BF63] to-[#7ED957] text-white'
    } shadow-lg sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/images/twfarmer.ico" alt="Logo" className={`w-8 h-8 sm:w-10 sm:h-10 ${isDarkMode ? 'rounded-full' : ''}`} />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
              {getTitle(language)}
            </h1>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center space-x-4">
            <div className="relative group">
              <button
                className="p-2 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2"
                aria-label="Select language"
              >
                <Languages className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-sm sm:text-base">{languages.find(l => l.code === language)?.name}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as 'zh-TW' | 'id' | 'ms' | 'th' | 'vi')}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'
                    } ${language === lang.code ? 'font-bold' : ''}`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5 sm:w-6 sm:h-6" /> : <Moon className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="sm:hidden mt-4 space-y-2">
            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as 'zh-TW' | 'id' | 'ms' | 'th' | 'vi');
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded-lg ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-white/10'
                  } ${language === lang.code ? 'font-bold' : ''}`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                toggleTheme();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 rounded-lg hover:bg-white/10"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-5 h-5" />
                  <span>{getThemeText(language)}</span>
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5" />
                  <span>{getThemeText(language)}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
