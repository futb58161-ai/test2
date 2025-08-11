import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { ChevronLeft, ChevronRight, Save, Download, Upload, Trash2, X } from 'lucide-react';
import { DailyProgress, VideoProgress } from '../types/types';
import 'react-calendar/dist/Calendar.css';

interface CalendarViewProps {
  darkMode: boolean;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ darkMode }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showModal, setShowModal] = useState(false);
  const [dailyProgress, setDailyProgress] = useState<{ [key: string]: DailyProgress }>({});
  const [currentProgress, setCurrentProgress] = useState<DailyProgress>({
    date: '',
    videosWatched: [],
    notes: '',
    vocabulary: '',
    completedTasks: 0,
    totalTime: 0
  });

  // Load data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('germanTracker_calendar');
    if (stored) {
      try {
        setDailyProgress(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading calendar data:', error);
      }
    }
  }, []);

  // Save data to localStorage
  const saveToStorage = (data: { [key: string]: DailyProgress }) => {
    localStorage.setItem('germanTracker_calendar', JSON.stringify(data));
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const dateKey = formatDateKey(date);
    const existing = dailyProgress[dateKey];
    
    if (existing) {
      setCurrentProgress(existing);
    } else {
      setCurrentProgress({
        date: dateKey,
        videosWatched: [],
        notes: '',
        vocabulary: '',
        completedTasks: 0,
        totalTime: 0
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    const dateKey = formatDateKey(selectedDate);
    const updated = {
      ...dailyProgress,
      [dateKey]: {
        ...currentProgress,
        date: dateKey
      }
    };
    setDailyProgress(updated);
    saveToStorage(updated);
    setShowModal(false);
  };

  const addVideo = () => {
    const newVideo: VideoProgress = {
      id: Date.now().toString(),
      title: '',
      link: '',
      vocabulary: '',
      exampleSentences: '',
      summary: '',
      grammarNotes: '',
      watchedAt: new Date().toISOString()
    };
    setCurrentProgress({
      ...currentProgress,
      videosWatched: [...currentProgress.videosWatched, newVideo]
    });
  };

  const updateVideo = (index: number, field: keyof VideoProgress, value: string) => {
    const updated = [...currentProgress.videosWatched];
    updated[index] = { ...updated[index], [field]: value };
    setCurrentProgress({
      ...currentProgress,
      videosWatched: updated
    });
  };

  const removeVideo = (index: number) => {
    const updated = currentProgress.videosWatched.filter((_, i) => i !== index);
    setCurrentProgress({
      ...currentProgress,
      videosWatched: updated
    });
  };

  const exportData = () => {
    const dataStr = JSON.stringify(dailyProgress, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `german-learning-calendar-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setDailyProgress(imported);
          saveToStorage(imported);
          alert('Daten erfolgreich importiert!');
        } catch (error) {
          alert('Fehler beim Importieren der Daten.');
        }
      };
      reader.readAsText(file);
    }
  };

  const clearAllData = () => {
    if (confirm('Möchten Sie wirklich alle Kalenderdaten löschen?')) {
      setDailyProgress({});
      localStorage.removeItem('germanTracker_calendar');
    }
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateKey = formatDateKey(date);
      const hasProgress = dailyProgress[dateKey];
      if (hasProgress) {
        return (
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className={`rounded-xl p-6 ${
        darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">📅 Mein Fortschritt</h2>
            <p className="text-gray-500">Klicke auf ein Datum, um deinen Lernfortschritt zu dokumentieren</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            
            <label className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
            
            <button
              onClick={clearAllData}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className={`rounded-xl p-6 ${
        darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
      }`}>
        <div className={`calendar-container ${darkMode ? 'dark-calendar' : ''}`}>
          <Calendar
            onChange={(date) => handleDateClick(date as Date)}
            value={selectedDate}
            tileContent={tileContent}
            className="w-full"
            locale="de-DE"
            prev2Label={null}
            next2Label={null}
            prevLabel={<ChevronLeft className="w-5 h-5" />}
            nextLabel={<ChevronRight className="w-5 h-5" />}
          />
        </div>
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`rounded-xl p-4 ${
          darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{Object.keys(dailyProgress).length}</div>
            <div className="text-sm text-gray-500">Tage dokumentiert</div>
          </div>
        </div>
        
        <div className={`rounded-xl p-4 ${
          darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {Object.values(dailyProgress).reduce((sum, day) => sum + day.videosWatched.length, 0)}
            </div>
            <div className="text-sm text-gray-500">Videos geschaut</div>
          </div>
        </div>
        
        <div className={`rounded-xl p-4 ${
          darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">
              {Math.round(Object.values(dailyProgress).reduce((sum, day) => sum + day.totalTime, 0) / 60)}h
            </div>
            <div className="text-sm text-gray-500">Gesamtzeit</div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto ${
            darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">
                  Lernfortschritt für {selectedDate.toLocaleDateString('de-DE', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Videos Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                      📺 Videos geschaut
                    </h4>
                    <button
                      onClick={addVideo}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Video hinzufügen
                    </button>
                  </div>
                  
                  {currentProgress.videosWatched.map((video, index) => (
                    <div key={video.id} className={`p-4 rounded-lg border mb-4 ${
                      darkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium">Video {index + 1}</h5>
                        <button
                          onClick={() => removeVideo(index)}
                          className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900 p-1 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Titel</label>
                          <input
                            type="text"
                            value={video.title}
                            onChange={(e) => updateVideo(index, 'title', e.target.value)}
                            placeholder="z.B. Easy German 123"
                            className={`w-full px-3 py-2 rounded-lg border ${
                              darkMode 
                                ? 'bg-slate-600 border-slate-500 text-white' 
                                : 'bg-white border-gray-300'
                            }`}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Link (optional)</label>
                          <input
                            type="url"
                            value={video.link || ''}
                            onChange={(e) => updateVideo(index, 'link', e.target.value)}
                            placeholder="https://youtube.com/..."
                            className={`w-full px-3 py-2 rounded-lg border ${
                              darkMode 
                                ? 'bg-slate-600 border-slate-500 text-white' 
                                : 'bg-white border-gray-300'
                            }`}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4 space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Vokabeln</label>
                          <textarea
                            value={video.vocabulary}
                            onChange={(e) => updateVideo(index, 'vocabulary', e.target.value)}
                            placeholder="Wichtige Wörter aus dem Video..."
                            rows={2}
                            className={`w-full px-3 py-2 rounded-lg border resize-none ${
                              darkMode 
                                ? 'bg-slate-600 border-slate-500 text-white' 
                                : 'bg-white border-gray-300'
                            }`}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Beispielsätze</label>
                          <textarea
                            value={video.exampleSentences}
                            onChange={(e) => updateVideo(index, 'exampleSentences', e.target.value)}
                            placeholder="3-5 wichtige Sätze..."
                            rows={3}
                            className={`w-full px-3 py-2 rounded-lg border resize-none ${
                              darkMode 
                                ? 'bg-slate-600 border-slate-500 text-white' 
                                : 'bg-white border-gray-300'
                            }`}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Zusammenfassung</label>
                          <textarea
                            value={video.summary}
                            onChange={(e) => updateVideo(index, 'summary', e.target.value)}
                            placeholder="Kurze Zusammenfassung des Videos..."
                            rows={2}
                            className={`w-full px-3 py-2 rounded-lg border resize-none ${
                              darkMode 
                                ? 'bg-slate-600 border-slate-500 text-white' 
                                : 'bg-white border-gray-300'
                            }`}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Grammatik & Aussprache</label>
                          <textarea
                            value={video.grammarNotes}
                            onChange={(e) => updateVideo(index, 'grammarNotes', e.target.value)}
                            placeholder="Grammatikregeln, Aussprache-Tipps..."
                            rows={2}
                            className={`w-full px-3 py-2 rounded-lg border resize-none ${
                              darkMode 
                                ? 'bg-slate-600 border-slate-500 text-white' 
                                : 'bg-white border-gray-300'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* General Notes */}
                <div>
                  <label className="block text-sm font-medium mb-2">🗒️ Allgemeine Notizen</label>
                  <textarea
                    value={currentProgress.notes}
                    onChange={(e) => setCurrentProgress({...currentProgress, notes: e.target.value})}
                    placeholder="Weitere Notizen zum Lerntag..."
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg border resize-none ${
                      darkMode 
                        ? 'bg-slate-700 border-slate-600 text-white' 
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  />
                </div>

                {/* Additional Vocabulary */}
                <div>
                  <label className="block text-sm font-medium mb-2">📚 Zusätzliche Vokabeln</label>
                  <textarea
                    value={currentProgress.vocabulary}
                    onChange={(e) => setCurrentProgress({...currentProgress, vocabulary: e.target.value})}
                    placeholder="Weitere Vokabeln, die heute gelernt wurden..."
                    rows={3}
                    className={`w-full px-4 py-3 rounded-lg border resize-none ${
                      darkMode 
                        ? 'bg-slate-700 border-slate-600 text-white' 
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Erledigte Aufgaben</label>
                    <input
                      type="number"
                      value={currentProgress.completedTasks}
                      onChange={(e) => setCurrentProgress({...currentProgress, completedTasks: parseInt(e.target.value) || 0})}
                      min="0"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-slate-700 border-slate-600 text-white' 
                          : 'bg-gray-50 border-gray-300'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Lernzeit (Minuten)</label>
                    <input
                      type="number"
                      value={currentProgress.totalTime}
                      onChange={(e) => setCurrentProgress({...currentProgress, totalTime: parseInt(e.target.value) || 0})}
                      min="0"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-slate-700 border-slate-600 text-white' 
                          : 'bg-gray-50 border-gray-300'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Speichern
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .calendar-container .react-calendar {
          width: 100%;
          background: transparent;
          border: none;
          font-family: inherit;
        }
        
        .calendar-container .react-calendar__tile {
          max-width: 100%;
          padding: 0.75rem 0.5rem;
          background: none;
          border: 1px solid ${darkMode ? '#475569' : '#e5e7eb'};
          border-radius: 0.5rem;
          margin: 0.125rem;
          color: ${darkMode ? '#f1f5f9' : '#374151'};
          transition: all 0.2s;
        }
        
        .calendar-container .react-calendar__tile:hover {
          background-color: ${darkMode ? '#475569' : '#f3f4f6'};
          border-color: ${darkMode ? '#64748b' : '#d1d5db'};
        }
        
        .calendar-container .react-calendar__tile--active {
          background-color: #3b82f6 !important;
          color: white !important;
          border-color: #3b82f6 !important;
        }
        
        .calendar-container .react-calendar__tile--now {
          background-color: ${darkMode ? '#1e293b' : '#fef3c7'};
          border-color: ${darkMode ? '#334155' : '#f59e0b'};
        }
        
        .calendar-container .react-calendar__navigation {
          display: flex;
          height: 44px;
          margin-bottom: 1rem;
        }
        
        .calendar-container .react-calendar__navigation button {
          min-width: 44px;
          background: ${darkMode ? '#475569' : '#f9fafb'};
          border: 1px solid ${darkMode ? '#64748b' : '#d1d5db'};
          border-radius: 0.5rem;
          color: ${darkMode ? '#f1f5f9' : '#374151'};
          font-size: 16px;
          font-weight: 500;
          margin: 0 0.125rem;
          transition: all 0.2s;
        }
        
        .calendar-container .react-calendar__navigation button:hover {
          background-color: ${darkMode ? '#64748b' : '#f3f4f6'};
        }
        
        .calendar-container .react-calendar__navigation button:disabled {
          opacity: 0.5;
        }
        
        .calendar-container .react-calendar__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: bold;
          font-size: 0.75rem;
          color: ${darkMode ? '#94a3b8' : '#6b7280'};
          margin-bottom: 0.5rem;
        }
        
        .calendar-container .react-calendar__month-view__weekdays__weekday {
          padding: 0.5rem;
        }
      `}</style>
    </div>
  );
};