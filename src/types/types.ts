export interface TaskData {
  id: string;
  name: string;
  emoji: string;
  duration: number; // in minutes
  completed: boolean;
  description?: string;
  resources?: Resource[];
  notes?: string;
  link?: string;
  pomodoroSessions?: number;
  timeSpent?: number;
  videoTitle?: string;
  videoLink?: string;
  vocabulary?: string;
  exampleSentences?: string;
  videoSummary?: string;
  grammarNotes?: string;
  tags?: string;
  professorNotes?: string;
  lessonNumber?: string;
  difficultyLevel?: string;
  radioStation?: string;
  topicsDiscussed?: string;
  germanSummary?: string;
  newWords?: string;
  dailyReflection?: string;
  vocabularyBank?: VocabularyEntry[];
}

export interface VocabularyEntry {
  id: string;
  word: string;
  translation: string;
  example: string;
  tags: string[];
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  dateAdded: string;
  source: string;
  category: string;
  pronunciation?: string;
  synonyms?: string[];
  antonyms?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  targetLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  startDate: string;
  targetDate: string;
  dailyGoalMinutes: number;
  preferences: {
    darkMode: boolean;
    notifications: boolean;
    language: 'en' | 'de' | 'ar';
  };
}

export interface ProgressSnapshot {
  id: string;
  userId: string;
  date: string;
  weekData: WeekData;
  dailyStats: DailyStats;
  achievements: Achievement[];
  goals: LearningGoals;
  notes: string;
  reflection: string;
  vocabularyAdded: VocabularyEntry[];
}

export interface MonthlyReport {
  userId: string;
  year: number;
  month: number;
  totalHours: number;
  totalDays: number;
  averageDaily: number;
  completionRate: number;
  topTasks: { taskId: string; completions: number }[];
  vocabularyLearned: number;
  achievements: Achievement[];
  reflection: string;
}

export interface YearlyReport {
  userId: string;
  year: number;
  totalHours: number;
  totalDays: number;
  monthlyBreakdown: MonthlyReport[];
  levelProgress: {
    startLevel: string;
    currentLevel: string;
    targetLevel: string;
  };
  achievements: Achievement[];
  vocabularyBank: VocabularyEntry[];
  reflection: string;
}

export interface Resource {
  name: string;
  url?: string;
  type: 'link' | 'note';
}

export interface DayData {
  tasks: TaskData[];
}

export interface WeekData {
  monday: DayData;
  tuesday: DayData;
  wednesday: DayData;
  thursday: DayData;
  friday: DayData;
  saturday: DayData;
  sunday: DayData;
}

export interface PomodoroState {
  isActive: boolean;
  timeLeft: number;
  isBreak: boolean;
  taskId: string;
  day: string;
}

export interface DailyStats {
  date: string;
  tasksCompleted: number;
  totalTasks: number;
  timeSpent: number; // in minutes
  pomodoroSessions: number;
  completionRate: number; // percentage
}

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  daysCompleted: number;
  totalTimeSpent: number;
  averageCompletion: number;
  streak: number;
}

export interface MonthlyStats {
  month: string;
  year: number;
  daysActive: number;
  totalHours: number;
  averageDailyTime: number;
  bestStreak: number;
  tasksCompleted: number;
}

export interface YearlyProgress {
  year: number;
  dailyStats: DailyStats[];
  weeklyStats: WeeklyStats[];
  monthlyStats: MonthlyStats[];
  totalHours: number;
  totalDays: number;
  longestStreak: number;
  currentStreak: number;
  level: number;
  experience: number;
}

export interface LearningGoals {
  dailyTimeGoal: number; // minutes
  weeklyGoal: number; // days
  monthlyGoal: number; // hours
  yearlyGoal: number; // hours
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  requirement: {
    type: 'streak' | 'hours' | 'days' | 'tasks' | 'level';
    value: number;
  };
}

export interface MonthlyPlan {
  month: string;
  level: string;
  description: string;
  grammar: GrammarTopic[];
  vocabulary: VocabularyTopic[];
  listening: ListeningGoal[];
  writing: WritingTask[];
  speaking: SpeakingGoal[];
}

export interface GrammarTopic {
  id: string;
  topic: string;
  completed: boolean;
}

export interface VocabularyTopic {
  id: string;
  topic: string;
  targetWords: number;
  learnedWords: number;
}

export interface ListeningGoal {
  id: string;
  goal: string;
  target: number;
  completed: number;
}

export interface WritingTask {
  id: string;
  task: string;
  frequency: string;
  completed: number;
  target: number;
}

export interface SpeakingGoal {
  id: string;
  goal: string;
  frequency: string;
  completed: number;
  target: number;
}

export interface LearningPlan {
  title: string;
  period: string;
  months: MonthlyPlan[];
  overallProgress: {
    grammarCompleted: number;
    grammarTotal: number;
    vocabularyLearned: number;
    vocabularyTarget: number;
    mockExamsDone: number;
    mockExamsTarget: number;
    speakingSessions: number;
    speakingTarget: number;
  };
}

export interface DailyProgress {
  date: string;
  videosWatched: VideoProgress[];
  notes: string;
  vocabulary: string;
  completedTasks: number;
  totalTime: number;
}

export interface VideoProgress {
  id: string;
  title: string;
  link?: string;
  vocabulary: string;
  exampleSentences: string;
  summary: string;
  grammarNotes: string;
  watchedAt: string;
}