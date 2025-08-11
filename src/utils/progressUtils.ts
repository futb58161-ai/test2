import { DailyStats, WeeklyStats, MonthlyStats, YearlyProgress, Achievement, LearningGoals, TaskData } from '../types/types';

export const calculateDailyStats = (tasks: TaskData[], date: string): DailyStats => {
  const completedTasks = tasks.filter(task => task.completed);
  const totalTimeSpent = completedTasks.reduce((sum, task) => sum + task.duration, 0);
  const totalPomodoroSessions = tasks.reduce((sum, task) => sum + (task.pomodoroSessions || 0), 0);
  
  return {
    date,
    tasksCompleted: completedTasks.length,
    totalTasks: tasks.length,
    timeSpent: totalTimeSpent,
    pomodoroSessions: totalPomodoroSessions,
    completionRate: tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0
  };
};

export const calculateWeeklyStats = (dailyStats: DailyStats[]): WeeklyStats => {
  if (dailyStats.length === 0) {
    return {
      weekStart: '',
      weekEnd: '',
      daysCompleted: 0,
      totalTimeSpent: 0,
      averageCompletion: 0,
      streak: 0
    };
  }

  const sortedStats = dailyStats.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const daysCompleted = dailyStats.filter(day => day.completionRate === 100).length;
  const totalTimeSpent = dailyStats.reduce((sum, day) => sum + day.timeSpent, 0);
  const averageCompletion = Math.round(dailyStats.reduce((sum, day) => sum + day.completionRate, 0) / dailyStats.length);

  return {
    weekStart: sortedStats[0].date,
    weekEnd: sortedStats[sortedStats.length - 1].date,
    daysCompleted,
    totalTimeSpent,
    averageCompletion,
    streak: calculateCurrentStreak(dailyStats)
  };
};

export const calculateMonthlyStats = (dailyStats: DailyStats[], month: string, year: number): MonthlyStats => {
  const monthStats = dailyStats.filter(day => {
    const date = new Date(day.date);
    return date.getMonth() === parseInt(month) - 1 && date.getFullYear() === year;
  });

  const daysActive = monthStats.filter(day => day.timeSpent > 0).length;
  const totalMinutes = monthStats.reduce((sum, day) => sum + day.timeSpent, 0);
  const totalHours = Math.round(totalMinutes / 60 * 10) / 10;
  const averageDailyTime = daysActive > 0 ? Math.round(totalMinutes / daysActive) : 0;
  const tasksCompleted = monthStats.reduce((sum, day) => sum + day.tasksCompleted, 0);

  return {
    month,
    year,
    daysActive,
    totalHours,
    averageDailyTime,
    bestStreak: calculateBestStreak(monthStats),
    tasksCompleted
  };
};

