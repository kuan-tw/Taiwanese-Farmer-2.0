import React, {  useRef , useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);
import { AgriProduct } from '../types/api';
import { aggregateProductsByDate } from '../utils/marketData';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import { Download } from 'lucide-react';
import { ExportChartModal } from './ExportChartModal';
import { X } from 'lucide-react';

interface CropComparisonProps {
  crops: {
    cropCode: string;
    cropName: string;
    data: AgriProduct[];
  }[];
  onRemoveCrop?: (cropCode: string) => void;
}

export const CropComparison: React.FC<CropComparisonProps> = ({ crops, onRemoveCrop }) => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const chartRef = useRef<any>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const colors = [
    { line: 'rgb(34, 211, 238)', bg: 'rgba(34, 211, 238, 0.1)' },
    { line: 'rgb(251, 146, 60)', bg: 'rgba(251, 146, 60, 0.1)' },
    { line: 'rgb(168, 85, 247)', bg: 'rgba(168, 85, 247, 0.1)' },
    { line: 'rgb(74, 222, 128)', bg: 'rgba(74, 222, 128, 0.1)' },
    { line: 'rgb(244, 114, 182)', bg: 'rgba(244, 114, 182, 0.1)' },
    { line: 'rgb(59, 130, 246)', bg: 'rgba(59, 130, 246, 0.1)' },
    { line: 'rgb(250, 204, 21)', bg: 'rgba(250, 204, 21, 0.1)' },
    { line: 'rgb(14, 165, 233)', bg: 'rgba(14, 165, 233, 0.1)' },
    { line: 'rgb(236, 72, 153)', bg: 'rgba(236, 72, 153, 0.1)' },
    { line: 'rgb(16, 185, 129)', bg: 'rgba(16, 185, 129, 0.1)' },
    { line: 'rgb(249, 115, 22)', bg: 'rgba(249, 115, 22, 0.1)' },
    { line: 'rgb(139, 92, 246)', bg: 'rgba(139, 92, 246, 0.1)' }
  ];

  const aggregatedCrops = crops.map((crop) => ({
    ...crop,
    data: aggregateProductsByDate(crop.data),
  }));

  const allDates = [...new Set(aggregatedCrops.flatMap(crop => 
    crop.data.map(item => item.TransDate)
  ))].sort();

  const datasets = aggregatedCrops.map((crop, index) => ({
    label: crop.cropName,
    data: allDates.map(date => {
      const dataPoint = crop.data.find(d => d.TransDate === date);
      return dataPoint ? dataPoint.Avg_Price : null;
    }),
    borderColor: colors[index % colors.length].line,
    backgroundColor: colors[index % colors.length].bg,
    borderWidth: 2,
    tension: 0.4,
    pointRadius: 4,
    pointHoverRadius: 6,
  }));

  const data = {
    labels: allDates,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 20,
          font: {
            size: 14,
            weight: '500' as const,
          },
          usePointStyle: true,
          color: isDarkMode ? '#fff' : '#000',
        },
      },
      title: {
        display: true,
        text: t('crop.comparison'),
        color: isDarkMode ? '#fff' : '#000',
        font: {
          size: 16,
          weight: '600' as const,
        },
        padding: { bottom: 20 },
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: isDarkMode ? '#fff' : '#000',
        bodyColor: isDarkMode ? '#fff' : '#000',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function(context: any) {
            if (context.parsed.y === null || context.parsed.y === undefined || isNaN(context.parsed.y)) return null;
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDarkMode ? '#fff' : '#000',
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDarkMode ? '#fff' : '#000',
          callback: (value: number) => `$${value}`,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const handleExportChart = () => {
    setIsExportModalOpen(true);
  };

  return (
    <div className={`backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-4 sm:p-6 mx-2 sm:mx-0 ${
      isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'
    }`}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h3 className={`text-lg sm:text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {t('crop.comparison')}
        </h3>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as 'line' | 'bar' | 'area')}
            className={`px-3 py-2 rounded-lg border text-sm transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
          >
            <option value="line">{t('chart.line')}</option>
            <option value="bar">{t('chart.bar')}</option>
            <option value="area">{t('chart.area')}</option>
          </select>
          {!isMobile && <button
            onClick={handleExportChart}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm sm:text-base w-full sm:w-auto"
          >
            <Download size={16} />
            {t('actions.export')}
          </button>}
        </div>

      </div>
                        <div className="w-full overflow-x-auto overflow-y-hidden pb-2">
        <div className="relative min-w-[600px] sm:min-w-0 w-full h-[300px] sm:h-[400px] lg:h-[500px]">
          {chartType === 'bar' ? (
              <Bar id="crop-comparison-chart" ref={chartRef} data={data} options={options} />
            ) : (
              <Line id="crop-comparison-chart" ref={chartRef} data={data} options={options} />
            )}
        </div>
      </div>
      
      
      <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {crops.map((crop, index) => {
          const aggregatedCropData = aggregateProductsByDate(crop.data);
          const avgPrice = aggregatedCropData.reduce((sum, d) => sum + Number(d.Avg_Price || 0), 0) / (aggregatedCropData.length || 1);
          const key = `${crop.cropCode}-${index}`;
          return (
            <div
              key={key}
              className={`relative p-3 sm:p-4 rounded-xl backdrop-blur-xl ${
                isDarkMode ? 'bg-gray-700/50' : 'bg-white/50'
              } shadow-lg group`}
              style={{ borderLeft: `4px solid ${colors[index % colors.length].line}` }}
            >
              {onRemoveCrop && (
                <button
                  onClick={() => onRemoveCrop(crop.cropCode)}
                  className="absolute top-1 sm:top-2 right-1 sm:right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                >
                  <X size={12} className="sm:w-3.5 sm:h-3.5" />
                </button>
              )}
              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} break-words pr-6`}>
                {crop.cropName}
              </p>
              <p className={`text-base sm:text-lg font-semibold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                ${avgPrice.toFixed(2)}
              </p>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('price.average')}
              </p>
                      </div>
          );
        })}
      </div>

      <ExportChartModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        chartRef={chartRef}
        fileName="crop-comparison.png"
      />
    </div>
  );
};