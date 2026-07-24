const fs = require('fs');
let pdp = fs.readFileSync('src/pages/ProductDetailPage.tsx', 'utf8');

const oldButton = `<button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-colors border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
          <span className={copied ? "text-green-500 font-medium" : ""}>
            {copied ? t('actions.copied') : t('actions.share')}
          </span>
        </button>`;
        
const newButton = `<button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-colors border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Share2 className="w-4 h-4" />
          <span>
            {t('actions.share')}
          </span>
        </button>`;

pdp = pdp.replace(oldButton, newButton);
fs.writeFileSync('src/pages/ProductDetailPage.tsx', pdp);
console.log('Fixed ProductDetailPage.tsx');
