import React, { useState, useEffect } from 'react';
import { TaskCard } from './TaskCard';
import { VocabularyBankView } from './VocabularyBankView';
import { DailyListeningTask } from './DailyListeningTask';
import { TaskData, PomodoroState } from '../types/types';
import { getDayName } from '../utils/taskUtils';

interface TodayViewProps {
  day: string;
  data: { tasks: TaskData[] };
  progress: number;
  totalTime: string;
  darkMode: boolean;
  pomodoroState: PomodoroState | null;
  onTaskComplete: (day: string, taskId: string, completed: boolean) => void;
  onTaskDurationChange: (day: string, taskId: string, duration: number) => void;
  onTaskNotesChange: (day: string, taskId: string, notes: string) => void;
  onVideoDataChange: (day: string, taskId: string, field: string, value: string) => void;
  onStartPomodoro: (day: string, taskId: string) => void;
  onStopPomodoro: () => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  day,
  data,
  progress,
  totalTime,
  darkMode,
  pomodoroState,
  onTaskComplete,
  onTaskDurationChange,
  onTaskNotesChange,
  onVideoDataChange,
  onStartPomodoro,
  onStopPomodoro
}) => {
  const completedTasks = data.tasks.filter(task => task.completed).length;
  const currentDay = new Date().toLocaleDateString('de-DE', { weekday: 'long' });
  const [dailyReflection, setDailyReflection] = useState('');
  const [showVocabularyBank, setShowVocabularyBank] = useState(false);
  const [showListeningTask, setShowListeningTask] = useState(false);
  const [listeningProgress, setListeningProgress] = useState<any>(null);

  // Load daily reflection from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`reflection_${new Date().toISOString().split('T')[0]}`);
    if (stored) {
      setDailyReflection(stored);
    }
  }, []);

  // Load listening progress
  useEffect(() => {
    const stored = localStorage.getItem(`listeningProgress_${new Date().toISOString().split('T')[0]}`);
    if (stored) {
      try {
        setListeningProgress(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading listening progress:', error);
      }
    }
  }, []);

  // Save daily reflection to localStorage
  const saveDailyReflection = (reflection: string) => {
    setDailyReflection(reflection);
    localStorage.setItem(`reflection_${new Date().toISOString().split('T')[0]}`, reflection);
  };
  
  if (showVocabularyBank) {
    return (
      <VocabularyBankView
        darkMode={darkMode}
        onClose={() => setShowVocabularyBank(false)}
      />
    );
  }
  
  if (showListeningTask) {
    return <DailyListeningTask date={new Date().toISOString().split('T')[0]} darkMode={darkMode} onClose={() => setShowListeningTask(false)} showSettings={false} />;
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className={`rounded-xl p-6 mb-6 ${
        darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold">
              {getDayName(day)}
            </h2>
            <p className="text-gray-500 text-sm">
              {day === 'today' ? currentDay : getDayName(day)} - Deutsch Lernen
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Fortschritt</div>
            <div className="text-3xl font-bold text-blue-500">{progress}%</div>
            <div className="text-xs text-gray-500 mt-1">
              {completedTasks}/{data.tasks.length} Tasks = {progress}%
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>{completedTasks} von {data.tasks.length} Aufgaben erledigt</span>
          <span>Gesamtzeit: {totalTime}</span>
        </div>
        
        <div className={`w-full rounded-full h-3 ${
          darkMode ? 'bg-slate-700' : 'bg-gray-200'
        }`}>
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Weekly Progress Indicator */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">🎯 Weekly Progress</span>
            <span className="text-sm text-gray-500">30/36 tasks = 83%</span>
          </div>
          <div className={`w-full rounded-full h-2 ${
            darkMode ? 'bg-slate-700' : 'bg-gray-200'
          }`}>
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: '83%' }}
            />
          </div>
        </div>
      </div>
      
      {/* Daily Listening Task */}
      <div className={`rounded-xl p-4 mb-4 ${
        darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <span className="text-white text-lg">🎧</span>
            </div>
            <div>
              <h3 className="font-semibold">Daily Listening Practice</h3>
              <p className="text-sm text-gray-500">4-stage video learning experience</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {listeningProgress && (
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map(stage => (
                  <div key={stage} className={`w-2 h-2 rounded-full ${
                    listeningProgress.completedStages?.[stage - 1] 
                      ? 'bg-green-500' 
                      : darkMode ? 'bg-slate-600' : 'bg-gray-300'
                  }`} />
                ))}
              </div>
            )}
            <button
              onClick={() => setShowListeningTask(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              {listeningProgress?.completed ? 'Review' : 'Start'}
            </button>
            <button
              onClick={() => setShowListeningTask(true)}
              className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm"
              title="Edit Content"
            >
              ⚙️ Edit
            </button>
          </div>
        </div>
        {listeningProgress && (
          <div className="mt-3">
            <div className={`w-full rounded-full h-2 ${
              darkMode ? 'bg-slate-700' : 'bg-gray-200'
            }`}>
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(listeningProgress.completedStages?.filter(Boolean).length || 0) / 4 * 100}%` 
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {listeningProgress.completedStages?.filter(Boolean).length || 0}/4 stages completed
            </p>
          </div>
        )}
      </div>
      
      <div className="grid gap-4">
        {data.tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            day={day}
            darkMode={darkMode}
            pomodoroState={pomodoroState}
            onTaskComplete={onTaskComplete}
            onTaskDurationChange={onTaskDurationChange}
            onTaskNotesChange={onTaskNotesChange}
            onVideoDataChange={onVideoDataChange}
            onStartPomodoro={onStartPomodoro}
            onStopPomodoro={onStopPomodoro}
          />
        ))}
      </div>
      
      {/* Daily Reflection */}
      <div className={`rounded-xl p-6 mt-6 ${
        darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
      }`}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          💭 Daily Reflection
        </h3>
        <p className="text-sm text-gray-500 mb-3">What did I learn today? (Write 2 lines)</p>
        <textarea
          value={dailyReflection}
          onChange={(e) => saveDailyReflection(e.target.value)}
          placeholder="z.B. Heute habe ich 5 neue Ausdrücke aus Easy German gelernt. Besonders interessant war die Erklärung über deutsche Kultur..."
          rows={3}
          className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
            darkMode 
              ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
              : 'bg-gray-50 border-gray-300 placeholder-gray-500'
          }`}
        />
      </div>
      
      {/* Vocabulary Bank Preview */}
      <div className={`rounded-xl p-6 mt-6 ${
        darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            📁 My Vocabulary Bank
          </h3>
          <button 
            onClick={() => setShowVocabularyBank(true)}
            className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
          >
            View All →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">sich gewöhnen an</span>
              <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">B1</span>
            </div>
            <p className="text-sm text-gray-500">to get used to</p>
            <p className="text-xs text-gray-400 mt-1">Ich muss mich an das Wetter gewöhnen.</p>
          </div>
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">meiner Meinung nach</span>
              <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full">idiom</span>
            </div>
            <p className="text-sm text-gray-500">in my opinion</p>
            <p className="text-xs text-gray-400 mt-1">Meiner Meinung nach ist das richtig.</p>
          </div>
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">die Nachhaltigkeit</span>
              <span className="text-xs px-2 py-0.5 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full">B2</span>
            </div>
            <p className="text-sm text-gray-500">sustainability</p>
            <p className="text-xs text-gray-400 mt-1">Nachhaltigkeit ist wichtig.</p>
          </div>
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">übrigens</span>
              <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">A2</span>
            </div>
            <p className="text-sm text-gray-500">by the way</p>
            <p className="text-xs text-gray-400 mt-1">Übrigens, danke für deine Hilfe!</p>
          </div>
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">das macht Sinn</span>
              <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full">expr</span>
            </div>
            <p className="text-sm text-gray-500">that makes sense</p>
            <p className="text-xs text-gray-400 mt-1">Deine Erklärung macht Sinn.</p>
          </div>
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">die Gemütlichkeit</span>
              <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full">culture</span>
            </div>
            <p className="text-sm text-gray-500">coziness, comfort</p>
            <p className="text-xs text-gray-400 mt-1">Deutsche Cafés haben Gemütlichkeit.</p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-500">47</div>
              <div className="text-xs text-gray-500">Total Words</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-500">23</div>
              <div className="text-xs text-gray-500">B1-B2 Level</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-500">5</div>
              <div className="text-xs text-gray-500">Added Today</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};