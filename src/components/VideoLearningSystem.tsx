import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Play, Pause, Volume2, BookOpen, Brain, CheckCircle, Circle, Star } from 'lucide-react';

interface VideoData {
  id: string;
  title: string;
  videoUrl: string;
  subtitlesUrl?: string;
  vocabulary: { word: string; translation: string; example: string }[];
  keySentences: string[];
  quiz: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }[];
}

interface DayProgress {
  date: string;
  currentStage: number;
  completedStages: boolean[];
  quizAnswers: number[];
  quizScore: number;
  completed: boolean;
  lastAccessed: string;
}

interface VideoLearningSystemProps {
  darkMode?: boolean;
  onClose?: () => void;
}

// Sample video data - you can replace with your actual data
const sampleVideoData: { [date: string]: VideoData } = {
  '2025-01-03': {
    id: 'nico-001',
    title: 'Nico\'s Weg - Episode 1: Ankunft',
    videoUrl: 'https://www.youtube.com/embed/4-eDoThe6qo',
    vocabulary: [
      { word: 'Hallo', translation: 'Hello', example: 'Hallo, wie geht es dir?' },
      { word: 'danke', translation: 'thank you', example: 'Danke für deine Hilfe!' },
      { word: 'bitte', translation: 'please/you\'re welcome', example: 'Bitte schön!' },
      { word: 'Entschuldigung', translation: 'excuse me/sorry', example: 'Entschuldigung, wo ist der Bahnhof?' }
    ],
    keySentences: [
      'Hallo, ich heiße Nico.',
      'Wie geht es Ihnen?',
      'Danke, gut.',
      'Entschuldigung, sprechen Sie Deutsch?'
    ],
    quiz: [
      {
        question: 'How do you say "Hello" in German?',
        options: ['Guten Tag', 'Hallo', 'Tschüss', 'Auf Wiedersehen'],
        correctAnswer: 1,
        explanation: '"Hallo" is the most common informal greeting in German.'
      },
      {
        question: 'What does "Entschuldigung" mean?',
        options: ['Thank you', 'Please', 'Excuse me', 'Goodbye'],
        correctAnswer: 2,
        explanation: '"Entschuldigung" means "excuse me" or "sorry" and is very useful for polite interactions.'
      }
    ]
  },
  '2025-01-04': {
    id: 'nico-002',
    title: 'Nico\'s Weg - Episode 2: Im Café',
    videoUrl: 'https://www.youtube.com/embed/example2',
    vocabulary: [
      { word: 'der Kaffee', translation: 'coffee', example: 'Ich möchte einen Kaffee, bitte.' },
      { word: 'das Wasser', translation: 'water', example: 'Ein Glas Wasser, bitte.' },
      { word: 'bezahlen', translation: 'to pay', example: 'Ich möchte bezahlen.' },
      { word: 'zusammen', translation: 'together', example: 'Wir bezahlen zusammen.' }
    ],
    keySentences: [
      'Ich hätte gern einen Kaffee.',
      'Was kostet das?',
      'Kann ich mit Karte bezahlen?',
      'Die Rechnung, bitte.'
    ],
    quiz: [
      {
        question: 'How do you ask for coffee in German?',
        options: ['Ich möchte Tee', 'Ich hätte gern einen Kaffee', 'Ich trinke Wasser', 'Ich esse Brot'],
        correctAnswer: 1,
        explanation: '"Ich hätte gern einen Kaffee" is a polite way to order coffee.'
      }
    ]
  }
};

