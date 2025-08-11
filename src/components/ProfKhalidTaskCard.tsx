import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Check, X, ExternalLink, Play, Pause, GraduationCap, BookOpen, MessageSquare, FileText, Volume2 } from 'lucide-react';
import { TaskData, PomodoroState } from '../types/types';
import { formatDuration, formatTime } from '../utils/taskUtils';

interface ProfKhalidTaskCardProps {
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

export const ProfKhalidTaskCard: React.FC<ProfKhalidTaskCardProps> = ({
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
              <div className="p-2 bg-indigo-500 rounded-lg">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">🧑‍🏫 YouTube lessons with Prof Khalid</h3>
                <p className="text-sm text-gray-500">Gateway to Germany - Structured German lessons</p>
                {task.tags && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {task.tags.split(' ').map((tag, index) => (
                      <span key={index} className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full">
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

        {/* Quick Access to Channel */}
        <div className="mb-4">
          <a
            href="https://www.youtube.com/@gatewaytogermany"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            <GraduationCap className="w-4 h-4" />
            Gateway to Germany Channel
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {expanded && (
          <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-slate-700">
            {/* Lesson Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">📚 Lesson Number/Topic</label>
                <input
                  type="text"
                  value={task.lessonNumber || ''}
                  onChange={(e) => onVideoDataChange(day, task.id, 'lessonNumber', e.target.value)}
                  placeholder="z.B. Lesson 15: Dativ Case"
                  className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                      : 'bg-gray-50 border-gray-300 placeholder-gray-500'
                  }`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">📊 Difficulty Level</label>
                <select
                  value={task.difficultyLevel || ''}
                  onChange={(e) => onVideoDataChange(day, task.id, 'difficultyLevel', e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <option value="">Select Level</option>
                  <option value="A1">A1 - Beginner</option>
                  <option value="A2">A2 - Elementary</option>
                  <option value="B1">B1 - Intermediate</option>
                  <option value="B2">B2 - Upper Intermediate</option>
                  <option value="C1">C1 - Advanced</option>
                  <option value="C2">C2 - Proficient</option>
                </select>
              </div>
            </div>

            {/* Video Link */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Specific Video Link (optional)
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

            {/* Grammar Notes */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                📝 Grammar Points Learned
              </label>
              <textarea
                value={task.grammarNotes || ''}
                onChange={(e) => onVideoDataChange(day, task.id, 'grammarNotes', e.target.value)}
                placeholder="z.B.&#10;• Dativ case with prepositions (mit, nach, bei)&#10;• Word order in subordinate clauses&#10;• Adjective endings with definite articles"
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                  darkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                    : 'bg-gray-50 border-gray-300 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Vocabulary Section */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-green-500" />
                📚 New Vocabulary
              </label>
              <textarea
                value={task.vocabulary || ''}
                onChange={(e) => onVideoDataChange(day, task.id, 'vocabulary', e.target.value)}
                placeholder="z.B.&#10;• der Bahnhof - train station&#10;• die Fahrkarte - ticket&#10;• einsteigen - to get on/board&#10;• umsteigen - to change (trains)&#10;• die Verspätung - delay"
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
                💬 Practice Sentences
              </label>
              <textarea
                value={task.exampleSentences || ''}
                onChange={(e) => onVideoDataChange(day, task.id, 'exampleSentences', e.target.value)}
                placeholder="Write sentences using the new vocabulary:&#10;1. Ich fahre mit dem Zug zum Bahnhof.&#10;2. Die Fahrkarte kostet 15 Euro.&#10;3. Wir müssen in München umsteigen."
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                  darkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                    : 'bg-gray-50 border-gray-300 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Professor's Notes */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-500" />
                🧑‍🏫 Professor's Key Points
              </label>
              <textarea
                value={task.professorNotes || ''}
                onChange={(e) => onVideoDataChange(day, task.id, 'professorNotes', e.target.value)}
                placeholder="Important points Prof Khalid emphasized:&#10;• Remember: Dativ always changes 'der' to 'dem'&#10;• Common mistake: Don't forget verb at the end in subordinate clauses&#10;• Tip: Practice with real-life situations"
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                  darkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                    : 'bg-gray-50 border-gray-300 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Lesson Summary */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-orange-500" />
                📝 Lesson Summary
              </label>
              <textarea
                value={task.videoSummary || ''}
                onChange={(e) => onVideoDataChange(day, task.id, 'videoSummary', e.target.value)}
                placeholder="Summarize today's lesson in German (3-5 sentences)..."
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                  darkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                    : 'bg-gray-50 border-gray-300 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Progress Tracking */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-indigo-50'}`}>
              <h4 className="font-semibold mb-3 text-indigo-700 dark:text-indigo-300">📊 Learning Progress</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-lg font-bold text-indigo-500">
                    {task.pomodoroSessions || 0}
                  </div>
                  <div className="text-gray-500">Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-500">
                    {task.vocabulary ? task.vocabulary.split('\n').filter(line => line.trim()).length : 0}
                  </div>
                  <div className="text-gray-500">Words</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-500">
                    {task.grammarNotes ? task.grammarNotes.split('•').length - 1 : 0}
                  </div>
                  <div className="text-gray-500">Grammar</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-500">
                    {task.difficultyLevel || 'N/A'}
                  </div>
                  <div className="text-gray-500">Level</div>
                </div>
              </div>
            </div>

            {/* Pomodoro Stats */}
            {task.pomodoroSessions && task.pomodoroSessions > 0 && (
              <div className="text-sm text-gray-500">
                🍅 {task.pomodoroSessions} Pomodoro-Sitzungen mit Prof Khalid abgeschlossen
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};