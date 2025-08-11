import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { WeekView } from './components/WeekView';
import { TodayView } from './components/TodayView';
import { ProgressView } from './components/ProgressView';
import { LearningPlanView } from './components/LearningPlanView';
import { CalendarView } from './components/CalendarView';
import { VocabularyBankView } from './components/VocabularyBankView';
import { UserProfileModal } from './components/UserProfileModal';
import { GermanLearningTracker } from './components/GermanLearningTracker';
import { VideoLearningSystem } from './components/VideoLearningSystem';
import { TaskData, WeekData, PomodoroState, YearlyProgress, Achievement, LearningGoals, LearningPlan } from './types/types';
import { getInitialWeekData, calculateDayProgress, calculateTotalTime } from './utils/taskUtils';
import { 
  calculateDailyStats, 
  calculateLevel, 
  calculateExperience, 
  getDefaultAchievements, 
  getDefaultGoals,
  checkAchievements
} from './utils/progressUtils';
import { getStoredData, saveData, getStoredSettings, saveProgressSnapshot, getUserProfile } from './utils/storage';
import { getDefaultLearningPlan } from './utils/learningPlanUtils';

function App() {
  const [weekData, setWeekData] = useState<WeekData>(getInitialWeekData());
  const [viewMode, setViewMode] = useState<'today' | 'week' | 'progress' | 'plan' | 'calendar' | 'vocabulary' | 'tracker' | 'video-learning'>('week');
  const [darkMode, setDarkMode] = useState(true);
  const [streak, setStreak] = useState(0);
  const [pomodoroState, setPomodoroState] = useState<PomodoroState | null>(null);
  const [yearlyProgress, setYearlyProgress] = useState<YearlyProgress[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(getDefaultAchievements());
  const [goals, setGoals] = useState<LearningGoals>(getDefaultGoals());
  const [learningPlan, setLearningPlan] = useState<LearningPlan>(getDefaultLearningPlan());
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Load data on mount
  useEffect(() => {
    const stored = getStoredData();
    if (stored) {
      setWeekData(stored.weekData);
      setStreak(stored.streak);
      setYearlyProgress(stored.yearlyProgress || []);
      setAchievements(stored.achievements || getDefaultAchievements());
      setGoals(stored.goals || getDefaultGoals());
      setLearningPlan(stored.learningPlan || getDefaultLearningPlan());
    }
    
    const settings = getStoredSettings();
    if (settings) {
      setDarkMode(settings.darkMode);
      setViewMode(settings.viewMode);
    }
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    saveData({ weekData, streak, yearlyProgress, achievements, goals, learningPlan });
  }, [weekData, streak, yearlyProgress, achievements, goals, learningPlan]);

  // Save settings
  useEffect(() => {
    localStorage.setItem('germanTracker_settings', JSON.stringify({ 
      darkMode, 
      viewMode 
    }));
  }, [darkMode, viewMode]);

  // Save daily progress snapshot
  useEffect(() => {
    const userProfile = getUserProfile();
    if (userProfile) {
      const today = new Date().toISOString().split('T')[0];
      const todayTasks = weekData[new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof WeekData].tasks;
      const todayStats = calculateDailyStats(todayTasks, today);
      
      const snapshot = {
        id: `${userProfile.id}_${today}`,
        userId: userProfile.id,
        date: today,
        weekData,
        dailyStats: todayStats,
        achievements,
        goals,
        notes: '',
        reflection: localStorage.getItem(`reflection_${today}`) || '',
        vocabularyAdded: []
      };
      
      saveProgressSnapshot(snapshot);
    }
  }, [weekData, achievements, goals]);

  // Update daily progress and check achievements
  useEffect(() => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todayTasks = weekData[today as keyof WeekData].tasks;
    const todayStats = calculateDailyStats(todayTasks, new Date().toISOString().split('T')[0]);
    
    // Update current year progress
    const currentYear = new Date().getFullYear();
    setYearlyProgress(prev => {
      const updated = [...prev];
      let yearData = updated.find(y => y.year === currentYear);
      
      if (!yearData) {
        yearData = {
          year: currentYear,
          dailyStats: [],
          weeklyStats: [],
          monthlyStats: [],
          totalHours: 0,
          totalDays: 0,
          longestStreak: 0,
          currentStreak: streak,
          level: 1,
          experience: 0
        };
        updated.push(yearData);
      }
      
      // Update today's stats
      const existingDayIndex = yearData.dailyStats.findIndex(d => d.date === todayStats.date);
      if (existingDayIndex >= 0) {
        yearData.dailyStats[existingDayIndex] = todayStats;
      } else {
        yearData.dailyStats.push(todayStats);
      }
      
      // Recalculate totals
      yearData.totalHours = Math.round(yearData.dailyStats.reduce((sum, day) => sum + day.timeSpent, 0) / 60 * 10) / 10;
      yearData.totalDays = yearData.dailyStats.filter(day => day.completionRate === 100).length;
      yearData.currentStreak = streak;
      yearData.level = calculateLevel(yearData.totalHours);
      yearData.experience = calculateExperience(yearData.totalHours);
      
      return updated;
    });
    
    // Check achievements
    const currentYearData = yearlyProgress.find(y => y.year === currentYear);
    if (currentYearData) {
      const totalTasks = currentYearData.dailyStats.reduce((sum, day) => sum + day.tasksCompleted, 0);
      const updatedAchievements = checkAchievements(achievements, {
        totalHours: currentYearData.totalHours,
        totalDays: currentYearData.totalDays,
        currentStreak: streak,
        level: currentYearData.level,
        totalTasks
      });
      
      // Check for newly unlocked achievements
      const newlyUnlocked = updatedAchievements.filter((achievement, index) => 
        achievement.unlocked && !achievements[index].unlocked
      );
      
      if (newlyUnlocked.length > 0) {
        setAchievements(updatedAchievements);
        
        // Show notification for new achievements
        newlyUnlocked.forEach(achievement => {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`🏆 Neuer Erfolg freigeschaltet!`, {
              body: `${achievement.name}: ${achievement.description}`,
              icon: '/favicon.ico'
            });
          }
        });
      }
    }
  }, [weekData, streak, yearlyProgress, achievements]);
  // Pomodoro timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (pomodoroState?.isActive && pomodoroState.timeLeft > 0) {
      interval = setInterval(() => {
        setPomodoroState(prev => {
          if (!prev) return null;
          
          const newTimeLeft = prev.timeLeft - 1;
          
          if (newTimeLeft <= 0) {
            // Timer finished
            const isBreak = !prev.isBreak;
            const newTime = isBreak ? 5 * 60 : 25 * 60; // 5 min break or 25 min work
            
            // Update task pomodoro sessions
            if (!prev.isBreak) {
              setWeekData(prevWeekData => ({
                ...prevWeekData,
                [prev.day]: {
                  ...prevWeekData[prev.day as keyof WeekData],
                  tasks: prevWeekData[prev.day as keyof WeekData].tasks.map(task =>
                    task.id === prev.taskId
                      ? { ...task, pomodoroSessions: (task.pomodoroSessions || 0) + 1 }
                      : task
                  )
                }
              }));
            }
            
            // Show notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(
                isBreak ? '🎉 Pomodoro abgeschlossen!' : '☕ Pause vorbei!',
                {
                  body: isBreak 
                    ? 'Zeit für eine 5-minütige Pause!' 
                    : 'Zurück zur Arbeit!',
                  icon: '/favicon.ico'
                }
              );
            }
            
            return {
              ...prev,
              timeLeft: newTime,
              isBreak,
              isActive: false
            };
          }
          
          return { ...prev, timeLeft: newTimeLeft };
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pomodoroState?.isActive, pomodoroState?.timeLeft]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const updateTaskCompletion = useCallback((day: string, taskId: string, completed: boolean) => {
    setWeekData(prev => {
      const updated = {
        ...prev,
        [day]: {
          ...prev[day as keyof WeekData],
          tasks: prev[day as keyof WeekData].tasks.map(task => 
            task.id === taskId ? { ...task, completed } : task
          )
        }
      };

      // Check if day is now complete
      const dayTasks = updated[day as keyof WeekData].tasks;
      const dayComplete = dayTasks.every(task => task.completed);
      const wasComplete = prev[day as keyof WeekData].tasks.every(task => task.completed);

      // Update streak if today is completed for the first time
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      if (day === today && dayComplete && !wasComplete) {
        setTimeout(() => {
          setStreak(prev => prev + 1);
          // Show celebration
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🎉 Herzlichen Glückwunsch!', {
              body: 'Du hast alle Aufgaben für heute abgeschlossen!',
              icon: '/favicon.ico'
            });
          } else {
            alert('🎉 Herzlichen Glückwunsch! Du hast alle Aufgaben für heute abgeschlossen!');
          }
        }, 100);
      }

      return updated;
    });
  }, []);

  const updateTaskDuration = useCallback((day: string, taskId: string, duration: number) => {
    setWeekData(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof WeekData],
        tasks: prev[day as keyof WeekData].tasks.map(task => 
          task.id === taskId ? { ...task, duration } : task
        )
      }
    }));
  }, []);

  const updateTaskNotes = useCallback((day: string, taskId: string, notes: string) => {
    setWeekData(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof WeekData],
        tasks: prev[day as keyof WeekData].tasks.map(task => 
          task.id === taskId ? { ...task, notes } : task
        )
      }
    }));
  }, []);

  const startPomodoro = useCallback((day: string, taskId: string) => {
    setPomodoroState({
      isActive: true,
      timeLeft: 25 * 60, // 25 minutes
      isBreak: false,
      taskId,
      day
    });
  }, []);

  const stopPomodoro = useCallback(() => {
    setPomodoroState(null);
  }, []);

  const updateGoals = useCallback((newGoals: LearningGoals) => {
    setGoals(newGoals);
  }, []);

  const updateLearningPlan = useCallback((newPlan: LearningPlan) => {
    setLearningPlan(newPlan);
  }, []);

  const updateVideoData = useCallback((day: string, taskId: string, field: string, value: string) => {
    setWeekData(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof WeekData],
        tasks: prev[day as keyof WeekData].tasks.map(task => 
          task.id === taskId ? { ...task, [field]: value } : task
        )
      }
    }));
  }, []);
  
  const getTodayData = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return { 
      day: today, 
      data: weekData[today as keyof WeekData],
      progress: calculateDayProgress(weekData[today as keyof WeekData].tasks),
      totalTime: calculateTotalTime(weekData[today as keyof WeekData].tasks)
    };
  };

  const todayProgress = getTodayData().progress;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <Header 
        streak={streak}
        todayProgress={todayProgress}
        viewMode={viewMode}
        darkMode={darkMode}
        onViewModeChange={setViewMode}
        onDarkModeToggle={() => setDarkMode(!darkMode)}
        onProfileClick={() => setShowProfileModal(true)}
      />
      
      <main className="container mx-auto px-4 py-6">
        {viewMode === 'today' ? (
          <TodayView 
            {...getTodayData()}
            darkMode={darkMode}
            pomodoroState={pomodoroState}
            onTaskComplete={updateTaskCompletion}
            onTaskDurationChange={updateTaskDuration}
            onTaskNotesChange={updateTaskNotes}
            onVideoDataChange={updateVideoData}
            onStartPomodoro={startPomodoro}
            onStopPomodoro={stopPomodoro}
          />
        ) : viewMode === 'progress' ? (
          <ProgressView
            yearlyProgress={yearlyProgress}
            achievements={achievements}
            goals={goals}
            darkMode={darkMode}
            onGoalsUpdate={updateGoals}
          />
        ) : viewMode === 'plan' ? (
          <LearningPlanView
            learningPlan={learningPlan}
            darkMode={darkMode}
            onPlanUpdate={updateLearningPlan}
          />
        ) : viewMode === 'vocabulary' ? (
          <VocabularyBankView
            darkMode={darkMode}
            onClose={() => setViewMode('week')}
          />
        ) : viewMode === 'tracker' ? (
          <GermanLearningTracker />
        ) : (
          <WeekView 
            weekData={weekData}
            darkMode={darkMode}
            pomodoroState={pomodoroState}
            onTaskComplete={updateTaskCompletion}
            onTaskDurationChange={updateTaskDuration}
            onTaskNotesChange={updateTaskNotes}
            onVideoDataChange={updateVideoData}
            onStartPomodoro={startPomodoro}
            onStopPomodoro={stopPomodoro}
          />
        )}
      </main>
      
      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        darkMode={darkMode}
      />
    </div>
  );
}

export default App;
