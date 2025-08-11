import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Edit3, Check, X, ExternalLink, Play, Pause, Square, StickyNote } from 'lucide-react';
import { TaskData, PomodoroState } from '../types/types';
import { formatDuration, formatTime } from '../utils/taskUtils';
import { VideoTaskCard } from './VideoTaskCard';
import { RadioTaskCard } from './RadioTaskCard';
import { ProfKhalidTaskCard } from './ProfKhalidTaskCard';

interface TaskCardProps {
  task: TaskData;
  day: string;
  darkMode: boolean;
  compact?: boolean;
  pomodoroState: PomodoroState | null;
  onTaskComplete: (day: string, taskId: string, completed: boolean) => void;
  onTaskDurationChange: (day: string, taskId: string, duration: number) => void;
  onTaskNotesChange: (day: string, taskId: string, notes: string) => void;
  onVideoDataChange?: (day: string, taskId: string, field: string, value: string) => void;
  onStartPomodoro: (day: string, taskId: string) => void;
  onStopPomodoro: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  day,
  darkMode,
  compact = false,
  pomodoroState,
  onTaskComplete,
  onTaskDurationChange,
  onTaskNotesChange,
  onVideoDataChange,
  onStartPomodoro,
  onStopPomodoro
}) => {
  // Use VideoTaskCard for Interactive Videos
  if (task.id === 'interactive-videos' && onVideoDataChange) {
    return (
      <VideoTaskCard
        task={task}
        day={day}
        darkMode={darkMode}
        pomodoroState={pomodoroState}
        onTaskComplete={onTaskComplete}
        onTaskDurationChange={onTaskDurationChange}
        onVideoDataChange={onVideoDataChange}
        onStartPomodoro={onStartPomodoro}
        onStopPomodoro={onStopPomodoro}
      />
    );
  }

  // Use ProfKhalidTaskCard for Prof Khalid lessons
  if (task.id === 'prof-khalid' && onVideoDataChange) {
    return (
      <ProfKhalidTaskCard
        task={task}
        day={day}
        darkMode={darkMode}
        pomodoroState={pomodoroState}
        onTaskComplete={onTaskComplete}
        onTaskDurationChange={onTaskDurationChange}
        onVideoDataChange={onVideoDataChange}
        onStartPomodoro={onStartPomodoro}
        onStopPomodoro={onStopPomodoro}
      />
    );
  }

  // Use RadioTaskCard for Radio and Podcast Practice
  if (task.id === 'radio-podcast' && onVideoDataChange) {
    return (
      <RadioTaskCard
        task={task}
        day={day}
        darkMode={darkMode}
        pomodoroState={pomodoroState}
        onTaskComplete={onTaskComplete}
        onTaskDurationChange={onTaskDurationChange}
        onVideoDataChange={onVideoDataChange}
        onStartPomodoro={onStartPomodoro}
        onStopPomodoro={onStopPomodoro}
      />
    );
  }
  const [expanded, setExpanded] = useState(false);
  const [editingDuration, setEditingDuration] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [tempDuration, setTempDuration] = useState(task.duration.toString());
  const [tempNotes, setTempNotes] = useState(task.notes || '');

  const isCurrentPomodoro = pomodoroState?.taskId === task.id && pomodoroState?.day === day;

  const handleDurationSave = () => {
    const newDuration = parseInt(tempDuration);
    if (newDuration > 0 && newDuration <= 300) { // Max 5 hours
      onTaskDurationChange(day, task.id, newDuration);
    }
    setEditingDuration(false);
  };

  const handleDurationCancel = () => {
    setTempDuration(task.duration.toString());
    setEditingDuration(false);
  };

  const handleNotesSave = () => {
    onTaskNotesChange(day, task.id, tempNotes);
    setEditingNotes(false);
  };

  const handleNotesCancel = () => {
    setTempNotes(task.notes || '');
    setEditingNotes(false);
  };

  const handlePomodoroToggle = () => {
    if (isCurrentPomodoro && pomodoroState?.isActive) {
      onStopPomodoro();
    } else {
      onStartPomodoro(day, task.id);
    }
  };

  return (
    <div className={`rounded-lg transition-all duration-200 ${
      darkMode 
        ? 'bg-slate-700 border border-slate-600 hover:border-slate-500' 
        : 'bg-gray-50 border border-gray-200 hover:border-gray-300'
    } ${task.completed ? 'opacity-75' : ''} ${isCurrentPomodoro ? 'ring-2 ring-orange-500 ring-opacity-50' : ''}`}>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => onTaskComplete(day, task.id, !task.completed)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                task.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : darkMode
                  ? 'border-slate-400 hover:border-blue-400'
                  : 'border-gray-400 hover:border-blue-400'
              }`}
            >
              {task.completed && <Check className="w-3 h-3" />}
            </button>
            
            <div className="flex items-center gap-2 flex-1">
              <span className="text-lg">{task.emoji}</span>
              <span className={`font-medium text-sm ${task.completed ? 'line-through' : ''}`}>
                {task.name}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Pomodoro Timer */}
            <div className="flex items-center gap-1">
              {isCurrentPomodoro && (
                <span className="text-xs font-mono text-orange-500">
                  {formatTime(pomodoroState.timeLeft)}
                </span>
              )}
              <button
                onClick={handlePomodoroToggle}
                className={`p-1 rounded transition-colors ${
                  isCurrentPomodoro && pomodoroState?.isActive
                    ? 'text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900'
                    : 'text-gray-500 hover:text-orange-500'
                }`}
                title="Pomodoro Timer"
              >
                {isCurrentPomodoro && pomodoroState?.isActive ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-500" />
              {editingDuration ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={tempDuration}
                    onChange={(e) => setTempDuration(e.target.value)}
                    className={`w-16 px-1 py-0.5 text-sm rounded border ${
                      darkMode 
                        ? 'bg-slate-600 border-slate-500 text-white' 
                        : 'bg-white border-gray-300'
                    }`}
                    min="1"
                    max="300"
                  />
                  <span className="text-xs text-gray-500">min</span>
                  <button
                    onClick={handleDurationSave}
                    className="p-0.5 text-green-500 hover:bg-green-100 rounded"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <button
                    onClick={handleDurationCancel}
                    className="p-0.5 text-red-500 hover:bg-red-100 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingDuration(true)}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <span>{formatDuration(task.duration)}</span>
                  <Edit3 className="w-3 h-3" />
                </button>
              )}
            </div>
            
            {!compact && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
              >
                {expanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>
        
        {!compact && expanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-600 space-y-4">
            {/* Description */}
            {task.description && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {task.description}
                </p>
              </div>
            )}

            {/* Notes Section */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <StickyNote className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Notizen</span>
              </div>
              {editingNotes ? (
                <div className="space-y-2">
                  <textarea
                    value={tempNotes}
                    onChange={(e) => setTempNotes(e.target.value)}
                    className={`w-full px-3 py-2 text-sm rounded border resize-none ${
                      darkMode 
                        ? 'bg-slate-600 border-slate-500 text-white' 
                        : 'bg-white border-gray-300'
                    }`}
                    rows={3}
                    placeholder="Notizen hinzufügen..."
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleNotesSave}
                      className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                      Speichern
                    </button>
                    <button
                      onClick={handleNotesCancel}
                      className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                      Abbrechen
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setEditingNotes(true)}
                  className={`p-3 rounded border cursor-text min-h-[60px] ${
                    darkMode 
                      ? 'bg-slate-600 border-slate-500 hover:border-slate-400' 
                      : 'bg-gray-50 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {task.notes ? (
                    <p className="text-sm whitespace-pre-wrap">{task.notes}</p>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Klicken um Notizen hinzuzufügen...</p>
                  )}
                </div>
              )}
            </div>

            {/* Resources */}
            {task.resources && task.resources.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Ressourcen:</p>
                <div className="space-y-2">
                  {task.resources.map((resource, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {resource.type === 'link' && resource.url ? (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {resource.name}
                        </a>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="w-1 h-1 bg-gray-400 rounded-full" />
                          {resource.name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Main Link */}
            {task.link && (
              <div>
                <a
                  href={task.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Link öffnen
                </a>
              </div>
            )}

            {/* Pomodoro Stats */}
            {task.pomodoroSessions && task.pomodoroSessions > 0 && (
              <div className="text-xs text-gray-500">
                🍅 {task.pomodoroSessions} Pomodoro-Sitzungen abgeschlossen
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};