const fs = require('fs');
let code = fs.readFileSync('src/components/LoadingSpinner.tsx', 'utf8');

code = code.replace(
  "import { useTheme } from '../context/ThemeContext';",
  "import { useTheme } from '../context/ThemeContext';\nimport { useLanguage } from '../context/LanguageContext';"
);

code = code.replace(
  "  const { isDarkMode } = useTheme();",
  "  const { isDarkMode } = useTheme();\n  const { language } = useLanguage();"
);

code = code.replace(
  "[t('language') || 'en']",
  "[language || 'en']"
);

fs.writeFileSync('src/components/LoadingSpinner.tsx', code);
