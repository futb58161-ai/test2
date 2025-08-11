import React from 'react';
import { Flame, Sun, Moon, Calendar, Clock, TrendingUp, BookOpen, CalendarDays, User, Library, Play } from 'lucide-react';

interface HeaderProps {
  streak: number;
  todayProgress: number;
  viewMode: 'today' | 'week' | 'progress' | 'plan' | 'calendar' | 'vocabulary' | 'tracker' | 'video-learning';
  darkMode: boolean;
  onViewModeChange: (mode: 'today' | 'week' | 'progress' | 'plan' | 'calendar' | 'vocabulary' | 'tracker' | 'video-learning') => void;
  onDarkModeToggle: () => void;
  onProfileClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  streak,
  todayProgress,
  viewMode,
  darkMode,
  onViewModeChange,
  onDarkModeToggle,
  onProfileClick
}) => {
  return (
    <header className={`${
      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
    } border-b transition-colors duration-300 sticky top-0 z-50`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🇩🇪</span>
            <div>
              <h1 className="text-xl font-bold">German Learning Tracker</h1>
              <p className="text-sm text-gray-500">Deutsch Lern-Tracker</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-medium">{streak} Tage Serie</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${
                  todayProgress === 100 ? 'bg-green-500' : 'bg-blue-500'
                }`} />
                <span className="text-sm font-medium">{todayProgress}% heute</span>
              </div>
            </div>
            
            {/* View Toggle */}
            <div className={`flex rounded-lg p-1 ${
              darkMode ? 'bg-slate-700' : 'bg-gray-100'
            }`}>
              <button
                onClick={() => onViewModeChange('today')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${
                  viewMode === 'today'
                    ? 'bg-blue-500 text-white'
                    : darkMode
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Clock className="w-4 h-4" />
                Heute
              </button>
              <button
                onClick={() => onViewModeChange('week')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${
                  viewMode === 'week'
                    ? 'bg-blue-500 text-white'
                    : darkMode
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Woche
              </button>
              <button
                onClick={() => onViewModeChange('progress')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${
                  viewMode === 'progress'
                    ? 'bg-blue-500 text-white'
                    : darkMode
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Fortschritt
              </button>
              <button
                onClick={() => onViewModeChange('plan')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${
                  viewMode === 'plan'
                    ? 'bg-blue-500 text-white'
                    : darkMode
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Plan
              </button>
              <button
                onClick={() => onViewModeChange('vocabulary')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${
                  viewMode === 'vocabulary'
                    ? 'bg-blue-500 text-white'
                    : darkMode
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Library className="w-4 h-4" />
                Vokabeln
              </button>
              <button
                onClick={() => onViewModeChange('tracker')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${
                  viewMode === 'tracker'
                    ? 'bg-blue-500 text-white'
                    : darkMode
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Tracker
              </button>
            </div>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={onProfileClick}
              className={`p-2 rounded-lg transition-colors ${
                darkMode
                  ? 'bg-slate-700 hover:bg-slate-600 text-blue-400'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              title="User Profile"
            >
              <User className="w-5 h-5" />
            </button>
            
            <button
              onClick={onDarkModeToggle}
              className={`p-2 rounded-lg transition-colors ${
                darkMode
                  ? 'bg-slate-700 hover:bg-slate-600 text-yellow-400'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              title={darkMode ? 'Hell-Modus' : 'Dunkel-Modus'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};