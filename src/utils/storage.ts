import { WeekData, YearlyProgress, Achievement, LearningGoals, LearningPlan, UserProfile, ProgressSnapshot, MonthlyReport, YearlyReport } from '../types/types';

const STORAGE_KEYS = {
  DATA: 'germanTracker_data',
  SETTINGS: 'germanTracker_settings',
  USER_PROFILE: 'germanTracker_userProfile',
  PROGRESS_SNAPSHOTS: 'germanTracker_progressSnapshots',
  MONTHLY_REPORTS: 'germanTracker_monthlyReports',
  YEARLY_REPORTS: 'germanTracker_yearlyReports'
};

interface StoredData {
  weekData: WeekData;
  streak: number;
  yearlyProgress: YearlyProgress[];
  achievements: Achievement[];
  goals: LearningGoals;
  learningPlan: LearningPlan;
}

export const getStoredData = (): StoredData | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DATA);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading stored data:', error);
    return null;
  }
};

export const saveData = (data: StoredData): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

interface Settings {
  darkMode: boolean;
  viewMode: 'today' | 'week' | 'progress';
}

export const getStoredSettings = (): Settings | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading settings:', error);
    return null;
  }
};

export const saveSettings = (settings: Settings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export const exportYearlyData = (year: number): string => {
  try {
    const stored = getStoredData();
    if (!stored) return '';
    
    const yearData = stored.yearlyProgress.find(y => y.year === year);
    if (!yearData) return '';
    
    const data = {
      yearlyProgress: yearData,
      achievements: stored.achievements,
      goals: stored.goals,
      exportDate: new Date().toISOString(),
      year
    };
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error exporting data:', error);
    return '';
  }
};

export const importYearlyData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    const stored = getStoredData();
    if (!stored) return false;
    
    if (data.yearlyProgress) {
      // Update or add the yearly progress
      const existingIndex = stored.yearlyProgress.findIndex(y => y.year === data.year);
      if (existingIndex >= 0) {
        stored.yearlyProgress[existingIndex] = data.yearlyProgress;
      } else {
        stored.yearlyProgress.push(data.yearlyProgress);
      }
    }
    
    if (data.achievements) {
      stored.achievements = data.achievements;
    }
    
    if (data.goals) {
      stored.goals = data.goals;
    }
    
    saveData(stored);
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

export const clearAllData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.DATA);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

// User Profile Management
export const getUserProfile = (): UserProfile | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading user profile:', error);
    return null;
  }
};

export const saveUserProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving user profile:', error);
  }
};

// Progress Snapshots Management
export const getProgressSnapshots = (): ProgressSnapshot[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS_SNAPSHOTS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading progress snapshots:', error);
    return [];
  }
};

export const saveProgressSnapshot = (snapshot: ProgressSnapshot): void => {
  try {
    const snapshots = getProgressSnapshots();
    const existingIndex = snapshots.findIndex(s => s.date === snapshot.date && s.userId === snapshot.userId);
    
    if (existingIndex >= 0) {
      snapshots[existingIndex] = snapshot;
    } else {
      snapshots.push(snapshot);
    }
    
    // Keep only last 365 days
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const filtered = snapshots.filter(s => new Date(s.date) >= oneYearAgo);
    
    localStorage.setItem(STORAGE_KEYS.PROGRESS_SNAPSHOTS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error saving progress snapshot:', error);
  }
};

// Monthly Reports Management
export const getMonthlyReports = (): MonthlyReport[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.MONTHLY_REPORTS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading monthly reports:', error);
    return [];
  }
};

export const saveMonthlyReport = (report: MonthlyReport): void => {
  try {
    const reports = getMonthlyReports();
    const existingIndex = reports.findIndex(r => 
      r.year === report.year && r.month === report.month && r.userId === report.userId
    );
    
    if (existingIndex >= 0) {
      reports[existingIndex] = report;
    } else {
      reports.push(report);
    }
    
    localStorage.setItem(STORAGE_KEYS.MONTHLY_REPORTS, JSON.stringify(reports));
  } catch (error) {
    console.error('Error saving monthly report:', error);
  }
};

// Yearly Reports Management
export const getYearlyReports = (): YearlyReport[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.YEARLY_REPORTS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading yearly reports:', error);
    return [];
  }
};

export const saveYearlyReport = (report: YearlyReport): void => {
  try {
    const reports = getYearlyReports();
    const existingIndex = reports.findIndex(r => 
      r.year === report.year && r.userId === report.userId
    );
    
    if (existingIndex >= 0) {
      reports[existingIndex] = report;
    } else {
      reports.push(report);
    }
    
    localStorage.setItem(STORAGE_KEYS.YEARLY_REPORTS, JSON.stringify(reports));
  } catch (error) {
    console.error('Error saving yearly report:', error);
  }
};

// Export all user data
export const exportAllUserData = (userId: string): string => {
  try {
    const data = {
      userProfile: getUserProfile(),
      mainData: getStoredData(),
      progressSnapshots: getProgressSnapshots().filter(s => s.userId === userId),
      monthlyReports: getMonthlyReports().filter(r => r.userId === userId),
      yearlyReports: getYearlyReports().filter(r => r.userId === userId),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error exporting user data:', error);
    return '';
  }
};

// Import all user data
export const importAllUserData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.userProfile) {
      saveUserProfile(data.userProfile);
    }
    
    if (data.mainData) {
      saveData(data.mainData);
    }
    
    if (data.progressSnapshots) {
      data.progressSnapshots.forEach((snapshot: ProgressSnapshot) => {
        saveProgressSnapshot(snapshot);
      });
    }
    
    if (data.monthlyReports) {
      data.monthlyReports.forEach((report: MonthlyReport) => {
        saveMonthlyReport(report);
      });
    }
    
    if (data.yearlyReports) {
      data.yearlyReports.forEach((report: YearlyReport) => {
        saveYearlyReport(report);
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error importing user data:', error);
    return false;
  }
};