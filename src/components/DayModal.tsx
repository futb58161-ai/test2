import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, CheckCircle, Circle } from 'lucide-react';
import { LearningDay } from './GermanLearningTracker';

interface DayModalProps {
  date: string;
  dayData?: LearningDay;
  onSave: (data: LearningDay) => void;
  onClose: () => void;
  isDark: boolean;
}

export const DayModal: React.FC<DayModalProps> = ({
  date,
  dayData,
  onSave,
  onClose,
  isDark
}) => {
  const [sentences, setSentences] = useState<string[]>([]);
  const [tasks, setTasks] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [notes, setNotes] = useState('');
  const [newSentence, setNewSentence] = useState('');
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    if (dayData) {
      setSentences(dayData.sentences || []);
      setTasks(dayData.tasks || []);
      setNotes(dayData.notes || '');
    } else {
      // Default tasks for new days
      setTasks([
        { id: '1', text: 'Watch Easy German video', completed: false },
        { id: '2', text: 'Practice vocabulary (15 min)', completed: false },
        { id: '3', text: 'Write in German journal', completed: false },
        { id: '4', text: 'Listen to German podcast', completed: false },
      ]);
    }
  }, [dayData]);

  const addSentence = () => {
    if (newSentence.trim()) {
      setSentences([...sentences, newSentence.trim()]);
      setNewSentence('');
    }
  };

  const removeSentence = (index: number) => {
    setSentences(sentences.filter((_, i) => i !== index));
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now().toString(),
        text: newTask.trim(),
        completed: false
      }]);
      setNewTask('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const calculateCompletionRate = () => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  const handleSave = () => {
    const completionRate = calculateCompletionRate();
    onSave({
      date,
      sentences,
      tasks,
      notes,
      completionRate
    });
    onClose();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl ${
        isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">Learning Progress</h2>
              <p className="text-sm opacity-75">{formatDate(date)}</p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors ${
                isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Daily Progress</span>
              <span className="text-sm font-bold">{calculateCompletionRate()}%</span>
            </div>
            <div className={`w-full h-2 rounded-full ${
              isDark ? 'bg-slate-700' : 'bg-gray-200'
            }`}>
              <div
                className="h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300"
                style={{ width: `${calculateCompletionRate()}%` }}
              />
            </div>
          </div>

          {/* German Sentences */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">🇩🇪 German Sentences Learned</h3>
            <div className="space-y-2 mb-3">
              {sentences.map((sentence, index) => (
                <div key={index} className={`flex items-center gap-3 p-3 rounded-xl ${
                  isDark ? 'bg-slate-700' : 'bg-gray-50'
                }`}>
                  <span className="flex-1 text-sm">{sentence}</span>
                  <button
                    onClick={() => removeSentence(index)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSentence}
                onChange={(e) => setNewSentence(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSentence()}
                placeholder="Add a German sentence you learned..."
                className={`flex-1 px-4 py-2 rounded-xl border transition-colors ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                    : 'bg-white border-gray-300 placeholder-gray-500'
                }`}
              />
              <button
                onClick={addSentence}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tasks */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">✅ Daily Tasks</h3>
            <div className="space-y-2 mb-3">
              {tasks.map((task) => (
                <div key={task.id} className={`flex items-center gap-3 p-3 rounded-xl ${
                  isDark ? 'bg-slate-700' : 'bg-gray-50'
                }`}>
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`transition-colors ${
                      task.completed ? 'text-green-500' : 'text-gray-400'
                    }`}
                  >
                    {task.completed ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </button>
                  <span className={`flex-1 text-sm ${
                    task.completed ? 'line-through opacity-75' : ''
                  }`}>
                    {task.text}
                  </span>
                  <button
                    onClick={() => removeTask(task.id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                placeholder="Add a new task..."
                className={`flex-1 px-4 py-2 rounded-xl border transition-colors ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                    : 'bg-white border-gray-300 placeholder-gray-500'
                }`}
              />
              <button
                onClick={addTask}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">📝 Personal Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write your thoughts, reflections, or anything you want to remember about today's learning..."
              rows={4}
              className={`w-full px-4 py-3 rounded-xl border transition-colors resize-none ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                  : 'bg-white border-gray-300 placeholder-gray-500'
              }`}
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-200 font-medium"
          >
            <Save className="w-5 h-5" />
            Save Progress
          </button>
        </div>
      </div>
    </div>
  );
};