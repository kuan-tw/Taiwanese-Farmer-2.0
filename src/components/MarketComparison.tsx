import React, { useRef, useMemo } from 'react';
import { AgriProduct } from '../types/api';
import { ArrowUpRight, ArrowDownRight, Minus, Download } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MarketComparisonProps {
  markets: AgriProduct[];
  productName: string;
}

export const MarketComparison: React.FC<MarketComparisonProps> = ({ markets, productName }) => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const chartRef = useRef<any>(null);

  // Deduplicate markets by MarketCode and keep the latest entry
  const uniqueMarkets = useMemo(() => {
    const marketMap = new Map<string, AgriProduct>();
    markets.forEach(market => {
      const existingMarket = marketMap.get(market.MarketCode);
      if (!existingMarket || new Date(market.TransDate) > new Date(existingMarket.TransDate)) {
        marketMap.set(market.MarketCode, market);
      }
    });
    return Array.from(marketMap.values());
  }, [markets]);

  const sortedMarkets = useMemo(() => 
    [...uniqueMarkets].sort((a, b) => b.Avg_Price - a.Avg_Price)
  , [uniqueMarkets]);

  const getPriceIndicator = (price: number, avgPrice: number) => {
    const diff = price - avgPrice;
    if (diff > 0) return <ArrowUpRight className="text-green-500" />;
    if (diff < 0) return <ArrowDownRight className="text-red-500" />;
    return <Minus className="text-gray-500" />;
  };

  const avgPrice = sortedMarkets.reduce((sum, market) => sum + market.Avg_Price, 0) / sortedMarkets.length;

  const colors = [
    { bg: 'rgba(59, 130, 246, 0.7)', border: 'rgb(59, 130, 246)' },
    { bg: 'rgba(34, 197, 94, 0.7)', border: 'rgb(34, 197, 94)' },
    { bg: 'rgba(249, 115, 22, 0.7)', border: 'rgb(249, 115, 22)' },
    { bg: 'rgba(236, 72, 153, 0.7)', border: 'rgb(236, 72, 153)' },
    { bg: 'rgba(234, 179, 8, 0.7)', border: 'rgb(234, 179, 8)' },
    { bg: 'rgba(14, 165, 233, 0.7)', border: 'rgb(14, 165, 233)' },
    { bg: 'rgba(168, 85, 247, 0.7)', border: 'rgb(168, 85, 247)' },
    { bg: 'rgba(20, 184, 166, 0.7)', border: 'rgb(20, 184, 166)' },
    { bg: 'rgba(244, 63, 94, 0.7)', border: 'rgb(244, 63, 94)' },
    { bg: 'rgba(139, 92, 246, 0.7)', border: 'rgb(139, 92, 246)' },
    { bg: 'rgba(239, 68, 68, 0.7)', border: 'rgb(239, 68, 68)' },
    { bg: 'rgba(16, 185, 129, 0.7)', border: 'rgb(16, 185, 129)' }
  ];

  const marketData = {
    labels: sortedMarkets.map(market => market.MarketName),
    datasets: [
      {
        label: t('price.average'),
        data: sortedMarkets.map(market => market.Avg_Price),
        backgroundColor: sortedMarkets.map((_, i) => colors[i % colors.length].bg),
        borderColor: sortedMarkets.map((_, i) => colors[i % colors.length].border),
        borderWidth: 1,
        yAxisID: 'y'
      },
      {
        label: `${t('price.volume')} (kg)`,
        data: sortedMarkets.map(market => market.Trans_Quantity),
        backgroundColor: isDarkMode ? 'rgba(168, 85, 247, 0.3)' : 'rgba(168, 85, 247, 0.4)',
        borderColor: isDarkMode ? 'rgba(168, 85, 247, 0.8)' : 'rgba(168, 85, 247, 1)',
        borderWidth: 1,
        yAxisID: 'y1'
      }
    ]
  };

  const marketOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDarkMode ? '#fff' : '#000'
        }
      },
      title: {
        display: true,
        text: t('market.comparison'),
        color: isDarkMode ? '#fff' : '#000'
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (context.datasetIndex === 1) {
              return `${label}: ${value.toLocaleString()} kg`;
            }
            return `${label}: $${value.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        position: 'left',
        beginAtZero: true,
        ticks: {
          color: isDarkMode ? '#fff' : '#000',
          callback: (value: number) => `$${value}`
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      },
      y1: {
        type: 'linear',
        position: 'right',
        beginAtZero: true,
        ticks: {
          color: isDarkMode ? '#fff' : '#000',
          callback: (value: number) => `${value.toLocaleString()} kg`
        },
        grid: {
          drawOnChartArea: false
        }
      },
      x: {
        ticks: {
          color: isDarkMode ? '#fff' : '#000',
          maxRotation: 45,
          minRotation: 45
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  const handleExportChart = () => {
    if (chartRef.current) {
      const link = document.createElement('a');
      link.download = `${productName}-market-comparison.png`;
      link.href = chartRef.current.canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className={`${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    } rounded-lg shadow-lg p-4 sm:p-6 transition-colors duration-200 mx-2 sm:mx-0`}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4">
        <h3 className={`text-xl font-bold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {t('market.for')} {productName}
        </h3>
        <button
          onClick={handleExportChart}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm sm:text-base w-full sm:w-auto"
        >
          <Download size={16} />
          {t('actions.export')}
        </button>
      </div>

      <div style={{ height: '300px' }} className="relative w-full sm:h-96 mb-6 sm:mb-8">
        <Bar id="market-comparison-chart" ref={chartRef} options={marketOptions} data={marketData}  />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className={isDarkMode ? 'border-gray-700' : 'border-gray-200'}>
              <th className={`text-left py-2 px-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('market.market')}
              </th>
              <th className={`text-right py-2 px-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('price.average')}
              </th>
              <th className={`text-right py-2 px-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('price.volume')} (kg)
              </th>
              <th className={`text-center py-2 px-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                vs. Avg
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedMarkets.map((market) => (
              <tr 
                key={market.MarketCode}
                className={`border-b ${
                  isDarkMode 
                    ? 'border-gray-700' 
                    : 'border-gray-200'
                }`}
              >
                <td className={`py-2 px-1 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-900'
                } break-words`}>
                  {market.MarketName}
                </td>
                <td className={`text-right py-2 px-1 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  ${market.Avg_Price.toFixed(2)}
                </td>
                <td className={`text-right py-2 px-1 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  {market.Trans_Quantity.toLocaleString()}
                </td>
                <td className="flex justify-center py-2 px-1">
                  {getPriceIndicator(market.Avg_Price, avgPrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};