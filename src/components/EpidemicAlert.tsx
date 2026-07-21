import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, MapPin, Calendar, ChevronRight } from 'lucide-react';
import { PlantEpidemic } from '../types/api';
import { useTheme } from '../context/ThemeContext';

interface EpidemicAlertProps {
  epidemic: PlantEpidemic;
  index: number;
}

export const EpidemicAlert: React.FC<EpidemicAlertProps> = ({ epidemic, index }) => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/epidemic/${index}`, { state: { epidemic } });
  };

  return (
    <div 
      onClick={handleClick}
      className={`cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl ${
        isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
      } backdrop-blur-lg rounded-xl shadow-xl p-4 sm:p-6 border-l-4 border-amber-500 w-full flex items-center justify-between group`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
        <div className="flex items-center gap-3 sm:block">
          <div className="bg-amber-100 rounded-full p-2 shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className={`text-lg font-semibold break-words sm:hidden line-clamp-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {epidemic.Subject}
          </h3>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`hidden sm:block text-lg font-semibold mb-2 break-words line-clamp-1 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {epidemic.Subject}
          </h3>
          
          <div className="flex flex-wrap gap-4 mt-2 sm:mt-0">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
              <span className={`text-sm truncate ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {epidemic.City}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500 shrink-0" />
              <span className={`text-sm truncate ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {new Date(epidemic.PubDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pl-4 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
        <ChevronRight className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
      </div>
    </div>
  );
};
