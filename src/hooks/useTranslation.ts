import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translation';

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (path: string) => {
    return getTranslation(language, path);
  };

  return { t };
};