export const VideoLearningSystem: React.FC<VideoLearningSystemProps> = ({ 
  darkMode = false, 
  onClose 
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showDayView, setShowDayView] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [progress, setProgress] = useState<{ [date: string]: DayProgress }>({});
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showQuizResults, setShowQuizResults] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('germanVideoLearning_progress');
    if (stored) {
      try {
        setProgress(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = (newProgress: { [date: string]: DayProgress }) => {
    setProgress(newProgress);
    localStorage.setItem('germanVideoLearning_progress', JSON.stringify(newProgress));
  };

  const handleDateClick = (date: string) => {
    if (sampleVideoData[date]) {
      setSelectedDate(date);
      setShowDayView(true);
      
      // Initialize or load progress for this date
      const dayProgress = progress[date];
      if (dayProgress) {
        setCurrentStage(dayProgress.currentStage);
        setQuizAnswers(dayProgress.quizAnswers);
      } else {
        setCurrentStage(1);
        setQuizAnswers([]);
        // Create initial progress entry
        const newProgress = {
          ...progress,
          [date]: {
            date,
            currentStage: 1,
            completedStages: [false, false, false, false],
            quizAnswers: [],
            quizScore: 0,
            completed: false,
            lastAccessed: new Date().toISOString()
          }
        };
        saveProgress(newProgress);
      }
      setShowQuizResults(false);
    }
  };

  const updateStageProgress = (stage: number, completed: boolean = true) => {
    const dayProgress = progress[selectedDate] || {
      date: selectedDate,
      currentStage: 1,
      completedStages: [false, false, false, false],
      quizAnswers: [],
      quizScore: 0,
      completed: false,
      lastAccessed: new Date().toISOString()
    };

    const updatedStages = [...dayProgress.completedStages];
    updatedStages[stage - 1] = completed;

    const newProgress = {
      ...progress,
      [selectedDate]: {
        ...dayProgress,
        currentStage: stage,
        completedStages: updatedStages,
        lastAccessed: new Date().toISOString()
      }
    };

    saveProgress(newProgress);
  };

  const handleNextStage = () => {
    if (currentStage < 4) {
      updateStageProgress(currentStage, true);
      setCurrentStage(currentStage + 1);
      setShowQuizResults(false);
    }
  };

  const handlePreviousStage = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
      setShowQuizResults(false);
    }
  };

  const handleQuizSubmit = () => {
    const videoData = sampleVideoData[selectedDate];
    if (!videoData) return;

    let score = 0;
    quizAnswers.forEach((answer, index) => {
      if (answer === videoData.quiz[index].correctAnswer) {
        score++;
      }
    });

    const percentage = Math.round((score / videoData.quiz.length) * 100);
    
    const dayProgress = progress[selectedDate];
    const updatedStages = [...dayProgress.completedStages];
    updatedStages[3] = true; // Mark stage 4 as completed

    const newProgress = {
      ...progress,
      [selectedDate]: {
        ...dayProgress,
        completedStages: updatedStages,
        quizAnswers,
        quizScore: percentage,
        completed: percentage >= 70, // Consider completed if 70% or higher
        lastAccessed: new Date().toISOString()
      }
    };

    saveProgress(newProgress);
    setShowQuizResults(true);
  };

  const getDayStatus = (date: string) => {
    const dayProgress = progress[date];
    if (!dayProgress) return 'untouched';
    
    if (dayProgress.completed) return 'completed';
    if (dayProgress.completedStages.some(stage => stage)) return 'in-progress';
    return 'untouched';
  };

  const renderCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      const dateStr = current.toISOString().split('T')[0];
      const isCurrentMonth = current.getMonth() === currentMonth;
      const isToday = dateStr === today.toISOString().split('T')[0];
      const hasVideo = !!sampleVideoData[dateStr];
      const status = getDayStatus(dateStr);

      let dayClass = `
        relative p-2 h-12 rounded-lg transition-all duration-200 text-sm font-medium cursor-pointer
        ${isCurrentMonth 
          ? darkMode 
            ? 'text-white hover:bg-slate-700' 
            : 'text-gray-900 hover:bg-gray-100'
          : darkMode 
            ? 'text-slate-500' 
            : 'text-gray-400'
        }
      `;

      if (isToday) {
        dayClass += darkMode 
          ? ' bg-blue-600 text-white hover:bg-blue-700' 
          : ' bg-blue-500 text-white hover:bg-blue-600';
      } else if (hasVideo) {
        if (status === 'completed') {
          dayClass += darkMode 
            ? ' bg-green-700 text-green-100 hover:bg-green-600' 
            : ' bg-green-100 text-green-800 hover:bg-green-200';
        } else if (status === 'in-progress') {
          dayClass += darkMode 
            ? ' bg-yellow-700 text-yellow-100 hover:bg-yellow-600' 
            : ' bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
        } else {
          dayClass += darkMode 
            ? ' bg-slate-600 text-slate-200 hover:bg-slate-500' 
            : ' bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200';
        }
      }

      days.push(
        <button
          key={dateStr}
          onClick={() => handleDateClick(dateStr)}
          className={dayClass}
          disabled={!hasVideo}
        >
          {current.getDate()}
          {hasVideo && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
              <div className={`w-2 h-2 rounded-full ${
                status === 'completed' ? 'bg-green-400' : 
                status === 'in-progress' ? 'bg-yellow-400' : 
                'bg-gray-400'
              }`} />
            </div>
          )}
        </button>
      );
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const renderStage = () => {
    const videoData = sampleVideoData[selectedDate];
    if (!videoData) return null;

    const dayProgress = progress[selectedDate];
    const stageCompleted = dayProgress?.completedStages[currentStage - 1] || false;

    switch (currentStage) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">🎬 Stage 1: Watch Normally</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Watch the video without subtitles. Try to understand as much as possible.
              </p>
            </div>
            
            <div className="aspect-video rounded-xl overflow-hidden bg-black">
              <iframe
                src={videoData.videoUrl}
                className="w-full h-full"
                allowFullScreen
                title={videoData.title}
              />
            </div>

            <div className="text-center">
              <button
                onClick={() => updateStageProgress(1, true)}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  stageCompleted
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {stageCompleted ? (
                  <>
                    <CheckCircle className="w-5 h-5 inline mr-2" />
                    Stage Completed
                  </>
                ) : (
                  'Mark as Watched'
                )}
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">📝 Stage 2: Watch with Subtitles</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Watch again with subtitles to understand better.
              </p>
            </div>
            
            <div className="aspect-video rounded-xl overflow-hidden bg-black">
              <iframe
                src={`${videoData.videoUrl}&cc_load_policy=1`}
                className="w-full h-full"
                allowFullScreen
                title={videoData.title}
              />
            </div>

            <div className="text-center">
              <button
                onClick={() => updateStageProgress(2, true)}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  stageCompleted
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {stageCompleted ? (
                  <>
                    <CheckCircle className="w-5 h-5 inline mr-2" />
                    Stage Completed
                  </>
                ) : (
                  'Mark as Watched'
                )}
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">📚 Stage 3: Study Vocabulary</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Learn key vocabulary and sentences from the video.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="aspect-video rounded-xl overflow-hidden bg-black">
                <iframe
                  src={videoData.videoUrl}
                  className="w-full h-full"
                  allowFullScreen
                  title={videoData.title}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    Key Vocabulary
                  </h4>
                  <div className="space-y-3">
                    {videoData.vocabulary.map((item, index) => (
                      <div key={index} className={`p-3 rounded-lg ${
                        darkMode ? 'bg-slate-700' : 'bg-gray-50'
                      }`}>
                        <div className="font-medium text-lg">{item.word}</div>
                        <div className="text-blue-600 dark:text-blue-400">{item.translation}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 italic">
                          "{item.example}"
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-green-500" />
                    Key Sentences
                  </h4>
                  <div className="space-y-2">
                    {videoData.keySentences.map((sentence, index) => (
                      <div key={index} className={`p-3 rounded-lg ${
                        darkMode ? 'bg-slate-700' : 'bg-gray-50'
                      }`}>
                        <div className="font-medium">{sentence}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => updateStageProgress(3, true)}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  stageCompleted
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {stageCompleted ? (
                  <>
                    <CheckCircle className="w-5 h-5 inline mr-2" />
                    Stage Completed
                  </>
                ) : (
                  'Mark as Studied'
                )}
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">🧠 Stage 4: Final Test</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Watch once more without subtitles, then take the quiz.
              </p>
            </div>

            <div className="aspect-video rounded-xl overflow-hidden bg-black mb-6">
              <iframe
                src={videoData.videoUrl}
                className="w-full h-full"
                allowFullScreen
                title={videoData.title}
              />
            </div>

            <div className={`p-6 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                Quiz Time!
              </h4>

              {!showQuizResults ? (
                <div className="space-y-6">
                  {videoData.quiz.map((question, qIndex) => (
                    <div key={qIndex} className="space-y-3">
                      <p className="font-medium">{qIndex + 1}. {question.question}</p>
                      <div className="space-y-2">
                        {question.options.map((option, oIndex) => (
                          <label key={oIndex} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name={`question-${qIndex}`}
                              value={oIndex}
                              checked={quizAnswers[qIndex] === oIndex}
                              onChange={() => {
                                const newAnswers = [...quizAnswers];
                                newAnswers[qIndex] = oIndex;
                                setQuizAnswers(newAnswers);
                              }}
                              className="w-4 h-4"
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleQuizSubmit}
                    disabled={quizAnswers.length !== videoData.quiz.length}
                    className="w-full px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Quiz
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="text-4xl mb-4">
                    {progress[selectedDate]?.quizScore >= 70 ? '🎉' : '📚'}
                  </div>
                  <h5 className="text-xl font-bold">
                    Quiz Results: {progress[selectedDate]?.quizScore}%
                  </h5>
                  <p className="text-gray-600 dark:text-gray-400">
                    {progress[selectedDate]?.quizScore >= 70 
                      ? 'Excellent work! You\'ve completed this lesson.' 
                      : 'Good effort! Review the material and try again.'}
                  </p>
                  
                  <div className="space-y-3 text-left">
                    {videoData.quiz.map((question, index) => (
                      <div key={index} className={`p-3 rounded-lg ${
                        quizAnswers[index] === question.correctAnswer
                          ? darkMode ? 'bg-green-800' : 'bg-green-100'
                          : darkMode ? 'bg-red-800' : 'bg-red-100'
                      }`}>
                        <p className="font-medium">{question.question}</p>
                        <p className="text-sm">
                          Your answer: {question.options[quizAnswers[index]]}
                        </p>
                        {quizAnswers[index] !== question.correctAnswer && (
                          <p className="text-sm text-green-600 dark:text-green-400">
                            Correct: {question.options[question.correctAnswer]}
                          </p>
                        )}
                        {question.explanation && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {question.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const today = new Date();
  const currentMonth = monthNames[today.getMonth()];
  const currentYear = today.getFullYear();

  if (showDayView && selectedDate) {
    const videoData = sampleVideoData[selectedDate];
    const dayProgress = progress[selectedDate];
    
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className={`rounded-2xl p-6 mb-6 ${
            darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowDayView(false)}
                className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Calendar
              </button>
              
              <div className="text-center">
                <h1 className="text-2xl font-bold">{videoData.title}</h1>
                <p className="text-gray-500">{new Date(selectedDate).toLocaleDateString()}</p>
              </div>
              
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map(stage => (
                  <div key={stage} className={`w-3 h-3 rounded-full ${
                    dayProgress?.completedStages[stage - 1] 
                      ? 'bg-green-500' 
                      : stage === currentStage 
                        ? 'bg-blue-500' 
                        : darkMode ? 'bg-slate-600' : 'bg-gray-300'
                  }`} />
                ))}
              </div>
            </div>

            {/* Stage Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePreviousStage}
                disabled={currentStage === 1}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Stage
              </button>

              <div className="text-center">
                <div className="text-lg font-bold">Stage {currentStage} of 4</div>
                <div className="text-sm text-gray-500">
                  {currentStage === 1 && 'Watch Normally'}
                  {currentStage === 2 && 'Watch with Subtitles'}
                  {currentStage === 3 && 'Study Vocabulary'}
                  {currentStage === 4 && 'Final Test'}
                </div>
              </div>

              <button
                onClick={handleNextStage}
                disabled={currentStage === 4 || !dayProgress?.completedStages[currentStage - 1]}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Stage
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stage Content */}
          <div className={`rounded-2xl p-6 ${
            darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
          }`}>
            {renderStage()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className={`rounded-2xl p-6 mb-6 ${
          darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Play className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">🎬 Daily Video Learning</h1>
                <p className="text-sm opacity-75">Structured German video lessons</p>
              </div>
            </div>
            
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className={`p-3 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-green-50'}`}>
              <div className="text-lg font-bold text-green-500">
                {Object.values(progress).filter(p => p.completed).length}
              </div>
              <div className="text-xs opacity-75">Completed</div>
            </div>
            <div className={`p-3 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-yellow-50'}`}>
              <div className="text-lg font-bold text-yellow-500">
                {Object.values(progress).filter(p => !p.completed && p.completedStages.some(s => s)).length}
              </div>
              <div className="text-xs opacity-75">In Progress</div>
            </div>
            <div className={`p-3 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-blue-50'}`}>
              <div className="text-lg font-bold text-blue-500">
                {Object.keys(sampleVideoData).length}
              </div>
              <div className="text-xs opacity-75">Total Videos</div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className={`rounded-2xl p-6 ${
          darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {currentMonth} {currentYear}
            </h2>
          </div>

          {/* Week headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-medium opacity-75 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {renderCalendar()}
          </div>
        </div>

        {/* Legend */}
        <div className={`mt-4 p-4 rounded-xl ${
          darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${darkMode ? 'bg-slate-600' : 'bg-white border-2 border-gray-300'}`} />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};