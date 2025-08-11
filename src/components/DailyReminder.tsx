import React from 'react';
import { Bell, X, BookOpen } from 'lucide-react';

interface DailyReminderProps {
  onClose: () => void;
  onStartLearning: () => void;
  isDark: boolean;
}

export const DailyReminder: React.FC<DailyReminderProps> = ({
  onClose,
  onStartLearning,
  isDark
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`w-full max-w-md p-6 rounded-2xl ${
        isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4">
            <Bell className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-xl font-bold mb-2">Time to Learn German! 🇩🇪</h2>
          <p className="text-sm opacity-75 mb-6">
            Welcome back! Ready to continue your German learning journey today?
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className={`flex-1 px-4 py-2 rounded-xl border transition-colors ${
                isDark 
                  ? 'border-slate-600 hover:bg-slate-700' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              Maybe Later
            </button>
            <button
              onClick={onStartLearning}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              <BookOpen className="w-4 h-4" />
              Let's Learn!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};