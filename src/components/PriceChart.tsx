import React, { useMemo } from 'react';
import { AgriProduct } from '../types/api';
import { TrendingUp, TrendingDown, Sprout } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import { Line } from 'react-chartjs-2';

interface PriceChartProps {
  product: AgriProduct[];
}

export const PriceChart: React.FC<PriceChartProps> = ({ product }) => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const { t } = useTranslation();
  
  const { latestProduct, priceChange, isPositive, chartData } = useMemo(() => {
    const latest = product[product.length - 1];
    const change = latest.Avg_Price - product[0].Avg_Price;
    const positive = change >= 0;

    const getGradient = (ctx: CanvasRenderingContext2D | null) => {
      if (!ctx) return positive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)';
      
      const gradient = ctx.createLinearGradient(0, 0, 0, 160);
      if (positive) {
        gradient.addColorStop(0, 'rgba(34, 197, 94, 0.2)');
        gradient.addColorStop(1, 'rgba(34, 197, 94, 0.0)');
      } else {
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.2)');
        gradient.addColorStop(1, 'rgba(239, 68, 68, 0.0)');
      }
      return gradient;
    };

    const data = {
      labels: product.map(p => p.TransDate),
      datasets: [
        {
          label: t('price.high'),
          data: product.map(p => p.Upper_Price),
          borderColor: 'rgba(34, 197, 94, 0.4)',
          borderWidth: 1,
          borderDash: [2, 2],
          fill: false,
          pointRadius: 0,
          tension: 0.4,
        },
        {
          label: t('price.average'),
          data: product.map(p => p.Avg_Price),
          borderColor: positive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
          backgroundColor: function(context: any) {
            const ctx = context.chart.ctx;
            return getGradient(ctx);
          },
          tension: 0.4,
          fill: true,
          borderWidth: 2,
          pointRadius: 1,
        },
        {
          label: t('price.low'),
          data: product.map(p => p.Lower_Price),
          borderColor: 'rgba(239, 68, 68, 0.4)',
          borderWidth: 1,
          borderDash: [2, 2],
          fill: false,
          pointRadius: 0,
          tension: 0.4,
        }
      ]
    };

    return {
      latestProduct: latest,
      priceChange: change,
      isPositive: positive,
      chartData: data
    };
  }, [product, language]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false
        }
      },
      y: {
        display: false,
        grid: {
          display: false
        }
      }
    },
    elements: {
      point: {
        radius: 0,
        hitRadius: 0
      },
      line: {
        borderJoinStyle: 'round' as const
      }
    },
    animation: false
  }), []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'zh' ? 'zh-TW' : 'en-US', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatVolume = (volume: number) => {
    return new Intl.NumberFormat(language === 'zh' ? 'zh-TW' : 'en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(volume);
  };

  return (
    <div className={`${
      isDarkMode 
        ? 'bg-gray-800 hover:bg-gray-700' 
        : 'bg-white hover:bg-gray-50'
    } rounded-lg shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <Sprout className={`w-5 h-5 sm:w-6 sm:h-6 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`} />
          </div>
          <div>
            <h3 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {latestProduct.CropName}
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
              {latestProduct.MarketName}
            </p>
          </div>
        </div>
        {isPositive ? (
          <TrendingUp className="text-green-500 w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <TrendingDown className="text-red-500 w-5 h-5 sm:w-6 sm:h-6" />
        )}
      </div>
      
      <div className="relative w-full h-20 sm:h-24 mb-4">
        <Line 
          id={`price-chart-${latestProduct.CropCode}-${latestProduct.MarketCode}`} 
          data={chartData} 
          options={chartOptions} 
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('price.current')}
          </p>
          <p className={`text-lg sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {formatPrice(latestProduct.Avg_Price)}
          </p>
        </div>
        <div>
          <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('price.weekly_change')}
          </p>
          <p className={`text-lg sm:text-2xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{formatPrice(priceChange)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs sm:text-sm">
        <div className={`text-center p-2 sm:p-3 rounded ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('price.high')}
          </p>
          <p className="font-semibold text-green-500">
            {formatPrice(latestProduct.Upper_Price)}
          </p>
        </div>
        <div className={`text-center p-2 sm:p-3 rounded ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('price.mid')}
          </p>
          <p className="font-semibold text-blue-500">
            {formatPrice(latestProduct.Middle_Price)}
          </p>
        </div>
        <div className={`text-center p-2 sm:p-3 rounded ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('price.low')}
          </p>
          <p className="font-semibold text-red-500">
            {formatPrice(latestProduct.Lower_Price)}
          </p>
        </div>
      </div>

      <div className={`mt-4 inline-block px-2 sm:px-3 py-1 rounded-full font-mono text-xs ${
        isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
      }`}>
        #{latestProduct.CropCode}
      </div>
    </div>
  );
};