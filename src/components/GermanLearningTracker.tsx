import React, { useState, useEffect } from 'react';
import { Calendar, Plus, BookOpen, CheckCircle, Circle, Flame, Moon, Sun, RotateCcw, Brain, Bell } from 'lucide-react';
import { DayModal } from './DayModal';
import { ReviewMode } from './ReviewMode';
import { StreakCounter } from './StreakCounter';
import { DailyReminder } from './DailyReminder';
import { useLearningData } from '../hooks/useLearningData';
import { useTheme } from '../hooks/useTheme';

export interface LearningDay {
  date: string;
  sentences: string[];
  tasks: { id: string; text: string; completed: boolean }[];
  notes: string;
  completionRate: number;
}

export interface LearningData {
  [date: string]: LearningDay;
}

export const GermanLearningTracker: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showDayModal, setShowDayModal] = useState(false);
  const [showReviewMode, setShowReviewMode] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const { learningData, updateDayData, streak } = useLearningData();
  const { isDark, toggleTheme } = useTheme();

  // Check for daily reminder
  useEffect(() => {
    const lastVisit = localStorage.getItem('lastVisit');
    const today = new Date().toISOString().split('T')[0];
    
    if (lastVisit !== today) {
      const timer = setTimeout(() => setShowReminder(true), 2000);
      localStorage.setItem('lastVisit', today);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setShowDayModal(true);
  };

  const getDayProgress = (date: string): number => {
    const dayData = learningData[date];
    if (!dayData || dayData.tasks.length === 0) return 0;
    
    const completedTasks = dayData.tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / dayData.tasks.length) * 100);
  };

  const hasProgress = (date: string): boolean => {
    const dayData = learningData[date];
    return !!(dayData && (dayData.sentences.length > 0 || dayData.tasks.length > 0 || dayData.notes.trim()));
  };

  const renderCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      const dateStr = current.toISOString().split('T')[0];
      const isCurrentMonth = current.getMonth() === currentMonth;
      const isToday = dateStr === today.toISOString().split('T')[0];
      const progress = getDayProgress(dateStr);
      const hasData = hasProgress(dateStr);

      days.push(
        <button
          key={dateStr}
          onClick={() => handleDateClick(dateStr)}
          className={`
            relative p-2 h-12 rounded-lg transition-all duration-200 text-sm font-medium
            ${isCurrentMonth 
              ? isDark 
                ? 'text-white hover:bg-slate-700' 
                : 'text-gray-900 hover:bg-gray-100'
              : isDark 
                ? 'text-slate-500 hover:bg-slate-800' 
                : 'text-gray-400 hover:bg-gray-50'
            }
            ${isToday 
              ? isDark 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
              : ''
            }
            ${hasData && !isToday 
              ? isDark 
                ? 'bg-green-800 text-green-100' 
                : 'bg-green-100 text-green-800'
              : ''
            }
          `}
        >
          {current.getDate()}
          {hasData && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
              <div className={`w-1 h-1 rounded-full ${
                progress === 100 ? 'bg-green-400' : 'bg-yellow-400'
              }`} />
            </div>
          )}
        </button>
      );
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const today = new Date();
  const currentMonth = monthNames[today.getMonth()];
  const currentYear = today.getFullYear();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className={`rounded-2xl p-6 mb-6 ${
          isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">🇩🇪 German Learning Tracker</h1>
                <p className="text-sm opacity-75">Track your daily progress and build streaks</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <StreakCounter streak={streak} />
              <button
                onClick={() => setShowReviewMode(true)}
                className={`p-2 rounded-xl transition-colors ${
                  isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
                title="Review Mode"
              >
                <Brain className="w-5 h-5" />
              </button>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl transition-colors ${
                  isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className={`p-3 rounded-xl ${
              isDark ? 'bg-slate-700' : 'bg-blue-50'
            }`}>
              <div className="text-lg font-bold text-blue-500">{streak}</div>
              <div className="text-xs opacity-75">Day Streak</div>
            </div>
            <div className={`p-3 rounded-xl ${
              isDark ? 'bg-slate-700' : 'bg-green-50'
            }`}>
              <div className="text-lg font-bold text-green-500">
                {Object.values(learningData).reduce((sum, day) => sum + day.sentences.length, 0)}
              </div>
              <div className="text-xs opacity-75">Sentences Learned</div>
            </div>
            <div className={`p-3 rounded-xl ${
              isDark ? 'bg-slate-700' : 'bg-purple-50'
            }`}>
              <div className="text-lg font-bold text-purple-500">
                {Object.keys(learningData).filter(date => hasProgress(date)).length}
              </div>
              <div className="text-xs opacity-75">Active Days</div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className={`rounded-2xl p-6 ${
          isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {currentMonth} {currentYear}
            </h2>
            <button
              onClick={() => handleDateClick(new Date().toISOString().split('T')[0])}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Today's Progress
            </button>
          </div>

          {/* Week headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-medium opacity-75 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {renderCalendar()}
          </div>
        </div>

        {/* Legend */}
        <div className={`mt-4 p-4 rounded-xl ${
          isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span>Progress Made</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <span>Partial Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showDayModal && (
        <DayModal
          date={selectedDate}
          dayData={learningData[selectedDate]}
          onSave={(data) => updateDayData(selectedDate, data)}
          onClose={() => setShowDayModal(false)}
          isDark={isDark}
        />
      )}

      {showReviewMode && (
        <ReviewMode
          learningData={learningData}
          onClose={() => setShowReviewMode(false)}
          isDark={isDark}
        />
      )}

      {showReminder && (
        <DailyReminder
          onClose={() => setShowReminder(false)}
          onStartLearning={() => {
            setShowReminder(false);
            handleDateClick(new Date().toISOString().split('T')[0]);
          }}
          isDark={isDark}
        />
      )}
    </div>
  );
};