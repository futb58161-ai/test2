import React, { useState } from 'react';
import { YearlyProgress, Achievement, LearningGoals, DailyStats } from '../types/types';
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target, 
  Award, 
  Download, 
  Upload,
  BarChart3,
  Flame,
  Star,
  Trophy
} from 'lucide-react';
import { 
  calculateLevel, 
  calculateExperience, 
  getMonthName, 
  formatTimeSpent,
  generateYearlyReport
} from '../utils/progressUtils';
import { exportYearlyData, importYearlyData } from '../utils/storage';

interface ProgressViewProps {
  yearlyProgress: YearlyProgress[];
  achievements: Achievement[];
  goals: LearningGoals;
  darkMode: boolean;
  onGoalsUpdate: (goals: LearningGoals) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  yearlyProgress,
  achievements,
  goals,
  darkMode,
  onGoalsUpdate
}) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'goals' | 'export'>('overview');
  const [editingGoals, setEditingGoals] = useState(false);
  const [tempGoals, setTempGoals] = useState(goals);

  const currentYearData = yearlyProgress.find(y => y.year === selectedYear);
  const totalHours = currentYearData?.totalHours || 0;
  const totalDays = currentYearData?.totalDays || 0;
  const currentStreak = currentYearData?.currentStreak || 0;
  const level = calculateLevel(totalHours);
  const experience = calculateExperience(totalHours);

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const availableYears = yearlyProgress.map(y => y.year).sort((a, b) => b - a);

  const handleExportYear = () => {
    const data = exportYearlyData(selectedYear);
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `german-learning-${selectedYear}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleImportYear = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (importYearlyData(content)) {
          alert('Daten erfolgreich importiert!');
          window.location.reload();
        } else {
          alert('Fehler beim Importieren der Daten.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleGoalsSave = () => {
    onGoalsUpdate(tempGoals);
    setEditingGoals(false);
  };

  const getMonthlyData = () => {
    if (!currentYearData) return [];
    
    const monthlyData = [];
    for (let month = 0; month < 12; month++) {
      const monthStats = currentYearData.dailyStats.filter(day => {
        const date = new Date(day.date);
        return date.getMonth() === month;
      });
      
      const totalTime = monthStats.reduce((sum, day) => sum + day.timeSpent, 0);
      const activeDays = monthStats.filter(day => day.timeSpent > 0).length;
      
      monthlyData.push({
        month: getMonthName(month),
        hours: Math.round(totalTime / 60 * 10) / 10,
        days: activeDays
      });
    }
    
    return monthlyData;
  };

  const tabs = [
    { id: 'overview', label: 'Übersicht', icon: BarChart3 },
    { id: 'achievements', label: 'Erfolge', icon: Trophy },
    { id: 'goals', label: 'Ziele', icon: Target },
    { id: 'export', label: 'Export', icon: Download }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className={`rounded-xl p-6 ${
        darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Lernfortschritt</h2>
            <p className="text-gray-500">Verfolge deinen Deutschlern-Fortschritt</p>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className={`px-3 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            >
              {availableYears.length > 0 ? (
                availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))
              ) : (
                <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`rounded-xl p-4 ${
          darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Gesamtstunden</p>
              <p className="text-xl font-bold">{totalHours}h</p>
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-4 ${
          darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Aktive Tage</p>
              <p className="text-xl font-bold">{totalDays}</p>
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-4 ${
          darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Aktuelle Serie</p>
              <p className="text-xl font-bold">{currentStreak}</p>
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-4 ${
          darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Level</p>
              <p className="text-xl font-bold">{level}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <div className={`rounded-xl p-6 ${
        darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Level {level}</h3>
          <span className="text-sm text-gray-500">{experience}% bis Level {level + 1}</span>
        </div>
        <div className={`w-full rounded-full h-3 ${
          darkMode ? 'bg-slate-700' : 'bg-gray-200'
        }`}>
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${experience}%` }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className={`rounded-xl ${
        darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex border-b border-gray-200 dark:border-slate-700">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Monthly Chart */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Monatliche Aktivität</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getMonthlyData().map((month, index) => (
                    <div key={index} className={`p-4 rounded-lg ${
                      darkMode ? 'bg-slate-700' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{month.month}</span>
                        <span className="text-sm text-gray-500">{month.days} Tage</span>
                      </div>
                      <div className="text-xl font-bold text-blue-500">{month.hours}h</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              {currentYearData && currentYearData.dailyStats.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold mb-4">Letzte Aktivitäten</h4>
                  <div className="space-y-2">
                    {currentYearData.dailyStats
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 7)
                      .map((day, index) => (
                        <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                          darkMode ? 'bg-slate-700' : 'bg-gray-50'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              day.completionRate === 100 ? 'bg-green-500' : 'bg-yellow-500'
                            }`} />
                            <span>{new Date(day.date).toLocaleDateString('de-DE')}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{day.completionRate}%</span>
                            <span>{formatTimeSpent(day.timeSpent)}</span>
                            <span>{day.tasksCompleted}/{day.totalTasks} Aufgaben</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold">Erfolge</h4>
                <span className="text-sm text-gray-500">
                  {unlockedAchievements.length}/{achievements.length} freigeschaltet
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map(achievement => (
                  <div key={achievement.id} className={`p-4 rounded-lg border-2 transition-all ${
                    achievement.unlocked
                      ? darkMode 
                        ? 'bg-slate-700 border-green-500' 
                        : 'bg-green-50 border-green-500'
                      : darkMode
                        ? 'bg-slate-700 border-slate-600'
                        : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <h5 className="font-semibold">{achievement.name}</h5>
                        <p className="text-sm text-gray-500">{achievement.description}</p>
                        {achievement.unlocked && achievement.unlockedDate && (
                          <p className="text-xs text-green-500 mt-1">
                            Freigeschaltet: {new Date(achievement.unlockedDate).toLocaleDateString('de-DE')}
                          </p>
                        )}
                      </div>
                      {achievement.unlocked && (
                        <Award className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold">Lernziele</h4>
                <button
                  onClick={() => editingGoals ? handleGoalsSave() : setEditingGoals(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {editingGoals ? 'Speichern' : 'Bearbeiten'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                  <h5 className="font-semibold mb-2">Tägliches Ziel</h5>
                  {editingGoals ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={tempGoals.dailyTimeGoal}
                        onChange={(e) => setTempGoals({...tempGoals, dailyTimeGoal: parseInt(e.target.value)})}
                        className={`w-20 px-2 py-1 rounded border ${
                          darkMode ? 'bg-slate-600 border-slate-500' : 'bg-white border-gray-300'
                        }`}
                      />
                      <span>Minuten</span>
                    </div>
                  ) : (
                    <p className="text-xl font-bold text-blue-500">{formatTimeSpent(goals.dailyTimeGoal)}</p>
                  )}
                </div>

                <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                  <h5 className="font-semibold mb-2">Wöchentliches Ziel</h5>
                  {editingGoals ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={tempGoals.weeklyGoal}
                        onChange={(e) => setTempGoals({...tempGoals, weeklyGoal: parseInt(e.target.value)})}
                        className={`w-20 px-2 py-1 rounded border ${
                          darkMode ? 'bg-slate-600 border-slate-500' : 'bg-white border-gray-300'
                        }`}
                      />
                      <span>Tage</span>
                    </div>
                  ) : (
                    <p className="text-xl font-bold text-green-500">{goals.weeklyGoal} Tage</p>
                  )}
                </div>

                <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                  <h5 className="font-semibold mb-2">Monatliches Ziel</h5>
                  {editingGoals ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={tempGoals.monthlyGoal}
                        onChange={(e) => setTempGoals({...tempGoals, monthlyGoal: parseInt(e.target.value)})}
                        className={`w-20 px-2 py-1 rounded border ${
                          darkMode ? 'bg-slate-600 border-slate-500' : 'bg-white border-gray-300'
                        }`}
                      />
                      <span>Stunden</span>
                    </div>
                  ) : (
                    <p className="text-xl font-bold text-orange-500">{goals.monthlyGoal}h</p>
                  )}
                </div>

                <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                  <h5 className="font-semibold mb-2">Jahresziel</h5>
                  {editingGoals ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={tempGoals.yearlyGoal}
                        onChange={(e) => setTempGoals({...tempGoals, yearlyGoal: parseInt(e.target.value)})}
                        className={`w-20 px-2 py-1 rounded border ${
                          darkMode ? 'bg-slate-600 border-slate-500' : 'bg-white border-gray-300'
                        }`}
                      />
                      <span>Stunden</span>
                    </div>
                  ) : (
                    <p className="text-xl font-bold text-purple-500">{goals.yearlyGoal}h</p>
                  )}
                </div>
              </div>

              {/* Goal Progress */}
              <div className="space-y-4">
                <h5 className="font-semibold">Fortschritt zu den Zielen</h5>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span>Jahresziel</span>
                    <span>{Math.round((totalHours / goals.yearlyGoal) * 100)}%</span>
                  </div>
                  <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-slate-600' : 'bg-gray-200'}`}>
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((totalHours / goals.yearlyGoal) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-6">
              <h4 className="text-lg font-semibold">Daten Export/Import</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                  <h5 className="font-semibold mb-2">Export</h5>
                  <p className="text-sm text-gray-500 mb-4">
                    Exportiere deine Lerndaten für das Jahr {selectedYear}
                  </p>
                  <button
                    onClick={handleExportYear}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Jahr {selectedYear} exportieren
                  </button>
                </div>

                <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                  <h5 className="font-semibold mb-2">Import</h5>
                  <p className="text-sm text-gray-500 mb-4">
                    Importiere Lerndaten aus einer JSON-Datei
                  </p>
                  <label className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Daten importieren
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportYear}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Yearly Report */}
              {currentYearData && (
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                  <h5 className="font-semibold mb-2">Jahresbericht {selectedYear}</h5>
                  <pre className="text-sm whitespace-pre-wrap text-gray-600 dark:text-gray-400">
                    {generateYearlyReport(currentYearData)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};