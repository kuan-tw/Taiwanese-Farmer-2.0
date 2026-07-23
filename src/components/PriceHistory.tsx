import React, {  useRef , useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { AgriProduct } from '../types/api';
import { aggregateProductsByDate } from '../utils/marketData';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import { Download } from 'lucide-react';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
);

interface PriceHistoryProps {
  historyData: AgriProduct[];
}

export const PriceHistory: React.FC<PriceHistoryProps> = ({ historyData }) => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const chartRef = useRef<any>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const sortedData = aggregateProductsByDate(historyData).sort((a, b) => 
    new Date(a.TransDate).getTime() - new Date(b.TransDate).getTime()
  );

  // Calculate price estimation using linear regression
  const calculateEstimation = () => {
    const n = sortedData.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = sortedData.map(item => item.Avg_Price);
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Predict next 3 days
    const predictions = Array.from({ length: 3 }, (_, i) => {
      const nextDay = n + i;
      return slope * nextDay + intercept;
    });
    
    return predictions;
  };

  const predictions = sortedData.length >= 2 ? calculateEstimation() : [];
  const lastDate = sortedData.length > 0 ? new Date(sortedData[sortedData.length - 1].TransDate) : new Date();
  const futureDates = Array.from({ length: 3 }, (_, i) => {
    const date = new Date(lastDate);
    date.setDate(date.getDate() + i + 1);
    return date.toISOString().split('T')[0];
  });

  const data = {
    labels: [...sortedData.map(item => item.TransDate), ...futureDates],
    datasets: [
      {
        label: t('price.average'),
        data: [...sortedData.map(item => item.Avg_Price), ...predictions],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        segment: {
          borderDash: (ctx: any) => ctx.p1DataIndex >= sortedData.length - 1 ? [6, 6] : undefined,
        }
      },
      {
        label: t('price.high'),
        data: sortedData.map(item => item.Upper_Price),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
      },
      {
        label: t('price.low'),
        data: sortedData.map(item => item.Lower_Price),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      },
      {
        label: t('price.volume'),
        data: sortedData.map(item => item.Trans_Quantity),
        yAxisID: 'y1',
        type: 'bar' as const,
        backgroundColor: isDarkMode ? 'rgba(168, 85, 247, 0.5)' : 'rgba(168, 85, 247, 0.8)',
        borderColor: isDarkMode ? 'rgba(168, 85, 247, 0.8)' : 'rgba(168, 85, 247, 1)',
        order: 1
      }
    ],
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
          color: isDarkMode ? '#fff' : '#000',
        },
      },
      title: {
        display: true,
        text: t('price.trends'),
        color: isDarkMode ? '#fff' : '#000',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (value === null || value === undefined || isNaN(value)) return null;
            if (context.datasetIndex === 3) {
              return `${label}: ${value.toLocaleString()} kg`;
            }
            return `${label}: ${value.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        position: 'left',
        ticks: {
          color: isDarkMode ? '#fff' : '#000',
          callback: (value: number) => `$${value}`
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      y1: {
        beginAtZero: true,
        position: 'right',
        ticks: {
          color: isDarkMode ? '#fff' : '#000',
          callback: (value: number) => `${value.toLocaleString()} kg`
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      x: {
        ticks: {
          color: isDarkMode ? '#fff' : '#000',
          maxRotation: 45,
          minRotation: 45
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  const handleExportChart = () => {
    if (chartRef.current) {
      const link = document.createElement('a');
      link.download = `price-history-${sortedData[0]?.CropCode}.png`;
      link.href = chartRef.current.canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className={`p-3 sm:p-4 rounded-lg shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'} mx-2 sm:mx-0`}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4">
        <h3 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {t('price.trends')}
        </h3>
        {!isMobile && <button
          onClick={handleExportChart}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm sm:text-base w-full sm:w-auto"
        >
          <Download size={16} />
          {t('actions.export')}
        </button>}
      </div>
                        <div className="w-full overflow-x-auto overflow-y-hidden pb-2">
        <div className="relative min-w-[600px] sm:min-w-0 w-full h-[300px] sm:h-96">
          <Line id="price-history-chart" ref={chartRef} options={options} data={data}  />
        </div>
      </div>
      
      

      <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <h4 className={`text-base sm:text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {t('price.prediction')}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {predictions.map((price, index) => (
            <div key={index} className={`text-center p-2 sm:p-0 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p className="text-xs sm:text-sm">{futureDates[index]}</p>
              <p className="text-base sm:text-lg font-bold text-blue-500">${price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};