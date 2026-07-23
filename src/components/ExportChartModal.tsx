import React, { useState, useEffect, useRef } from 'react';
import { X, Download, Settings, Check } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../context/ThemeContext';

interface ExportChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceCanvas?: HTMLCanvasElement | null;
  chartRef?: React.MutableRefObject<unknown>;
  fileName: string;
}

export const ExportChartModal: React.FC<ExportChartModalProps> = ({
  isOpen,
  onClose,
  sourceCanvas,
  chartRef,
  fileName
}) => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  
  const [background, setBackground] = useState<'transparent' | 'white' | 'dark' | 'theme'>('theme');
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [watermark, setWatermark] = useState<boolean>(true);
  
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const activeCanvas = sourceCanvas || chartRef?.current?.canvas;
    if (!isOpen || !activeCanvas || !previewCanvasRef.current) return;
    
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate dimensions
    const paddingBottom = watermark ? 50 : 0;
    canvas.width = activeCanvas.width;
    canvas.height = activeCanvas.height + paddingBottom;

    // Determine background color
    let bgColor = 'transparent';
    if (background === 'white' || (background === 'theme' && !isDarkMode)) {
      bgColor = '#ffffff';
    } else if (background === 'dark' || (background === 'theme' && isDarkMode)) {
      bgColor = '#1f2937'; // gray-800
    }
    
    if (format === 'jpeg' && bgColor === 'transparent') {
      bgColor = '#ffffff';
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (bgColor !== 'transparent') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw the chart
    
    // Determine text colors for chart if chartRef is provided
    let prevColors = null;
    const isDarkBg = bgColor === '#1f2937' || (bgColor === 'transparent' && isDarkMode);
    const chart = chartRef?.current;
    
    if (chart && chart.options) {
      const textColor = isDarkBg ? '#ffffff' : '#374151';
      const gridColor = isDarkBg ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
      
      prevColors = {
        legend: chart.options.plugins?.legend?.labels?.color,
        title: chart.options.plugins?.title?.color,
        scales: {}
      };
      
      if (chart.options.plugins?.legend?.labels) chart.options.plugins.legend.labels.color = textColor;
      if (chart.options.plugins?.title) chart.options.plugins.title.color = textColor;
      
      if (chart.options.scales) {
        Object.keys(chart.options.scales).forEach(key => {
          const scale = chart.options.scales[key];
          prevColors.scales[key] = {
            ticks: scale.ticks?.color,
            title: scale.title?.color,
            grid: scale.grid?.color
          };
          if (scale.ticks) scale.ticks.color = textColor;
          if (scale.title) scale.title.color = textColor;
          if (scale.grid) scale.grid.color = gridColor;
        });
      }
      chart.update('none');
    }

    ctx.drawImage(activeCanvas, 0, 0);

    if (chart && prevColors) {
      if (chart.options.plugins?.legend?.labels) chart.options.plugins.legend.labels.color = prevColors.legend;
      if (chart.options.plugins?.title) chart.options.plugins.title.color = prevColors.title;
      
      if (chart.options.scales) {
        Object.keys(chart.options.scales).forEach(key => {
          const scale = chart.options.scales[key];
          if (scale.ticks) scale.ticks.color = prevColors.scales[key].ticks;
          if (scale.title) scale.title.color = prevColors.scales[key].title;
          if (scale.grid) scale.grid.color = prevColors.scales[key].grid;
        });
      }
      chart.update('none');
    }


    // Draw watermark
    if (watermark) {
      const textColor = bgColor === '#ffffff' || (bgColor === 'transparent' && !isDarkMode) ? '#374151' : '#ffffff';
      ctx.fillStyle = textColor;
      ctx.font = 'bold 20px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      
      const text = 'Taiwanese Farmer | 台灣農夫';
      ctx.fillText(text, canvas.width - 20, activeCanvas.height + 25);
    }

  }, [isOpen, sourceCanvas, chartRef, background, format, watermark, isDarkMode]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!previewCanvasRef.current) return;
    const link = document.createElement('a');
    
    // Clean up filename extension if needed
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
    link.download = `${nameWithoutExt}.${format}`;
    link.href = previewCanvasRef.current.toDataURL(`image/${format}`, 1.0);
    link.click();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className={`w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        
        {/* Left column: Preview */}
        <div className={`w-full md:w-3/5 p-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r ${isDarkMode ? 'border-gray-700 bg-gray-900/30' : 'border-gray-200 bg-gray-50'}`}>
          <div className="w-full relative rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 shadow-sm flex items-center justify-center bg-checkered">
             {/* CSS pattern for transparency check */}
             <style>{`
               .bg-checkered {
                 background-color: ${isDarkMode ? '#374151' : '#fff'};
                 background-image: linear-gradient(45deg, #808080 25%, transparent 25%), 
                                   linear-gradient(-45deg, #808080 25%, transparent 25%), 
                                   linear-gradient(45deg, transparent 75%, #808080 75%), 
                                   linear-gradient(-45deg, transparent 75%, #808080 75%);
                 background-size: 20px 20px;
                 background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
               }
             `}</style>
             <canvas 
                ref={previewCanvasRef} 
                className="w-full h-auto max-h-[400px] object-contain"
             />
          </div>
        </div>

        {/* Right column: Options */}
        <div className="w-full md:w-2/5 p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <Settings size={20} />
              {t('exportModal.title')}
            </h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <X size={20} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
            </button>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto">
            {/* Background Color */}
            <div className="space-y-3">
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('exportModal.background')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'theme', label: t('exportModal.bg_theme') },
                  { id: 'transparent', label: t('exportModal.bg_transparent'), disabled: format === 'jpeg' },
                  { id: 'white', label: t('exportModal.bg_white') },
                  { id: 'dark', label: t('exportModal.bg_dark') }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    disabled={opt.disabled}
                    onClick={() => setBackground(opt.id as 'transparent' | 'white' | 'dark' | 'theme')}
                    className={`px-3 py-2 text-sm rounded-lg border text-center transition-colors ${
                      background === opt.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                        : opt.disabled
                        ? 'border-gray-200 dark:border-gray-700 text-gray-400 bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
                        : `border-gray-300 dark:border-gray-600 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Format */}
            <div className="space-y-3">
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('exportModal.format')}
              </label>
              <div className="flex gap-2">
                {(['png', 'jpeg'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => {
                      setFormat(fmt);
                      if (fmt === 'jpeg' && background === 'transparent') {
                        setBackground('white');
                      }
                    }}
                    className={`flex-1 py-2 px-4 text-sm rounded-lg border text-center uppercase transition-colors ${
                      format === fmt
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                        : `border-gray-300 dark:border-gray-600 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Watermark */}
            <div className="space-y-3">
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('exportModal.watermark')}
              </label>
              <label onClick={() => setWatermark(!watermark)} className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                watermark 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : `border-gray-300 dark:border-gray-600 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`
              }`}>
                <div className="flex items-center h-5 mt-0.5">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                    watermark ? 'bg-blue-500 border-blue-500' : 'border-gray-400 dark:border-gray-500'
                  }`}>
                    {watermark && <Check size={14} className="text-white" />}
                  </div>
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {t('exportModal.watermark')}
                  </p>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('exportModal.watermark_desc')}
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              <Download size={18} />
              {t('exportModal.download')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
