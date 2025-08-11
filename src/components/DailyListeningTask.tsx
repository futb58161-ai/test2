import React from 'react';
import { X, Play, Pause, Volume2 } from 'lucide-react';

interface DailyListeningTaskProps {
  date: Date;
  darkMode: boolean;
  onClose: () => void;
  showSettings?: boolean;
}

export const DailyListeningTask: React.FC<DailyListeningTaskProps> = ({
  date,
  darkMode,
  onClose,
  showSettings = false
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-md mx-4 shadow-xl`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Daily Listening Task</h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-full hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} transition-colors`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center space-x-3 mb-3">
              <Volume2 className="w-5 h-5 text-blue-500" />
              <span className="font-medium">German Audio Lesson</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={togglePlay}
                className="flex items-center justify-center w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              
              <div className="flex-1">
                <div className={`w-full h-2 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1 text-gray-500">
                  <span>0:00</span>
                  <span>5:30</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>Listen to today's German lesson and practice your pronunciation.</p>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Mark Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};