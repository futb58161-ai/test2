import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Check, X, ExternalLink, Play, Pause, Youtube, BookOpen, MessageSquare, FileText, Volume2 } from 'lucide-react';
import { TaskData, PomodoroState } from '../types/types';
import { formatDuration, formatTime } from '../utils/taskUtils';

interface VideoTaskCardProps {
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

export const VideoTaskCard: React.FC<VideoTaskCardProps> = ({
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
              <div className="p-2 bg-red-500 rounded-lg">
                <Youtube className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">🎬 Easy German & Interactive Videos</h3>
                <p className="text-sm text-gray-500">Watch, learn, and practice</p>
                {task.tags && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {task.tags.split(' ').map((tag, index) => (
                      <span key={index} className="text-xs px-2 py-0.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full">
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

        {/* Video Title Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">📺 Video Title or Link</label>
          <input
            type="text"
            value={task.videoTitle || ''}
            onChange={(e) => onVideoDataChange(day, task.id, 'videoTitle', e.target.value)}
            placeholder="z.B. Easy German 456: German Culture & Traditions"
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${
              darkMode 
                ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                : 'bg-gray-50 border-gray-300 placeholder-gray-500'
            }`}
          />
        </div>

        {expanded && (
          <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-slate-700">
            {/* Task Checklist */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-blue-50'}`}>
              <h4 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">🎯 Today's Video Tasks:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Watch 1–2 episodes from Easy German</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Note 5 new expressions</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Practice shadowing (repeat sentences aloud)</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Write 3 sentences using learned expressions</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>(Optional) Comment on the video in German</span>
                </div>
              </div>
            </div>
            {/* Video Link */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Video Link (optional)
              </label>
              <input
                type="url"
                value={task.videoLink || ''}
                onChange={(e) => onVideoDataChange(day, task.id, 'videoLink', e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  darkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                    : 'bg-gray-50 border-gray-300 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Vocabulary Section */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-green-500" />
                📝 5 New Expressions
              </label>
              <textarea
                value={task.vocabulary || ''}
                onChange={(e) => onVideoDataChange(day, task.id, 'vocabulary', e.target.value)}
                placeholder="z.B.&#10;1. sich gewöhnen an - to get used to&#10;2. der Unterschied - difference&#10;3. meiner Meinung nach - in my opinion&#10;4. das macht Sinn - that makes sense&#10;5. übrigens - by the way"
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                  darkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                    : 'bg-gray-50 border-gray-300 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Example Sentences */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                💬 3 Sentences Using Learned Expressions
              </label>
              <textarea
                value={task.exampleSentences || ''}
                onChange={(e) => onVideoDataChange(day, task.id, 'exampleSentences', e.target.value)}
                placeholder="Write 3 sentences using the expressions you learned:&#10;1. Ich muss mich an das deutsche Wetter gewöhnen.&#10;2. Meiner Meinung nach ist Deutsch eine schöne Sprache.&#10;3. Das macht Sinn, übrigens danke für die Erklärung!"
                rows={5}
                className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                  darkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                    : 'bg-gray-50 border-gray-300 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Video Summary */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-500" />
                📝 Kurze Zusammenfassung
              </label>
              <textarea
                value={task.videoSummary || ''}
                onChange={(e) => onVideoDataChange(day, task.id, 'videoSummary', e.target.value)}
                placeholder="Schreibe eine kurze Zusammenfassung des Videos (3-5 Sätze)..."
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                  darkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                    : 'bg-gray-50 border-gray-300 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Grammar Notes */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-orange-500" />
                📚 Grammatik & Aussprache Notizen
              </label>
              <textarea
                value={task.grammarNotes || ''}
                onChange={(e) => onVideoDataChange(day, task.id, 'grammarNotes', e.target.value)}
                placeholder="z.B.&#10;• Akkusativ nach 'gewöhnen an'&#10;• Aussprache: 'Kultur' [kʊlˈtuːɐ̯]&#10;• Wortstellung bei Nebensätzen"
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                  darkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                    : 'bg-gray-50 border-gray-300 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Optional German Comment */}
            <div className={`p-4 rounded-lg border-2 border-dashed ${
              darkMode ? 'border-slate-600 bg-slate-700' : 'border-gray-300 bg-gray-50'
            }`}>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-green-500" />
                💬 Optional: German Comment for Video
              </label>
              <textarea
                value={task.notes || ''}
                onChange={(e) => onVideoDataChange(day, task.id, 'notes', e.target.value)}
                placeholder="Schreibe einen Kommentar auf Deutsch für das Video...&#10;z.B. 'Vielen Dank für das interessante Video! Ich habe viel über deutsche Kultur gelernt. Besonders die Erklärung über... war sehr hilfreich.'"
                rows={3}
                className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                  darkMode 
                    ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400' 
                    : 'bg-white border-gray-300 placeholder-gray-500'
                }`}
              />
            </div>
            {/* Resources */}
            {task.resources && task.resources.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-3">📚 Empfohlene Kanäle:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {task.resources.map((resource, index) => (
                    <div key={index}>
                      {resource.type === 'link' && resource.url ? (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 p-3 rounded-lg border transition-colors hover:border-blue-500 ${
                            darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <Youtube className="w-4 h-4 text-red-500" />
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