export const calculateCurrentStreak = (dailyStats: DailyStats[]): number => {
  const sortedStats = dailyStats
    .filter(day => day.completionRate === 100)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < sortedStats.length; i++) {
    const statDate = new Date(sortedStats[i].date);
    const daysDiff = Math.floor((today.getTime() - statDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === i) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

export const calculateBestStreak = (dailyStats: DailyStats[]): number => {
  const completedDays = dailyStats
    .filter(day => day.completionRate === 100)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let bestStreak = 0;
  let currentStreak = 0;
  let lastDate: Date | null = null;

  for (const day of completedDays) {
    const currentDate = new Date(day.date);
    
    if (lastDate) {
      const daysDiff = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff === 1) {
        currentStreak++;
      } else {
        bestStreak = Math.max(bestStreak, currentStreak);
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }
    
    lastDate = currentDate;
  }
  
  return Math.max(bestStreak, currentStreak);
};

export const calculateLevel = (totalHours: number): number => {
  // Level system: 10 hours = 1 level
  return Math.floor(totalHours / 10) + 1;
};

export const calculateExperience = (totalHours: number): number => {
  // Experience within current level (0-100%)
  const hoursInCurrentLevel = totalHours % 10;
  return Math.round((hoursInCurrentLevel / 10) * 100);
};

export const getDefaultAchievements = (): Achievement[] => [
  {
    id: 'first_day',
    name: 'Erster Tag',
    description: 'Vollende deinen ersten Lerntag',
    icon: '🎯',
    unlocked: false,
    requirement: { type: 'days', value: 1 }
  },
  {
    id: 'week_warrior',
    name: 'Wochen-Krieger',
    description: 'Vollende 7 Tage in Folge',
    icon: '🔥',
    unlocked: false,
    requirement: { type: 'streak', value: 7 }
  },
  {
    id: 'month_master',
    name: 'Monats-Meister',
    description: 'Vollende 30 Tage in Folge',
    icon: '👑',
    unlocked: false,
    requirement: { type: 'streak', value: 30 }
  },
  {
    id: 'hundred_hours',
    name: '100 Stunden',
    description: 'Erreiche 100 Stunden Lernzeit',
    icon: '⏰',
    unlocked: false,
    requirement: { type: 'hours', value: 100 }
  },
  {
    id: 'level_10',
    name: 'Level 10',
    description: 'Erreiche Level 10',
    icon: '⭐',
    unlocked: false,
    requirement: { type: 'level', value: 10 }
  },
  {
    id: 'task_master',
    name: 'Aufgaben-Meister',
    description: 'Vollende 1000 Aufgaben',
    icon: '📚',
    unlocked: false,
    requirement: { type: 'tasks', value: 1000 }
  }
];

export const checkAchievements = (
  achievements: Achievement[],
  stats: {
    totalHours: number;
    totalDays: number;
    currentStreak: number;
    level: number;
    totalTasks: number;
  }
): Achievement[] => {
  return achievements.map(achievement => {
    if (achievement.unlocked) return achievement;

    let shouldUnlock = false;
    
    switch (achievement.requirement.type) {
      case 'hours':
        shouldUnlock = stats.totalHours >= achievement.requirement.value;
        break;
      case 'days':
        shouldUnlock = stats.totalDays >= achievement.requirement.value;
        break;
      case 'streak':
        shouldUnlock = stats.currentStreak >= achievement.requirement.value;
        break;
      case 'level':
        shouldUnlock = stats.level >= achievement.requirement.value;
        break;
      case 'tasks':
        shouldUnlock = stats.totalTasks >= achievement.requirement.value;
        break;
    }

    if (shouldUnlock) {
      return {
        ...achievement,
        unlocked: true,
        unlockedDate: new Date().toISOString()
      };
    }

    return achievement;
  });
};

export const getDefaultGoals = (): LearningGoals => ({
  dailyTimeGoal: 240, // 4 hours
  weeklyGoal: 5, // 5 days per week
  monthlyGoal: 80, // 80 hours per month
  yearlyGoal: 1000 // 1000 hours per year
});

export const formatTimeSpent = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
};

export const getMonthName = (monthIndex: number): string => {
  const months = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];
  return months[monthIndex];
};

export const generateYearlyReport = (yearlyProgress: YearlyProgress): string => {
  const { year, totalHours, totalDays, longestStreak, level } = yearlyProgress;
  
  return `
📊 Jahresbericht ${year}

🎯 Gesamtstatistiken:
• Lernstunden: ${totalHours}h
• Aktive Tage: ${totalDays}
• Längste Serie: ${longestStreak} Tage
• Erreichte Stufe: Level ${level}

🏆 Leistung:
• Durchschnitt pro Tag: ${Math.round(totalHours / Math.max(totalDays, 1) * 10) / 10}h
• Wöchentliche Aktivität: ${Math.round(totalDays / 52 * 10) / 10} Tage
• Monatliche Stunden: ${Math.round(totalHours / 12 * 10) / 10}h

Herzlichen Glückwunsch zu deinem Fortschritt beim Deutschlernen! 🇩🇪
  `.trim();
};