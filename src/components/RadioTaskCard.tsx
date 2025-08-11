import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Check, X, ExternalLink, Play, Pause, Radio, Headphones, FileText, BookOpen } from 'lucide-react';
import { TaskData, PomodoroState } from '../types/types';
import { formatDuration, formatTime } from '../utils/taskUtils';

interface RadioTaskCardProps {
  task: TaskData;
  day: string;
  darkMode: boolean;
  pomodoroState: PomodoroState | null;
  onTaskComplete: (day: string, taskId: string, completed: boolean) => void;
  onTaskDurationChange: (day: string, taskId: string, duration: number) => void;
  onVideoDataChange: (day: string, taskId: string, field: string, value: string) => void;
  onStartPomodoro: (day: string, taskId: string) => void;
  onStopPomodoro: () => void;
}

export const RadioTaskCard: React.FC<RadioTaskCardProps> = ({
  task,
  day,
  darkMode,
  pomodoroState,
  onTaskComplete,
  onTaskDurationChange,
  onVideoDataChange,
  onStartPomodoro,
  onStopPomodoro
}) => {
  const [expanded, setExpanded] = useState(false);
  const [editingDuration, setEditingDuration] = useState(false);
  const [tempDuration, setTempDuration] = useState(task.duration.toString());

  const isCurrentPomodoro = pomodoroState?.taskId === task.id && pomodoroState?.day === day;

  const handleDurationSave = () => {
    const newDuration = parseInt(tempDuration);
    if (newDuration > 0 && newDuration <= 300) {
      onTaskDurationChange(day, task.id, newDuration);
    }
    setEditingDuration(false);
  };

  const handleDurationCancel = () => {
    setTempDuration(task.duration.toString());
    setEditingDuration(false);
  };

  const handlePomodoroToggle = () => {
    if (isCurrentPomodoro && pomodoroState?.isActive) {
      onStopPomodoro();
    } else {
      onStartPomodoro(day, task.id);
    }
  };

  return (
    <div className={`rounded-xl transition-all duration-200 ${
      darkMode 
        ? 'bg-slate-800 border border-slate-700 hover:border-slate-600' 
        : 'bg-white border border-gray-200 hover:border-gray-300'
    } ${task.completed ? 'opacity-75' : ''} ${isCurrentPomodoro ? 'ring-2 ring-orange-500 ring-opacity-50' : ''}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => onTaskComplete(day, task.id, !task.completed)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                task.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : darkMode
                  ? 'border-slate-400 hover:border-blue-400'
                  : 'border-gray-400 hover:border-blue-400'
              }`}
            >
              {task.completed && <Check className="w-4 h-4" />}
            </button>
            
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Radio className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">📻 Radio & Podcast Practice</h3>
                <p className="text-sm text-gray-500">Independent listening practice</p>
                {task.tags && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {task.tags.split(' ').map((tag, index) => (
                      <span key={index} className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Pomodoro Timer */}
            <div className="flex items-center gap-2">
              {isCurrentPomodoro && (
                <span className="text-sm font-mono text-orange-500">
                  {formatTime(pomodoroState.timeLeft)}
                </span>
              )}
              <button
                onClick={handlePomodoroToggle}
                className={`p-2 rounded-lg transition-colors ${
                  isCurrentPomodoro && pomodoroState?.isActive
                    ? 'text-orange-500 bg-orange-100 dark:bg-orange-900'
                    : 'text-gray-500 hover:text-orange-500 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
                title="Pomodoro Timer"
              >
                {isCurrentPomodoro && pomodoroState?.isActive ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500" />
              {editingDuration ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={tempDuration}
                    onChange={(e) => setTempDuration(e.target.value)}
                    className={`w-20 px-2 py-1 text-sm rounded-lg border ${
                      darkMode 
                        ? 'bg-slate-700 border-slate-600 text-white' 
                        : 'bg-white border-gray-300'
                    }`}
                    min="1"
                    max="300"
                  />
                  <span className="text-sm text-gray-500">min</span>
                  <button
                    onClick={handleDurationSave}
                    className="p-1 text-green-500 hover:bg-green-100 rounded"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleDurationCancel}
                    className="p-1 text-red-500 hover:bg-red-100 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingDuration(true)}
                  className="text-sm text-gray-500 hover:text-blue-500 transition-colors"
                >
                  {formatDuration(task.duration)}
                </button>
              )}
            </div>
            
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              {expanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Radio Station Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Radio Station / Podcast</label>
          <input
            type="text"
            value={task.radioStation || ''}
            onChange={(e) => onVideoDataChange(day, task.id, 'radioStation', e.target.value)}
            placeholder="z.B. Deutschlandfunk, Bayern 2, SWR2..."
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${
              darkMode 
                ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                : 'bg-gray-50 border-gray-300 placeholder-gray-500'
            }`}
          />
        </div>

        {expanded && (
          <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-slate-700">
            {/* Topics Discussed */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Headphones className="w-4 h-4 text-purple-500" />
                🎯 3 Topics Discussed
              </label>
              <textarea
                value={task.topicsDiscussed || ''}
                onChange={(e) => onVideoDataChange(day, task.id, 'topicsDiscussed', e.target.value)}
                placeholder="z.B.&#10;1. Deutsche Politik und Wahlen&#10;2. Klimawandel in Europa&#10;3. Neue Technologien in der Medizin"
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                  darkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                    : 'bg-gray-50 border-gray-300 placeholder-gray-500'
                }`}
              />
            </div>

            {/* German Summary */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                📝 German Summary (oral or written)
              </label>
              <textarea
                value={task.germanSummary || ''}
                onChange={(e) => onVideoDataChange(day, task.id, 'germanSummary', e.target.value)}
                placeholder="Schreibe eine kurze Zusammenfassung auf Deutsch über das, was du gehört hast..."
                rows={5}
                className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                  darkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                    : 'bg-gray-50 border-gray-300 placeholder-gray-500'
                }`}
              />
            </div>

            {/* New Words */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-green-500" />
                📚 3 New Words + Meanings
              </label>
              <textarea
                value={task.newWords || ''}
                onChange={(e) => onVideoDataChange(day, task.id, 'newWords', e.target.value)}
                placeholder="z.B.&#10;• die Nachhaltigkeit - sustainability&#10;• der Wandel - change, transformation&#10;• die Herausforderung - challenge"
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                  darkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                    : 'bg-gray-50 border-gray-300 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Resources */}
            {task.resources && task.resources.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-3">📻 Empfohlene Radio Stationen:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {task.resources.map((resource, index) => (
                    <div key={index}>
                      {resource.type === 'link' && resource.url ? (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 p-3 rounded-lg border transition-colors hover:border-purple-500 ${
                            darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <Radio className="w-4 h-4 text-purple-500" />
                          <span className="text-sm">{resource.name}</span>
                          <ExternalLink className="w-3 h-3 text-gray-400" />
                        </a>
                      ) : (
                        <div className={`flex items-center gap-2 p-3 rounded-lg ${
                          darkMode ? 'bg-slate-700' : 'bg-gray-50'
                        }`}>
                          <span className="w-1 h-1 bg-gray-400 rounded-full" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{resource.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pomodoro Stats */}
            {task.pomodoroSessions && task.pomodoroSessions > 0 && (
              <div className="text-sm text-gray-500">
                🍅 {task.pomodoroSessions} Pomodoro-Sitzungen abgeschlossen
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};