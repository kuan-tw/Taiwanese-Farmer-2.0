import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { AgriProduct } from '../types/api';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../context/ThemeContext';
import { aggregateProductsByDate } from '../utils/marketData';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: AgriProduct | null;
  historyData: AgriProduct[];
  marketName?: string;
  url: string;
}

const generateSparkline = (data: number[]) => {
  if (data.length === 0) return '';
  const min = Math.min(...data);
  const max = Math.max(...data);
  if (min === max) return data.map(() => '一').join('');
  
  const ticks = [' ', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
  return data.map(v => {
    const tickIndex = Math.round(((v - min) / (max - min)) * (ticks.length - 1));
    return ticks[tickIndex];
  }).join('');
};

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, product, historyData, marketName, url }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !product) return null;

  const aggregatedData = aggregateProductsByDate(historyData);
  const recentData = aggregatedData.slice(-7);
  const prices = recentData.map(d => Number(d.Avg_Price || 0));
  const sparkline = generateSparkline(prices);
  
  const change = prices.length >= 2 ? ((prices[prices.length - 1] - prices[prices.length - 2]) / prices[prices.length - 2]) * 100 : 0;
  const changeStr = change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  
  const shareText = `📊 ${product.CropName} ${marketName ? `(${marketName})` : ''}\n💰 ${t('shareModal.avgPrice')}: $${Number(product.Avg_Price || 0).toFixed(1)} (${changeStr})\n📉 ${t('shareModal.priceRange')}: $${Number(product.Lower_Price || 0).toFixed(1)} - $${Number(product.Upper_Price || 0).toFixed(1)}\n📦 ${t('shareModal.volume')}: ${Number(product.Trans_Quantity || 0).toLocaleString()} kg\n📈 ${t('shareModal.trend')}: ${sparkline}\n🔗 ${url}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.CropName} 市場行情`,
          text: shareText,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className={`w-full max-w-md rounded-2xl shadow-xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Share2 size={20} />
            {t('shareModal.title')}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <X size={20} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('shareModal.preview')}
            </label>
            <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'} whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-200`}>
              {shareText}
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={handleCopy}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                copied 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? t('shareModal.copiedText') : t('shareModal.copyText')}
            </button>
            
            {navigator.share && (
              <button
                onClick={handleNativeShare}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium border transition-colors ${
                  isDarkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Share2 size={18} />
                {t('shareModal.nativeShare')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
