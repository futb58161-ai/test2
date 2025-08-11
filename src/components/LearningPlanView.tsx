import React, { useState } from 'react';
import { LearningPlan, MonthlyPlan } from '../types/types';
import { 
  Calendar, 
  BookOpen, 
  Headphones, 
  PenTool, 
  MessageCircle, 
  Target,
  CheckCircle,
  Circle,
  Plus,
  Minus,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react';
import { 
  updateGrammarProgress,
  updateVocabularyProgress,
  updateListeningProgress,
  updateWritingProgress,
  updateSpeakingProgress,
  calculateMonthProgress,
  getOverallPlanProgress
} from '../utils/learningPlanUtils';

interface LearningPlanViewProps {
  learningPlan: LearningPlan;
  darkMode: boolean;
  onPlanUpdate: (plan: LearningPlan) => void;
}

export const LearningPlanView: React.FC<LearningPlanViewProps> = ({
  learningPlan,
  darkMode,
  onPlanUpdate
}) => {
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [activeSection, setActiveSection] = useState<'overview' | 'grammar' | 'vocabulary' | 'listening' | 'writing' | 'speaking'>('overview');

  const currentMonth = learningPlan.months[selectedMonth];
  const overallProgress = getOverallPlanProgress(learningPlan);

  const handleGrammarToggle = (grammarId: string, completed: boolean) => {
    const updatedPlan = updateGrammarProgress(learningPlan, selectedMonth, grammarId, completed);
    onPlanUpdate(updatedPlan);
  };

  const handleVocabularyUpdate = (vocabId: string, change: number) => {
    const vocab = currentMonth.vocabulary.find(v => v.id === vocabId);
    if (vocab) {
      const newValue = Math.max(0, Math.min(vocab.targetWords, vocab.learnedWords + change));
      const updatedPlan = updateVocabularyProgress(learningPlan, selectedMonth, vocabId, newValue);
      onPlanUpdate(updatedPlan);
    }
  };

  const handleListeningUpdate = (listeningId: string, change: number) => {
    const listening = currentMonth.listening.find(l => l.id === listeningId);
    if (listening) {
      const newValue = Math.max(0, Math.min(listening.target, listening.completed + change));
      const updatedPlan = updateListeningProgress(learningPlan, selectedMonth, listeningId, newValue);
      onPlanUpdate(updatedPlan);
    }
  };

  const handleWritingUpdate = (writingId: string, change: number) => {
    const writing = currentMonth.writing.find(w => w.id === writingId);
    if (writing) {
      const newValue = Math.max(0, Math.min(writing.target, writing.completed + change));
      const updatedPlan = updateWritingProgress(learningPlan, selectedMonth, writingId, newValue);
      onPlanUpdate(updatedPlan);
    }
  };

  const handleSpeakingUpdate = (speakingId: string, change: number) => {
    const speaking = currentMonth.speaking.find(s => s.id === speakingId);
    if (speaking) {
      const newValue = Math.max(0, Math.min(speaking.target, speaking.completed + change));
      const updatedPlan = updateSpeakingProgress(learningPlan, selectedMonth, speakingId, newValue);
      onPlanUpdate(updatedPlan);
    }
  };

  const sections = [
    { id: 'overview', label: 'Übersicht', icon: TrendingUp, color: 'indigo' },
    { id: 'grammar', label: 'Grammatik', icon: BookOpen, color: 'blue' },
    { id: 'vocabulary', label: 'Wortschatz', icon: Target, color: 'green' },
    { id: 'listening', label: 'Hören', icon: Headphones, color: 'purple' },
    { id: 'writing', label: 'Schreiben', icon: PenTool, color: 'orange' },
    { id: 'speaking', label: 'Sprechen', icon: MessageCircle, color: 'red' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className={`rounded-xl p-6 ${
        darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">{learningPlan.title}</h2>
            <p className="text-gray-500">{learningPlan.period}</p>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                4-5 Stunden täglich
              </span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                7 Tage/Woche
              </span>
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full">
                Intensiv-Programm
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-yellow-500" />
            <div>
              <div className="text-sm text-gray-500">Gesamtfortschritt</div>
              <div className="text-2xl font-bold text-blue-500">{overallProgress}%</div>
            </div>
          </div>
        </div>
        
        <div className={`w-full rounded-full h-3 mt-4 ${
          darkMode ? 'bg-slate-700' : 'bg-gray-200'
        }`}>
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Overall Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`rounded-xl p-4 ${
          darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Grammatik</p>
              <p className="text-xl font-bold">
                {learningPlan.overallProgress.grammarCompleted}/{learningPlan.overallProgress.grammarTotal}
              </p>
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-4 ${
          darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Wortschatz</p>
              <p className="text-xl font-bold">
                {learningPlan.overallProgress.vocabularyLearned}/{learningPlan.overallProgress.vocabularyTarget}
              </p>
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-4 ${
          darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <PenTool className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Mock Exams</p>
              <p className="text-xl font-bold">
                {learningPlan.overallProgress.mockExamsDone}/{learningPlan.overallProgress.mockExamsTarget}
              </p>
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-4 ${
          darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500 rounded-lg">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Sprechen</p>
              <p className="text-xl font-bold">
                {learningPlan.overallProgress.speakingSessions}/{learningPlan.overallProgress.speakingTarget}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Month Selection */}
      <div className={`rounded-xl p-6 ${
        darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Monatsplan</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {learningPlan.months.map((month, index) => {
            const progress = calculateMonthProgress(month);
            const isCurrentMonth = new Date().getMonth() === index + 7; // August = 7
            return (
              <button
                key={index}
                onClick={() => setSelectedMonth(index)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedMonth === index
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : isCurrentMonth
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : darkMode
                    ? 'border-slate-600 hover:border-slate-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">{month.month}</div>
                <div className="text-sm text-gray-500 mb-2">{month.level}</div>
                {isCurrentMonth && (
                  <div className="text-xs text-green-600 dark:text-green-400 mb-1">📍 Aktueller Monat</div>
                )}
                <div className="text-xs text-gray-500 mb-1">Fortschritt</div>
                <div className={`w-full rounded-full h-2 ${
                  darkMode ? 'bg-slate-700' : 'bg-gray-200'
                }`}>
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-xs text-blue-500 mt-1">{progress}%</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Month Details */}
      <div className={`rounded-xl ${
        darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <h3 className="text-xl font-bold">{currentMonth.month} - {currentMonth.level}</h3>
          <p className="text-gray-500 mt-1">{currentMonth.description}</p>
          
          {/* Quick Stats */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-500">{currentMonth.grammar.length}</div>
              <div className="text-xs text-gray-500">Grammatik-Themen</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-500">
                {currentMonth.vocabulary.reduce((sum, v) => sum + v.targetWords, 0)}
              </div>
              <div className="text-xs text-gray-500">Neue Wörter</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-500">{currentMonth.listening.length}</div>
              <div className="text-xs text-gray-500">Hörziele</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-500">{currentMonth.writing.length}</div>
              <div className="text-xs text-gray-500">Schreibaufgaben</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-500">{currentMonth.speaking.length}</div>
              <div className="text-xs text-gray-500">Sprechziele</div>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-gray-200 dark:border-slate-700 overflow-x-auto">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeSection === section.id
                  ? `text-${section.color}-500 border-b-2 border-${section.color}-500`
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <section.icon className="w-4 h-4" />
              {section.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Schedule */}
                <div className={`p-6 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    Täglicher Stundenplan (4-5h)
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">08:00-09:00</span>
                      <span>🌅 Grammatik-Intensiv</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">09:00-10:00</span>
                      <span>📚 Wortschatz lernen</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">10:15-11:15</span>
                      <span>🎧 Hörverständnis</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">11:15-12:15</span>
                      <span>✍️ Schreibtraining</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">13:15-14:15</span>
                      <span>🗣️ Sprechtraining</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">14:15-15:15</span>
                      <span>📖 Leseverständnis</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">15:30-16:30</span>
                      <span>🔄 Wiederholung</span>
                    </div>
                  </div>
                </div>

                {/* Weekly Goals */}
                <div className={`p-6 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-500" />
                    Wochenziele
                  </h4>
                  <div className="space-y-3">
                    {selectedMonth === 0 && (
                      <>
                        <div className="flex items-center gap-2">
                          <Circle className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">25 neue Wörter lernen</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Circle className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">5 Easy German Videos</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Circle className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">2 E-Mails schreiben</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Circle className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">3 Gespräche führen</span>
                        </div>
                      </>
                    )}
                    {selectedMonth === 1 && (
                      <>
                        <div className="flex items-center gap-2">
                          <Circle className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">30 neue Wörter lernen</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Circle className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">B1 Mock-Test bestehen</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Circle className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">2 formelle Briefe</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Circle className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">Präsentation halten</span>
                        </div>
                      </>
                    )}
                    {selectedMonth >= 2 && (
                      <>
                        <div className="flex items-center gap-2">
                          <Circle className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">35-40 neue Wörter lernen</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Circle className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">B2 Strukturen beherrschen</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Circle className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">Erörterung schreiben</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Circle className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">Komplexe Diskussion</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Resources */}
              <div className={`p-6 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-500" />
                  Hauptressourcen
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-medium text-blue-500">📚 Lehrbücher</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Netzwerk B1 (Klett)</li>
                      <li>• Netzwerk B2 (Klett)</li>
                      <li>• Grammatik aktiv B1-B2</li>
                      <li>• Übungsbuch B1/B2</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium text-green-500">🎥 YouTube Kanäle</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Easy German (täglich)</li>
                      <li>• Deutsch lernen mit Jenny</li>
                      <li>• Deutsche Welle</li>
                      <li>• Learn German with Prof</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium text-orange-500">🔧 Tools & Apps</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Anki (Vokabeln)</li>
                      <li>• Language Reactor</li>
                      <li>• Arabisch-Deutsche Wörterbücher</li>
                      <li>• B1/B2 Prüfungs-Apps</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Motivation Box */}
              <div className={`p-6 rounded-lg border-2 border-yellow-500 ${
                darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'
              }`}>
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                  🏆 Ayoub's Erfolgsformel
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium mb-2">💪 Disziplin & Konsistenz:</p>
                    <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                      <li>• 4-5 Stunden täglich, 7 Tage/Woche</li>
                      <li>• Feste Lernzeiten einhalten</li>
                      <li>• Keine Ausreden, keine Pausen</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-2">🎯 Klare Ziele:</p>
                    <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                      <li>• B2 Zertifikat bis 12. Dezember</li>
                      <li>• Wöchentliche Meilensteine</li>
                      <li>• Tägliche Fortschrittskontrolle</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-800/30 rounded-lg">
                  <p className="text-center font-medium text-yellow-800 dark:text-yellow-200">
                    "Erfolg ist die Summe kleiner Anstrengungen, die Tag für Tag wiederholt werden!" 🌟
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Grammar Section */}
          {activeSection === 'grammar' && (
            <div className="space-y-3">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                Grammatikthemen - {currentMonth.month}
              </h4>
              {currentMonth.grammar.map(grammar => (
                <div key={grammar.id} className={`flex items-center justify-between p-3 rounded-lg ${
                  darkMode ? 'bg-slate-700' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleGrammarToggle(grammar.id, !grammar.completed)}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                        grammar.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : darkMode
                          ? 'border-slate-400 hover:border-green-400'
                          : 'border-gray-400 hover:border-green-400'
                      }`}
                    >
                      {grammar.completed && <CheckCircle className="w-4 h-4" />}
                    </button>
                    <span className={grammar.completed ? 'line-through text-gray-500' : ''}>{grammar.topic}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {grammar.completed ? '✅' : '❌'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Vocabulary Section */}
          {activeSection === 'vocabulary' && (
            <div className="space-y-4">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                Wortschatzthemen - {currentMonth.month}
              </h4>
              {currentMonth.vocabulary.map(vocab => (
                <div key={vocab.id} className={`p-4 rounded-lg ${
                  darkMode ? 'bg-slate-700' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium">{vocab.topic}</h5>
                    <span className="text-sm text-gray-500">
                      {vocab.learnedWords} / {vocab.targetWords}
                    </span>
                  </div>
                  <div className={`w-full rounded-full h-2 mb-3 ${
                    darkMode ? 'bg-slate-600' : 'bg-gray-200'
                  }`}>
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(vocab.learnedWords / vocab.targetWords) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVocabularyUpdate(vocab.id, -10)}
                      className="p-1 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-mono">{vocab.learnedWords}</span>
                    <button
                      onClick={() => handleVocabularyUpdate(vocab.id, 10)}
                      className="p-1 rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Listening Section */}
          {activeSection === 'listening' && (
            <div className="space-y-4">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Headphones className="w-5 h-5 text-purple-500" />
                Hörziele - {currentMonth.month}
              </h4>
              {currentMonth.listening.map(listening => (
                <div key={listening.id} className={`p-4 rounded-lg ${
                  darkMode ? 'bg-slate-700' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium">{listening.goal}</h5>
                    <span className="text-sm text-gray-500">
                      {listening.completed} / {listening.target}
                    </span>
                  </div>
                  <div className={`w-full rounded-full h-2 mb-3 ${
                    darkMode ? 'bg-slate-600' : 'bg-gray-200'
                  }`}>
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(listening.completed / listening.target) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleListeningUpdate(listening.id, -1)}
                      className="p-1 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-mono">{listening.completed}</span>
                    <button
                      onClick={() => handleListeningUpdate(listening.id, 1)}
                      className="p-1 rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Writing Section */}
          {activeSection === 'writing' && (
            <div className="space-y-4">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <PenTool className="w-5 h-5 text-orange-500" />
                Schreibaufgaben - {currentMonth.month}
              </h4>
              {currentMonth.writing.map(writing => (
                <div key={writing.id} className={`p-4 rounded-lg ${
                  darkMode ? 'bg-slate-700' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">{writing.task}</h5>
                    <span className="text-sm text-gray-500">
                      {writing.completed} / {writing.target}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{writing.frequency}</p>
                  <div className={`w-full rounded-full h-2 mb-3 ${
                    darkMode ? 'bg-slate-600' : 'bg-gray-200'
                  }`}>
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(writing.completed / writing.target) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleWritingUpdate(writing.id, -1)}
                      className="p-1 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-mono">{writing.completed}</span>
                    <button
                      onClick={() => handleWritingUpdate(writing.id, 1)}
                      className="p-1 rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Speaking Section */}
          {activeSection === 'speaking' && (
            <div className="space-y-4">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-red-500" />
                Sprechziele - {currentMonth.month}
              </h4>
              {currentMonth.speaking.map(speaking => (
                <div key={speaking.id} className={`p-4 rounded-lg ${
                  darkMode ? 'bg-slate-700' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">{speaking.goal}</h5>
                    <span className="text-sm text-gray-500">
                      {speaking.completed} / {speaking.target}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{speaking.frequency}</p>
                  <div className={`w-full rounded-full h-2 mb-3 ${
                    darkMode ? 'bg-slate-600' : 'bg-gray-200'
                  }`}>
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(speaking.completed / speaking.target) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSpeakingUpdate(speaking.id, -1)}
                      className="p-1 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-mono">{speaking.completed}</span>
                    <button
                      onClick={() => handleSpeakingUpdate(speaking.id, 1)}
                      className="p-1 rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};